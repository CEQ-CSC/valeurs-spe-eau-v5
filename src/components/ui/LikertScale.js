'use client'
export default function LikertScale({ name, value, onChange, label, aide, options }) {
  const opts = options || [{v:1,l:'1'},{v:2,l:'2'},{v:3,l:'3'},{v:4,l:'4'},{v:5,l:'5'}];
  return (
    <div className="mb-5">
      <label className="label-ceq">{label}</label>
      {aide && <p className="text-xs text-ceq-slate mb-2 italic">{aide}</p>}
      <div className="flex gap-1.5 flex-wrap">
        {opts.map(opt=>(
          <button key={opt.v} type="button" onClick={()=>onChange(name,opt.v)}
            className={`likert-btn ${value===opt.v?'active':''}`}>
            <span className="block text-lg font-bold mb-0.5 leading-none">{opt.v}</span>
            <span className="leading-tight block text-[10px]">{opt.l}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
