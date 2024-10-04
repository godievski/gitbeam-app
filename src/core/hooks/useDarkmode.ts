import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useColorScheme } from "react-native";
import { updateDarkMode } from "../../theme/themeSlice";

const useDarkmode = () => {
  const dispatch = useDispatch();
  const color = useColorScheme();
  const isDeviceDark = color == "dark";

  useEffect(() => {
    dispatch(updateDarkMode(isDeviceDark));
  }, [isDeviceDark]);
};

export default useDarkmode;
