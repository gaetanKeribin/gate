import * as React from "react";
export const isMountedRef = React.createRef();

export const navigationRef = React.createRef();

export function navigate(name, params) {
  if (isMountedRef.current && navigationRef.current) {
    navigationRef.current.navigate(name, params);
  } else {
  }
}
export function openDrawer() {
  navigationRef.current?.openDrawer();
}
