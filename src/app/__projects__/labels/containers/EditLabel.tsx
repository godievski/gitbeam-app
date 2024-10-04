import React, { useState, useCallback } from "react";
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
import { KeyboardAwareScrollView } from "../../../../components/Commons/KeyboardAware";
import { useTheme } from "../../../../theme/hooks";
import {
  EditLabelScreenParams,
  EDIT_LABEL_SCREEN_NAME,
} from "../config/navigation";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  selectLabelsByProject,
  updateProjectLabel,
} from "../config/labelsSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useToast } from "../../../../components/Toast/ToastContext";

interface ScreenProps {}

type EditLabelScreenProps = ScreenProps &
  StackScreenTmpProps<EditLabelScreenParams, typeof EDIT_LABEL_SCREEN_NAME>;

const EditLabel: React.FC<EditLabelScreenProps> = ({ navigation, route }) => {
  const { project_id, label } = route.params;

  const dispatch = useAppDispatch();
  const theme = useTheme();
  const toast = useToast();
  const labels = useAppSelector((state) =>
    selectLabelsByProject(state)(project_id)
  );

  const [name, setName] = useState(label.name);
  const [color, setColor] = useState(label.color);
  const [description, setDescription] = useState(label.description);
  const [priority, setPriority] = useState(label.priority);

  const [backgroundColor, setBackgroundColor] = useState(label.color);

  const updateLabelHandler = useCallback(() => {
    const new_label = {
      name,
      color,
      description,
      priority,
    };
    dispatch(
      updateProjectLabel({ project_id, identifier: label.id, data: new_label })
    )
      .then(unwrapResult)
      .then(() => {
        navigation.goBack();
      })
      .catch(toast.updateError);
  }, [name, color, description, priority, project_id, label]);

  const renderTitle = useCallback(
    () => <TitleHeader title={"Edit Label"} />,
    []
  );

  const renderRight = useCallback(() => {
    if (labels.state === CRUDState.updating) {
      return <HeaderIndicator />;
    } else {
      return <ButtonHeader title="Update" onPress={updateLabelHandler} />;
    }
  }, [labels.state, updateLabelHandler]);

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
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        enableOnAndroid={true}
        contentContainerStyle={{ paddingVertical: 10 }}
      >
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
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default React.memo(EditLabel);
