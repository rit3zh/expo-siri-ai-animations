//
//  Waves.h
//  Pods
//
//  Created by rit3zh CX on 10/29/26.
//

#pragma once

#include "Types.h"

struct WaveLayer {
    float3 color;
    float3 glow;
};

static inline float3 waveHue(int s) {
    switch (s) {
        case 0:  return float3(1.00f, 0.16f, 0.12f);
        case 1:  return float3(1.00f, 0.60f, 0.10f);
        case 2:  return float3(0.12f, 0.86f, 1.00f);
        default: return float3(0.24f, 0.34f, 1.00f);
    }
}

static inline float3 siriWave(float2 p, float t, float spread, float amp) {
    float low  = saturate(0.45f + 0.45f * sin(t * 0.8f) * sin(t * 0.37f + 1.0f));
    float mid  = saturate(0.40f + 0.40f * sin(t * 1.7f + 2.0f) * sin(t * 0.53f));
    float high = saturate(0.30f + 0.30f * sin(t * 2.9f + 4.0f) * sin(t * 0.71f + 2.0f));

    float drift = fmod(t, 20.0f * PI) * 2.4f;
    float env = cos(PI * 0.5f * min(fabs(0.9f * p.x), 1.0f));
    env *= env;

    float A1 = (0.23f + 0.05f * low) * amp;
    float A2 = A1 + (mid * 0.04f + high * 0.05f) * amp;
    float AB = (2.6f + mid * 0.8f + high * 0.5f) * mix(0.10f, 1.0f, amp);

    float th    = 0.03f * spread;
    float inten = 0.01f * (2.0f + low * 1.5f);
    float soft  = 0.01f * (2.5f + mid * 0.4f) * spread;

    float yMain = A1 * env * sin(p.x * 1.1f + drift);
    float bandAmt = 2.6f * inten;

    float3 num = float3(0.0f);
    float3 den = float3(0.0f);
    for (int s = 0; s < 4; s++) {
        float3 hue = waveHue(s);
        den += hue;
        float ab = mix(-AB, AB, float(s) / 3.0f);
        float yL = A2 * env * sin(p.x + drift + ab);
        float d = fabs(p.y - yL);
        float line = inten / (sqrt(d * d + soft * soft) + th);
        float lo = min(yMain, yL);
        float hi = max(yMain, yL);
        float dB = max(0.0f, max(p.y - hi, lo - p.y));
        float band = bandAmt / (dB + 0.08f);
        num += hue * (line + band);
    }
    float3 col = num / den;

    float dM = fabs(p.y - yMain);
    col += 0.3f * inten / (sqrt(dM * dM + soft * soft) + th);
    col = pow(max(col, 0.0f), float3(1.5f));
    return col * exp(-pow(p.x * 1.2f, 2.0f));
}

static inline WaveLayer waveLayer(IslandFrame f, IslandShape s, float mirror) {
    WaveLayer layer = { float3(0.0f), float3(0.0f) };
    if (f.wave <= 0.001f) {
        return layer;
    }
    float2 cw = f.p + s.dir * s.lens * 0.5f;
    float2 wp = float2(cw.x / f.hs.x, -cw.y / f.hs.y + 0.16f) / 0.85f;
    float rise = 1.0f - smoothstep(0.08f, 0.44f, wp.y);
    float visibility = (1.0f - mirror * 0.35f) * rise;
    float k = smoothstep(0.0f, 0.12f, f.wave) * f.orb;

    float3 sharp = siriWave(wp, f.t, 1.0f, f.wave);
    float luma = dot(sharp, float3(0.30f, 0.59f, 0.11f));
    sharp = max(mix(float3(luma), sharp, 1.6f), 0.0f) * 1.2f;

    layer.glow = siriWave(wp, f.t, 7.0f, f.wave) * float3(0.80f, 0.95f, 1.25f) * k * 0.7f * rise;
    float below = 1.0f - smoothstep(-0.5f, 0.7f, wp.y);
    layer.color = (sharp * k + layer.glow * (0.10f + 0.30f * below)) * visibility;
    return layer;
}
