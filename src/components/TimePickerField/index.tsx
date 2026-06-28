import { SelectField, SelectOption } from "@/components/SelectField";
import { useAppTheme } from "@/context/ThemeContext";
import { SPACING } from "@/theme";
import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

// (estilos abaixo usam o tema; o corpo não precisa de cores diretas)

interface Props {
  label?: string;
  value: string; // ex.: "19h", "19h30"
  onChange: (value: string) => void;
  error?: string | false;
}

const HOUR_OPTIONS: SelectOption[] = Array.from({ length: 24 }, (_, h) => ({
  label: `${h}h`,
  value: h,
}));
const MINUTE_OPTIONS: SelectOption[] = [0, 15, 30, 45].map((m) => ({
  label: String(m).padStart(2, "0"),
  value: m,
}));

function parseTime(value: string): { hour: number | null; minute: number } {
  const m = value.match(/^(\d{1,2})h(\d{2})?$/);
  if (!m) return { hour: null, minute: 0 };
  return { hour: Number(m[1]), minute: m[2] ? Number(m[2]) : 0 };
}

function formatTime(hour: number, minute: number): string {
  return minute === 0 ? `${hour}h` : `${hour}h${String(minute).padStart(2, "0")}`;
}

// Horário via dois selects simples (Hora e Minuto), cada um abre uma lista.
export function TimePickerField({ label, value, onChange, error }: Props) {
  const styles = useStyles();

  const initial = parseTime(value);
  const [hour, setHour] = useState<number | null>(initial.hour);
  const [minute, setMinute] = useState<number>(initial.minute);

  const pickHour = (h: string | number) => {
    const next = Number(h);
    setHour(next);
    onChange(formatTime(next, minute));
  };

  const pickMinute = (m: string | number) => {
    const next = Number(m);
    setMinute(next);
    if (hour !== null) onChange(formatTime(hour, next));
  };

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.row}>
        <SelectField
          placeholder="Hora"
          value={hour}
          options={HOUR_OPTIONS}
          onSelect={pickHour}
          error={error}
        />
        <SelectField
          placeholder="Min"
          value={hour !== null ? minute : null}
          options={MINUTE_OPTIONS}
          onSelect={pickMinute}
        />
      </View>
    </View>
  );
}

function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        wrapper: { marginBottom: 0 },
        label: { fontSize: 13, color: colors.muted, marginBottom: 6 },
        row: { flexDirection: "row", gap: SPACING.sm },
      }),
    [colors],
  );
}
