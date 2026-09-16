import { useEffect, useState } from 'react';
import api from '../api.js';

const VAZIO = { nome: '', cnpj: '', endereco: '', contato: '' };

export default function Fornecedores() {
  const [fornecedores, setFornecedores] = useState([]);
  const [form, setForm] = useState(VAZIO);
  const [editandoId, setEditandoId] = useState(null);
  const [erro, setErro] = useState('');

  function carregar() {
    api
      .get('/fornecedores')
      .then((res) => setFornecedores(res.data))
      .catch(() => setErro('Não foi possível carregar os fornecedores. O backend está rodando?'));
  }

  useEffect(carregar, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    try {
      if (editandoId) {
        await api.put(`/fornecedores/${editandoId}`, form);
      } else {
        await api.post('/fornecedores', form);
      }
      setForm(VAZIO);
      setEditandoId(null);
      carregar();
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao salvar fornecedor');
    }
  }

  function handleEditar(fornecedor) {
    setEditandoId(fornecedor.id);
    setForm({
      nome: fornecedor.nome,
      cnpj: fornecedor.cnpj,
      endereco: fornecedor.endereco || '',
      contato: fornecedor.contato || '',
    });
  }

  async function handleExcluir(id) {
    await api.delete(`/fornecedores/${id}`);
    carregar();
  }

  return (
    <div>
      <h1>Fornecedores</h1>

      <form onSubmit={handleSubmit}>
        <input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} required />
        <input name="cnpj" placeholder="CNPJ" value={form.cnpj} onChange={handleChange} required />
        <input name="endereco" placeholder="Endereço" value={form.endereco} onChange={handleChange} />
        <input name="contato" placeholder="Contato" value={form.contato} onChange={handleChange} />
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
            <th>CNPJ</th>
            <th>Endereço</th>
            <th>Contato</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {fornecedores.map((f) => (
            <tr key={f.id}>
              <td>{f.nome}</td>
              <td>{f.cnpj}</td>
              <td>{f.endereco}</td>
              <td>{f.contato}</td>
              <td>
                <button onClick={() => handleEditar(f)}>Editar</button>{' '}
                <button className="danger" onClick={() => handleExcluir(f.id)}>
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
