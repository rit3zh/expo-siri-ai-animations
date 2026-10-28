//
//  SiriIslandShimmerText.swift
//  Pods
//
//  Created by rit3zh CX on 10/29/26.
//

import SwiftUI

struct SiriIslandShimmerText: View {
    let text: String
    let shimmer: Bool

    private var label: some View {
        Text(text)
            .font(.system(size: 19, weight: .medium, design: .rounded))
            .lineLimit(1)
            .fixedSize()
    }

    var body: some View {
        if shimmer {
            TimelineView(.animation) { context in
                let time = context.date.timeIntervalSinceReferenceDate
                let sweep = CGFloat((time * 0.62).truncatingRemainder(dividingBy: 1.0))
                let breathe = 0.52 + 0.12 * sin(time * 2.4)
                label
                    .foregroundColor(.white.opacity(breathe))
                    .overlay(
                        label
                            .foregroundColor(.white)
                            .mask(
                                GeometryReader { proxy in
                                    LinearGradient(
                                        colors: [.clear, .white, .clear],
                                        startPoint: .leading,
                                        endPoint: .trailing
                                    )
                                    .frame(width: proxy.size.width * 0.55)
                                    .offset(x: (sweep * 1.9 - 0.55) * proxy.size.width)
                                }
                            )
                    )
            }
        } else {
            label.foregroundColor(.white)
        }
    }
}
