import React from 'react';
import Link from 'next/link';
import { LoginFirebaseAuthService } from '@/services/firebase/users/login/login_firebase';
import clienteStore from '../../store/client_store';

export type MenuItem = {
  label: string;
  path: string;
};

export type MenuProps = {
  items: MenuItem[];
};

const handleLogoutClick = () => {
  const loginService = new LoginFirebaseAuthService();
  loginService.signOut();
  clienteStore.removeCliente();
}
const Menu: React.FC<MenuProps> = ({ items }) => (
    
  <ul className="itens-menu-lateral">
    {items.map((item) => (
      <React.Fragment key={item.path}>
        <li>
          <Link href={item.path} passHref legacyBehavior>
            <a className="item">{item.label}</a>
          </Link>
        </li>
        {item !== items[items.length - 1] && <hr />}
      </React.Fragment>
    ))}
    <li className='logout'>
      <Link href='http://localhost:3001' passHref legacyBehavior>
        <a className="item" target="_blank" rel="noopener noreferrer">Sobre</a>
      </Link>
    </li>
    <li className='logout'>
      <Link href='user/login' passHref legacyBehavior>
        <a className="item" onClick={handleLogoutClick}>Sair</a>
      </Link>
    </li>
  </ul>
);

export default Menu;
