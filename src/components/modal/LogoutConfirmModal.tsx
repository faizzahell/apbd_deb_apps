import { X, LogOut } from "lucide-react";

interface LogoutConfirmModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutConfirmModal = ({ onClose, onConfirm }: LogoutConfirmModalProps) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-md transform transition-all duration-300 ease-out">
        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 group backdrop-blur-sm"
          >
            <X className="w-5 h-5 text-white group-hover:text-gray-200" />
          </button>

          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <LogOut className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Keluar Akun?</h2>
          <p className="text-white/80 text-sm leading-relaxed">
            Apakah kamu yakin ingin keluar dari akun ini?
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg border border-white/20 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-medium rounded-lg shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400/50"
            >
              Ya, Keluar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
