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
import { formatDateFromTimestamp, parseDateBRToTimestamp } from "@/utils/helper";
import {
  currencyToBackendBRL,
  maskCurrencyBRL,
  maskDateBR,
} from "@/utils/mask";
import { Formik } from "formik";
import { Save } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
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

  const isEditing = Boolean(expense);

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
    const payload = {
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
        await ExpenseServices.update(expense._id, payload);
        ToastMessage.success("Despesa atualizada");
      } else {
        await ExpenseServices.create(payload);
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
