import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, PieChart, Target, Download, Shield, Zap, CheckCircle, Star, Users, BarChart3, Lock, Smartphone, Award, ArrowRight, TrendingDown, Wallet } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const LandingPage = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const features = [
    {
      icon: PieChart,
      title: 'Dashboard Inteligente',
      description: 'Visualize todas as suas finanças em um painel completo com gráficos interativos, estatísticas em tempo real e insights automáticos.',
      color: '#7F5AF0'
    },
    {
      icon: TrendingUp,
      title: 'Análise de Investimentos',
      description: 'Receba dicas personalizadas baseadas no seu perfil financeiro. Saiba onde investir para maximizar seus ganhos.',
      color: '#2CB67D'
    },
    {
      icon: Target,
      title: 'Metas Financeiras',
      description: 'Defina objetivos e acompanhe seu progresso em tempo real. Nossa plataforma te ajuda a alcançar seus sonhos financeiros.',
      color: '#FF8906'
    },
    {
      icon: BarChart3,
      title: 'Relatórios Detalhados',
      description: 'Entenda para onde seu dinheiro está indo com categorias detalhadas: mercado, farmácia, combustível e muito mais.',
      color: '#3DA9FC'
    },
    {
      icon: Download,
      title: 'Exportação Profissional',
      description: 'Exporte suas transações em Excel (.xlsx) para análises avançadas ou compartilhamento com seu contador.',
      color: '#2CB67D'
    },
    {
      icon: Smartphone,
      title: '100% Responsivo',
      description: 'Acesse de qualquer dispositivo. Celular, tablet ou desktop - sua experiência será sempre perfeita.',
      color: '#7F5AF0'
    }
  ];

  const stats = [
    { number: '98%', label: 'Satisfação dos Usuários', icon: Star },
    { number: '+10K', label: 'Usuários Ativos', icon: Users },
    { number: 'R$ 2M+', label: 'Gerenciados Mensalmente', icon: Wallet },
    { number: '4.9/5', label: 'Avaliação Média', icon: Award }
  ];

  const testimonials = [
    {
      name: 'Ana Carolina Silva',
      role: 'Empreendedora',
      image: '👩‍💼',
      text: 'O FinControl Pro mudou completamente a forma como gerencio minhas finanças. Em 3 meses consegui economizar 40% a mais!'
    },
    {
      name: 'Roberto Santos',
      role: 'Desenvolvedor',
      image: '👨‍💻',
      text: 'Interface limpa, rápida e muito intuitiva. Finalmente encontrei um sistema que realmente funciona para mim.'
    },
    {
      name: 'Juliana Mendes',
      role: 'Designer',
      image: '👩‍🎨',
      text: 'As dicas de investimento são incríveis! Já comecei a diversificar minha carteira e os resultados estão aparecendo.'
    }
  ];

  const plans = [
    'Dashboard financeiro completo',
    'Lançamentos ilimitados com categorias detalhadas',
    'Metas personalizadas com acompanhamento',
    'Dicas de investimento profissionais',
    'Exportação para Excel (.xlsx)',
    'Categorização automática inteligente',
    'Gráficos e relatórios visuais',
    'Sincronização em tempo real',
    'Acesso mobile e desktop',
    'Backup automático na nuvem',
    'Suporte prioritário 24/7',
    'Atualizações gratuitas constantes'
  ];

  const faq = [
    {
      q: 'Como funciona o período de teste?',
      a: 'Você tem 7 dias para testar todas as funcionalidades gratuitamente. Não é necessário cartão de crédito para começar.'
    },
    {
      q: 'Posso cancelar a qualquer momento?',
      a: 'Sim! Sem multas ou taxas. Cancele quando quiser diretamente pelo painel de controle.'
    },
    {
      q: 'Meus dados estão seguros?',
      a: 'Absolutamente. Usamos criptografia de ponta a ponta e seus dados nunca são compartilhados com terceiros.'
    },
    {
      q: 'Consigo importar dados de outras plataformas?',
      a: 'Sim! Oferecemos importação de arquivos Excel e CSV para facilitar sua migração.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] overflow-hidden">
      {/* Animated 3D Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          style={{ y: y1 }}
          className="absolute top-20 -left-20 w-96 h-96 bg-[#7F5AF0]/10 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute top-40 -right-20 w-96 h-96 bg-[#2CB67D]/10 rounded-full blur-3xl"
        />
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-[#FF8906]/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 gradient-glow opacity-50" />
        
        {/* 3D Floating Cards Background */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32 bg-gradient-to-br from-[#7F5AF0]/20 to-[#2CB67D]/20 rounded-2xl backdrop-blur-sm border border-white/10"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 10, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block mb-6 px-6 py-2 bg-[#7F5AF0]/10 border border-[#7F5AF0]/30 rounded-full"
            >
              <span className="text-[#7F5AF0] font-semibold">🚀 Mais de 10.000 usuários já confiam no FinControl Pro</span>
            </motion.div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-white mb-8 tracking-tight leading-tight">
              Domine Suas Finanças
              <span className="block bg-gradient-to-r from-[#7F5AF0] via-[#2CB67D] to-[#FF8906] bg-clip-text text-transparent mt-3">
                Como um Profissional
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl lg:text-3xl text-[#94A1B2] mb-12 max-w-4xl mx-auto leading-relaxed">
              O sistema mais completo de gestão financeira pessoal do Brasil. 
              Controle entradas, saídas, metas e investimentos tudo em uma plataforma poderosa e intuitiva.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link
                to="/register"
                data-testid="hero-cta-button"
                className="group bg-[#7F5AF0] text-white hover:bg-[#6244C5] rounded-xl font-bold px-10 py-5 transition-all shadow-[0_0_40px_rgba(127,90,240,0.4)] hover:shadow-[0_0_60px_rgba(127,90,240,0.6)] button-press text-xl flex items-center gap-3"
              >
                Começar Gratuitamente
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
              </Link>
              <Link
                to="/login"
                data-testid="hero-login-button"
                className="bg-transparent border-2 border-[#7F5AF0] text-[#7F5AF0] hover:bg-[#7F5AF0]/10 rounded-xl font-bold px-10 py-5 transition-all text-xl"
              >
                Já sou cliente
              </Link>
            </div>
            
            <div className="flex items-center justify-center gap-3 text-[#2CB67D]">
              <CheckCircle size={24} />
              <p className="text-lg font-medium">
                7 dias grátis • Sem cartão de crédito • Cancele quando quiser
              </p>
            </div>
            
            <motion.p
              style={{ opacity }}
              className="mt-10 text-[#FF8906] font-bold text-2xl"
            >
              Apenas <span className="text-4xl">R$ 37,90</span>/mês após o período de teste
            </motion.p>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-[#7F5AF0] rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-[#7F5AF0] rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 bg-gradient-to-b from-[#0A0A0A] to-[#16161A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6 bg-[#16161A] border border-white/5 rounded-2xl hover:border-[#7F5AF0]/30 transition-all"
                >
                  <Icon className="mx-auto mb-4 text-[#7F5AF0]" size={40} />
                  <h3 className="text-4xl font-bold text-white mb-2">{stat.number}</h3>
                  <p className="text-[#94A1B2]">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Recursos que Transformam
              <span className="block text-[#7F5AF0] mt-2">Sua Vida Financeira</span>
            </h2>
            <p className="text-xl text-[#94A1B2] max-w-3xl mx-auto">
              Ferramentas profissionais que tornam o controle financeiro simples e eficiente
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-[#16161A] border border-white/5 rounded-2xl p-8 hover:border-[#7F5AF0]/30 transition-all hover-lift relative overflow-hidden"
                  data-testid={`feature-card-${index}`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#7F5AF0]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 relative" style={{ backgroundColor: `${feature.color}20` }}>
                    <Icon style={{ color: feature.color }} size={32} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-[#94A1B2] leading-relaxed text-lg">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-24 bg-gradient-to-b from-[#0A0A0A] to-[#16161A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-white mb-4">
              O Que Nossos Clientes Dizem
            </h2>
            <p className="text-xl text-[#94A1B2]">
              Histórias reais de pessoas que mudaram suas vidas financeiras
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-[#16161A] border border-white/5 rounded-2xl p-8 hover:border-[#7F5AF0]/30 transition-all"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-[#FF8906] fill-[#FF8906]" size={20} />
                  ))}
                </div>
                <p className="text-[#FFFFFE] text-lg mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{testimonial.image}</div>
                  <div>
                    <p className="text-white font-bold">{testimonial.name}</p>
                    <p className="text-[#94A1B2] text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative py-24 bg-[#16161A]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#16161A] to-[#0A0A0A] border-2 border-[#7F5AF0]/50 rounded-3xl p-12 text-center relative overflow-hidden"
            data-testid="pricing-card"
          >
            <div className="absolute top-0 right-0 bg-[#2CB67D] text-white px-6 py-2 text-sm font-bold rounded-bl-2xl">
              MAIS POPULAR
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-2">Plano Completo</h2>
            <p className="text-[#94A1B2] mb-8">Acesso total a todas as funcionalidades</p>
            
            <div className="mb-10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-[#94A1B2] line-through text-2xl">R$ 79,90</span>
                <span className="bg-[#EF4565] text-white px-3 py-1 rounded-full text-sm font-bold">-52% OFF</span>
              </div>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-7xl font-extrabold bg-gradient-to-r from-[#7F5AF0] to-[#2CB67D] bg-clip-text text-transparent">R$ 37,90</span>
                <span className="text-3xl text-[#94A1B2]">/mês</span>
              </div>
              <p className="text-[#2CB67D] mt-4 font-semibold text-lg">Primeiro mês GRÁTIS para novos usuários!</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mb-10 text-left max-w-2xl mx-auto">
              {plans.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="text-[#2CB67D] flex-shrink-0 mt-1" size={20} />
                  <span className="text-[#FFFFFE]">{item}</span>
                </div>
              ))}
            </div>
            
            <Link
              to="/register"
              data-testid="pricing-cta-button"
              className="inline-block bg-gradient-to-r from-[#7F5AF0] to-[#2CB67D] text-white hover:shadow-[0_0_50px_rgba(127,90,240,0.6)] rounded-xl font-bold px-12 py-5 transition-all button-press text-xl"
            >
              Começar Agora - 7 Dias Grátis
            </Link>
            
            <p className="mt-6 text-[#94A1B2] text-sm">
              💳 Sem compromisso • ⚡ Ative em 30 segundos • 🔒 100% Seguro
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-white mb-4">Perguntas Frequentes</h2>
            <p className="text-xl text-[#94A1B2]">Tudo que você precisa saber</p>
          </motion.div>

          <div className="space-y-4">
            {faq.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#16161A] border border-white/5 rounded-xl p-6 hover:border-[#7F5AF0]/30 transition-all"
              >
                <h3 className="text-xl font-bold text-white mb-3">{item.q}</h3>
                <p className="text-[#94A1B2] leading-relaxed">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32 bg-gradient-to-b from-[#0A0A0A] to-[#16161A] overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM3RjVBRjAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgOC44NC03LjE2IDE2LTE2IDE2cy0xNi03LjE2LTE2LTE2IDcuMTYtMTYgMTYtMTYgMTYgNy4xNiAxNiAxNnptMCAyNGMwIDguODQtNy4xNiAxNi0xNiAxNnMtMTYtNy4xNi0xNi0xNiA3LjE2LTE2IDE2LTE2IDE2IDcuMTYgMTYgMTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl lg:text-6xl font-bold text-white mb-8">
              Pronto para Transformar
              <span className="block text-[#7F5AF0] mt-2">Sua Vida Financeira?</span>
            </h2>
            <p className="text-2xl text-[#94A1B2] mb-12 max-w-3xl mx-auto">
              Junte-se a mais de 10.000 pessoas que já estão no controle total do seu dinheiro.
              Comece agora mesmo, sem riscos.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/register"
                data-testid="footer-cta-button"
                className="group bg-gradient-to-r from-[#2CB67D] to-[#7F5AF0] text-white hover:shadow-[0_0_50px_rgba(44,182,125,0.6)] rounded-xl font-bold px-12 py-6 transition-all button-press text-xl flex items-center gap-3"
              >
                Começar Gratuitamente Agora
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
              </Link>
            </div>
            <p className="mt-8 text-[#94A1B2] text-lg">
              ⚡ Ativação instantânea • 🎁 7 dias grátis • ❌ Cancele quando quiser
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-xl mb-4">FinControl Pro</h3>
              <p className="text-[#94A1B2]">O melhor sistema de gestão financeira pessoal do Brasil.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Produto</h4>
              <ul className="space-y-2">
                <li><Link to="/register" className="text-[#94A1B2] hover:text-[#7F5AF0] transition-colors">Recursos</Link></li>
                <li><Link to="/register" className="text-[#94A1B2] hover:text-[#7F5AF0] transition-colors">Preços</Link></li>
                <li><Link to="/register" className="text-[#94A1B2] hover:text-[#7F5AF0] transition-colors">Segurança</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-[#94A1B2] hover:text-[#7F5AF0] transition-colors">Sobre</a></li>
                <li><a href="#" className="text-[#94A1B2] hover:text-[#7F5AF0] transition-colors">Blog</a></li>
                <li><a href="#" className="text-[#94A1B2] hover:text-[#7F5AF0] transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-[#94A1B2] hover:text-[#7F5AF0] transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="text-[#94A1B2] hover:text-[#7F5AF0] transition-colors">Tutoriais</a></li>
                <li><a href="#" className="text-[#94A1B2] hover:text-[#7F5AF0] transition-colors">FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 text-center">
            <p className="text-[#72757E]">© 2026 FinControl Pro. Todos os direitos reservados.</p>
            <p className="text-[#72757E] mt-2">CNPJ: 00.000.000/0001-00 • Termos de Uso • Política de Privacidade</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
