import { useEffect, useState } from 'react';
import api from '../api.js';

const VAZIO = {
  nome: '',
  descricao: '',
  preco: '',
  codigoBarras: '',
  quantidadeEstoque: '',
  estoqueMinimo: '',
};

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [form, setForm] = useState(VAZIO);
  const [editandoId, setEditandoId] = useState(null);
  const [erro, setErro] = useState('');
  const [movimentacoes, setMovimentacoes] = useState({});

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
    const payload = {
      ...form,
      preco: parseFloat(form.preco),
      quantidadeEstoque: form.quantidadeEstoque === '' ? 0 : Number(form.quantidadeEstoque),
      estoqueMinimo: form.estoqueMinimo === '' ? 0 : Number(form.estoqueMinimo),
    };
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
      quantidadeEstoque: produto.quantidadeEstoque ?? 0,
      estoqueMinimo: produto.estoqueMinimo ?? 0,
    });
  }

  async function handleExcluir(id) {
    await api.delete(`/produtos/${id}`);
    carregar();
  }

  function handleMovChange(id, valor) {
    setMovimentacoes({ ...movimentacoes, [id]: valor });
  }

  async function handleEntrada(id) {
    const quantidade = Number(movimentacoes[id]);
    if (!quantidade || quantidade <= 0) return;
    setErro('');
    try {
      await api.post(`/produtos/${id}/entrada`, { quantidade });
      handleMovChange(id, '');
      carregar();
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao registrar entrada');
    }
  }

  async function handleSaida(id) {
    const quantidade = Number(movimentacoes[id]);
    if (!quantidade || quantidade <= 0) return;
    setErro('');
    try {
      await api.post(`/produtos/${id}/saida`, { quantidade });
      handleMovChange(id, '');
      carregar();
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao registrar saída');
    }
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
        <input
          name="quantidadeEstoque"
          type="number"
          placeholder="Qtd. em estoque"
          value={form.quantidadeEstoque}
          onChange={handleChange}
        />
        <input
          name="estoqueMinimo"
          type="number"
          placeholder="Estoque mínimo"
          value={form.estoqueMinimo}
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
            <th>Estoque</th>
            <th>Movimentar</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((p) => {
            const estoqueBaixo = (p.quantidadeEstoque || 0) <= (p.estoqueMinimo || 0);
            return (
              <tr key={p.id}>
                <td>{p.nome}</td>
                <td>{p.descricao}</td>
                <td>R$ {Number(p.preco).toFixed(2)}</td>
                <td>{p.codigoBarras}</td>
                <td style={estoqueBaixo ? { color: '#dc2626', fontWeight: 'bold' } : undefined}>
                  {p.quantidadeEstoque ?? 0} / mín. {p.estoqueMinimo ?? 0}
                  {estoqueBaixo && ' ⚠'}
                </td>
                <td>
                  <input
                    type="number"
                    min="1"
                    style={{ width: 70, minWidth: 70 }}
                    value={movimentacoes[p.id] || ''}
                    onChange={(e) => handleMovChange(p.id, e.target.value)}
                  />
                  <button onClick={() => handleEntrada(p.id)}>Entrada</button>{' '}
                  <button className="danger" onClick={() => handleSaida(p.id)}>
                    Saída
                  </button>
                </td>
                <td>
                  <button onClick={() => handleEditar(p)}>Editar</button>{' '}
                  <button className="danger" onClick={() => handleExcluir(p.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
