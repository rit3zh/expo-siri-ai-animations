//
//  SiriIslandConfiguration.swift
//  Pods
//
//  Created by rit3zh CX on 10/29/26.
//

import UIKit

struct SiriIslandConfiguration {
    var label = ""
    var shimmer = false
    var hidesStatusBar = false
    var hasContent = false
    var glassEffect = true
    var gradientEffect = true
    var gradientStart = 0.5
    var gradientEnd = 1.0
    var gradientOpacity = 0.0
    var gradientColor = UIColor.black
    var phase: SiriIslandPhase = .idle
}
