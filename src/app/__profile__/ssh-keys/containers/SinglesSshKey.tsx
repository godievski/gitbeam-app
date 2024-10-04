import React, { useCallback, useContext, useRef } from "react";
import IconFA from "react-native-vector-icons/FontAwesome5";
import Header from "../../../../components/Header/Header";
import { StackScreenTmpProps } from "../../../../core/utils";
import TitleHeader from "../../../../components/Header/TitleHeader";
import {
  SingleSshKeyParams,
  SINGLE_SSH_KEY_SCREEN_NAME,
} from "../config/navigation";
import {
  TOAST_TYPES,
  ToastContext,
} from "../../../../components/Toast/ToastContext";
import Container from "../../../../components/Layouts/Container";
import { GENERAL_ICON_SIZE } from "../../../../core/styles/general";
import ItemGroup from "../../../../components/Group/ItemGroup";
import ItemStatic from "../../../../components/Group/ItemStatic";
import { Modalvski } from "../../../../components/Modalvski/Modalvski";
import ItemPressable from "../../../../components/Group/ItemPressable";
import Clipboard from "@react-native-community/clipboard";
import IconThemed from "../../../../components/Icons/IconThemed";
import ScrollView from "../../../../components/RN/ScrollView";
import ButtonHeader from "../../../../components/Buttons/ButtonHeader";

type ScreenProps = {};

type SingleSshKeyScreenProps = ScreenProps &
  StackScreenTmpProps<SingleSshKeyParams, typeof SINGLE_SSH_KEY_SCREEN_NAME>;

const SingleSshKey: React.FC<SingleSshKeyScreenProps> = ({ route }) => {
  const modal = useRef<Modalvski>(null);

  const toast = useContext(ToastContext);

  const ssh_key = route.params.ssh_key;

  const copySshKeyHandler = useCallback(() => {
    Clipboard.setString(ssh_key.key);
    toast.updateMessage({
      status: TOAST_TYPES.NORMAL,
      message: "Coppied",
    });
  }, [ssh_key]);

  const showMenu = useCallback(() => {
    modal.current?.open();
  }, []);

  const TitleComp = useCallback(() => {
    return <TitleHeader title={ssh_key.title} />;
  }, [ssh_key.title]);

  const RightComp = useCallback(() => {
    return (
      <ButtonHeader
        onPress={showMenu}
        icon={
          <IconFA size={GENERAL_ICON_SIZE} name="ellipsis-h" color="#fff" />
        }
      />
    );
  }, [showMenu]);

  return (
    <Container>
      <Header center={TitleComp} right={RightComp} isModal={true} />
      <ScrollView style={{ flex: 1 }} paddingTop={true}>
        <ItemGroup label={"Title"}>
          <ItemStatic value={ssh_key.title} borderBottom={false} />
        </ItemGroup>
        <ItemGroup label={"Key"}>
          <ItemStatic
            value={ssh_key.key}
            valueProps={{
              selectable: true,
            }}
            borderBottom={false}
          />
        </ItemGroup>
      </ScrollView>
      <Modalvski ref={modal} cancelBtn>
        <ItemGroup>
          <ItemPressable
            title="Copy Key"
            renderIcon={() => (
              <IconThemed
                type="fontawesome"
                name="clipboard"
                size={GENERAL_ICON_SIZE}
              />
            )}
            onPress={copySshKeyHandler}
            borderBottom={false}
          />
        </ItemGroup>
      </Modalvski>
    </Container>
  );
};

export default SingleSshKey;
