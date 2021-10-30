import React from "react";

export default function ColorSample({ color }) {
  return color ? (
    <div className="colorSample" style={{ background: color }} />
  ) : null;
}
