import React from "react";

// Mock leve do react-native-svg para o jest. Cada primitivo SVG vira um
// elemento host neutro, suficiente para a árvore renderizar nos testes.
const svg =
  (tag: string) =>
  ({ children, ...props }: any) =>
    React.createElement(tag, props, children);

const Svg = svg("Svg");
export default Svg;

export const Circle = svg("Circle");
export const Defs = svg("Defs");
export const LinearGradient = svg("LinearGradient");
export const RadialGradient = svg("RadialGradient");
export const Stop = svg("Stop");
export const Path = svg("Path");
export const Rect = svg("Rect");
export const G = svg("G");
export const Text = svg("Text");
