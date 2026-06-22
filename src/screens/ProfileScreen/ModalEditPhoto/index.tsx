import { ModalPhotoPicker } from "@/components/ModalPhotoPicker";
import { ToastMessage } from "@/components/Toast";
import { AuthContext } from "@/context/AuthContext";
import React, { useContext } from "react";

interface IModalEditPhoto {
  visible: boolean;
  onClose: () => void;
}

export const ModalEditPhoto = ({ visible, onClose }: IModalEditPhoto) => {
  const { member, updateMemberPhoto } = useContext(AuthContext);

  const handleConfirm = async (profileImage: string) => {
    try {
      await updateMemberPhoto(profileImage);
      ToastMessage.success("Sucesso", "Foto atualizada com sucesso!");
      setTimeout(onClose, 1500);
    } catch {
      ToastMessage.error("Erro", "Não foi possível atualizar a foto.");
    }
  };

  return (
    <ModalPhotoPicker
      visible={visible}
      onClose={onClose}
      currentPhoto={member?.profileImage}
      onConfirm={handleConfirm}
    />
  );
};
