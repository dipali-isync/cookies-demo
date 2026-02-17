"use client";

import { ReactNode, useState } from "react";
import { Provider } from "react-redux";
import { AppStore, makeStore } from "@/store/store";

export default function StoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState<AppStore>(() => makeStore());

  return <Provider store={store}>{children}</Provider>;
}
