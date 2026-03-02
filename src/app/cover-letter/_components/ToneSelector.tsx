'use client';

interface ToneSelectorProps {
  value: string;
  onChange: (tone: string) => void;
}

const TONES = [
  {
    id: 'professional',
    label: 'Professional',
    description: 'Formal and polished',
  },
  {
    id: 'conversational',
    label: 'Conversational',
    description: 'Warm and approachable',
  },
  {
    id: 'confident',
    label: 'Confident',
    description: 'Bold and assertive',
  },
  {
    id: 'enthusiastic',
    label: 'Enthusiastic',
    description: 'Energetic and passionate',
  },
] as const;

export const ToneSelector = ({ value, onChange }: ToneSelectorProps) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {TONES.map((tone) => {
        const isSelected = value === tone.id;
        return (
          <button
            key={tone.id}
            type="button"
            onClick={() => onChange(tone.id)}
            className={`rounded-xl border px-3 py-2.5 text-left transition-all ${
              isSelected
                ? 'border-[#c96442] bg-[#fff1e8]'
                : 'border-[#eadfce] bg-white hover:border-[#d9cbb8]'
            }`}
          >
            <p
              className={`text-xs font-bold ${
                isSelected ? 'text-[#c96442]' : 'text-[#2c1810]'
              }`}
            >
              {tone.label}
            </p>
            <p className="text-[10px] text-[#8b7355] mt-0.5">{tone.description}</p>
          </button>
        );
      })}
    </div>
  );
};
