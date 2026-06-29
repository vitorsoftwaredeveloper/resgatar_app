import React from "react";

// Toast é usado tanto como componente (<Toast />) quanto como API (Toast.show)
const Toast = Object.assign(
  () => null,
  {
    show: jest.fn(),
    hide: jest.fn(),
  },
);

export default Toast;

export const BaseToast = (props: any) => React.createElement("BaseToast", props);
export const ErrorToast = (props: any) => React.createElement("ErrorToast", props);
