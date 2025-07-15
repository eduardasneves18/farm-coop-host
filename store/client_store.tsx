import { makeAutoObservable } from 'mobx';

export interface Cliente {
  id?: string;
  email?: string;
  nome?: string;
  password?: string;
  primeiroNome?: string;
  ultimoNome?: string;
}

export class ClienteStore {
  cliente: Cliente = {};

  constructor() {
    makeAutoObservable(this);
  }

  defineCliente(value: Cliente) {
    this.cliente = value;
  }

  removeCliente() {
    this.cliente = {};
  }
}

const clienteStore = new ClienteStore();
export default clienteStore;
