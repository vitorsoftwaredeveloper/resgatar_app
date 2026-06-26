import { Dialog } from "@/components/Dialog";
import { Header } from "@/components/Header";
import { ToastMessage } from "@/components/Toast";
import { AuthContext } from "@/context/AuthContext";
import { useAppTheme } from "@/context/ThemeContext";
import { ExpenseServices } from "@/services/ExpenseService";
import {
  EXPENSE_CATEGORY_LABELS,
  ExpenseCategory,
  IExpense,
  IExpensesSummary,
} from "@/types/Expense";
import { formatDateFromTimestamp, formatMoneyBRL } from "@/utils/helper";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Receipt,
  Trash2,
} from "lucide-react-native";
import React, { useCallback, useContext, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ModalExpenseForm } from "./ModalExpenseForm";
import { useStyles } from "./styles";

const MONTH_LABELS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function ExpensesScreen() {
  const navigation = useNavigation();
  const styles = useStyles();
  const { colors } = useAppTheme();
  const { member } = useContext(AuthContext);

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [summary, setSummary] = useState<IExpensesSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<IExpense | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IExpense | null>(null);
  // _id da despesa cujo comprovante está sendo buscado (spinner no ícone).
  const [loadingReceiptId, setLoadingReceiptId] = useState<string | null>(null);
  // _id da despesa expandida (mostra os detalhes completos). Só uma por vez.
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function toggleExpanded(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  // Bloqueia navegação para meses futuros (igual à Arrecadação).
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // Os endpoints de despesa usam `month` 0-indexado — passa direto.
      const data = await ExpenseServices.getSummary(year, month);
      setSummary(data);
    } catch {
      setSummary(null);
      ToastMessage.error("Erro", "Não foi possível carregar as despesas.");
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  function goToPreviousMonth() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function goToNextMonth() {
    if (isCurrentMonth) return;
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  }

  function openCreate() {
    setEditing(null);
    setModalVisible(true);
  }

  function openEdit(expense: IExpense) {
    setEditing(expense);
    setModalVisible(true);
  }

  // Abre o comprovante da despesa numa URL temporária (presigned GET).
  async function handleViewReceipt(expense: IExpense) {
    if (loadingReceiptId) return;
    setLoadingReceiptId(expense._id);
    try {
      const url = await ExpenseServices.getReceiptViewUrl(expense._id);
      await Linking.openURL(url);
    } catch {
      ToastMessage.error("Erro", "Não foi possível abrir o comprovante.");
    } finally {
      setLoadingReceiptId(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await ExpenseServices.remove(deleteTarget._id);
      ToastMessage.success("Despesa removida");
      load();
    } catch {
      ToastMessage.error("Erro", "Não foi possível remover.");
    } finally {
      setDeleteTarget(null);
    }
  }

  function renderExpense({ item }: { item: IExpense }) {
    const isExpanded = expandedId === item._id;
    const categoryLabel =
      EXPENSE_CATEGORY_LABELS[item.category as ExpenseCategory] ??
      item.category;

    return (
      <TouchableOpacity
        style={styles.expenseCard}
        onPress={() => toggleExpanded(item._id)}
        activeOpacity={0.7}
        accessibilityLabel={
          isExpanded ? "Recolher despesa" : "Expandir despesa"
        }
      >
        <View style={styles.expenseRow}>
          <View style={styles.expenseInfo}>
            <Text style={styles.expenseName} numberOfLines={isExpanded ? 0 : 1}>
              {item.description}
            </Text>
            <Text style={styles.expenseMeta} numberOfLines={1}>
              {categoryLabel} · {formatDateFromTimestamp(item.date)}
            </Text>
          </View>
          <Text style={styles.expenseValue}>{formatMoneyBRL(item.amount)}</Text>
          <View style={styles.expenseActions}>
            <TouchableOpacity
              style={styles.rowAction}
              onPress={() => openEdit(item)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Editar despesa"
            >
              <Pencil size={18} color={colors.primary} />
            </TouchableOpacity>
            {item.receiptKey ? (
              <TouchableOpacity
                style={styles.rowAction}
                onPress={() => handleViewReceipt(item)}
                disabled={loadingReceiptId === item._id}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityLabel="Ver comprovante"
              >
                {loadingReceiptId === item._id ? (
                  <ActivityIndicator size={18} color={colors.textMuted} />
                ) : (
                  <Receipt size={18} color={colors.textMuted} />
                )}
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              style={styles.rowAction}
              onPress={() => setDeleteTarget(item)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Remover item"
            >
              <Trash2 size={18} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        {isExpanded && (
          <View style={styles.expenseDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Categoria</Text>
              <Text style={styles.detailValue}>{categoryLabel}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Data</Text>
              <Text style={styles.detailValue}>
                {formatDateFromTimestamp(item.date)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Valor</Text>
              <Text style={styles.detailValue}>
                {formatMoneyBRL(item.amount)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Referência</Text>
              <Text style={styles.detailValue}>
                {MONTH_LABELS[item.referenceMonth]} {item.referenceYear}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Observação</Text>
              <Text style={styles.detailValue}>{item.note || "—"}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Comprovante</Text>
              <Text style={styles.detailValue}>
                {item.receiptKey ? "Anexado" : "Nenhum"}
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  const categoryEntries = summary
    ? Object.entries(summary.byCategory).sort((a, b) => b[1] - a[1])
    : [];

  // Despesas da mais recente para a mais antiga (decrescente por data).
  const sortedExpenses = summary
    ? [...summary.expenses].sort((a, b) => b.date - a.date)
    : [];

  const header = summary ? (
    <View style={{ gap: styles.list.gap }}>
      <View style={styles.monthSelector}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={goToPreviousMonth}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Mês anterior"
        >
          <ChevronLeft size={22} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.monthLabel}>
          {MONTH_LABELS[month]} {year}
        </Text>
        <TouchableOpacity
          style={[styles.navButton, isCurrentMonth && styles.navButtonDisabled]}
          onPress={goToNextMonth}
          disabled={isCurrentMonth}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Próximo mês"
        >
          <ChevronRight size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.metaLabel}>Total de despesas no mês</Text>
        <Text style={styles.totalValue}>{formatMoneyBRL(summary.total)}</Text>
        <Text style={styles.metaLabel}>
          {summary.count} {summary.count === 1 ? "lançamento" : "lançamentos"}
        </Text>

        {categoryEntries.length > 0 && (
          <View style={styles.breakdown}>
            {categoryEntries.map(([cat, value]) => (
              <View key={cat} style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>
                  {EXPENSE_CATEGORY_LABELS[cat as ExpenseCategory] ?? cat}
                </Text>
                <Text style={styles.breakdownValue}>
                  {formatMoneyBRL(value)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  ) : null;

  return (
    <View style={styles.container}>
      <Header
        name={member?.firstName + " " + member?.lastName}
        photo={member?.profileImage}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <Text style={styles.screenTitle}>Despesa mensal</Text>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginTop: 32 }}
          />
        ) : !summary ? (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>
              Não foi possível carregar as despesas.
            </Text>
          </View>
        ) : (
          <FlatList
            data={sortedExpenses}
            keyExtractor={(item) => item._id}
            renderItem={renderExpense}
            ListHeaderComponent={header}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.centered}>
                <Receipt size={32} color={colors.textMuted} />
                <Text style={styles.emptyText}>
                  Nenhuma despesa lançada neste mês.
                </Text>
              </View>
            }
          />
        )}
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={openCreate}
        activeOpacity={0.85}
        accessibilityLabel="Nova despesa"
      >
        <Plus size={24} color={colors.white} />
      </TouchableOpacity>

      {modalVisible && (
        <ModalExpenseForm
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSaved={load}
          referenceMonth={month}
          referenceYear={year}
          expense={editing}
        />
      )}

      <Dialog
        visible={Boolean(deleteTarget)}
        title="Remover despesa"
        description={
          deleteTarget
            ? `Deseja remover "${deleteTarget.description}"? Essa ação não pode ser desfeita.`
            : ""
        }
        onClose={() => setDeleteTarget(null)}
        actions={[
          {
            label: "cancelar",
            onPress: () => setDeleteTarget(null),
            variant: "secondary",
          },
          {
            label: "remover",
            onPress: handleDelete,
            variant: "primary",
          },
        ]}
      />
    </View>
  );
}
