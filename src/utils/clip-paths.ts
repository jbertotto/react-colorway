interface RingClipPathProps {
  outerRadius: number;
  innerRadius: number;
}

export const generateRingClipPath = ({
  outerRadius,
  innerRadius,
}: RingClipPathProps) => {
  return `path('M ${outerRadius} 0 a ${outerRadius} ${outerRadius} 0 0 1 0 ${
    outerRadius * 2
  } a ${outerRadius} ${outerRadius} 0 0 1 0 -${
    outerRadius * 2
  } M ${outerRadius} ${
    outerRadius - innerRadius
  } a ${innerRadius} ${innerRadius} 0 0 0 0 ${
    outerRadius * 2 - (outerRadius - innerRadius) * 2
  } a ${innerRadius} ${innerRadius} 0 0 0 0 -${
    outerRadius * 2 - (outerRadius - innerRadius) * 2
  }')`;
};
