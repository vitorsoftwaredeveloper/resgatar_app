import { MemberServices } from "@/services/MemberService";
import { StreakService } from "@/services/StreakService";
import {
  BadgeDefinition,
  cosmeticsUnlockedBetween,
  FrameEffect,
  resolveEffect,
  resolveFrameIndex,
  unlockedBadgeIds,
} from "@/services/BadgeService";
import { DonationServices } from "@/services/DonationService";
import { TRANSACTION_STATUS } from "@/types/Charge";
import { CosmeticUnlock } from "@/components/CosmeticUnlockedModal";
import {
  clearOnboardingSeen,
  getOnboardingSeen,
  getStoredMember,
  IStreakData,
  saveMember,
  setOnboardingSeen,
} from "@/storage/asyncStorage";
import { IMemberState, IMemberWithContribution } from "@/types/Member";
import { getCurrentUser, signIn, signOut } from "aws-amplify/auth";
import React, { createContext, useEffect, useState } from "react";

interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  type: "CPF" | "CNPJ";
  numberType: string;
  password: string;
  profileImage?: string;
  dateOfBirth?: number;
}

interface AuthContextData {
  isLoggedIn: boolean;
  member: IMemberWithContribution | null;
  loading: boolean;
  needsOnboarding: boolean;
  onboardingChecked: boolean;
  completeOnboarding: () => Promise<void>;
  restartOnboarding: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (memberId: string, newPassword: string) => Promise<void>;
  updateMember: (member: IMemberState) => Promise<void>;
  updateMemberPhoto: (profileImage: string) => Promise<void>;
  reloadMemberData: () => Promise<void>;
  // Streak/conquistas do usuário logado (fonte para moldura e modal).
  myStreak: IStreakData | null;
  // Índice em FRAME_TIERS da moldura EXIBIDA (escolhida ou maior desbloqueada).
  myTier: number;
  // Id da moldura escolhida pelo membro, ou null (usa a maior desbloqueada).
  selectedFrame: string | null;
  // Persiste a moldura escolhida (ou null para automático) e atualiza o estado.
  setFrame: (frameId: string | null) => Promise<void>;
  // Efeito a exibir no avatar (resolvido) e id escolhido pelo membro.
  myEffect: FrameEffect;
  selectedEffect: string | null;
  // Persiste o efeito escolhido (ou null para nenhum) e atualiza o estado.
  setEffect: (effectId: string | null) => Promise<void>;
  // Recalcula a partir do streak salvo. Chamar após uma leitura contar.
  refreshTier: () => Promise<void>;
  // Enfileira a celebração de conquistas novas e atualiza moldura/efeito.
  notifyUnlocks: (newBadges: BadgeDefinition[]) => Promise<void>;
  // Sincroniza as doações do ano (conta as aprovadas do membro) e celebra.
  syncDonationYear: (year: number) => Promise<void>;
  // Registra a conclusão do tutorial (coach) e celebra a conquista.
  completeTutorial: () => Promise<void>;
  // Conta um vídeo publicado e celebra conquistas novas.
  recordVideoPosted: () => Promise<void>;
  // Conquista recém-desbloqueada a celebrar (primeira da fila), e dispensa.
  badgeUnlock: BadgeDefinition | null;
  badgeRemaining: number;
  dismissBadge: () => void;
  // Moldura/efeito recém-desbloqueado a celebrar (primeiro da fila), e dispensa.
  cosmeticUnlock: CosmeticUnlock | null;
  cosmeticRemaining: number;
  dismissCosmetic: () => void;
  register: (payload: RegisterPayload) => Promise<void>;
  listMembers: () => Promise<void>;
  removeMember: (memberId: string) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [member, setMember] = useState<IMemberWithContribution | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [myTier, setMyTier] = useState(0);
  const [myStreak, setMyStreak] = useState<IStreakData | null>(null);
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);
  const [myEffect, setMyEffect] = useState<FrameEffect>("none");
  const [cosmeticQueue, setCosmeticQueue] = useState<CosmeticUnlock[]>([]);
  const [badgeQueue, setBadgeQueue] = useState<BadgeDefinition[]>([]);
  const isLoggedIn = !!member;

  // Mantém moldura, efeito e dados da modal sincronizados a partir de um streak.
  function applyStreak(streak: IStreakData | null) {
    // Enfileira modal de celebração quando uma nova moldura/efeito é
    // desbloqueada nesta sessão. Só em transições (prev existe) — nunca no
    // carregamento inicial.
    if (myStreak && streak) {
      const prevCount = unlockedBadgeIds(myStreak).length;
      const newCount = unlockedBadgeIds(streak).length;
      if (newCount > prevCount) {
        const { frames, effects } = cosmeticsUnlockedBetween(prevCount, newCount);
        const unlocks: CosmeticUnlock[] = [
          ...frames.map((f) => ({ kind: "frame" as const, id: f.id, name: f.name })),
          ...effects.map((e) => ({ kind: "effect" as const, id: e.id, name: e.name })),
        ];
        if (unlocks.length > 0) setCosmeticQueue((q) => [...q, ...unlocks]);
      }
    }

    setMyStreak(streak);
    setSelectedFrame(streak?.selectedFrame ?? null);
    setSelectedEffect(streak?.selectedEffect ?? null);
    setMyTier(streak ? resolveFrameIndex(streak, streak.selectedFrame) : 0);
    setMyEffect(streak ? resolveEffect(streak, streak.selectedEffect) : "none");
  }

  async function refreshTier() {
    if (!memberId) {
      applyStreak(null);
      return;
    }
    applyStreak(await StreakService.getStatus(memberId));
  }

  async function setFrame(frameId: string | null) {
    if (!memberId) return;
    applyStreak(await StreakService.setSelectedFrame(memberId, frameId));
  }

  async function setEffect(effectId: string | null) {
    if (!memberId) return;
    applyStreak(await StreakService.setSelectedEffect(memberId, effectId));
  }

  // Enfileira a modal de conquista e recarrega o streak (que, via applyStreak,
  // também detecta molduras/efeitos recém-abertos).
  async function notifyUnlocks(newBadges: BadgeDefinition[]) {
    if (newBadges.length > 0) setBadgeQueue((q) => [...q, ...newBadges]);
    await refreshTier();
  }

  async function completeTutorial() {
    if (!memberId) return;
    await notifyUnlocks(await StreakService.recordTutorialDone(memberId));
  }

  async function recordVideoPosted() {
    if (!memberId) return;
    await notifyUnlocks(await StreakService.recordVideoPosted(memberId));
  }

  async function syncDonationYear(year: number) {
    if (!memberId) return;
    try {
      const data = await DonationServices.list(year);
      const myCount = data.filter(
        (d) => d.memberId === memberId && d.status === TRANSACTION_STATUS.APPROVED,
      ).length;
      const newBadges = await StreakService.syncDonations(memberId, year, myCount);
      await notifyUnlocks(newBadges);
    } catch {
      // Silencioso: sincronização de conquistas não deve quebrar o fluxo.
    }
  }

  useEffect(() => {
    checkSession();
  }, []);

  const memberId = member?._id;

  useEffect(() => {
    let active = true;

    if (!memberId) {
      setOnboardingChecked(false);
      setNeedsOnboarding(false);
      return;
    }

    (async () => {
      const seen = await getOnboardingSeen(memberId);
      if (active) {
        setNeedsOnboarding(!seen);
        setOnboardingChecked(true);
      }
    })();

    return () => {
      active = false;
    };
  }, [memberId]);

  async function completeOnboarding() {
    if (memberId) {
      await setOnboardingSeen(memberId);
    }
    setNeedsOnboarding(false);
  }

  async function restartOnboarding() {
    if (memberId) {
      await clearOnboardingSeen(memberId);
    }
    setNeedsOnboarding(true);
  }

  async function checkSession() {
    try {
      //Verifica sessão Cognito (persistida pelo Amplify)
      await getCurrentUser();

      const storedMember = await getStoredMember();

      if (storedMember) {
        setMember(storedMember);
        await syncMemberData(storedMember);
      } else {
        const memberData = await MemberServices.getMember();

        setMember(memberData);
        await saveMember(memberData);
        await syncMemberData(memberData);
      }
    } catch {
      setMember(null);
    }
    setLoading(false);
  }

  async function login(email: string, password: string) {
    setLoading(true);
    try {
      try {
        await signOut();
      } catch {}

      const { isSignedIn, nextStep } = await signIn({
        username: email,
        password,
        options: {
          authFlowType: "USER_PASSWORD_AUTH",
        },
      });
      if (!isSignedIn) {
        throw new Error(`Login incompleto: ${nextStep.signInStep}`);
      }
      const memberData = await MemberServices.getMember();
      setMember(memberData);
      await saveMember(memberData);
      await syncMemberData(memberData);
    } catch (error) {
      setMember(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    try {
      await signOut();
    } finally {
      setMember(null);
      applyStreak(null);
      setLoading(false);
    }
  }

  async function updateMember(memberCurrent: IMemberState) {
    try {
      const formatMember = {
        _id: member?._id as string,
        firstName: memberCurrent.firstName.trim(),
        lastName: memberCurrent.lastName.trim(),
        email: memberCurrent.email.trim(),
        phoneNumber: memberCurrent.phoneNumber,
        paymentInfo: {
          datePayment: parseInt(memberCurrent.datePayment),
          amount: memberCurrent.amount
            .replace("R$", "")
            .replace(".", "")
            .trim(),
        },
        identification: {
          type: memberCurrent.type as "CPF" | "CNPJ",
          numberType: memberCurrent.numberType,
        },
        bio: memberCurrent.bio,
        dateOfBirth: Number(memberCurrent.dateOfBirth),
        address: {
          street: memberCurrent.street.trim(),
          number: memberCurrent.number.trim(),
          city: memberCurrent.city.trim(),
          state: memberCurrent.state.trim(),
          zip: memberCurrent.zip,
          complement: memberCurrent.complement.trim(),
        },
      };

      await MemberServices.editMember(formatMember);

      await reloadMemberData();
    } catch (error) {
      throw error;
    }
  }

  async function updateMemberPhoto(profileImage: string) {
    try {
      await MemberServices.updatePhoto(member?._id as string, profileImage);
      await reloadMemberData();
    } catch (error) {
      throw error;
    }
  }

  async function listMembers() {
    try {
      return await MemberServices.listMembers();
    } catch (error) {
      throw error;
    }
  }

  async function deleteAccount(password: string) {
    if (!member) throw new Error("Usuário não autenticado.");
    const email = member.email;
    const memberIdToRemove = member._id;

    try {
      await signOut();
    } catch {}

    const { isSignedIn } = await signIn({
      username: email,
      password,
      options: { authFlowType: "USER_PASSWORD_AUTH" },
    });
    if (!isSignedIn) throw new Error("Senha incorreta.");

    await MemberServices.removeMember(memberIdToRemove);
    await signOut();
    setMember(null);
  }

  async function removeMember(memberId: string) {
    try {
      await MemberServices.removeMember(memberId);
    } catch (error) {
      throw error;
    }
  }
  async function syncMemberData(memberData: IMemberWithContribution) {
    const paidMonths = Object.values(memberData.contributions.months).filter(
      (m) => m.paid,
    ).length;

    const { bio, profileImage, address } = memberData;
    const addressComplete = !!(
      address?.street &&
      address?.city &&
      address?.state &&
      address?.zip
    );
    const profileScore =
      (bio ? 1 : 0) + (profileImage ? 1 : 0) + (addressComplete ? 1 : 0);

    await Promise.all([
      StreakService.syncContributions(memberData._id, paidMonths),
      StreakService.syncProfile(memberData._id, profileScore),
    ]);

    applyStreak(await StreakService.getStatus(memberData._id));
  }

  async function reloadMemberData() {
    const memberData = await MemberServices.getMember();
    setMember(memberData);
    await saveMember(memberData);
    await syncMemberData(memberData);
  }

  async function changePassword(memberId: string, newPassword: string) {
    try {
      await MemberServices.updatePassword(memberId, newPassword);
    } catch (error) {
      throw error;
    }
  }

  async function register(payload: RegisterPayload) {
    try {
      await MemberServices.register({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phoneNumber: payload.phoneNumber,
        profileImage: payload.profileImage,
        identification: {
          type: payload.type,
          numberType: payload.numberType,
        },
        paymentInfo: { datePayment: 1, amount: "10,00" },
        dateOfBirth: payload.dateOfBirth ?? new Date().getTime(),
        password: payload.password,
      });
    } catch (error) {
      throw error;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        member,
        loading,
        needsOnboarding,
        onboardingChecked,
        completeOnboarding,
        restartOnboarding,
        login,
        logout,
        changePassword,
        updateMember,
        updateMemberPhoto,
        reloadMemberData,
        myStreak,
        myTier,
        selectedFrame,
        setFrame,
        myEffect,
        selectedEffect,
        setEffect,
        refreshTier,
        notifyUnlocks,
        syncDonationYear,
        completeTutorial,
        recordVideoPosted,
        badgeUnlock: badgeQueue[0] ?? null,
        badgeRemaining: Math.max(0, badgeQueue.length - 1),
        dismissBadge: () => setBadgeQueue((q) => q.slice(1)),
        cosmeticUnlock: cosmeticQueue[0] ?? null,
        cosmeticRemaining: Math.max(0, cosmeticQueue.length - 1),
        dismissCosmetic: () => setCosmeticQueue((q) => q.slice(1)),
        register,
        listMembers,
        removeMember,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
