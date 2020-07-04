export type Shapes = Circle | Square;

export interface Picture {
  figures: Shapes[];
}

export interface Circle {
  radius: number;
}

export interface Square {
  side: number;
}
