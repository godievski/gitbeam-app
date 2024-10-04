import React, { useCallback } from "react";
import ItemGroup from "../../../../components/Group/ItemGroup";
import ItemComponent from "../../../../components/Group/ItemComponent";
import TextSizeOptions from "../components/TextSizeOptions";
import ThemeOptions from "../components/ThemeOptions";
import ItemSelect from "../../../../components/Group/ItemSelect";
import {
  goToEditorFontFamily,
  EditorSettingsScreenParams,
  EDITOR_SETTINGS_SCREEN_NAME,
} from "../config/navigation";
import Header from "../../../../components/Header/Header";
import Container from "../../../../components/Layouts/Container";
import TitleHeader from "../../../../components/Header/TitleHeader";
import ScrollView from "../../../../components/RN/ScrollView";
import { StackScreenTmpProps } from "../../../../core/utils";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  updateTextSizeEditor,
  updateThemeEditor,
} from "../config/editorSettingsSlice";

interface ScreenProps {}

type EditorSettingsScreenProps = ScreenProps &
  StackScreenTmpProps<
    EditorSettingsScreenParams,
    typeof EDITOR_SETTINGS_SCREEN_NAME
  >;

const EditorSettings: React.FC<EditorSettingsScreenProps> = ({
  navigation,
}) => {
  const dispatch = useAppDispatch();
  const editorConfig = useAppSelector((state) => state.editorConfig);

  const selectTextSize = useCallback((size) => {
    dispatch(updateTextSizeEditor(size));
  }, []);

  const selectTheme = useCallback((theme) => {
    dispatch(updateThemeEditor(theme));
  }, []);

  const onPressFontFamily = useCallback(() => {
    navigation.dispatch(goToEditorFontFamily());
  }, []);

  const renderTitle = () => <TitleHeader title={"Editor"} />;

  return (
    <Container>
      <Header center={renderTitle} isModal={true} backBtn={false} />
      <ScrollView paddingTop={true}>
        <ItemGroup>
          <ItemComponent label="TEXT SIZE">
            <TextSizeOptions
              selectSize={selectTextSize}
              selectedSize={editorConfig.size}
            />
          </ItemComponent>
          <ItemComponent label="THEME">
            <ThemeOptions
              selectTheme={selectTheme}
              selectedTheme={editorConfig.theme}
            />
          </ItemComponent>
          <ItemSelect
            label="FONT FAMILY"
            value={editorConfig.fontFamily.name}
            valueStyle={{
              fontFamily: editorConfig.fontFamily.value,
            }}
            onPress={onPressFontFamily}
            borderBottom={false}
          />
        </ItemGroup>
      </ScrollView>
    </Container>
  );
};
export default React.memo(EditorSettings);
