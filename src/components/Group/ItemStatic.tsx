import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { useTheme } from "../../theme/hooks";
import { GENERAL_CONTAINER_PADDING_VERTICAL } from "../../core/styles/general";
import {
  GENERAL_BORDER,
  GENERAL_CONTAINER_PADDING_HORIZONTAL,
} from "../../core/styles/general";
import Separator from "./Separator";

interface ItemStaticProps {
  label?: string;
  value: string;
  valueProps?;

  borderBottom?: boolean;
  borderTop?: boolean;
}

const ItemStatic: React.FC<ItemStaticProps> = (props) => {
  const {
    label,
    value,
    valueProps = {},
    borderTop = false,
    borderBottom = true,
  } = props;

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
          <View style={styles.subwrapper}>
            {!!label && (
              <Text
                style={[styles.label, { color: theme.colors.text_secondary }]}
              >
                {label}
              </Text>
            )}

            <Text
              {...valueProps}
              style={[styles.value, { color: theme.colors.text_primary }]}
            >
              {value}
            </Text>
          </View>
        </View>
      </View>
      {borderBottom && <Separator />}
    </>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    fontWeight: "bold",
  },
  value: {
    paddingRight: 10,
    flexWrap: "wrap",
    paddingVertical: GENERAL_CONTAINER_PADDING_VERTICAL,
    fontSize: 16,
  },
  container: {
    borderRadius: GENERAL_BORDER,
    overflow: "hidden",
    height: "auto",
  },
  wrapper: {
    paddingVertical: GENERAL_CONTAINER_PADDING_VERTICAL,
    paddingHorizontal: GENERAL_CONTAINER_PADDING_HORIZONTAL,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: "auto",
  },
  subwrapper: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
});

export default React.memo(ItemStatic);
