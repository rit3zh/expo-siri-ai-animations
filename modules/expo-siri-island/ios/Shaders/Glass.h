//
//  Glass.h
//  Pods
//
//  Created by rit3zh CX on 10/29/26.
//

#pragma once

#include "Types.h"

static inline float glassMirror(float ny) {
    float mirror = smoothstep(-1.0f, -0.02f, ny);
    return mirror * mirror * (3.0f - 2.0f * mirror);
}

static inline float glassDarkness(IslandFrame f, IslandShape s) {
    float fade = smoothstep(f.gradientStart, f.gradientEnd, 0.5f - 0.5f * s.ny);
    fade = fade * fade * (3.0f - 2.0f * fade);
    float darkness = mix(1.0f, f.gradientOpacity, fade);
    darkness = max(darkness, 0.30f * (1.0f - f.glassFx));
    return mix(1.0f, darkness, f.glass * f.gradientFx);
}

static inline float3 glassBackdrop(
    IslandFrame f,
    IslandShape s,
    constant IslandUniforms &u,
    texture2d<half> backdrop
) {
    if (f.glass * f.gradientFx <= 0.001f || u.hasBackdrop <= 0.5f) {
        return float3(0.0f);
    }
    constexpr sampler smp(address::clamp_to_edge, filter::linear);
    float2 canvas = float2(u.canvasW, u.backdropH);
    float bend = s.lens * f.glassFx;
    float2 sp = f.pos + s.dir * bend;
    float2 dsp = s.dir * bend * ((f.p.x * f.p.y) / (f.hs.x * f.hs.y) / 3.0f);

    float3 bg;
    bg.r = backdrop.sample(smp, (sp + dsp) / canvas).r;
    bg.g = backdrop.sample(smp, sp / canvas).g;
    bg.b = backdrop.sample(smp, (sp - dsp) / canvas).b;
    return mix(bg, bg * float3(0.94f, 0.96f, 1.0f) + float3(0.01f, 0.012f, 0.02f), 0.22f);
}

static inline float3 glassBody(IslandFrame f, IslandShape s, float3 backdrop, float darkness) {
    float3 col = mix(backdrop, f.gradientColor * f.glass, darkness);
    return col * mix(1.0f - 0.30f * f.glass * f.glassFx, 1.0f, smoothstep(0.0f, 6.0f, s.depth));
}

static inline float3 glassHighlights(IslandFrame f, IslandShape s, float3 waveGlow) {
    float sheen = f.glass * f.glassFx;
    float eq = smoothstep(-1.0f, -0.51f, s.ny) * (1.0f - smoothstep(-0.51f, -0.02f, s.ny));
    float horiz = 1.0f - fabs(f.p.x) / f.hs.x * 0.3f;
    float3 col = (float3(0.95f, 0.97f, 1.0f) * 0.11f * sheen + waveGlow * 0.9f) * eq * horiz;

    float shell = 1.0f - smoothstep(0.0f, 1.0f, fabs(s.depth - 0.9f));
    float shellLit = 0.30f + 0.70f * (1.0f - smoothstep(-0.9f, 0.3f, s.ny));
    col += (float3(0.20f, 0.21f, 0.23f) * sheen + waveGlow * 1.2f) * shell * shellLit;

    float bottomRim = (1.0f - smoothstep(0.7f, 4.5f, s.depth)) * smoothstep(0.2f, 0.9f, -s.ny);
    col += (float3(0.85f, 0.88f, 0.95f) * 0.10f * sheen + waveGlow * 0.9f) * bottomRim;
    return col;
}
