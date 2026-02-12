import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { Plus, Trash2, Check, Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Bills = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bills, setBills] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all, pendente, pago, atrasado
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    tipo: 'a_pagar',
    titulo: '',
    valor: '',
    vencimento: '',
    categoria: '',
    subcategoria: '',
    recorrencia: '',
    observacoes: ''
  });

  const categorias = ['Moradia', 'Transporte', 'Saúde', 'Educação', 'Contas', 'Outros'];
  const recorrenciaOptions = ['', 'mensal', 'anual'];

  useEffect(() => {
    fetchBills();
  }, [filter]);

  const fetchBills = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await api.get('/bills', { params });
      setBills(response.data);
    } catch (error) {
      toast.error('Erro ao carregar contas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/bills', {
        ...formData,
        valor: parseFloat(formData.valor)
      });
      toast.success('Conta adicionada com sucesso!');
      setShowModal(false);
      setFormData({
        tipo: 'a_pagar',
        titulo: '',
        valor: '',
        vencimento: '',
        categoria: '',
        subcategoria: '',
        recorrencia: '',
        observacoes: ''
      });
      fetchBills();
    } catch (error) {
      toast.error('Erro ao adicionar conta');
    }
  };

  const handleMarkAsPaid = async (billId) => {
    try {
      await api.put(`/bills/${billId}`, {
        status: 'pago',
        data_pagamento: new Date().toISOString()
      });
      toast.success('Conta marcada como paga!');
      fetchBills();
    } catch (error) {
      toast.error('Erro ao atualizar conta');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente excluir esta conta?')) return;
    
    try {
      await api.delete(`/bills/${id}`);
      toast.success('Conta deletada com sucesso!');
      fetchBills();
    } catch (error) {
      toast.error('Erro ao deletar conta');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pago':
        return 'bg-[#2CB67D]/10 text-[#2CB67D]';
      case 'atrasado':
        return 'bg-[#EF4565]/10 text-[#EF4565]';
      default:
        return 'bg-[#FF8906]/10 text-[#FF8906]';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pago':
        return <Check size={16} />;
      case 'atrasado':
        return <AlertTriangle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#7F5AF0] text-xl">Carregando...</div>
      </div>
    );
  }

  const filteredBills = filter === 'all' ? bills : bills.filter(b => b.status === filter);

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
              <h1 className="text-4xl font-bold text-white">Contas a Pagar/Receber</h1>
              <button
                onClick={() => setShowModal(true)}
                data-testid="add-bill-button"
                className="flex items-center space-x-2 bg-[#7F5AF0] text-white hover:bg-[#6244C5] rounded-lg font-medium px-5 py-2.5 transition-all shadow-[0_0_15px_rgba(127,90,240,0.3)] hover:shadow-[0_0_25px_rgba(127,90,240,0.5)] button-press"
              >
                <Plus size={20} />
                <span>Nova Conta</span>
              </button>
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-6 overflow-x-auto">
              {[
                { key: 'all', label: 'Todas' },
                { key: 'pendente', label: 'Pendentes' },
                { key: 'atrasado', label: 'Atrasadas' },
                { key: 'pago', label: 'Pagas' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    filter === key
                      ? 'bg-[#7F5AF0] text-white shadow-[0_0_15px_rgba(127,90,240,0.3)]'
                      : 'bg-[#16161A] text-[#94A1B2] hover:bg-[#242629]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Bills Table */}
            <div className="bg-[#16161A] border border-white/5 rounded-xl overflow-hidden" data-testid="bills-table">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/5">
                      <th className="text-left py-4 px-6 text-[#94A1B2] font-semibold">Tipo</th>
                      <th className="text-left py-4 px-6 text-[#94A1B2] font-semibold">Título</th>
                      <th className="text-left py-4 px-6 text-[#94A1B2] font-semibold">Vencimento</th>
                      <th className="text-left py-4 px-6 text-[#94A1B2] font-semibold">Categoria</th>
                      <th className="text-right py-4 px-6 text-[#94A1B2] font-semibold">Valor</th>
                      <th className="text-center py-4 px-6 text-[#94A1B2] font-semibold">Status</th>
                      <th className="text-center py-4 px-6 text-[#94A1B2] font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBills.map((bill, index) => (
                      <tr key={bill.id} className="border-b border-white/5 hover:bg-white/5 transition-colors" data-testid={`bill-${index}`}>
                        <td className="py-4 px-6">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            bill.tipo === 'a_receber'
                              ? 'bg-[#2CB67D]/10 text-[#2CB67D]'
                              : 'bg-[#EF4565]/10 text-[#EF4565]'
                          }`}>
                            {bill.tipo === 'a_receber' ? 'A Receber' : 'A Pagar'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-white">{bill.titulo}</td>
                        <td className="py-4 px-6 text-white">
                          {new Date(bill.vencimento).toLocaleDateString('pt-BR')}
                          {bill.recorrencia && (
                            <span className="ml-2 text-xs text-[#7F5AF0]">({bill.recorrencia})</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-[#94A1B2]">{bill.categoria}</td>
                        <td className="py-4 px-6 text-right font-bold jetbrains-mono text-lg text-white">
                          R$ {bill.valor.toFixed(2)}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(bill.status)}`}>
                              {getStatusIcon(bill.status)}
                              {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            {bill.status === 'pendente' && (
                              <button
                                onClick={() => handleMarkAsPaid(bill.id)}
                                data-testid={`pay-bill-${index}`}
                                className="text-[#2CB67D] hover:bg-[#2CB67D]/10 p-2 rounded-lg transition-all"
                                title="Marcar como pago"
                              >
                                <Check size={18} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(bill.id)}
                              data-testid={`delete-bill-${index}`}
                              className="text-[#EF4565] hover:bg-[#EF4565]/10 p-2 rounded-lg transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredBills.length === 0 && (
              <div className="text-center py-16" data-testid="no-bills-message">
                <p className="text-[#94A1B2] text-lg">Nenhuma conta encontrada.</p>
              </div>
            )}
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
            data-testid="bill-modal"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Nova Conta</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#94A1B2] mb-2">Tipo</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, tipo: 'a_pagar' })}
                    className={`py-3 rounded-lg font-medium transition-all ${
                      formData.tipo === 'a_pagar'
                        ? 'bg-[#EF4565] text-white'
                        : 'bg-[#242629] text-[#94A1B2]'
                    }`}
                  >
                    A Pagar
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, tipo: 'a_receber' })}
                    className={`py-3 rounded-lg font-medium transition-all ${
                      formData.tipo === 'a_receber'
                        ? 'bg-[#2CB67D] text-white'
                        : 'bg-[#242629] text-[#94A1B2]'
                    }`}
                  >
                    A Receber
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#94A1B2] mb-2">Título</label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  data-testid="bill-titulo-input"
                  className="w-full bg-[#242629] border border-white/10 text-white focus:border-[#7F5AF0] focus:ring-1 focus:ring-[#7F5AF0] rounded-lg h-12 px-4 outline-none"
                  placeholder="Ex: Aluguel, Conta de luz"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#94A1B2] mb-2">Valor</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.valor}
                    onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                    data-testid="bill-valor-input"
                    className="w-full bg-[#242629] border border-white/10 text-white focus:border-[#7F5AF0] focus:ring-1 focus:ring-[#7F5AF0] rounded-lg h-12 px-4 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94A1B2] mb-2">Vencimento</label>
                  <input
                    type="date"
                    value={formData.vencimento}
                    onChange={(e) => setFormData({ ...formData, vencimento: e.target.value })}
                    data-testid="bill-vencimento-input"
                    className="w-full bg-[#242629] border border-white/10 text-white focus:border-[#7F5AF0] focus:ring-1 focus:ring-[#7F5AF0] rounded-lg h-12 px-4 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#94A1B2] mb-2">Categoria</label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  data-testid="bill-categoria-select"
                  className="w-full bg-[#242629] border border-white/10 text-white focus:border-[#7F5AF0] focus:ring-1 focus:ring-[#7F5AF0] rounded-lg h-12 px-4 outline-none"
                  required
                >
                  <option value="">Selecione...</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#94A1B2] mb-2">Recorrência (opcional)</label>
                <select
                  value={formData.recorrencia}
                  onChange={(e) => setFormData({ ...formData, recorrencia: e.target.value })}
                  data-testid="bill-recorrencia-select"
                  className="w-full bg-[#242629] border border-white/10 text-white focus:border-[#7F5AF0] focus:ring-1 focus:ring-[#7F5AF0] rounded-lg h-12 px-4 outline-none"
                >
                  <option value="">Sem recorrência</option>
                  <option value="mensal">Mensal</option>
                  <option value="anual">Anual</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#94A1B2] mb-2">Observações (opcional)</label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  className="w-full bg-[#242629] border border-white/10 text-white focus:border-[#7F5AF0] focus:ring-1 focus:ring-[#7F5AF0] rounded-lg p-4 outline-none"
                  rows="3"
                  placeholder="Informações adicionais..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  data-testid="bill-cancel-button"
                  className="flex-1 bg-transparent border border-[#94A1B2] text-[#94A1B2] hover:bg-white/5 rounded-lg font-medium py-3 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  data-testid="bill-submit-button"
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

export default Bills;