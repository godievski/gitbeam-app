import React, { useCallback, useState } from "react";
import Header from "../../../../components/Header/Header";
import { View, TextInput } from "react-native";
import ButtonHeader from "../../../../components/Buttons/ButtonHeader";
import ItemGroup from "../../../../components/Group/ItemGroup";
import ItemInput from "../../../../components/Group/ItemInput";
import ItemComponent from "../../../../components/Group/ItemComponent";
import HeaderIndicator from "../../../../components/Header/HeaderIndicator";
import Container from "../../../../components/Layouts/Container";
import { CRUDState, StackScreenTmpProps } from "../../../../core/utils";
import TitleHeader from "../../../../components/Header/TitleHeader";
import ScrollView from "../../../../components/RN/ScrollView";
import { useTheme } from "../../../../theme/hooks";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  NewLabelScreenParams,
  NEW_LABEL_SCREEN_NAME,
} from "../config/navigation";
import { addProjectLabel, selectLabelsByProject } from "../config/labelsSlice";
import { useToast } from "../../../../components/Toast/ToastContext";
import { unwrapResult } from "@reduxjs/toolkit";

interface ScreenProps {}

type NewLabelScreenProps = ScreenProps &
  StackScreenTmpProps<NewLabelScreenParams, typeof NEW_LABEL_SCREEN_NAME>;

const NewLabel: React.FC<NewLabelScreenProps> = ({ navigation, route }) => {
  const { project_id } = route.params;

  const dispatch = useAppDispatch();
  const labels = useAppSelector((state) =>
    selectLabelsByProject(state)(project_id)
  );
  const toast = useToast();
  const theme = useTheme();

  const [name, setName] = useState("");
  const [color, setColor] = useState("#428BCA");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<number | null>(null);

  const [backgroundColor, setBackgroundColor] = useState(color);

  const createLabelHandler = useCallback(() => {
    const label = {
      name,
      color,
      description,
      priority,
    };

    dispatch(addProjectLabel({ project_id, data: label }))
      .then(unwrapResult)
      .then(() => {
        navigation.goBack();
      })
      .catch(toast.updateError);
  }, [name, color, description, priority, project_id]);

  const renderTitle = useCallback(
    () => <TitleHeader title={"New Label"} />,
    []
  );

  const renderRight = useCallback(
    () =>
      labels.state === CRUDState.updating ? (
        <HeaderIndicator />
      ) : (
        <ButtonHeader title="Create" onPress={createLabelHandler} />
      ),
    [createLabelHandler, labels.state]
  );

  const onChangeBGColor = useCallback((text: string) => {
    const hex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    const valid = text.match(hex);
    setBackgroundColor(text);
    if (valid) {
      setColor(text);
    }
  }, []);

  return (
    <Container>
      <Header
        center={renderTitle}
        right={renderRight}
        isModal={true}
        backBtn={true}
      />
      <ScrollView paddingTop={true} style={{ flex: 1 }}>
        <ItemGroup>
          <ItemInput
            label="TITLE"
            placeholder="(required)"
            onChangeText={setName}
            value={name}
          />

          <ItemInput
            label="DESCRIPTION"
            placeholder="(optional)"
            onChangeText={setDescription}
            value={description}
          />

          <ItemComponent label="BACKGROUND COLOR" borderBottom={false}>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View
                style={{
                  backgroundColor: color,
                  height: 32,
                  width: 32,
                  borderRadius: 6,
                  marginRight: 6,
                }}
              />
              <TextInput
                value={backgroundColor}
                onChangeText={onChangeBGColor}
                style={{
                  fontSize: 16,
                  color: theme.colors.text_primary,
                  borderBottomWidth: 0,
                  flex: 1,
                }}
              />
            </View>
          </ItemComponent>
        </ItemGroup>
      </ScrollView>
    </Container>
  );
};

export default React.memo(NewLabel);
