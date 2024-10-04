import React from "react";
import IconThemed from "./IconThemed";
import { GENERAL_ICON_SIZE } from "../../core/styles/general";

export const IconCheck: React.FC<{}> = (props) => {
  return (
    <IconThemed
      type="ionicon"
      name="checkmark-outline"
      size={GENERAL_ICON_SIZE}
    />
  );
};

export const renderIconCheck = () => <IconCheck />;
