import { current } from "@reduxjs/toolkit";
import { useEffect } from "react";

export const useConsoleLog = (data: any) => {
  useEffect(() => {
    console.log(current(data));
  }, [data]);
};
