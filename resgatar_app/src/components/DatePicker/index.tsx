import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform, Button } from "react-native";
import { useState } from "react";

interface BirthdayPickerProps {
  date: number;
  handleDate: (date: number) => void;
}

export const BirthdayPicker = ({ date, handleDate }: BirthdayPickerProps) => {
  const [show, setShow] = useState(false);

  return (
    <>
      <Button
        title={
          date
            ? new Date(date).toLocaleDateString("pt-BR")
            : "Data de nascimento"
        }
        onPress={() => setShow(true)}
      />

      {show && (
        <DateTimePicker
          value={date ? new Date(date) : new Date()}
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
