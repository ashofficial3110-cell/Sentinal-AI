import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  UserPlus,
  Trash2,
  Send,
  Sparkles,
  X,
} from 'lucide-react';
import { FamilyMember, ThemeMode } from '../types';
import { SAMPLE_FAMILY_MEMBERS } from '../data/scenarios';

interface FamilyProtectionViewProps {
  theme?: ThemeMode;
}

export const FamilyProtectionView: React.FC<FamilyProtectionViewProps> = () => {
  const [members, setMembers] = useState<FamilyMember[]>(SAMPLE_FAMILY_MEMBERS);
  const [seniorModeActive, setSeniorModeActive] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newNickname, setNewNickname] = useState<string>('');
  const [newRelationship, setNewRelationship] = useState<FamilyMember['relationship']>('Parent');
  const [newPhone, setNewPhone] = useState<string>('');
  const [newIsSenior, setNewIsSenior] = useState<boolean>(true);
  const [alertSentToast, setAlertSentToast] = useState<string | null>(null);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newMember: FamilyMember = {
      id: `fam-${Date.now()}`,
      name: newName.trim(),
      nickname: newNickname.trim() || undefined,
      relationship: newRelationship,
      phone: newPhone.trim() || undefined,
      isSenior: newIsSenior,
      protectionActive: true,
      lastSimulatedQuizScore: 100,
      unresolvedAlerts: 0,
    };

    setMembers([...members, newMember]);
    setNewName('');
    setNewNickname('');
    setNewPhone('');
    setShowAddModal(false);
  };

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  const handleBroadcastSafetyAlert = (memberName: string) => {
    setAlertSentToast(`Safety Advisory pushed to ${memberName}!`);
    setTimeout(() => setAlertSentToast(null), 3000);
  };

  return (
    <div className={`space-y-6 max-w-5xl mx-auto pb-12 ${seniorModeActive ? 'text-base font-semibold' : ''}`}>
      {/* 1. Header Banner with 3D Embossed Style */}
      <div className="embossed-card p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFB547]/15 text-[#FFB547] border border-[#FFB547]/30 text-xs font-mono font-bold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" />
              <span>Multi-Generational Guardian System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#F4F7FF] tracking-tight">
              Family Protection Mode
            </h1>
            <p className="text-xs sm:text-sm text-[#A5B4CC] max-w-2xl font-medium leading-relaxed">
              Safeguard parents, elderly relatives, and student children from high-pressure digital arrest threats, fake KYC SMS, and QR marketplace traps.
            </p>
          </div>

          {/* Senior Citizen Safety Mode Toggle with Embossed Depth */}
          <div className="p-4 rounded-2xl border border-white/5 embossed-inset flex items-center justify-between gap-4 flex-shrink-0">
            <div>
              <span className="text-xs font-bold text-[#F4F7FF] block font-mono">
                Senior Citizen Safety Mode
              </span>
              <span className="text-[11px] text-[#71829D]">
                Enlarged text & high-contrast guidance
              </span>
            </div>

            <button
              onClick={() => setSeniorModeActive(!seniorModeActive)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                seniorModeActive ? 'bg-[#3478F6]' : 'bg-[#22334D]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  seniorModeActive ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {alertSentToast && (
        <div className="p-4 bg-[#20C997]/15 border border-[#20C997]/30 text-[#20C997] rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <ShieldCheck className="w-4 h-4 text-[#20C997]" />
          <span>{alertSentToast}</span>
        </div>
      )}

      {/* 2. Protected Family Members List (Embossed Panel, 24px Cards) */}
      <div className="embossed-card p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
          <div>
            <h3 className="text-base font-extrabold text-[#F4F7FF]">
              Protected Family Circle ({members.length})
            </h3>
            <p className="text-xs text-[#A5B4CC]">
              Family members receiving simplified scam notifications and emergency support
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-all embossed-btn-primary"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Family Member</span>
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="rounded-2xl p-5 border border-white/5 embossed-card hover:embossed-card-hover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full embossed-icon text-[#00D9FF] flex items-center justify-center font-black text-sm">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-[#F4F7FF]">
                        {member.name} {member.nickname && <span className="text-xs text-[#A5B4CC]">({member.nickname})</span>}
                      </h4>
                      <span className="text-[11px] font-mono text-[#71829D]">
                        {member.relationship}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="text-[#71829D] hover:text-[#FF5263] p-1 cursor-pointer transition-colors"
                    title="Remove member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3.5 space-y-1.5 text-xs">
                  {member.isSenior && (
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#FFB547]/15 text-[#FFB547] border border-[#FFB547]/30">
                      Senior Citizen Mode Active
                    </span>
                  )}
                  {member.phone && (
                    <div className="text-[11px] font-mono text-[#A5B4CC]">
                      Phone: {member.phone}
                    </div>
                  )}
                  <div className="text-[11px] text-[#20C997] font-mono font-bold flex items-center gap-1.5 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Real-time Sentinel Shield Active</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5">
                <button
                  onClick={() => handleBroadcastSafetyAlert(member.nickname || member.name)}
                  className="w-full py-2 px-3 text-[#00D9FF] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 embossed-btn cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Scam Safety Alert</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Plain Language Safety Rulebook */}
      <div className="embossed-card p-6 sm:p-7 space-y-4">
        <h3 className="text-sm sm:text-base font-extrabold text-[#F4F7FF] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#00D9FF]" />
          Senior & Family Safety Rulebook (Plain Language)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl embossed-inset-soft">
            <span className="font-extrabold text-[#FFB547] block mb-1 font-mono">
              1. No "Digital Arrest" Exists in Law
            </span>
            <p className="text-[#A5B4CC] leading-relaxed text-[11px] font-medium">
              If someone on video call wears police uniforms and claims your Aadhaar is involved in crime, disconnect immediately. Real police never interrogate citizens on WhatsApp or Skype.
            </p>
          </div>

          <div className="p-4 rounded-2xl embossed-inset-soft">
            <span className="font-extrabold text-[#00D9FF] block mb-1 font-mono">
              2. QR Code is Never for Receiving
            </span>
            <p className="text-[#A5B4CC] leading-relaxed text-[11px] font-medium">
              If a buyer on OLX or Facebook sends a QR code claiming "Scan to collect money", decline immediately. Entering your UPI PIN will transfer your savings to the fraudster.
            </p>
          </div>

          <div className="p-4 rounded-2xl embossed-inset-soft">
            <span className="font-extrabold text-[#FF5263] block mb-1 font-mono">
              3. Never Install "AnyDesk" or APKs
            </span>
            <p className="text-[#A5B4CC] leading-relaxed text-[11px] font-medium">
              Never install remote desktop apps or files ending with ".apk" sent on WhatsApp. They read your bank SMS OTPs without your knowledge.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Add Family Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative w-full max-w-md embossed-card p-6 sm:p-7 text-[#F4F7FF] animate-in fade-in zoom-in-95 border border-[rgba(130,170,230,0.2)]">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h3 className="text-base font-black text-[#F4F7FF] flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#00D9FF]" />
                Add Family Member
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-[#71829D] hover:text-[#F4F7FF] rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4 mt-4">
              <div>
                <label className="text-[11px] font-mono font-bold text-[#A5B4CC] uppercase tracking-wide block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Ramesh Sharma"
                  className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm text-[#F4F7FF] placeholder:text-[#71829D] outline-none font-medium embossed-inset focus:border-[#00D9FF]/40"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono font-bold text-[#A5B4CC] uppercase tracking-wide block mb-1">
                  Nickname / Role
                </label>
                <input
                  type="text"
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                  placeholder="e.g. Dad, Mom, Aarav"
                  className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm text-[#F4F7FF] placeholder:text-[#71829D] outline-none font-medium embossed-inset focus:border-[#00D9FF]/40"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono font-bold text-[#A5B4CC] uppercase tracking-wide block mb-1">
                  Relationship
                </label>
                <select
                  value={newRelationship}
                  onChange={(e) => setNewRelationship(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm text-[#F4F7FF] outline-none font-medium embossed-inset"
                >
                  <option value="Parent" className="bg-[#101a2b]">Parent</option>
                  <option value="Grandparent" className="bg-[#101a2b]">Grandparent</option>
                  <option value="Child / Student" className="bg-[#101a2b]">Child / Student</option>
                  <option value="Spouse" className="bg-[#101a2b]">Spouse</option>
                  <option value="Sibling" className="bg-[#101a2b]">Sibling</option>
                  <option value="Relative" className="bg-[#101a2b]">Relative</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono font-bold text-[#A5B4CC] uppercase tracking-wide block mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+91 98xxx xxxxx"
                  className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm text-[#F4F7FF] placeholder:text-[#71829D] outline-none font-medium embossed-inset focus:border-[#00D9FF]/40"
                />
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="seniorCheck"
                  checked={newIsSenior}
                  onChange={(e) => setNewIsSenior(e.target.checked)}
                  className="rounded text-[#00D9FF] cursor-pointer"
                />
                <label htmlFor="seniorCheck" className="text-xs font-bold text-[#F4F7FF] cursor-pointer">
                  Activate Senior Citizen Simplified Guidance for this member
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-[#A5B4CC] hover:text-[#F4F7FF] rounded-xl text-xs font-bold cursor-pointer embossed-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white rounded-xl text-xs font-bold cursor-pointer embossed-btn-primary"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
