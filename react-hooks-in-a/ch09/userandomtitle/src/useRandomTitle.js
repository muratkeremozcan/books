import { useState } from "react";
import useDocumentTitle from "./useDocumentTitle";

const getRandomIndex = length => Math.floor(Math.random() * length);

export default function useRandomTitle(titles = ["Hello"]) {
  const [index, setIndex] = useState(() => getRandomIndex(titles.length));

  useDocumentTitle(titles[index]);

  return () => setIndex(getRandomIndex(titles.length));
}
