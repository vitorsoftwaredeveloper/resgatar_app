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
import { IMember, IMemberState } from "@/types/Member";

interface AuthContextData {
  isLoggedIn: boolean;
  loading: boolean;
  member: IMember | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  updateMember: (member: IMemberState) => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<IMember | null>(null);
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
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    setLoading(true);

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
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);

    try {
      await signOut();
    } finally {
      await removeMember();
      setMember(null);
      setLoading(false);
    }
  }

  async function updateMember(member: IMemberState) {
    setLoading(true);

    try {
      const formatMember: IMember = {
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        phoneNumber: member.phoneNumber,
        paymentInfo: {
          datePayment: parseInt(member.datePayment),
          amount: parseFloat(member.amount),
        },
        identification: {
          type: member.type as "CPF" | "CNPJ",
          numberType: member.numberType,
        },
        bio: member.bio,
        dateOfBirth: member.dateOfBirth,
        address: {
          street: member.street,
          number: member.number,
          city: member.city,
          state: member.state,
          zip: member.zip,
          complement: member.complement,
        },
      };

      await MemberServices.editMember(formatMember);

      setMember(formatMember);
      await saveMember(formatMember);
    } catch (error) {
      setMember(null);
      throw error;
    } finally {
      setLoading(false);
    }
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
        loading,
        member,
        login,
        logout,
        changePassword,
        updateMember,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
