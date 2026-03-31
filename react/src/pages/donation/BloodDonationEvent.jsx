import React, { useState, useEffect, useRef } from "react";
import {
  Calendar, Clock, Users, MapPin, Phone, Mail, CheckCircle,
  Activity, Plus, Edit, Trash2, Eye, X, AlertCircle, Building2,
  User, FileText, Download, Search, ChevronLeft, ChevronRight,
  Droplets, Heart, ArrowRight, ArrowLeft, Stethoscope, ClipboardList,
} from "lucide-react";

const API_BASE =
  (typeof window !== "undefined" && window.__VITE_API_BASE_URL) ||
  "http://localhost:8000";
const apiUrl = (path) => `${API_BASE}${path}`;

// ── Micro components ──────────────────────────────────────────
const inputCls = (err) =>
  `w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-rose-400/40 focus:border-rose-400 placeholder:text-gray-300 ${
    err ? "border-rose-400 bg-rose-50/40" : "border-gray-200 hover:border-gray-300"
  }`;

const FieldError = ({ msg }) =>
  msg ? (
    <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1 font-medium">
      <AlertCircle size={11} /> {msg}
    </p>
  ) : null;

const Label = ({ children, required }) => (
  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
    {children}{" "}
    {required && <span className="text-rose-400 normal-case font-normal">*</span>}
  </label>
);

// ── Constants ─────────────────────────────────────────────────
const STEPS = [
  { id: 1, title: "Camp Info",   icon: ClipboardList, desc: "Name & organisation" },
  { id: 2, title: "Schedule",    icon: Calendar,      desc: "Dates & timings"     },
  { id: 3, title: "Coordinator", icon: User,          desc: "Contact details"     },
];

const EMPTY = {
  campName: "", organizedBy: "", supportingHospital: "", location: "",
  campType: "single", startDate: "", endDate: "", startTime: "", endTime: "",
  coordinatorName: "", coordinatorContact: "", coordinatorEmail: "",
  expectedDonors: "", actualDonors: "", description: "", status: "Scheduled",
};

const SAMPLE_CAMPS = [
  { id: 1, camp_code: "BC-2026-001", camp_name: "Spring Blood Drive", organized_by: "Nepal Red Cross", supporting_hospital: "Nepal Blood Bank", location: "Tundikhel, Kathmandu", camp_type: "single", start_date: "2026-04-10", end_date: null, start_time: "08:00", end_time: "16:00", coordinator_name: "Dr. Ramesh Sharma", coordinator_contact: "9841234567", coordinator_email: "ramesh@nrc.org", expected_donors: 150, actual_donors: 0, description: "Annual spring drive for Kathmandu valley.", status: "Scheduled" },
  { id: 2, camp_code: "BC-2026-002", camp_name: "Community Health Camp", organized_by: "Kathmandu Lions Club", supporting_hospital: "Grande Hospital", location: "Patan, Lalitpur", camp_type: "multiple", start_date: "2026-03-28", end_date: "2026-03-30", start_time: "09:00", end_time: "17:00", coordinator_name: "Sita Thapa", coordinator_contact: "9812345678", coordinator_email: "sita@lions.org", expected_donors: 200, actual_donors: 87, description: "3-day multi-venue camp.", status: "In Progress" },
  { id: 3, camp_code: "BC-2026-003", camp_name: "University Drive 2026", organized_by: "TU Students Union", supporting_hospital: "TUTH Blood Bank", location: "Kirtipur, Kathmandu", camp_type: "single", start_date: "2026-02-14", end_date: null, start_time: "10:00", end_time: "15:00", coordinator_name: "Rohan KC", coordinator_contact: "9823456789", coordinator_email: null, expected_donors: 300, actual_donors: 278, description: null, status: "Completed" },
  { id: 4, camp_code: "BC-2026-004", camp_name: "Corporate Wellness Drive", organized_by: "Chaudhary Group", supporting_hospital: "Norvic Hospital", location: "New Baneshwor, Kathmandu", camp_type: "single", start_date: "2026-01-20", end_date: null, start_time: "09:30", end_time: "14:30", coordinator_name: "Maya Gurung", coordinator_contact: "9856789012", coordinator_email: "maya@cg.com", expected_donors: 100, actual_donors: 0, description: null, status: "Cancelled" },
];

// ─────────────────────────────────────────────────────────────
// STEP FORMS — defined OUTSIDE the parent to prevent remounting
// ─────────────────────────────────────────────────────────────
const StepOne = ({ form, errors, handleChange }) => (
  <div className="space-y-5">
    <div>
      <Label required>Camp Name</Label>
      <input name="campName" value={form.campName} onChange={handleChange}
        placeholder="e.g., Winter Blood Drive 2026" className={inputCls(errors.campName)} />
      <FieldError msg={errors.campName} />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <Label required>Organized By</Label>
        <input name="organizedBy" value={form.organizedBy} onChange={handleChange}
          placeholder="e.g., Nepal Red Cross" className={inputCls(errors.organizedBy)} />
        <FieldError msg={errors.organizedBy} />
      </div>
      <div>
        <Label required>Supporting Hospital / Blood Bank</Label>
        <input name="supportingHospital" value={form.supportingHospital} onChange={handleChange}
          placeholder="e.g., Nepal Blood Bank" className={inputCls(errors.supportingHospital)} />
        <FieldError msg={errors.supportingHospital} />
      </div>
    </div>
    <div>
      <Label required>Location</Label>
      <div className="relative">
        <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
        <input name="location" value={form.location} onChange={handleChange}
          placeholder="e.g., Tundikhel, Kathmandu" className={`${inputCls(errors.location)} pl-9`} />
      </div>
      <FieldError msg={errors.location} />
    </div>
    <div>
      <Label>Additional Notes</Label>
      <textarea name="description" value={form.description} onChange={handleChange} rows={3}
        placeholder="Any additional information about the camp…"
        className={`${inputCls(false)} resize-none`} />
    </div>
  </div>
);

const StepTwo = ({ form, errors, handleChange, setForm }) => (
  <div className="space-y-5">
    <div>
      <Label>Camp Duration</Label>
      <div className="grid grid-cols-2 gap-3 mt-1">
        {[{ v: "single", l: "Single Day", emoji: "☀️" }, { v: "multiple", l: "Multi-Day", emoji: "📅" }].map(({ v, l, emoji }) => (
          <button key={v} type="button"
            onClick={() => setForm((f) => ({ ...f, campType: v, endDate: v === "single" ? "" : f.endDate }))}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-sm font-semibold transition-all ${
              form.campType === v
                ? "border-rose-400 bg-rose-50 text-rose-700 shadow-sm"
                : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
            }`}>
            <span className="text-lg">{emoji}</span>{l}
          </button>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <Label required>Start Date</Label>
        <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className={inputCls(errors.startDate)} />
        <FieldError msg={errors.startDate} />
      </div>
      {form.campType === "multiple" && (
        <div>
          <Label required>End Date</Label>
          <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className={inputCls(errors.endDate)} />
          <FieldError msg={errors.endDate} />
        </div>
      )}
      <div>
        <Label required>Start Time</Label>
        <input type="time" name="startTime" value={form.startTime} onChange={handleChange} className={inputCls(errors.startTime)} />
        <FieldError msg={errors.startTime} />
      </div>
      <div>
        <Label required>End Time</Label>
        <input type="time" name="endTime" value={form.endTime} onChange={handleChange} className={inputCls(errors.endTime)} />
        <FieldError msg={errors.endTime} />
      </div>
    </div>

    <div>
      <Label>Expected Donors</Label>
      <div className="relative">
        <Users size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
        <input type="number" name="expectedDonors" value={form.expectedDonors} onChange={handleChange}
          placeholder="e.g., 150" className={`${inputCls(false)} pl-9`} min="0" />
      </div>
    </div>
  </div>
);

const StepThree = ({ form, errors, handleChange, fmtDate }) => (
  <div className="space-y-5">
    <div>
      <Label required>Coordinator Name</Label>
      <div className="relative">
        <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
        <input name="coordinatorName" value={form.coordinatorName} onChange={handleChange}
          placeholder="e.g., Dr. Ramesh Sharma" className={`${inputCls(errors.coordinatorName)} pl-9`} />
      </div>
      <FieldError msg={errors.coordinatorName} />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <Label required>Contact Number</Label>
        <div className="relative">
          <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
          <input name="coordinatorContact" value={form.coordinatorContact} onChange={handleChange}
            placeholder="9841234567" className={`${inputCls(errors.coordinatorContact)} pl-9`} />
        </div>
        <FieldError msg={errors.coordinatorContact} />
      </div>
      <div>
        <Label>Email Address</Label>
        <div className="relative">
          <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
          <input type="email" name="coordinatorEmail" value={form.coordinatorEmail} onChange={handleChange}
            placeholder="coordinator@example.com" className={`${inputCls(errors.coordinatorEmail)} pl-9`} />
        </div>
        <FieldError msg={errors.coordinatorEmail} />
      </div>
    </div>

    {/* Review summary */}
    <div className="rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50 to-pink-50 p-5">
      <p className="text-[11px] font-bold text-rose-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
        <CheckCircle size={11} /> Review Before Submitting
      </p>
      <div className="space-y-2">
        {[
          ["Camp",         form.campName || "—"],
          ["Organisation", form.organizedBy || "—"],
          ["Location",     form.location || "—"],
          ["Date",         form.startDate ? `${fmtDate(form.startDate)}${form.campType === "multiple" && form.endDate ? ` → ${fmtDate(form.endDate)}` : ""}` : "—"],
          ["Hours",        form.startTime && form.endTime ? `${form.startTime} – ${form.endTime}` : "—"],
          ["Expected",     form.expectedDonors ? `${form.expectedDonors} donors` : "—"],
        ].map(([k, v]) => (
          <div key={k} className="flex items-start gap-2 text-sm">
            <span className="w-24 shrink-0 text-rose-300 font-semibold text-xs pt-0.5">{k}</span>
            <span className="text-gray-700 font-medium">{v}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// MODALS — also defined outside to prevent remounting
// ─────────────────────────────────────────────────────────────
const CreateModal = ({ step, form, errors, handleChange, setForm, bodyRef, closeCreate, goNext, goPrev, handleSubmit, submitting, fmtDate }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl flex flex-col overflow-hidden" style={{ maxHeight: "90vh" }}>

      {/* Sticky header */}
      <div className="shrink-0 bg-gradient-to-br from-rose-500 via-rose-600 to-pink-600 px-7 pt-7 pb-6">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner">
              <Droplets size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white leading-tight tracking-tight">Create Donation Camp</h2>
              <p className="text-rose-200 text-xs mt-0.5">Step {step} of {STEPS.length} — {STEPS[step - 1].desc}</p>
            </div>
          </div>
          <button onClick={closeCreate}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors shrink-0">
            <X size={16} />
          </button>
        </div>

        {/* Step progress */}
        <div className="flex items-center gap-1">
          {STEPS.map((s, i) => {
            const done   = step > s.id;
            const active = step === s.id;
            const Icon   = s.icon;
            return (
              <React.Fragment key={s.id}>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                  active ? "bg-white text-rose-600 shadow-md" : done ? "bg-white/25 text-white" : "bg-white/10 text-rose-200"
                }`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    active ? "bg-rose-500 text-white" : done ? "bg-white text-rose-500" : "bg-white/20 text-white"
                  }`}>
                    {done ? <CheckCircle size={11} /> : <span className="text-[10px] font-black">{s.id}</span>}
                  </div>
                  <span className="hidden sm:inline">{s.title}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 rounded-full transition-all duration-500 ${step > s.id ? "bg-white/50" : "bg-white/20"}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Scrollable body */}
      <div ref={bodyRef} className="flex-1 overflow-y-auto px-7 py-7 min-h-0">
        {step === 1 && <StepOne form={form} errors={errors} handleChange={handleChange} />}
        {step === 2 && <StepTwo form={form} errors={errors} handleChange={handleChange} setForm={setForm} />}
        {step === 3 && <StepThree form={form} errors={errors} handleChange={handleChange} fmtDate={fmtDate} />}
      </div>

      {/* Sticky footer */}
      <div className="shrink-0 px-7 py-5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
        <button onClick={step === 1 ? closeCreate : goPrev}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-all">
          <ArrowLeft size={15} /> {step === 1 ? "Cancel" : "Back"}
        </button>

        <div className="flex items-center gap-1.5">
          {STEPS.map((_, i) => (
            <div key={i} className={`rounded-full transition-all duration-300 ${
              i + 1 === step ? "w-5 h-1.5 bg-rose-500" : i + 1 < step ? "w-3 h-1.5 bg-rose-300" : "w-3 h-1.5 bg-gray-200"
            }`} />
          ))}
        </div>

        {step < STEPS.length ? (
          <button onClick={goNext}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:shadow-lg hover:shadow-rose-200 transition-all">
            Next <ArrowRight size={15} />
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:shadow-lg hover:shadow-rose-200 transition-all disabled:opacity-60">
            {submitting
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
              : <><CheckCircle size={15} /> Create Camp</>}
          </button>
        )}
      </div>
    </div>
  </div>
);

const ViewModal = ({ selectedCamp, onClose, onEdit, fmtDate, getMeta, donorPct }) => {
  if (!selectedCamp) return null;
  const meta = getMeta(selectedCamp.status);
  const pct  = donorPct(selectedCamp.actual_donors, selectedCamp.expected_donors);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden" style={{ maxHeight: "90vh" }}>
        <div className="shrink-0 relative bg-gradient-to-br from-slate-800 to-slate-900 px-7 pt-7 pb-6">
          <button onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
            <X size={16} />
          </button>
          <p className="text-[11px] font-mono text-slate-400 mb-1">{selectedCamp.camp_code}</p>
          <h3 className="text-xl font-black text-white mb-3 pr-10 leading-tight">{selectedCamp.camp_name}</h3>
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${meta.cls}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} /> {selectedCamp.status}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-4 min-h-0">
          {selectedCamp.expected_donors && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1">
                  <Heart size={10} /> Donor Progress
                </span>
                <span className="text-sm font-black text-rose-600">{selectedCamp.actual_donors || 0} / {selectedCamp.expected_donors}</span>
              </div>
              <div className="h-2 rounded-full bg-rose-100 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-rose-400 to-pink-500 transition-all duration-700" style={{ width: `${pct}%` }} />
              </div>
              <p className="text-xs text-rose-400 mt-1 text-right font-medium">{pct}% of goal</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Building2,   label: "Organized By",       value: selectedCamp.organized_by,        span: false },
              { icon: Stethoscope, label: "Supporting Hospital", value: selectedCamp.supporting_hospital, span: false },
              { icon: MapPin,      label: "Location",            value: selectedCamp.location,            span: true  },
              {
                icon: Calendar,
                label: selectedCamp.camp_type === "multiple" ? "Camp Dates" : "Camp Date",
                value: selectedCamp.camp_type === "single"
                  ? fmtDate(selectedCamp.start_date)
                  : `${fmtDate(selectedCamp.start_date, { month: "short", day: "numeric" })} – ${fmtDate(selectedCamp.end_date)}`,
                span: false,
              },
              { icon: Clock,  label: "Operating Hours", value: `${selectedCamp.start_time} – ${selectedCamp.end_time}`, span: false },
              { icon: User,   label: "Coordinator",     value: selectedCamp.coordinator_name,    span: false },
              { icon: Phone,  label: "Contact",         value: selectedCamp.coordinator_contact, span: false },
              ...(selectedCamp.coordinator_email ? [{ icon: Mail,     label: "Email", value: selectedCamp.coordinator_email, span: true }] : []),
              ...(selectedCamp.description       ? [{ icon: FileText, label: "Notes", value: selectedCamp.description,       span: true }] : []),
            ].map(({ icon: Ic, label, value, span }) => (
              <div key={label} className={`flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 ${span ? "col-span-2" : ""}`}>
                <div className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 mt-0.5">
                  <Ic size={13} className="text-gray-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-gray-700 break-words">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="shrink-0 px-7 py-4 border-t border-gray-100 flex gap-3">
          <button onClick={onEdit}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5">
            <Edit size={14} /> Edit
          </button>
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const EditModal = ({ selectedCamp, form, handleChange, handleUpdate, submitting, onClose, donorPct }) => {
  if (!selectedCamp) return null;
  const pct = donorPct(form.actualDonors || 0, form.expectedDonors);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden" style={{ maxHeight: "90vh" }}>
        <div className="shrink-0 relative bg-gradient-to-br from-emerald-500 to-teal-600 px-7 pt-7 pb-6">
          <button onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors">
            <X size={16} />
          </button>
          <div className="flex items-center gap-3 pr-8">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Edit size={18} className="text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-black text-white leading-tight">Update Camp</h3>
              <p className="text-emerald-200 text-xs mt-0.5 truncate">{selectedCamp.camp_name}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-5 min-h-0">
          <div>
            <Label>Camp Name</Label>
            <input name="campName" value={form.campName} onChange={handleChange} className={inputCls(false)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Status</Label>
              <select name="status" value={form.status} onChange={handleChange} className={inputCls(false)}>
                {["Scheduled", "In Progress", "Completed", "Cancelled"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <Label>Actual Donors</Label>
              <input type="number" name="actualDonors" value={form.actualDonors} onChange={handleChange}
                placeholder="0" min="0" className={inputCls(false)} />
            </div>
          </div>

          {form.expectedDonors && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-600">Completion Rate</span>
                <span className="text-xs font-black text-emerald-700">{form.actualDonors || 0} / {form.expectedDonors} ({pct}%)</span>
              </div>
              <div className="h-2 rounded-full bg-emerald-100 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )}

          <div>
            <Label>Notes</Label>
            <textarea name="description" value={form.description} onChange={handleChange}
              rows={3} className={`${inputCls(false)} resize-none`} />
          </div>
        </div>

        <div className="shrink-0 px-7 py-5 border-t border-gray-100 flex gap-3">
          <button onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
            Cancel
          </button>
          <button onClick={handleUpdate} disabled={submitting}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-lg hover:shadow-emerald-200 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
            {submitting
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
              : <><CheckCircle size={15} /> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function BloodDonationEvent() {
  const [camps, setCamps]               = useState([]);
  const [modalOpen, setModalOpen]       = useState(false);
  const [viewOpen, setViewOpen]         = useState(false);
  const [editOpen, setEditOpen]         = useState(false);
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage]   = useState(1);
  const ITEMS                           = 6;
  const [loadingList, setLoadingList]   = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [errors, setErrors]             = useState({});
  const [step, setStep]                 = useState(1);
  const [form, setForm]                 = useState(EMPTY);
  const bodyRef                         = useRef(null);

  useEffect(() => { fetchCamps(); }, []);

  const fetchCamps = async () => {
    setLoadingList(true);
    try {
      const res = await fetch(apiUrl("/api/blood-donation-event"), { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error();
      const r = await res.json();
      setCamps(r.success ? r.data : SAMPLE_CAMPS);
    } catch {
      setCamps(SAMPLE_CAMPS);
    } finally {
      setLoadingList(false);
    }
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((er) => ({ ...er, [e.target.name]: undefined }));
  };

  const validateStep = (s) => {
    const e = {};
    if (s === 1) {
      if (!form.campName?.trim() || form.campName.trim().length < 3) e.campName = "At least 3 characters required";
      if (!form.organizedBy?.trim()) e.organizedBy = "Required";
      if (!form.supportingHospital?.trim()) e.supportingHospital = "Required";
      if (!form.location?.trim()) e.location = "Required";
    }
    if (s === 2) {
      if (!form.startDate) e.startDate = "Required";
      if (form.campType === "multiple") {
        if (!form.endDate) e.endDate = "Required for multi-day camps";
        else if (form.startDate > form.endDate) e.endDate = "Must be after start date";
      }
      if (!form.startTime) e.startTime = "Required";
      if (!form.endTime) e.endTime = "Required";
    }
    if (s === 3) {
      if (!form.coordinatorName?.trim()) e.coordinatorName = "Required";
      if (!form.coordinatorContact || !/^[0-9]{10,}$/.test(form.coordinatorContact.replace(/\s/g, "")))
        e.coordinatorContact = "Valid 10+ digit number required";
      if (form.coordinatorEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.coordinatorEmail))
        e.coordinatorEmail = "Invalid email address";
    }
    return e;
  };

  const goNext = () => {
    const errs = validateStep(step);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStep((s) => s + 1);
    setTimeout(() => bodyRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 40);
  };

  const goPrev = () => { setErrors({}); setStep((s) => s - 1); };

  const buildPayload = (withActual = false) => ({
    camp_name: form.campName.trim(), organized_by: form.organizedBy.trim(),
    supporting_hospital: form.supportingHospital.trim(), location: form.location.trim(),
    camp_type: form.campType, start_date: form.startDate, end_date: form.endDate || null,
    start_time: form.startTime, end_time: form.endTime,
    coordinator_name: form.coordinatorName.trim(), coordinator_contact: form.coordinatorContact.trim(),
    coordinator_email: form.coordinatorEmail?.trim() || null,
    expected_donors: form.expectedDonors !== "" ? Number(form.expectedDonors) : null,
    ...(withActual ? { actual_donors: form.actualDonors !== "" ? Number(form.actualDonors) : null } : {}),
    description: form.description?.trim() || null, status: form.status || "Scheduled",
  });

  const handleSubmit = async () => {
    const errs = validateStep(3);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      const res = await fetch(apiUrl("/api/blood-donation-event"), {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      const r = await res.json();
      if (!res.ok || !r.success) { alert("Failed: " + (r.message || "Unknown")); return; }
      setCamps((c) => [r.data, ...c]);
    } catch {
      const fake = { id: Date.now(), camp_code: `BC-DEMO-${Date.now() % 1000}`, ...buildPayload(), actual_donors: 0 };
      setCamps((c) => [fake, ...c]);
    } finally {
      setSubmitting(false);
      closeCreate();
    }
  };

  const closeCreate = () => { setModalOpen(false); setStep(1); setForm(EMPTY); setErrors({}); };

  const handleEdit = (id) => {
    const c = camps.find((c) => c.id === id);
    setSelectedCamp(c);
    setForm({
      campName: c.camp_name, organizedBy: c.organized_by, supportingHospital: c.supporting_hospital,
      location: c.location, campType: c.camp_type, startDate: c.start_date, endDate: c.end_date || "",
      startTime: c.start_time, endTime: c.end_time, coordinatorName: c.coordinator_name,
      coordinatorContact: c.coordinator_contact, coordinatorEmail: c.coordinator_email || "",
      expectedDonors: c.expected_donors || "", actualDonors: c.actual_donors || "",
      description: c.description || "", status: c.status || "Scheduled",
    });
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(apiUrl(`/api/blood-donation-event/${selectedCamp.id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(buildPayload(true)),
      });
      if (res.ok) {
        const r = await res.json();
        if (r.success && r.data) { setCamps((c) => c.map((x) => (x.id === r.data.id ? r.data : x))); }
      } else { throw new Error(); }
    } catch {
      const updated = {
        ...selectedCamp,
        camp_name: form.campName, organized_by: form.organizedBy,
        supporting_hospital: form.supportingHospital, location: form.location,
        coordinator_name: form.coordinatorName, coordinator_contact: form.coordinatorContact,
        coordinator_email: form.coordinatorEmail || null,
        expected_donors: Number(form.expectedDonors) || null,
        actual_donors: Number(form.actualDonors) || 0,
        description: form.description || null, status: form.status,
      };
      setCamps((c) => c.map((x) => (x.id === selectedCamp.id ? updated : x)));
    } finally {
      setSubmitting(false);
      setEditOpen(false);
      setSelectedCamp(null);
      setForm(EMPTY);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this camp?")) return;
    try { await fetch(apiUrl(`/api/blood-donation-event/${id}`), { method: "DELETE" }); } catch {}
    setCamps((c) => c.filter((x) => x.id !== id));
  };

  const handleView = async (id) => {
    const local = camps.find((c) => c.id === id);
    try {
      const res = await fetch(apiUrl(`/api/blood-donation-event/${id}`), { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error();
      const r = await res.json();
      if (r.success) { setSelectedCamp(r.data); setViewOpen(true); return; }
    } catch {}
    if (local) { setSelectedCamp(local); setViewOpen(true); }
  };

  const fmtDate = (d, opts = { month: "short", day: "numeric", year: "numeric" }) =>
    d ? new Date(d).toLocaleDateString("en-US", opts) : "—";

  const donorPct = (actual, expected) =>
    expected ? Math.min(100, Math.round(((actual || 0) / expected) * 100)) : 0;

  const STATUS_META = {
    Scheduled:     { cls: "bg-amber-50 text-amber-700 border border-amber-200",      dot: "bg-amber-400"   },
    "In Progress": { cls: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-400" },
    Completed:     { cls: "bg-blue-50 text-blue-700 border border-blue-200",          dot: "bg-blue-400"    },
    Cancelled:     { cls: "bg-red-50 text-red-600 border border-red-100",             dot: "bg-red-400"     },
  };
  const getMeta = (s) => STATUS_META[s] || { cls: "bg-gray-100 text-gray-500 border border-gray-200", dot: "bg-gray-400" };

  const filtered = camps.filter((c) => {
    const q = search.toLowerCase();
    const ms = !q || [c.camp_name, c.organized_by, c.camp_code, c.location].some((v) => v?.toLowerCase().includes(q));
    const mf = statusFilter === "all" || c.status?.toLowerCase().replace(/\s/g, "") === statusFilter;
    return ms && mf;
  });
  const totalPages   = Math.ceil(filtered.length / ITEMS);
  const currentCamps = filtered.slice((currentPage - 1) * ITEMS, currentPage * ITEMS);
  useEffect(() => setCurrentPage(1), [search, statusFilter]);

  const exportCSV = () => {
    const rows = [
      ["Code","Name","Org","Hospital","Location","Type","Start","End","Time","Coordinator","Contact","Expected","Actual","Status"],
      ...filtered.map((c) => [c.camp_code,c.camp_name,c.organized_by,c.supporting_hospital,c.location,c.camp_type,c.start_date,c.end_date||"-",`${c.start_time}-${c.end_time}`,c.coordinator_name,c.coordinator_contact,c.expected_donors||"-",c.actual_donors||0,c.status]),
    ];
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `camps_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const stats = [
    { label: "Total Camps", value: camps.length,                                      color: "from-rose-500 to-pink-600",    icon: Droplets    },
    { label: "Scheduled",   value: camps.filter((c) => c.status === "Scheduled").length,   color: "from-amber-400 to-orange-500", icon: Clock       },
    { label: "In Progress", value: camps.filter((c) => c.status === "In Progress").length, color: "from-emerald-400 to-teal-500", icon: Activity    },
    { label: "Completed",   value: camps.filter((c) => c.status === "Completed").length,   color: "from-blue-500 to-indigo-600",  icon: CheckCircle },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#f8f7f5]">
      <main className="flex-1 p-5 md:p-8 overflow-y-auto">

        {/* Page header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-md">
                <Droplets size={16} className="text-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-rose-500">Blood Donation</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Camp Management</h1>
            <p className="text-gray-400 text-sm mt-1">Organize, track and grow your donation impact</p>
          </div>
          <button onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 text-white text-sm font-bold shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-300 hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap">
            <Plus size={16} /> Create Camp
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-md`}>
                <s.icon size={18} className="text-white" />
              </div>
              <p className="text-2xl font-black text-gray-800">{s.value}</p>
              <p className="text-xs font-semibold text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter + search */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="flex gap-2 flex-wrap flex-1">
              {[
                { k: "all",        l: "All",        n: camps.length },
                { k: "scheduled",  l: "Scheduled",  n: camps.filter((c) => c.status === "Scheduled").length },
                { k: "inprogress", l: "In Progress", n: camps.filter((c) => c.status === "In Progress").length },
                { k: "completed",  l: "Completed",  n: camps.filter((c) => c.status === "Completed").length },
              ].map(({ k, l, n }) => (
                <button key={k} onClick={() => setStatusFilter(k)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                    statusFilter === k ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}>
                  {l}
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${statusFilter === k ? "bg-white/20" : "bg-gray-200 text-gray-400"}`}>{n}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…"
                  className="pl-8 pr-3 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-400/30 focus:border-rose-300 w-full sm:w-44 transition-all" />
              </div>
              <button onClick={exportCSV} title="Export CSV"
                className="p-2 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors text-gray-500">
                <Download size={16} />
              </button>
            </div>
          </div>
        </div>

        <p className="text-xs font-semibold text-gray-400 mb-4 px-1">
          {filtered.length} camp{filtered.length !== 1 ? "s" : ""} found
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {loadingList ? (
            <div className="col-span-full py-16 text-center">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-rose-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400 text-sm font-semibold">Loading camps…</p>
            </div>
          ) : currentCamps.length === 0 ? (
            <div className="col-span-full py-16 text-center">
              <div className="w-16 h-16 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Droplets size={28} className="text-gray-300" />
              </div>
              <p className="text-gray-500 font-bold">No camps found</p>
              <p className="text-gray-300 text-sm mt-1">Try adjusting your search or filter</p>
            </div>
          ) : (
            currentCamps.map((camp) => {
              const meta = getMeta(camp.status);
              const pct  = donorPct(camp.actual_donors, camp.expected_donors);
              return (
                <div key={camp.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-rose-400 to-pink-500" />
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-gray-800 leading-snug truncate">{camp.camp_name}</h4>
                        <p className="text-[11px] font-mono text-gray-300 mt-0.5">{camp.camp_code}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${meta.cls}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                        {camp.status}
                      </span>
                    </div>

                    <div className="space-y-2.5 flex-1">
                      {[
                        { icon: Building2, primary: camp.organized_by, secondary: camp.supporting_hospital },
                        { icon: MapPin,    primary: camp.location },
                        {
                          icon: Calendar,
                          primary: camp.camp_type === "single"
                            ? fmtDate(camp.start_date)
                            : `${fmtDate(camp.start_date, { month: "short", day: "numeric" })} – ${fmtDate(camp.end_date)}`,
                        },
                        { icon: Clock, primary: `${camp.start_time} – ${camp.end_time}` },
                        { icon: User,  primary: camp.coordinator_name, secondary: camp.coordinator_contact },
                      ].map(({ icon: Ic, primary, secondary }, idx) => (
                        <div key={idx} className="flex items-start gap-2.5">
                          <div className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
                            <Ic size={12} className="text-gray-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-700 truncate">{primary}</p>
                            {secondary && <p className="text-[11px] text-gray-400 truncate">{secondary}</p>}
                          </div>
                        </div>
                      ))}
                    </div>

                    {camp.expected_donors ? (
                      <div className="mt-4 pt-4 border-t border-gray-50">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                            <Heart size={10} className="text-rose-400" /> Donors
                          </span>
                          <span className="text-[11px] font-black text-gray-600">
                            {camp.actual_donors || 0}/{camp.expected_donors}
                            <span className="font-medium text-gray-300 ml-1">({pct}%)</span>
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-rose-400 to-pink-500"
                            style={{ width: `${pct}%`, transition: "width 0.7s ease" }} />
                        </div>
                      </div>
                    ) : <div className="mt-3" />}

                    <div className="mt-4 pt-3 border-t border-gray-50 grid grid-cols-3 gap-1.5">
                      <button onClick={() => handleView(camp.id)}
                        className="py-2 rounded-xl text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center justify-center gap-1">
                        <Eye size={11} /> View
                      </button>
                      <button onClick={() => handleEdit(camp.id)}
                        className="py-2 rounded-xl text-[11px] font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1">
                        <Edit size={11} /> Edit
                      </button>
                      <button onClick={() => handleDelete(camp.id)}
                        className="py-2 rounded-xl text-[11px] font-bold text-red-500 bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center gap-1">
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-xs text-gray-400 font-medium">
              Page {currentPage} of {totalPages} · {filtered.length} total
            </p>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="w-8 h-8 rounded-xl flex items-center justify-center bg-white border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let p;
                if (totalPages <= 5) p = i + 1;
                else if (currentPage <= 3) p = i + 1;
                else if (currentPage >= totalPages - 2) p = totalPages - 4 + i;
                else p = currentPage - 2 + i;
                return (
                  <button key={i} onClick={() => setCurrentPage(p)}
                    className={`w-8 h-8 rounded-xl text-xs font-black transition-all ${
                      currentPage === p ? "bg-gray-900 text-white shadow-sm" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}>
                    {p}
                  </button>
                );
              })}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-xl flex items-center justify-center bg-white border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {modalOpen && (
        <CreateModal
          step={step} form={form} errors={errors}
          handleChange={handleChange} setForm={setForm}
          bodyRef={bodyRef} closeCreate={closeCreate}
          goNext={goNext} goPrev={goPrev}
          handleSubmit={handleSubmit} submitting={submitting}
          fmtDate={fmtDate}
        />
      )}
      {viewOpen && (
        <ViewModal
          selectedCamp={selectedCamp}
          onClose={() => { setViewOpen(false); setSelectedCamp(null); }}
          onEdit={() => { setViewOpen(false); handleEdit(selectedCamp.id); }}
          fmtDate={fmtDate} getMeta={getMeta} donorPct={donorPct}
        />
      )}
      {editOpen && (
        <EditModal
          selectedCamp={selectedCamp} form={form}
          handleChange={handleChange} handleUpdate={handleUpdate}
          submitting={submitting}
          onClose={() => { setEditOpen(false); setSelectedCamp(null); setForm(EMPTY); }}
          donorPct={donorPct}
        />
      )}
    </div>
  );
}