import { createContext } from "react";

import type { ISiriContext } from "../interfaces";

const SiriContext = createContext<ISiriContext | null>(null);

SiriContext.displayName = "SiriContext";

export { SiriContext };
