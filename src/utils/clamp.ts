export const clamp = (value: number, min = 0, max = 1): number => {
  return value < min ? min : value > max ? max : value
  // Equivalent to: Math.min(Math.max(value, min), max)
}
