//
//  AnyTransition+SiriIslandBlur.swift
//  Pods
//
//  Created by rit3zh CX on 10/29/26.
//

import SwiftUI

extension AnyTransition {
    static var siriIslandBlur: AnyTransition {
        .modifier(
            active: SiriIslandBlurModifier(active: true),
            identity: SiriIslandBlurModifier(active: false))
    }
}
