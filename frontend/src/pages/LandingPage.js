import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, PieChart, Target, Download, Shield, Zap, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const features = [
    {
      icon: PieChart,
      title: 'Dashboard Intuitivo',
      description: 'Visualize suas finanças em tempo real com gráficos e estatísticas detalhadas.'
    },
    {
      icon: TrendingUp,
      title: 'Dicas de Investimento',
      description: 'Receba sugestões personalizadas para fazer seu dinheiro crescer.'
    },
    {
      icon: Target,
      title: 'Metas Financeiras',
      description: 'Defina e acompanhe suas metas de forma visual e motivadora.'
    },
    {
      icon: Download,
      title: 'Exportação Excel',
      description: 'Baixe seus dados financeiros em planilhas para análises avançadas.'
    },
    {
      icon: Shield,
      title: '100% Seguro',
      description: 'Seus dados protegidos com criptografia de ponta a ponta.'
    },
    {
      icon: Zap,
      title: 'Controle Rápido',
      description: 'Adicione lançamentos em segundos e mantenha tudo organizado.'
    }
  ];

  const plans = [
    'Dashboard financeiro completo',
    'Lançamentos ilimitados',
    'Metas personalizadas',
    'Dicas de investimento',
    'Exportação para Excel',
    'Categorização automática',
    'Relatórios visuais',
    'Suporte prioritário'
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-glow opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight">
              Controle Total das Suas
              <span className="block text-[#7F5AF0] mt-2">Finanças Pessoais</span>
            </h1>
            <p className="text-xl sm:text-2xl text-[#94A1B2] mb-12 max-w-3xl mx-auto leading-relaxed">
              Gerencie entradas, saídas, metas e investimentos tudo em um só lugar.
              Profissional, simples e poderoso.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                data-testid="hero-cta-button"
                className="bg-[#7F5AF0] text-white hover:bg-[#6244C5] rounded-lg font-semibold px-8 py-4 transition-all shadow-[0_0_25px_rgba(127,90,240,0.4)] hover:shadow-[0_0_35px_rgba(127,90,240,0.6)] button-press text-lg"
              >
                Começar Agora
              </Link>
              <Link
                to="/login"
                data-testid="hero-login-button"
                className="bg-transparent border-2 border-[#7F5AF0] text-[#7F5AF0] hover:bg-[#7F5AF0]/10 rounded-lg font-semibold px-8 py-4 transition-all text-lg"
              >
                Já tenho conta
              </Link>
            </div>
            <p className="mt-8 text-[#2CB67D] font-medium text-lg">
              Apenas <span className="text-2xl font-bold">R$ 37,90</span>/mês
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">Recursos Poderosos</h2>
            <p className="text-xl text-[#94A1B2]">Tudo que você precisa para dominar suas finanças</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-[#16161A] border border-white/5 rounded-xl p-8 hover:border-[#7F5AF0]/30 transition-all hover-lift"
                  data-testid={`feature-card-${index}`}
                >
                  <div className="w-14 h-14 bg-[#7F5AF0]/10 rounded-lg flex items-center justify-center mb-6">
                    <Icon className="text-[#7F5AF0]" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-[#94A1B2] leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-b from-[#0A0A0A] to-[#16161A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#16161A] border border-[#7F5AF0]/30 rounded-2xl p-12 text-center neon-glow"
            data-testid="pricing-card"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Plano Mensal</h2>
            <div className="mb-8">
              <span className="text-6xl font-extrabold text-[#7F5AF0]">R$ 37,90</span>
              <span className="text-2xl text-[#94A1B2]">/mês</span>
            </div>
            <ul className="space-y-4 mb-10 text-left max-w-md mx-auto">
              {plans.map((item, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <CheckCircle className="text-[#2CB67D] flex-shrink-0" size={20} />
                  <span className="text-[#FFFFFE]">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/register"
              data-testid="pricing-cta-button"
              className="inline-block bg-[#7F5AF0] text-white hover:bg-[#6244C5] rounded-lg font-semibold px-10 py-4 transition-all shadow-[0_0_25px_rgba(127,90,240,0.4)] hover:shadow-[0_0_35px_rgba(127,90,240,0.6)] button-press text-lg"
            >
              Assinar Agora
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#16161A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Pronto para transformar suas finanças?
          </h2>
          <p className="text-xl text-[#94A1B2] mb-10">
            Junte-se a milhares de pessoas que já estão no controle total do seu dinheiro.
          </p>
          <Link
            to="/register"
            data-testid="footer-cta-button"
            className="inline-block bg-[#2CB67D] text-white hover:bg-[#249967] rounded-lg font-semibold px-10 py-4 transition-all shadow-[0_0_25px_rgba(44,182,125,0.4)] hover:shadow-[0_0_35px_rgba(44,182,125,0.6)] button-press text-lg"
          >
            Começar Gratuitamente
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-[#72757E]">
          <p>© 2026 FinControl Pro. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
