import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import apiClient from '../api/client';
import { saveToken, getToken, removeToken } from '../utils/storage';
import type { User, Role } from '../types';

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
}

type AuthAction =
  | { type: 'RESTORE_TOKEN'; token: string | null }
  | { type: 'LOGIN'; token: string; user: User }
  | { type: 'LOGOUT' };

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: Role) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return { ...state, token: action.token, isLoading: false };
    case 'LOGIN':
      return { token: action.token, user: action.user, isLoading: false };
    case 'LOGOUT':
      return { token: null, user: null, isLoading: false };
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    token: null,
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    (async () => {
      const token = await getToken();
      dispatch({ type: 'RESTORE_TOKEN', token });
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    await saveToken(data.token);
    dispatch({ type: 'LOGIN', token: data.token, user: data.user });
  }, []);

  const register = useCallback(
    async (email: string, password: string, role: Role) => {
      const { data } = await apiClient.post('/auth/register', {
        email,
        password,
        role,
      });
      await saveToken(data.token ?? '');
      dispatch({
        type: 'LOGIN',
        token: data.token ?? '',
        user: data.user,
      });
    },
    [],
  );

  const logout = useCallback(async () => {
    await removeToken();
    dispatch({ type: 'LOGOUT' });
  }, []);

  const value = useMemo(
    () => ({ ...state, login, register, logout }),
    [state, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
