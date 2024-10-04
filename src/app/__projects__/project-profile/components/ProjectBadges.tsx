import React from "react";
import { StyleSheet, Text, SafeAreaView, View } from "react-native";
import { GREEN_COLOR, PALETTE } from "../../../../core/styles/colors";
import IconGit from "../../../../components/Icons/IconGit";
import AnimateNumber from "react-native-animate-number";
import { GENERAL_CONTAINER_PADDING_HORIZONTAL } from "../../../../core/styles/general";
import Badge from "../../../../components/Commons/Badge";
import { BADGE_STYLES } from "../../../../components/Commons/Badge";

const styles = StyleSheet.create({
  conatiner: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: GENERAL_CONTAINER_PADDING_HORIZONTAL * 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badge: {
    backgroundColor: PALETTE.secondary,
    alignSelf: "center",
  },
  badgeText: {
    fontSize: 14,
  },
});

const ProjectBadges = ({ project }) => {
  return (
    <SafeAreaView>
      <View style={styles.conatiner}>
        <Badge style={styles.badge}>
          <Text style={[BADGE_STYLES.text, styles.badgeText]}>
            <IconGit name="star-o" />{" "}
            <AnimateNumber
              value={project.star_count}
              countBy={1}
              interval={10}
            />
            {" Stars "}
          </Text>
        </Badge>
        <Badge style={styles.badge}>
          <Text style={[BADGE_STYLES.text, styles.badgeText]}>
            <IconGit name="fork" />{" "}
            <AnimateNumber
              value={project.forks_count}
              countBy={1}
              interval={10}
            />
            {" Forks "}
          </Text>
        </Badge>

        <Badge style={styles.badge}>
          <Text style={[BADGE_STYLES.text, styles.badgeText]}>
            <IconGit name="issues" />{" "}
            <AnimateNumber
              value={project.open_issues_count}
              countBy={1}
              interval={10}
            />
            {" Issues "}
          </Text>
        </Badge>
      </View>
    </SafeAreaView>
  );
};

export default ProjectBadges;
