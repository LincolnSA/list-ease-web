import { createContext, useEffect, useState, ReactNode} from "react";
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import { useRouter } from 'next/navigation'
import { api } from "@/services/api";

interface UserDto{
  name: string;
  email: string;
}

interface SignInProps {
  email: string;
  password: string;
}

interface AuthProviderProps{
  children : ReactNode;
}

interface AuthContextDto {
  user: UserDto | null;
  handleSignIn: (data: SignInProps) => Promise<void>
  handleLogout: () => Promise<void>
}

export const AuthContext = createContext({} as AuthContextDto);

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<UserDto | null>(null);
  const COOKIE_NAME = process.env.NEXT_PUBLIC_COOKIE_NAME as string;

  useEffect(() => {
    const cookies = parseCookies();
    const token = cookies[COOKIE_NAME];

    if (token) {      

      handleGetUser();

      return;
    }

    router.push('/');
  }, []);

  async function handleGetUser() {
    try {
      const response = await  api.get("/users");

      setUser(response.data.data);
    } catch (error) {

      await handleLogout();
    }
  }

  async function handleSignIn(input: SignInProps) {
    const { email, password } = input;
    const response = await api.post("/login",{
      email,
      password
    });

    const { token, user } = response.data.data;
 
    setCookie(undefined, COOKIE_NAME, token, {
      maxAge: 60 * 60 * 1 * 24, // 24 hours
    });

    api.defaults.headers['Authorization'] = `Bearer ${token}`;

    setUser(user);

    router.push('/dashboard');
  };

  async function handleLogout(){
    destroyCookie(undefined, COOKIE_NAME);

    router.push('/');
  }

  return (
    <AuthContext.Provider value={{ user, handleSignIn, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};