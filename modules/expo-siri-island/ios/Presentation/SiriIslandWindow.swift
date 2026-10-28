//
//  SiriIslandWindow.swift
//  Pods
//
//  Created by rit3zh CX on 10/29/26.
//

import UIKit

final class SiriIslandWindow: UIWindow {
    weak var overlay: SiriIslandOverlay?

    override func hitTest(_ point: CGPoint, with event: UIEvent?) -> UIView? {
        let slop = -SiriIslandMetrics.touchSlop
        guard let overlay, overlay.islandFrame.insetBy(dx: slop, dy: slop).contains(point) else {
            return nil
        }
        return super.hitTest(point, with: event)
    }
}
