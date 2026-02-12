import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Goals = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    titulo: '',
    valor_alvo: '',
    prazo: ''
  });
  const [updateValue, setUpdateValue] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await api.get('/goals');
      setGoals(response.data);
    } catch (error) {
      toast.error('Erro ao carregar metas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/goals', {
        ...formData,
        valor_alvo: parseFloat(formData.valor_alvo)
      });
      toast.success('Meta criada com sucesso!');
      setShowModal(false);
      setFormData({ titulo: '', valor_alvo: '', prazo: '' });
      fetchGoals();
    } catch (error) {
      toast.error('Erro ao criar meta');
    }
  };

  const handleUpdateProgress = async () => {
    if (!editingGoal) return;
    try {
      await api.put(`/goals/${editingGoal.id}`, {
        valor_atual: parseFloat(updateValue)
      });
      toast.success('Progresso atualizado!');
      setShowUpdateModal(false);
      setEditingGoal(null);
      setUpdateValue('');
      fetchGoals();
    } catch (error) {
      toast.error('Erro ao atualizar progresso');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente excluir esta meta?')) return;
    
    try {
      await api.delete(`/goals/${id}`);
      toast.success('Meta deletada com sucesso!');
      fetchGoals();
    } catch (error) {
      toast.error('Erro ao deletar meta');
    }
  };

  const getProgressPercentage = (goal) => {
    return Math.min((goal.valor_atual / goal.valor_alvo) * 100, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#7F5AF0] text-xl">Carregando...</div>
      </div>
    );
  }

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
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-white">Metas Financeiras</h1>
              <button
                onClick={() => setShowModal(true)}
                data-testid="add-goal-button"
                className="flex items-center space-x-2 bg-[#7F5AF0] text-white hover:bg-[#6244C5] rounded-lg font-medium px-5 py-2.5 transition-all shadow-[0_0_15px_rgba(127,90,240,0.3)] hover:shadow-[0_0_25px_rgba(127,90,240,0.5)] button-press"
              >
                <Plus size={20} />
                <span>Nova Meta</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map((goal, index) => {
                const progress = getProgressPercentage(goal);
                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-[#16161A] border border-white/5 rounded-xl p-6 hover:border-[#7F5AF0]/30 transition-all"
                    data-testid={`goal-card-${index}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-white">{goal.titulo}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingGoal(goal);
                            setUpdateValue(goal.valor_atual.toString());
                            setShowUpdateModal(true);
                          }}
                          data-testid={`edit-goal-${index}`}
                          className="text-[#7F5AF0] hover:bg-[#7F5AF0]/10 p-2 rounded-lg transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(goal.id)}
                          data-testid={`delete-goal-${index}`}
                          className="text-[#EF4565] hover:bg-[#EF4565]/10 p-2 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-[#94A1B2]">Progresso</span>
                        <span className="text-[#7F5AF0] font-semibold">{progress.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-[#242629] rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#7F5AF0] to-[#2CB67D] transition-all duration-500 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[#94A1B2]">Atual:</span>
                        <span className="text-white font-semibold jetbrains-mono">R$ {goal.valor_atual.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#94A1B2]">Meta:</span>
                        <span className="text-[#2CB67D] font-semibold jetbrains-mono">R$ {goal.valor_alvo.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#94A1B2]">Prazo:</span>
                        <span className="text-white font-semibold">{new Date(goal.prazo).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {goals.length === 0 && (
              <div className="text-center py-16" data-testid="no-goals-message">
                <p className="text-[#94A1B2] text-lg">Nenhuma meta cadastrada ainda. Crie sua primeira meta!</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4" onClick={() => setShowModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#16161A] border border-white/10 rounded-2xl p-8 max-w-md w-full"
            data-testid="goal-modal"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Nova Meta</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#94A1B2] mb-2">Título</label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  data-testid="goal-titulo-input"
                  className="w-full bg-[#242629] border border-white/10 text-white focus:border-[#7F5AF0] focus:ring-1 focus:ring-[#7F5AF0] rounded-lg h-12 px-4 outline-none"
                  placeholder="Ex: Reserva de emergência"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#94A1B2] mb-2">Valor Alvo</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.valor_alvo}
                  onChange={(e) => setFormData({ ...formData, valor_alvo: e.target.value })}
                  data-testid="goal-valor-input"
                  className="w-full bg-[#242629] border border-white/10 text-white focus:border-[#7F5AF0] focus:ring-1 focus:ring-[#7F5AF0] rounded-lg h-12 px-4 outline-none"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#94A1B2] mb-2">Prazo</label>
                <input
                  type="date"
                  value={formData.prazo}
                  onChange={(e) => setFormData({ ...formData, prazo: e.target.value })}
                  data-testid="goal-prazo-input"
                  className="w-full bg-[#242629] border border-white/10 text-white focus:border-[#7F5AF0] focus:ring-1 focus:ring-[#7F5AF0] rounded-lg h-12 px-4 outline-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  data-testid="goal-cancel-button"
                  className="flex-1 bg-transparent border border-[#94A1B2] text-[#94A1B2] hover:bg-white/5 rounded-lg font-medium py-3 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  data-testid="goal-submit-button"
                  className="flex-1 bg-[#7F5AF0] text-white hover:bg-[#6244C5] rounded-lg font-medium py-3 transition-all shadow-[0_0_15px_rgba(127,90,240,0.3)] hover:shadow-[0_0_25px_rgba(127,90,240,0.5)] button-press"
                >
                  Criar Meta
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && editingGoal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4" onClick={() => setShowUpdateModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#16161A] border border-white/10 rounded-2xl p-8 max-w-md w-full"
            data-testid="goal-update-modal"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Atualizar Progresso</h2>
            <p className="text-[#94A1B2] mb-6">{editingGoal.titulo}</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#94A1B2] mb-2">Valor Atual</label>
                <input
                  type="number"
                  step="0.01"
                  value={updateValue}
                  onChange={(e) => setUpdateValue(e.target.value)}
                  data-testid="goal-update-value-input"
                  className="w-full bg-[#242629] border border-white/10 text-white focus:border-[#7F5AF0] focus:ring-1 focus:ring-[#7F5AF0] rounded-lg h-12 px-4 outline-none"
                  placeholder="0.00"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowUpdateModal(false)}
                  data-testid="goal-update-cancel-button"
                  className="flex-1 bg-transparent border border-[#94A1B2] text-[#94A1B2] hover:bg-white/5 rounded-lg font-medium py-3 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdateProgress}
                  data-testid="goal-update-submit-button"
                  className="flex-1 bg-[#7F5AF0] text-white hover:bg-[#6244C5] rounded-lg font-medium py-3 transition-all shadow-[0_0_15px_rgba(127,90,240,0.3)] hover:shadow-[0_0_25px_rgba(127,90,240,0.5)] button-press"
                >
                  Atualizar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Goals;
