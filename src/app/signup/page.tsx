"use client"

import { useContext, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaretLeft, Eye, EyeSlash } from "@phosphor-icons/react";
import { toast } from "react-toastify";
import { api } from "@/services/api";
import { AuthContext } from "@/contexts/AuthContext";

const schema = z.object({
  name: z
    .string()
    .nonempty({ message: "Campo obrigatório" }),
  email: z
    .string()
    .nonempty({ message: "Campo obrigatório" })
    .email({  message: "Deve ser um e-mail válido"}),
  password: z
    .string()
    .nonempty({ message: "Campo obrigatório" })
    .min(3, { message: "A senha deve ter pelo menos 3 caracteres" }),
}).required();

type schemaType = z.infer<typeof schema>;

export default function SignUp(){
  const { handleSignIn } = useContext(AuthContext);
  const [ loading, setLoading ] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { register, handleSubmit } = useForm<schemaType>({ resolver: zodResolver(schema) });

 async function handleOnSubmit(data:schemaType): Promise<void>{
    try {
      setLoading(true);

      await api.post("/users", data);

      await handleSignIn({
        email: data.email,
        password: data.password
      });

      setLoading(false);
    } catch (error: any) {
      setLoading(false);

      const message = error?.response?.data?.message || "Error internal server";

      toast.warning(message);
    }
  }

  return(
    <>
      <div className="h-screen bg-zinc-950 flex flex-col">
        <div className="bg-[url('/backgorund.png')] h-44"></div>

        <Link 
          href="/" 
          className="flex items-center gap-2 px-3 py-2 bg-purple-500 rounded-md text-gray-50 fixed top-5 left-5"
          title="Voltar"
        >
          <CaretLeft size={21} />
        </Link>

        <main className="flex-1 flex flex-col p-6 mt-[-140px] mx-auto w-full max-w-[720px] overflow-hidden">
          <h1 className="text-gray-50 text-2xl text-center font-bold mb-8">Crie sua conta</h1>

          <form  
            className="flex flex-col gap-3"
            onSubmit={handleSubmit(handleOnSubmit)}
          >
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-300 font-normal">Nome</label>
              <input 
                type="text" 
                className="p-3 bg-gray-900 rounded-md text-gray-50 outline-purple-500"
                {...register("name")}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-300 font-normal">E-mail</label>
              <input 
                type="email" 
                className="p-3 bg-gray-900 rounded-md text-gray-50 outline-purple-500"
                {...register("email")}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-300 font-normal">Senha</label>

              <div className="flex rounded-md outline-purple-500 bg-gray-900 focus-within:outline">
                <input 
                  type={showPassword ? "text" : "password"}
                  className="flex-1 p-3 bg-gray-900 rounded-md text-gray-50 outline-none"
                  {...register("password")}
                />

                <button
                  type="button"
                  className="text-gray-50 p-3" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  { showPassword ? <Eye size={24} /> : <EyeSlash size={24}/>}
                </button>
              </div>
            </div>
            
            <button className="mt-6 p-3 h-12 flex items-center justify-center text-gray-50 font-bold rounded-md bg-purple-500  outline-purple-500 w-full md:w-96 mx-auto">
              {
                !loading 
                  ? ("Cadastrar") 
                  : ( 
                    <svg aria-hidden="true" className="inline w-4 h-4 mr-2 text-gray-50 animate-spin fill-purple-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                  )
              }
            </button>
          </form>
        </main>
      </div>
    </>
  )
}

