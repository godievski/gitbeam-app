import React, {
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import { useTheme } from "../../theme/hooks";
import { View, StyleSheet } from "react-native";
import ModalvskiContext from "./ModalvskiContext";
import { Modalize } from "react-native-modalize";
import useDimensions from "../../core/hooks/useDimensions";
import { GENERAL_BORDER } from "../../core/styles/general";
import ItemGroup from "../Group/ItemGroup";
import ItemPressable from "../Group/ItemPressable";

type Props = {
  children?: React.ReactNode;
  cancelBtn?: boolean;
};

type ModalBaseProps = Props;

const ModalBase = forwardRef<Modalvski, ModalBaseProps>((props, ref) => {
  const modalizeRef = useRef<Modalize>(null);
  const theme = useTheme();
  const dimensions = useDimensions();

  const { width, height } = useMemo(() => {
    return {
      width:
        dimensions.width * (dimensions.orientation === "landscape" ? 0.6 : 1),
      height:
        dimensions.height *
        (dimensions.orientation === "landscape" ? 0.8 : 0.5),
    };
  }, [dimensions]);

  const open = useCallback(() => {
    setImmediate(() => {
      modalizeRef.current?.open();
    });
  }, []);

  const close = useCallback(() => {
    setImmediate(() => {
      modalizeRef.current?.close();
    });
  }, []);
  //assign ref methods
  useImperativeHandle(ref, () => ({
    open,
    close,
  }));

  const renderHeader = useCallback(() => {
    return (
      <View
        style={[
          styles.panelHeader,
          { backgroundColor: theme.colors.actionsheet_bg },
        ]}
      >
        <View
          style={[
            styles.panelHandle,
            { backgroundColor: theme.colors.text_secondary },
          ]}
        />
      </View>
    );
  }, [theme.isDark]);

  const value = useMemo(() => {
    return {
      open,
      close,
    };
  }, [open, close]);

  return (
    <ModalvskiContext.Provider value={value}>
      <Modalize
        ref={modalizeRef}
        HeaderComponent={renderHeader}
        withHandle={false}
        modalHeight={height}
        modalStyle={{
          backgroundColor: "transparent",
        }}
        childrenStyle={{
          backgroundColor: theme.colors.actionsheet_bg,
        }}
      >
        {props.children}
        {props.cancelBtn && (
          <ItemGroup>
            <ItemPressable
              title="Cancel"
              onPress={close}
              dismissModal={false}
              borderBottom={false}
            />
          </ItemGroup>
        )}
      </Modalize>
    </ModalvskiContext.Provider>
  );
});

const styles = StyleSheet.create({
  panelHeader: {
    alignItems: "center",
    paddingTop: 12,
    borderTopRightRadius: GENERAL_BORDER,
    borderTopLeftRadius: GENERAL_BORDER,
    justifyContent: "center",
  },
  panelHandle: {
    width: 36,
    height: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
});

interface IHandle {
  open: () => void;
  close: () => void;
}

export type Modalvski = IHandle;
export const Modalvski = ModalBase;
