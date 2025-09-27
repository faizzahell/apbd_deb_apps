import { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Sparkles, Zap } from "lucide-react";

interface NotificationProps {
  show: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  title: string;
  message: string;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const Notification = ({ 
  show, 
  onClose, 
  type, 
  title, 
  message, 
  duration = 5000,
  position = 'top-right'
}: NotificationProps) => {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [show, onClose, duration]);

  if (!show) return null;

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  const config = {
    success: {
      bgGradient: 'from-emerald-500/95 to-cyan-600/95',
      glowColor: 'from-emerald-400/20 to-cyan-500/20',
      icon: CheckCircle,
      accentIcon: Sparkles,
      progressGradient: 'from-emerald-300 to-cyan-300',
      accentColors: {
        dot: 'bg-emerald-200',
        accent: 'bg-white/20',
        secondary: 'bg-emerald-300/30'
      }
    },
    error: {
      bgGradient: 'from-red-500/95 to-rose-600/95',
      glowColor: 'from-red-400/20 to-rose-500/20',
      icon: AlertCircle,
      accentIcon: Zap,
      progressGradient: 'from-red-300 to-rose-300',
      accentColors: {
        dot: 'bg-red-200',
        accent: 'bg-white/20',
        secondary: 'bg-red-300/30'
      }
    }
  };

  const currentConfig = config[type];
  const IconComponent = currentConfig.icon;
  const AccentIconComponent = currentConfig.accentIcon;

  return (
    <div className={`fixed ${positionClasses[position]} z-[60] transform transition-all duration-500 ease-out`}>
      <div className="relative max-w-sm">
        <div className={`relative bg-gradient-to-br ${currentConfig.bgGradient} backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl p-4 pr-12 overflow-hidden`}>
          <div className={`absolute -top-2 -left-2 w-6 h-6 ${currentConfig.accentColors.accent} rounded-full animate-ping`}></div>
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${currentConfig.accentColors.secondary} rounded-full animate-pulse delay-500`}></div>
          
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="relative">
                <IconComponent className="w-6 h-6 text-white animate-bounce" />
                <AccentIconComponent className="absolute -top-1 -right-1 w-3 h-3 text-white/80 animate-pulse" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-sm font-bold text-white">
                  {title}
                </h3>
                <div className={`w-2 h-2 ${currentConfig.accentColors.dot} rounded-full animate-pulse`}></div>
              </div>
              <p className="text-xs text-white/90 leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 group"
          >
            <X className="w-4 h-4 text-white group-hover:text-white/80" />
          </button>

          {duration > 0 && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 rounded-b-xl overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${currentConfig.progressGradient} origin-left`}
                style={{
                  animation: `shrink ${duration}ms linear forwards`
                }}
              ></div>
            </div>
          )}
        </div>

        <div className={`absolute inset-0 bg-gradient-to-br ${currentConfig.glowColor} rounded-xl blur-xl -z-10 animate-pulse`}></div>
      </div>
    </div>
  );
};

export default Notification;