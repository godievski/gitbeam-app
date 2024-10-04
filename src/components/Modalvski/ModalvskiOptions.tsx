import React, { forwardRef, memo, useCallback } from "react";
import { Modalvski } from "./Modalvski";
import ItemGroup from "../Group/ItemGroup";
import ItemPressable from "../Group/ItemPressable";
import TextThemed from "../Commons/TextThemed";
import Ionicons from "react-native-vector-icons/Ionicons";
import { GENERAL_ICON_SIZE } from "../../core/styles/general";

type ModalvskiOptionsProps = {
  options: string[];
  optionFormat?: (value: string) => string;
  showCheck: (item: string) => boolean;
  onPress: (item: string) => void;
  cancelBtn?: boolean;
};

const ModalvskiOptions = forwardRef<Modalvski, ModalvskiOptionsProps>(
  (props, ref) => {
    const { showCheck, options, onPress, optionFormat, cancelBtn } = props;

    const format = useCallback(
      (s: string) => {
        if (optionFormat) {
          return optionFormat(s);
        }
        return s;
      },
      [optionFormat]
    );

    return (
      <Modalvski ref={ref} cancelBtn={cancelBtn}>
        <ItemGroup>
          {options.map((option, index) => {
            const selected = showCheck(option);
            return (
              <ItemPressable
                title={format(option)}
                onPress={() => {
                  !selected && onPress(option);
                }}
                renderRight={() => {
                  return selected ? (
                    <TextThemed>
                      <Ionicons
                        name="checkmark-outline"
                        size={GENERAL_ICON_SIZE}
                      />
                    </TextThemed>
                  ) : null;
                }}
                borderBottom={index < options.length - 1}
              />
            );
          })}
        </ItemGroup>
      </Modalvski>
    );
  }
);

export default memo(ModalvskiOptions);
