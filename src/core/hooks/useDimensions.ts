import { useState, useEffect } from "react";
import { Dimensions } from "react-native";

export const isOrientationLandscape = ({ width, height }) => width > height;

type DeviceOrientation = "landscape" | "portrait";

type DimensionState = {
  orientation: DeviceOrientation;
  width: number;
  height: number;
  isLandscape: boolean;
};

const useDimensions = () => {
  const [dimensions, setDimensions] = useState<DimensionState>(() => {
    const d = Dimensions.get("screen");
    const isLandscape = isOrientationLandscape(d);
    return {
      orientation: isLandscape ? "landscape" : "portrait",
      isLandscape,
      ...d,
    };
  });

  useEffect(() => {
    function updateState() {
      const { height, width } = Dimensions.get("window");
      const d = Dimensions.get("screen");
      const isLandscape = isOrientationLandscape(d);
      setDimensions({
        orientation: isLandscape ? "landscape" : "portrait",
        isLandscape,
        ...d,
      });
    }

    updateState(); // for initial render
    Dimensions.addEventListener("change", updateState);
    return () => Dimensions.removeEventListener("change", updateState);
  }, []);

  return dimensions;
};
export default useDimensions;
