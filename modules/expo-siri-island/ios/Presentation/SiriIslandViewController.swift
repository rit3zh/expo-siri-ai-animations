//
//  SiriIslandViewController.swift
//  Pods
//
//  Created by rit3zh CX on 10/29/26.
//

import UIKit

final class SiriIslandViewController: UIViewController {
    weak var hostWindow: UIWindow?

    var statusBarHidden = false {
        didSet {
            guard statusBarHidden != oldValue else {
                return
            }
            UIView.animate(withDuration: 0.3) {
                self.setNeedsStatusBarAppearanceUpdate()
            }
        }
    }

    override var prefersStatusBarHidden: Bool {
        statusBarHidden || hostController(\.childForStatusBarHidden)?.prefersStatusBarHidden == true
    }

    override var preferredStatusBarUpdateAnimation: UIStatusBarAnimation {
        .fade
    }

    override var preferredStatusBarStyle: UIStatusBarStyle {
        hostController(\.childForStatusBarStyle)?.preferredStatusBarStyle ?? .default
    }

    private func hostController(_ child: KeyPath<UIViewController, UIViewController?>) -> UIViewController? {
        var controller = hostWindow?.rootViewController
        while let next = controller?[keyPath: child] {
            controller = next
        }
        return controller
    }
}
