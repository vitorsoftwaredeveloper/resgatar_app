import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { ItemActionList } from "@/components/ItemActionList";
import { ModalBase } from "@/components/ModalBase";
import { useAppTheme } from "@/context/ThemeContext";
import { useImagePicker } from "@/hooks/useImagePicker";
import { Camera, ImageIcon, Trash2 } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useStyles } from "./styles";

interface ModalPhotoPickerProps {
  visible: boolean;
  onClose: () => void;
  /** Foto atual (base64 ou data URI). Usada como preview inicial. */
  currentPhoto?: string | null;
  /** Recebe o base64 escolhido, ou "" quando o usuário remove a foto. */
  onConfirm: (photo: string) => void | Promise<void>;
  title?: string;
  confirmLabel?: string;
}

export const ModalPhotoPicker = ({
  visible,
  onClose,
  currentPhoto,
  onConfirm,
  title = "Foto de perfil",
  confirmLabel = "Salvar",
}: ModalPhotoPickerProps) => {
  const { colors } = useAppTheme();
  const styles = useStyles();
  const { loading: picking, pickFromLibrary, takePhoto } = useImagePicker();

  // null = sem alteração; "" = remover; string = nova foto
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const previewPhoto =
    selectedPhoto !== null ? selectedPhoto : currentPhoto ?? "";
  const hasChanges = selectedPhoto !== null;
  const busy = picking || saving;

  const handlePick = async (source: "library" | "camera") => {
    if (busy) return;
    const base64 =
      source === "library" ? await pickFromLibrary() : await takePhoto();
    if (base64) setSelectedPhoto(base64);
  };

  const handleConfirm = async () => {
    if (selectedPhoto === null) return;
    setSaving(true);
    try {
      await onConfirm(selectedPhoto);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalBase visible={visible} onClose={onClose} title={title}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.preview}>
            <View style={styles.avatarRing}>
              <Avatar photo={previewPhoto} size={132} />
            </View>
            <Text style={styles.previewHint}>
              {previewPhoto ? "Sua foto de perfil" : "Você ainda não tem foto"}
            </Text>
          </View>

          <View style={styles.card}>
            <ItemActionList
              title="Tirar foto"
              description="Use a câmera do dispositivo"
              onPress={() => handlePick("camera")}
              icon={<Camera size={20} color={colors.primary} />}
            />
            <ItemActionList
              title="Escolher da galeria"
              description="Selecione uma foto existente"
              onPress={() => handlePick("library")}
              icon={<ImageIcon size={20} color={colors.primary} />}
              isLast
            />
          </View>

          {previewPhoto ? (
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => !busy && setSelectedPhoto("")}
              activeOpacity={0.7}
            >
              <Trash2 size={18} color={colors.error} />
              <Text style={styles.removeText}>Remover foto atual</Text>
            </TouchableOpacity>
          ) : null}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={confirmLabel}
            onPress={handleConfirm}
            loading={saving}
            disabled={!hasChanges || busy}
          />
        </View>
      </View>
    </ModalBase>
  );
};
