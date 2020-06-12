export interface Decorator {
  figure: Circle | Square;
}

export interface Circle {
  radius: number;
}

export interface Square {
  side: number;
}
