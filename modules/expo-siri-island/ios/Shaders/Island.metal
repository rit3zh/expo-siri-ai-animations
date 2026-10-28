//
//  Island.metal
//  Pods
//
//  Created by rit3zh CX on 10/29/26.
//

#include "Types.h"
#include "Shape.h"
#include "Glass.h"
#include "Waves.h"
#include "Dots.h"
#include "Glow.h"
#include "Shadow.h"

vertex VOut islandVertex(uint vid [[vertex_id]]) {
    const float2 positions[3] = { float2(-1.0, -1.0), float2(3.0, -1.0), float2(-1.0, 3.0) };
    VOut out;
    out.position = float4(positions[vid], 0.0, 1.0);
    return out;
}

fragment half4 islandFragment(
    VOut in [[stage_in]],
    constant IslandUniforms &u [[buffer(0)]],
    texture2d<half> backdrop [[texture(0)]]
) {
    IslandFrame f = islandFrame(in.position.xy, u);
    if (isOutsideIsland(f)) {
        return half4(0.0h);
    }
    IslandShape s = islandShape(f);

    float3 col = float3(0.0f);
    if (s.cover > 0.0f) {
        float mirror = glassMirror(s.ny);
        WaveLayer wave = waveLayer(f, s, mirror);
        float darkness = glassDarkness(f, s);
        col = glassBody(f, s, glassBackdrop(f, s, u, backdrop), darkness);
        col += wave.color + glassHighlights(f, s, wave.glow) + spinnerDots(f, u.dotsTime);
    }
    col *= 1.0f - topMask(f, s, u);

    EdgeGlow glow = edgeGlow(f, s);
    col += glow.inner;
    float outsideA = max(glow.alpha, contactShadow(f, s));

    float alpha = s.cover + (1.0f - s.cover) * outsideA;
    float3 premult = col * s.cover + glow.outer * outsideA * (1.0f - s.cover);
    return half4(half3(premult), half(alpha));
}
