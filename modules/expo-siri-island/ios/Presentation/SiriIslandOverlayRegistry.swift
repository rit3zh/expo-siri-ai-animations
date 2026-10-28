//
//  SiriIslandOverlayRegistry.swift
//  Pods
//
//  Created by rit3zh CX on 10/29/26.
//

enum SiriIslandOverlayRegistry {
    private final class WeakOverlay {
        weak var value: SiriIslandOverlay?
        init(_ value: SiriIslandOverlay) {
            self.value = value
        }
    }
    private static var attached: [WeakOverlay] = []

    static func activate(_ overlay: SiriIslandOverlay) {
        attached.removeAll { $0.value == nil || $0.value === overlay }
        for entry in attached {
            entry.value?.setVisible(false)
        }
        attached.append(WeakOverlay(overlay))
        overlay.setVisible(true)
    }

    static func deactivate(_ overlay: SiriIslandOverlay) {
        attached.removeAll { $0.value == nil || $0.value === overlay }
        attached.last?.value?.setVisible(true)
    }
}
