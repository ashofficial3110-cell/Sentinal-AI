import React from 'react';
import {
  Shield,
  LayoutDashboard,
  Bot,
  ScanQrCode,
  Gauge,
  Mic,
  PhoneCall,
  Users,
  BellRing,
  GraduationCap,
  LifeBuoy,
  Settings,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { NavSection } from '../types';

interface SidebarNavProps {
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  onTriggerEmergency: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  currentSection,
  onSelectSection,
  onTriggerEmergency,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavSection,
      label: 'Security Dashboard',
      shortLabel: 'Overview',
      icon: LayoutDashboard,
      badge: 'Live',
      badgeColor: 'bg-[#20C997]/15 text-[#20C997] border-[#20C997]/30',
    },
    {
      id: 'chatbot' as NavSection,
      label: 'UPI Safety Coach',
      shortLabel: 'AI Coach',
      icon: Bot,
      badge: 'AI Chat',
      badgeColor: 'bg-[#3478F6]/15 text-[#3478F6] border-[#3478F6]/30',
    },
    {
      id: 'scanner' as NavSection,
      label: 'Screenshot & QR Scanner',
      shortLabel: 'Scanner',
      icon: ScanQrCode,
      badge: 'Vision OCR',
      badgeColor: 'bg-[#00D9FF]/15 text-[#00D9FF] border-[#00D9FF]/30',
    },
    {
      id: 'risk_analyzer' as NavSection,
      label: 'Fraud Risk Analyzer',
      shortLabel: 'Risk Score',
      icon: Gauge,
      badge: '0-100 Gauge',
      badgeColor: 'bg-[#8067FF]/15 text-[#8067FF] border-[#8067FF]/30',
    },
    {
      id: 'voice_assistant' as NavSection,
      label: 'AI Voice Assistant',
      shortLabel: 'Voice AI',
      icon: Mic,
      badge: 'Indic Voice',
      badgeColor: 'bg-[#00D9FF]/15 text-[#00D9FF] border-[#00D9FF]/30',
    },
    {
      id: 'emergency_sos' as NavSection,
      label: 'Emergency SOS 1930',
      shortLabel: 'SOS 1930',
      icon: PhoneCall,
      badge: 'Critical',
      badgeColor: 'bg-[#FF5263]/15 text-[#FF5263] border-[#FF5263]/30 font-bold',
    },
    {
      id: 'family_protection' as NavSection,
      label: 'Family Protection',
      shortLabel: 'Family',
      icon: Users,
      badge: 'Senior Mode',
      badgeColor: 'bg-[#FFB547]/15 text-[#FFB547] border-[#FFB547]/30',
    },
    {
      id: 'fraud_alerts' as NavSection,
      label: 'Scam Alert Center',
      shortLabel: 'Alerts',
      icon: BellRing,
      badge: 'I4C Live',
      badgeColor: 'bg-[#FFB547]/15 text-[#FFB547] border-[#FFB547]/30',
    },
    {
      id: 'safety_academy' as NavSection,
      label: 'Safety Academy',
      shortLabel: 'Academy',
      icon: GraduationCap,
      badge: 'Interactive',
      badgeColor: 'bg-[#20C997]/15 text-[#20C997] border-[#20C997]/30',
    },
    {
      id: 'recovery_assistant' as NavSection,
      label: 'Recovery Assistant',
      shortLabel: 'Recovery',
      icon: LifeBuoy,
      badge: 'FIR Builder',
      badgeColor: 'bg-[#3478F6]/15 text-[#3478F6] border-[#3478F6]/30',
    },
    {
      id: 'settings' as NavSection,
      label: 'Sentinel Settings',
      shortLabel: 'Settings',
      icon: Settings,
      badge: 'Engine',
      badgeColor: 'bg-white/5 text-[#A5B4CC] border-white/10',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container: Floating Dark 3D Embossed Panel */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 flex-shrink-0 flex flex-col bg-[#101A2B] border-r border-[rgba(130,170,230,0.12)] shadow-[14px_0_36px_rgba(0,0,0,0.6)] transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[rgba(130,170,230,0.1)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-[18px] embossed-icon flex items-center justify-center p-1">
              <div className="w-full h-full rounded-[14px] bg-gradient-to-tr from-[#3478F6] via-[#168BFF] to-[#00D9FF] flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-[#0B1220] stroke-[2.5]" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#20C997] rounded-full border-2 border-[#101A2B] flex items-center justify-center pulse-cyan">
                <span className="w-1.5 h-1.5 bg-[#0B1220] rounded-full"></span>
              </div>
            </div>

            <div>
              <h1 className="text-base font-black tracking-wider text-[#F4F7FF] flex items-center gap-1.5">
                UPI SENTINEL <span className="text-[#00D9FF] text-xs font-mono">AI</span>
              </h1>
              <p className="text-[10px] font-bold tracking-wider text-[#3478F6] uppercase">
                Think Safe. Pay Safe.
              </p>
              <p className="text-[9px] text-[#71829D] font-mono">
                Detect. Prevent. Stay Safe.
              </p>
            </div>
          </div>
        </div>

        {/* Emergency SOS 3D Embossed Banner */}
        <div className="p-3.5 mx-3 mt-3 rounded-[22px] embossed-inset border border-[#FF5263]/25">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF5263] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FF5263] animate-ping"></span>
              EMERGENCY SOS
            </span>
            <span className="text-[9px] font-mono font-bold text-[#FF5263] bg-[#FF5263]/10 px-2 py-0.5 rounded-full border border-[#FF5263]/20">
              TOLL-FREE 1930
            </span>
          </div>
          <p className="text-xs font-bold text-[#F4F7FF] mt-1">Defrauded or Suspicious Call?</p>
          <button
            onClick={() => {
              onTriggerEmergency();
              onCloseMobile();
            }}
            className="mt-2.5 w-full py-2 px-3 embossed-btn-danger rounded-[14px] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
            <span>Call 1930 / Freeze Account</span>
          </button>
        </div>

        {/* Navigation Items List with Dark 3D Embossed States */}
        <nav className="flex-1 px-3 py-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#71829D]">
            SECURITY MODULES
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectSection(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-[18px] text-xs font-semibold transition-all duration-200 text-left cursor-pointer group ${
                  isActive
                    ? 'embossed-nav-active font-bold'
                    : 'text-[#A5B4CC] hover:text-[#F4F7FF] hover:bg-[#172338]/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-[12px] flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${
                      isActive
                        ? 'embossed-icon-inset text-[#00D9FF]'
                        : 'embossed-icon text-[#71829D] group-hover:text-[#00D9FF]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full border ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isActive ? 'text-[#00D9FF] translate-x-0.5' : 'text-[#71829D] opacity-40'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer & Embossed Golden Rule Card */}
        <div className="p-3 border-t border-[rgba(130,170,230,0.1)] space-y-2">
          <div className="p-3 rounded-[18px] embossed-inset-soft border border-white/5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#F4F7FF]">
              <Sparkles className="w-3.5 h-3.5 text-[#00D9FF]" />
              <span>Sentinel Golden Rule</span>
            </div>
            <p className="text-[10px] text-[#A5B4CC] mt-1 leading-snug font-medium">
              UPI PIN is <strong className="text-[#00D9FF]">only for debiting</strong>. Receiving money never requires a PIN or scanning a QR.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
