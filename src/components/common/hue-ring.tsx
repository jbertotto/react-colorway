import React, { useCallback, useEffect, useRef, useState } from "react";
import { generateRingClipPath } from "../../utils/clip-paths";
import { Interaction, InteractiveHandler } from "./InteractionHandler";
import { round } from "../../utils/round";
import { clamp } from "../../utils/clamp";
import { Ring } from "../../geometryClasses";
import { Pointer } from "./pointer";
import { cn } from "../../utils/cn";

interface Props {
  className?: string;
  hue: number;
  onChange: (newHue: { h: number }) => void;
}

const HueRing = ({ className, hue, onChange }: Props) => {
  const size = 184; // Diameter of the outer circle
  const strokeWidth = 16; // Thickness of the hue ring
  const outerRadius = size / 2; // Outer radius of the ring
  const innerRadius = outerRadius - strokeWidth; // Inner radius of the ring
  const ring = new Ring(
    { x: outerRadius, y: outerRadius },
    innerRadius,
    outerRadius,
    true
  );

  const [pointerPosition, setPointerPosition] = useState({
    x: ring.getPointAtAngle(hue).x / size,
    y: ring.getPointAtAngle(hue).y / size,
  });
  // console.log("pointerPosition", pointerPosition);
  // console.log("test", ring.getClampedPoint(pointerPosition));

  const clipPath = generateRingClipPath({
    outerRadius,
    innerRadius,
  });

  const handleMove = (interaction: Interaction) => {
    onChange({
      h: interaction.percentages.angle ? interaction.percentages.angle : 0,
    });
    setPointerPosition({
      x: interaction.point.x / size,
      y: interaction.point.y / size,
    });
    // console.log("pointerPosition", pointerPosition);
  };

  const handleKey = (offset: Interaction) => {
    // console.log("offset", offset);

    // Hue measured in degrees of the color circle ranging from 0 to 360
    onChange({
      h: hue,
    });

    // console.log("hue", hue);
  };

  return (
    <div className={cn("w-full h-full absolute p-2", className)}>
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          backgroundImage:
            "conic-gradient( hsl(270 100% 50%),  hsl(315 100% 50%),  hsl(360 100% 50%),  hsl(45 100% 50%),  hsl(90 100% 50%),  hsl(135 100% 50%),  hsl(180 100% 50%),  hsl(225 100% 50%),  hsl(270 100% 50%))",
          clipPath: clipPath,
        }}
      >
        <InteractiveHandler
          shape={ring}
          onMove={handleMove}
          onKey={handleKey}
          aria-label="Hue"
          aria-valuenow={round(hue)}
          aria-valuemax="360"
          aria-valuemin="0"
        ></InteractiveHandler>
      </div>
      <Pointer
        className="z-[2]"
        left={pointerPosition.x}
        top={pointerPosition.y}
        color={`hsl(${hue}, 100%, 50%)`}
      />
    </div>
  );
};

export { HueRing };
