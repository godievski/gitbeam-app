import { createContext } from "react";

export type ModalvskiContextValue = {
  open: () => void;
  close: () => void;
};

const ModalvskiContext = createContext<ModalvskiContextValue>({
  open: () => {},
  close: () => {},
});

export default ModalvskiContext;
