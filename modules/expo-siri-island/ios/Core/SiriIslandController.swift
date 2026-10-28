//
//  SiriIslandController.swift
//  Pods
//
//  Created by rit3zh CX on 10/29/26.
//

import ExpoModulesCore

public final class SiriIslandController: SharedObject {
    private(set) var frame = SiriIslandFrame()
    weak var overlay: SiriIslandOverlay?

    func update(_ values: [Double]) {
        guard let next = SiriIslandFrame(values) else {
            return
        }
        if Thread.isMainThread {
            apply(next)
        } else {
            DispatchQueue.main.async { [weak self] in
                self?.apply(next)
            }
        }
    }

    private func apply(_ next: SiriIslandFrame) {
        frame = next
        overlay?.frameDidChange()
    }
}
