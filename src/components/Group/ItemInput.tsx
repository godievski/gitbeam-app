import React from "react";
import { StyleSheet, View, TextInput, TextInputProperties } from "react-native";
import { useTheme } from "../../theme/hooks";
import ItemComponent from "./ItemComponent";

type ItemInputProps = TextInputProperties & {
  //component props
  label?: string;
  borderBottom?: boolean;
  borderTop?: boolean;
};

const ItemInput: React.FC<ItemInputProps> = ({
  label,
  borderBottom,
  borderTop,
  ...inputProps
}) => {
  const theme = useTheme();

  const { style, multiline, autoCapitalize = "none" } = inputProps;

  return (
    <ItemComponent
      label={label}
      borderBottom={borderBottom}
      borderTop={borderTop}
    >
      <View style={styles.container}>
        <TextInput
          {...inputProps}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          style={StyleSheet.flatten([
            styles.input,
            {
              textAlignVertical: multiline ? "top" : "auto",
              color: theme.colors.text_primary,
            },
            style,
          ])}
          placeholderTextColor={theme.colors.placeholder}
          keyboardAppearance={theme.isDark ? "dark" : "light"}
        />
      </View>
    </ItemComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    alignSelf: "center",
    color: "black",
    fontSize: 16,
    flex: 1,
    // minHeight: 40,
    padding: 0,
    margin: 0,
  },
});

export default React.memo(ItemInput);
