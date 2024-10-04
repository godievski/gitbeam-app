import React, { useState, useCallback, useRef } from "react";
import {
  MemberAccess,
  MemberAccessDesc,
  UserBasic,
} from "../../../../core/gitlab/types";
import ItemGroup from "../../../../components/Group/ItemGroup";
import ItemComponent from "../../../../components/Group/ItemComponent";
import { View } from "react-native";
import ItemSelect from "../../../../components/Group/ItemSelect";
import Header from "../../../../components/Header/Header";
import ButtonHeader from "../../../../components/Buttons/ButtonHeader";
import HeaderIndicator from "../../../../components/Header/HeaderIndicator";
import { api } from "../../../../core/oauth";
import _ from "lodash";
import { CRUDState, StackScreenTmpProps } from "../../../../core/utils";
import Container from "../../../../components/Layouts/Container";
import TitleHeader from "../../../../components/Header/TitleHeader";
import {
  NewProjectMemberScreenParams,
  NEW_PROJECT_MEMBER_SCREEN_NAME,
} from "../config/navigation";
import DatePicker from "../../../../components/Commons/DatePicker";
import { GENERAL_ICON_SIZE } from "../../../../core/styles/general";
import MembersSearch from "../components/MembersSearch";
import MembersSelectables from "../components/MembersSelectables";
import { Modalvski } from "../../../../components/Modalvski/Modalvski";
import ItemPressable from "../../../../components/Group/ItemPressable";
import IconThemed from "../../../../components/Icons/IconThemed";
import ScrollView from "../../../../components/RN/ScrollView";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { useToast } from "../../../../components/Toast/ToastContext";
import {
  addMultipleProjectMembers,
  selectMembersByProject,
} from "../config/projectMembersSlice";

const DATE_FORMAT = "YYYY-MM-DD";

const PERMISSIONS = [
  { id: MemberAccess.GUEST, label: MemberAccessDesc[MemberAccess.GUEST] },
  { id: MemberAccess.REPORTER, label: MemberAccessDesc[MemberAccess.REPORTER] },
  {
    id: MemberAccess.DEVELOPER,
    label: MemberAccessDesc[MemberAccess.DEVELOPER],
  },
  {
    id: MemberAccess.MAINTAINER,
    label: MemberAccessDesc[MemberAccess.MAINTAINER],
  },
];

interface Props {}

type NewProjectMemberScreenProps = Props &
  StackScreenTmpProps<
    NewProjectMemberScreenParams,
    typeof NEW_PROJECT_MEMBER_SCREEN_NAME
  >;

const NewProjectMember: React.FC<NewProjectMemberScreenProps> = (props) => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { navigation, route } = props;

  const { project_id } = route.params;

  const members = useAppSelector((state) =>
    selectMembersByProject(state)(project_id)
  );

  const [users, setUsers] = useState<UserBasic[]>([]);
  const [users_map, setUsersMap] = useState<{ [id: string]: boolean }>({});
  const [expires_at, setExpiresAt] = useState<string | undefined>(undefined);
  const [access_level, setAccessLevel] = useState<MemberAccess>(
    MemberAccess.GUEST
  );
  const [users_search, setUsersSearch] = useState<UserBasic[]>([]);
  const [search_query, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);

  const modal = useRef<Modalvski>(null);

  const onPressRolePermissionHandler = useCallback(() => {
    modal.current?.open();
  }, []);

  const onPressInviteBtnHandler = useCallback(() => {
    const new_users = users.map((u) => ({
      user_id: u.id,
      expires_at,
      access_level,
    }));

    dispatch(
      addMultipleProjectMembers({ project_id, members: new_users })
    ).then(() => {
      navigation.goBack();
    });
  }, [users, expires_at, access_level]);

  const TitleComp = useCallback(
    () => <TitleHeader title={"New Project Member"} />,
    []
  );

  const RightHeaderComp = useCallback(() => {
    if (members.state === CRUDState.creating) {
      return <HeaderIndicator />;
    } else {
      return <ButtonHeader title="INVITE" onPress={onPressInviteBtnHandler} />;
    }
  }, [members.state, onPressInviteBtnHandler]);

  const fetchUsers = useCallback((searchQuery: string) => {
    setSearching(true);
    api
      .get(`/users?search=${searchQuery}`)
      .then((res) => {
        setUsersSearch(res.data);
      })
      .catch((err) => {
        setUsersSearch([]);
      })
      .finally(() => setSearching(false));
  }, []);

  const onChangeSearchQuery = useCallback(
    (text: string) => {
      setSearchQuery(text);
      if (text.length > 0) {
        if (!searching) {
          fetchUsers(text);
        }
      } else {
        setUsersSearch([]);
        setSearching(false);
      }
    },
    [searching]
  );

  const onPressSearchUser = useCallback((user: UserBasic) => {
    setUsersMap((prev_users_map) => {
      if (!prev_users_map[user.id]) {
        setUsers((prev_users) => [...prev_users, user]);
      }
      return { ...prev_users_map, [user.id]: true };
    });
  }, []);

  const removeUser = useCallback((user: UserBasic) => {
    setUsers((prev_users) => prev_users.filter((u) => user.id !== u.id));
    setUsersMap((prev_users_map) => _.omit(prev_users_map, [user.id]));
  }, []);

  return (
    <Container>
      <Header
        center={TitleComp}
        right={RightHeaderComp}
        isModal={true}
        backBtn={true}
      />
      <ScrollView style={{ flex: 1 }} paddingTop={true}>
        <ItemGroup>
          <ItemComponent label="MEMBERS TO INVITE">
            <MembersSearch
              onChangeText={onChangeSearchQuery}
              search_query={search_query}
              searching={searching}
              users_search={users_search}
              users_map={users_map}
              onPressSearchUser={onPressSearchUser}
            />
          </ItemComponent>
          <ItemComponent label="SELECTED MEMBERS">
            <MembersSelectables users={users} removeUser={removeUser} />
          </ItemComponent>
          <ItemSelect
            label="ROLE PERMISSION"
            value={MemberAccessDesc[access_level]}
            onPress={onPressRolePermissionHandler}
          />
          <ItemComponent label="ACCESS EXPIRATION DATE" borderBottom={false}>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <DatePicker
                value={expires_at}
                placeholder="Select due date"
                format={DATE_FORMAT}
                onChange={setExpiresAt}
              />
            </View>
          </ItemComponent>
        </ItemGroup>
      </ScrollView>
      <Modalvski ref={modal} cancelBtn={false}>
        <ItemGroup>
          {PERMISSIONS.map((role, index) => {
            const selected = access_level === role.id;
            return (
              <ItemPressable
                title={role.label}
                onPress={() => setAccessLevel(role.id)}
                renderRight={() =>
                  selected ? (
                    <IconThemed
                      type="ionicon"
                      name="checkmark-outline"
                      size={GENERAL_ICON_SIZE}
                    />
                  ) : null
                }
                borderBottom={index < PERMISSIONS.length - 1}
              />
            );
          })}
        </ItemGroup>
      </Modalvski>
    </Container>
  );
};

type Perm = {
  id: string;
  label: string;
};

export default NewProjectMember;
