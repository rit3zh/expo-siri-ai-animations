//
//  ExpoSiriIslandContentView.swift
//  Pods
//
//  Created by rit3zh CX on 10/29/26.
//

import ExpoModulesCore
import UIKit

public final class ExpoSiriIslandContentView: ExpoView {
    weak var overlay: SiriIslandOverlay?
    private var touchHandler: UIGestureRecognizer?

    public required init(appContext: AppContext? = nil) {
        super.init(appContext: appContext)
    }

    func enableTouches() {
        guard touchHandler == nil else {
            return
        }
        touchHandler = SiriIslandTouchHandler.attach(to: self)
    }

    public override func layoutSubviews() {
        super.layoutSubviews()
        overlay?.contentLayoutDidChange()
    }
}
