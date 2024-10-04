import React, { useCallback, useRef, useMemo, useContext } from "react";
import * as hljs from "react-syntax-highlighter/dist/esm/styles/hljs";
import { getBackgroundColorHljs } from "../../../../core/highlighter_styles";
import IconFA from "react-native-vector-icons/FontAwesome5";
import { goToNewFileEditor } from "../../file-editor/config/navigation";
import Highlighter from "../../../../components/Tools/Highlighter";
import FileFailed from "../components/FileFailed";
import Header from "../../../../components/Header/Header";
import ButtonHeader from "../../../../components/Buttons/ButtonHeader";
import { iOSColors } from "react-native-typography";
import HeaderIndicator from "../../../../components/Header/HeaderIndicator";
import { StackScreenTmpProps } from "../../../../core/utils";
import TitleHeader from "../../../../components/Header/TitleHeader";
import {
  TOAST_TYPES,
  ToastContext,
} from "../../../../components/Toast/ToastContext";
import {
  NewFilePreviewScreenParams,
  NEW_FILE_PREVIEW_SCREEN_NAME,
} from "../config/navigation";
import Container from "../../../../components/Layouts/Container";
import { SafeAreaView } from "react-native-safe-area-context";
import { GENERAL_ICON_SIZE } from "../../../../core/styles/general";
import useGetAsyncResource from "../../../../core/hooks/useGetAsyncResource";
import Clipboard from "@react-native-community/clipboard";
import { Modalvski } from "../../../../components/Modalvski/Modalvski";
import ItemGroup from "../../../../components/Group/ItemGroup";
import ItemPressable from "../../../../components/Group/ItemPressable";
import HighlightModal from "../../../modals/HighlightModal";
import IconThemed from "../../../../components/Icons/IconThemed";
import { ActionChange } from "../../../../core/gitlab/types/repository_files_types";
import {
  deleteActionChange,
  reloadActionChange,
  selectBranchChanges,
} from "../../changes/config/changesSlice";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { getBranchChangesKey } from "../../changes/config/utils";
import { unwrapResult } from "@reduxjs/toolkit";
import FullLoading from "../../../../components/Layouts/FullLoading";

export interface Props {}

export interface NewFilePreviewScreenState {
  content: string;
}

type NewFilePreviewScreenProps = Props &
  StackScreenTmpProps<
    NewFilePreviewScreenParams,
    typeof NEW_FILE_PREVIEW_SCREEN_NAME
  >;

const NewFilePreview: React.FC<NewFilePreviewScreenProps> = (props) => {
  const { route, navigation } = props;

  const { title, project_id, branch, path, file_name } = route.params;

  const dispatch = useAppDispatch();

  const modalPicker = useRef<Modalvski>(null);
  const modal = useRef<Modalvski>(null);
  const toast = useContext(ToastContext);

  const highlight = useAppSelector((state) => state.highlight);
  const key = useMemo(() => getBranchChangesKey(project_id, branch), []);
  const changes = useAppSelector((state) => selectBranchChanges(state)(key));

  const action_change: ActionChange | null = useMemo(() => {
    const action_change_match = changes.actions.filter(
      (action) => action.file_path === path
    );
    return action_change_match.length === 1 ? action_change_match[0] : null;
  }, [changes, project_id]);

  const file_local = useGetAsyncResource(async () => {
    const local_content = await dispatch(
      reloadActionChange({ project_id, branch, file_path: path })
    );
    return local_content;
  });

  const TitleComp = useCallback(() => <TitleHeader title={title} />, []);

  const editFile = useCallback(() => {
    navigation.dispatch(
      goToNewFileEditor({
        project_id,
        branch,
        path,
        title,
        content:
          action_change && action_change.content ? action_change.content : "",
        file_name,
      })
    );
  }, []);

  const copyTextFile = useCallback(() => {
    if (action_change?.content) {
      Clipboard.setString(action_change.content);
      toast.updateMessage({
        status: TOAST_TYPES.NORMAL,
        message: "Coppied",
      });
    }
  }, [action_change]);

  const deleteFile = () => {
    dispatch(deleteActionChange({ project_id, branch, file_path: path }))
      .then(unwrapResult)
      .then(() => {
        navigation.goBack();
      })
      .catch(toast.updateError);
  };

  const showPicker = useCallback(() => {
    modalPicker.current?.open();
  }, []);

  const onPressBtnRight = useCallback(() => {
    modal.current?.open();
  }, []);

  const RightComp = useCallback(() => {
    if (file_local.loading || changes.fs_state === "deleting") {
      return <HeaderIndicator />;
    } else {
      return (
        <ButtonHeader
          onPress={onPressBtnRight}
          icon={<IconFA size={20} name="ellipsis-h" color="#fff" />}
        />
      );
    }
  }, [onPressBtnRight, file_local.loading, changes.fs_state]);

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

  const loading = useMemo(() => changes.fs_state === "reading", [
    changes.fs_state,
  ]);

  return (
    <Container backgroundColor={bgColor}>
      <Header center={TitleComp} right={RightComp} />
      <SafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
        {loading ? (
          <FullLoading backgroundColor={bgColor} />
        ) : action_change && action_change.content !== undefined ? (
          <Highlighter
            key={highlight.style}
            content={action_change.content}
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
          <ItemPressable
            title="Edit File"
            onPress={editFile}
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

export default NewFilePreview;
