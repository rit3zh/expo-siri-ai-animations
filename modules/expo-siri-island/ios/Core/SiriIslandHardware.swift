//
//  SiriIslandHardware.swift
//  Pods
//
//  Created by rit3zh CX on 10/29/26.
//

import CoreGraphics
import Foundation

enum SiriIslandHardware {
    static let fallbackSize = CGSize(width: 125.33, height: 36.67)

    static let dynamicIslandInitialSizes: [String: CGSize] = [
        "iPhone 14 Pro Max": CGSize(width: 125.33, height: 36.67),
        "iPhone 14 Pro": CGSize(width: 125.00, height: 36.67),

        "iPhone 15 Pro Max": CGSize(width: 125.33, height: 36.67),
        "iPhone 15 Pro": CGSize(width: 125.33, height: 36.67),
        "iPhone 15 Plus": CGSize(width: 125.33, height: 36.67),
        "iPhone 15": CGSize(width: 125.33, height: 36.67),

        "iPhone 16 Pro Max": CGSize(width: 125.33, height: 36.67),
        "iPhone 16 Pro": CGSize(width: 125.33, height: 36.67),
        "iPhone 16 Plus": CGSize(width: 125.33, height: 36.67),
        "iPhone 16": CGSize(width: 125.33, height: 36.67),

        "iPhone 17 Pro Max": CGSize(width: 125.33, height: 36.67),
        "iPhone 17 Pro": CGSize(width: 125.33, height: 36.67),
        "iPhone 17": CGSize(width: 125.33, height: 36.67),
        "iPhone Air": CGSize(width: 125.33, height: 36.67),

        "iPhone 18 Pro Max": CGSize(width: 94.67, height: 36.67),
        "iPhone 18 Pro": CGSize(width: 94.67, height: 36.67),
    ]

    private static let modelNames: [String: String] = [
        "iPhone15,2": "iPhone 14 Pro",
        "iPhone15,3": "iPhone 14 Pro Max",
        "iPhone15,4": "iPhone 15",
        "iPhone15,5": "iPhone 15 Plus",
        "iPhone16,1": "iPhone 15 Pro",
        "iPhone16,2": "iPhone 15 Pro Max",
        "iPhone17,1": "iPhone 16 Pro",
        "iPhone17,2": "iPhone 16 Pro Max",
        "iPhone17,3": "iPhone 16",
        "iPhone17,4": "iPhone 16 Plus",
        "iPhone18,1": "iPhone 17 Pro",
        "iPhone18,2": "iPhone 17 Pro Max",
        "iPhone18,3": "iPhone 17",
        "iPhone18,4": "iPhone Air",
        "iPhone19,2": "iPhone 18 Pro",
        "iPhone19,3": "iPhone 18 Pro Max",
        "iPhone19,7": "iPhone 18 Pro Max",
    ]

    static let modelIdentifier: String = {
        if let simulated = ProcessInfo.processInfo.environment["SIMULATOR_MODEL_IDENTIFIER"] {
            return simulated
        }
        var systemInfo = utsname()
        uname(&systemInfo)
        return withUnsafeBytes(of: &systemInfo.machine) { buffer in
            String(decoding: buffer.prefix { $0 != 0 }, as: UTF8.self)
        }
    }()

    static let modelName: String? = modelNames[modelIdentifier]

    static let islandSize: CGSize = modelName.flatMap { dynamicIslandInitialSizes[$0] } ?? fallbackSize
}
