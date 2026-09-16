import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import Produtos from './pages/Produtos.jsx';
import Fornecedores from './pages/Fornecedores.jsx';
import Associacao from './pages/Associacao.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <NavLink to="/produtos">Produtos</NavLink>
        <NavLink to="/fornecedores">Fornecedores</NavLink>
        <NavLink to="/associacao">Associação Produto/Fornecedor</NavLink>
      </nav>
      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/produtos" replace />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/fornecedores" element={<Fornecedores />} />
          <Route path="/associacao" element={<Associacao />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
