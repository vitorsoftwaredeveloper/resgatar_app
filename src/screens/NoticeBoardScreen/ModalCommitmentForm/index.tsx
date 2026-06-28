import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Dialog } from "@/components/Dialog";
import { Input } from "@/components/Input";
import { ModalBase } from "@/components/ModalBase";
import { SelectField } from "@/components/SelectField";
import { TimePickerField } from "@/components/TimePickerField";
import { ToastMessage } from "@/components/Toast";
import { useAppTheme } from "@/context/ThemeContext";
import { CommitmentService } from "@/services/CommitmentService";
import {
  CommitmentOrdinal,
  CommitmentRepeat,
  ICommitment,
  ICommitmentInput,
} from "@/types/Commitment";
import { ORDINAL_OPTIONS, WEEKDAY_OPTIONS } from "@/utils/commitment";
import { getApiErrorMessage } from "@/utils/apiError";
import { maskDateBR } from "@/utils/mask";
import { Trash2 } from "lucide-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useStyles } from "./styles";

interface IModalCommitmentForm {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  commitment?: ICommitment | null; // presente = edição
}

const REPEAT_OPTIONS: { label: string; value: CommitmentRepeat }[] = [
  { label: "Toda semana", value: "weekly" },
  { label: "Mensal", value: "monthly" },
  { label: "Data", value: "once" },
];

// Converte "DD/MM/AAAA" em "YYYY-MM-DD" validando uma data real, ou null.
function toISODate(text: string): string | null {
  const m = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const [, dd, mm, yyyy] = m;
  const day = Number(dd);
  const month = Number(mm);
  const year = Number(yyyy);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return `${yyyy}-${mm}-${dd}`;
}

// Pré-preenche o "Data" (once) na edição a partir do ISO retornado pela API.
function initialDateText(commitment?: ICommitment | null): string {
  if (!commitment?.date || commitment.repeat !== "once") return "";
  const d = new Date(commitment.date);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

export function ModalCommitmentForm({
  visible,
  onClose,
  onSuccess,
  commitment,
}: IModalCommitmentForm) {
  const styles = useStyles();
  const { colors } = useAppTheme();
  const isEdit = Boolean(commitment);

  const [title, setTitle] = useState(commitment?.title ?? "");
  const [time, setTime] = useState(commitment?.time ?? "");
  const [location, setLocation] = useState(commitment?.location ?? "");
  const [repeat, setRepeat] = useState<CommitmentRepeat>(
    commitment?.repeat ?? "weekly",
  );
  const [weekday, setWeekday] = useState<number | null>(
    commitment?.weekday ?? null,
  );
  const [ordinal, setOrdinal] = useState<CommitmentOrdinal | null>(
    commitment?.ordinal ?? null,
  );
  const [dateText, setDateText] = useState(initialDateText(commitment));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const clearError = (field: string) =>
    setErrors((prev) => (prev[field] ? { ...prev, [field]: "" } : prev));

  const validate = (): ICommitmentInput | null => {
    const next: Record<string, string> = {};
    if (!title.trim()) next.title = "Informe o nome do compromisso";
    if (!time.trim()) next.time = "Informe o horário";
    if (!location.trim()) next.location = "Informe o local";

    if (repeat !== "once" && weekday === null) next.weekday = "Escolha o dia";
    if (repeat === "monthly" && ordinal === null)
      next.ordinal = "Escolha qual ocorrência";

    let isoDate: string | null = null;
    if (repeat === "once") {
      isoDate = toISODate(dateText);
      if (!isoDate) next.date = "Data inválida (use DD/MM/AAAA)";
    }

    if (Object.keys(next).length > 0) {
      setErrors(next);
      return null;
    }

    const input: ICommitmentInput = {
      title: title.trim(),
      time: time.trim(),
      location: location.trim(),
      repeat,
    };
    if (repeat === "weekly") input.weekday = weekday as number;
    if (repeat === "monthly") {
      input.weekday = weekday as number;
      input.ordinal = ordinal as CommitmentOrdinal;
    }
    if (repeat === "once") input.date = isoDate as string;
    return input;
  };

  const handleSave = async () => {
    const input = validate();
    if (!input) return;

    setSaving(true);
    try {
      if (commitment) {
        await CommitmentService.update(commitment.id, input);
        ToastMessage.success(
          "Compromisso atualizado!",
          "As mudanças já estão no mural.",
        );
      } else {
        await CommitmentService.create(input);
        ToastMessage.success(
          "Compromisso publicado!",
          "Ele já aparece no mural.",
        );
      }
      onSuccess();
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        isEdit
          ? "Falha ao salvar as alterações."
          : "Falha ao publicar compromisso.",
      );
      ToastMessage.error("Erro", message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!commitment) return;
    setDeleting(true);
    try {
      await CommitmentService.remove(commitment.id);
      ToastMessage.success("Compromisso removido", "Ele saiu do mural.");
      setConfirmDelete(false);
      onSuccess();
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        "Falha ao remover compromisso.",
      );
      ToastMessage.error("Erro", message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <ModalBase
      visible={visible}
      onClose={onClose}
      title={isEdit ? "Editar compromisso" : "Novo compromisso"}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <View style={styles.container}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Card
                title="Dados do compromisso"
                description="Aparece no Quadro de Avisos para toda a comunidade."
              >
                <Input
                  label="Nome"
                  placeholder="Ex.: Missa, Terço, Grupo de oração"
                  value={title}
                  onChangeText={(v) => {
                    setTitle(v);
                    clearError("title");
                  }}
                  error={errors.title || false}
                />

                <TimePickerField
                  label="Horário"
                  value={time}
                  onChange={(v) => {
                    setTime(v);
                    clearError("time");
                  }}
                  error={errors.time || false}
                />

                <Input
                  label="Local"
                  placeholder="Igreja Matriz"
                  value={location}
                  onChangeText={(v) => {
                    setLocation(v);
                    clearError("location");
                  }}
                  error={errors.location || false}
                />

                <Text style={styles.fieldLabel}>Frequência</Text>
                <View style={styles.segment}>
                  {REPEAT_OPTIONS.map((opt) => {
                    const active = repeat === opt.value;
                    return (
                      <TouchableOpacity
                        key={opt.value}
                        style={[
                          styles.segmentItem,
                          active && styles.segmentItemActive,
                        ]}
                        onPress={() => setRepeat(opt.value)}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.segmentText,
                            active && styles.segmentTextActive,
                          ]}
                        >
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {repeat !== "once" && (
                  <SelectField
                    label="Dia da semana"
                    placeholder="Selecione o dia"
                    value={weekday}
                    options={WEEKDAY_OPTIONS}
                    onSelect={(v) => {
                      setWeekday(Number(v));
                      clearError("weekday");
                    }}
                    error={errors.weekday || false}
                  />
                )}

                {repeat === "monthly" && (
                  <>
                    <Text style={styles.fieldLabel}>
                      Qual ocorrência do mês
                    </Text>
                    <View style={styles.chipsRow}>
                      {ORDINAL_OPTIONS.map((opt) => {
                        const active = ordinal === opt.value;
                        return (
                          <TouchableOpacity
                            key={String(opt.value)}
                            style={[styles.chip, active && styles.chipActive]}
                            onPress={() => {
                              setOrdinal(opt.value);
                              clearError("ordinal");
                            }}
                            activeOpacity={0.8}
                          >
                            <Text
                              style={[
                                styles.chipText,
                                active && styles.chipTextActive,
                              ]}
                            >
                              {opt.label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                    {errors.ordinal ? (
                      <Text style={styles.errorText}>{errors.ordinal}</Text>
                    ) : null}
                  </>
                )}

                {repeat === "once" && (
                  <Input
                    label="Data"
                    placeholder="DD/MM/AAAA"
                    value={dateText}
                    onChangeText={(v) => {
                      setDateText(maskDateBR(v));
                      clearError("date");
                    }}
                    keyboardType="number-pad"
                    error={errors.date || false}
                  />
                )}
              </Card>
            </ScrollView>

            <View style={styles.footer}>
              {isEdit ? (
                <View style={styles.footerRow}>
                  <View style={styles.saveFlex}>
                    <Button
                      title="Salvar"
                      onPress={handleSave}
                      loading={saving}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => setConfirmDelete(true)}
                    activeOpacity={0.8}
                  >
                    <Trash2 size={18} color={colors.error} />
                    <Text style={styles.deleteText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Button
                  title="Publicar"
                  onPress={handleSave}
                  loading={saving}
                />
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>

      {confirmDelete && (
        <Dialog
          visible={confirmDelete}
          title="Excluir compromisso?"
          description="Ele será removido do mural para todos os membros. Esta ação não pode ser desfeita."
          onClose={() => (deleting ? null : setConfirmDelete(false))}
          actions={[
            {
              label: "cancelar",
              onPress: () => setConfirmDelete(false),
              variant: "secondary",
            },
            {
              label: deleting ? "excluindo..." : "excluir",
              onPress: handleDelete,
              variant: "primary",
            },
          ]}
        />
      )}
    </ModalBase>
  );
}
