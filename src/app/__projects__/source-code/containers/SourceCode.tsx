import React, {
  useState,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import SourceCodeTreeRow from "../components/SourceCodeTreeRow";
import SearchBar from "../../../../components/SearchBar/SearchBar";
import IconGit from "../../../../components/Icons/IconGit";
import { goToBranchesFromSourceCode } from "../../branches/config/navigation";
import { goToFilePreview } from "../../file-preview/config/navigation";
import _ from "lodash";
import {
  goToNewFile,
  goToNewDirectory,
} from "../../new-file/config/navigation";
import { goToNewFilePreview } from "../../file-preview/config/navigation";
import RefreshControlCommon from "../../../../components/RN/RefreshControlCommon";
import Header from "../../../../components/Header/Header";
import ButtonHeader from "../../../../components/Buttons/ButtonHeader";
import {
  CRUDState,
  DispatchProps,
  StackScreenTmpProps,
} from "../../../../core/utils";
import TitleHeader from "../../../../components/Header/TitleHeader";
import { goToSourceCode } from "../config/navigation";
import {
  SourceCodeViewParams,
  SOURCE_CODE_SCREEN_NAME,
} from "../config/navigation";
import Container from "../../../../components/Layouts/Container";
import { GENERAL_ICON_SIZE } from "../../../../core/styles/general";
import SourceCodePlusBtn from "../components/SourceCodePlusBtn";
import { Modalvski } from "../../../../components/Modalvski/Modalvski";
import ItemGroup from "../../../../components/Group/ItemGroup";
import ItemPressable from "../../../../components/Group/ItemPressable";
import Clipboard from "@react-native-community/clipboard";
import {
  ToastContext,
  TOAST_TYPES,
} from "../../../../components/Toast/ToastContext";
import IconThemed from "../../../../components/Icons/IconThemed";
import FlatList from "../../../../components/RN/FlatList";
import { View } from "react-native";
import { iOSColors } from "react-native-typography";
import { ActionChange } from "../../../../core/gitlab/types/repository_files_types";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  fetchMoreSourceCode,
  fetchSourceCode,
  selectSourceCodeTree,
} from "../config/sourceCodeSlice";
import { getKeySourceCodeTree } from "../config/utils";
import { TRepoNode } from "../../../../core/gitlab/types/repository_types";
import Spinner from "../../../../components/Commons/Spinner";
import { getBranchChangesKey } from "../../changes/config/utils";
import {
  saveActionFileDelete,
  selectBranchChanges,
} from "../../changes/config/changesSlice";
import { unwrapResult } from "@reduxjs/toolkit";

interface ScreenProps {}
type SourceCodeViewProps = ScreenProps &
  DispatchProps &
  StackScreenTmpProps<SourceCodeViewParams, typeof SOURCE_CODE_SCREEN_NAME>;

const SourceCode: React.FC<SourceCodeViewProps> = (props) => {
  const dispatch = useAppDispatch();
  const { route, navigation } = props;
  const { project_id, project_name, branch, path } = route.params;

  const key_tree = useMemo(
    () => getKeySourceCodeTree({ project_id, ref: branch, path }),
    []
  );

  const modal = useRef<Modalvski>(null);
  const modalFile = useRef<Modalvski>(null);
  const toast = useContext(ToastContext);

  const source_code = useAppSelector((state) =>
    selectSourceCodeTree(state)(key_tree)
  );

  const branch_changes_key = useMemo(
    () => getBranchChangesKey(project_id, branch),
    []
  );
  const branch_changes = useAppSelector((state) =>
    selectBranchChanges(state)(branch_changes_key)
  );

  const [filter_text, setFilterText] = useState("");
  const [selected_file, setSelectedFile] = useState<TRepoNode>();

  const new_files = useMemo(() => {
    return _.map(
      _.filter(branch_changes.actions, (action: ActionChange) => {
        const match_path = path.length
          ? `${path}/${action.file_name}`
          : action.file_name;
        return action.action == "create" && match_path == action.file_path;
      }),
      (action: ActionChange) => {
        return {
          name: action.file_name,
          isNew: true,
          type: "blob",
          path: action.file_path,
        } as TRepoNode;
      }
    ) as TRepoNode[];
  }, [branch_changes.actions]);

  const changes_by_key = useMemo(
    () =>
      _.keyBy(
        branch_changes.actions,
        (action: ActionChange) => action.file_path
      ),
    [branch_changes.actions]
  );

  const num_items_without_filter = useMemo(
    () => (source_code.entities?.length ?? 0) + new_files.length,
    [source_code.entities, new_files.length]
  );

  const items: TRepoNode[] = useMemo(() => {
    let source_code_filtered: TRepoNode[] = source_code.entities
      ? source_code.entities.filter((item) => item.name.includes(filter_text))
      : [];
    return [
      ...source_code_filtered,
      ...new_files.filter((item) => item.name.includes(filter_text)),
    ];
  }, [new_files, filter_text, source_code.entities]);

  const onRefreshHandler = () => {
    dispatch(fetchSourceCode({ project_id, ref: branch, path }));
  };

  useEffect(() => {
    onRefreshHandler();
  }, []);

  const goToBranches = useCallback(() => {
    navigation.dispatch(
      goToBranchesFromSourceCode(project_id, branch, path, project_name)
    );
  }, []);

  const TitleComp = useCallback(
    () => (
      <TitleHeader title={route.params.title} subtitle={route.params.branch} />
    ),
    []
  );

  const RightComp = useCallback(
    () => (
      <ButtonHeader
        onPress={goToBranches}
        icon={<IconGit name="branch" size={20} color="#fff" />}
      />
    ),
    [goToBranches]
  );

  const updateFilterText = useCallback(
    (txt) => {
      if (source_code.state === CRUDState.idle) {
        setFilterText(txt);
      }
    },
    [source_code.state]
  );

  const onPressItem = useCallback((item: TRepoNode) => {
    if (item.isNew) {
      return navigation.dispatch(
        goToNewFilePreview({
          project_id,
          branch,
          path: item.path,
          title: item.name,
          file_name: item.name,
        })
      );
    }

    if (item.type === "blob") {
      return navigation.dispatch(
        goToFilePreview({
          project_id,
          branch,
          path: item.path,
          title: item.name,
        })
      );
    } else {
      return navigation.dispatch(
        goToSourceCode(project_id, branch, item.path, item.name, project_name)
      );
    }
  }, []);

  const onLongPressItem = useCallback((item: TRepoNode) => {
    setSelectedFile(item);
    modalFile.current?.open();
  }, []);

  const copyFileName = useCallback(() => {
    if (selected_file) {
      const item = selected_file;
      const file_name = item.name;
      Clipboard.setString(file_name);
      toast.updateMessage({
        status: TOAST_TYPES.NORMAL,
        message: "Copied",
      });
    }
  }, []);
  const copyFilePath = useCallback(() => {
    if (selected_file) {
      const item = selected_file;
      const file_path = item.path;
      Clipboard.setString(file_path);
      toast.updateMessage({
        status: TOAST_TYPES.NORMAL,
        message: "Copied",
      });
    }
  }, [selected_file]);

  const handleNewFile = useCallback(() => {
    const { entities } = source_code;
    const current_files = entities
      ? entities.map((i) => ({ name: i.name }))
      : [];
    navigation.dispatch(
      goToNewFile(branch, path, [...current_files, ...new_files], project_id)
    );
  }, [source_code.entities, new_files]);

  const handleNewDirectory = useCallback(() => {
    const { entities } = source_code;
    const current_files = entities
      ? entities.map((i) => ({ name: i.name }))
      : [];
    navigation.dispatch(
      goToNewDirectory(branch, path, [...current_files, ...new_files])
    );
  }, [source_code.entities, new_files]);

  const onLongPressPlusBtn = useCallback(() => {
    modal.current?.open();
  }, []);

  const keyExtractor = useCallback((item) => `item-row-${item.name}`, []);

  const renderItem = useCallback(
    ({ item, index }) => (
      <SourceCodeTreeRow
        item={item}
        index={index}
        onPress={onPressItem}
        onLongPress={onLongPressItem}
        action_change={changes_by_key[item.path]}
      />
    ),
    [onPressItem, changes_by_key]
  );

  const deleteFile = useCallback(() => {
    if (selected_file) {
      const data: ActionChange = {
        file_name: selected_file.name,
        file_path: selected_file.path,
        action: "delete",
        content: "",
        encoding: "base64",
        // last_commit_id: selected_file.,
      };
      dispatch(saveActionFileDelete({ project_id, branch, data }))
        .then(unwrapResult)
        .catch(toast.updateError);
    }
  }, [selected_file]);

  const onRealEndReached = useCallback(() => {
    dispatch(fetchMoreSourceCode({ project_id, ref: branch, path }));
  }, []);

  return (
    <Container>
      <Header center={TitleComp} right={RightComp} />
      <SearchBar
        onChangeText={updateFilterText}
        placeholder="Quick filter by file name"
      />
      <View style={{ flex: 1 }}>
        <FlatList
          data={items}
          keyExtractor={keyExtractor}
          extraData={changes_by_key}
          renderItem={renderItem}
          refreshControl={
            <RefreshControlCommon
              refreshing={source_code.state === CRUDState.loading}
              onRefresh={onRefreshHandler}
            />
          }
          onRealEndReached={onRealEndReached}
          ListFooterComponent={
            source_code.state === CRUDState.loading_more ? (
              <Spinner />
            ) : (
              undefined
            )
          }
        />
      </View>
      {/* {!itemsTotal.length && !isFetching && <SourceCodeEmpty />} */}
      {num_items_without_filter > 0 && (
        <SourceCodePlusBtn
          onPress={handleNewFile}
          onLongPress={onLongPressPlusBtn}
        />
      )}
      <Modalvski ref={modal} cancelBtn>
        <ItemGroup>
          <ItemPressable
            title="New Directory"
            onPress={handleNewDirectory}
            renderIcon={() => (
              <IconThemed
                type="fontawesome"
                name="folder"
                size={GENERAL_ICON_SIZE}
                solid
              />
            )}
          />
          <ItemPressable
            title="New File"
            onPress={handleNewFile}
            renderIcon={() => (
              <IconThemed
                type="fontawesome"
                name="file-alt"
                size={GENERAL_ICON_SIZE}
              />
            )}
            borderBottom={false}
          />
        </ItemGroup>
      </Modalvski>
      <Modalvski ref={modalFile} cancelBtn>
        {!!selected_file && (
          <ItemGroup>
            <ItemPressable
              title={
                selected_file.type === "blob"
                  ? "Copy File Name"
                  : "Copy Directory Name"
              }
              onPress={copyFileName}
            />
            <ItemPressable
              title={
                selected_file.type === "blob"
                  ? "Copy File Path"
                  : "Copy Directory Path"
              }
              onPress={copyFilePath}
              borderBottom={selected_file.type === "blob"}
            />
            {selected_file.type === "blob" && (
              <ItemPressable
                title={"Delete File"}
                titleStyle={{ color: iOSColors.red }}
                onPress={deleteFile}
                borderBottom={false}
              />
            )}
          </ItemGroup>
        )}
      </Modalvski>
    </Container>
  );
};

export default SourceCode;
