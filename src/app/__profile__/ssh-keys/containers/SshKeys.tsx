import React, { useCallback } from "react";
import { View } from "react-native";
import {
  goToSingleSShKey,
  SSH_KEYS_SCREEN_NAME,
  SshKeysParams,
} from "../config/navigation";
import Header from "../../../../components/Header/Header";
import SshKeyItem from "../components/SshKeyItem";
import Container from "../../../../components/Layouts/Container";
import TitleHeader from "../../../../components/Header/TitleHeader";
import EmptyState from "../../../../components/Commons/EmptyState";
import FlatList from "../../../../components/RN/FlatList";
import { StackScreenTmpProps } from "../../../../core/utils";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { TSShKey } from "../../../../core/gitlab/types/users_types";
import { fetchSshKeys } from "../config/sshkeysSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useToast } from "../../../../components/Toast/ToastContext";
import RefreshControlCommon from "../../../../components/RN/RefreshControlCommon";

type ScreenProps = {};

type SshKeysScreenProps = ScreenProps &
  StackScreenTmpProps<SshKeysParams, typeof SSH_KEYS_SCREEN_NAME>;

const SshKeys: React.FC<SshKeysScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const toast = useToast();

  const ssh_keys = useAppSelector((state) => state.ssh_keys);

  // const onLongPressItem = (item: ItemSshKey) => {};

  const onRefresh = useCallback(async () => {
    try {
      await dispatch(fetchSshKeys()).then(unwrapResult);
    } catch (e) {
      toast.updateError(e);
    }
  }, []);

  const onPressItem = useCallback((item: TSShKey) => {
    navigation.dispatch(goToSingleSShKey({ ssh_key: item }));
  }, []);

  const renderTitle = () => {
    return <TitleHeader title={"SSH Keys"} />;
  };

  const keyExtractor = useCallback((item) => {
    return `row-${item.id}`;
  }, []);

  const renderItem = useCallback(
    ({ item }) => {
      return <SshKeyItem item={item} onPress={onPressItem} />;
    },
    [onPressItem]
  );

  return (
    <Container>
      <Header center={renderTitle} />
      <View style={{ flex: 1 }}>
        <FlatList
          keyExtractor={keyExtractor}
          data={ssh_keys.entities}
          renderItem={renderItem}
          ListEmptyComponent={EmptyState}
          refreshControl={
            <RefreshControlCommon
              refreshing={ssh_keys.loading}
              onRefresh={onRefresh}
            />
          }
        />
      </View>
    </Container>
  );
};

export default SshKeys;
