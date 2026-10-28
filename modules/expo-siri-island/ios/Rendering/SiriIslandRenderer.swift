//
//  SiriIslandRenderer.swift
//  Pods
//
//  Created by rit3zh CX on 10/29/26.
//

import MetalKit
import UIKit

final class SiriIslandRenderer: NSObject, MTKViewDelegate {
    let device: MTLDevice
    var uniformsProvider: ((_ time: Float, _ scale: CGFloat) -> SiriIslandUniforms)?

    var hasBackdrop: Bool {
        backdrop != nil
    }

    var currentTime: Float {
        Float(CACurrentMediaTime() - startTime)
    }

    private let queue: MTLCommandQueue
    private let pipeline: MTLRenderPipelineState
    private let placeholder: MTLTexture
    private var backdrop: MTLTexture?
    private let startTime = CACurrentMediaTime()
    private var lastActivity = CACurrentMediaTime()
    private weak var view: MTKView?

    init?(view: MTKView) {
        guard
            let device = view.device ?? MTLCreateSystemDefaultDevice(),
            let queue = device.makeCommandQueue(),
            let library = SiriIslandShaderLibrary.load(device: device),
            let vertex = library.makeFunction(name: SiriIslandShaderLibrary.vertexFunction),
            let fragment = library.makeFunction(name: SiriIslandShaderLibrary.fragmentFunction)
        else {
            return nil
        }

        let descriptor = MTLRenderPipelineDescriptor()
        descriptor.vertexFunction = vertex
        descriptor.fragmentFunction = fragment
        descriptor.colorAttachments[0].pixelFormat = view.colorPixelFormat

        guard let pipeline = try? device.makeRenderPipelineState(descriptor: descriptor) else {
            return nil
        }

        let placeholderDescriptor = MTLTextureDescriptor.texture2DDescriptor(
            pixelFormat: .bgra8Unorm, width: 1, height: 1, mipmapped: false)
        guard let placeholder = device.makeTexture(descriptor: placeholderDescriptor) else {
            return nil
        }

        self.device = device
        self.queue = queue
        self.pipeline = pipeline
        self.placeholder = placeholder
        self.view = view
        super.init()
    }

    func setBackdrop(_ image: UIImage?) {
        guard let cgImage = image?.cgImage else {
            backdrop = nil
            return
        }
        let loader = MTKTextureLoader(device: device)
        do {
            backdrop = try loader.newTexture(
                cgImage: cgImage,
                options: [
                    .SRGB: false,
                    .textureUsage: NSNumber(value: MTLTextureUsage.shaderRead.rawValue),
                ])
        } catch {
            backdrop = nil
            NSLog("[ExpoSiriIsland] Failed to load backdrop texture: \(error)")
        }
    }

    func wake() {
        lastActivity = CACurrentMediaTime()
        view?.isPaused = false
    }

    func mtkView(_ view: MTKView, drawableSizeWillChange size: CGSize) {}

    func draw(in view: MTKView) {
        guard
            let uniformsProvider,
            let pass = view.currentRenderPassDescriptor,
            let drawable = view.currentDrawable,
            let commandBuffer = queue.makeCommandBuffer(),
            let encoder = commandBuffer.makeRenderCommandEncoder(descriptor: pass)
        else {
            return
        }

        var uniforms = uniformsProvider(currentTime, view.contentScaleFactor)
        encoder.setRenderPipelineState(pipeline)
        encoder.setFragmentBytes(&uniforms, length: MemoryLayout<SiriIslandUniforms>.stride, index: 0)
        encoder.setFragmentTexture(backdrop ?? placeholder, index: 0)
        encoder.drawPrimitives(type: .triangle, vertexStart: 0, vertexCount: 3)
        encoder.endEncoding()
        commandBuffer.present(drawable)
        commandBuffer.commit()

        if isResting(uniforms) && CACurrentMediaTime() - lastActivity > 0.5 {
            view.isPaused = true
        }
    }

    private func isResting(_ uniforms: SiriIslandUniforms) -> Bool {
        uniforms.orb < 0.001 && uniforms.glass < 0.001 && uniforms.wave < 0.001
            && uniforms.glow < 0.001 && uniforms.spinner < 0.001
    }
}
