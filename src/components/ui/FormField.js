'use client';

export function NumberField({ name, value, onChange, label, unit, placeholder, aide, min = 0 }) {
  return (
    <div className="mb-5">
      <label htmlFor={name} className="label-ceq">{label}</label>
      {aide && <p className="text-xs text-ceq-slate/75 mb-1.5">{aide}</p>}
      <div className="relative">
        <input id={name} type="number" min={min} value={value ?? ''} placeholder={placeholder || ''}
          onChange={e => onChange(name, e.target.value === '' ? '' : Number(e.target.value))}
          className="input-ceq pr-16" />
        {unit && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-ceq-slate">
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
      <label htmlFor={name} className="label-ceq">
        {label}{required && <span className="ml-1 text-red-700">*</span>}
      </label>
      {aide && <p className="text-xs text-ceq-slate/75 mb-1.5">{aide}</p>}
      {rows ? (
        <textarea id={name} rows={rows} value={value ?? ''} placeholder={placeholder || ''}
          onChange={e => onChange(name, e.target.value)}
          className="input-ceq resize-none" />
      ) : (
        <input id={name} type="text" value={value ?? ''} placeholder={placeholder || ''}
          onChange={e => onChange(name, e.target.value)}
          className="input-ceq" />
      )}
    </div>
  );
}

export function SelectField({ name, value, onChange, label, options, aide }) {
  return (
    <div className="mb-5">
      <label htmlFor={name} className="label-ceq">{label}</label>
      {aide && <p className="text-xs text-ceq-slate/75 mb-1.5">{aide}</p>}
      <select id={name} value={value ?? ''} onChange={e => onChange(name, e.target.value)}
        className="input-ceq cursor-pointer">
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
        className="mt-0.5 h-4 w-4 cursor-pointer accent-ceq-slate" />
      <div>
        <label htmlFor={name} className="block text-sm font-semibold text-ceq-dark cursor-pointer">{label}</label>
        {aide && <p className="mt-0.5 text-xs text-ceq-slate/75">{aide}</p>}
      </div>
    </div>
  );
}

export function InfoBox({ children, type = 'info' }) {
  const styles = {
    info:    'bg-slate-50 border-slate-200 text-ceq-slate',
    warn:    'bg-amber-50 border-amber-200 text-amber-900',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
  };
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm mb-5 ${styles[type] || styles.info}`}>
      {children}
    </div>
  );
}
