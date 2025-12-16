import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform, Button } from "react-native";
import { useState } from "react";
import { formatUTCToDateBR } from "@/utils/helper";

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
      <Button
        title={date ? formatUTCToDateBR(date) : "Data de nascimento"}
        onPress={() => setShow(true)}
      />

      {show && (
        <DateTimePicker
          value={getDateForPicker(date)}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          maximumDate={new Date()}
          onChange={(event, selectedDate) => {
            setShow(false);
            if (selectedDate) handleDate(event.nativeEvent.timestamp);
          }}
        />
      )}
    </>
  );
};
