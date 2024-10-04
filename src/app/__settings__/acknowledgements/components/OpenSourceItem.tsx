import React, { memo } from "react";
import TextThemed from "../../../../components/Commons/TextThemed";

interface Props {
  name: string;
}

const OpenSourceItem: React.FC<Props> = ({ name }) => {
  return (
    <TextThemed
      style={{ paddingVertical: 3, width: "100%", textAlign: "center" }}
    >
      {name}
    </TextThemed>
  );
};

export default memo(OpenSourceItem);
