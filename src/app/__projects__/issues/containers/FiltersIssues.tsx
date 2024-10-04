import React, { useState, useCallback, useRef } from "react";
import { shallowEqual } from "react-redux";
import Container from "../../../../components/Layouts/Container";
import Header from "../../../../components/Header/Header";
import ButtonHeader from "../../../../components/Buttons/ButtonHeader";
import { firstLetterUp, StackScreenTmpProps } from "../../../../core/utils";
import TitleHeader from "../../../../components/Header/TitleHeader";
import { FuncUpdateIssueQuery } from "../config/types";
import {
  FiltersIssuesScreenParams,
  FILTERS_ISSUES_SCREEN_NAME,
} from "../config/navigation";
import ItemGroup from "../../../../components/Group/ItemGroup";
import ItemInput from "../../../../components/Group/ItemInput";
import ItemSelect from "../../../../components/Group/ItemSelect";
import { Modalvski } from "../../../../components/Modalvski/Modalvski";
import ModalvskiOptions from "../../../../components/Modalvski/ModalvskiOptions";
import { RequestQueryValues } from "../../../../core/gitlab/types";
import { getReadableRequest } from "../../../../core/gitlab/utils";
import ScrollView from "../../../../components/RN/ScrollView";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  fetchIssues,
  selectIssuesByProject,
  updateIssuesQuery,
} from "../config/issuesSlice";

type Props = {};

type FiltersIssuesScreenProps = Props &
  StackScreenTmpProps<
    FiltersIssuesScreenParams,
    typeof FILTERS_ISSUES_SCREEN_NAME
  >;

const FiltersIssues: React.FC<FiltersIssuesScreenProps> = (props) => {
  const dispatch = useAppDispatch();
  const { navigation, route } = props;

  const { project_id } = route.params;

  const query_master = useAppSelector(
    (state) => selectIssuesByProject(state)(project_id).query,
    shallowEqual
  );

  const [query, setQuery] = useState(query_master);
  /* header */
  const TitleComp = useCallback(() => {
    return <TitleHeader title={"Issues"} subtitle={"Filters"} />;
  }, []);

  const onPressHeaderBtnHandler = useCallback(() => {
    dispatch(updateIssuesQuery({ project_id, query }));
    dispatch(fetchIssues({ project_id }));
    navigation.goBack();
  }, [query]);

  const HeaderRightComp = useCallback(() => {
    return <ButtonHeader onPress={onPressHeaderBtnHandler} title="UPDATE" />;
  }, [onPressHeaderBtnHandler]);

  /** form */
  const updateQuery: FuncUpdateIssueQuery = useCallback(
    (atrr: string, val: string | string[] | undefined | null) => {
      setQuery((old_query) => ({
        ...old_query,
        [atrr]: val,
      }));
    },
    []
  );

  const updateSearch = useCallback(
    (val: string) => updateQuery("search", val),
    [updateQuery]
  );

  const modalState = useRef<Modalvski>(null);
  const onPressStateHandler = useCallback(() => {
    modalState.current?.open();
  }, []);

  const modalOrderBy = useRef<Modalvski>(null);
  const onPressOrderByHandler = useCallback(() => {
    modalOrderBy.current?.open();
  }, []);

  const modalSortBy = useRef<Modalvski>(null);
  const onPressSortByHandler = useCallback(() => {
    modalSortBy.current?.open();
  }, [query]);

  const modalScope = useRef<Modalvski>(null);
  const onPressScopeHandler = useCallback(() => {
    modalScope.current?.open();
  }, []);

  return (
    <Container>
      <Header
        center={TitleComp}
        right={HeaderRightComp}
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
          <ItemSelect
            label="State"
            value={firstLetterUp(query.state)}
            onPress={onPressStateHandler}
          />
          <ItemSelect
            label="Order by"
            value={getReadableRequest(query.order_by)}
            onPress={onPressOrderByHandler}
          />
          <ItemSelect
            label="Sort by"
            value={getReadableRequest(query.sort)}
            onPress={onPressSortByHandler}
          />
          <ItemSelect
            label="Scope"
            value={getReadableRequest(query.scope)}
            onPress={onPressScopeHandler}
            borderBottom={false}
          />
        </ItemGroup>
      </ScrollView>
      <ModalvskiOptions
        ref={modalState}
        showCheck={(opt) => query.state === opt}
        optionFormat={firstLetterUp}
        options={RequestQueryValues.issue_state}
        onPress={(option) => updateQuery("state", option)}
      />
      <ModalvskiOptions
        ref={modalOrderBy}
        showCheck={(opt) => query.order_by === opt}
        optionFormat={getReadableRequest}
        options={RequestQueryValues.order_by}
        onPress={(option) => updateQuery("order_by", option)}
      />
      <ModalvskiOptions
        ref={modalSortBy}
        showCheck={(opt) => query.sort === opt}
        optionFormat={getReadableRequest}
        options={RequestQueryValues.sort}
        onPress={(option) => updateQuery("sort", option)}
      />
      <ModalvskiOptions
        ref={modalScope}
        showCheck={(opt) => query.scope === opt}
        optionFormat={getReadableRequest}
        options={RequestQueryValues.scope}
        onPress={(option) => updateQuery("scope", option)}
      />
    </Container>
  );
};

export default React.memo(FiltersIssues);
