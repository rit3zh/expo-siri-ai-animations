//
//  Types.h
//  Pods
//
//  Created by rit3zh CX on 10/29/26.
//

#pragma once

#include <metal_stdlib>
using namespace metal;

constant float PI  = 3.14159265359f;
constant float TAU = 6.28318530718f;

struct IslandUniforms {
    float canvasW;
    float canvasH;
    float scale;
    float time;
    float centerX;
    float centerY;
    float halfW;
    float halfH;
    float orb;
    float glass;
    float wave;
    float glow;
    float spinner;
    float dotsTime;
    float hasBackdrop;
    float islandTop;
    float hardwareW;
    float hardwareH;
    float glassEffect;
    float gradientEffect;
    float gradientStart;
    float gradientEnd;
    float gradientOpacity;
    float gradientR;
    float gradientG;
    float gradientB;
    float backdropH;
};

struct VOut {
    float4 position [[position]];
};

struct IslandFrame {
    float2 pos;
    float2 p;
    float2 hs;
    float  t;
    float  px;
    float  orb;
    float  glass;
    float  wave;
    float  glow;
    float  spin;
    float  glassFx;
    float  gradientFx;
    float  gradientStart;
    float  gradientEnd;
    float  gradientOpacity;
    float3 gradientColor;
};

struct IslandShape {
    float  d;
    float  cover;
    float  depth;
    float  ny;
    float  rMin;
    float  lens;
    float2 dir;
};

static inline IslandFrame islandFrame(float2 fragCoord, constant IslandUniforms &u) {
    IslandFrame f;
    f.pos   = fragCoord / u.scale;
    f.hs    = max(float2(u.halfW, u.halfH), float2(1.0f));
    f.p     = f.pos - float2(u.centerX, u.centerY);
    f.t     = u.time;
    f.px    = 1.0f / u.scale;
    f.orb   = saturate(u.orb);
    f.glass = saturate(u.glass);
    f.wave  = saturate(u.wave);
    f.glow  = saturate(u.glow);
    f.spin  = saturate(u.spinner);
    f.glassFx    = saturate(u.glassEffect);
    f.gradientFx = saturate(u.gradientEffect);
    f.gradientStart   = saturate(u.gradientStart);
    f.gradientEnd     = max(saturate(u.gradientEnd), f.gradientStart + 0.001f);
    f.gradientOpacity = saturate(u.gradientOpacity);
    f.gradientColor   = max(float3(u.gradientR, u.gradientG, u.gradientB), float3(0.0f));
    return f;
}

static inline bool isOutsideIsland(IslandFrame f) {
    float2 bb = fabs(f.p) - f.hs;
    return max(bb.x, bb.y) > 28.0f;
}
