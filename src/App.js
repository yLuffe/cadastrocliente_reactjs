import './App.css';
import { BrowserRouter, Routes, Route, Outlet, Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from 'react';

const endereco_servidor = 'http://localhost:8000';

function NoPage() {
  return (
    <div>
      <h2>404 - Página não encontrada</h2>
    </div>
  );
}

function Layout() {
  return (
    <>
      <h1>Menu principal</h1>
      <nav>
        <ol>
          <li>
            <Link to="/frmcadastrocliente/-1">Incluir</Link>
          </li>
          <li>
            <Link to="/frmlistarcliente">Listar(Alterar, Excluir)</Link>
          </li>
        </ol>
        <hr />
      </nav>
      <Outlet />
    </>
  );
}

function FrmCadastroCliente() {
  const { alterarId } = useParams();
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [resultado, setResultado] = useState('');

  useEffect(() => {
    const getCliente = async () => {
      if (alterarId > 0) {
        const response = await fetch(`${endereco_servidor}/cliente/${alterarId}`);
        const data = await response.json();
        setNome(data.nome);
        setCpf(data.cpf);
      }
    };
    getCliente();
  }, [alterarId]);

  const handleSubmitInsert = (event) => {
    event.preventDefault();
    const dados = {
      'nome': nome,
      'cpf': cpf
    };
    fetch(`${endereco_servidor}/cliente`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    })
      .then((response) => response.json())
      .then((data) => setResultado(data.message));
    limpar();
  };

  const handleSubmitUpdate = (event) => {
    event.preventDefault();
    const dados = {
      'nome': nome,
      'cpf': cpf
    };
    fetch(`${endereco_servidor}/cliente/${alterarId}`, {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    })
      .then((response) => response.json())
      .then((data) => setResultado(data.message));
    limpar();
  };

  const limpar = () => {
    setNome('');
    setCpf('');
  };

  return (
    <form name="FrmCadastroCliente" method="post" onSubmit={alterarId < 0 ? handleSubmitInsert : handleSubmitUpdate}>
      <label><h2>{alterarId < 0 ? (<div>1 - Formulário Cadastro Cliente</div>) : (<div>1 - Formulário Alteração Cliente</div>)}</h2></label>
      <label>Nome:
        <input type="text" size="60" id="nome" name="nome" value={nome} onChange={(event) => setNome(event.target.value)} />
      </label><br />
      <label>CPF:
        <input type="text" size="15" id="cpf" name="cpf" value={cpf} onChange={(event) => setCpf(event.target.value)} />
      </label><br /><br />
      <input type="button" name="Limpar" value="Limpar" onClick={limpar} />
      <input type="submit" name="Cadastrar" value="Cadastrar" /><br /><br />
      <label>Resultado: {resultado}</label>
    </form>
  );
}

function FrmExcluirCliente() {
  const { clienteId } = useParams();
  const [resultado, setResultado] = useState('');

  useEffect(() => {
    const excluirCliente = async () => {
      fetch(`${endereco_servidor}/cliente/${clienteId}`, { method: 'delete' })
        .then((response) => response.json())
        .then((data) => setResultado(data.message));
    };
    excluirCliente();
  }, [clienteId]);

  return (
    <div>
      <label>Resultado: {resultado}</label>
    </div>
  );
}

function FrmListarCliente() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const getClientes = () => {
      fetch(`${endereco_servidor}/clientes`)
        .then(response => response.json())
        .then(data => setClientes(data));
    };
    getClientes();
  }, []);

  return (
    <div>
      <h2>2 - Listar(Editar, Excluir)</h2>
      <div>
        <table border='1'>
          <thead>
            <tr>
              <th>Id</th>
              <th>Nome</th>
              <th>CPF</th>
              <th>Editar</th>
              <th>Excluir</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(cliente => (
             <tr>
                <td>{cliente.clienteId}</td>
                <td>{cliente.nome}</td>
                <td>{cliente.cpf}</td>
                <td>
                  <button onClick={() => { navigate(`/frmcadastrocliente/${cliente.clienteId}`) }}>Editar</button>
                </td>
                <td>
                  <button onClick={() => { navigate(`/frmexcluircliente/${cliente.clienteId}`) }}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table><br />
      </div>
    </div>
  );
}

function MenuPrincipal() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='frmcadastrocliente/:alterarId' element={<FrmCadastroCliente />} />
          <Route path='frmexcluircliente/:clienteId' element={<FrmExcluirCliente />} />
          <Route path='frmlistarcliente' element={<FrmListarCliente />} />
          <Route path='*' element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default MenuPrincipal;
