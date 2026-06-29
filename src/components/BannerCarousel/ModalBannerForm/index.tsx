import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Dialog } from "@/components/Dialog";
import { Input } from "@/components/Input";
import { ModalBase } from "@/components/ModalBase";
import { ToastMessage } from "@/components/Toast";
import { BannerService } from "@/services/BannerService";
import {
  BANNER_SCREEN_OPTIONS,
  BannerActionType,
  BannerScreen,
  IBanner,
  IBannerInput,
  MAX_BANNER_SIZE_BYTES,
} from "@/types/Banner";
import { getApiErrorMessage } from "@/utils/apiError";
import * as ImagePicker from "expo-image-picker";
import { Camera, ExternalLink, ImageIcon, Trash2 } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useStyles } from "./styles";

interface Props {
  visible: boolean;
  banner?: IBanner | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ACTION_TYPE_OPTIONS: { label: string; value: BannerActionType }[] = [
  { label: "Nenhum", value: "none" },
  { label: "URL externa", value: "external" },
  { label: "Tela do app", value: "internal" },
];

const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ["images"],
  allowsEditing: true,
  aspect: [16, 9],
  quality: 0.6,
  base64: true,
};

export function ModalBannerForm({ visible, banner, onClose, onSuccess }: Props) {
  const styles = useStyles();
  const isEdit = Boolean(banner);

  const [imageData, setImageData] = useState<string | null>(banner?.banner ?? null);
  const [pickingImage, setPickingImage] = useState(false);
  const [title, setTitle] = useState(banner?.title ?? "");
  const [actionType, setActionType] = useState<BannerActionType>(
    banner?.action.type ?? "none",
  );
  const [actionValue, setActionValue] = useState(banner?.action.value ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const clearError = (field: string) =>
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });

  async function handlePickImage() {
    setPickingImage(true);
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        ToastMessage.error("Permissão negada", "Autorize o acesso à galeria para escolher uma imagem.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);
      if (result.canceled) return;

      const base64 = result.assets?.[0]?.base64;
      if (!base64) return;

      const dataUri = `data:image/jpeg;base64,${base64}`;

      // Valida tamanho antes de aceitar (limite do backend: 500 KB)
      if (dataUri.length > MAX_BANNER_SIZE_BYTES) {
        ToastMessage.error(
          "Imagem muito grande",
          "Escolha uma imagem menor ou reduza a qualidade. Limite: 500 KB.",
        );
        return;
      }

      setImageData(dataUri);
      clearError("image");
    } catch {
      ToastMessage.error("Erro", "Não foi possível selecionar a imagem.");
    } finally {
      setPickingImage(false);
    }
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!imageData) next.image = "Selecione uma imagem para o banner.";
    if (!title.trim()) next.title = "O título é obrigatório.";
    if (actionType === "external") {
      if (!actionValue.trim()) next.actionValue = "Informe a URL de destino.";
      else if (!/^https?:\/\/.+/.test(actionValue.trim()))
        next.actionValue = "URL inválida (deve começar com http:// ou https://).";
    }
    if (actionType === "internal" && !actionValue) {
      next.actionValue = "Selecione uma tela de destino.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    try {
      const input: IBannerInput = {
        banner: imageData!,
        title: title.trim(),
        action: {
          type: actionType,
          value: actionType === "none" ? "" : actionValue.trim(),
        },
      };
      if (isEdit && banner) {
        await BannerService.update(banner.id, input);
        ToastMessage.success("Salvo", "Banner atualizado com sucesso.");
      } else {
        await BannerService.create(input);
        ToastMessage.success("Publicado", "Banner adicionado ao carrossel.");
      }
      onSuccess();
    } catch (err) {
      ToastMessage.error("Erro", getApiErrorMessage(err, "Não foi possível salvar o banner."));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!banner) return;
    setDeleting(true);
    try {
      await BannerService.remove(banner.id);
      ToastMessage.success("Removido", "Banner excluído do carrossel.");
      onSuccess();
    } catch (err) {
      ToastMessage.error("Erro", getApiErrorMessage(err, "Não foi possível remover o banner."));
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  return (
    <ModalBase
      visible={visible}
      title={isEdit ? "Editar banner" : "Novo banner"}
      onClose={onClose}
    >
      <KeyboardAvoidingView behavior="padding">
        <ScrollView
          style={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Card title="Imagem" description="Proporção recomendada: 16:9. Tamanho máximo: 500 KB.">
            <Pressable
              style={styles.previewWrapper}
              onPress={handlePickImage}
              disabled={pickingImage}
              accessibilityLabel="Selecionar imagem da galeria"
            >
              {pickingImage ? (
                <View style={styles.previewPlaceholder}>
                  <ActivityIndicator color="#8C7A6B" />
                </View>
              ) : imageData ? (
                <>
                  <Image
                    source={{ uri: imageData }}
                    style={styles.previewImage}
                    resizeMode="cover"
                  />
                  <View style={styles.previewEditBadge}>
                    <Camera size={14} color="#FFFFFF" />
                    <Text style={styles.previewEditText}>Trocar</Text>
                  </View>
                </>
              ) : (
                <View style={styles.previewPlaceholder}>
                  <ImageIcon size={28} color="#8C7A6B" />
                  <Text style={styles.previewPlaceholderText}>
                    Toque para escolher uma imagem
                  </Text>
                </View>
              )}
            </Pressable>

            {errors.image && (
              <Text style={styles.errorText}>{errors.image}</Text>
            )}
          </Card>

          <Card title="Configurações" style={{ marginTop: 0 }}>
            <Input
              label="Título *"
              placeholder="Ex: Campanha do Dízimo"
              value={title}
              onChangeText={(t) => { setTitle(t); clearError("title"); }}
              maxLength={80}
              error={errors.title}
            />

            <View>
              <Text style={styles.fieldLabel}>Ao tocar no banner</Text>
              <View style={styles.segment}>
                {ACTION_TYPE_OPTIONS.map((opt) => (
                  <Pressable
                    key={opt.value}
                    style={[
                      styles.segmentItem,
                      actionType === opt.value && styles.segmentItemActive,
                    ]}
                    onPress={() => {
                      setActionType(opt.value);
                      setActionValue("");
                      clearError("actionValue");
                    }}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        actionType === opt.value && styles.segmentTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {actionType === "external" && (
              <Input
                label="URL de destino"
                placeholder="https://..."
                value={actionValue}
                onChangeText={(t) => { setActionValue(t); clearError("actionValue"); }}
                autoCapitalize="none"
                keyboardType="url"
                leftIcon={<ExternalLink size={16} color="#8C7A6B" />}
                error={errors.actionValue}
              />
            )}

            {actionType === "internal" && (
              <View>
                <Text style={styles.fieldLabel}>Tela de destino</Text>
                <View style={styles.chipsRow}>
                  {BANNER_SCREEN_OPTIONS.map((opt) => (
                    <Pressable
                      key={opt.value}
                      style={[
                        styles.chip,
                        actionValue === opt.value && styles.chipActive,
                      ]}
                      onPress={() => {
                        setActionValue(opt.value);
                        clearError("actionValue");
                      }}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          actionValue === opt.value && styles.chipTextActive,
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                {errors.actionValue && (
                  <Text style={styles.errorText}>{errors.actionValue}</Text>
                )}
              </View>
            )}
          </Card>
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.footerRow}>
            {isEdit && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => setConfirmDelete(true)}
                disabled={deleting}
              >
                <Trash2 size={16} color="#E53935" />
                <Text style={styles.deleteText}>Remover</Text>
              </TouchableOpacity>
            )}
            <View style={styles.saveFlex}>
              <Button
                title={isEdit ? "Salvar" : "Publicar"}
                onPress={handleSave}
                loading={saving}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      {confirmDelete && (
        <Dialog
          visible={confirmDelete}
          title="Remover banner?"
          description="Esta ação não pode ser desfeita. O banner será excluído permanentemente do carrossel."
          onClose={() => (deleting ? null : setConfirmDelete(false))}
          actions={[
            {
              label: "cancelar",
              onPress: () => setConfirmDelete(false),
              variant: "secondary",
            },
            {
              label: deleting ? "removendo..." : "remover",
              onPress: handleDelete,
              variant: "primary",
            },
          ]}
        />
      )}
    </ModalBase>
  );
}
