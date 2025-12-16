import React, { createContext, useEffect, useState } from "react";
import { signIn, signOut, getCurrentUser } from "aws-amplify/auth";
import { MemberServices } from "@/services/MemberService";

interface AuthContextData {
  isLoggedIn: boolean;
  loading: boolean;
  member: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState({});

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      await getCurrentUser();
      setIsLoggedIn(true);
    } catch {
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signIn({
        username: email,
        password: password,
        options: {
          authFlowType: "USER_PASSWORD_AUTH",
        },
      });

      await MemberServices.getMember()
        .then((member) => {
          setIsLoggedIn(true);
          setMember(member);
        })
        .catch((error: any) => {
          throw error;
        });
    } catch (error: any) {
      setIsLoggedIn(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut();
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, loading, member, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
