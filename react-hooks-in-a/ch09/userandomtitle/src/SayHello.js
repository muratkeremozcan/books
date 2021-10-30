import React from "react";
import useRandomTitle from "./useRandomTitle";

const greetings = ["Hello", "Ciao", "Hola", "こんにちは"];

export default function SayHello() {
  const nextTitle = useRandomTitle(greetings);

  return <button onClick={nextTitle}>Say Hi</button>;
}
