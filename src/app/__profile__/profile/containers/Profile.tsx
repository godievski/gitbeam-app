import React, { useCallback, useEffect, useMemo } from "react";
import UserProfile from "../../../../components/Layouts/UserProfile";
import ProfileLinks from "../components/ProfileLinks";
import ProfileSummary from "../components/ProfileSummary";
import RefreshControlCommon from "../../../../components/RN/RefreshControlCommon";
import Header from "../../../../components/Header/Header";
import { goToSshKeys } from "../../ssh-keys/config/navigation";
import Container from "../../../../components/Layouts/Container";
import ScrollView from "../../../../components/RN/ScrollView";
import { StackScreenTmpProps } from "../../../../core/utils";
import { ProfileScreenParams, PROFILE_SCREEN_NAME } from "../config/navigation";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { fetchUser } from "../config/userSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useToast } from "../../../../components/Toast/ToastContext";
import { fetchSshKeys } from "../../ssh-keys/config/sshkeysSlice";

interface ScreenProps {}

type ProfileScreenProps = ScreenProps &
  StackScreenTmpProps<ProfileScreenParams, typeof PROFILE_SCREEN_NAME>;

const Profile: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();

  const toast = useToast();

  useEffect(() => {
    const cb = async () => {
      try {
        await Promise.all([
          dispatch(fetchUser()).then(unwrapResult),
          dispatch(fetchSshKeys()).then(unwrapResult),
        ]);
      } catch (e) {
        toast.updateError(e);
      }
    };
    cb();
  }, []);

  const user_state = useAppSelector((state) => state.user);
  const ssh_keys = useAppSelector((state) => state.ssh_keys);
  const user = user_state.data;

  const loading = useMemo(() => {
    return user_state.loading;
  }, [user_state.loading]);

  const onRefresh = useCallback(async () => {
    try {
      await dispatch(fetchUser()).then(unwrapResult);
    } catch (e) {
      toast.updateError(e);
    }
  }, []);

  const onPressSSHKeys = useCallback(() => {
    navigation.dispatch(goToSshKeys());
  }, []);

  return (
    <Container>
      <Header backBtn={false} burgerBtn={true} />
      <ScrollView
        paddingTop={true}
        refreshControl={
          <RefreshControlCommon
            refreshing={user_state.loading}
            onRefresh={onRefresh}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {!!user.username && (
          <>
            <UserProfile
              name={user.name}
              avatar_url={user.avatar_url}
              username={user.username}
              visibility={user.private_profile ? "private" : "public"}
            />
            <ProfileSummary
              public_email={user.public_email}
              website_url={user.website_url}
              organization={user.organization}
              bio={user.bio}
              state={user.state}
            />
            <ProfileLinks
              onPressSSHKeys={onPressSSHKeys}
              keysCount={ssh_keys.entities.length}
              loading={ssh_keys.loading}
            />
          </>
        )}
      </ScrollView>
    </Container>
  );
};

export default Profile;
