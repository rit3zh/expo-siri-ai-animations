//
//  SiriIslandTouchHandler.swift
//  Pods
//
//  Created by rit3zh CX on 10/29/26.
//

import UIKit

/// React Native only delivers touches to views under a surface's touch handler.
/// Island content lives in its own window, so it gets a handler of its own.
/// Looked up by name so this module needs no React Native headers.
enum SiriIslandTouchHandler {
    static func attach(to view: UIView) -> UIGestureRecognizer? {
        guard let type = NSClassFromString("RCTSurfaceTouchHandler") as? NSObject.Type,
              let handler = type.init() as? UIGestureRecognizer else {
            return nil
        }
        handler.perform(NSSelectorFromString("attachToView:"), with: view)
        return handler
    }
}

/// Keeps the island tap from claiming touches that belong to React content,
/// since React's handler waits for outside recognizers to fail first.
final class SiriIslandTapGate: NSObject, UIGestureRecognizerDelegate {
    var ignores: ((UITouch) -> Bool)?

    func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldReceive touch: UITouch) -> Bool {
        !(ignores?(touch) ?? false)
    }
}
