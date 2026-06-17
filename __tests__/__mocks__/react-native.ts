import React from "react";

export const Platform = {
  OS: "android",
  select: jest.fn((obj: any) => obj.android ?? obj.default),
};

export const Alert = { alert: jest.fn() };
export const Linking = { openURL: jest.fn() };

export const StyleSheet = {
  create: (styles: Record<string, any>) => styles,
  flatten: (style: any) => style,
  hairlineWidth: 1,
};

export const Dimensions = {
  get: jest.fn(() => ({ width: 375, height: 812 })),
};

export const Animated = {
  Value: jest.fn(() => ({ interpolate: jest.fn(), setValue: jest.fn() })),
  View: ({ children }: any) => React.createElement("View", null, children),
  timing: jest.fn(() => ({ start: jest.fn() })),
  spring: jest.fn(() => ({ start: jest.fn() })),
};

export const useColorScheme = jest.fn(() => "light");

export const View = ({ children, style, ...props }: any) =>
  React.createElement("View", { style, ...props }, children);

export const Text = ({ children, style, ...props }: any) =>
  React.createElement("Text", { style, ...props }, children);

export const TextInput = ({ onFocus, onBlur, ...props }: any) =>
  React.createElement("TextInput", {
    ...props,
    onFocus,
    onBlur,
  });

export const TouchableOpacity = ({ children, onPress, disabled, style, ...props }: any) =>
  React.createElement(
    "TouchableOpacity",
    {
      ...props,
      style,
      onPress: disabled ? undefined : onPress,
      accessibilityState: { disabled: !!disabled },
    },
    children,
  );

export const Pressable = ({ children, onPress, style, ...props }: any) =>
  React.createElement(
    "Pressable",
    { ...props, style: typeof style === "function" ? style({}) : style, onPress },
    typeof children === "function" ? children({}) : children,
  );

export const ActivityIndicator = (props: any) =>
  React.createElement("ActivityIndicator", props);

export const ScrollView = ({ children, ...props }: any) =>
  React.createElement("ScrollView", props, children);

export const FlatList = ({ data, renderItem, keyExtractor, ...props }: any) =>
  React.createElement(
    "FlatList",
    props,
    data?.map((item: any, index: number) =>
      React.createElement(
        React.Fragment,
        { key: keyExtractor ? keyExtractor(item, index) : index },
        renderItem({ item, index }),
      ),
    ),
  );

export const Modal = ({ children, visible, ...props }: any) =>
  visible ? React.createElement("Modal", props, children) : null;

export const Image = (props: any) => React.createElement("Image", props);
