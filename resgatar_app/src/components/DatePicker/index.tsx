import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform, TouchableOpacity, View, Text } from "react-native";
import { useState } from "react";
import { formatUTCToDateBR } from "@/utils/helper";
import { styles } from "./styles";
import { COLORS } from "@/theme";

interface BirthdayPickerProps {
  date: number;
  handleDate: (date: number) => void;
}

export const BirthdayPicker = ({ date, handleDate }: BirthdayPickerProps) => {
  const [show, setShow] = useState(false);

  function getDateForPicker(timestamp?: number | string): Date {
    if (!timestamp) {
      return new Date();
    }

    const ts = Number(timestamp);

    if (Number.isNaN(ts)) {
      return new Date();
    }

    const date = new Date(ts);

    return new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    );
  }

  return (
    <>
      <TouchableOpacity onPress={() => setShow(true)}>
        <View style={styles.inputBox}>
          <Text style={styles.inputText}>
            {date ? formatUTCToDateBR(date) : "Data de nascimento"}
          </Text>
        </View>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={getDateForPicker(date)}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          maximumDate={new Date()}
          accentColor={COLORS.primary}
          onChange={(event, selectedDate) => {
            setShow(false);
            if (selectedDate) handleDate(event.nativeEvent.timestamp);
          }}
        />
      )}
    </>
  );
};
