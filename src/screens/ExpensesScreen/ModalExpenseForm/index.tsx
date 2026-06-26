import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { ModalBase } from "@/components/ModalBase";
import { TextArea } from "@/components/TextArea";
import { ToastMessage } from "@/components/Toast";
import { useAppTheme } from "@/context/ThemeContext";
import { ExpenseServices } from "@/services/ExpenseService";
import {
  EXPENSE_CATEGORY_LABELS,
  EXPENSE_CATEGORY_VALUES,
  ExpenseCategory,
  IExpense,
} from "@/types/Expense";
import {
  formatDateFromTimestamp,
  parseDateBRToTimestamp,
} from "@/utils/helper";
import {
  currencyToBackendBRL,
  maskCurrencyBRL,
  maskDateBR,
} from "@/utils/mask";
import { useReceiptPicker, ReceiptAsset } from "@/hooks/useReceiptPicker";
import { Formik } from "formik";
import { Camera, Eye, ImageIcon, Save, Trash2, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";
import { useStyles } from "./styles";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
  referenceMonth: number; // 0–11, mês em foco na tela
  referenceYear: number;
  expense?: IExpense | null; // presente = edição
};

// dd/mm/aaaa válido
const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

const expenseSchema = Yup.object().shape({
  description: Yup.string()
    .required("Descrição é obrigatória")
    .min(2, "Descrição muito curta"),
  amount: Yup.string()
    .required("Valor é obrigatório")
    .test("positivo", "Informe um valor maior que zero", (value) => {
      if (!value) return false;
      return Number(currencyToBackendBRL(value).replace(",", ".")) > 0;
    }),
  category: Yup.string().required("Selecione uma categoria"),
  date: Yup.string()
    .required("Data é obrigatória")
    .matches(dateRegex, "Use o formato dd/mm/aaaa"),
});

export function ModalExpenseForm({
  visible,
  onClose,
  onSaved,
  referenceMonth,
  referenceYear,
  expense,
}: Props) {
  const { colors, mode } = useAppTheme();
  const styles = useStyles();
  const {
    loading: pickingReceipt,
    pickFromLibrary,
    takePhoto,
  } = useReceiptPicker();

  const isEditing = Boolean(expense);

  // Estado do comprovante. São três cenários:
  // - localReceipt: arquivo recém-escolhido, ainda não enviado ao S3.
  // - receiptRemoved: usuário removeu um comprovante que já existia.
  // - nenhum dos dois: mantém o que veio em `expense.receiptKey` (se houver).
  const [localReceipt, setLocalReceipt] = useState<ReceiptAsset | null>(null);
  const [receiptRemoved, setReceiptRemoved] = useState(false);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [viewingReceipt, setViewingReceipt] = useState(false);
  // Qual ação de escolha está em andamento — para o spinner aparecer só no
  // botão clicado (câmera vs. galeria), não em ambos.
  const [activePick, setActivePick] = useState<"library" | "camera" | null>(
    null,
  );

  const hasExistingReceipt = Boolean(expense?.receiptKey) && !receiptRemoved;
  const receiptBusy = pickingReceipt || uploadingReceipt;

  async function handlePickReceipt(source: "library" | "camera") {
    if (receiptBusy) return;
    setActivePick(source);
    try {
      const asset =
        source === "library" ? await pickFromLibrary() : await takePhoto();
      if (asset) {
        setLocalReceipt(asset);
        setReceiptRemoved(false);
      }
    } finally {
      setActivePick(null);
    }
  }

  function handleRemoveReceipt() {
    if (receiptBusy) return;
    setLocalReceipt(null);
    if (expense?.receiptKey) setReceiptRemoved(true);
  }

  // Abre o comprovante já salvo numa URL temporária (presigned GET).
  async function handleViewReceipt() {
    if (!expense?._id || viewingReceipt) return;
    setViewingReceipt(true);
    try {
      const url = await ExpenseServices.getReceiptViewUrl(expense._id);
      await Linking.openURL(url);
    } catch {
      ToastMessage.error("Erro", "Não foi possível abrir o comprovante.");
    } finally {
      setViewingReceipt(false);
    }
  }

  // Data padrão: a despesa existente, ou hoje.
  const defaultDate = expense?.date ?? Date.now();

  const initialValues = {
    description: expense?.description ?? "",
    amount: expense ? maskCurrencyBRL(expense.amount) : "",
    category: (expense?.category ?? "") as ExpenseCategory | "",
    date: formatDateFromTimestamp(defaultDate),
    note: expense?.note ?? "",
  };

  const handleSave = async (values: typeof initialValues) => {
    const date = parseDateBRToTimestamp(values.date);

    // Resolve o comprovante ANTES de salvar a despesa: sobe o novo arquivo (se
    // houver) e decide o que mandar em receiptKey.
    //   string  -> novo comprovante (ou substituição)
    //   null    -> remover o existente (só na edição)
    //   undefined -> não mexe (mantém o atual / cria sem comprovante)
    let receiptKey: string | null | undefined;
    if (localReceipt) {
      setUploadingReceipt(true);
      try {
        receiptKey = await ExpenseServices.uploadReceipt(
          localReceipt.uri,
          localReceipt.contentType,
        );
      } catch {
        ToastMessage.error(
          "Erro",
          "Não foi possível enviar o comprovante. Tente novamente.",
        );
        return;
      } finally {
        setUploadingReceipt(false);
      }
    } else if (isEditing && receiptRemoved) {
      receiptKey = null;
    }

    const basePayload = {
      description: values.description.trim(),
      amount: currencyToBackendBRL(values.amount),
      category: values.category as ExpenseCategory,
      referenceMonth,
      referenceYear,
      date,
      note: values.note?.trim() ? values.note.trim() : undefined,
    };

    try {
      if (isEditing && expense) {
        // Inclui receiptKey só quando há mudança (novo arquivo ou remoção).
        await ExpenseServices.update(
          expense._id,
          receiptKey !== undefined
            ? { ...basePayload, receiptKey }
            : basePayload,
        );
        ToastMessage.success("Despesa atualizada");
      } else {
        await ExpenseServices.create(
          receiptKey ? { ...basePayload, receiptKey } : basePayload,
        );
        ToastMessage.success("Despesa cadastrada");
      }
      onSaved();
      setTimeout(onClose, 800);
    } catch {
      ToastMessage.error(
        "Erro",
        isEditing
          ? "Não foi possível atualizar a despesa."
          : "Não foi possível cadastrar a despesa.",
      );
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={expenseSchema}
      onSubmit={handleSave}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        setFieldValue,
        handleSubmit,
        validateForm,
        isSubmitting,
      }) => (
        <ModalBase
          onClose={onClose}
          visible={visible}
          title={isEditing ? "Editar despesa" : "Nova despesa"}
        >
          <View style={styles.overlay}>
            <ScrollView
              style={styles.container}
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
            >
              <Card title="Dados da despesa">
                <Input
                  label="Descrição"
                  value={values.description}
                  onChangeText={handleChange("description")}
                  error={touched.description && errors.description}
                  placeholder="Ex.: Compra de material de limpeza"
                />

                <Input
                  label="Valor"
                  value={values.amount}
                  onChangeText={(text) =>
                    setFieldValue("amount", maskCurrencyBRL(text))
                  }
                  error={touched.amount && errors.amount}
                  keyboardType="numeric"
                  placeholder="R$ 0,00"
                />

                <Input
                  label="Data"
                  value={values.date}
                  onChangeText={(text) =>
                    setFieldValue("date", maskDateBR(text))
                  }
                  error={touched.date && errors.date}
                  keyboardType="numeric"
                  placeholder="dd/mm/aaaa"
                />

                <Text style={styles.fieldLabel}>Categoria</Text>
                <View style={styles.categoryGrid}>
                  {EXPENSE_CATEGORY_VALUES.map((cat) => {
                    const selected = values.category === cat;
                    return (
                      <TouchableOpacity
                        key={cat}
                        style={[
                          styles.categoryChip,
                          selected && styles.categoryChipSelected,
                        ]}
                        onPress={() => setFieldValue("category", cat)}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.categoryChipText,
                            selected && styles.categoryChipTextSelected,
                          ]}
                        >
                          {EXPENSE_CATEGORY_LABELS[cat]}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                {touched.category && errors.category && (
                  <Text style={styles.errorText}>{errors.category}</Text>
                )}

                <TextArea
                  label="Observação (opcional)"
                  value={values.note}
                  onChangeText={handleChange("note")}
                  numberOfLines={3}
                  placeholder="Detalhes adicionais..."
                />
              </Card>

              <Card title="Comprovante">
                {localReceipt ? (
                  // Novo arquivo escolhido: preview da imagem local, centralizado.
                  <View style={styles.receiptPreviewWrap}>
                    <View style={styles.receiptPreview}>
                      <Image
                        source={{ uri: localReceipt.uri }}
                        style={styles.receiptImage}
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        style={styles.receiptRemoveBadge}
                        onPress={handleRemoveReceipt}
                        disabled={receiptBusy}
                        accessibilityLabel="Remover comprovante"
                      >
                        <X size={16} color={colors.white} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : hasExistingReceipt ? (
                  <Text style={styles.receiptAttachedText}>
                    Comprovante anexado
                  </Text>
                ) : (
                  <Text style={styles.receiptHint}>
                    Anexe a foto do recibo do serviço (opcional).
                  </Text>
                )}

                {hasExistingReceipt && !localReceipt ? (
                  // Comprovante já salvo (e não substituído nesta edição):
                  // ver ou remover. Ao remover, caem os botões Câmera/Trocar.
                  <View style={styles.receiptActions}>
                    <TouchableOpacity
                      style={styles.receiptActionButton}
                      onPress={handleViewReceipt}
                      disabled={viewingReceipt}
                      activeOpacity={0.8}
                    >
                      {viewingReceipt ? (
                        <ActivityIndicator
                          size="small"
                          color={colors.primary}
                        />
                      ) : (
                        <Eye size={18} color={colors.primary} />
                      )}
                      <Text style={styles.receiptActionText}>Ver</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.receiptActionButton}
                      onPress={handleRemoveReceipt}
                      disabled={receiptBusy}
                      activeOpacity={0.8}
                    >
                      <Trash2 size={18} color={colors.error} />
                      <Text
                        style={[
                          styles.receiptActionText,
                          { color: colors.error },
                        ]}
                      >
                        Remover
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.receiptActions}>
                    <TouchableOpacity
                      style={styles.receiptActionButton}
                      onPress={() => handlePickReceipt("camera")}
                      disabled={receiptBusy}
                      activeOpacity={0.8}
                    >
                      {activePick === "camera" ? (
                        <ActivityIndicator
                          size="small"
                          color={colors.primary}
                        />
                      ) : (
                        <Camera size={18} color={colors.primary} />
                      )}
                      <Text style={styles.receiptActionText}>Câmera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.receiptActionButton}
                      onPress={() => handlePickReceipt("library")}
                      disabled={receiptBusy}
                      activeOpacity={0.8}
                    >
                      {activePick === "library" ? (
                        <ActivityIndicator
                          size="small"
                          color={colors.primary}
                        />
                      ) : (
                        <ImageIcon size={18} color={colors.primary} />
                      )}
                      <Text style={styles.receiptActionText}>
                        {localReceipt ? "Trocar" : "Galeria"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </Card>
            </ScrollView>

            <View style={styles.footer}>
              <Button
                title={isEditing ? "Salvar alterações" : "Cadastrar despesa"}
                leftIcon={
                  <Save
                    color={mode === "dark" ? colors.black : colors.white}
                    size={18}
                  />
                }
                onPress={async () => {
                  const formErrors = await validateForm();
                  if (Object.keys(formErrors).length > 0) {
                    ToastMessage.error(
                      "Campos inválidos",
                      "Revise os campos destacados.",
                    );
                  }
                  handleSubmit();
                }}
                loading={isSubmitting}
                disabled={isSubmitting}
              />
            </View>
          </View>
        </ModalBase>
      )}
    </Formik>
  );
}
