//
//  SiriIslandOverlay.swift
//  Pods
//
//  Created by rit3zh CX on 10/29/26.
//

import MetalKit
import SwiftUI
import UIKit

final class SiriIslandOverlay {
    var onPress: (() -> Void)?

    var controller: SiriIslandController? {
        didSet {
            oldValue?.overlay = nil
            controller?.overlay = self
            frameDidChange()
        }
    }

    var configuration = SiriIslandConfiguration() {
        didSet {
            configurationDidChange(from: oldValue)
        }
    }

    var contentView: ExpoSiriIslandContentView? {
        didSet {
            guard contentView !== oldValue else {
                return
            }
            if oldValue?.overlay === self {
                oldValue?.overlay = nil
            }
            contentView?.overlay = self
            installContentView()
        }
    }

    var islandFrame: CGRect {
        let frame = self.frame
        let width = window?.bounds.width ?? UIScreen.main.bounds.width
        return CGRect(
            x: (width - frame.width) / 2,
            y: islandTop + frame.offsetY,
            width: frame.width,
            height: frame.height)
    }

    private var frame: SiriIslandFrame {
        controller?.frame ?? SiriIslandFrame()
    }

    private var islandTop: CGFloat {
        SiriIslandMetrics.islandTop(safeAreaTop: hostWindow?.safeAreaInsets.top ?? 0)
    }

    private weak var hostWindow: UIWindow?
    private var window: SiriIslandWindow?
    private let viewController = SiriIslandViewController()
    private var metalView: MTKView?
    private var renderer: SiriIslandRenderer?
    private let contentClip = UIView()
    private let contentAnchor = UIView()
    private let labelModel = SiriIslandLabelModel()
    private lazy var labelHost = UIHostingController(rootView: SiriIslandLabel(model: labelModel))
    private var dotsStartTime: Float?
    private var effects = SiriIslandEffects()
    private var lastUniformsTime: Float?
    private var backdropHeight: CGFloat = 0
    private let haptics = UIImpactFeedbackGenerator(style: .soft)
    private let tapGate = SiriIslandTapGate()

    deinit {
        window?.isHidden = true
    }

    func attach(to host: UIWindow) {
        guard window == nil, let scene = host.windowScene else {
            return
        }
        hostWindow = host
        viewController.hostWindow = host

        let window = SiriIslandWindow(windowScene: scene)
        window.overlay = self
        window.windowLevel = .statusBar + 1
        window.backgroundColor = .clear
        window.frame = host.bounds
        window.rootViewController = viewController
        self.window = window

        if metalView == nil {
            buildViews()
        }
        SiriIslandOverlayRegistry.activate(self)
    }

    func detach() {
        metalView?.isPaused = true
        window?.isHidden = true
        window = nil
        SiriIslandOverlayRegistry.deactivate(self)
    }

    func setVisible(_ visible: Bool) {
        guard let window else {
            return
        }
        window.isHidden = !visible
        if visible {
            frameDidChange()
        } else {
            metalView?.isPaused = true
        }
    }

    func frameDidChange() {
        guard let window, !window.isHidden else {
            return
        }
        let frame = self.frame

        if frame.spinner > 0.001 {
            if dotsStartTime == nil {
                dotsStartTime = renderer?.currentTime
            }
        } else {
            dotsStartTime = nil
        }

        layoutContent(frame)
        resizeCanvas()
        renderer?.wake()
    }

    func contentLayoutDidChange() {
        guard let window, !window.isHidden else {
            return
        }
        layoutContent(frame)
    }

    private func buildViews() {
        let root = viewController.view!
        root.backgroundColor = .clear

        let metalView = MTKView(
            frame: CGRect(x: 0, y: 0, width: root.bounds.width, height: canvasHeight),
            device: MTLCreateSystemDefaultDevice())
        metalView.autoresizingMask = [.flexibleWidth]
        metalView.isOpaque = false
        metalView.backgroundColor = .clear
        metalView.layer.isOpaque = false
        metalView.colorPixelFormat = .bgra8Unorm
        metalView.clearColor = MTLClearColor(red: 0, green: 0, blue: 0, alpha: 0)
        metalView.framebufferOnly = true
        metalView.enableSetNeedsDisplay = false
        metalView.preferredFramesPerSecond = 120
        metalView.isUserInteractionEnabled = false
        root.addSubview(metalView)
        self.metalView = metalView

        if let renderer = SiriIslandRenderer(view: metalView) {
            renderer.uniformsProvider = { [weak self] time, scale in
                self?.uniforms(scale: scale, time: time) ?? SiriIslandUniforms()
            }
            metalView.delegate = renderer
            self.renderer = renderer
        }

        contentClip.clipsToBounds = true
        contentClip.layer.cornerCurve = .continuous
        root.addSubview(contentClip)

        contentClip.addSubview(contentAnchor)

        viewController.addChild(labelHost)
        labelHost.safeAreaRegions = []
        labelHost.view.backgroundColor = .clear
        labelHost.view.isUserInteractionEnabled = false
        labelHost.view.frame = CGRect(origin: .zero, size: SiriIslandMetrics.labelSize)
        contentAnchor.addSubview(labelHost.view)
        labelHost.didMove(toParent: viewController)

        installContentView()

        tapGate.ignores = { [weak self] touch in
            guard let self, self.configuration.hasContent,
                  let contentView = self.contentView, let view = touch.view else {
                return false
            }
            return view !== contentView && view.isDescendant(of: contentView)
        }
        let tap = UITapGestureRecognizer(target: self, action: #selector(handleTap))
        tap.delegate = tapGate
        root.addGestureRecognizer(tap)
    }

    @objc private func handleTap() {
        onPress?()
    }

    private func installContentView() {
        guard metalView != nil else {
            return
        }
        labelHost.view.isHidden = configuration.hasContent
        contentView?.isHidden = !configuration.hasContent
        if let contentView, contentView.superview !== contentAnchor {
            contentAnchor.addSubview(contentView)
            contentView.enableTouches()
        }
        layoutContent(frame)
    }

    private func configurationDidChange(from old: SiriIslandConfiguration) {
        if labelModel.text != configuration.label {
            labelModel.text = configuration.label
        }
        if labelModel.shimmer != configuration.shimmer {
            labelModel.shimmer = configuration.shimmer
        }
        viewController.statusBarHidden = configuration.hidesStatusBar

        if configuration.hasContent != old.hasContent {
            installContentView()
        }

        resizeCanvas()
        renderer?.wake()

        if configuration.phase != old.phase && old.phase == .idle {
            captureBackdrop()
            if configuration.phase == .listening {
                haptics.impactOccurred(intensity: 0.8)
            }
        }
    }

    /// Full height while Siri is on screen so growing never reallocates the drawable
    /// mid-animation; trimmed back to the island once it has settled at rest.
    private var canvasHeight: CGFloat {
        let fullHeight = window?.bounds.height ?? UIScreen.main.bounds.height
        if configuration.phase != .idle || frame.glass > 0.001 {
            return fullHeight
        }
        let step = SiriIslandMetrics.canvasStep
        let needed = ceil((islandFrame.maxY + SiriIslandMetrics.canvasBleed) / step) * step
        return min(needed, fullHeight)
    }

    private func resizeCanvas() {
        guard let metalView else {
            return
        }
        let height = canvasHeight
        if metalView.frame.height != height {
            metalView.frame.size.height = height
        }
    }

    private func layoutContent(_ frame: SiriIslandFrame) {
        let rect = islandFrame
        contentClip.frame = rect
        let fullRadius = min(rect.width, rect.height) / 2
        let orb = max(0, min(1, frame.orb))
        let cappedRadius = min(fullRadius, SiriIslandMetrics.maxCornerRadius)
        contentClip.layer.cornerRadius = cappedRadius + (fullRadius - cappedRadius) * orb
        contentClip.alpha = max(0, min(1, frame.content))

        let height = rect.height
        if configuration.hasContent {
            let size = contentView?.bounds.size ?? .zero
            contentAnchor.frame = CGRect(
                origin: CGPoint(x: (rect.width - size.width) / 2, y: (height - size.height) / 2),
                size: size)
            return
        }
        let spinner = max(0, min(1, frame.spinner))
        let inset = height * (0.44 + 0.74 * spinner)
        let size = SiriIslandMetrics.labelSize
        contentAnchor.frame = CGRect(
            origin: CGPoint(x: inset, y: height * 0.52 - size.height / 2),
            size: size)
    }

    private func uniforms(scale: CGFloat, time: Float) -> SiriIslandUniforms {
        let frame = self.frame
        let rect = islandFrame
        let size = metalView?.bounds.size ?? .zero
        var uniforms = SiriIslandUniforms()
        uniforms.canvasW = Float(size.width)
        uniforms.canvasH = Float(size.height)
        uniforms.scale = Float(scale)
        uniforms.time = time
        uniforms.centerX = Float(rect.midX)
        uniforms.centerY = Float(rect.midY)
        uniforms.halfW = Float(rect.width / 2)
        uniforms.halfH = Float(rect.height / 2)
        uniforms.orb = Float(frame.orb)
        uniforms.glass = Float(frame.glass)
        uniforms.wave = Float(frame.wave)
        uniforms.glow = Float(frame.glow)
        uniforms.spinner = Float(frame.spinner)
        uniforms.dotsTime = time - (dotsStartTime ?? time)
        uniforms.hasBackdrop = renderer?.hasBackdrop == true ? 1 : 0
        uniforms.islandTop = Float(islandTop)
        uniforms.hardwareW = Float(SiriIslandMetrics.hardwareSize.width)
        uniforms.hardwareH = Float(SiriIslandMetrics.hardwareSize.height)

        let elapsed = time - (lastUniformsTime ?? time)
        let ease: Float = lastUniformsTime == nil || elapsed > 0.1 ? 1 : min(1, elapsed * 8)
        lastUniformsTime = time
        effects.ease(toward: SiriIslandEffects(configuration), by: ease)
        uniforms.glassEffect = effects.glass
        uniforms.gradientEffect = effects.gradient
        uniforms.gradientStart = effects.gradientStart
        uniforms.gradientEnd = effects.gradientEnd
        uniforms.gradientOpacity = effects.gradientOpacity
        uniforms.gradientR = effects.gradientColor.x
        uniforms.gradientG = effects.gradientColor.y
        uniforms.gradientB = effects.gradientColor.z
        uniforms.backdropH = Float(backdropHeight)
        return uniforms
    }

    private func captureBackdrop() {
        guard let hostWindow, let window else {
            return
        }
        let format = UIGraphicsImageRendererFormat()
        format.scale = 1
        format.opaque = true
        format.preferredRange = .standard
        // Captured at full height so the glass lines up however tall the canvas grows.
        let canvas = window.bounds
        let image = UIGraphicsImageRenderer(bounds: canvas, format: format).image { _ in
            hostWindow.drawHierarchy(in: hostWindow.bounds, afterScreenUpdates: false)
        }
        backdropHeight = canvas.height
        renderer?.setBackdrop(image)
    }
}
