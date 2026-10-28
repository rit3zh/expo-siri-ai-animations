//
//  Dots.h
//  Pods
//
//  Created by rit3zh CX on 10/29/26.
//

#pragma once

#include "Types.h"

static inline float hash11(float n) {
    return fract(sin(n * 127.1f + 311.7f) * 43758.5453f);
}

static inline float settleWL(float tau, float w, float l) {
    return tau <= 0.0f ? 0.0f : 1.0f - exp(-l * tau) * cos(w * tau);
}

static inline float settleCrit(float tau, float l) {
    return tau <= 0.0f ? 0.0f : 1.0f - exp(-l * tau) * (1.0f + l * tau);
}

static inline float smin(float a, float b, float k) {
    float h = max(k - fabs(a - b), 0.0f) / k;
    return min(a, b) - h * h * k * 0.25f;
}

static inline float3 hue2rgb(float h) {
    h = fract(h);
    return saturate(float3(fabs(h * 6.0f - 3.0f) - 1.0f,
                           2.0f - fabs(h * 6.0f - 2.0f),
                           2.0f - fabs(h * 6.0f - 4.0f)));
}

static inline float dotRadius(float fi, float seed, float t) {
    return 0.036f + 0.010f * sin(t * 1.3f + seed * TAU) + 0.005f * sin(t * 2.4f + fi * 1.3f);
}

static inline float dotSD(float2 p, float2 pos, float r, float t, float fi, float shapeDamp) {
    float2 d = p - pos;
    float sq = 0.075f * (0.5f + 0.5f * sin(t * 0.9f + fi * 2.0f)) * shapeDamp;
    float ca = cos(t * 0.35f + fi);
    float sa = sin(t * 0.35f + fi);
    d = float2(ca * d.x + sa * d.y, -sa * d.x + ca * d.y);
    d *= float2(1.0f + sq, 1.0f - sq);
    return length(d) - r;
}

static inline float3 fluidDots(float2 p, float t, float open) {
    const float SMOOTH_K = 0.08f;
    const float INTENSITY = 0.0025f;
    const float FALLOFF_P = 1.35f;
    const float FADE_START = 0.02f;
    const float FADE_END = 0.56f;
    const float3 SPECTRAL = float3(0.0f, 0.5f, 1.0f) * 0.005f;
    const float MERGE_PERIOD = 6.0f;
    const float STAGGER = 0.33f;
    const float W = 4.6f;
    const float L = 3.2f;
    const float PIERCE = 0.12f;
    const float RECOIL = 0.035f;
    const float REC_LAG = 0.11f;
    const float GATHER_PERIOD = 12.0f;
    const float GATHER_START = 9.2f;
    const float GATHER_HOLD = 0.8f;

    p /= 1.0f + 0.03f * sin(t);

    float k  = floor(t / MERGE_PERIOD);
    float te = fract(t / MERGE_PERIOD) * MERGE_PERIOD;
    float tg = fmod(t, GATHER_PERIOD);
    float g  = settleCrit((tg - GATHER_START) * 1.8f, 7.5f)
             - settleWL(tg - GATHER_START - GATHER_HOLD, 6.5f, 4.0f);
    float gC = saturate(g);
    float tb = tg - (GATHER_START + GATHER_HOLD);
    float charge = smoothstep(-0.30f, 0.0f, min(tb, 0.0f)) * gC;
    float flash = tb > 0.0f ? exp(-tb * 7.0f) : 0.0f;
    float gBright = mix(1.0f, 0.85f, gC) * (1.0f + 0.35f * charge + 1.2f * flash);

    float3 total3 = float3(1e5f);
    float3 cAcc = float3(0.0f);
    float wAcc = 1e-6f;
    for (int i = 0; i < 6; i++) {
        float fi = float(i);
        float seed = hash11(fi);
        float ang = fi / 6.0f * TAU + t * 0.35f;
        float2 dir = float2(cos(ang), sin(ang));
        float R = 0.17f + 0.010f * sin(t) + 0.007f * sin(t * 1.3f + seed * TAU);

        float pairId = fmod(fi, 3.0f);
        float moverLow = fmod(k + pairId, 2.0f);
        float isMover = (fi < 2.5f) ? step(moverLow, 0.5f) : step(0.5f, moverLow);
        float goStart = pairId * STAGGER;
        float retStart = 3.0f * STAGGER + pairId * STAGGER;
        float m = (settleWL(te - goStart, W, L) - settleWL(te - retStart, W, L)) * isMover;
        float rec = (settleWL(te - goStart - REC_LAG, W, L)
                   - settleWL(te - retStart - REC_LAG, W, L)) * (1.0f - isMover);
        float rSelf = dotRadius(fi, seed, t);
        rSelf = mix(rSelf, 0.036f, gC);
        rSelf *= 1.0f - 0.18f * charge;

        float fj = fmod(fi + 3.0f, 6.0f);
        float rPart = dotRadius(fj, hash11(fj), t);
        float deep = -(R + RECOIL) - PIERCE * rPart;
        float radial = mix(R, deep, m) + RECOIL * rec;
        radial = mix(radial, 0.008f, g) * open;
        float2 pos = radial * dir;
        float sdR = dotSD(p - SPECTRAL.r * dir, pos, rSelf, t, fi, 1.0f - gC);
        float sdG = dotSD(p - SPECTRAL.g * dir, pos, rSelf, t, fi, 1.0f - gC);
        float sdB = dotSD(p - SPECTRAL.b * dir, pos, rSelf, t, fi, 1.0f - gC);
        total3 = float3(smin(total3.r, sdR, SMOOTH_K),
                        smin(total3.g, sdG, SMOOTH_K),
                        smin(total3.b, sdB, SMOOTH_K));

        float hue = fract(fi / 6.0f + t * 0.06f) * 0.667f;
        float3 dotCol = mix(float3(1.0f), hue2rgb(hue), 0.01f);
        float w = exp(-sdG * 0.5f);
        cAcc += w * dotCol;
        wAcc += w;
    }

    float3 sd3 = max(total3, float3(0.0f)) + 1e-4f;
    float3 core3 = saturate(INTENSITY / pow(sd3, float3(FALLOFF_P)));
    float3 edge3 = 1.0f - smoothstep(float3(FADE_START), float3(FADE_END), sd3);
    float3 col = core3 * edge3 * gBright * (cAcc / wAcc);
    col *= 1.0f + 0.05f * sin(t + 1.0f);
    col = pow(col, float3(1.0f / 1.2f));
    col = saturate((col - 0.035f) / 0.965f);
    return col;
}

static inline float3 spinnerDots(IslandFrame f, float dotsTime) {
    if (f.spin <= 0.001f) {
        return float3(0.0f);
    }
    float h = min(2.0f * f.hs.y, 92.0f);
    float2 center = float2(-f.hs.x + 30.0f + (h - 60.0f) * 0.75f, 0.04f * f.hs.y);
    float unit = 74.0f + (h - 60.0f) * 0.82f;
    float2 q = (f.p - center) / unit;
    if (length(q) >= 0.45f) {
        return float3(0.0f);
    }
    float grow = f.spin * f.spin * (3.0f - 2.0f * f.spin);
    return fluidDots(q, dotsTime, grow) * smoothstep(0.0f, 0.3f, f.spin);
}
