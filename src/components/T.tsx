import React from "react";
import { useT } from "@/hooks/useTranslate";

/** Wrap any English string to auto-translate to the active language. */
export const T: React.FC<{ children: string }> = ({ children }) => {
  const v = useT(children);
  return <>{v}</>;
};

export default T;
