import { Point } from '../types/point'

export class Rectangle {
  public center: Point
  private width: number
  private height: number
  private rotationAngle: number // Rotation angle in radians (optional)
  public clampedX: boolean = false
  public clampedY: boolean = false

  constructor(center: Point, width: number, height: number, rotationAngleInDegrees: number = 0) {
    this.center = center
    this.width = width
    this.height = height
    this.rotationAngle = (rotationAngleInDegrees * Math.PI) / 180
  }

  // Method to get the corners of the rectangle
  public getCorners(): { topLeft: Point; topRight: Point; bottomRight: Point; bottomLeft: Point } {
    const halfWidth = this.width / 2
    const halfHeight = this.height / 2

    // Define the corners relative to the center without rotation
    const corners = [
      { x: -halfWidth, y: halfHeight }, // topLeft
      { x: halfWidth, y: halfHeight }, // topRight
      { x: halfWidth, y: -halfHeight }, // bottomRight
      { x: -halfWidth, y: -halfHeight }, // bottomLeft
    ]

    // Apply rotation if necessary
    const rotatedCorners = corners.map((corner) => this.rotatePoint(corner, this.rotationAngle))

    // Translate corners back to the center position
    const translatedCorners = rotatedCorners.map((corner) => ({
      x: corner.x + this.center.x,
      y: corner.y + this.center.y,
    }))

    return {
      topLeft: translatedCorners[0],
      topRight: translatedCorners[1],
      bottomRight: translatedCorners[2],
      bottomLeft: translatedCorners[3],
    }
  }

  // Helper method to rotate a point around the origin by a given angle
  private rotatePoint(point: Point, angle: number): Point {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    return {
      x: point.x * cos - point.y * sin,
      y: point.x * sin + point.y * cos,
    }
  }

  // Method to check if a point is inside the rectangle
  public isInside(x: number, y: number): boolean {
    // Transform the point to the rectangle's coordinate system
    const transformedPoint = this.transformPointToRectangleCoords({ x, y })

    const halfWidth = this.width / 2
    const halfHeight = this.height / 2

    return (
      transformedPoint.x >= -halfWidth &&
      transformedPoint.x <= halfWidth &&
      transformedPoint.y >= -halfHeight &&
      transformedPoint.y <= halfHeight
    )
  }

  // Method to get the percentage from top (100%) to bottom (0%)
  public getVerticalPercentage(point: Point): number {
    const transformedPoint = this.transformPointToRectangleCoords(point)

    const halfHeight = this.height / 2
    const clampedY = Math.max(-halfHeight, Math.min(halfHeight, transformedPoint.y))

    // Map y from [-halfHeight, halfHeight] to [0, 100]
    const percentage = ((clampedY + halfHeight) / this.height) * 100

    // Since top is 100% and bottom is 0%, we invert the percentage
    return 100 - percentage
  }

  // Method to get the percentage from left (0%) to right (100%)
  public getHorizontalPercentage(point: Point): number {
    const transformedPoint = this.transformPointToRectangleCoords(point)

    const halfWidth = this.width / 2
    const clampedX = Math.max(-halfWidth, Math.min(halfWidth, transformedPoint.x))

    // Map x from [-halfWidth, halfWidth] to [0, 100]
    const percentage = ((clampedX + halfWidth) / this.width) * 100

    return percentage
  }

  // Method to get both vertical and horizontal percentages
  public getPercentages(point: Point): { vertical: number; horizontal: number } {
    return {
      vertical: this.getVerticalPercentage(point),
      horizontal: this.getHorizontalPercentage(point),
    }
  }

  // Method to clamp a point to the rectangle boundaries
  public getClampedPoint(point: Point): Point {
    const transformedPoint = this.transformPointToRectangleCoords(point)

    const halfWidth = this.width / 2
    const halfHeight = this.height / 2

    let clampedX = transformedPoint.x
    let clampedY = transformedPoint.y

    if (this.clampedX) {
      clampedX = 0 // Clamp to center X-axis
    } else {
      clampedX = Math.max(-halfWidth, Math.min(halfWidth, transformedPoint.x))
    }

    if (this.clampedY) {
      clampedY = 0 // Clamp to center Y-axis
    } else {
      clampedY = Math.max(-halfHeight, Math.min(halfHeight, transformedPoint.y))
    }

    // Transform the clamped point back to the original coordinate system
    const rotatedPoint = this.rotatePoint({ x: clampedX, y: clampedY }, -this.rotationAngle)
    return {
      x: rotatedPoint.x + this.center.x,
      y: rotatedPoint.y + this.center.y,
    }
  }

  // Helper method to transform a point to the rectangle's coordinate system
  private transformPointToRectangleCoords(point: Point): Point {
    // Translate point to rectangle's center
    const translatedX = point.x - this.center.x
    const translatedY = point.y - this.center.y

    // Rotate point to align with rectangle's axes
    const cos = Math.cos(-this.rotationAngle)
    const sin = Math.sin(-this.rotationAngle)
    return {
      x: translatedX * cos - translatedY * sin,
      y: translatedX * sin + translatedY * cos,
    }
  }
}
