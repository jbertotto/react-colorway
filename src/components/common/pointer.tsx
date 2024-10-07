import React from "react";
import { cn } from "../../utils/cn";

interface Props {
  className?: string;
  top?: number;
  left: number;
  color: string;
}

export const Pointer = ({
  className,
  color,
  left,
  top = 0.5,
}: Props): JSX.Element => {
  const style = {
    top: `${top * 100}%`,
    left: `${left * 100}%`,
  };

  return (
    <div
      className={cn(
        "absolute z-[1] box-border w-4 h-4 -translate-x-2/4 -translate-y-2/4 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.2)] rounded-[50%] border-2 border-solid border-white",
        className
      )}
      style={style}
    >
      <div
        className={`content-[""] absolute pointer-events-none rounded-[inherit] inset-0`}
        style={{ backgroundColor: color }}
      />
    </div>
  );
};
