//
//  SiriIslandEffects.swift
//  Pods
//
//  Created by rit3zh CX on 10/29/26.
//

import UIKit

struct SiriIslandEffects {
    var glass: Float = 1
    var gradient: Float = 1
    var gradientStart: Float = 0.5
    var gradientEnd: Float = 1
    var gradientOpacity: Float = 0
    var gradientColor = SIMD3<Float>(0, 0, 0)

    init() {}

    init(_ configuration: SiriIslandConfiguration) {
        glass = configuration.glassEffect ? 1 : 0
        gradient = configuration.gradientEffect ? 1 : 0
        gradientStart = Float(min(max(configuration.gradientStart, 0), 1))
        gradientEnd = Float(min(max(configuration.gradientEnd, 0), 1))
        gradientOpacity = Float(min(max(configuration.gradientOpacity, 0), 1))
        gradientColor = Self.components(configuration.gradientColor)
    }

    mutating func ease(toward target: SiriIslandEffects, by amount: Float) {
        glass += (target.glass - glass) * amount
        gradient += (target.gradient - gradient) * amount
        gradientStart += (target.gradientStart - gradientStart) * amount
        gradientEnd += (target.gradientEnd - gradientEnd) * amount
        gradientOpacity += (target.gradientOpacity - gradientOpacity) * amount
        gradientColor += (target.gradientColor - gradientColor) * amount
    }

    private static func components(_ color: UIColor) -> SIMD3<Float> {
        var r: CGFloat = 0
        var g: CGFloat = 0
        var b: CGFloat = 0
        var a: CGFloat = 0
        guard color.getRed(&r, green: &g, blue: &b, alpha: &a) else {
            return SIMD3<Float>(0, 0, 0)
        }
        return SIMD3<Float>(Float(r * a), Float(g * a), Float(b * a))
    }
}
