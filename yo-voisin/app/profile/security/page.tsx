'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Shield, 
  AlertTriangle,
  Trash2,
  X,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ToastContainer } from '@/components/ui/Toast';

export default function SecuritePage() {
  const router = useRouter();
  const { user, profile, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'warning' }>>([]);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [emailForm, setEmailForm] = useState({
    newEmail: '',
    password: ''
  });

  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (!passwordForm.currentPassword) {
      showToast('Veuillez entrer votre mot de passe actuel', 'warning');
      return;
    }

    if (!passwordForm.newPassword) {
      showToast('Veuillez entrer un nouveau mot de passe', 'warning');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      showToast('Le mot de passe doit contenir au moins 8 caractères', 'warning');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('Les mots de passe ne correspondent pas', 'warning');
      return;
    }

    if (passwordForm.newPassword === passwordForm.currentPassword) {
      showToast('Le nouveau mot de passe doit être différent de l\'ancien', 'warning');
      return;
    }

    setLoading(true);

    try {
      // Vérifier le mot de passe actuel en tentant de se reconnecter
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: passwordForm.currentPassword
      });

      if (signInError) {
        throw new Error('Mot de passe actuel incorrect');
      }

      // Mettre à jour le mot de passe
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (updateError) throw updateError;

      showToast('Mot de passe modifié avec succès !', 'success');
      
      // Réinitialiser le formulaire
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err: any) {
      console.error('Erreur changement mot de passe:', err);
      showToast(err.message || 'Erreur lors de la modification du mot de passe', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!emailForm.newEmail) {
      showToast('Veuillez entrer une nouvelle adresse email', 'warning');
      return;
    }

    if (!emailForm.newEmail.includes('@') || !emailForm.newEmail.includes('.')) {
      showToast('Adresse email invalide', 'warning');
      return;
    }

    if (emailForm.newEmail === user?.email) {
      showToast('La nouvelle adresse doit être différente de l\'actuelle', 'warning');
      return;
    }

    if (!emailForm.password) {
      showToast('Veuillez entrer votre mot de passe pour confirmer', 'warning');
      return;
    }

    setLoading(true);

    try {
      // Vérifier le mot de passe
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: emailForm.password
      });

      if (signInError) {
        throw new Error('Mot de passe incorrect');
      }

      // Mettre à jour l'email
      const { error: updateError } = await supabase.auth.updateUser({
        email: emailForm.newEmail
      });

      if (updateError) throw updateError;

      showToast('Un email de confirmation a été envoyé à votre nouvelle adresse', 'success');
      
      // Réinitialiser le formulaire
      setEmailForm({
        newEmail: '',
        password: ''
      });
    } catch (err: any) {
      console.error('Erreur changement email:', err);
      showToast(err.message || 'Erreur lors de la modification de l\'email', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'Oui, supprimez-moi') {
      showToast('Veuillez saisir la phrase exacte pour confirmer', 'warning');
      return;
    }

    setLoading(true);

    try {
      // Appeler la fonction RPC pour supprimer le compte
      // Cette fonction supprime le profil ET l'utilisateur Auth en cascade
      const { error } = await supabase.rpc('delete_user');
      
      if (error) {
        console.error('Erreur suppression compte:', error);
        throw new Error(error.message || 'Impossible de supprimer le compte');
      }

      showToast('Compte supprimé avec succès. Au revoir !', 'success');
      
      // Attendre un peu pour afficher le toast, puis déconnecter et rediriger
      setTimeout(async () => {
        // Déconnexion locale
        await signOut();
        // Redirection vers la page d'accueil
        window.location.href = '/';
      }, 2000);

    } catch (err: any) {
      console.error('Erreur suppression compte:', err);
      showToast(err.message || 'Erreur lors de la suppression du compte', 'error');
      setShowDeleteModal(false);
      setDeleteConfirmation('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      <Navbar
        isConnected={!!profile}
        user={profile ? {
          first_name: profile.first_name,
          last_name: profile.last_name,
          avatar_url: profile.avatar_url
        } : undefined}
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🔐 Identifiants et sécurité
          </h1>
          <p className="text-gray-600">
            Gérez votre mot de passe, votre adresse email et la sécurité de votre compte
          </p>
        </div>

        {/* Section Mot de passe */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <Lock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Mot de passe</h2>
              <p className="text-sm text-gray-600">Modifiez votre mot de passe</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            {/* Mot de passe actuel */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Mot de passe actuel *
              </label>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                  placeholder="Entrez votre mot de passe actuel"
                  required
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Nouveau mot de passe */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Nouveau mot de passe *
              </label>
              <div className="relative">
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  placeholder="Entrez votre nouveau mot de passe"
                  required
                  minLength={8}
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Minimum 8 caractères
              </p>
            </div>

            {/* Confirmer mot de passe */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Confirmer le nouveau mot de passe *
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  placeholder="Confirmez votre nouveau mot de passe"
                  required
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Modification en cours...
                </span>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Modifier le mot de passe
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Section Email */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Adresse email</h2>
              <p className="text-sm text-gray-600">
                Email actuel : <strong>{user?.email}</strong>
              </p>
            </div>
          </div>

          <form onSubmit={handleEmailChange} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Nouvelle adresse email *
              </label>
              <Input
                type="email"
                value={emailForm.newEmail}
                onChange={(e) => setEmailForm({...emailForm, newEmail: e.target.value})}
                placeholder="exemple@email.com"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Un email de confirmation sera envoyé à cette adresse
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Mot de passe de confirmation *
              </label>
              <Input
                type="password"
                value={emailForm.password}
                onChange={(e) => setEmailForm({...emailForm, password: e.target.value})}
                placeholder="Entrez votre mot de passe pour confirmer"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Modification en cours...
                </span>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Modifier l'adresse email
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Section Suppression de compte */}
        <Card className="p-6 border-2 border-red-200 bg-red-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-red-900">Zone dangereuse</h2>
              <p className="text-sm text-red-700">
                Actions irréversibles sur votre compte
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 mb-4">
            <h3 className="font-bold text-gray-900 mb-2">Supprimer mon compte</h3>
            <p className="text-sm text-gray-600 mb-4">
              Cette action supprimera définitivement votre compte, toutes vos données, 
              vos demandes, vos offres et votre historique. Cette action est irréversible.
            </p>
            <Button
              onClick={() => setShowDeleteModal(true)}
              variant="outline"
              className="border-red-500 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer mon compte
            </Button>
          </div>
        </Card>
      </div>

      {/* Modal de confirmation de suppression */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => !loading && setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Supprimer le compte ?
                  </h2>
                </div>
                <button
                  onClick={() => !loading && setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                  <p className="text-sm text-red-800 font-semibold mb-2">
                    ⚠️ Attention : Cette action est irréversible !
                  </p>
                  <ul className="text-sm text-red-700 space-y-1 ml-4">
                    <li>• Toutes vos données seront supprimées</li>
                    <li>• Vos demandes et offres seront perdues</li>
                    <li>• Votre historique sera effacé</li>
                    <li>• Vous ne pourrez pas récupérer votre compte</li>
                  </ul>
                </div>

                <p className="text-sm text-gray-700 mb-4">
                  Pour confirmer la suppression de votre compte, veuillez saisir la phrase suivante :
                </p>
                
                <div className="bg-gray-100 rounded-lg p-3 mb-4 text-center">
                  <code className="text-red-600 font-bold">Oui, supprimez-moi</code>
                </div>

                <Input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="Saisissez la phrase exacte ici"
                  disabled={loading}
                  className="mb-2"
                />

                {deleteConfirmation && deleteConfirmation !== 'Oui, supprimez-moi' && (
                  <p className="text-xs text-red-600">
                    ⚠️ La phrase ne correspond pas
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowDeleteModal(false)}
                  variant="outline"
                  className="flex-1"
                  disabled={loading}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleDeleteAccount}
                  disabled={loading || deleteConfirmation !== 'Oui, supprimez-moi'}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Suppression...
                    </span>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer définitivement
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
