'use client';

import { useId, useState } from 'react';
import { Info } from 'lucide-react';

export default function InfoTooltip({ text, label }) {
  const tooltipId = useId();
  const [open, setOpen] = useState(false);

  return (
    <span className="group relative ml-1 inline-flex align-middle">
      <button
        type="button"
        aria-label={label}
        aria-describedby={tooltipId}
        aria-expanded={open}
        onClick={() => setOpen(value => !value)}
        onKeyDown={event => {
          if (event.key === 'Escape') setOpen(false);
        }}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-ceq-slate hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ceq-cyan"
      >
        <Info size={12} aria-hidden="true" />
      </button>
      <span
        id={tooltipId}
        role="tooltip"
        className={`pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-60 -translate-x-1/2 rounded-md bg-gray-800 px-3 py-2 text-left text-xs font-normal normal-case leading-relaxed text-white shadow-lg ${
          open ? 'block' : 'hidden group-hover:block group-focus-within:block'
        }`}
      >
        {text}
      </span>
    </span>
  );
}
