"use client";
import { ReactNode, useState } from "react";
import { DevelopmentContext } from "./contexts";

export default function DevelopmentContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [prod, setProd] = useState<boolean>(false);

  return (
    <DevelopmentContext.Provider value={{ prod, setProd }}>
      {children}
    </DevelopmentContext.Provider>
  );
}
