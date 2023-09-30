import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify"; 
import { X } from "@phosphor-icons/react";
import { api } from "@/services/api";

import { AppleLogo, BeerBottle, Carrot, Fish, Hamburger, PencilSimpleLine, TrashSimple } from "@phosphor-icons/react";

export interface ItemDto{
  id: string,
	name: string,
	amount: string,
	amount_type: "und" | "l" | "kg",
	category: "Padaria" | "Legume" | "Carne" | "Fruta" | "Bebida",
	checked: boolean,
}

interface ItemProps{
  item: ItemDto;
  handleDeleteItem: (id:string) => Promise<void>;
}

const schema = z.object({
  name: z.string().nonempty(),
  amount: z.string().min(1),
  amountType: z
  .union([ z.literal("und"), z.literal("l"), z.literal("kg")]),
  category: z
  .union([ z.literal("Padaria"), z.literal("Legume"), z.literal("Carne"), z.literal("Fruta"), z.literal("Bebida")]),
  checked: z.boolean(),
}).required();

type schemaType = z.infer<typeof schema>;

export function Item(props: ItemProps){
  const { item, handleDeleteItem} = props;
  const [ openModal, setOpenModal ] = useState<boolean>(false);
  const { register, handleSubmit } = useForm<schemaType>({  resolver: zodResolver(schema) });
  const { id, name, amount, amount_type, category, checked } = item;
  const categories = {
    Padaria:{
      colors:"bg-yellow-500 text-yellow-800",
      icon: <Hamburger size={21}/>
    },
    Legume:{
      colors:"bg-green-500 text-green-800",
      icon: <Carrot size={21}/>
    },
    Carne:{
      colors:"bg-pink-500 text-pink-800",
      icon: <Fish size={21}/>
    },
    Fruta:{
      colors:"bg-orange-500 text-orange-800",
      icon: <AppleLogo size={21}/>
    },
    Bebida:{
      colors:"bg-blue-500 text-blue-800",
      icon: <BeerBottle size={21}/>
    }
  };

  async function handleUpdateItem(data:schemaType){
    try {
      const response = await api.patch(`/items/${item.id}`, data);
      
      setOpenModal(false);

      toast.success(response.data.message);

    } catch (error: any) {
      const message = error?.response?.data?.message || "Error internal server";

      toast.error(message);
    }
  };

  return(
    <>
     <div className={`flex items-center justify-between p-4 rounded-md bg-gray-900 ${checked ? "opacity-60" : ""}`}>
      <input 
        type="checkbox" 
        className="outline-purple-500 accent-green-600 cursor-pointer"
        checked={checked}
        {...register("checked")}
        onClick={() => handleUpdateItem({
          name: item.name,
          amount: item.amount,
          category: item.category,
          checked: !item.checked,
          amountType: item.amount_type,
        })}
      />

      <div className="flex-1 mx-4">
        <p className={`text-gray-50 text-sm font-bold capitalize ${checked ? "line-through" : ""}`}>{name}</p>
        <p className="text-gray-300 text-sm font-normal">{amount} {amount_type}</p>
      </div>

      <div className={`flex flex-row items-center justify-between rounded-full py-1 px-1.5 ${ categories[category].colors }`}>
        { categories[category].icon }
        <span className="ml-2 text-xs hidden md:block">{category}</span>
      </div>

      <button 
        className="text-gray-50 ml-3 outline-purple-500" 
        title="Editar"
        onClick={() => setOpenModal(true)}
      >
        <PencilSimpleLine size={21} />
      </button>

      <button 
        className="text-gray-50 ml-3 outline-purple-500" 
        title="Deletar"
        onClick={() => handleDeleteItem(id)}
      >
        <TrashSimple size={21} />
      </button>
     </div>
     
      <div className={`bg-zinc-950 bg-opacity-90 fixed flex top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full ${openModal ? "" : "hidden"}`}>
          <div className="relative w-full max-w-2xl max-h-full m-auto">
              <div className="relative rounded-md shadow border border-gray-600 bg-zinc-950">
                  <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-600">
                      <h3 className="text-xl font-semibold text-gray-50">
                        Editar item
                      </h3>

                      <button 
                        type="button" 
                        className="text-gray-400 bg-transparent rounded-md text-sm w-8 h-8 ml-auto inline-flex justify-center items-center hover:text-gray-50 hover:bg-purple-500" 
                        onClick={() => setOpenModal(false)}  
                      >
                        <X size={21} />
                      </button>
                  </div>

                  <div className="p-6 space-y-6">
                    <form 
                      onSubmit={handleSubmit(handleUpdateItem)}
                      className="flex flex-col gap-3"
                    >
                      <div className="flex-1 flex flex-col gap-2">
                        <label className="text-xs text-gray-300 font-normal">Item</label>
                        <input 
                          type="text"
                          defaultValue={name} 
                          className="p-3 bg-gray-900 rounded-md text-gray-50 capitalize outline-purple-500"
                          {...register("name")}
                        />
                      </div>

                      <div className="flex items-end gap-2">
                        <div className="flex flex-col gap-2 w-full">
                          <label className="text-xs text-gray-300 font-normal">Quantidade</label>
                          <div className="flex ">
                            <input 
                              type="number" 
                              min={1}
                              defaultValue={amount} 
                              className="w-full  text-gray-50 p-3 bg-gray-900 rounded-md rounded-se-none rounded-ee-none outline-purple-500"
                              {...register("amount")}
                            />
                            <select 
                              className="p-3 bg-gray-900 rounded-md text-gray-50 rounded-ss-none rounded-es-none border-s border-s-gray-500 outline-purple-500"
                              defaultValue={amount_type}
                              {...register("amountType")}
                              >
                              <option value="und">Un.</option>
                              <option value="l">L</option>
                              <option value="kg">Kg</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                          <label className="text-xs text-gray-300 font-normal">Categoria</label>
                          <select 
                            className="p-3 bg-gray-900 rounded-md text-gray-50 outline-purple-500"
                            defaultValue={category}
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
                      </div>    
                      
                      <button 
                        type="submit"
                        className="mt-6 p-2 w-full md:w-96 mx-auto flex items-center justify-center text-gray-50 bg-purple-500 rounded-md outline-purple-500"
                        >
                        Salvar
                      </button>
                    </form>
                  </div>
              </div>
          </div>
      </div>
    </>
  )
}