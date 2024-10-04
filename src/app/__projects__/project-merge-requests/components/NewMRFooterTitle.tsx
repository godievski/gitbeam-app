import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import TextThemed from "../../../../components/Commons/TextThemed";
import { GREEN_COLOR } from "../../../../core/styles/colors";
import ItemOuter from "../../../../components/Group/ItemOuter";

interface Props {
  title: string;
  addWIP: () => any;
  removeWIP: () => any;
}

const styles = StyleSheet.create({
  view: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
});

const NewMRFooterTitle: React.FC<Props> = (props) => {
  const { title, addWIP, removeWIP } = props;

  const show_add_wip = !title.startsWith("WIP:");

  if (show_add_wip) {
    return (
      <ItemOuter style={styles.view}>
        <TouchableOpacity onPress={addWIP} style={{ alignSelf: "flex-start" }}>
          <TextThemed style={{ color: GREEN_COLOR }}>
            Start the title with
            <TextThemed style={{ fontWeight: "bold", color: GREEN_COLOR }}>
              {" WIP:"}
            </TextThemed>
          </TextThemed>
        </TouchableOpacity>
        <TextThemed>{" to prevent a "}</TextThemed>
        <TextThemed style={{ fontWeight: "bold" }}>
          {"Work In Progress "}
        </TextThemed>
        <TextThemed>{"merge "}</TextThemed>
        <TextThemed>{"request "}</TextThemed>
        <TextThemed>{"from "}</TextThemed>
        <TextThemed>{"being "}</TextThemed>
        <TextThemed>{"merged "}</TextThemed>
        <TextThemed>{"before "}</TextThemed>
        <TextThemed>{"it's "}</TextThemed>
        <TextThemed>{"ready."}</TextThemed>
      </ItemOuter>
    );
  } else {
    return (
      <ItemOuter style={styles.view}>
        <TouchableOpacity onPress={removeWIP}>
          <TextThemed style={{ color: GREEN_COLOR }}>
            Remove the
            <TextThemed style={{ fontWeight: "bold", color: GREEN_COLOR }}>
              {" WIP: "}
            </TextThemed>
            {"prefix from the title "}
          </TextThemed>
        </TouchableOpacity>
        <TextThemed>{"to "}</TextThemed>
        <TextThemed>{"allow "}</TextThemed>
        <TextThemed>{"this "}</TextThemed>
        <TextThemed style={{ fontWeight: "bold" }}>Work </TextThemed>
        <TextThemed style={{ fontWeight: "bold" }}>In </TextThemed>
        <TextThemed style={{ fontWeight: "bold" }}>Progress </TextThemed>
        <TextThemed>{"merge "}</TextThemed>
        <TextThemed>{"request "}</TextThemed>
        <TextThemed>{"to "}</TextThemed>
        <TextThemed>{"be "}</TextThemed>
        <TextThemed>{"merged "}</TextThemed>
        <TextThemed>{"when "}</TextThemed>
        <TextThemed>{"it's "}</TextThemed>
        <TextThemed>{"ready."}</TextThemed>
      </ItemOuter>
    );
  }
};

export default React.memo(NewMRFooterTitle);
