import React, { useMemo, useCallback, useContext, useRef } from "react";
import * as hljs from "react-syntax-highlighter/dist/esm/styles/hljs";
import { getBackgroundColorHljs } from "../../../../core/highlighter_styles";
import IconFA from "react-native-vector-icons/FontAwesome5";
import { goToFileEditor } from "../../file-editor/config/navigation";
import Highlighter from "../../../../components/Tools/Highlighter";
import ImagePreview from "../components/ImagePreview";
import FileFailed from "../components/FileFailed";
import Header from "../../../../components/Header/Header";
import ButtonHeader from "../../../../components/Buttons/ButtonHeader";
import { iOSColors } from "react-native-typography";
import HeaderIndicator from "../../../../components/Header/HeaderIndicator";
import { DispatchProps, StackScreenTmpProps } from "../../../../core/utils";
import TitleHeader from "../../../../components/Header/TitleHeader";
import {
  TOAST_TYPES,
  ToastContext,
} from "../../../../components/Toast/ToastContext";
import {
  FilePreviewScreenParams,
  FILE_PREVIEW_SCREEN_NAME,
} from "../config/navigation";
import Container from "../../../../components/Layouts/Container";
import { SafeAreaView } from "react-native-safe-area-context";
import { GENERAL_ICON_SIZE } from "../../../../core/styles/general";
import useGetAsyncResource from "../../../../core/hooks/useGetAsyncResource";
import repository_files_api from "../../../../core/gitlab/api/repository_files_api";
import FullLoading from "../../../../components/Layouts/FullLoading";
import Clipboard from "@react-native-community/clipboard";
import { Modalvski } from "../../../../components/Modalvski/Modalvski";
import ItemGroup from "../../../../components/Group/ItemGroup";
import ItemPressable from "../../../../components/Group/ItemPressable";
import HighlightModal from "../../../modals/HighlightModal";
import IconThemed from "../../../../components/Icons/IconThemed";
import { ActionChange } from "../../../../core/gitlab/types/repository_files_types";
import {
  reloadActionChange,
  saveActionFileDelete,
  selectBranchChanges,
} from "../../changes/config/changesSlice";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { getBranchChangesKey } from "../../changes/config/utils";
import { unwrapResult } from "@reduxjs/toolkit";

export interface Props {}

export interface FilePreviewScreenState {
  content: string;
  isImage: boolean | null;
  isText: boolean | null;
}

export type FilePreviewScreenProps = Props &
  DispatchProps &
  StackScreenTmpProps<FilePreviewScreenParams, typeof FILE_PREVIEW_SCREEN_NAME>;

//TODO: https://react-native-community.github.io/react-native-share/docs/share-open

const FilePreview: React.FC<FilePreviewScreenProps> = (props) => {
  const { route, navigation } = props;

  const { project_id, path, branch, title } = route.params;

  const dispatch = useAppDispatch();

  const modal = useRef<Modalvski>(null);
  const modalPicker = useRef<Modalvski>(null);

  const highlight = useAppSelector((state) => state.highlight);
  const key = useMemo(() => getBranchChangesKey(project_id, branch), []);
  const changes = useAppSelector((state) => selectBranchChanges(state)(key));

  const action_change: ActionChange | null = useMemo(() => {
    const action_change_match = changes.actions.filter(
      (action) => action.file_path === path
    );
    return action_change_match.length === 1 ? action_change_match[0] : null;
  }, [changes, project_id]);

  const file_network = useGetAsyncResource(async () => {
    const file = await repository_files_api.getFileFromRepository(
      project_id,
      path,
      branch
    );
    await dispatch(reloadActionChange({ project_id, branch, file_path: path }));
    return file;
  });

  const loading = useMemo(
    () => file_network.loading || changes.fs_state === "reading",
    [file_network.loading, changes.fs_state]
  );

  const content = useMemo<string | null>(() => {
    if (file_network.data && !loading) {
      if (file_network.data.type != "other") {
        if (
          action_change &&
          action_change.action == "update" &&
          file_network.data.type == "text"
        ) {
          return action_change.content ?? null;
        }
        return file_network.data.content_decoded;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }, [loading, file_network.data, action_change]);

  const toast = useContext(ToastContext);

  const TitleComp = useCallback(() => <TitleHeader title={title} />, []);

  const copyTextFile = useCallback(() => {
    if (content && file_network.data?.type == "text") {
      Clipboard.setString(content);
      toast.updateMessage({
        status: TOAST_TYPES.NORMAL,
        message: "Copied",
      });
    }
  }, [content, file_network.data]);

  const deleteFile = useCallback(() => {
    if (file_network.data) {
      const data: ActionChange = {
        file_name: file_network.data.file_name,
        file_path: file_network.data.file_path,
        action: "delete",
        content: "",
        encoding: "base64",
        last_commit_id: file_network.data.last_commit_id,
      };
      dispatch(saveActionFileDelete({ project_id, branch, data }))
        .then(unwrapResult)
        .then(() => {
          navigation.goBack();
        })
        .catch(toast.updateError);
    }
  }, [file_network.data]);

  const showPicker = useCallback(() => {
    modalPicker.current?.open();
  }, []);

  const onPressBtnRight = useCallback(() => {
    modal.current?.open();
  }, []);

  const RightComp = useCallback(() => {
    if (loading || changes.fs_state === "deleting") {
      return <HeaderIndicator />;
    } else {
      return (
        <ButtonHeader
          icon={<IconFA size={20} name="ellipsis-h" color="#fff" />}
          onPress={onPressBtnRight}
        />
      );
    }
  }, [loading, onPressBtnRight, changes.fs_state]);

  const copyFileName = useCallback(() => {
    const file_name = title;
    Clipboard.setString(file_name);
    toast.updateMessage({
      status: TOAST_TYPES.NORMAL,
      message: "Copied",
    });
  }, [title]);

  const copyFilePath = useCallback(() => {
    const file_path = path;
    Clipboard.setString(file_path);
    toast.updateMessage({
      status: TOAST_TYPES.NORMAL,
      message: "Copied",
    });
  }, [title, path]);

  const bgColor = useMemo(
    () => getBackgroundColorHljs(highlight.style, hljs[highlight.style]),
    [highlight.style]
  );

  const show_text_options = useMemo(
    () => file_network.data?.type == "text" ?? false,
    [file_network.data]
  );

  return (
    <Container backgroundColor={bgColor}>
      <Header center={TitleComp} right={RightComp} />
      <SafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
        {loading ? (
          <FullLoading backgroundColor={bgColor} />
        ) : file_network.error || content === null || !file_network.data ? (
          <FileFailed />
        ) : file_network.data.type == "image" ? (
          <ImagePreview content={content} />
        ) : file_network.data.type == "text" ? (
          <Highlighter
            key={highlight.style}
            content={content}
            style_highlighter={highlight.style}
            type={highlight.type}
          />
        ) : (
          <FileFailed />
        )}
      </SafeAreaView>
      <HighlightModal ref={modalPicker}></HighlightModal>
      <Modalvski ref={modal} cancelBtn>
        <ItemGroup>
          {show_text_options && (
            <>
              <ItemPressable
                title="Edit File"
                onPress={() => {
                  navigation.dispatch(
                    goToFileEditor({
                      project_id,
                      branch,
                      path,
                      title,
                      file_name: file_network.data!.file_name,
                      content,
                    })
                  );
                }}
                renderIcon={() => (
                  <IconThemed
                    type="fontawesome"
                    size={GENERAL_ICON_SIZE}
                    name="edit"
                  />
                )}
              />
              <ItemPressable
                title="Copy Text"
                onPress={copyTextFile}
                renderIcon={() => (
                  <IconThemed
                    type="fontawesome"
                    size={GENERAL_ICON_SIZE}
                    name="clipboard"
                  />
                )}
              />
              <ItemPressable
                title="Change Style"
                onPress={showPicker}
                renderIcon={() => (
                  <IconThemed
                    type="fontawesome"
                    size={GENERAL_ICON_SIZE}
                    name="palette"
                  />
                )}
              />
            </>
          )}
          <ItemPressable
            title="Delete File"
            titleStyle={{ color: iOSColors.red }}
            onPress={deleteFile}
            renderIcon={() => (
              <IconThemed
                type="ionicon"
                name="trash-outline"
                size={GENERAL_ICON_SIZE}
                color={iOSColors.red}
              />
            )}
            borderBottom={false}
          />
        </ItemGroup>
        <ItemGroup>
          <ItemPressable title="Copy File Name" onPress={copyFileName} />
          <ItemPressable
            title="Copy File Path "
            onPress={copyFilePath}
            borderBottom={false}
          />
        </ItemGroup>
      </Modalvski>
    </Container>
  );
};

export default FilePreview;
