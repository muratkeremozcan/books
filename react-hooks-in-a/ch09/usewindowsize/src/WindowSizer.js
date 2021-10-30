import React from "react";
import useWindowSize from "./useWindowSize";

export default function WindowSizer() {
  const { width, height } = useWindowSize();

  return (
    <p>
      Width: {width}, Height: {height}
    </p>
  );
}
