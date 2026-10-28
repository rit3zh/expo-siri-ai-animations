//
//  SiriIslandPhase.swift
//  Pods
//
//  Created by rit3zh CX on 10/29/26.
//

enum SiriIslandPhase: String {
    case idle
    case listening
    case thinking
    case searching
    case reasoning
    case answer

    init(_ value: String?) {
        self = value.flatMap(SiriIslandPhase.init(rawValue:)) ?? .idle
    }
}
