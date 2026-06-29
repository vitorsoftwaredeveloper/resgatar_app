import { ModalBase } from "@/components/ModalBase";
import { ToastMessage } from "@/components/Toast";
import { AuthContext } from "@/context/AuthContext";
import { useAppTheme, ThemeColors } from "@/context/ThemeContext";
import { CommitmentService } from "@/services/CommitmentService";
import { ICommitment } from "@/types/Commitment";
import { commitmentScheduleLabel, isCommitmentToday } from "@/utils/commitment";
import { GripVertical, MoveVertical, Pencil, Plus } from "lucide-react-native";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ReorderableList, {
  ReorderableListReorderEvent,
  reorderItems,
  useIsActive,
  useReorderableDrag,
} from "react-native-reorderable-list";
import { ModalCommitmentForm } from "./ModalCommitmentForm";
import { useStyles } from "./styles";

interface Props {
  visible: boolean;
  onClose: (finalItems: ICommitment[]) => void;
}

type Styles = ReturnType<typeof useStyles>;

interface RowProps {
  item: ICommitment;
  index: number;
  editing: boolean;
  active?: boolean;
  drag?: () => void;
  onEdit?: () => void;
  styles: Styles;
  colors: ThemeColors;
}

function CommitmentRow({ item, index, editing, active, drag, onEdit, styles, colors }: RowProps) {
  const today = isCommitmentToday(item);
  return (
    <Pressable
      style={styles.row}
      onPress={editing ? onEdit : undefined}
      onLongPress={editing ? drag : undefined}
      delayLongPress={180}
      disabled={!editing}
    >
      <View style={styles.rail}>
        <View style={editing ? styles.threadDashed : styles.threadSolid} />
        {editing ? (
          <View style={[styles.nodeEdit, today && styles.nodeEditToday]}>
            <Text style={styles.nodeNumber}>{index + 1}</Text>
          </View>
        ) : (
          <View style={today ? styles.nodeToday : styles.node} />
        )}
      </View>

      <View
        style={[
          styles.card,
          editing && styles.cardEditing,
          today && styles.cardToday,
          active && styles.cardActive,
        ]}
      >
        <View style={styles.cardTopRow}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          {today && (
            <View style={styles.todayTag}>
              <Text style={styles.todayTagText}>HOJE</Text>
            </View>
          )}
          <View style={styles.timePill}>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
        </View>
        <View style={styles.cardMetaRow}>
          <Text style={styles.cardMeta} numberOfLines={1}>
            {commitmentScheduleLabel(item)} · {item.location}
          </Text>
        </View>

        {editing && (
          <Pressable
            style={styles.grip}
            onLongPress={drag}
            delayLongPress={120}
            accessibilityLabel={`Arrastar ${item.title} para reordenar`}
          >
            <GripVertical size={20} color={colors.textMuted} />
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

function DraggableRow(props: Omit<RowProps, "editing" | "active" | "drag">) {
  const drag = useReorderableDrag();
  const active = useIsActive();
  return <CommitmentRow {...props} editing active={active} drag={drag} />;
}

export function NoticeBoardModal({ visible, onClose }: Props) {
  const handleClose = () => onClose(itemsRef.current);
  const styles = useStyles();
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { member } = useContext(AuthContext);
  const isAdmin = member?.role === "admin";

  const [items, setItems] = useState<ICommitment[]>([]);
  const itemsRef = useRef<ICommitment[]>([]);
  useEffect(() => { itemsRef.current = items; }, [items]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [formTarget, setFormTarget] = useState<ICommitment | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await CommitmentService.list());
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      setEditing(false);
      load();
    }
  }, [visible, load]);

  const handleReorder = useCallback(
    async ({ from, to }: ReorderableListReorderEvent) => {
      const prev = itemsRef.current;
      const next = reorderItems(prev, from, to);
      setItems(next);
      setSaving(true);
      try {
        await CommitmentService.saveOrder(next);
        ToastMessage.success("Ordem salva", "A nova sequência foi publicada.");
      } catch {
        setItems(prev);
        ToastMessage.error("Erro", "Não foi possível salvar a nova ordem.");
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  const subtitle = loading
    ? "Carregando..."
    : `${items.length} ${items.length === 1 ? "compromisso" : "compromissos"}`;

  return (
    <ModalBase visible={visible} title="Quadro de avisos" onClose={handleClose}>
      <View style={styles.modalContainer}>

          {/* Intro: mesmo padrão do ModalBannerManager */}
          {!loading && (items.length > 0 || isAdmin) && (
            <View style={styles.intro}>
              <View style={styles.introText}>
                <Text style={styles.eyebrow}>Quadro de avisos</Text>
                <Text style={styles.title}>Compromissos da comunidade</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
              </View>

              {isAdmin && items.length > 0 && (
                <Pressable
                  style={[styles.editToggle, editing && styles.editToggleActive]}
                  onPress={() => setEditing((e) => !e)}
                  accessibilityLabel={editing ? "Concluir edição" : "Editar compromissos"}
                >
                  <Pencil size={15} color={editing ? colors.white : colors.text} />
                  <Text style={[styles.editToggleText, editing && styles.editToggleTextActive]}>
                    {editing ? "Concluir" : "Editar"}
                  </Text>
                </Pressable>
              )}
            </View>
          )}

          {editing && (
            <View style={styles.hint}>
              <MoveVertical size={14} color={colors.textMuted} />
              <Text style={styles.hintText}>
                Toque em um compromisso para editar · arraste pela alça para reordenar.
              </Text>
            </View>
          )}

          {loading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : items.length === 0 ? (
            <View style={styles.centered}>
              <Text style={styles.emptyTitle}>Mural vazio</Text>
              <Text style={styles.emptyText}>
                {isAdmin
                  ? "Toque em + para publicar o primeiro compromisso da comunidade."
                  : "Nenhum compromisso publicado ainda."}
              </Text>
            </View>
          ) : editing ? (
            <>
              {saving && (
                <View style={styles.savingBanner}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text style={styles.savingText}>Salvando ordem…</Text>
                </View>
              )}
            <ReorderableList
              data={items}
              onReorder={handleReorder}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <DraggableRow
                  item={item}
                  index={index}
                  onEdit={() => {
                    setFormTarget(item);
                    setFormVisible(true);
                  }}
                  styles={styles}
                  colors={colors}
                />
              )}
            />
            </>
          ) : (
            <FlatList
              data={items}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <CommitmentRow
                  item={item}
                  index={index}
                  editing={false}
                  styles={styles}
                  colors={colors}
                />
              )}
            />
          )}

          {isAdmin && !editing && (
            <Pressable
              style={[styles.fab, { bottom: insets.bottom + 20 }]}
              onPress={() => {
                setFormTarget(null);
                setFormVisible(true);
              }}
              accessibilityLabel="Publicar compromisso"
            >
              <Plus size={28} color={colors.white} strokeWidth={2.5} />
            </Pressable>
          )}
      </View>

      {formVisible && (
        <ModalCommitmentForm
          key={formTarget?.id ?? "new"}
          visible={formVisible}
          commitment={formTarget}
          onClose={() => setFormVisible(false)}
          onSuccess={() => {
            setFormVisible(false);
            load();
          }}
        />
      )}
    </ModalBase>
  );
}
