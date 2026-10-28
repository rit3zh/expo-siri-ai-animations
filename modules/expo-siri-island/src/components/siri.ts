import { createCompoundComponent } from "../utils";
import { SiriContent } from "./siri-content";
import { SiriPortal } from "./siri-portal";
import { SiriRoot } from "./siri-root";
import { SiriTrigger } from "./siri-trigger";

const Siri = createCompoundComponent("Siri", SiriRoot, {
  Root: SiriRoot,
  Trigger: SiriTrigger,
  Portal: SiriPortal,
  Content: SiriContent,
});

export { Siri };
