import React, { useState } from "react";

import ColorPicker from "./ColorPicker";
import ColorChoiceText from "./ColorChoiceText";
import ColorSample from "./ColorSample";

export default function Colors() {
  const availableColors = ["skyblue", "goldenrod", "teal", "coral"];
  const [color, setColor] = useState(availableColors[0]);

  return (
    <div className="colors">
      <ColorPicker colors={availableColors} color={color} setColor={setColor} />
      <ColorChoiceText color={color} />
      <ColorSample color={color} />
    </div>
  );
}
