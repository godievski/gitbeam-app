import React, { useCallback } from "react";
import { DispatchProp } from "react-redux";
import FontFamilyItem from "../components/FontFamilyItem";
import Header from "../../../../components/Header/Header";
import Container from "../../../../components/Layouts/Container";
import TitleHeader from "../../../../components/Header/TitleHeader";
import FlatList from "../../../../components/RN/FlatList";
import { useAppSelector, useAppDispatch } from "../../../../store/hooks";
import { updateFontFamilyEditor } from "../config/editorSettingsSlice";
import { fontFamliyOptions } from "../config/constants";

interface ScreenProps {}

type EditorFontFamilyProps = ScreenProps & DispatchProp;

const EditorFontFamily: React.FC<EditorFontFamilyProps> = ({}) => {
  const dispatch = useAppDispatch();
  const editorConfig = useAppSelector((state) => state.editorConfig);

  const onPressItem = useCallback((item) => {
    dispatch(updateFontFamilyEditor(item));
  }, []);

  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <FontFamilyItem
          item={item}
          onPress={onPressItem}
          selected={editorConfig.fontFamily.id === item.id}
        />
      );
    },
    [editorConfig, onPressItem]
  );

  const renderTitle = useCallback(
    () => <TitleHeader title={"Font Family"} />,
    []
  );

  return (
    <Container>
      <Header center={renderTitle} isModal={true} backBtn={false} />
      <FlatList
        data={fontFamliyOptions}
        keyExtractor={(item) => `font-familiy-item-${item.id}`}
        extraData={editorConfig.fontFamily}
        renderItem={renderItem}
      />
    </Container>
  );
};

export default React.memo(EditorFontFamily);
