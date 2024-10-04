import { useAppSelector } from "../../../../store/hooks";

export const useSelectorUser = () => useAppSelector((state) => state.user);
