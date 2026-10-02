import { createContext } from "react";

/** True while descendants are rendered inside an Expo UI native Host. */
export const WithinHostContext = createContext(false);
