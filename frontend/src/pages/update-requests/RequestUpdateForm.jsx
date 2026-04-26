import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Plus, Trash2, AlertCircle, ShieldCheck } from 'lucide-react';

const UPDATE_TYPES = ['Diagnosis', 'Prescription', 'Notes', 'Advice', 'Allergy Update', 'Test Recommendation', 'Other'];
const PRIORITIES = ['Normal', 'Important', 'Urgent'];

const RequestUpdateForm = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    type: 'Diagnosis',
    priority: 'Normal',
    diagnosis: '',
    advice: '',
    notes: '',
    allergies: '',
    tests: '',
    prescriptions: []
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addPrescriptionRow = () => {
    setFormData({
      ...formData,
      prescriptions: [...formData.prescriptions, { medicineName: '', dose: '', frequency: '', duration: '' }]
    });
  };

  const updatePrescription = (index, field, value) => {
    const newPrescriptions = [...formData.prescriptions];
    newPrescriptions[index][field] = value;
    setFormData({ ...formData, prescriptions: newPrescriptions });
  };

  const removePrescription = (index) => {
    const newPrescriptions = [...formData.prescriptions];
    newPrescriptions.splice(index, 1);
    setFormData({ ...formData, prescriptions: newPrescriptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Filter out empty prescriptions
    const validPrescriptions = formData.prescriptions.filter(p => p.medicineName.trim() !== '');

    const payload = {
      patientId,
      type: formData.type,
      priority: formData.priority,
      changes: {
        diagnosis: formData.diagnosis,
        advice: formData.advice,
        notes: formData.notes,
        allergies: formData.allergies,
        tests: formData.tests,
        prescriptions: validPrescriptions
      }
    };

    try {
      await axios.post('http://localhost:5000/api/update-requests', payload);
      alert('Update request sent to patient successfully!');
      navigate('/doctor-dashboard/sent-requests');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Request Record Update</h1>
            <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Patient consent required before saving
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Settings */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Primary Update Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-emerald-500 focus:ring-0 outline-none transition-all font-medium text-slate-700"
            >
              {UPDATE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Priority Level</label>
            <div className="flex bg-slate-50 p-1 rounded-xl">
              {PRIORITIES.map(priority => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setFormData({...formData, priority})}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                    formData.priority === priority 
                      ? priority === 'Urgent' ? 'bg-red-500 text-white shadow-md' 
                        : priority === 'Important' ? 'bg-amber-500 text-white shadow-md'
                        : 'bg-emerald-500 text-white shadow-md'
                      : 'text-slate-500 hover:bg-slate-200/50'
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Clinical Data Fields */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">Clinical Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">New Diagnosis</label>
              <input
                type="text"
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleInputChange}
                placeholder="e.g., Type 2 Diabetes"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-emerald-500 focus:ring-0 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Allergy Updates</label>
              <input
                type="text"
                name="allergies"
                value={formData.allergies}
                onChange={handleInputChange}
                placeholder="e.g., Penicillin"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-emerald-500 focus:ring-0 outline-none transition-all"
              />
            </div>
          </div>

          {/* Prescriptions Section */}
          <div className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-bold text-slate-700">Prescriptions</label>
              <button 
                type="button" 
                onClick={addPrescriptionRow}
                className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Medicine
              </button>
            </div>
            
            {formData.prescriptions.length === 0 ? (
              <div className="text-center py-6 bg-slate-50 rounded-xl border border-slate-100 text-slate-500 text-sm">
                No prescriptions added yet. Click 'Add Medicine' above.
              </div>
            ) : (
              <div className="space-y-3">
                {formData.prescriptions.map((p, index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <input
                      type="text"
                      placeholder="Medicine Name"
                      value={p.medicineName}
                      onChange={(e) => updatePrescription(index, 'medicineName', e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-emerald-500 w-full md:w-auto"
                    />
                    <div className="flex gap-3 w-full md:w-auto flex-1">
                      <input
                        type="text"
                        placeholder="Dose (e.g. 500mg)"
                        value={p.dose}
                        onChange={(e) => updatePrescription(index, 'dose', e.target.value)}
                        className="w-1/3 px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-emerald-500"
                      />
                      <input
                        type="text"
                        placeholder="Freq (e.g. 1-0-1)"
                        value={p.frequency}
                        onChange={(e) => updatePrescription(index, 'frequency', e.target.value)}
                        className="w-1/3 px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-emerald-500"
                      />
                      <input
                        type="text"
                        placeholder="Days (e.g. 5 days)"
                        value={p.duration}
                        onChange={(e) => updatePrescription(index, 'duration', e.target.value)}
                        className="w-1/3 px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-emerald-500"
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removePrescription(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors md:ml-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Test Recommendations</label>
            <input
              type="text"
              name="tests"
              value={formData.tests}
              onChange={handleInputChange}
              placeholder="e.g., Complete Blood Count (CBC), Lipid Profile"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-emerald-500 focus:ring-0 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Medical Advice & Instructions</label>
            <textarea
              name="advice"
              value={formData.advice}
              onChange={handleInputChange}
              placeholder="e.g., Avoid salty foods, drink 3L water daily..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-emerald-500 focus:ring-0 outline-none transition-all resize-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Private Consultation Notes (Will be visible to patient)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Detailed clinical notes..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-emerald-500 focus:ring-0 outline-none transition-all resize-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-4">
          <button 
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
            {loading ? 'Sending Request...' : 'Send Request for Approval'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestUpdateForm;
