import { useEffect, useState } from "react";
import { EquilateralTriangle } from "../../geometryClasses/triangle";
import { Point } from "../../types/point";
import React from "react";

interface TrianglePickerProps {
  triangleCenter: Point;
  radius: number; // Radius of the inscribed circle
  hue: number; // Hue value for the color
  onChange: (newColor: { s: number; l: number }) => void; // Callback when picking
}

export const SaturationLightnessTriangle: React.FC<TrianglePickerProps> = ({
  triangleCenter,
  radius,
  hue,
  onChange,
}) => {
  const triangle = new EquilateralTriangle(triangleCenter, radius, hue);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const [clickPosition, setClickPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const updateSaturationLightness = (x: number, y: number) => {
    const clampedPoint = triangle.getClampedPoint({ x, y });
    setClickPosition({ x: clampedPoint.x, y: clampedPoint.y });
    // console.log(clickPosition)

    setSaturation(
      triangle.getDistancePercentage({ x: clampedPoint.x, y: clampedPoint.y })
    );
    setLightness(
      triangle.getBCTrianglePercentage({ x: clampedPoint.x, y: clampedPoint.y })
    );
    // console.log({
    //   saturation: saturation,
    //   lightness: lightness,
    // });
    onChange({ s: saturation, l: lightness });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    if (triangle.isInside(x, y)) {
      setIsDragging(true);
      updateSaturationLightness(x, y);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const { left, top } = e.currentTarget.getBoundingClientRect();
      updateSaturationLightness(e.clientX - left, e.clientY - top);
    }
  };

  const handleGlobalMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const div = document.querySelector(".triangle-picker") as HTMLDivElement;
      if (div) {
        const { left, top } = div.getBoundingClientRect();
        updateSaturationLightness(e.clientX - left, e.clientY - top);
      }
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleGlobalMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const selectedColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  return (
    <div className="">
      <div
        className="triangle-picker"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        style={{
          width: 184,
          height: 184,
          clipPath: `polygon(${triangle.getVertices().A.x}px ${
            triangle.getVertices().A.y
          }px, 
                           ${triangle.getVertices().B.x}px ${
            triangle.getVertices().B.y
          }px, 
                           ${triangle.getVertices().C.x}px ${
            triangle.getVertices().C.y
          }px)`,
          // backgroundColor: '#777',
          backgroundImage: `radial-gradient(circle at ${
            triangle.getVertices().A.x
          }px ${
            triangle.getVertices().A.y
          }px, hsl(${hue}, 100%, 50%), #0000 ${triangle.getSideLength()}px),
                            radial-gradient(circle at ${
                              triangle.getVertices().B.x
                            }px ${
            triangle.getVertices().B.y
          }px, hsl(${hue}, 100%, 0%), #0000 ${triangle.getSideLength()}px),
                            radial-gradient(circle at ${
                              triangle.getVertices().C.x
                            }px ${
            triangle.getVertices().C.y
          }px, hsl(${hue}, 0%, 100%), #0000 ${triangle.getSideLength()}px)`,
          backgroundBlendMode: "hard-light",
        }}
      >
        {/* <div
          style={{
            position: 'absolute',
            left: triangle.getVertices().A.x,
            top: triangle.getVertices().A.y,
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            border: '2px solid #777',
            transform: 'translate(-50%, -50%)',
          }}
        >
          A
        </div>

        <div
          style={{
            position: 'absolute',
            left: triangle.getVertices().B.x,
            top: triangle.getVertices().B.y,
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            border: '2px solid #777',
            transform: 'translate(-50%, -50%)',
          }}
        >
          B
        </div>
        <div
          style={{
            position: 'absolute',
            left: triangle.getVertices().C.x,
            top: triangle.getVertices().C.y,
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            border: '2px solid #777',
            transform: 'translate(-50%, -50%)',
          }}
        >
          C
        </div>
        <div
          style={{
            position: 'absolute',
            left: triangleCenter.x,
            top: triangleCenter.y,
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            border: '2px solid #777',
            transform: 'translate(-50%, -50%)',
          }}
        /> */}
      </div>
      {clickPosition && (
        <div
          style={{
            position: "absolute",
            left: clickPosition.x - 8,
            top: clickPosition.y - 8,
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            backgroundColor: selectedColor,
            border: "2px solid #7777",
          }}
        />
      )}
    </div>
  );
};
