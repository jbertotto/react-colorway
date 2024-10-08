import { ColorSpaces } from "../types/color";

export const equalColorObjects = (
  first: ColorSpaces,
  second: ColorSpaces
): boolean => {
  if (first === second) return true;

  for (const prop in first) {
    // The following allows for a type-safe calling of this function (first & second have to be HSL, HSV, or RGB)
    // with type-unsafe iterating over object keys. TS does not allow this without an index (`[key: string]: number`)
    // on an object to define how iteration is normally done. To ensure extra keys are not allowed on our types,
    // we must cast our object to unknown (as RGB demands `r` be a key, while `Record<string, x>` does not care if
    // there is or not), and then as a type TS can iterate over.
    if (
      (first as unknown as Record<string, number>)[prop] !==
      (second as unknown as Record<string, number>)[prop]
    )
      return false;
  }

  return true;
};

export const equalColorString = (first: string, second: string): boolean => {
  return first.replace(/\s/g, "") === second.replace(/\s/g, "");
};
