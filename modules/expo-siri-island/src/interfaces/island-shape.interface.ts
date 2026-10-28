interface IIslandSize {
  width: number;
  height: number;
}

interface IIslandShape extends IIslandSize {
  offsetY: number;
}

export type { IIslandShape, IIslandSize };
