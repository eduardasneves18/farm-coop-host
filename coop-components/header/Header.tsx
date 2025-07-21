import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Logo from "./Logo";
import { HeaderProps } from "../../types/header/HeaderProps";
import Link from "next/link";
import clienteStore from '../../store/client_store';

const UserName: React.FC<{ name?: string }> = ({ name }) => (
  <div className="yes-bank-header-user-name">{name ?? ""}</div>
);


const Header:React.FC<HeaderProps> = ({
  user,
  type,
  appTitlePrimary,
}) => {
  if (!user || !type) {
    console.error("Missing required props: user or type");
    return null;
  }

  const renderHeaderContent = () => (
    <>
      <Logo
        link="/home"
        appTitlePrimary={appTitlePrimary}
      />
      <UserName name={clienteStore.cliente.email ?? 'Deslogado'} />
      <div>
          <Link href="/home" className="yes-bank-header-link">
            <FontAwesomeIcon icon={faUser}/>
          </Link>
      </div>
    </>
  );


  return <header className="yes-bank-header">{renderHeaderContent()}</header>;





};

export default Header;