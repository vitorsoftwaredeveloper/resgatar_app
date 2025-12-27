import React, { createContext, useEffect, useState } from "react";
import {
  signIn,
  signOut,
  getCurrentUser,
  updatePassword,
} from "aws-amplify/auth";
import { MemberServices } from "@/services/MemberService";
import {
  saveMember,
  getStoredMember,
  removeMember,
} from "@/storage/asyncStorage";
import { IMemberState, IMemberWithContribution } from "@/types/Member";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

interface AuthContextData {
  isLoggedIn: boolean;
  member: IMemberWithContribution | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  updateMember: (member: IMemberState) => Promise<void>;
  reloadMemberData: () => Promise<void>;
  createMember: (member: IMemberState & { password: string }) => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [member, setMember] = useState<IMemberWithContribution | null>(null);
  const isLoggedIn = !!member;

  useEffect(() => {
    checkSession();
  }, []);

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
      await removeMember();
    }
  }

  async function login(email: string, password: string) {
    try {
      await signIn({
        username: email,
        password,
        options: {
          authFlowType: "USER_PASSWORD_AUTH",
        },
      });

      const memberData = await MemberServices.getMember();

      setMember(memberData);
      await saveMember(memberData);
    } catch (error) {
      setMember(null);
      throw error;
    } finally {
    }
  }

  async function logout() {
    try {
      await signOut();
    } finally {
      await removeMember();
      setMember(null);
    }
  }

  async function updateMember(memberCurrent: IMemberState) {
    try {
      const formatMember = {
        firstName: memberCurrent.firstName.trim(),
        lastName: memberCurrent.lastName.trim(),
        email: memberCurrent.email.trim(),
        phoneNumber: memberCurrent.phoneNumber,
        paymentInfo: {
          datePayment: parseInt(memberCurrent.datePayment),
          amount: memberCurrent.amount
            .replace("R$", "")
            .replace(/\./g, "")
            .replace(",", "."),
        },
        identification: {
          type: memberCurrent.type as "CPF" | "CNPJ",
          numberType: memberCurrent.numberType,
        },
        bio: memberCurrent.bio,
        dateOfBirth: memberCurrent.dateOfBirth,
        address: {
          street: memberCurrent.street.trim(),
          number: memberCurrent.number.trim(),
          city: memberCurrent.city.trim(),
          state: memberCurrent.state.trim(),
          zip: memberCurrent.zip,
          complement: memberCurrent.complement.trim(),
        },
        contributions: member?.contributions as any,
      };

      await MemberServices.editMember(formatMember);

      setMember(formatMember);
      await saveMember(formatMember);
    } catch (error) {
      setMember(null);
      throw error;
    } finally {
    }
  }

  async function createMember(newMember: IMemberState & { password: string }) {
    try {
      const formatMember = {
        firstName: newMember.firstName.trim(),
        lastName: newMember.lastName.trim(),
        email: newMember.email.trim(),
        phoneNumber: newMember.phoneNumber,
        paymentInfo: {
          datePayment: parseInt(newMember.datePayment),
          amount: newMember.amount
            .replace("R$", "")
            .replace(/\./g, "")
            .replace(",", ".")
            .trim(),
        },
        identification: {
          type: newMember.type as "CPF" | "CNPJ",
          numberType: newMember.numberType,
        },
        bio: newMember.bio,
        dateOfBirth: newMember.dateOfBirth,
        address: {
          street: newMember.street.trim(),
          number: newMember.number.trim(),
          city: newMember.city.trim(),
          state: newMember.state.trim(),
          zip: newMember.zip,
          complement: newMember.complement.trim(),
        },
        password: newMember.password,
        tokenPushNotification: "teste",
      };

      await MemberServices.createMember(formatMember);
    } catch (error) {
      throw error;
    }
  }

  async function reloadMemberData() {
    const memberData = await MemberServices.getMember();
    setMember(memberData);
    await saveMember(memberData);
  }

  async function changePassword(oldPassword: string, newPassword: string) {
    try {
      await updatePassword({
        oldPassword,
        newPassword,
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
        login,
        logout,
        changePassword,
        updateMember,
        reloadMemberData,
        createMember,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
