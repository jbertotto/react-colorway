import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { HslaColor, ColorPicker } from "../../src";
import "../../src/globals.css"; // Import the Tailwind CSS styles
import { ColorModel } from "../../src/types/color";

// See http://www.w3.org/TR/AERT#color-contrast
const getBrightness = ({ h, s, l }: HslaColor) =>
  (h * 299 + s * 587 + l * 114) / 1000;

const getRandomColor = (): HslaColor => {
  const colors = [
    { h: 209, s: 97, l: 28, a: 1 }, // orange
    { h: 34, s: 91, l: 98, a: 1 }, // blue
    { h: 225, s: 17, l: 85, a: 0.7625 }, // purple
    { h: 21, s: 94, l: 59, a: 1 }, // green
    { h: 189, s: 60, l: 60, a: 1 }, // salmon
  ];

  return colors[Math.floor(Math.random() * colors.length)];
};

const colorModel: ColorModel<HslaColor> = {
  defaultColor: getRandomColor(),
  toHsla: (color) => color,
  fromHsla: (color) => color,
  equal: (first, second) =>
    first.h === second.h &&
    first.s === second.s &&
    first.l === second.l &&
    first.a === second.a,
};

const Demo = () => {
  const [color, setColor] = useState<HslaColor>(getRandomColor);

  const textColor =
    getBrightness(color) > 128 || color.a < 0.5 ? "#000" : "#FFF";

  const colorString = `hsla(${color.h}, ${color.s}%, ${color.l}%, ${color.a})`;

  useEffect(() => {
    document.body.style.backgroundColor = colorString;
  }, [color]);

  const handleChange = (color: HslaColor) => {
    console.log("🎨", color);
    setColor(color);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <ColorPicker
        colorModel={colorModel}
        color={color}
        onChange={handleChange}
      />
    </div>
  );
};

ReactDOM.render(<Demo />, document.getElementById("root"));
