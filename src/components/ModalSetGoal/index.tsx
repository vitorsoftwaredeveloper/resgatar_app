import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { ModalBase } from "@/components/ModalBase";
import { ToastMessage } from "@/components/Toast";
import { useAppTheme } from "@/context/ThemeContext";
import { ChargeServices } from "@/services/ChargeService";
import { currencyToBackendBRL, maskCurrencyBRL } from "@/utils/mask";
import { Formik } from "formik";
import { Save } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import * as Yup from "yup";
import { useStyles } from "./styles";

// Define a meta mensal (admin) via PUT /charges/monthly-goal. O valor é digitado
// em BRL e enviado no formato "xx,xx" que o backend espera. `month` é 1-indexado,
// mesma convenção do getGoalProgress que alimenta o card.

type Props = {
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
  year: number;
  month: number; // 1-indexado
  monthLabel: string;
  currentGoal?: number;
};

const goalSchema = Yup.object().shape({
  amount: Yup.string()
    .required("Valor é obrigatório")
    .test("positivo", "Informe um valor maior que zero", (value) => {
      if (!value) return false;
      return Number(currencyToBackendBRL(value).replace(",", ".")) > 0;
    }),
});

export function ModalSetGoal({
  visible,
  onClose,
  onSaved,
  year,
  month,
  monthLabel,
  currentGoal,
}: Props) {
  const { colors, mode } = useAppTheme();
  const styles = useStyles();

  const initialValues = {
    amount: currentGoal ? maskCurrencyBRL(currentGoal.toFixed(2)) : "",
  };

  const handleSave = async (values: typeof initialValues) => {
    try {
      await ChargeServices.setMonthlyGoal(
        year,
        month,
        currencyToBackendBRL(values.amount),
      );
      ToastMessage.success("Meta atualizada");
      onSaved();
      setTimeout(onClose, 800);
    } catch {
      ToastMessage.error("Erro", "Não foi possível salvar a meta.");
    }
  };

  return (
    <Formik
      key={`${year}-${month}-${currentGoal ?? ""}`}
      initialValues={initialValues}
      validationSchema={goalSchema}
      onSubmit={handleSave}
    >
      {({
        values,
        errors,
        touched,
        setFieldValue,
        handleSubmit,
        validateForm,
        isSubmitting,
      }) => (
        <ModalBase onClose={onClose} visible={visible} title="Meta do mês">
          <View style={styles.overlay}>
            <ScrollView
              style={styles.container}
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
            >
              <Card title={`Meta de ${monthLabel}`}>
                <Text style={styles.hint}>
                  Defina quanto a comunidade pretende arrecadar neste mês. Esse
                  valor vira a meta exibida no card da Home.
                </Text>

                <Input
                  label="Valor da meta"
                  value={values.amount}
                  onChangeText={(text) =>
                    setFieldValue("amount", maskCurrencyBRL(text))
                  }
                  error={touched.amount && errors.amount}
                  keyboardType="numeric"
                  placeholder="R$ 0,00"
                />
              </Card>
            </ScrollView>

            <View style={styles.footer}>
              <Button
                title="Salvar meta"
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
                      "Revise o valor informado.",
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
