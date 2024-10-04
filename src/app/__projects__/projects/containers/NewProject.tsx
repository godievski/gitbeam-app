import React, { useState, useCallback, useContext } from "react";
import Header from "../../../../components/Header/Header";
import ButtonHeader from "../../../../components/Buttons/ButtonHeader";
import { TouchableOpacity } from "react-native-gesture-handler/touchables";
import RadioBtn from "../../../../components/Buttons/RadioBtn";
import { View } from "react-native";
import { validateSlugName } from "../utils";
import TitleHeader from "../../../../components/Header/TitleHeader";
import { StackScreenTmpProps } from "../../../../core/utils";
import {
  NewProjectParams,
  NEW_PROJECT_SCREEN_NAME,
} from "../config/navigation";
import {
  ToastContext,
  TOAST_TYPES,
} from "../../../../components/Toast/ToastContext";
import Container from "../../../../components/Layouts/Container";
import TextThemed from "../../../../components/Commons/TextThemed";
import ItemGroup from "../../../../components/Group/ItemGroup";
import ItemInput from "../../../../components/Group/ItemInput";
import ItemComponent from "../../../../components/Group/ItemComponent";
import { KeyboardAwareScrollView } from "../../../../components/Commons/KeyboardAware";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { createNewProject } from "../config/projectsSlice";
import HeaderIndicator from "../../../../components/Header/HeaderIndicator";

type Props = {};
type NewProjectProps = Props &
  StackScreenTmpProps<NewProjectParams, typeof NEW_PROJECT_SCREEN_NAME>;

const NewProject: React.FC<NewProjectProps> = (props) => {
  const [project_name, setProjectName] = useState("");
  const [project_slug, setProjectSlug] = useState("");
  const [project_description, setProjectDesc] = useState("");
  const [project_readme, setReadme] = useState(false);
  const [project_access, setAccess] = useState(
    "private" as "private" | "public"
  );

  const toastHandler = useContext(ToastContext);

  const dispatch = useAppDispatch();

  const projects = useAppSelector((state) => state.projects);

  const createProject = useCallback(async () => {
    const data = {
      name: project_name,
      path: project_slug,
      description: project_description,
      visibility: project_access,
      initialize_with_readme: project_readme,
    };
    const valid_slug = validateSlugName(project_slug);
    if (!valid_slug) {
      return toastHandler.updateMessage({
        status: TOAST_TYPES.ERROR,
        message:
          "Path can contain only letters, digits, '_', '-' and '.'. Cannot start with '-', end in '.git' or end in '.atom'",
      });
    }
    if (project_name.length == 0) {
      return toastHandler.updateMessage({
        status: TOAST_TYPES.WARNING,
        message: "Insert a project name",
      });
    }

    await dispatch(createNewProject(data));
    props.navigation.goBack();
  }, [
    project_name,
    project_slug,
    project_description,
    project_access,
    project_readme,
  ]);

  const ContentHeader = useCallback(() => {
    return <TitleHeader title="New Project" />;
  }, []);

  const HeaderBtn = useCallback(() => {
    if (projects.creating == "pending") {
      return <HeaderIndicator />;
    }
    return <ButtonHeader onPress={createProject} title="Create" />;
  }, [createProject, projects.creating]);

  const onChangeProjectName = useCallback((text: string) => {
    const new_slug = text
      .toLowerCase()
      .split(" ")
      .filter((a) => a && a.length > 0)
      .join("-");
    setProjectName(text);
    setProjectSlug(new_slug);
  }, []);

  const onChangeProjectSlug = useCallback((text) => {
    setProjectSlug(text);
  }, []);

  const toggleReadme = () => {
    setReadme((old) => !old);
  };
  return (
    <Container>
      <Header
        backBtn={true}
        isModal={true}
        center={ContentHeader}
        right={HeaderBtn}
      />
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        enableOnAndroid={true}
        contentContainerStyle={{ paddingVertical: 10 }}
      >
        {/* <ScrollView> */}
        <ItemGroup label="Project">
          <ItemInput
            label="NAME"
            onChangeText={onChangeProjectName}
            value={project_name}
            placeholder="My awesome project"
          />
          <ItemInput
            label="SLUG"
            onChangeText={onChangeProjectSlug}
            value={project_slug}
            placeholder="my-awesome-project"
          />
          <ItemInput
            label="DESCRIPTION (optional)"
            onChangeText={setProjectDesc}
            value={project_description}
            multiline={true}
            borderBottom={false}
            placeholder="Description format"
          />
        </ItemGroup>

        <ItemGroup label="Visibility Level">
          <ItemComponent>
            <TouchableOpacity
              onPress={() => setAccess("private")}
              activeOpacity={0.5}
            >
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  flexWrap: "nowrap",
                  flexDirection: "row",
                }}
              >
                <RadioBtn
                  selected={project_access == "private"}
                  onPress={() => setAccess("private")}
                />
                <View
                  style={{
                    flexDirection: "column",
                    paddingLeft: 6,
                    flex: 1,
                  }}
                >
                  <TextThemed style={{ fontWeight: "600" }}>Private</TextThemed>
                  <TextThemed
                    type="secondary"
                    style={{ fontSize: 13, flex: 1, flexWrap: "wrap" }}
                  >
                    Project access must be granted explicitly to each user. If
                    this project is part of a group, access will be granted to
                    members of the group.
                  </TextThemed>
                </View>
              </View>
            </TouchableOpacity>
          </ItemComponent>
          <ItemComponent borderBottom={false}>
            <TouchableOpacity
              onPress={() => setAccess("public")}
              activeOpacity={0.5}
            >
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  flexWrap: "nowrap",
                  flexDirection: "row",
                }}
              >
                <RadioBtn
                  selected={project_access == "public"}
                  onPress={() => setAccess("public")}
                />
                <View
                  style={{
                    flexDirection: "column",
                    paddingLeft: 6,
                    flex: 1,
                  }}
                >
                  <TextThemed style={{ fontWeight: "600" }}>Public</TextThemed>
                  <TextThemed
                    type="secondary"
                    style={{ fontSize: 13, flex: 1, flexWrap: "wrap" }}
                  >
                    The project can be accessed without any authentication.
                  </TextThemed>
                </View>
              </View>
            </TouchableOpacity>
          </ItemComponent>
        </ItemGroup>

        <ItemGroup>
          <ItemComponent borderBottom={false}>
            <TouchableOpacity onPress={toggleReadme} activeOpacity={0.5}>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  flexWrap: "nowrap",
                  flexDirection: "row",
                }}
              >
                <RadioBtn
                  selected={project_readme}
                  onPress={toggleReadme}
                  type="square"
                />
                <View
                  style={{
                    flexDirection: "column",
                    paddingLeft: 9,
                    flex: 1,
                  }}
                >
                  <TextThemed style={{ fontWeight: "600" }}>
                    Initialize repository with a README.
                  </TextThemed>
                  <TextThemed
                    type="secondary"
                    style={{ fontSize: 13, flexWrap: "wrap", flex: 1 }}
                  >
                    Allows you to immediately clone this project’s repository.
                    Skip this if you plan to push up an existing repository.
                  </TextThemed>
                </View>
              </View>
            </TouchableOpacity>
          </ItemComponent>
        </ItemGroup>
        {/* </ScrollView> */}
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default NewProject;
