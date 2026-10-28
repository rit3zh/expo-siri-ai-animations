//
//  SiriIslandShaderLibrary.swift
//  Pods
//
//  Created by rit3zh CX on 10/29/26.
//

import Metal

enum SiriIslandShaderLibrary {
    static let bundleName = "ExpoSiriIslandShaders"
    static let vertexFunction = "islandVertex"
    static let fragmentFunction = "islandFragment"

    private static var cached: MTLLibrary?

    static func load(device: MTLDevice) -> MTLLibrary? {
        if let cached {
            return cached
        }
        for root in [Bundle.main, Bundle(for: SiriIslandRenderer.self)] {
            guard
                let url = root.url(forResource: bundleName, withExtension: "bundle"),
                let bundle = Bundle(url: url),
                let library = try? device.makeDefaultLibrary(bundle: bundle)
            else {
                continue
            }
            cached = library
            return library
        }
        NSLog("[ExpoSiriIsland] \(bundleName) shader library not found")
        return nil
    }
}
