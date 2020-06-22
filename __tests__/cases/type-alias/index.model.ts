type Figure = Circle | Square;

export interface Decorator {
  figure: Figure;
}

export interface Circle {
  radius: number;
}

export interface Square {
  side: number;
}
