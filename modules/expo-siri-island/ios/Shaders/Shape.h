//
//  Shape.h
//  Pods
//
//  Created by rit3zh CX on 10/29/26.
//

#pragma once

#include "Types.h"

static inline float sdRoundedBox(float2 p, float2 b, float r) {
    float2 q = fabs(p) - b + r;
    return min(max(q.x, q.y), 0.0f) + length(max(q, 0.0f)) - r;
}

constant float MAX_CORNER_RADIUS = 40.0f;

static inline float sdCapsule(float2 p, float2 hs, float r, thread float2 &normal) {
    float2 q = fabs(p) - hs + r;
    float2 s = float2(p.x < 0.0f ? -1.0f : 1.0f, p.y < 0.0f ? -1.0f : 1.0f);
    if (q.x > 0.0f && q.y > 0.0f) {
        normal = s * normalize(q);
    } else {
        normal = q.x > q.y ? float2(s.x, 0.0f) : float2(0.0f, s.y);
    }
    return min(max(q.x, q.y), 0.0f) + length(max(q, 0.0f)) - r;
}

static inline float sdOrb(float2 p, float2 ab, float n, thread float2 &normal) {
    float2 q = max(fabs(p) / ab, float2(1e-4f));
    float2 qn = pow(q, float2(n));
    float sum = max(qn.x + qn.y, 1e-6f);
    float f = pow(sum, 1.0f / n) - 1.0f;
    float2 g = pow(sum, 1.0f / n - 1.0f) * (qn / q) / ab;
    float gl = max(length(g), 1e-5f);
    float2 s = float2(p.x < 0.0f ? -1.0f : 1.0f, p.y < 0.0f ? -1.0f : 1.0f);
    normal = s * g / gl;
    return f / gl;
}

static inline IslandShape islandShape(IslandFrame f) {
    IslandShape s;
    float rFull = min(f.hs.x, f.hs.y);
    s.rMin = mix(min(rFull, MAX_CORNER_RADIUS), rFull, f.orb);

    float2 nCapsule;
    float2 nOrb = float2(0.0f);
    s.d = sdCapsule(f.p, f.hs, s.rMin, nCapsule);
    float2 normal = nCapsule;
    if (f.orb > 0.001f) {
        float dOrb = sdOrb(f.p, f.hs, 2.15f, nOrb);
        s.d = mix(s.d, max(dOrb, -4.0f * s.rMin), f.orb);
        normal = normalize(mix(nCapsule, nOrb, f.orb) + float2(1e-5f));
    }

    s.cover = saturate(0.5f - s.d / f.px);
    s.depth = max(-s.d, 0.0f);
    s.ny    = -f.p.y / f.hs.y;
    s.dir   = normalize(normal + 0.48f * normalize(f.p + float2(1e-4f)));

    float lensR = mix(min(s.rMin, 20.0f), s.rMin, f.orb);
    float lx = 1.0f - saturate(s.depth / (0.82f * lensR));
    s.lens = (1.0f - sqrt(max(1.0f - lx * lx, 0.0f))) * 1.05f * lensR;
    return s;
}

static inline float topMask(IslandFrame f, IslandShape s, constant IslandUniforms &u) {
    float topBand = smoothstep(0.06f, 0.26f, s.ny) * smoothstep(2.0f, 4.0f, s.depth) * f.orb;
    float2 hw = float2(u.hardwareW, u.hardwareH) * 0.5f;
    float2 ic = float2(u.canvasW * 0.5f, u.islandTop + hw.y);
    float dCut = sdRoundedBox(f.pos - ic, hw, hw.y);
    return max(topBand, 1.0f - smoothstep(2.0f, 10.0f, dCut));
}
