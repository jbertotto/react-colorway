import { Circle } from "./circle";
import { Point } from "../types/point";

export class Ring extends Circle {
  private innerRadius: number;
  public constrained: boolean;

  constructor(
    center: Point,
    innerRadius: number,
    outerRadius: number,
    constrained: boolean = false
  ) {
    super(center, outerRadius);
    this.innerRadius = innerRadius;
    this.constrained = constrained;
  }

  // Override isInside method to check if point is inside the ring or on median circle when constrained
  public isInside(x: number, y: number): boolean {
    const dx = x - this.center.x;
    const dy = y - this.center.y;
    const distanceSquared = dx * dx + dy * dy;

    if (this.constrained) {
      // When constrained, the ring behaves like a circle at the median radius
      const medianRadius = (this.innerRadius + this.radius) / 2;
      const medianRadiusSquared = medianRadius * medianRadius;
      const tolerance = 1e-6; // To account for floating-point errors
      return Math.abs(distanceSquared - medianRadiusSquared) < tolerance;
    } else {
      return (
        distanceSquared >= this.innerRadius * this.innerRadius &&
        distanceSquared <= this.radius * this.radius
      );
    }
  }

  // Override getClampedPoint method to return point on median circle when constrained
  public getClampedPoint(point: Point): Point {
    if (this.constrained) {
      // Calculate median radius
      const medianRadius = (this.innerRadius + this.radius) / 2;
      const dx = point.x - this.center.x;
      const dy = point.y - this.center.y;
      const angle = Math.atan2(dy, dx);

      // Return point on median circle at the same angle
      return {
        x: this.center.x + medianRadius * Math.cos(angle),
        y: this.center.y + medianRadius * Math.sin(angle),
      };
    } else {
      // Default behavior
      const dx = point.x - this.center.x;
      const dy = point.y - this.center.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance === 0) {
        // Point is at the center; return point on inner boundary at angle 0
        return { x: this.center.x + this.innerRadius, y: this.center.y };
      } else if (distance < this.innerRadius) {
        // Point is inside inner circle; clamp to inner boundary
        const ratio = this.innerRadius / distance;
        return {
          x: this.center.x + dx * ratio,
          y: this.center.y + dy * ratio,
        };
      } else if (distance > this.radius) {
        // Point is outside outer circle; clamp to outer boundary
        const ratio = this.radius / distance;
        return {
          x: this.center.x + dx * ratio,
          y: this.center.y + dy * ratio,
        };
      } else {
        // Point is inside the ring; return the point itself
        return { x: point.x, y: point.y };
      }
    }
  }

  // Override getRadiusPercentage to throw error when constrained
  public getRadiusPercentage(point: Point): number {
    if (this.constrained) {
      return 0;
      // throw new Error("getRadiusPercentage is not applicable when 'constrained' is true.")
    }

    const dx = point.x - this.center.x;
    const dy = point.y - this.center.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Map distance from innerRadius to outerRadius to percentage from 0% to 100%
    const percentage =
      ((distance - this.innerRadius) / (this.radius - this.innerRadius)) * 100;

    // Clamp percentage between 0% and 100%
    const clampedPercentage = Math.max(0, Math.min(percentage, 100));

    return clampedPercentage;
  }

  // Existing methods remain unchanged
  public getPointAtAngle(angleInDegrees: number): Point {
    const angleInRadians = (angleInDegrees * Math.PI) / 180;
    return {
      x:
        this.center.x +
        ((this.radius + this.innerRadius) / 2) * Math.cos(angleInRadians),
      y:
        this.center.y +
        ((this.radius + this.innerRadius) / 2) * Math.sin(angleInRadians),
    };
  }

  // Method to get angle from point
  public getAngleFromPoint(point: Point): number {
    const dx = point.x - this.center.x;
    const dy = point.y - this.center.y;
    const angleInRadians = Math.atan2(dy, dx);
    let angleInDegrees = (angleInRadians * 180) / Math.PI;
    // Normalize angle to 0-360 degrees
    if (angleInDegrees < 0) {
      angleInDegrees += 360;
    }
    return angleInDegrees;
  }

  // Method to get the inner circumference
  public getInnerCircumference(): number {
    return 2 * Math.PI * this.innerRadius;
  }

  // Method to get both inner and outer circumferences
  public getCircumferences(): { inner: number; outer: number } {
    return {
      inner: this.getInnerCircumference(),
      outer: this.getCircumference(),
    };
  }

  // Override getArea method to get the area of the ring
  public getArea(): number {
    const outerArea = Math.PI * this.radius * this.radius;
    const innerArea = Math.PI * this.innerRadius * this.innerRadius;
    return outerArea - innerArea;
  }
}
