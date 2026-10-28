//
//  SiriIslandLabel.swift
//  Pods
//
//  Created by rit3zh CX on 10/29/26.
//

import SwiftUI

struct SiriIslandLabel: View {
    @ObservedObject var model: SiriIslandLabelModel

    var body: some View {
        ZStack(alignment: .leading) {
            if !model.text.isEmpty {
                SiriIslandShimmerText(text: model.text, shimmer: model.shimmer)
                    .id(model.text)
                    .transition(.siriIslandBlur)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
        .animation(.spring(response: 0.55, dampingFraction: 0.9), value: model.text)
    }
}
