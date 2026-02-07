'use client';

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  multiline?: boolean;
  placeholder?: string;
  variant?: 'default' | 'dark' | 'warm' | 'editorial';
}

export const InputField = ({
  label,
  value,
  onChange,
  type = 'text',
  multiline = false,
  placeholder,
  variant = 'default',
}: InputFieldProps) => (
  <div>
    <label
      className={`block text-xs font-bold uppercase mb-1.5 ml-1 ${
        variant === 'dark'
          ? 'text-[#64748b]'
          : variant === 'warm'
            ? 'text-[#8b7355]'
            : variant === 'editorial'
              ? 'text-[#777777] tracking-[0.12em]'
              : 'text-slate-500 dark:text-slate-400'
      }`}
    >
      {label}
    </label>
    {multiline ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full p-3 transition-all text-sm min-h-[100px] resize-y focus:outline-none ${
          variant === 'dark'
            ? 'rounded-xl bg-[#06080f] border border-[#1e2736] focus:border-[#00e5a0]/60 text-[#e2e8f0]'
            : variant === 'warm'
              ? 'rounded-2xl bg-white border border-[#eadfce] focus:border-[#c96442] text-[#2c1810]'
              : variant === 'editorial'
                ? 'bg-white border border-[#dfdfdf] focus:border-[#c9a84c] text-[#111111]'
                : 'rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-200'
        }`}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full p-3 transition-all text-sm font-medium focus:outline-none ${
          variant === 'dark'
            ? 'rounded-xl bg-[#06080f] border border-[#1e2736] focus:border-[#00e5a0]/60 text-[#e2e8f0]'
            : variant === 'warm'
              ? 'rounded-2xl bg-white border border-[#eadfce] focus:border-[#c96442] text-[#2c1810]'
              : variant === 'editorial'
                ? 'bg-white border border-[#dfdfdf] focus:border-[#c9a84c] text-[#111111]'
                : 'rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-200'
        }`}
      />
    )}
  </div>
);
