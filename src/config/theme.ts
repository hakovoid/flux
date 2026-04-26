export type AccentName = 'indigo' | 'violet' | 'emerald' | 'green' | 'rose' | 'amber' | 'orange' | 'red';

export interface AccentPalette {
  c500: string;
  c400: string;
  c600: string;
  c300: string;
  glow: string;
  from: string;
  to: string;
}

export const palettes: Record<AccentName, AccentPalette> = {
  indigo:  { c500: '#6366f1', c400: '#818cf8', c600: '#4f46e5', c300: '#a5b4fc', glow: '#6366f140', from: '#6366f1', to: '#9333ea' },
  violet:  { c500: '#8b5cf6', c400: '#a78bfa', c600: '#7c3aed', c300: '#c4b5fd', glow: '#8b5cf640', from: '#8b5cf6', to: '#6d28d9' },
  emerald: { c500: '#10b981', c400: '#34d399', c600: '#059669', c300: '#6ee7b7', glow: '#10b98140', from: '#10b981', to: '#065f46' },
  green:   { c500: '#22c55e', c400: '#4ade80', c600: '#16a34a', c300: '#86efac', glow: '#22c55e40', from: '#22c55e', to: '#14532d' },
  rose:    { c500: '#f43f5e', c400: '#fb7185', c600: '#e11d48', c300: '#fda4af', glow: '#f43f5e40', from: '#f43f5e', to: '#9f1239' },
  amber:   { c500: '#f59e0b', c400: '#fbbf24', c600: '#d97706', c300: '#fcd34d', glow: '#f59e0b40', from: '#f59e0b', to: '#92400e' },
  orange:  { c500: '#f97316', c400: '#fb923c', c600: '#ea580c', c300: '#fdba74', glow: '#f9731640', from: '#f97316', to: '#c2410c' },
  red:     { c500: '#ef4444', c400: '#f87171', c600: '#dc2626', c300: '#fca5a5', glow: '#ef444440', from: '#ef4444', to: '#991b1b' },
};

export function getAccentPalette(): AccentPalette {
  const name = (process.env.FLUX_ACCENT ?? 'indigo') as AccentName;
  return palettes[name] ?? palettes.indigo;
}
