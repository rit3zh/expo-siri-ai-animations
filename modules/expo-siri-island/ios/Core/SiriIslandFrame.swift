//
//  SiriIslandFrame.swift
//  Pods
//
//  Created by rit3zh CX on 10/29/26.
//

import CoreGraphics

struct SiriIslandFrame {
    static let channelCount = 9

    var width: CGFloat = SiriIslandMetrics.hardwareSize.width
    var height: CGFloat = SiriIslandMetrics.hardwareSize.height
    var offsetY: CGFloat = 0
    var orb: CGFloat = 0
    var glass: CGFloat = 0
    var wave: CGFloat = 0
    var spinner: CGFloat = 0
    var glow: CGFloat = 0
    var content: CGFloat = 0

    init() {}

    init?(_ values: [Double]) {
        guard values.count >= Self.channelCount else {
            return nil
        }
        width = values[0]
        height = values[1]
        offsetY = values[2]
        orb = values[3]
        glass = values[4]
        wave = values[5]
        spinner = values[6]
        glow = values[7]
        content = values[8]
    }
}
