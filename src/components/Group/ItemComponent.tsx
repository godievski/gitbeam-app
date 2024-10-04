import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { useTheme } from "../../theme/hooks";
import { GENERAL_CONTAINER_PADDING_VERTICAL } from "../../core/styles/general";
import {
  GENERAL_BORDER,
  GENERAL_CONTAINER_PADDING_HORIZONTAL,
} from "../../core/styles/general";
import Separator from "./Separator";

const styles = StyleSheet.create({
  container: {
    borderRadius: GENERAL_BORDER,
    // overflow: "hidden",
  },
  wrapper: {
    paddingVertical: GENERAL_CONTAINER_PADDING_VERTICAL,
    paddingHorizontal: GENERAL_CONTAINER_PADDING_HORIZONTAL,
    flexDirection: "column",
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
  },
  componentWrapper: {
    paddingVertical: GENERAL_CONTAINER_PADDING_VERTICAL,
    fontSize: 16,
    flex: 1,
  },
});

type Props = {
  label?: string;
  children?: React.ReactNode;
  borderBottom?: boolean;
  borderTop?: boolean;
};

type ItemComponentProps = Props;

const ItemComponent: React.FC<ItemComponentProps> = (props) => {
  const { label, children, borderBottom = true, borderTop = false } = props;

  const theme = useTheme();

  return (
    <>
      {borderTop && <Separator />}
      <View style={styles.container}>
        <View
          style={[
            styles.wrapper,
            { backgroundColor: theme.colors.bg_tertary_color },
          ]}
        >
          {!!label && (
            <Text
              style={[styles.label, { color: theme.colors.text_secondary }]}
            >
              {label}
            </Text>
          )}
          <View style={styles.componentWrapper}>{children}</View>
        </View>
      </View>
      {borderBottom && <Separator />}
    </>
  );
};

export default React.memo(ItemComponent);
