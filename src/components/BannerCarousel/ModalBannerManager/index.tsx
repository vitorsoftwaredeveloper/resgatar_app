import { ModalBase } from "@/components/ModalBase";
import { ToastMessage } from "@/components/Toast";
import { useAppTheme } from "@/context/ThemeContext";
import { BannerService } from "@/services/BannerService";
import { IBanner } from "@/types/Banner";
import { GripVertical, MoveVertical, Pencil, Plus } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import ReorderableList, {
  ReorderableListReorderEvent,
  reorderItems,
  useIsActive,
  useReorderableDrag,
} from "react-native-reorderable-list";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ModalBannerForm } from "../ModalBannerForm";
import { RAIL_WIDTH, useStyles } from "./styles";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface RowProps {
  item: IBanner;
  index: number;
  editing: boolean;
  active?: boolean;
  drag?: () => void;
  onEdit?: () => void;
}

function BannerRow({ item, index, editing, active, drag, onEdit }: RowProps) {
  const styles = useStyles();
  const { colors } = useAppTheme();

  const actionLabel =
    item.action.type === "none"
      ? "Sem ação ao tocar"
      : item.action.type === "external"
        ? "Abre URL externa"
        : `Navega para ${item.action.value}`;

  return (
    <Pressable
      style={styles.row}
      onPress={editing ? onEdit : undefined}
      onLongPress={editing ? drag : undefined}
      delayLongPress={180}
      disabled={!editing}
    >
      <View style={styles.rail}>
        <View style={styles.threadDashed} />
        <View style={styles.nodeEdit}>
          <Text style={styles.nodeNumber}>{index + 1}</Text>
        </View>
      </View>

      <View style={[styles.card, active && styles.cardActive]}>
        <Image source={{ uri: item.banner }} style={styles.thumb} resizeMode="cover" />

        <View style={styles.cardBody}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.cardMeta} numberOfLines={1}>
            {actionLabel}
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
  return <BannerRow {...props} editing active={active} drag={drag} />;
}

export function ModalBannerManager({ visible, onClose, onSuccess }: Props) {
  const styles = useStyles();
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  const [banners, setBanners] = useState<IBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [formTarget, setFormTarget] = useState<IBanner | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setBanners(await BannerService.list());
    } catch {
      setBanners([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (visible) load();
  }, [visible, load]);

  const openCreate = () => {
    setFormTarget(null);
    setFormVisible(true);
  };

  const openEdit = (banner: IBanner) => {
    setFormTarget(banner);
    setFormVisible(true);
  };

  const handleFormSuccess = () => {
    setFormVisible(false);
    load();
    onSuccess();
  };

  const handleReorder = useCallback(
    async ({ from, to }: ReorderableListReorderEvent) => {
      const next = reorderItems(banners, from, to);
      setBanners(next);
      setSaving(true);
      try {
        await BannerService.saveOrder(next);
        ToastMessage.success("Ordem salva", "A nova sequência foi publicada.");
      } catch {
        ToastMessage.error("Erro", "Não foi possível salvar a nova ordem.");
        load();
      } finally {
        setSaving(false);
      }
    },
    [banners, load],
  );

  const subtitle = loading
    ? "Carregando..."
    : `${banners.length} ${banners.length === 1 ? "banner" : "banners"}`;

  return (
    <ModalBase visible={visible} title="Campanhas" onClose={onClose}>
      <View style={styles.container}>
          {/* Intro: eyebrow + contagem + botão Editar/Concluir — igual ao NoticeBoardScreen */}
          {!loading && banners.length > 0 && (
            <View style={styles.intro}>
              <View style={styles.introText}>
                <Text style={styles.eyebrow}>Carrossel da home</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
              </View>
              <Pressable
                style={[styles.editToggle, editing && styles.editToggleActive]}
                onPress={() => setEditing((e) => !e)}
                accessibilityLabel={editing ? "Concluir edição" : "Editar ordem dos banners"}
              >
                <Pencil size={15} color={editing ? colors.white : colors.text} />
                <Text style={[styles.editToggleText, editing && styles.editToggleTextActive]}>
                  {editing ? "Concluir" : "Editar"}
                </Text>
              </Pressable>
            </View>
          )}

          {editing && (
            <View style={styles.hint}>
              <MoveVertical size={14} color={colors.textMuted} />
              <Text style={styles.hintText}>
                Toque em um banner para editar · arraste pela alça para reordenar.
              </Text>
            </View>
          )}

          {loading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : banners.length === 0 ? (
            <View style={styles.centered}>
              <Text style={styles.emptyTitle}>Nenhum banner</Text>
              <Text style={styles.emptyText}>
                Toque em + para publicar o primeiro banner no carrossel da tela inicial.
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
              data={banners}
              keyExtractor={(b) => b.id}
              onReorder={handleReorder}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <DraggableRow item={item} index={index} onEdit={() => openEdit(item)} />
              )}
            />
            </>
          ) : (
            <FlatList
              data={banners}
              keyExtractor={(b) => b.id}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <BannerRow item={item} index={index} editing={false} />
              )}
            />
          )}

          {!editing && (
            <Pressable
              style={[styles.fab, { bottom: insets.bottom + 20 }]}
              onPress={openCreate}
              accessibilityLabel="Adicionar banner"
            >
              <Plus size={28} color={colors.white} strokeWidth={2.5} />
            </Pressable>
          )}
        </View>

      {formVisible && (
        <ModalBannerForm
          key={formTarget?.id ?? "new"}
          visible={formVisible}
          banner={formTarget}
          onClose={() => setFormVisible(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </ModalBase>
  );
}
