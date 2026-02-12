import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/register', { name, email, password });
      login(response.data.token, response.data.user);
      toast.success('Conta criada com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="absolute inset-0 gradient-glow opacity-30" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-md w-full"
      >
        <div className="bg-[#16161A] border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Criar Conta</h1>
            <p className="text-[#94A1B2]">Comece a controlar suas finanças agora</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#94A1B2] mb-2">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-testid="register-name-input"
                className="w-full bg-[#242629] border border-white/10 text-white focus:border-[#7F5AF0] focus:ring-1 focus:ring-[#7F5AF0] rounded-lg h-12 px-4 outline-none transition-all"
                placeholder="Seu nome"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#94A1B2] mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="register-email-input"
                className="w-full bg-[#242629] border border-white/10 text-white focus:border-[#7F5AF0] focus:ring-1 focus:ring-[#7F5AF0] rounded-lg h-12 px-4 outline-none transition-all"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#94A1B2] mb-2">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="register-password-input"
                className="w-full bg-[#242629] border border-white/10 text-white focus:border-[#7F5AF0] focus:ring-1 focus:ring-[#7F5AF0] rounded-lg h-12 px-4 outline-none transition-all"
                placeholder="********"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              data-testid="register-submit-button"
              className="w-full bg-[#7F5AF0] text-white hover:bg-[#6244C5] rounded-lg font-semibold py-3 transition-all shadow-[0_0_20px_rgba(127,90,240,0.3)] hover:shadow-[0_0_30px_rgba(127,90,240,0.5)] disabled:opacity-50 disabled:cursor-not-allowed button-press"
            >
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </form>

          <p className="mt-6 text-center text-[#94A1B2]">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-[#7F5AF0] hover:text-[#6244C5] font-medium" data-testid="register-login-link">
              Fazer login
            </Link>
          </p>

          <Link
            to="/"
            className="block mt-4 text-center text-[#72757E] hover:text-[#94A1B2] transition-colors"
            data-testid="register-back-link"
          >
            Voltar para o início
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
