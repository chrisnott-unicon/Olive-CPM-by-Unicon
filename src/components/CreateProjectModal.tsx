import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Loader2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export default function CreateProjectModal({ isOpen, onClose, userData }: { isOpen: boolean, onClose: () => void, userData?: any }) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'core' | 'client' | 'professionals' | 'contractors' | 'ecosystem'>('core');
  const [formData, setFormData] = useState({
    name: '',
    contractType: 'JBCC',
    status: 'Pre-construction',
    plannedStartDate: '',
    plannedDuration: '',
    location: '',
    clientName: '',
    clientAddress: '',
    clientEmail: '',
    clientPhone: '',
    clientDigitalAgreement: false,
    projectManager: '',
    paEmail: '',
    paPhone: '',
    paDigitalAgreement: false,
    architect: '',
    quantitySurveyor: '',
    structuralEngineer: '',
    civilEngineer: '',
    mechanicalEngineer: '',
    electricalEngineer: '',
    fireEngineer: '',
    healthSafety: '',
    principalContractor: '',
    nsContractors: '',
    tradeContractors: '',
    lat: '',
    lng: '',
    initialContractValue: '',
    initialActiveStaff: '',
    recordedIncidents: '',
    initialProgress: '',
    pendingVariations: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const retention = formData.contractType === 'JBCC' ? 0.10 : 0.05;
      await addDoc(collection(db, 'projects'), {
        name: formData.name,
        orgId: userData?.orgId || null,
        contractType: formData.contractType,
        status: formData.status,
        plannedStartDate: formData.plannedStartDate,
        plannedDuration: formData.plannedDuration ? Number(formData.plannedDuration) : 0,
        location: formData.location,
        coordinates: { lat: Number(formData.lat) || 0, lng: Number(formData.lng) || 0 },
        clientDetails: {
          name: formData.clientName,
          address: formData.clientAddress,
          email: formData.clientEmail,
          phone: formData.clientPhone,
          digitalAgreement: formData.clientDigitalAgreement
        },
        professionals: {
          projectManager: formData.projectManager,
          paEmail: formData.paEmail,
          paPhone: formData.paPhone,
          paDigitalAgreement: formData.paDigitalAgreement,
          architect: formData.architect,
          quantitySurveyor: formData.quantitySurveyor,
          structuralEngineer: formData.structuralEngineer,
          civilEngineer: formData.civilEngineer,
          mechanicalEngineer: formData.mechanicalEngineer,
          electricalEngineer: formData.electricalEngineer,
          fireEngineer: formData.fireEngineer,
          healthSafety: formData.healthSafety
        },
        principalContractor: formData.principalContractor,
        nsContractors: formData.nsContractors,
        tradeContractors: formData.tradeContractors,
        retentionRate: retention,
        initialContractValue: formData.initialContractValue ? Number(formData.initialContractValue) : null,
        initialActiveStaff: formData.initialActiveStaff ? Number(formData.initialActiveStaff) : null,
        recordedIncidents: formData.recordedIncidents ? Number(formData.recordedIncidents) : 0,
        initialProgress: formData.initialProgress ? Number(formData.initialProgress) : null,
        pendingVariations: formData.pendingVariations ? Number(formData.pendingVariations) : 0,
        createdAt: serverTimestamp(),
      });
      setFormData({
        name: '', contractType: 'JBCC', status: 'Pre-construction', 
        plannedStartDate: '', plannedDuration: '', location: '', 
        clientName: '', clientAddress: '', clientEmail: '', clientPhone: '', clientDigitalAgreement: false,
        projectManager: '', paEmail: '', paPhone: '', paDigitalAgreement: false,
        architect: '', quantitySurveyor: '', structuralEngineer: '', civilEngineer: '', mechanicalEngineer: '', electricalEngineer: '', fireEngineer: '', healthSafety: '',
        principalContractor: '', nsContractors: '', tradeContractors: '', lat: '', lng: '',
        initialContractValue: '', initialActiveStaff: '', recordedIncidents: '', initialProgress: '', pendingVariations: ''
      });
      setActiveTab('core');
      onClose();
    } catch (error) {
      console.error("Error adding project:", error);
      handleFirestoreError(error, OperationType.CREATE, 'projects');
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-architect-coal/40 backdrop-blur-md" 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-xl rounded-3xl md:rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="p-6 md:p-10 overflow-y-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-architect-coal flex items-center justify-center shadow-lg shadow-architect-coal/20">
              <Plus className="w-6 h-6 text-olive-primary" />
            </div>
            <h2 className="text-2xl font-black text-architect-coal">Create New Project</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 snap-x">
              {[
                { id: 'core', label: 'Core Details' },
                { id: 'client', label: 'Client' },
                { id: 'professionals', label: 'Professionals' },
                { id: 'contractors', label: 'Contractors' },
                { id: 'ecosystem', label: 'KPI Target Data' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap snap-start transition-colors ${
                    activeTab === tab.id ? 'bg-architect-coal text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {activeTab === 'core' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Project Identifier</label>
                    <input required type="text" placeholder="e.g. Pretoria High Phase 1" className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-3xl outline-none focus:border-architect-coal focus:bg-white transition-all text-sm font-bold placeholder:text-zinc-300" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Standard form</label>
                      <select className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-3xl outline-none focus:border-architect-coal focus:bg-white text-sm font-bold" value={formData.contractType} onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}>
                        <option value="JBCC">JBCC</option>
                        <option value="GCC">GCC</option>
                        <option value="NEC">NEC</option>
                        <option value="FIDIC">FIDIC</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Phase Status</label>
                      <select className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-3xl outline-none focus:border-architect-coal focus:bg-white text-sm font-bold" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                        <option value="Pre-Design">Pre-Design</option>
                        <option value="Design">Design</option>
                        <option value="Pre-construction">Pre-construction</option>
                        <option value="Construction">Construction</option>
                        <option value="Post-construction">Post-construction</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Start Date</label>
                      <input type="date" className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-3xl outline-none focus:border-architect-coal focus:bg-white text-sm font-bold text-zinc-500" value={formData.plannedStartDate} onChange={(e) => setFormData({ ...formData, plannedStartDate: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Planned Duration (Weeks)</label>
                      <input type="number" placeholder="e.g. 52" className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-3xl outline-none focus:border-architect-coal focus:bg-white text-sm font-bold text-zinc-500" value={formData.plannedDuration} onChange={(e) => setFormData({ ...formData, plannedDuration: e.target.value })} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Location Details</label>
                    <input type="text" placeholder="Physical Address or general location" className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-3xl outline-none focus:border-architect-coal focus:bg-white text-sm font-bold mb-2" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="number" step="any" placeholder="Latitude (e.g. -25.747)" className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-3xl outline-none focus:border-architect-coal focus:bg-white text-sm font-bold" value={formData.lat} onChange={(e) => setFormData({ ...formData, lat: e.target.value })} />
                      <input type="number" step="any" placeholder="Longitude (e.g. 28.229)" className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-3xl outline-none focus:border-architect-coal focus:bg-white text-sm font-bold" value={formData.lng} onChange={(e) => setFormData({ ...formData, lng: e.target.value })} />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'client' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Client / Employer Name</label>
                    <input type="text" placeholder="e.g. Department of Public Works" className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-3xl outline-none focus:border-architect-coal font-bold text-sm" value={formData.clientName} onChange={(e) => setFormData({ ...formData, clientName: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Client Address</label>
                    <textarea rows={2} className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-3xl outline-none focus:border-architect-coal font-bold text-sm resize-none" value={formData.clientAddress} onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Client Email</label>
                      <input type="email" placeholder="client@example.com" className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-3xl outline-none focus:border-architect-coal font-bold text-sm" value={formData.clientEmail} onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Client Phone</label>
                      <input type="tel" placeholder="+27..." className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-3xl outline-none focus:border-architect-coal font-bold text-sm" value={formData.clientPhone} onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <input 
                      type="checkbox" 
                      id="clientDigital"
                      className="w-4 h-4 rounded border-zinc-300 text-architect-coal focus:ring-architect-coal" 
                      checked={formData.clientDigitalAgreement}
                      onChange={(e) => setFormData({ ...formData, clientDigitalAgreement: e.target.checked })}
                    />
                    <label htmlFor="clientDigital" className="text-[10px] font-bold text-zinc-600 uppercase tracking-tight">
                      Client agrees to record contractual documentation in digital format
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'professionals' && (
                <div className="space-y-6">
                  {/* Principal Agent Section */}
                  <div className="p-6 bg-olive-light/10 border border-olive-primary/10 rounded-3xl space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-olive-primary rounded-full" />
                      <h4 className="text-[10px] font-black text-olive-primary uppercase tracking-widest">Principal Agent / PM Details</h4>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">PA Company Name</label>
                      <input type="text" placeholder="Company Name" className="w-full px-6 py-3 bg-white border border-zinc-100 rounded-2xl outline-none focus:border-architect-coal font-bold text-sm" value={formData.projectManager} onChange={(e) => setFormData({ ...formData, projectManager: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">PA Email</label>
                        <input type="email" placeholder="pa@example.com" className="w-full px-6 py-3 bg-white border border-zinc-100 rounded-2xl outline-none focus:border-architect-coal font-bold text-sm" value={formData.paEmail} onChange={(e) => setFormData({ ...formData, paEmail: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">PA Phone</label>
                        <input type="tel" placeholder="+27..." className="w-full px-6 py-3 bg-white border border-zinc-100 rounded-2xl outline-none focus:border-architect-coal font-bold text-sm" value={formData.paPhone} onChange={(e) => setFormData({ ...formData, paPhone: e.target.value })} />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-white border border-zinc-100 rounded-2xl">
                      <input 
                        type="checkbox" 
                        id="paDigital"
                        className="w-4 h-4 rounded border-zinc-300 text-architect-coal focus:ring-architect-coal" 
                        checked={formData.paDigitalAgreement}
                        onChange={(e) => setFormData({ ...formData, paDigitalAgreement: e.target.checked })}
                      />
                      <label htmlFor="paDigital" className="text-[10px] font-bold text-zinc-600 uppercase tracking-tight">
                        Principal Agent agrees to record contractual documentation in digital format
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: 'architect', label: 'Architect' },
                      { key: 'quantitySurveyor', label: 'Quantity Surveyor' },
                      { key: 'structuralEngineer', label: 'Structural Engineer' },
                      { key: 'civilEngineer', label: 'Civil Engineer' },
                      { key: 'mechanicalEngineer', label: 'Mechanical Engineer' },
                      { key: 'electricalEngineer', label: 'Electrical Engineer' },
                      { key: 'fireEngineer', label: 'Fire Engineer' },
                      { key: 'healthSafety', label: 'Health & Safety Agent' }
                    ].map(prof => (
                      <div key={prof.key} className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">{prof.label}</label>
                        <input type="text" placeholder={`Company & Contact...`} className="w-full px-6 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:border-architect-coal font-bold text-sm" value={(formData as any)[prof.key]} onChange={(e) => setFormData({ ...formData, [prof.key]: e.target.value })} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'contractors' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Principal Contractor</label>
                    <input type="text" placeholder="Company & Details" className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-3xl outline-none focus:border-architect-coal font-bold text-sm" value={formData.principalContractor} onChange={(e) => setFormData({ ...formData, principalContractor: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Nominated / Selected Contractors</label>
                    <textarea rows={3} placeholder="List N/S contractors..." className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-3xl outline-none focus:border-architect-coal font-bold text-sm resize-none" value={formData.nsContractors} onChange={(e) => setFormData({ ...formData, nsContractors: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Trade Contractors</label>
                    <textarea rows={3} placeholder="List main trade contractors..." className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-3xl outline-none focus:border-architect-coal font-bold text-sm resize-none" value={formData.tradeContractors} onChange={(e) => setFormData({ ...formData, tradeContractors: e.target.value })} />
                  </div>
                </div>
              )}

              {activeTab === 'ecosystem' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Initial Contract Value (Rands)</label>
                    <input type="number" step="any" placeholder="e.g. 15000000" className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-3xl outline-none focus:border-architect-coal font-bold text-sm" value={formData.initialContractValue} onChange={(e) => setFormData({ ...formData, initialContractValue: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Initial Staff Count</label>
                      <input type="number" placeholder="Estimated staff on site" className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-3xl outline-none focus:border-architect-coal font-bold text-sm" value={formData.initialActiveStaff} onChange={(e) => setFormData({ ...formData, initialActiveStaff: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Current Progress (%)</label>
                      <input type="number" min="0" max="100" placeholder="e.g. 15" className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-3xl outline-none focus:border-architect-coal font-bold text-sm" value={formData.initialProgress} onChange={(e) => setFormData({ ...formData, initialProgress: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Pending Variations Count</label>
                      <input type="number" placeholder="e.g. 2" className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-3xl outline-none focus:border-architect-coal font-bold text-sm" value={formData.pendingVariations} onChange={(e) => setFormData({ ...formData, pendingVariations: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Recorded Incidents</label>
                      <input type="number" placeholder="e.g. 0" className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-3xl outline-none focus:border-architect-coal font-bold text-sm" value={formData.recordedIncidents} onChange={(e) => setFormData({ ...formData, recordedIncidents: e.target.value })} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4 border-t border-zinc-100">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 py-5 bg-zinc-100 text-zinc-400 font-black text-xs uppercase tracking-widest rounded-3xl hover:bg-zinc-200 transition-all"
              >
                Dismiss
              </button>
              <button 
                disabled={loading}
                type="submit"
                className="flex-1 py-5 bg-architect-coal text-white font-black text-xs uppercase tracking-widest rounded-3xl hover:bg-opacity-90 transition-all shadow-xl shadow-architect-coal/20 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Save Project'
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
