"use client"

import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify"; 
import { Plus, SignOut } from "@phosphor-icons/react";
import { AuthContext } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { socket } from "@/services/socket";
import { Item, ItemDto } from "@/components/Item";

const schema = z.object({
  name: z.string().nonempty(),
  amount: z.string().min(1),
  amountType: z
  .union([ z.literal("und"), z.literal("l"), z.literal("kg")]),
  category: z
  .union([ z.literal("Padaria"), z.literal("Legume"), z.literal("Carne"), z.literal("Fruta"), z.literal("Bebida")])
}).required();

type schemaType = z.infer<typeof schema>;

export default function Dashboard(){
  const { register, reset, handleSubmit } = useForm<schemaType>({  resolver: zodResolver(schema) });
  const { user, handleLogout } = useContext(AuthContext);
  const [items, setItems] = useState<ItemDto[]>([]);

  useEffect(() => {
    handleListItems();
  },[]);

  useEffect(() => {
    socket.on("update-list", async (data) => {
      await  handleListItems();
    });
  },[]);

  async function handleListItems(): Promise<void>{
    try {
      const response = await api.get("/items");

      setItems(response.data.data);
      
    } catch (error: any) {
      const message = error?.response?.data?.message || "Error internal server";

      toast.error(message);
    }
  };

  async function handleAddItem(data: schemaType): Promise<void>{
    try {

      const response =  await api.post("/items", data);
      
      toast.success(response.data.message);

      reset();
    } catch (error: any) {
      const message = error?.response?.data?.message || "Error internal server";

      toast.error(message);
    }
  };

  async function handleDeleteItem(id: string): Promise<void>{
    try {

      await api.delete(`/items/${id}`);

      toast.success("Item deletado com sucesso");

    } catch (error: any) {
      const message = error?.response?.data?.message || "Error internal server";
      
      toast.error(message);
    }
  }

  return(
    <>
      <div className="h-screen bg-zinc-950 flex flex-col">
        <div className="bg-[url('/backgorund.png')] h-44"></div>

        <button 
          className="flex items-center gap-2 px-3 py-2 bg-purple-500 rounded-md text-gray-50 fixed top-5 right-5"
          onClick={() => handleLogout()}
          title="Sair"
        >
          <SignOut size={21} />
        </button>

        <main className="flex-1 flex flex-col p-6 mt-[-140px] mx-auto max-w-[720px] overflow-hidden">
          <h1 className="text-gray-50 text-2xl font-bold mb-2">Olá, {user?.name}!</h1>
          <h1 className="text-gray-200 text-xl font-bold mb-8">Segue sua lista de compras</h1>

          <form 
            onSubmit={handleSubmit(handleAddItem)}
            className="flex flex-col md:flex-row md:items-end md:justify-between md:gap-3"
          >
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-xs text-gray-300 font-normal">Item</label>
              <input 
                type="text" 
                className="p-3 bg-gray-900 rounded-md text-gray-50 outline-purple-500"
                {...register("name")}
              />
            </div>

            <div className="flex items-end gap-2 mt-2">
              <div className="flex flex-col gap-2 w-full  md:w-[150px]">
                <label className="text-xs text-gray-300 font-normal">Quantidade</label>
                <div className="flex ">
                  <input 
                    type="number" 
                    min={1} 
                    className="w-full  text-gray-50 p-3 bg-gray-900 rounded-md rounded-se-none rounded-ee-none outline-purple-500"
                    {...register("amount")}
                  />
                  <select 
                    className="p-3 bg-gray-900 rounded-md text-gray-50 rounded-ss-none rounded-es-none border-s border-s-gray-500 outline-purple-500"
                    defaultValue={"und"}
                    {...register("amountType")}
                    >
                    <option value="und">Un.</option>
                    <option value="l">L</option>
                    <option value="kg">Kg</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full  md:w-[150px]">
                <label className="text-xs text-gray-300 font-normal">Categoria</label>
                <select 
                  className="p-3 bg-gray-900 rounded-md text-gray-50 outline-purple-500"
                  defaultValue={-1}
                  {...register("category")}
                >
                  <option value="-1">Selecione</option>
                  <option value="Padaria">Padaria</option>
                  <option value="Legume">Legume</option>
                  <option value="Carne">Carne</option>
                  <option value="Fruta">Fruta</option>
                  <option value="Bebida">Bebida</option>
                </select>
              </div>

              <button className="w-10 h-10 p-2 flex items-center justify-center text-gray-50 bg-purple-500 rounded-full outline-purple-500">
                <Plus size={24}/>
              </button>
            </div>

          </form>

          <div className="flex-1 flex flex-col gap-2 mt-10 overflow-y-scroll">
            {
              items.map((item) => (
                <Item 
                  key={item.id} 
                  item={item} 
                  handleDeleteItem={handleDeleteItem}
                />
              ))
            }
          </div>
        </main>
      </div>
    </>
  )
}

