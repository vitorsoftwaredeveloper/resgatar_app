import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { Dialog } from "@/components/Dialog";
import { MemberListWithSkeleton } from "@/components/Skeleton/MemberListWithSkeleton";
import { ModalBase } from "@/components/ModalBase";
import { ToastMessage } from "@/components/Toast";
import { AuthContext } from "@/context/AuthContext";
import { ChargeServices } from "@/services/ChargeService";
import { MemberServices } from "@/services/MemberService";
import { COLORS } from "@/theme";
import { IMember, IMemberWithContribution } from "@/types/Member";
import { formatDateFromTimestamp, formatMoneyBRL } from "@/utils/helper";
import { HandCoins } from "lucide-react-native";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { useStyles } from "./styles";

type Props = {
  visible: boolean;
  onClose: () => void;
};

const MONTHS: { key: string; label: string }[] = [
  { key: "january", label: "Janeiro" },
  { key: "february", label: "Fevereiro" },
  { key: "march", label: "Março" },
  { key: "april", label: "Abril" },
  { key: "may", label: "Maio" },
  { key: "june", label: "Junho" },
  { key: "july", label: "Julho" },
  { key: "august", label: "Agosto" },
  { key: "september", label: "Setembro" },
  { key: "october", label: "Outubro" },
  { key: "november", label: "Novembro" },
  { key: "december", label: "Dezembro" },
];

export function ModalRegisterCashPayment({ visible, onClose }: Props) {
  const { listMembers, reloadMemberData } = useContext(AuthContext);
  const styles = useStyles();

  const [members, setMembers] = useState<IMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [detail, setDetail] = useState<IMemberWithContribution | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingMemberId, setLoadingMemberId] = useState<string | null>(null);
  const [registering, setRegistering] = useState<number | null>(null);
  const [confirm, setConfirm] = useState<null | {
    index: number;
    label: string;
  }>(null);

  useEffect(() => {
    if (!visible) return;
    loadMembers();
  }, [visible]);

  async function loadMembers() {
    setLoadingMembers(true);
    try {
      const response = await listMembers();
      setMembers(response as any);
    } finally {
      setLoadingMembers(false);
    }
  }

  async function loadDetail(memberId: string) {
    setLoadingDetail(true);
    try {
      const data = await MemberServices.getMemberById(memberId);
      setDetail(data);
    } catch {
      ToastMessage.error("Erro", "Não foi possível carregar o membro.");
      setDetail(null);
    } finally {
      setLoadingDetail(false);
    }
  }

  async function handleSelectMember(member: IMember) {
    setLoadingMemberId(member._id);
    await loadDetail(member._id);
    setLoadingMemberId(null);
  }

  function handleBack() {
    setDetail(null);
  }

  async function handleConfirm() {
    if (!confirm || !detail) return;
    setRegistering(confirm.index);
    try {
      await ChargeServices.registerCashPayment(detail._id, confirm.index);
      ToastMessage.success(
        "Pagamento registrado",
        `${confirm.label} de ${detail.firstName} marcado como pago.`,
      );
      setConfirm(null);
      await Promise.all([loadDetail(detail._id), reloadMemberData()]);
    } catch {
      ToastMessage.error("Erro ao registrar pagamento. Tente novamente.");
    } finally {
      setRegistering(null);
    }
  }

  const months = detail
    ? MONTHS.map((m, index) => {
        const data = detail.contributions?.months?.[m.key as never] as
          | { paid: boolean; value: number; paidAt: string }
          | undefined;
        return { month: m, index, data };
      })
        // Mostra apenas os meses que o endpoint fornece para o membro.
        .filter(({ data }) => data !== undefined)
        .map(({ month, index, data }) => {
          const paid = !!data!.paid;
          return {
            index,
            label: month.label,
            paid,
            description: paid
              ? `Pago em ${formatDateFromTimestamp(
                  new Date(data!.paidAt).getTime(),
                )}`
              : `A pagar · ${formatMoneyBRL(detail.paymentInfo?.amount ?? 0)}`,
          };
        })
    : [];

  return (
    <ModalBase
      onClose={detail ? handleBack : onClose}
      visible={visible}
      title={
        detail
          ? `${detail.firstName} ${detail.lastName}`
          : "Registrar pagamento"
      }
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {!detail ? (
            <MemberListWithSkeleton
              members={members}
              loading={loadingMembers}
              onAction={handleSelectMember}
              iconAction={<HandCoins size={20} color={COLORS.primary} />}
              variant="edit"
              loadingMemberId={loadingMemberId ?? undefined}
            />
          ) : loadingDetail ? (
            <ActivityIndicator
              color={COLORS.primary}
              style={{ marginTop: 32 }}
            />
          ) : (
            <FlatList
              data={months}
              keyExtractor={(item) => String(item.index)}
              style={styles.list}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <View style={styles.memberHeader}>
                  <Avatar photo={detail.profileImage} size={44} />
                  <View>
                    <Text style={styles.memberName}>
                      {detail.firstName} {detail.lastName}
                    </Text>
                    <Text style={styles.memberEmail} numberOfLines={1}>
                      {detail.email}
                    </Text>
                  </View>
                </View>
              }
              renderItem={({ item }) => (
                <View style={styles.monthCard}>
                  <View style={styles.monthInfo}>
                    <Text style={styles.monthName}>{item.label}</Text>
                    <Text style={styles.monthDescription} numberOfLines={1}>
                      {item.description}
                    </Text>
                  </View>

                  {item.paid ? (
                    <View style={[styles.badge, styles.paid]}>
                      <Text style={[styles.badgeText, styles.paidText]}>
                        Pago
                      </Text>
                    </View>
                  ) : registering === item.index ? (
                    <ActivityIndicator size="small" color={COLORS.primary} />
                  ) : (
                    <Button
                      title="Registrar"
                      variant="secondary"
                      styleCustom={styles.registerButton}
                      onPress={() =>
                        setConfirm({ index: item.index, label: item.label })
                      }
                    />
                  )}
                </View>
              )}
            />
          )}
        </View>
      </View>

      {confirm && detail && (
        <Dialog
          visible={!!confirm}
          title="Pagamento em dinheiro"
          description={`Confirmar recebimento de ${formatMoneyBRL(
            detail.paymentInfo?.amount ?? 0,
          )} em dinheiro de ${detail.firstName}, referente a ${confirm.label}?`}
          onClose={() => registering === null && setConfirm(null)}
          actions={[
            {
              label: "cancelar",
              variant: "secondary",
              onPress: () => registering === null && setConfirm(null),
            },
            {
              label: "confirmar",
              variant: "primary",
              onPress: handleConfirm,
            },
          ]}
        />
      )}
    </ModalBase>
  );
}
