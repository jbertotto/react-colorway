import { useState, useEffect, useCallback, useRef } from "react";
import { ColorModel, Color, HslaColor } from "../types/color"; // Updated import
import { equalColorObjects } from "../utils/compare";

export function useColorManipulation<T extends Color>(
  colorModel: ColorModel<T>,
  color: T,
  onChange?: (color: T) => void
): [HslaColor, (color: Partial<HslaColor>) => void] {
  // Change return type to HslaColor
  const onChangeCallback = useEventCallback<T>(onChange);
  const [hsla, updateHsla] = useState<HslaColor>(() =>
    colorModel.toHsla(color)
  ); // Updated to HslaColor

  const cache = useRef({ color, hsla });

  useEffect(() => {
    if (!colorModel.equal(color, cache.current.color)) {
      const newHsla = colorModel.toHsla(color); // Convert to HSLA
      cache.current = { hsla: newHsla, color };
      updateHsla(newHsla);
    }
  }, [color, colorModel]);

  useEffect(() => {
    let newColor: T;
    if (
      !equalColorObjects(hsla, cache.current.hsla) &&
      !colorModel.equal(
        (newColor = colorModel.fromHsla(hsla)),
        cache.current.color
      ) // Updated to fromHsla
    ) {
      cache.current = { hsla, color: newColor };
      onChangeCallback(newColor);
    }
  }, [hsla, colorModel, onChangeCallback]);

  const handleChange = useCallback((params: Partial<HslaColor>) => {
    updateHsla((current) => ({ ...current, ...params })); // Spread operator for merging
  }, []);

  return [hsla, handleChange];
}

export function useEventCallback<T>(
  handler?: (value: T) => void
): (value: T) => void {
  const callbackRef = useRef(handler);
  const fn = useRef((value: T) => {
    callbackRef.current?.(value); // Optional chaining for cleaner code
  });
  callbackRef.current = handler;

  return fn.current;
}
