import React, { useCallback } from "react";
import { View } from "react-native";
import SearchBar from "../../../../components/SearchBar/SearchBar";
import TextThemed from "../../../../components/Commons/TextThemed";
import { UserBasic } from "../../../../core/gitlab/types";
import MemberSearchRow from "./MemberSeachRow";
import { HeaderIndicatorThemed } from "../../../../components/Header/HeaderIndicator";

type MembersSearchProps = {
  onChangeText: (text: string) => any;
  searching: boolean;
  search_query: string;
  users_search: UserBasic[];
  users_map: { [id: string]: boolean };
  onPressSearchUser: (user: UserBasic) => any;
};

const MembersSearch: React.FC<MembersSearchProps> = (props) => {
  const {
    onChangeText,
    searching,
    search_query,
    users_search,
    onPressSearchUser,
    users_map,
  } = props;

  const keyExtractor = useCallback((item) => `search-row-${item.id}`, []);

  const renderItem = useCallback(
    (item: UserBasic) => {
      return (
        <MemberSearchRow
          key={keyExtractor(item)}
          item={item}
          selected={users_map[item.id]}
          onPress={onPressSearchUser}
        />
      );
    },
    [users_map, onPressSearchUser, keyExtractor]
  );

  return (
    <View style={{ width: "100%" }}>
      <View style={{ width: "100%" }}>
        <SearchBar
          onChangeText={onChangeText}
          containerStyle={{
            paddingHorizontal: 0,
            paddingVertical: 0,
          }}
        />
      </View>
      {searching ? (
        <View
          style={{
            justifyContent: "flex-start",
            alignItems: "center",
            flexDirection: "row",
            paddingTop: 12,
          }}
        >
          <HeaderIndicatorThemed />
          <TextThemed style={{ flexWrap: "wrap" }}>
            Searching for "{search_query}"
          </TextThemed>
        </View>
      ) : null}
      <View
        style={{
          width: "100%",
          borderRadius: 18,
          overflow: "hidden",
          marginTop: 12,
        }}
      >
        {users_search.map(renderItem)}
      </View>
    </View>
  );
};

export default React.memo(MembersSearch);
