import { CONTENT_INSET_RATIO, EXPANDED_ISLAND } from "../constants";
import type { IIslandShape } from "../interfaces";

function expandedShape(
  screenWidth: number,
  height: number = EXPANDED_ISLAND.height,
): IIslandShape {
  return {
    width: screenWidth - EXPANDED_ISLAND.margin * 2,
    height,
    offsetY: EXPANDED_ISLAND.offsetY,
  };
}

function expandedContentWidth(
  screenWidth: number,
  height: number = EXPANDED_ISLAND.height,
): number {
  const { width } = expandedShape(screenWidth, height);
  const inset =
    height > EXPANDED_ISLAND.height
      ? EXPANDED_ISLAND.cardInset
      : height * CONTENT_INSET_RATIO;
  return width - inset * 2;
}

export { expandedContentWidth, expandedShape };
