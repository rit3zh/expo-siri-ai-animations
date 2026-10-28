import { use } from "react";

import { SiriContext } from "../context";
import type { ISiriContext } from "../interfaces";

function useSiriContext<T extends string>(consumerName: T): ISiriContext {
  const context = use(SiriContext);
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`Siri.Root\`.`);
  }
  return context;
}

export { useSiriContext };
