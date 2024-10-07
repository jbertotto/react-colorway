import { Point } from '../types/point'

export class Triangle {
  protected A: Point
  protected B: Point
  protected C: Point

  constructor(A: Point, B: Point, C: Point) {
    this.A = A
    this.B = B
    this.C = C
  }

  // Method to get the vertices of the triangle
  public getVertices(): { A: Point; B: Point; C: Point } {
    return { A: this.A, B: this.B, C: this.C }
  }

  // Method to check if a point is inside the triangle using barycentric coordinates
  public isInside(x: number, y: number): boolean {
    const denominator =
      (this.B.y - this.C.y) * (this.A.x - this.C.x) + (this.C.x - this.B.x) * (this.A.y - this.C.y)
    const alpha =
      ((this.B.y - this.C.y) * (x - this.C.x) + (this.C.x - this.B.x) * (y - this.C.y)) /
      denominator
    const beta =
      ((this.C.y - this.A.y) * (x - this.C.x) + (this.A.x - this.C.x) * (y - this.C.y)) /
      denominator
    const gamma = 1 - alpha - beta

    return alpha >= 0 && beta >= 0 && gamma >= 0
  }

  // Method to find the closest point inside the triangle (clamped point)
  public getClampedPoint(point: Point): Point {
    if (this.isInside(point.x, point.y)) {
      return point
    } else {
      // Find the closest point on each side
      const closestPointAB = this.closestPointOnLineSegment(point, this.A, this.B)
      const closestPointBC = this.closestPointOnLineSegment(point, this.B, this.C)
      const closestPointCA = this.closestPointOnLineSegment(point, this.C, this.A)

      const distToAB = this.distanceSquared(point, closestPointAB)
      const distToBC = this.distanceSquared(point, closestPointBC)
      const distToCA = this.distanceSquared(point, closestPointCA)

      const minDist = Math.min(distToAB, distToBC, distToCA)

      if (minDist === distToAB) {
        return closestPointAB
      } else if (minDist === distToBC) {
        return closestPointBC
      } else {
        return closestPointCA
      }
    }
  }

  // Helper method to compute squared distance between two points
  private distanceSquared(p1: Point, p2: Point): number {
    const dx = p1.x - p2.x
    const dy = p1.y - p2.y
    return dx * dx + dy * dy
  }

  // Helper method to find the closest point on a line segment to a given point
  private closestPointOnLineSegment(p: Point, v1: Point, v2: Point): Point {
    const A = p.x - v1.x
    const B = p.y - v1.y
    const C = v2.x - v1.x
    const D = v2.y - v1.y

    const dot = A * C + B * D
    const len_sq = C * C + D * D
    const param = len_sq !== 0 ? dot / len_sq : -1

    let xx, yy
    if (param < 0) {
      xx = v1.x
      yy = v1.y
    } else if (param > 1) {
      xx = v2.x
      yy = v2.y
    } else {
      xx = v1.x + param * C
      yy = v1.y + param * D
    }
    return { x: xx, y: yy }
  }

  // Method to calculate the area of the triangle using the Shoelace formula
  public getArea(): number {
    return Math.abs(
      (this.A.x * (this.B.y - this.C.y) +
        this.B.x * (this.C.y - this.A.y) +
        this.C.x * (this.A.y - this.B.y)) /
        2,
    )
  }

  // Method to get the side lengths of the triangle
  public getSideLengths(): { AB: number; BC: number; CA: number } {
    const AB = Math.sqrt((this.B.x - this.A.x) ** 2 + (this.B.y - this.A.y) ** 2)
    const BC = Math.sqrt((this.C.x - this.B.x) ** 2 + (this.C.y - this.B.y) ** 2)
    const CA = Math.sqrt((this.A.x - this.C.x) ** 2 + (this.A.y - this.C.y) ** 2)
    return { AB, BC, CA }
  }

  public getCentroid(): Point {
    return {
      x: (this.A.x + this.B.x + this.C.x) / 3,
      y: (this.A.y + this.B.y + this.C.y) / 3,
    }
  }

  // Additional general methods for triangles can be added here
}

export class EquilateralTriangle extends Triangle {
  private radius: number // Distance from center to each vertex
  public center: Point
  private rotationAngle: number // Rotation angle in radians
  public boundingBoxSize: { width: number; height: number }

  constructor(center: Point, radius: number, rotationAngleInDegrees: number = 0) {
    const rotationAngle = (rotationAngleInDegrees * Math.PI) / 180

    const angleOffset = (2 * Math.PI) / 3 // 120 degrees in radians

    // Calculate the vertices of the equilateral triangle
    const A: Point = {
      x: center.x + radius * Math.cos(rotationAngle),
      y: center.y + radius * Math.sin(rotationAngle),
    }
    const B: Point = {
      x: center.x + radius * Math.cos(rotationAngle + angleOffset),
      y: center.y + radius * Math.sin(rotationAngle + angleOffset),
    }
    const C: Point = {
      x: center.x + radius * Math.cos(rotationAngle + 2 * angleOffset),
      y: center.y + radius * Math.sin(rotationAngle + 2 * angleOffset),
    }

    // Call the base class constructor with the calculated vertices
    super(A, B, C)

    this.center = center
    this.radius = radius
    this.rotationAngle = rotationAngle

    // Calculate the bounding box size
    const height = Math.sqrt(3) * radius
    const width = 2 * radius
    this.boundingBoxSize = {
      width,
      height,
    }
  }

  // Override methods or add specific methods for EquilateralTriangle

  // Method to get the side length (all sides are equal)
  public getSideLength(): number {
    // Since it's an equilateral triangle, we can calculate side length using radius
    return this.radius * Math.sqrt(3)
  }

  // Method to get the distance percentage from vertex A towards the base BC
  public getDistancePercentage(point: Point): number {
    const { A, B, C } = this.getVertices()

    // Calculate the midpoint of BC
    const midpointBC: Point = {
      x: (B.x + C.x) / 2,
      y: (B.y + C.y) / 2,
    }

    // Direction vector from A to midpoint of BC
    const directionVector: Point = {
      x: midpointBC.x - A.x,
      y: midpointBC.y - A.y,
    }

    // Vector from A to the point
    const vectorToPoint: Point = {
      x: point.x - A.x,
      y: point.y - A.y,
    }

    // Project vectorToPoint onto directionVector
    const dotProduct = vectorToPoint.x * directionVector.x + vectorToPoint.y * directionVector.y
    const directionMagnitudeSquared =
      directionVector.x * directionVector.x + directionVector.y * directionVector.y
    const projectionScalar = dotProduct / directionMagnitudeSquared

    // Clamp projectionScalar between 0 and 1
    const clampedProjection = Math.max(0, Math.min(projectionScalar, 1))

    // Percentage from A (0%) to base BC (100%)
    const percentage = clampedProjection * 100

    return percentage
  }

  // Method to get the percentage along base BC
  public getBCTrianglePercentage(point: Point): number {
    const { B, C } = this.getVertices()

    // Vector from B to C
    const BCVector: Point = {
      x: C.x - B.x,
      y: C.y - B.y,
    }

    // Vector from B to the point
    const BToPointVector: Point = {
      x: point.x - B.x,
      y: point.y - B.y,
    }

    // Project BToPointVector onto BCVector
    const dotProduct = BToPointVector.x * BCVector.x + BToPointVector.y * BCVector.y
    const BCLengthSquared = BCVector.x * BCVector.x + BCVector.y * BCVector.y
    const projectionScalar = dotProduct / BCLengthSquared

    // Clamp projection scalar between 0 and 1
    const clampedProjection = Math.max(0, Math.min(projectionScalar, 1))

    // Percentage along BC from B (0%) to C (100%)
    const percentage = clampedProjection * 100

    return percentage
  }

  // Any other methods specific to EquilateralTriangle can be added here
}
