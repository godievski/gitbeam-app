import React, { useCallback } from "react";
import Container from "../../../../components/Layouts/Container";
import { Platform } from "react-native";
import ItemGroup from "../../../../components/Group/ItemGroup";
import ItemStatic from "../../../../components/Group/ItemStatic";
import ItemPressable from "../../../../components/Group/ItemPressable";
import Header from "../../../../components/Header/Header";
import { iOSColors } from "react-native-typography";
import TitleHeader from "../../../../components/Header/TitleHeader";
import { goToAcknowledgements } from "../../acknowledgements/config/navigation";
import { goToAbout } from "../../about/config/navigation";
import { goToCustomizeKeyboard } from "../../customize-keyboard/config/navigation";
import { goToEditorSettings } from "../../editor-setting/config/navigation";
import { goToThemeSettings } from "../../highlight-setting/config/navigation";
import TextThemed from "../../../../components/Commons/TextThemed";
import ItemOuter from "../../../../components/Group/ItemOuter";
import ScrollView from "../../../../components/RN/ScrollView";
import { useSelectorUser } from "../../../__profile__/profile/config/selectors";
import { StackScreenTmpProps } from "../../../../core/utils";
import {
  SETTINGS_SCREEN_NAME,
  SettingsScreenParams,
} from "../config/navigation";
import { revokeCredential } from "../../../auth/config/authSlice";
import { useAppDispatch } from "../../../../store/hooks";

interface ScreenProps {}

type SettingsScreenProps = ScreenProps &
  StackScreenTmpProps<SettingsScreenParams, typeof SETTINGS_SCREEN_NAME>;

const Settings: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();

  const user = useSelectorUser();

  const signout = useCallback(() => {
    dispatch(revokeCredential());
  }, []);

  const onPressPreviewTheme = useCallback(() => {
    navigation.dispatch(goToThemeSettings());
  }, []);

  const onPressCustKeyb = useCallback(() => {
    navigation.dispatch(goToCustomizeKeyboard());
  }, []);

  const onPressAbout = useCallback(() => {
    navigation.dispatch(goToAbout());
  }, []);

  const onPressAcknowledgements = useCallback(() => {
    navigation.dispatch(goToAcknowledgements());
  }, []);

  const onPressEditTheme = useCallback(() => {
    navigation.dispatch(goToEditorSettings());
  }, []);

  const renderTitle = useCallback(() => <TitleHeader title={"Settings"} />, []);

  return (
    <Container>
      <Header center={renderTitle} backBtn={false} burgerBtn={true} />
      <ScrollView style={{ flex: 1 }} paddingTop={true}>
        <ItemGroup label="Account">
          <ItemStatic label="EMAIL" value={user.data.email} />
          <ItemStatic
            label="USERNAME"
            value={user.data.username}
            borderBottom={false}
          />
        </ItemGroup>

        <ItemGroup label="Syntax Highlighter">
          <ItemPressable
            title="Theme"
            onPress={onPressPreviewTheme}
            chevron={true}
          />
          <ItemPressable
            title="Editor"
            onPress={onPressEditTheme}
            chevron={true}
            borderBottom={Platform.OS == "ios"}
          />
          {Platform.OS == "ios" && (
            <ItemPressable
              title="Customize Keyboard"
              onPress={onPressCustKeyb}
              chevron={true}
              borderBottom={false}
            />
          )}
        </ItemGroup>

        <ItemGroup>
          <ItemPressable title="About" onPress={onPressAbout} chevron={true} />
          <ItemPressable
            title="Acknowledgements"
            onPress={onPressAcknowledgements}
            chevron={true}
            borderBottom={false}
          />
        </ItemGroup>

        <ItemGroup>
          <ItemPressable
            title="Sign out"
            titleStyle={{
              color: iOSColors.red,
            }}
            onPress={signout}
            borderBottom={false}
          />
        </ItemGroup>

        <ItemOuter>
          <TextThemed type="foot">
            When you sign out, all the changes you made will be deleted and it
            cannot be restored
          </TextThemed>
        </ItemOuter>
      </ScrollView>
    </Container>
  );
};

export default React.memo(Settings);
