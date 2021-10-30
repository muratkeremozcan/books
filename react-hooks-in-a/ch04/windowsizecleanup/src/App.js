import React, { useState, useEffect } from "react";

function WindowSize() {
  const [size, setSize] = useState(getSize());

  function getSize() {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  useEffect(() => {
    function handleResize() {
      setSize(getSize());
    }

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <p>
      Width: {size.width}, Height: {size.height}
    </p>
  );
}

export default function App() {
  return (
    <div className="App">
      <WindowSize />
    </div>
  );
}
