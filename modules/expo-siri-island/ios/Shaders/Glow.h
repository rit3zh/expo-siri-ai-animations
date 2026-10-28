//
//  Glow.h
//  Pods
//
//  Created by rit3zh CX on 10/29/26.
//

#pragma once

#include "Types.h"

struct EdgeGlow {
    float3 inner;
    float3 outer;
    float  alpha;
};

static inline float glowLobe(float x, float center, float width) {
    return exp(-pow((x - center) / width, 2.0f));
}

static inline EdgeGlow edgeGlow(IslandFrame f, IslandShape s) {
    EdgeGlow glow = { float3(0.0f), float3(0.0f), 0.0f };
    if (f.glow <= 0.001f) {
        return glow;
    }
    float x = f.p.x / f.hs.x;
    float t = f.t;
    float3 light = float3(0.70f, 0.42f, 1.00f) * 0.10f;
    light += float3(1.00f, 0.50f, 0.16f) * glowLobe(x, 0.55f * sin(t * 0.45f), 0.40f);
    light += float3(0.22f, 0.60f, 1.00f) * glowLobe(x, 0.60f * sin(t * 0.33f + 2.1f), 0.45f);
    light += float3(1.00f, 0.95f, 0.90f) * 0.85f * glowLobe(x, 0.50f * sin(t * 0.52f + 4.2f), 0.30f);

    float bottom = smoothstep(-0.2f, 1.0f, -s.ny);
    float rim = exp(-s.depth / 1.8f);
    float bloom = exp(-s.depth / 11.0f);
    float halo = exp(-max(s.d, 0.0f) / 5.0f) * bottom * f.glow;

    glow.inner = light * (rim * 1.1f + bloom * 0.6f) * bottom * f.glow;
    glow.outer = light;
    glow.alpha = saturate(halo * 0.45f * max(max(light.r, light.g), light.b));
    return glow;
}
