import React, { memo, useCallback } from "react";
import Header from "../../../../components/Header/Header";
import OpenSourceItem from "../components/OpenSourceItem";
import { open_sources } from "../config/constants";
import TitleHeader from "../../../../components/Header/TitleHeader";
import Container from "../../../../components/Layouts/Container";
import TextThemed from "../../../../components/Commons/TextThemed";
import { GENERAL_CONTAINER_PADDING_HORIZONTAL } from "../../../../core/styles/general";
import ScrollView from "../../../../components/RN/ScrollView";

interface Props {}

const Acknowledgements: React.FC<Props> = (props) => {
  const __title__ = useCallback(
    () => <TitleHeader title="Acknowledgements" />,
    []
  );

  return (
    <Container>
      <Header center={__title__} isModal={true} backBtn={false} />
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: GENERAL_CONTAINER_PADDING_HORIZONTAL,
        }}
      >
        <TextThemed
          style={{
            width: "100%",
            textAlign: "center",
            fontSize: 18,
            paddingVertical: 10,
          }}
        >
          All open source used to make this app:
        </TextThemed>
        {open_sources.map((item, index) => {
          return <OpenSourceItem key={index} name={item.name} />;
        })}
      </ScrollView>
    </Container>
  );
};

export default memo(Acknowledgements);
