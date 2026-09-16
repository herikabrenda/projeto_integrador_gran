import { useEffect, useState } from 'react';
import api from '../api.js';

export default function Associacao() {
  const [produtos, setProdutos] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [associacoes, setAssociacoes] = useState([]);
  const [produtoId, setProdutoId] = useState('');
  const [fornecedorId, setFornecedorId] = useState('');
  const [erro, setErro] = useState('');

  function carregar() {
    api.get('/produtos').then((res) => setProdutos(res.data));
    api.get('/fornecedores').then((res) => setFornecedores(res.data));
    api
      .get('/produto-fornecedor')
      .then((res) => setAssociacoes(res.data))
      .catch(() => setErro('Não foi possível carregar as associações. O backend está rodando?'));
  }

  useEffect(carregar, []);

  async function handleAssociar(e) {
    e.preventDefault();
    setErro('');
    try {
      await api.post('/produto-fornecedor', {
        produtoId: Number(produtoId),
        fornecedorId: Number(fornecedorId),
      });
      setProdutoId('');
      setFornecedorId('');
      carregar();
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao associar produto e fornecedor');
    }
  }

  async function handleDesassociar(id) {
    await api.delete(`/produto-fornecedor/${id}`);
    carregar();
  }

  return (
    <div>
      <h1>Associação Produto / Fornecedor</h1>

      <form onSubmit={handleAssociar}>
        <select value={produtoId} onChange={(e) => setProdutoId(e.target.value)} required>
          <option value="">Selecione o produto</option>
          {produtos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>
        <select value={fornecedorId} onChange={(e) => setFornecedorId(e.target.value)} required>
          <option value="">Selecione o fornecedor</option>
          {fornecedores.map((f) => (
            <option key={f.id} value={f.id}>
              {f.nome}
            </option>
          ))}
        </select>
        <button type="submit">Associar</button>
      </form>

      {erro && <p className="erro">{erro}</p>}

      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Fornecedor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {associacoes.map((a) => (
            <tr key={a.id}>
              <td>{a.produtoNome}</td>
              <td>{a.fornecedorNome}</td>
              <td>
                <button className="danger" onClick={() => handleDesassociar(a.id)}>
                  Desassociar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
