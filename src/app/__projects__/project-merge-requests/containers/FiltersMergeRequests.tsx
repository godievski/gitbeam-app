import React, { useState, useCallback, useMemo, useRef } from "react";
import Container from "../../../../components/Layouts/Container";
import Header from "../../../../components/Header/Header";
import ButtonHeader from "../../../../components/Buttons/ButtonHeader";
import { firstLetterUp, StackScreenTmpProps } from "../../../../core/utils";
import { goToBranchesFromFilterMergeRequest } from "../../branches/config/navigation";
import TitleHeader from "../../../../components/Header/TitleHeader";
import { GENERAL_ICON_SIZE } from "../../../../core/styles/general";
import {
  FiltersMergeRequestScreenParams,
  FILTERS_MERGE_REQUESTS_SCREEN_NAME,
} from "../config/navigation";
import ItemGroup from "../../../../components/Group/ItemGroup";
import ItemInput from "../../../../components/Group/ItemInput";
import ItemSelect from "../../../../components/Group/ItemSelect";
import { RequestQueryValues } from "../../../../core/gitlab/types";
import { getReadableRequest } from "../../../../core/gitlab/utils";
import ModalvskiOptions from "../../../../components/Modalvski/ModalvskiOptions";
import { Modalvski } from "../../../../components/Modalvski/Modalvski";
import ItemPressable from "../../../../components/Group/ItemPressable";
import IconThemed from "../../../../components/Icons/IconThemed";
import ScrollView from "../../../../components/RN/ScrollView";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  fetchMergeRequests,
  selectMergeRequestsByProject,
  updateMergeRequestQuery,
} from "../config/mergeRequestsSlice";

type Props = {};

type FiltersMergeRequestScreenProps = Props &
  StackScreenTmpProps<
    FiltersMergeRequestScreenParams,
    typeof FILTERS_MERGE_REQUESTS_SCREEN_NAME
  >;

const FiltersMergeRequest: React.FC<FiltersMergeRequestScreenProps> = (
  props
) => {
  const { route, navigation } = props;
  const dispatch = useAppDispatch();

  const project_id = route.params.project_id;

  const project = useAppSelector((state) => state.current_project).data!;
  const query_default = useAppSelector((state) =>
    selectMergeRequestsByProject(state)(project_id)
  ).query;

  const [query, setQuery] = useState(query_default);

  /* header */
  const TitleComp = useCallback(
    () => <TitleHeader title={"Merge Requests"} subtitle={"Filters"} />,
    []
  );

  const onPressUpdateBtn = useCallback(() => {
    dispatch(updateMergeRequestQuery({ project_id, query }));
    dispatch(fetchMergeRequests({ project_id }));
    navigation.goBack();
  }, [query]);

  const RightComp = useCallback(() => {
    return <ButtonHeader onPress={onPressUpdateBtn} title="UPDATE" />;
  }, [onPressUpdateBtn]);

  /** form */
  const updateQuery = useCallback(
    (atrr: string, val: string | string[] | undefined | null) => {
      setQuery((old) => ({ ...old, [atrr]: val }));
    },
    []
  );

  const updateSearch = useCallback(
    (val: string) => updateQuery("search", val),
    [updateQuery]
  );

  const updateSourceBranch = useCallback(
    (val: string | null) => updateQuery("source_branch", val),
    []
  );

  const updateTargetBranch = useCallback(
    (val: string | null) => updateQuery("target_branch", val),
    []
  );

  const modalState = useRef<Modalvski>(null);
  const handleState = useCallback(() => {
    modalState.current?.open();
  }, []);

  const modalOrderBy = useRef<Modalvski>(null);
  const handleOrderBy = useCallback(() => {
    modalOrderBy.current?.open();
  }, []);

  const modalSortBy = useRef<Modalvski>(null);
  const handleSortBy = useCallback(() => {
    modalSortBy.current?.open();
  }, []);

  const modalScope = useRef<Modalvski>(null);
  const handleScope = useCallback(() => {
    modalScope.current?.open();
  }, []);

  const handleSelectSourceBranch = useCallback(() => {
    const { source_branch } = query;

    navigation.dispatch(
      goToBranchesFromFilterMergeRequest(
        project.id,
        source_branch || "",
        project.name,
        updateSourceBranch
      )
    );
  }, [updateSourceBranch, query, project]);

  const modalSourceBranch = useRef<Modalvski>(null);
  const handleSourceBranch = useCallback(() => {
    modalSourceBranch.current?.open();
  }, []);

  const handleSelectTargetBranch = useCallback(() => {
    const { target_branch } = query;

    navigation.dispatch(
      goToBranchesFromFilterMergeRequest(
        project.id,
        target_branch || "",
        project.name,
        updateTargetBranch
      )
    );
  }, [query, project, updateTargetBranch]);

  const modalTargetBranch = useRef<Modalvski>(null);
  const handleTargetBranch = useCallback(() => {
    modalTargetBranch.current?.open();
  }, []);

  const state_val = useMemo(() => firstLetterUp(query.state), [query.state]);

  const order_by_val = useMemo(() => getReadableRequest(query.order_by), [
    query.order_by,
  ]);

  const sort_by_val = useMemo(() => getReadableRequest(query.sort), [
    query.sort,
  ]);

  const scope_val = useMemo(() => getReadableRequest(query.scope), [
    query.scope,
  ]);

  const source_branch_val = useMemo(() => query.source_branch ?? "any", [
    query.source_branch,
  ]);

  const target_branch_val = useMemo(() => query.target_branch ?? "any", [
    query.target_branch,
  ]);

  return (
    <Container>
      <Header
        center={TitleComp}
        right={RightComp}
        isModal={true}
        backBtn={true}
      />
      <ScrollView style={{ flex: 1 }} paddingTop={true}>
        <ItemGroup>
          <ItemInput
            label="Search by title"
            placeholder="Search"
            value={query.search}
            onChangeText={updateSearch}
          />
          <ItemSelect label="State" value={state_val} onPress={handleState} />
          <ItemSelect
            label="Order by"
            value={order_by_val}
            onPress={handleOrderBy}
          />
          <ItemSelect
            label="Sort by"
            value={sort_by_val}
            onPress={handleSortBy}
          />
          <ItemSelect label="Scope" value={scope_val} onPress={handleScope} />
          <ItemSelect
            label="Source branch"
            value={source_branch_val}
            onPress={handleSourceBranch}
          />
          <ItemSelect
            label="Target branch"
            value={target_branch_val}
            onPress={handleTargetBranch}
            borderBottom={false}
          />
        </ItemGroup>
      </ScrollView>
      <ModalvskiOptions
        ref={modalState}
        options={RequestQueryValues.merge_request_state}
        showCheck={(option) => option == query.state}
        optionFormat={firstLetterUp}
        onPress={(option) => updateQuery("state", option)}
      />
      <ModalvskiOptions
        ref={modalOrderBy}
        options={RequestQueryValues.order_by}
        showCheck={(option) => option == query.order_by}
        optionFormat={getReadableRequest}
        onPress={(option) => updateQuery("order_by", option)}
      />
      <ModalvskiOptions
        ref={modalSortBy}
        options={RequestQueryValues.sort}
        showCheck={(option) => option == query.sort}
        optionFormat={getReadableRequest}
        onPress={(option) => updateQuery("sort", option)}
      />
      <ModalvskiOptions
        ref={modalScope}
        options={RequestQueryValues.scope}
        showCheck={(option) => option == query.scope}
        optionFormat={getReadableRequest}
        onPress={(option) => updateQuery("scope", option)}
      />
      <Modalvski ref={modalSourceBranch} cancelBtn={false}>
        <ItemGroup>
          <ItemPressable
            title="Select source branch..."
            onPress={handleSelectSourceBranch}
            renderIcon={() => (
              <IconThemed type="git" size={GENERAL_ICON_SIZE} name="branch" />
            )}
          />
          <ItemPressable
            title="Clear"
            onPress={() => updateSourceBranch(null)}
            renderIcon={() => (
              <IconThemed
                type="ionicon"
                size={GENERAL_ICON_SIZE}
                name="trash-outline"
              />
            )}
            borderBottom={false}
          />
        </ItemGroup>
      </Modalvski>
      <Modalvski ref={modalTargetBranch} cancelBtn={false}>
        <ItemGroup>
          <ItemPressable
            title="Select target branch..."
            onPress={handleSelectTargetBranch}
            renderIcon={() => (
              <IconThemed type="git" size={GENERAL_ICON_SIZE} name="branch" />
            )}
          />
          <ItemPressable
            title="Clear"
            onPress={() => updateTargetBranch(null)}
            renderIcon={() => (
              <IconThemed
                type="ionicon"
                size={GENERAL_ICON_SIZE}
                name="trash-outline"
              />
            )}
            borderBottom={false}
          />
        </ItemGroup>
      </Modalvski>
    </Container>
  );
};

export default FiltersMergeRequest;
