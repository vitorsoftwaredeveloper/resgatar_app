import { MemberServices } from "@/services/MemberService";
import {
  clearOnboardingSeen,
  getOnboardingSeen,
  getStoredMember,
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
  register: (payload: RegisterPayload) => Promise<void>;
  listMembers: () => Promise<void>;
  removeMember: (memberId: string) => Promise<void>;
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
  const isLoggedIn = !!member;

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
      } else {
        const memberData = await MemberServices.getMember();

        setMember(memberData);
        await saveMember(memberData);
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

  async function removeMember(memberId: string) {
    try {
      await MemberServices.removeMember(memberId);
    } catch (error) {
      throw error;
    }
  }
  async function reloadMemberData() {
    const memberData = await MemberServices.getMember();
    setMember(memberData);
    await saveMember(memberData);
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
        dateOfBirth: new Date().getTime(),
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
        register,
        listMembers,
        removeMember,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
