//
//  SiriIslandBlurModifier.swift
//  Pods
//
//  Created by rit3zh CX on 10/29/26.
//

import SwiftUI

struct SiriIslandBlurModifier: ViewModifier {
    let active: Bool

    func body(content: Content) -> some View {
        content
            .blur(radius: active ? 7 : 0)
            .opacity(active ? 0 : 1)
            .scaleEffect(active ? 0.96 : 1, anchor: .leading)
    }
}
