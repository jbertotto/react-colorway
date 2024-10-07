import React from 'react'

export interface RgbColor {
  r: number
  g: number
  b: number
}

export interface RgbaColor extends RgbColor {
  a: number
}

export interface HslColor {
  h: number
  s: number
  l: number
}

export interface HslaColor extends HslColor {
  a: number
}

export interface HsvColor {
  h: number
  s: number
  v: number
}

export interface HsvaColor extends HsvColor {
  a: number
}

export type ColorSpaces = RgbColor | HslColor | HsvColor | RgbaColor | HslaColor | HsvaColor

export type HexColor = string

export type Color = ColorSpaces | HexColor

export interface ColorModel<T extends Color> {
  defaultColor: T
  toHsla: (defaultColor: T) => HslaColor
  fromHsla: (hsla: HslaColor) => T
  equal: (first: T, second: T) => boolean
}

type ColorPickerHTMLAttributes = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'color' | 'onChange' | 'onChangeCapture'
>

export interface ColorPickerBaseProps<T extends Color> extends ColorPickerHTMLAttributes {
  color: T
  onChange: (newColor: T) => void
}

type ColorInputHTMLAttributes = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
>

export interface ColorInputBaseProps extends ColorInputHTMLAttributes {
  color?: string
  onChange?: (newColor: string) => void
}
