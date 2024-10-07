import { useRef } from "react";
import { Color, ColorModel, ColorPickerBaseProps } from "../types/color";
import React from "react";
import { HueRing } from "./common/hue-ring";
import { useColorManipulation } from "../hooks/useColor";
import { cn } from "../utils/cn";
import { SaturationLightnessTriangle } from "./common/saturation-lightness-triangle";

interface Props<T extends Color> extends Partial<ColorPickerBaseProps<T>> {
  colorModel: ColorModel<T>;
}

export const ColorPicker = <T extends Color>({
  className,
  colorModel,
  color = colorModel.defaultColor,
  onChange,
  ...rest
}: Props<T>): JSX.Element => {
  const nodeRef = useRef<HTMLDivElement>(null);

  const [hsla, updateHsla] = useColorManipulation<T>(
    colorModel,
    color,
    onChange
  );

  return (
    <div
      {...rest}
      ref={nodeRef}
      className={cn(
        "relative flex flex-col w-[200px] h-[200px] select-none cursor-default bg-neutral-500	rounded-lg",
        className
      )}
    >
      <HueRing hue={hsla.h} onChange={updateHsla} className="" />
      <SaturationLightnessTriangle
        hue={hsla.h}
        onChange={updateHsla}
        triangleCenter={{ x: 100, y: 100 }}
        radius={72}
      />
    </div>
  );
};
