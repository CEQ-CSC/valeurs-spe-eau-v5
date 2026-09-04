'use client';

export function NumberField({ name, value, onChange, label, unit, placeholder, aide, min = 0 }) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold text-ceq-navy mb-1">{label}</label>
      {aide && <p className="text-xs text-ceq-slateLight mb-1.5 italic">{aide}</p>}
      <div className="relative">
        <input type="number" min={min} value={value ?? ''} placeholder={placeholder || ''}
          onChange={e => onChange(name, e.target.value === '' ? '' : Number(e.target.value))}
          className="w-full px-4 py-3 pr-16 rounded-xl border-2 border-ceq-sky focus:border-ceq-teal
            focus:ring-2 focus:ring-ceq-teal/20 outline-none transition-all bg-white text-ceq-navy
            placeholder-ceq-slateLight" />
        {unit && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-ceq-slate font-medium">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

export function TextField({ name, value, onChange, label, placeholder, aide, required, rows }) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold text-ceq-navy mb-1">
        {label}{required && <span className="text-ceq-coral ml-1">*</span>}
      </label>
      {aide && <p className="text-xs text-ceq-slateLight mb-1.5 italic">{aide}</p>}
      {rows ? (
        <textarea rows={rows} value={value ?? ''} placeholder={placeholder || ''}
          onChange={e => onChange(name, e.target.value)}
          className="w-full px-4 py-3 rounded-xl border-2 border-ceq-sky focus:border-ceq-teal
            focus:ring-2 focus:ring-ceq-teal/20 outline-none transition-all bg-white text-ceq-navy
            placeholder-ceq-slateLight resize-none" />
      ) : (
        <input type="text" value={value ?? ''} placeholder={placeholder || ''}
          onChange={e => onChange(name, e.target.value)}
          className="w-full px-4 py-3 rounded-xl border-2 border-ceq-sky focus:border-ceq-teal
            focus:ring-2 focus:ring-ceq-teal/20 outline-none transition-all bg-white text-ceq-navy
            placeholder-ceq-slateLight" />
      )}
    </div>
  );
}

export function SelectField({ name, value, onChange, label, options, aide }) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold text-ceq-navy mb-1">{label}</label>
      {aide && <p className="text-xs text-ceq-slateLight mb-1.5 italic">{aide}</p>}
      <select value={value ?? ''} onChange={e => onChange(name, e.target.value)}
        className="w-full px-4 py-3 rounded-xl border-2 border-ceq-sky focus:border-ceq-teal
          focus:ring-2 focus:ring-ceq-teal/20 outline-none transition-all bg-white text-ceq-navy cursor-pointer">
        <option value="">—</option>
        {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  );
}

export function CheckField({ name, value, onChange, label, aide }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <input type="checkbox" id={name} checked={!!value} onChange={e => onChange(name, e.target.checked)}
        className="mt-0.5 w-5 h-5 accent-ceq-teal rounded cursor-pointer" />
      <div>
        <label htmlFor={name} className="block text-sm font-semibold text-ceq-navy cursor-pointer">{label}</label>
        {aide && <p className="text-xs text-ceq-slateLight mt-0.5 italic">{aide}</p>}
      </div>
    </div>
  );
}

export function InfoBox({ children, type = 'info' }) {
  const styles = {
    info:    'bg-ceq-teal/10 border-ceq-teal/30 text-ceq-tealDark',
    warn:    'bg-ceq-amber/10 border-ceq-amber/30 text-amber-800',
    success: 'bg-ceq-green/10 border-ceq-green/30 text-green-800',
  };
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm mb-5 ${styles[type] || styles.info}`}>
      {children}
    </div>
  );
}
