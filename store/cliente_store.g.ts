// store/clienteStore.ts

import { create } from "zustand";

export interface Cliente {
  id: string;
  nome: string;
  email: string;
}

interface ClienteStore {
  cliente: Cliente | null;
  defineCliente: (cliente: Cliente) => void;
  removeCliente: () => void;
}

export const clienteStore = create<ClienteStore>((set) => ({
  cliente: null,

  defineCliente: (cliente) => set({ cliente }),

  removeCliente: () => set({ cliente: null }),
}));
