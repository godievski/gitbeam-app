import { useAppSelector } from "../store/hooks";

export const useTheme = () => useAppSelector((state) => state.theme);
