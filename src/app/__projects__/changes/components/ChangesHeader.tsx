import React, { useCallback, useImperativeHandle, forwardRef } from "react";
import Header from "../../../../components/Header/Header";
import ButtonHeader from "../../../../components/Buttons/ButtonHeader";
import TitleHeader from "../../../../components/Header/TitleHeader";
import { View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { GENERAL_ICON_HEADER_SIZE } from "../../../../core/styles/general";
import IconFA from "react-native-vector-icons/FontAwesome5";
import IconGit from "../../../../components/Icons/IconGit";
import ButtonBack from "../../../../components/Buttons/ButtonBack";

export type ChangesHeaderHandler = {
  animateChange: () => void;
};

type ChangesHeaderProps = {
  editing: boolean;
  subtitle: string;
  selectAll: () => void;
  deleteChangeSelected: () => void;
  toggleEditing: () => void;
  goToBranchesFromChanges: () => void;
};

const ChangesHeader: React.FC<ChangesHeaderProps> = ({
  editing,
  subtitle,
  selectAll,
  deleteChangeSelected,
  toggleEditing,
  goToBranchesFromChanges,
}) => {
  const renderTitle = useCallback(() => {
    if (editing) {
      return null;
    }
    return <TitleHeader title="Changes" subtitle={subtitle} />;
  }, [subtitle, editing]);

  const renderLeftHeader = useCallback(() => {
    return editing ? (
      <ButtonHeader title="Select All" onPress={selectAll} />
    ) : (
      <ButtonBack />
    );
  }, [editing, selectAll]);

  const renderRightHeader = useCallback(() => {
    return editing ? (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <ButtonHeader
          onPress={deleteChangeSelected}
          icon={
            <Icon
              name="trash-outline"
              size={GENERAL_ICON_HEADER_SIZE}
              color="#fff"
            />
          }
        />
        <ButtonHeader title="Cancel" onPress={toggleEditing} />
      </View>
    ) : (
      <View style={{ flexDirection: "row" }}>
        <ButtonHeader
          onPress={toggleEditing}
          icon={
            <IconFA
              name="check-square"
              size={20}
              color="#fff"
              style={{ paddingHorizontal: 6 }}
            />
          }
        />
        <ButtonHeader
          onPress={goToBranchesFromChanges}
          icon={<IconGit name="branch" size={20} color="#fff" />}
        />
      </View>
    );
  }, [editing, deleteChangeSelected, toggleEditing, goToBranchesFromChanges]);

  return (
    <Header
      left={renderLeftHeader}
      right={renderRightHeader}
      center={renderTitle}
    />
  );
};

export default React.memo(ChangesHeader);
