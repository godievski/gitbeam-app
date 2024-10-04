import React, { memo } from "react";
import IconGit from "../../../../components/Icons/IconGit";
import AnimateNumber from "react-native-animate-number";
import { StyleSheet, View, Text } from "react-native";
import TextThemed from "../../../../components/Commons/TextThemed";
import { GENERAL_ICON_SIZE } from "../../../../core/styles/general";

type BoxSummaryProps = {
  icon_name: string;
  desc: string;
  value;
  formatter?;
};

const ProjectBoxSummary: React.FC<BoxSummaryProps> = ({
  icon_name,
  desc,
  value,
  formatter,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TextThemed>
          <IconGit size={GENERAL_ICON_SIZE} name={icon_name} />
          <Text style={styles.value}>
            {" "}
            {formatter ? (
              <AnimateNumber
                value={value}
                formatter={formatter}
                interval={1}
                renderContent={(num) => <TextThemed>{num}</TextThemed>}
              />
            ) : (
              <AnimateNumber
                value={value}
                countBy={4}
                interval={1}
                renderContent={(num) => <TextThemed>{num}</TextThemed>}
              />
            )}
          </Text>
        </TextThemed>
      </View>
      <View style={styles.content}>
        <TextThemed style={styles.description} type="secondary">
          {desc}
        </TextThemed>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  description: {
    fontSize: 12,
  },
  value: {
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default memo(ProjectBoxSummary);
