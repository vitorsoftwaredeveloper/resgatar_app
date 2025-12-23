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
import { IMember, IMemberState, IMemberWithContribution } from "@/types/Member";

interface AuthContextData {
  isLoggedIn: boolean;
  member: IMemberWithContribution | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  updateMember: (member: IMemberState) => Promise<void>;
  reloadMemberData: () => Promise<void>;
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
