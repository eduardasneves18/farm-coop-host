import React, { createContext, useContext } from 'react';
import clienteStore, { ClienteStore } from './client_store';

const ClienteContext = createContext<ClienteStore>(clienteStore);

export const ClienteProvider: React.FC = ({ children }) => {
  return (
    <ClienteContext.Provider value={clienteStore}>
      {children}
    </ClienteContext.Provider>
  );
};

export const useClienteStore = (): ClienteStore => useContext(ClienteContext);
