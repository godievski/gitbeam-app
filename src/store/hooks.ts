import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from "./rootReducer";
import { AppDispatch } from "./store";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export type ThunkDispatchType = ReturnType<typeof useAppDispatch>;
