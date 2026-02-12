import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, transactionsRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/transactions')
      ]);
      setStats(statsRes.data);
      setTransactions(transactionsRes.data);
    } catch (error) {
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    const monthlyData = {};
    transactions.forEach(t => {
      const month = t.data.substring(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = { month, entradas: 0, saidas: 0 };
      }
      if (t.tipo === 'entrada') {
        monthlyData[month].entradas += t.valor;
      } else {
        monthlyData[month].saidas += t.valor;
      }
    });
    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#16161A] border border-[#2CB67D] rounded-lg p-3 shadow-xl">
          <p className="text-white font-medium mb-1">{payload[0].payload.month}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: R$ {entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
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
            <h1 className="text-4xl font-bold text-white mb-8">Dashboard Financeiro</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-[#16161A] border border-white/5 rounded-xl p-6 hover:border-[#2CB67D]/30 transition-all" data-testid="stat-card-entradas">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-[#2CB67D]/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-[#2CB67D]" size={24} />
                  </div>
                </div>
                <h3 className="text-[#94A1B2] text-sm font-medium mb-1">Total Entradas</h3>
                <p className="text-3xl font-bold text-white jetbrains-mono">R$ {stats?.total_entradas.toFixed(2)}</p>
              </div>

              <div className="bg-[#16161A] border border-white/5 rounded-xl p-6 hover:border-[#EF4565]/30 transition-all" data-testid="stat-card-saidas">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-[#EF4565]/10 rounded-lg flex items-center justify-center">
                    <TrendingDown className="text-[#EF4565]" size={24} />
                  </div>
                </div>
                <h3 className="text-[#94A1B2] text-sm font-medium mb-1">Total Saídas</h3>
                <p className="text-3xl font-bold text-white jetbrains-mono">R$ {stats?.total_saidas.toFixed(2)}</p>
              </div>

              <div className="bg-[#16161A] border border-white/5 rounded-xl p-6 hover:border-[#7F5AF0]/30 transition-all" data-testid="stat-card-saldo">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-[#7F5AF0]/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="text-[#7F5AF0]" size={24} />
                  </div>
                </div>
                <h3 className="text-[#94A1B2] text-sm font-medium mb-1">Saldo Atual</h3>
                <p className={`text-3xl font-bold jetbrains-mono ${
                  stats?.saldo >= 0 ? 'text-[#2CB67D]' : 'text-[#EF4565]'
                }`}>
                  R$ {stats?.saldo.toFixed(2)}
                </p>
              </div>

              <div className="bg-[#16161A] border border-white/5 rounded-xl p-6 hover:border-[#FF8906]/30 transition-all" data-testid="stat-card-transacoes">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-[#FF8906]/10 rounded-lg flex items-center justify-center">
                    <Activity className="text-[#FF8906]" size={24} />
                  </div>
                </div>
                <h3 className="text-[#94A1B2] text-sm font-medium mb-1">Transações</h3>
                <p className="text-3xl font-bold text-white jetbrains-mono">{stats?.transacoes_recentes}</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-[#16161A] border border-white/5 rounded-xl p-6" data-testid="chart-area">
                <h3 className="text-xl font-bold text-white mb-6">Evolução Mensal</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={getChartData()}>
                    <defs>
                      <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2CB67D" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2CB67D" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorSaidas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4565" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#EF4565" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#94A1B2" strokeOpacity={0.1} />
                    <XAxis dataKey="month" stroke="#94A1B2" />
                    <YAxis stroke="#94A1B2" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="entradas" name="Entradas" stroke="#2CB67D" fillOpacity={1} fill="url(#colorEntradas)" />
                    <Area type="monotone" dataKey="saidas" name="Saídas" stroke="#EF4565" fillOpacity={1} fill="url(#colorSaidas)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-[#16161A] border border-white/5 rounded-xl p-6" data-testid="chart-bar">
                <h3 className="text-xl font-bold text-white mb-6">Comparação Mensal</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getChartData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#94A1B2" strokeOpacity={0.1} />
                    <XAxis dataKey="month" stroke="#94A1B2" />
                    <YAxis stroke="#94A1B2" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="entradas" name="Entradas" fill="#2CB67D" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="saidas" name="Saídas" fill="#EF4565" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-[#16161A] border border-white/5 rounded-xl p-6" data-testid="recent-transactions">
              <h3 className="text-xl font-bold text-white mb-6">Transações Recentes</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left py-3 px-4 text-[#94A1B2] font-medium">Data</th>
                      <th className="text-left py-3 px-4 text-[#94A1B2] font-medium">Descrição</th>
                      <th className="text-left py-3 px-4 text-[#94A1B2] font-medium">Categoria</th>
                      <th className="text-right py-3 px-4 text-[#94A1B2] font-medium">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.slice(0, 5).map((transaction, index) => (
                      <tr key={transaction.id} className="border-b border-white/5 hover:bg-white/5 transition-colors" data-testid={`transaction-row-${index}`}>
                        <td className="py-3 px-4 text-white">{new Date(transaction.data).toLocaleDateString('pt-BR')}</td>
                        <td className="py-3 px-4 text-white">{transaction.descricao}</td>
                        <td className="py-3 px-4">
                          <span className="inline-block px-3 py-1 rounded-full text-sm bg-[#7F5AF0]/10 text-[#7F5AF0]">
                            {transaction.categoria}
                          </span>
                        </td>
                        <td className={`py-3 px-4 text-right font-semibold jetbrains-mono ${
                          transaction.tipo === 'entrada' ? 'text-[#2CB67D]' : 'text-[#EF4565]'
                        }`}>
                          {transaction.tipo === 'entrada' ? '+' : '-'} R$ {transaction.valor.toFixed(2)}
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
    </div>
  );
};

export default Dashboard;
