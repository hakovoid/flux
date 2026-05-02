export type AccentName = 'indigo' | 'violet' | 'emerald' | 'green' | 'rose' | 'pink' | 'amber' | 'orange' | 'red' | 'blue' | 'sky' | 'yellow';

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
  pink:    { c500: '#ec4899', c400: '#f472b6', c600: '#db2777', c300: '#f9a8d4', glow: '#ec489940', from: '#ec4899', to: '#9d174d' },
  amber:   { c500: '#f59e0b', c400: '#fbbf24', c600: '#d97706', c300: '#fcd34d', glow: '#f59e0b40', from: '#f59e0b', to: '#92400e' },
  orange:  { c500: '#ff6b00', c400: '#ff8533', c600: '#cc5500', c300: '#ffa366', glow: '#ff6b0040', from: '#ff6b00', to: '#993f00' },
  red:     { c500: '#ef4444', c400: '#f87171', c600: '#dc2626', c300: '#fca5a5', glow: '#ef444440', from: '#ef4444', to: '#991b1b' },
  blue:    { c500: '#3b82f6', c400: '#60a5fa', c600: '#2563eb', c300: '#93c5fd', glow: '#3b82f640', from: '#3b82f6', to: '#1e3a8a' },
  sky:     { c500: '#0ea5e9', c400: '#38bdf8', c600: '#0284c7', c300: '#7dd3fc', glow: '#0ea5e940', from: '#0ea5e9', to: '#075985' },
  yellow:  { c500: '#eab308', c400: '#facc15', c600: '#ca8a04', c300: '#fde047', glow: '#eab30840', from: '#eab308', to: '#854d0e' },
};

export function getAccentPalette(): AccentPalette {
  const name = (process.env.FLUX_ACCENT ?? 'indigo') as AccentName;
  return palettes[name] ?? palettes.indigo;
}
