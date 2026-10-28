//
//  Shadow.h
//  Pods
//
//  Created by rit3zh CX on 10/29/26.
//

#pragma once

#include "Types.h"

static inline float contactShadow(IslandFrame f, IslandShape s) {
    if (s.d <= 0.0f || f.orb <= 0.01f) {
        return 0.0f;
    }
    return exp(-s.d / 6.0f) * smoothstep(-0.2f, 0.9f, -s.ny) * 0.16f * f.orb * f.glass * f.glassFx;
}
