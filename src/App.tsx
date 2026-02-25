import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Sparkles, Disc, Mic2, Loader2, RefreshCw, ChevronRight, Copy, Check, Wand2, Download, History as HistoryIcon, Zap, Radio, Piano, Headphones, Upload, Settings2, Globe, User, ArrowUp, Menu, Guitar, Film, Cloud, Mic, Drum, Baby, Key, Cpu } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { generateIdeaMetadata, generateLyrics, type MusicIdea, type LanguageConfig, AVAILABLE_MODELS, setModel, getModel } from './services/ai';
import ApiKeyManager from './components/ApiKeyManager';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const GENRES = [
  { id: 'kpop', name: 'K-Pop', icon: Sparkles, color: 'from-pink-500 to-rose-500' },
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

const LANGUAGES = [
  { code: 'Korean', label: '한국어' },
  { code: 'English', label: '영어' },
  { code: 'Japanese', label: '일본어' },
  { code: 'Chinese', label: '중국어' },
  { code: 'Spanish', label: '스페인어' },
  { code: 'French', label: '프랑스어' },
];

const VOCAL_TYPES = [
  { id: 'Female', label: '여성 보컬' },
  { id: 'Male', label: '남성 보컬' },
  { id: 'Duet', label: '혼성 듀엣' },
  { id: 'Group', label: '그룹/합창' },
  { id: 'Robotic', label: '로봇/오토튠' },
  { id: 'Instrumental', label: '연주곡 (보컬 없음)' },
];

export default function App() {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ideas, setIdeas] = useState<MusicIdea[]>([]);
  const [history, setHistory] = useState<MusicIdea[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Settings State
  const [mainLang, setMainLang] = useState('Korean');
  const [subLang, setSubLang] = useState('None');
  const [langPercent, setLangPercent] = useState(70);
  const [vocalType, setVocalType] = useState('Female');
  const [showSettings, setShowSettings] = useState(true);
  const [currentModel, setCurrentModel] = useState(getModel());

  const handleModelChange = (modelId: string) => {
    setModel(modelId);
    setCurrentModel(modelId);
  };

  // Progress state
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");

  // Scroll to top state
  const [showScrollTop, setShowScrollTop] = useState(false);

  // API Key Manager state
  const [showApiKeyManager, setShowApiKeyManager] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (index: number) => {
    const element = document.getElementById(`idea-${index}`);
    if (element) {
      const offset = 100; // Header offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleGenreSelect = async (genreName: string) => {
    setSelectedGenre(genreName);
    setIsLoading(true);
    setError(null);
    setIdeas([]);
    setProgress(0);
    setStatusMessage("아이디어 구상 중...");

    const langConfig: LanguageConfig = {
      main: mainLang,
      sub: subLang,
      mainPercent: langPercent
    };

    try {
      // Step 1: Generate Metadata (Titles & Styles)
      const metadata = await generateIdeaMetadata(genreName, vocalType);
      
      // Initialize ideas with metadata and empty lyrics
      const initialIdeas = metadata.map(m => ({ ...m, lyrics: "", genre: genreName }));
      setIdeas(initialIdeas);
      
      setProgress(20); // Metadata loaded
      setStatusMessage("가사 작사 중...");

      // Step 2: Generate Lyrics in Parallel
      let completedCount = 0;
      const totalLyrics = initialIdeas.length;
      const finalIdeas = [...initialIdeas];

      const lyricPromises = initialIdeas.map(async (idea, index) => {
        try {
          const lyrics = await generateLyrics(genreName, idea.title, idea.stylePrompt, langConfig);
          
          // Update State for UI
          setIdeas(prev => {
            const newIdeas = [...prev];
            newIdeas[index] = { ...newIdeas[index], lyrics };
            return newIdeas;
          });

          // Update local array for history
          finalIdeas[index] = { ...idea, lyrics };

          completedCount++;
          const currentProgress = 20 + (completedCount / totalLyrics) * 80;
          setProgress(Math.round(currentProgress));
        } catch (err) {
          console.error(`Failed to generate lyrics for ${idea.title}`, err);
        }
      });

      await Promise.all(lyricPromises);
      
      // Add completed batch to history
      setHistory(prev => [...prev, ...finalIdeas]);
      setStatusMessage("완료!");

    } catch (err: any) {
      if (err.message === "QUOTA_EXCEEDED") {
        setError('API 사용 한도가 초과되었습니다. 우측 상단 열쇠 아이콘을 눌러 새로운 API Key를 등록하거나 잠시 후 다시 시도해주세요.');
      } else {
        setError('아이디어를 생성하는 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setSelectedGenre(null);
    setIdeas([]);
    setError(null);
    setCopiedId(null);
    setProgress(0);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadHistory = () => {
    const dataToDownload = history.length > 0 ? history : ideas;
    if (dataToDownload.length === 0) return;

    const now = new Date();
    const timestamp = now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') + "_" +
      now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0') +
      now.getSeconds().toString().padStart(2, '0');

    let genreName = "MusicIdeas";
    if (selectedGenre) {
        genreName = selectedGenre;
    } else if (dataToDownload[0]?.genre) {
        genreName = dataToDownload[0].genre;
    }
    
    // Remove spaces and special characters for filename safety
    genreName = genreName.replace(/[^a-zA-Z0-9가-힣]/g, "");

    const fileName = `${genreName}_${timestamp}.json`;

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToDownload, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", fileName);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content) as MusicIdea[];
        
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].title && parsed[0].stylePrompt) {
            setIdeas(parsed);
            setSelectedGenre("가져온 아이디어");
            setHistory(prev => [...prev, ...parsed]);
        } else {
            alert("올바르지 않은 JSON 파일 형식입니다.");
        }
      } catch (err) {
        console.error(err);
        alert("파일을 읽는 중 오류가 발생했습니다.");
      }
    };
    reader.readAsText(file);
    event.target.value = ''; 
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#050505] text-white selection:bg-purple-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-900/20 rounded-full blur-[120px]" />
      </div>

      {/* Fixed Navigation Menu (Left Top) */}
      <AnimatePresence>
        {ideas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="fixed top-8 left-8 z-50 hidden xl:block"
          >
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 space-y-2">
              <div className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3 px-2">
                Quick Jump
              </div>
              {ideas.map((idea, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToSection(idx)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-sm text-white/70 hover:text-white transition-colors flex items-center group"
                >
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] mr-3 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                    {idx + 1}
                  </span>
                  <span className="truncate max-w-[120px]">{idea.title}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to Top Button (Right Bottom) */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-500 transition-colors border border-white/20"
            whileHover={{ y: -5 }}
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-20">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60">
            뮤직 아이디어 뱅크
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            장르를 선택하면 AI가 제목, 가사, 그리고 스타일 프롬프트까지 생성해드립니다.
          </p>
          
          <div className="flex justify-center gap-4 mb-8">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setShowApiKeyManager(true)}
              className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium border border-emerald-500/20"
            >
              <Key className="w-4 h-4 mr-2" />
              API Key 관리
            </motion.button>

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept=".json" 
              className="hidden" 
            />
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors text-sm font-medium border border-white/10"
            >
              <Upload className="w-4 h-4 mr-2" />
              JSON 불러오기
            </motion.button>

            {history.length > 0 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={downloadHistory}
                className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors text-sm font-medium border border-white/10"
              >
                <Download className="w-4 h-4 mr-2" />
                전체 히스토리 다운로드 ({history.length}개)
              </motion.button>
            )}
          </div>

          {/* Settings Toggle */}
          {!ideas.length && !isLoading && (
            <div className="flex justify-center">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center text-white/60 hover:text-white transition-colors text-sm"
              >
                <Settings2 className="w-4 h-4 mr-2" />
                {showSettings ? '설정 닫기' : '생성 옵션 설정 (언어/보컬/모델)'}
              </button>
            </div>
          )}
        </motion.div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && !ideas.length && !isLoading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-12 max-w-2xl mx-auto"
            >
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                {/* Language Settings */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-white/90 font-medium">
                    <Globe className="w-4 h-4 text-blue-400" />
                    가사 언어 설정
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-white/50 mb-1.5 ml-1">메인 언어</label>
                      <select
                        value={mainLang}
                        onChange={(e) => setMainLang(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50"
                      >
                        {LANGUAGES.map(lang => (
                          <option key={lang.code} value={lang.code}>{lang.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-white/50 mb-1.5 ml-1">서브 언어 (옵션)</label>
                      <select
                        value={subLang}
                        onChange={(e) => setSubLang(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50"
                      >
                        <option value="None">선택 안함</option>
                        {LANGUAGES.filter(l => l.code !== mainLang).map(lang => (
                          <option key={lang.code} value={lang.code}>{lang.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {subLang !== 'None' && (
                    <div className="pt-2">
                      <div className="flex justify-between text-xs text-white/50 mb-2">
                        <span>{LANGUAGES.find(l => l.code === mainLang)?.label} {langPercent}%</span>
                        <span>{LANGUAGES.find(l => l.code === subLang)?.label} {100 - langPercent}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="90"
                        step="10"
                        value={langPercent}
                        onChange={(e) => setLangPercent(Number(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                      />
                    </div>
                  )}
                </div>

                <div className="h-px bg-white/10" />

                {/* Vocal Settings */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-white/90 font-medium">
                    <User className="w-4 h-4 text-pink-400" />
                    보컬 타입
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {VOCAL_TYPES.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setVocalType(type.id)}
                        className={cn(
                          "px-3 py-2 rounded-xl text-sm transition-all border",
                          vocalType === type.id
                            ? "bg-purple-500/20 border-purple-500/50 text-white"
                            : "bg-black/20 border-transparent text-white/60 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                {/* AI Model Settings */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-white/90 font-medium">
                    <Cpu className="w-4 h-4 text-emerald-400" />
                    AI 모델 선택
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {AVAILABLE_MODELS.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => handleModelChange(model.id)}
                        className={cn(
                          "px-3 py-2 rounded-xl text-sm transition-all border text-left",
                          currentModel === model.id
                            ? "bg-emerald-500/20 border-emerald-500/50 text-white"
                            : "bg-black/20 border-transparent text-white/60 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        {model.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Genre Selection Grid */}
        <AnimatePresence mode="wait">
          {ideas.length === 0 && !isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto"
            >
              {GENRES.map((genre) => (
                <motion.button
                  key={genre.id}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleGenreSelect(genre.name)}
                  className="group relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-6 md:p-8 text-left transition-all hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-purple-500/10"
                >
                  <div className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br",
                    genre.color
                  )} />
                  
                  <div className="relative z-10 flex flex-col h-full justify-between min-h-[140px]">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br shadow-lg",
                      genre.color
                    )}>
                      <genre.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">{genre.name}</h3>
                      <div className="flex items-center text-white/40 text-sm font-medium group-hover:text-white/80 transition-colors">
                        생성하기 <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading / Progress State */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <div className="w-full max-w-md space-y-4">
                <div className="flex justify-between text-sm font-medium text-white/80">
                  <span>{statusMessage}</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", stiffness: 50, damping: 20 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Display */}
        <AnimatePresence>
          {ideas.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              {/* Navigation / Reset (Only show when fully done or at least metadata exists) */}
              {!isLoading && (
                <div className="flex items-center justify-between">
                  <button 
                    onClick={reset}
                    className="flex items-center text-white/60 hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-white/5"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    다른 장르 선택하기
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-200 text-sm font-medium">
                      {selectedGenre}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid gap-8">
                {ideas.map((idea, idx) => (
                  <motion.div
                    id={`idea-${idx}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={idx}
                    className="rounded-3xl bg-white/5 border border-white/10 overflow-hidden hover:border-white/20 transition-all scroll-mt-32"
                  >
                    {/* Card Header: Title */}
                    <div className="p-6 md:p-8 border-b border-white/5 bg-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 group/title">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 font-bold font-mono">
                          {idx + 1}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white">{idea.title}</h2>
                        <button
                          onClick={() => copyToClipboard(idea.title, `${idx}-title`)}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-white/20 group-hover/title:text-white/60 hover:text-white transition-colors"
                          title="제목 복사"
                        >
                          {copiedId === `${idx}-title` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      
                      {/* Style Prompt Section */}
                      <div className="flex-1 md:max-w-xl">
                        <div className="relative group">
                          <div className="absolute inset-0 bg-emerald-500/10 rounded-xl blur-sm group-hover:bg-emerald-500/20 transition-all" />
                          <div className="relative bg-[#0A0A0A] border border-white/10 rounded-xl p-3 pr-10 flex items-center">
                            <Wand2 className="w-4 h-4 text-emerald-400 mr-3 shrink-0" />
                            <p className="text-sm text-white/70 truncate font-mono">{idea.stylePrompt}</p>
                            <button
                              onClick={() => copyToClipboard(idea.stylePrompt, `${idx}-style`)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                              title="스타일 프롬프트 복사"
                            >
                              {copiedId === `${idx}-style` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Body: Lyrics */}
                    <div className="p-6 md:p-8 relative group/lyrics">
                      <div className="absolute top-6 right-6 opacity-0 group-hover/lyrics:opacity-100 transition-opacity">
                         <button
                          onClick={() => copyToClipboard(idea.lyrics, `${idx}-lyrics`)}
                          className="flex items-center px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors text-xs font-medium backdrop-blur-sm"
                        >
                          {copiedId === `${idx}-lyrics` ? (
                            <>
                              <Check className="w-3 h-3 mr-1.5 text-emerald-400" />
                              복사됨
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 mr-1.5" />
                              가사 복사
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex items-start gap-4">
                        <Mic2 className="w-5 h-5 text-blue-400 mt-1 shrink-0" />
                        <div className="space-y-2 w-full">
                          <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-2">Lyrics</h3>
                          {idea.lyrics ? (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="whitespace-pre-wrap text-white/90 leading-relaxed font-light text-lg"
                            >
                              {idea.lyrics}
                            </motion.div>
                          ) : (
                            <div className="flex items-center space-x-2 text-white/30 py-4">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>가사 생성 중...</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={reset}
              className="text-white underline underline-offset-4 hover:text-white/80"
            >
              다시 시도하기
            </button>
          </div>
        )}
      </div>
      <ApiKeyManager 
        isOpen={showApiKeyManager} 
        onClose={() => setShowApiKeyManager(false)} 
      />
    </div>
  );
}
