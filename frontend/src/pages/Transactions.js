import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { Plus, Trash2, Download, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Transactions = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    tipo: 'entrada',
    categoria: '',
    subcategoria: '',
    valor: '',
    descricao: '',
    data: new Date().toISOString().split('T')[0]
  });

  const categoriesMap = {
    entrada: {
      'Salário': ['Salário Principal', 'Salário Extra', 'Décimo Terceiro', 'Férias'],
      'Freelance': ['Serviços', 'Consultoria', 'Projetos', 'Outros'],
      'Investimentos': ['Dividendos', 'Juros', 'Venda de Ativos', 'Lucros'],
      'Negócio Próprio': ['Vendas', 'Serviços', 'Produtos', 'Outros'],
      'Outros': ['Presente', 'Restituição', 'Prêmio', 'Venda de Bens', 'Outros']
    },
    saida: {
      'Alimentação': ['Supermercado', 'Restaurante', 'Lanchonete', 'Delivery', 'Padaria', 'Feira'],
      'Transporte': ['Combustível', 'Uber/Taxi', 'Ônibus/Metrô', 'Estacionamento', 'Manutenção', 'IPVA'],
      'Moradia': ['Aluguel', 'Condomínio', 'IPTU', 'Luz', 'Água', 'Gás', 'Internet'],
      'Saúde': ['Farmácia', 'Consulta Médica', 'Exames', 'Plano de Saúde', 'Academia', 'Terapia'],
      'Educação': ['Mensalidade', 'Livros', 'Material Escolar', 'Cursos Online', 'Eventos'],
      'Lazer': ['Cinema', 'Streaming', 'Viagens', 'Shows', 'Jogos', 'Hobbies'],
      'Vestuário': ['Roupas', 'Calçados', 'Acessórios', 'Salão/Barbearia'],
      'Contas': ['Celular', 'Cartão de Crédito', 'Empréstimos', 'Seguros', 'Assinaturas'],
      'Compras': ['Eletrônicos', 'Casa e Decoração', 'Presentes', 'Pet Shop', 'Outros']
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions');
      setTransactions(response.data);
    } catch (error) {
      toast.error('Erro ao carregar transações');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/transactions', {
        ...formData,
        valor: parseFloat(formData.valor)
      });
      toast.success('Transação adicionada com sucesso!');
      setShowModal(false);
      setFormData({
        tipo: 'entrada',
        categoria: '',
        subcategoria: '',
        valor: '',
        descricao: '',
        data: new Date().toISOString().split('T')[0]
      });
      fetchTransactions();
    } catch (error) {
      toast.error('Erro ao adicionar transação');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente excluir esta transação?')) return;
    
    try {
      await api.delete(`/transactions/${id}`);
      toast.success('Transação deletada com sucesso!');
      fetchTransactions();
    } catch (error) {
      toast.error('Erro ao deletar transação');
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/export/xlsx', {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'fincontrol_transacoes.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Planilha exportada com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar planilha');
    }
  };

  const handleTipoChange = (tipo) => {
    setFormData({
      ...formData,
      tipo,
      categoria: '',
      subcategoria: ''
    });
  };

  const handleCategoriaChange = (categoria) => {
    setFormData({
      ...formData,
      categoria,
      subcategoria: ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#7F5AF0] text-xl">Carregando...</div>
      </div>
    );
  }

  const currentCategories = categoriesMap[formData.tipo] || {};
  const currentSubcategories = formData.categoria ? (currentCategories[formData.categoria] || []) : [];

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="lg:pl-64 pt-16 lg:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h1 className="text-4xl font-bold text-white">Lançamentos</h1>
              <div className="flex gap-3">
                <button
                  onClick={handleExport}
                  data-testid="export-button"
                  className="flex items-center space-x-2 bg-[#2CB67D] text-white hover:bg-[#249967] rounded-lg font-medium px-5 py-2.5 transition-all shadow-[0_0_15px_rgba(44,182,125,0.3)] hover:shadow-[0_0_25px_rgba(44,182,125,0.5)] button-press"
                >
                  <Download size={20} />
                  <span>Exportar</span>
                </button>
                <button
                  onClick={() => setShowModal(true)}
                  data-testid="add-transaction-button"
                  className="flex items-center space-x-2 bg-[#7F5AF0] text-white hover:bg-[#6244C5] rounded-lg font-medium px-5 py-2.5 transition-all shadow-[0_0_15px_rgba(127,90,240,0.3)] hover:shadow-[0_0_25px_rgba(127,90,240,0.5)] button-press"
                >
                  <Plus size={20} />
                  <span>Novo Lançamento</span>
                </button>
              </div>
            </div>

            <div className="bg-[#16161A] border border-white/5 rounded-xl overflow-hidden" data-testid="transactions-table">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/5">
                      <th className="text-left py-4 px-6 text-[#94A1B2] font-semibold">Data</th>
                      <th className="text-left py-4 px-6 text-[#94A1B2] font-semibold">Tipo</th>
                      <th className="text-left py-4 px-6 text-[#94A1B2] font-semibold">Categoria</th>
                      <th className="text-left py-4 px-6 text-[#94A1B2] font-semibold">Local/Origem</th>
                      <th className="text-left py-4 px-6 text-[#94A1B2] font-semibold">Descrição</th>
                      <th className="text-right py-4 px-6 text-[#94A1B2] font-semibold">Valor</th>
                      <th className="text-center py-4 px-6 text-[#94A1B2] font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction, index) => (
                      <tr key={transaction.id} className="border-b border-white/5 hover:bg-white/5 transition-colors" data-testid={`transaction-${index}`}>
                        <td className="py-4 px-6 text-white">
                          {new Date(transaction.data).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            transaction.tipo === 'entrada'
                              ? 'bg-[#2CB67D]/10 text-[#2CB67D]'
                              : 'bg-[#EF4565]/10 text-[#EF4565]'
                          }`}>
                            {transaction.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-white">{transaction.categoria}</td>
                        <td className="py-4 px-6">
                          <span className="inline-block px-3 py-1 rounded-full text-xs bg-[#7F5AF0]/10 text-[#7F5AF0]">
                            {transaction.subcategoria || '-'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-[#94A1B2]">{transaction.descricao}</td>
                        <td className={`py-4 px-6 text-right font-bold jetbrains-mono text-lg ${
                          transaction.tipo === 'entrada' ? 'text-[#2CB67D]' : 'text-[#EF4565]'
                        }`}>
                          {transaction.tipo === 'entrada' ? '+' : '-'} R$ {transaction.valor.toFixed(2)}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            data-testid={`delete-transaction-${index}`}
                            className="text-[#EF4565] hover:bg-[#EF4565]/10 p-2 rounded-lg transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4" onClick={() => setShowModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#16161A] border border-white/10 rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            data-testid="transaction-modal"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Novo Lançamento</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#94A1B2] mb-2">Tipo</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleTipoChange('entrada')}
                    data-testid="transaction-tipo-entrada"
                    className={`py-3 rounded-lg font-medium transition-all ${
                      formData.tipo === 'entrada'
                        ? 'bg-[#2CB67D] text-white shadow-[0_0_15px_rgba(44,182,125,0.3)]'
                        : 'bg-[#242629] text-[#94A1B2] hover:bg-[#2CB67D]/10'
                    }`}
                  >
                    Entrada
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTipoChange('saida')}
                    data-testid="transaction-tipo-saida"
                    className={`py-3 rounded-lg font-medium transition-all ${
                      formData.tipo === 'saida'
                        ? 'bg-[#EF4565] text-white shadow-[0_0_15px_rgba(239,69,101,0.3)]'
                        : 'bg-[#242629] text-[#94A1B2] hover:bg-[#EF4565]/10'
                    }`}
                  >
                    Saída
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#94A1B2] mb-2">Categoria</label>
                <select
                  value={formData.categoria}
                  onChange={(e) => handleCategoriaChange(e.target.value)}
                  data-testid="transaction-categoria-select"
                  className="w-full bg-[#242629] border border-white/10 text-white focus:border-[#7F5AF0] focus:ring-1 focus:ring-[#7F5AF0] rounded-lg h-12 px-4 outline-none"
                  required
                >
                  <option value="">Selecione uma categoria...</option>
                  {Object.keys(currentCategories).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {formData.categoria && (
                <div>
                  <label className="block text-sm font-medium text-[#94A1B2] mb-2">
                    {formData.tipo === 'entrada' ? 'Origem' : 'Local/Estabelecimento'}
                  </label>
                  <select
                    value={formData.subcategoria}
                    onChange={(e) => setFormData({ ...formData, subcategoria: e.target.value })}
                    data-testid="transaction-subcategoria-select"
                    className="w-full bg-[#242629] border border-white/10 text-white focus:border-[#7F5AF0] focus:ring-1 focus:ring-[#7F5AF0] rounded-lg h-12 px-4 outline-none"
                    required
                  >
                    <option value="">Selecione...</option>
                    {currentSubcategories.map(subcat => (
                      <option key={subcat} value={subcat}>{subcat}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#94A1B2] mb-2">Valor</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  data-testid="transaction-valor-input"
                  className="w-full bg-[#242629] border border-white/10 text-white focus:border-[#7F5AF0] focus:ring-1 focus:ring-[#7F5AF0] rounded-lg h-12 px-4 outline-none"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#94A1B2] mb-2">Descrição</label>
                <input
                  type="text"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  data-testid="transaction-descricao-input"
                  className="w-full bg-[#242629] border border-white/10 text-white focus:border-[#7F5AF0] focus:ring-1 focus:ring-[#7F5AF0] rounded-lg h-12 px-4 outline-none"
                  placeholder="Ex: Compra de supermercado do mês"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#94A1B2] mb-2">Data</label>
                <input
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  data-testid="transaction-data-input"
                  className="w-full bg-[#242629] border border-white/10 text-white focus:border-[#7F5AF0] focus:ring-1 focus:ring-[#7F5AF0] rounded-lg h-12 px-4 outline-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  data-testid="transaction-cancel-button"
                  className="flex-1 bg-transparent border border-[#94A1B2] text-[#94A1B2] hover:bg-white/5 rounded-lg font-medium py-3 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  data-testid="transaction-submit-button"
                  className="flex-1 bg-[#7F5AF0] text-white hover:bg-[#6244C5] rounded-lg font-medium py-3 transition-all shadow-[0_0_15px_rgba(127,90,240,0.3)] hover:shadow-[0_0_25px_rgba(127,90,240,0.5)] button-press"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
