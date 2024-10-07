const getWheelPosition = ({
  centerX,
  centerY,
  innerRadius,
  outerRadius,
  hue,
}) => {
  const middleRadius = (innerRadius + outerRadius) / 2;
  return {
    x: centerX + middleRadius * Math.sin(hue),
    y: centerY - middleRadius * Math.cos(hue),
  };
};

const getTrianglePosition = ({ sat, val, centerX, centerY, innerRadius }) => {
  const sqrt3 = Math.sqrt(3);
  return {
    x: centerX + (innerRadius * (2 * val - sat * val - 1) * sqrt3) / 2,
    y: centerY + (innerRadius * (1 - 3 * sat * val)) / 2,
  };
};

export const hsvToRgb = (hue, sat, val) => {
  const chroma = val * sat;
  const step = Math.PI / 3;
  const interm = chroma * (1 - Math.abs(((hue / step) % 2.0) - 1));
  const shift = val - chroma;

  const rgbMap = [
    [shift + chroma, shift + interm, shift + 0],
    [shift + interm, shift + chroma, shift + 0],
    [shift + 0, shift + chroma, shift + interm],
    [shift + 0, shift + interm, shift + chroma],
    [shift + interm, shift + 0, shift + chroma],
    [shift + chroma, shift + 0, shift + interm],
  ];

  const i = Math.floor(hue / step);
  const [r, g, b] = rgbMap[i % 6];

  return `rgb(${Math.floor(r * 255)}, ${Math.floor(g * 255)}, ${Math.floor(
    b * 255
  )})`;
};

// Generate the dynamic clipPath for the hue ring
export const generateClipPath = ({
  outerRadius,
  innerRadius,
  size,
  strokeWidth,
}) => {
  return `
      M ${outerRadius} 0 
      a ${outerRadius} ${outerRadius} 0 0 1 0 ${size}
      a ${outerRadius} ${outerRadius} 0 0 1 0 -${size}
      M ${outerRadius} ${strokeWidth} 
      a ${innerRadius} ${innerRadius} 0 0 0 0 ${size - strokeWidth * 2}
      a ${innerRadius} ${innerRadius} 0 0 0 0 -${size - strokeWidth * 2}
    `;
};

// Function to generate the equilateral triangle coordinates inside the inner radius (rotated 90 degrees)
export const generateTriangle = ({ outerRadius, innerRadius }) => {
  const triangleRadius = innerRadius - 8; // Slight padding inside the inner radius
  const angleIncrement = (2 * Math.PI) / 3; // 120 degrees in radians between vertices

  // Generate each vertex position and rotate 90 degrees clockwise
  const vertices = Array.from({ length: 3 }, (_, i) => {
    const angle = i * angleIncrement; //+ Math.PI / 2 // Rotate 90 degrees clockwise
    return {
      x: outerRadius + Math.cos(angle) * triangleRadius,
      y: outerRadius + Math.sin(angle) * triangleRadius,
    };
  });

  // Convert to a "points" string for the <polygon> element
  return vertices.map(({ x, y }) => `${x},${y}`).join(" ");
};

export const generateSVTriangleClipPath = ({ outerRadius, innerRadius }) => {
  const triangleRadius = innerRadius - 8; // Slight padding inside the inner radius
  const angleIncrement = (2 * Math.PI) / 3; // 120 degrees between each vertex in radians

  // Calculate each vertex position for the triangle
  const vertices = Array.from({ length: 3 }, (_, i) => {
    const angle = i * angleIncrement; //- Math.PI / 2 // Rotate 90 degrees clockwise
    return {
      x: outerRadius + Math.cos(angle) * triangleRadius,
      y: outerRadius + Math.sin(angle) * triangleRadius,
    };
  });

  // Return the points for the <polygon> or clip path
  return vertices.map(({ x, y }) => `${x},${y}`).join(" ");
};
