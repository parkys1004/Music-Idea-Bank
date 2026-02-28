import { Music, Sparkles, Disc, Mic2, Zap, Radio, Piano, Headphones, Guitar, Film, Cloud, Mic, Drum, Baby } from 'lucide-react';

export const GENRES = [
  { id: 'kpop', name: 'K-Pop', icon: Sparkles, color: 'from-pink-500 to-rose-500' },
  { id: 'popdance', name: 'Pop Dance', icon: Zap, color: 'from-pink-400 to-purple-500' },
  { id: 'hiphopdance', name: 'Hip-hop Dance', icon: Disc, color: 'from-orange-500 to-red-500' },
  { id: 'synthpop', name: 'Synth-pop', icon: Radio, color: 'from-indigo-400 to-cyan-500' },
  { id: 'ballad', name: '발라드', icon: Mic2, color: 'from-blue-400 to-indigo-500' },
  { id: 'hiphop', name: '힙합', icon: Disc, color: 'from-orange-500 to-red-600' },
  { id: 'rnb', name: 'R&B', icon: Music, color: 'from-purple-500 to-violet-600' },
  { id: 'indie', name: '인디/포크', icon: Music, color: 'from-green-400 to-emerald-600' },
  { id: 'rock', name: '락', icon: Disc, color: 'from-yellow-400 to-orange-500' },
  { id: 'edm', name: 'EDM', icon: Zap, color: 'from-cyan-400 to-blue-600' },
  { id: 'jazz', name: '재즈', icon: Music, color: 'from-amber-500 to-orange-700' },
  { id: 'trot', name: '트로트', icon: Sparkles, color: 'from-yellow-400 to-red-500' },
  { id: 'citypop', name: '시티팝', icon: Radio, color: 'from-fuchsia-400 to-indigo-500' },
  { id: 'classical', name: '클래식', icon: Piano, color: 'from-slate-500 to-gray-700' },
  { id: 'lofi', name: 'Lo-Fi', icon: Headphones, color: 'from-indigo-300 to-purple-400' },
  { id: 'acoustic', name: '통기타', icon: Guitar, color: 'from-amber-300 to-orange-400' },
  { id: 'ost', name: 'OST', icon: Film, color: 'from-teal-400 to-emerald-500' },
  { id: 'newage', name: '뉴에이지', icon: Cloud, color: 'from-sky-300 to-blue-400' },
  { id: 'pansori', name: '판소리', icon: Mic, color: 'from-stone-500 to-orange-700' },
  { id: 'gugak', name: '국악', icon: Drum, color: 'from-emerald-600 to-teal-700' },
  { id: 'dongyo', name: '동요', icon: Baby, color: 'from-yellow-300 to-green-400' },
];

export const LANGUAGES = [
  { code: 'Korean', label: '한국어' },
  { code: 'English', label: '영어' },
  { code: 'Japanese', label: '일본어' },
  { code: 'Chinese', label: '중국어' },
  { code: 'Spanish', label: '스페인어' },
  { code: 'French', label: '프랑스어' },
];

export const VOCAL_TYPES = [
  { id: 'Female', label: '여성 보컬' },
  { id: 'Male', label: '남성 보컬' },
  { id: 'Duet', label: '혼성 듀엣' },
  { id: 'Group', label: '그룹/합창' },
  { id: 'Robotic', label: '로봇/오토튠' },
  { id: 'Instrumental', label: '연주곡 (보컬 없음)' },
];
