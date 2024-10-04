import React, { useState, useCallback } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "../../theme/hooks";
import { View, Platform } from "react-native";
import moment from "moment";
import { TouchableOpacity } from "react-native-gesture-handler";
import TextThemed from "./TextThemed";
import Button from "../Buttons/Button";

type DatePickerProps = {
  value: string | undefined;
  onChange(v: string | undefined);
  format: string;
  placeholder: string;
};

//TODO: animate date picker

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  format,
  placeholder,
}) => {
  const theme = useTheme();

  const [date, setDate] = useState(() =>
    value ? moment(value).toDate() : new Date()
  );

  // const [show, setShow] = useState(false);

  const toggleDatePicker = useCallback(() => {
    onChange(moment(date).format(format));
  }, [date]);

  const onChangeDate = useCallback((event, new_date) => {
    if (new_date) {
      if (Platform.OS == "ios") {
        setDate(new_date);
        onChange(moment(new_date).format(format));
      } else {
        if (event.type == "set") {
          setDate(new_date);
          onChange(moment(new_date).format(format));
        }
      }
    } else {
      //nothing for now
    }
  }, []);

  const clearHandle = useCallback(() => {
    onChange(undefined);
  }, []);

  return (
    <View style={{ width: "100%" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 1 }}>
          {value ? (
            <DateTimePicker
              value={date}
              mode="date"
              display="compact"
              onChange={onChangeDate}
              textColor={theme.colors.text_primary}
            />
          ) : (
            <TouchableOpacity
              onPress={toggleDatePicker}
              style={{ backgroundColor: "transparent", width: "100%" }}
            >
              <TextThemed type="muted" style={{ fontSize: 14 }}>
                {placeholder}
              </TextThemed>
            </TouchableOpacity>
          )}
        </View>
        {value && (
          <Button type="clear" onPress={clearHandle}>
            <TextThemed type="secondary" style={{ fontSize: 13 }}>
              Clear
            </TextThemed>
          </Button>
        )}
      </View>
    </View>
  );
};

export default React.memo(DatePicker);
