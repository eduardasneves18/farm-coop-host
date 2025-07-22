
import { Dashboard } from '../components/coop-farm-components';

export default function HomePage() {
  return (
    <>
      <Dashboard>
        <div className="header-extrato" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>🌿 Coop Farm</h1>
        </div>
        <hr />
          <h3>Bem vindo(a) à nossa cooperativa!</h3>
          <a>Unindo forças para cultivar um futuro melhor 🌱</a>
          <br></br>
          <a>Somos uma cooperativa formada por fazendas que acreditam na força do trabalho coletivo, na valorização do produtor rural e na sustentabilidade do campo.</a>
        <div>

        </div>
      </Dashboard>
    </>
  );
}
