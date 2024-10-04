import React, { memo } from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";
import TextThemed from "../../../../components/Commons/TextThemed";

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
  },
  normal: {
    fontSize: 14,
    flexWrap: "wrap",
  },
});

const SummaryItem = ({ label, value }) => (
  <View style={styles.item}>
    <TextThemed style={styles.label}>{label}</TextThemed>
    <TextThemed type={!!value ? "secondary" : "muted"} style={styles.normal}>
      {value || "- -"}
    </TextThemed>
  </View>
);

type ProfileSummaryProps = {
  public_email;
  website_url;
  organization;
  bio;
  state;
};

const ProfileSummary: React.FC<ProfileSummaryProps> = (props) => {
  const { public_email, website_url, organization, bio } = props;

  return (
    <SafeAreaView style={{ width: "100%" }}>
      <SummaryItem label="BIO" value={bio} />
      <SummaryItem label="PUBLIC EMAIL" value={public_email} />
      <SummaryItem label="WEBSITE URL" value={website_url} />
      <SummaryItem label="ORGANIZATION" value={organization} />
    </SafeAreaView>
  );
};

export default memo(ProfileSummary);
