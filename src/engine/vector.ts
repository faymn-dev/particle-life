export class Vector {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  add(vector: Vector): Vector {
    this.x += vector.x
    this.y += vector.y
    return this
  }

  sub(vector: Vector): Vector {
    this.x -= vector.x
    this.y -= vector.y
    return this
  }

  mult(scalar: number): Vector {
    this.x *= scalar
    this.y *= scalar
    return this
  }

  div(scalar: number): Vector {
    if (scalar == 0) {
      return this
    }

    this.x /= scalar
    this.y /= scalar
    return this
  }

  mag(): number {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
  }

  normalize(): Vector {
    return this.div(this.mag())
  }

  dist(vector: Vector): number {
    return this.clone().sub(vector).mag()
  }

  clone(): Vector {
    return new Vector(this.x, this.y)
  }
}
