import { Point } from '../types/point'

export class Circle {
  public center: Point
  protected radius: number

  constructor(center: Point, radius: number) {
    this.center = center
    this.radius = radius
  }

  // Method to check if a point is inside the circle
  public isInside(x: number, y: number): boolean {
    const dx = x - this.center.x
    const dy = y - this.center.y
    const distanceSquared = dx * dx + dy * dy
    return distanceSquared <= this.radius * this.radius
  }

  // Method to get the closest point on the circle to a given point (clamped point)
  public getClampedPoint(point: Point): Point {
    const dx = point.x - this.center.x
    const dy = point.y - this.center.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance === 0) {
      // Point is at the center; return a point at angle 0 degrees
      return { x: this.center.x + this.radius, y: this.center.y }
    } else {
      const ratio = this.radius / distance
      return {
        x: this.center.x + dx * ratio,
        y: this.center.y + dy * ratio,
      }
    }
  }

  // Method to get a point on the circle at a given angle
  public getPointAtAngle(angleInDegrees: number): Point {
    const angleInRadians = (angleInDegrees * Math.PI) / 180
    return {
      x: this.center.x + this.radius * Math.cos(angleInRadians),
      y: this.center.y + this.radius * Math.sin(angleInRadians),
    }
  }

  // Method to get the circumference
  public getCircumference(): number {
    return 2 * Math.PI * this.radius
  }

  // Method to get the area
  public getArea(): number {
    return Math.PI * this.radius * this.radius
  }

  // New method: Returns the percentage of the radius for a given point
  public getRadiusPercentage(point: Point): number {
    const dx = point.x - this.center.x
    const dy = point.y - this.center.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    const percentage = (distance / this.radius) * 100
    // Clamp percentage between 0% and 100%
    const clampedPercentage = Math.max(0, Math.min(percentage, 100))
    return clampedPercentage
  }

  // New method: Returns the angle of the point relative to the circle's center, normalized to 0-360 degrees
  public getAngleFromPoint(point: Point): number {
    const dx = point.x - this.center.x
    const dy = point.y - this.center.y
    const angleInRadians = Math.atan2(dy, dx)
    let angleInDegrees = (angleInRadians * 180) / Math.PI
    // Normalize angle to 0-360 degrees
    if (angleInDegrees < 0) {
      angleInDegrees += 360
    }
    return angleInDegrees
  }
}
