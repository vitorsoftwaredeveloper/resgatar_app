import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SPACING, TYPOGRAPHY } from "@/theme";
import { Check, ChevronDown, ChevronUp } from "lucide-react-native";
import React, { useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface SelectOption {
  label: string;
  value: string | number;
}

interface Props {
  label?: string;
  placeholder?: string;
  value: string | number | null;
  options: SelectOption[];
  onSelect: (value: string | number) => void;
  error?: string | false;
}

// Altura máxima da lista aberta.
const LIST_MAX_HEIGHT = 240;
const GAP = 6;

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Campo de seleção com lista local. A lista é um overlay ancorado ao campo
// (Modal transparente posicionado nas coordenadas medidas), então rola nativo
// e nunca empurra o layout. Decide abrir para baixo ou para cima conforme o
// espaço disponível na tela.
export function SelectField({
  label,
  placeholder = "Selecionar",
  value,
  options,
  onSelect,
  error,
}: Props) {
  const { colors } = useAppTheme();
  const styles = useStyles();
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<Rect | null>(null);
  const anchorRef = useRef<View>(null);

  const selected = options.find((o) => o.value === value);

  const openList = () => {
    const node = anchorRef.current;
    if (!node) return;
    node.measureInWindow((x, y, width, height) => {
      setRect({ x, y, width, height });
      setOpen(true);
    });
  };

  // Geometria do overlay: posição e altura conforme o espaço acima/abaixo.
  const popover = useMemo(() => {
    if (!rect) return null;
    const windowH = Dimensions.get("window").height;
    const spaceBelow = windowH - (rect.y + rect.height) - GAP;
    const spaceAbove = rect.y - GAP;
    const dropUp = spaceBelow < LIST_MAX_HEIGHT && spaceAbove > spaceBelow;
    const available = dropUp ? spaceAbove : spaceBelow;
    const height = Math.min(LIST_MAX_HEIGHT, available);
    const top = dropUp
      ? rect.y - height - GAP
      : rect.y + rect.height + GAP;
    return { left: rect.x, width: rect.width, top, height, dropUp };
  }, [rect]);

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View ref={anchorRef} collapsable={false}>
        <TouchableOpacity
          style={[styles.field, open && styles.fieldOpen, error ? styles.fieldError : null]}
          onPress={openList}
          activeOpacity={0.8}
        >
          <Text style={selected ? styles.value : styles.placeholder} numberOfLines={1}>
            {selected ? selected.label : placeholder}
          </Text>
          {open ? (
            <ChevronUp size={18} color={colors.textMuted} />
          ) : (
            <ChevronDown size={18} color={colors.textMuted} />
          )}
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          {popover && (
            <View
              style={[
                styles.list,
                {
                  position: "absolute",
                  left: popover.left,
                  width: popover.width,
                  top: popover.top,
                  maxHeight: popover.height,
                },
              ]}
            >
              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator
                persistentScrollbar
              >
                {options.map((opt) => {
                  const active = opt.value === value;
                  return (
                    <TouchableOpacity
                      key={String(opt.value)}
                      style={[styles.option, active && styles.optionActive]}
                      onPress={() => {
                        onSelect(opt.value);
                        setOpen(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.optionText, active && styles.optionTextActive]}>
                        {opt.label}
                      </Text>
                      {active && <Check size={16} color={colors.primary} />}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </Pressable>
      </Modal>
    </View>
  );
}

function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        wrapper: { flex: 1, marginBottom: 12 },
        label: { fontSize: 13, color: colors.muted, marginBottom: 6 },
        field: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: colors.inputBg,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 20,
          paddingHorizontal: 14,
          paddingVertical: 14,
        },
        fieldOpen: { borderColor: colors.primary },
        fieldError: { borderColor: colors.error },
        value: { fontSize: TYPOGRAPHY.body, color: colors.text },
        placeholder: { fontSize: TYPOGRAPHY.body, color: colors.textMuted },
        errorText: {
          fontSize: TYPOGRAPHY.small,
          color: colors.error,
          marginTop: 4,
        },
        overlay: { flex: 1 },
        list: {
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: RADIUS.md,
          backgroundColor: colors.card,
          overflow: "hidden",
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.18,
          shadowRadius: 10,
        },
        option: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: SPACING.sm2,
          paddingHorizontal: SPACING.md,
        },
        optionActive: {
          backgroundColor: colors.inputBg,
        },
        optionText: {
          fontSize: TYPOGRAPHY.body,
          color: colors.text,
        },
        optionTextActive: {
          color: colors.primary,
          fontWeight: "700",
        },
      }),
    [colors],
  );
}
