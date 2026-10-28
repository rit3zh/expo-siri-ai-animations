//
//  SiriIslandMetrics.swift
//  Pods
//
//  Created by rit3zh CX on 10/29/26.
//

import UIKit

enum SiriIslandMetrics {
    static let hardwareSize = SiriIslandHardware.islandSize
    static let canvasBleed: CGFloat = 32
    static let canvasStep: CGFloat = 48
    static let maxCornerRadius: CGFloat = 40
    static let touchSlop: CGFloat = 8
    static let labelSize = CGSize(width: 360, height: 44)

    static func islandTop(safeAreaTop: CGFloat) -> CGFloat {
        safeAreaTop >= 51 ? max(11, safeAreaTop - 48) : 11
    }
}
