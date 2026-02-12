import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Investments = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTips();
  }, []);

  const fetchTips = async () => {
    try {
      const response = await api.get('/investments/tips');
      setTips(response.data);
    } catch (error) {
      toast.error('Erro ao carregar dicas de investimento');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risco) => {
    switch (risco.toLowerCase()) {
      case 'baixo':
        return 'bg-[#2CB67D]/10 text-[#2CB67D]';
      case 'médio':
      case 'médio-alto':
        return 'bg-[#FF8906]/10 text-[#FF8906]';
      case 'alto':
        return 'bg-[#EF4565]/10 text-[#EF4565]';
      default:
        return 'bg-[#7F5AF0]/10 text-[#7F5AF0]';
    }
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
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">Dicas de Investimento</h1>
              <p className="text-[#94A1B2] text-lg">Aprenda sobre diferentes opções para fazer seu dinheiro crescer</p>
            </div>

            {/* Alert */}
            <div className="bg-[#FF8906]/10 border border-[#FF8906]/30 rounded-xl p-6 mb-8" data-testid="investment-warning">
              <div className="flex items-start space-x-3">
                <AlertCircle className="text-[#FF8906] flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="text-[#FF8906] font-bold mb-2">Importante</h3>
                  <p className="text-[#FFFFFE]">As dicas apresentadas são apenas para fins educacionais. Antes de investir, consulte um especialista financeiro e avalie seu perfil de risco.</p>
                </div>
              </div>
            </div>

            {/* Tips Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tips.map((tip, index) => (
                <motion.div
                  key={tip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#16161A] border border-white/5 rounded-xl p-6 hover:border-[#7F5AF0]/30 transition-all hover-lift"
                  data-testid={`investment-tip-${index}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-[#7F5AF0]/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="text-[#7F5AF0]" size={24} />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(tip.risco)}`}>
                      Risco {tip.risco}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{tip.titulo}</h3>
                  <p className="text-[#94A1B2] mb-4 leading-relaxed">{tip.descricao}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-sm text-[#72757E]">{tip.categoria}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Additional Info */}
            <div className="mt-12 bg-gradient-to-br from-[#7F5AF0]/10 to-[#2CB67D]/10 border border-[#7F5AF0]/20 rounded-xl p-8" data-testid="investment-info">
              <h2 className="text-2xl font-bold text-white mb-4">Começando a Investir</h2>
              <div className="grid md:grid-cols-2 gap-6 text-[#FFFFFE]">
                <div>
                  <h3 className="font-bold text-[#7F5AF0] mb-2">1. Crie sua Reserva de Emergência</h3>
                  <p className="text-[#94A1B2]">Tenha de 3 a 6 meses de despesas guardadas antes de investir em ativos de maior risco.</p>
                </div>
                <div>
                  <h3 className="font-bold text-[#2CB67D] mb-2">2. Conheça seu Perfil</h3>
                  <p className="text-[#94A1B2]">Faça um teste de perfil de investidor para entender sua tolerância ao risco.</p>
                </div>
                <div>
                  <h3 className="font-bold text-[#FF8906] mb-2">3. Diversifique</h3>
                  <p className="text-[#94A1B2]">Não coloque todos os ovos na mesma cesta. Distribua seus investimentos.</p>
                </div>
                <div>
                  <h3 className="font-bold text-[#3DA9FC] mb-2">4. Pense no Longo Prazo</h3>
                  <p className="text-[#94A1B2]">Os melhores resultados vem de estratégias consistentes ao longo do tempo.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Investments;
