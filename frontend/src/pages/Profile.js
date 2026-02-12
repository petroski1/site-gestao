import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { User, Mail, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Profile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');

  const fetchProfile = useCallback(async () => {
    try {
      const response = await api.get('/profile');
      setProfile(response.data);
      setName(response.data.name);
    } catch (error) {
      toast.error('Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put('/profile', { name });
      toast.success('Perfil atualizado com sucesso!');
      setEditing(false);
      fetchProfile();
    } catch (error) {
      toast.error('Erro ao atualizar perfil');
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-white mb-8">Meu Perfil</h1>

            <div className="bg-[#16161A] border border-white/5 rounded-xl p-8" data-testid="profile-card">
              <div className="flex items-center space-x-6 mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-[#7F5AF0] to-[#2CB67D] rounded-full flex items-center justify-center">
                  <User className="text-white" size={48} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{profile?.name}</h2>
                  <p className="text-[#94A1B2]">{profile?.email}</p>
                </div>
              </div>

              {editing ? (
                <form onSubmit={handleUpdate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#94A1B2] mb-2">Nome</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      data-testid="profile-name-input"
                      className="w-full bg-[#242629] border border-white/10 text-white focus:border-[#7F5AF0] focus:ring-1 focus:ring-[#7F5AF0] rounded-lg h-12 px-4 outline-none"
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setName(profile?.name);
                      }}
                      data-testid="profile-cancel-button"
                      className="flex-1 bg-transparent border border-[#94A1B2] text-[#94A1B2] hover:bg-white/5 rounded-lg font-medium py-3 transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      data-testid="profile-save-button"
                      className="flex-1 bg-[#7F5AF0] text-white hover:bg-[#6244C5] rounded-lg font-medium py-3 transition-all shadow-[0_0_15px_rgba(127,90,240,0.3)] hover:shadow-[0_0_25px_rgba(127,90,240,0.5)] button-press"
                    >
                      Salvar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-[#242629] rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <User className="text-[#7F5AF0]" size={20} />
                        <span className="text-[#94A1B2] text-sm">Nome</span>
                      </div>
                      <p className="text-white font-medium">{profile?.name}</p>
                    </div>

                    <div className="bg-[#242629] rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <Mail className="text-[#2CB67D]" size={20} />
                        <span className="text-[#94A1B2] text-sm">Email</span>
                      </div>
                      <p className="text-white font-medium">{profile?.email}</p>
                    </div>

                    <div className="bg-[#242629] rounded-lg p-4 md:col-span-2">
                      <div className="flex items-center space-x-3 mb-2">
                        <Calendar className="text-[#FF8906]" size={20} />
                        <span className="text-[#94A1B2] text-sm">Membro desde</span>
                      </div>
                      <p className="text-white font-medium">
                        {profile?.created_at && new Date(profile.created_at).toLocaleDateString('pt-BR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setEditing(true)}
                    data-testid="profile-edit-button"
                    className="w-full bg-[#7F5AF0] text-white hover:bg-[#6244C5] rounded-lg font-medium py-3 transition-all shadow-[0_0_15px_rgba(127,90,240,0.3)] hover:shadow-[0_0_25px_rgba(127,90,240,0.5)] button-press"
                  >
                    Editar Perfil
                  </button>
                </div>
              )}
            </div>

            {/* Subscription Info */}
            <div className="mt-6 bg-gradient-to-br from-[#7F5AF0]/10 to-[#2CB67D]/10 border border-[#7F5AF0]/20 rounded-xl p-6" data-testid="subscription-info">
              <h3 className="text-xl font-bold text-white mb-3">Assinatura Ativa</h3>
              <p className="text-[#94A1B2] mb-4">Você tem acesso completo ao FinControl Pro</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#72757E] text-sm">Valor Mensal</p>
                  <p className="text-2xl font-bold text-[#2CB67D] jetbrains-mono">R$ 37,90</p>
                </div>
                <div className="text-right">
                  <p className="text-[#72757E] text-sm">Status</p>
                  <span className="inline-block px-4 py-1 rounded-full bg-[#2CB67D]/10 text-[#2CB67D] font-semibold">Ativo</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
