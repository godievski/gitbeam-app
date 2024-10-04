import React, { useCallback } from "react";
import { RED_ROSE, PALETTE } from "../../../../core/styles/colors";
import { View } from "react-native";
import ItemGroup from "../../../../components/Group/ItemGroup";
import ItemPressable from "../../../../components/Group/ItemPressable";
import TextThemed from "../../../../components/Commons/TextThemed";
import Badge from "../../../../components/Commons/Badge";
import ItemOuter from "../../../../components/Group/ItemOuter";
import IconRound from "../../../../components/Icons/IconRound";
import { useNavigation } from "@react-navigation/native";
import { goToBranches } from "../../branches/config/navigation";
import { goToCommits } from "../../commits/config/navigation";
import { goToChanges } from "../../changes/config/navigation";
import { goToLabels } from "../../labels/config/navigation";
import { goToMilestones } from "../../milestones/config/navigation";
import { goToProjectMembers } from "../../project-members/config/navigation";
import { goToProjectMergeRequests } from "../../project-merge-requests/config/navigation";
import { goToIssues } from "../../issues/config/navigation";
import { goToSourceCode } from "../../source-code/config/navigation";
import { goToProjectInitFilename } from "../config/navigation";
import { TProject } from "../../../../core/gitlab/types/projects_types";

type ProjectLinksProps = {
  project: TProject;
  default_branch_change: string;
  changesCount: number;
  empty: boolean;
};

const ProjectLinks: React.FC<ProjectLinksProps> = ({
  project,
  default_branch_change,
  changesCount,
  empty,
}) => {
  const navigation = useNavigation();

  const onPressBranches = useCallback(() => {
    navigation.dispatch(goToBranches(project.id, project.name));
  }, [project]);

  const onPressCommits = useCallback(() => {
    if (project.default_branch) {
      navigation.dispatch(
        goToCommits(project.id, project.default_branch, project.name)
      );
    }
  }, [project]);

  const onPressChanges = useCallback(() => {
    navigation.dispatch(
      goToChanges(project.id, default_branch_change, project.name)
    );
  }, [project, default_branch_change]);

  const onPressLabels = useCallback(() => {
    navigation.dispatch(goToLabels(project.id, project.name));
  }, [project]);

  const onPressMilestones = useCallback(() => {
    navigation.dispatch(goToMilestones(project.id, project.name));
  }, [project]);

  const onPressMembers = useCallback(() => {
    navigation.dispatch(goToProjectMembers(project.id, project.name));
  }, [project]);

  const onPressMergeRequests = useCallback(() => {
    navigation.dispatch(goToProjectMergeRequests(project.id, project.name));
  }, [project]);

  const onPressIssues = useCallback(() => {
    navigation.dispatch(goToIssues(project.id, project.name));
  }, [project]);

  const onPressSourceCode = useCallback(() => {
    if (project.default_branch) {
      navigation.dispatch(
        goToSourceCode(
          project.id,
          project.default_branch,
          "",
          project.name,
          project.name
        )
      );
    }
  }, [project]);

  const onPressNewFile = (filename: string) => {
    navigation.dispatch(goToProjectInitFilename(filename));
  };

  return (
    <View style={{ paddingVertical: 10 }}>
      {!empty && (
        <>
          <ItemGroup>
            <ItemPressable
              title="Changes"
              renderIcon={() => (
                <IconRound
                  type="fontawesome"
                  name="circle-notch"
                  backgroundColor={PALETTE.blue}
                />
              )}
              chevron={true}
              renderRight={
                changesCount
                  ? () => (
                      <Badge style={{ backgroundColor: RED_ROSE }}>
                        {changesCount}
                      </Badge>
                    )
                  : undefined
              }
              onPress={() => onPressChanges()}
              borderBottom={false}
            />
          </ItemGroup>
          <ItemOuter>
            <TextThemed type="secondary" style={{ fontSize: 13 }}>
              You can keep track of the files that you've modified, deleted, or
              created.
            </TextThemed>
          </ItemOuter>
        </>
      )}
      {empty ? (
        <>
          <ItemOuter>
            <TextThemed style={{ fontSize: 18, fontWeight: "600" }}>
              The repository for this project is empty
            </TextThemed>
            <TextThemed type="secondary" style={{ fontSize: 13 }}>
              You can get started by adding files to it with one of the
              following options.
            </TextThemed>
          </ItemOuter>
          <ItemGroup label="Repository">
            <ItemPressable
              title="New File"
              renderIcon={() => <IconRound type="git" name="doc_code" />}
              onPress={() => onPressNewFile("")}
              chevron={true}
            />
            <ItemPressable
              title="Add README.md"
              renderIcon={() => <IconRound type="git" name="doc_code" />}
              onPress={() => onPressNewFile("README.md")}
              chevron={true}
              borderBottom={false}
            />
          </ItemGroup>
        </>
      ) : (
        <ItemGroup label="Repository">
          <ItemPressable
            title="Files"
            renderIcon={() => <IconRound type="git" name="doc_code" />}
            chevron={true}
            onPress={onPressSourceCode}
          />
          <ItemPressable
            title="Commits"
            renderIcon={() => (
              <IconRound
                type="git"
                name="commit"
                backgroundColor={PALETTE.blue}
              />
            )}
            chevron={true}
            onPress={() => onPressCommits()}
          />
          <ItemPressable
            title="Branches"
            renderIcon={() => (
              <IconRound
                type="git"
                name="branch"
                backgroundColor={PALETTE.purple}
              />
            )}
            chevron={true}
            onPress={() => onPressBranches()}
          />
          <ItemPressable
            title="Merge Requests"
            renderIcon={() => (
              <IconRound
                type="git"
                name="merge-request"
                backgroundColor={PALETTE.orange}
              />
            )}
            chevron={true}
            onPress={onPressMergeRequests}
            borderBottom={false}
          />
        </ItemGroup>
      )}

      <ItemGroup label="Issues">
        <ItemPressable
          title="List"
          renderIcon={() => <IconRound type="git" name="issues" />}
          chevron={true}
          onPress={onPressIssues}
        />
        <ItemPressable
          title="Labels"
          renderIcon={() => (
            <IconRound
              type="git"
              name="labels"
              backgroundColor={PALETTE.blue}
            />
          )}
          chevron={true}
          onPress={onPressLabels}
        />
        <ItemPressable
          title="Milestones"
          renderIcon={() => (
            <IconRound
              type="git"
              name="clock"
              backgroundColor={PALETTE.purple}
            />
          )}
          chevron={true}
          onPress={onPressMilestones}
          borderBottom={false}
        />
      </ItemGroup>
      <ItemGroup label="Settings">
        <ItemPressable
          title="Members"
          renderIcon={() => <IconRound type="fontawesome" name="users" />}
          chevron={true}
          onPress={onPressMembers}
          borderBottom={false}
        />
      </ItemGroup>
    </View>
  );
};

export default ProjectLinks;
