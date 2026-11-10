import React, { useState, useEffect } from 'react';
import {
  Shield,
  Menu,
  PhoneCall,
  Sparkles,
  Lock,
  ExternalLink,
  BookOpen,
  Bot,
  LayoutDashboard,
  ScanQrCode,
  Gauge,
  Mic,
  GraduationCap,
  LifeBuoy,
  Settings,
} from 'lucide-react';
import { NavSection } from './types';
import { SidebarNav } from './components/SidebarNav';
import { DashboardView } from './components/DashboardView';
import { ChatbotView } from './components/ChatbotView';
import { ScreenshotScannerView } from './components/ScreenshotScannerView';
import { SmartRiskAnalyzerView } from './components/SmartRiskAnalyzerView';
import { VoiceAssistantView } from './components/VoiceAssistantView';
import { EmergencySosView } from './components/EmergencySosView';
import { FamilyProtectionView } from './components/FamilyProtectionView';
import { FraudAlertsView } from './components/FraudAlertsView';
import { SafetyAcademyView } from './components/SafetyAcademyView';
import { RecoveryAssistantView } from './components/RecoveryAssistantView';
import { SettingsView } from './components/SettingsView';
import { EmergencyModal } from './components/EmergencyModal';
import { ScamLibraryModal } from './components/ScamLibraryModal';

export default function App() {
  const [currentSection, setCurrentSection] = useState<NavSection>('dashboard');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [activePromptForAnalyzer, setActivePromptForAnalyzer] = useState<string>('');
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState<boolean>(false);

  // Set dark theme class on document element
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.style.backgroundColor = '#0B1220';
  }, []);

  const handleSelectPrompt = (prompt: string) => {
    setActivePromptForAnalyzer(prompt);
    setCurrentSection('risk_analyzer');
  };

  const getSectionTitle = (section: NavSection) => {
    switch (section) {
      case 'dashboard':
        return 'Cyber Defense Dashboard';
      case 'chatbot':
        return 'UPI Safety Coach – Fraud Awareness Assistant';
      case 'scanner':
        return 'AI Screenshot & QR Code Scanner';
      case 'risk_analyzer':
        return 'Smart Fraud Risk Analyzer';
      case 'voice_assistant':
        return 'AI Voice Assistant (5 Indic Languages)';
      case 'emergency_sos':
        return 'One-Tap Emergency SOS & 1930 Helpline';
      case 'family_protection':
        return 'Family Protection & Senior Citizen Mode';
      case 'fraud_alerts':
        return 'Advanced Fraud Alert & Threat Intelligence Feed';
      case 'safety_academy':
        return 'Cyber Defense Safety Academy & Simulator';
      case 'recovery_assistant':
        return '120-Min Fraud Recovery & FIR Generator';
      case 'settings':
        return 'Sentinel Engine & Guardian Settings';
      default:
        return 'UPI Sentinel AI';
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0B1220] text-[#F4F7FF] font-sans selection:bg-[#00D9FF]/30">
      {/* 1. Sidebar Navigation (Desktop 3D Embossed Panel, Mobile Drawer) */}
      <SidebarNav
        currentSection={currentSection}
        onSelectSection={(sec) => setCurrentSection(sec)}
        onTriggerEmergency={() => setIsEmergencyModalOpen(true)}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* 2. Main Application Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Floating Top Navigation Bar (Embossed Dark Surface, Rounded-26px) */}
        <header className="sticky top-0 z-30 p-3 sm:p-4 transition-all">
          <div className="max-w-7xl mx-auto embossed-nav rounded-[26px] px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
            {/* Left: Mobile hamburger & breadcrumbs */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setIsMobileNavOpen(true)}
                className="lg:hidden p-2 rounded-2xl embossed-btn text-[#F4F7FF] cursor-pointer"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-5 h-5 text-[#00D9FF]" />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-black tracking-wider uppercase text-[#00D9FF] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-ping"></span>
                    UPI SENTINEL AI
                  </span>
                  <span className="hidden sm:inline-block text-[#71829D] font-mono">•</span>
                  <span className="hidden sm:inline-block text-xs text-[#A5B4CC] font-medium">
                    Think Safe. Pay Safe.
                  </span>
                </div>
                <h1 className="text-sm sm:text-base font-extrabold truncate text-[#F4F7FF]">
                  {getSectionTitle(currentSection)}
                </h1>
              </div>
            </div>

            {/* Right: Quick actions & status */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Active Guard Status Indicator */}
              <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full embossed-inset text-[#20C997] text-xs font-mono font-bold border border-[#20C997]/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#20C997] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#20C997]"></span>
                </span>
                <span>AI SHIELD ARMED</span>
              </div>

              {/* Quick Scam Library Button */}
              <button
                onClick={() => setIsLibraryModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-2xl embossed-btn text-[#A5B4CC] hover:text-[#00D9FF] text-xs font-bold cursor-pointer"
                title="Browse Common UPI Scams"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#00D9FF]" />
                <span>Scam Library</span>
              </button>

              {/* Direct Safety Coach Chat Button in Header */}
              <button
                onClick={() => setCurrentSection('chatbot')}
                className={`hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold cursor-pointer transition-all ${
                  currentSection === 'chatbot'
                    ? 'embossed-nav-active text-[#00D9FF] font-black'
                    : 'embossed-btn text-[#A5B4CC] hover:text-[#00D9FF]'
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-[#00D9FF]" />
                <span>Safety Coach</span>
              </button>

              {/* Prominent Emergency 1930 Button */}
              <button
                onClick={() => setIsEmergencyModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl embossed-btn-danger text-xs font-black cursor-pointer"
                title="Emergency Cybercrime Help"
              >
                <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
                <span className="hidden xs:inline">SOS</span>
                <span>1930</span>
              </button>
            </div>
          </div>
        </header>

        {/* Global Mandatory Warning Banner */}
        <div className="mx-3 sm:mx-6 mb-2 embossed-inset text-[#FF5263] px-4 py-2.5 rounded-2xl text-[11px] sm:text-xs font-black flex items-center justify-center gap-2 text-center border border-[#FF5263]/30">
          <Lock className="w-4 h-4 text-[#FF5263] flex-shrink-0 animate-bounce" />
          <span>
            NEVER SHARE YOUR REAL UPI PIN, OTP, PASSWORD OR BANK DETAILS WITH ANYONE OR ANY CHATBOT.
          </span>
        </div>

        {/* 3. Main Dynamic Content View */}
        <main className="flex-1 p-3 sm:p-6 lg:p-7 max-w-7xl w-full mx-auto">
          {currentSection === 'dashboard' && (
            <DashboardView
              onNavigate={(section) => setCurrentSection(section)}
              onSelectPrompt={handleSelectPrompt}
            />
          )}

          {currentSection === 'chatbot' && (
            <ChatbotView
              onNavigate={(section) => setCurrentSection(section)}
              onOpenEmergency={() => setIsEmergencyModalOpen(true)}
            />
          )}

          {currentSection === 'scanner' && (
            <ScreenshotScannerView />
          )}

          {currentSection === 'risk_analyzer' && (
            <SmartRiskAnalyzerView
              initialPrompt={activePromptForAnalyzer}
            />
          )}

          {currentSection === 'voice_assistant' && (
            <VoiceAssistantView />
          )}

          {currentSection === 'emergency_sos' && (
            <EmergencySosView />
          )}

          {currentSection === 'family_protection' && (
            <FamilyProtectionView />
          )}

          {currentSection === 'fraud_alerts' && (
            <FraudAlertsView
              onGoToSos={() => setCurrentSection('emergency_sos')}
              onGoToScanner={() => setCurrentSection('scanner')}
              onGoToAnalyzer={() => setCurrentSection('risk_analyzer')}
            />
          )}

          {currentSection === 'safety_academy' && (
            <SafetyAcademyView />
          )}

          {currentSection === 'recovery_assistant' && (
            <RecoveryAssistantView />
          )}

          {currentSection === 'settings' && (
            <SettingsView />
          )}
        </main>

        {/* 4. Global Dark Fintech Footer */}
        <footer className="mt-auto border-t border-[rgba(130,170,230,0.1)] bg-[#0B1220] py-6 px-4 sm:px-8 text-xs text-[#71829D] pb-24 lg:pb-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#3478F6] to-[#00D9FF] flex items-center justify-center text-[#0B1220] shadow-[0_0_12px_rgba(0,217,255,0.4)]">
                <Shield className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-[#F4F7FF] text-sm">UPI Sentinel AI</span>
              <span className="text-[#71829D] hidden sm:inline">— Think Safe. Pay Safe. • Detect. Prevent. Stay Safe.</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono">
              <span className="text-[#A5B4CC]">
                NPCI, RBI, & I4C Cyber Directives
              </span>
              <span>•</span>
              <a
                href="tel:1930"
                className="font-bold text-[#FF5263] hover:underline"
              >
                Helpline: 1930
              </a>
              <span>•</span>
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#00D9FF] hover:underline inline-flex items-center gap-1"
              >
                <span>cybercrime.gov.in</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-3 text-[10px] text-[#71829D] text-center md:text-left font-mono">
            Disclaimer: UPI Sentinel AI provides educational fraud detection and risk assessments based on submitted data. It is not an official banking institution or a substitute for reporting incidents directly to your bank or the national 1930 cybercrime helpline.
          </div>
        </footer>
      </div>

      {/* Floating Quick Chatbot Button (visible on non-chatbot views) */}
      {currentSection !== 'chatbot' && (
        <button
          onClick={() => setCurrentSection('chatbot')}
          className="hidden sm:flex fixed bottom-6 right-6 z-40 embossed-btn-cyan px-4 py-3 rounded-2xl items-center gap-2.5 transition-all transform hover:-translate-y-1 active:scale-95 group cursor-pointer"
          title="Open UPI Safety Coach Chatbot"
          aria-label="Open UPI Safety Coach Chatbot"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-[#0B1220]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#20C997] rounded-full animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#20C997] rounded-full border border-[#0B1220]"></span>
          </div>
          <span className="text-xs font-black tracking-wide text-[#0B1220]">
            Ask Safety Coach
          </span>
        </button>
      )}

      {/* Floating Embossed Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-3 left-3 right-3 z-40 embossed-nav rounded-[26px] px-2 py-1.5 flex items-center justify-around">
        {[
          { id: 'dashboard' as NavSection, label: 'Home', icon: LayoutDashboard },
          { id: 'chatbot' as NavSection, label: 'Coach', icon: Bot },
          { id: 'scanner' as NavSection, label: 'Scan', icon: ScanQrCode },
          { id: 'risk_analyzer' as NavSection, label: 'Gauge', icon: Gauge },
          { id: 'emergency_sos' as NavSection, label: '1930', icon: PhoneCall, isSos: true },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentSection(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
                item.isSos
                  ? 'text-[#FF5263] font-bold'
                  : isActive
                  ? 'embossed-nav-active text-[#00D9FF] font-bold'
                  : 'text-[#A5B4CC] hover:text-[#F4F7FF]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 font-mono">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* 5. Global Modals */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />

      <ScamLibraryModal
        isOpen={isLibraryModalOpen}
        onClose={() => setIsLibraryModalOpen(false)}
        onSelectPrompt={(prompt) => {
          setIsLibraryModalOpen(false);
          handleSelectPrompt(prompt);
        }}
      />
    </div>
  );
}
