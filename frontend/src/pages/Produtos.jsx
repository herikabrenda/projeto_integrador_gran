import { useEffect, useState } from 'react';
import api from '../api.js';

const VAZIO = { nome: '', descricao: '', preco: '', codigoBarras: '' };

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [form, setForm] = useState(VAZIO);
  const [editandoId, setEditandoId] = useState(null);
  const [erro, setErro] = useState('');

  function carregar() {
    api
      .get('/produtos')
      .then((res) => setProdutos(res.data))
      .catch(() => setErro('Não foi possível carregar os produtos. O backend está rodando?'));
  }

  useEffect(carregar, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    const payload = { ...form, preco: parseFloat(form.preco) };
    try {
      if (editandoId) {
        await api.put(`/produtos/${editandoId}`, payload);
      } else {
        await api.post('/produtos', payload);
      }
      setForm(VAZIO);
      setEditandoId(null);
      carregar();
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao salvar produto');
    }
  }

  function handleEditar(produto) {
    setEditandoId(produto.id);
    setForm({
      nome: produto.nome,
      descricao: produto.descricao || '',
      preco: produto.preco,
      codigoBarras: produto.codigoBarras || '',
    });
  }

  async function handleExcluir(id) {
    await api.delete(`/produtos/${id}`);
    carregar();
  }

  return (
    <div>
      <h1>Produtos</h1>

      <form onSubmit={handleSubmit}>
        <input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} required />
        <input name="descricao" placeholder="Descrição" value={form.descricao} onChange={handleChange} />
        <input
          name="preco"
          type="number"
          step="0.01"
          placeholder="Preço"
          value={form.preco}
          onChange={handleChange}
          required
        />
        <input
          name="codigoBarras"
          placeholder="Código de barras"
          value={form.codigoBarras}
          onChange={handleChange}
        />
        <button type="submit">{editandoId ? 'Atualizar' : 'Adicionar'}</button>
        {editandoId && (
          <button
            type="button"
            onClick={() => {
              setEditandoId(null);
              setForm(VAZIO);
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      {erro && <p className="erro">{erro}</p>}

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Preço</th>
            <th>Código de Barras</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((p) => (
            <tr key={p.id}>
              <td>{p.nome}</td>
              <td>{p.descricao}</td>
              <td>R$ {Number(p.preco).toFixed(2)}</td>
              <td>{p.codigoBarras}</td>
              <td>
                <button onClick={() => handleEditar(p)}>Editar</button>{' '}
                <button className="danger" onClick={() => handleExcluir(p.id)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
