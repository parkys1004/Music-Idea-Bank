import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Key, Upload, Download, Settings2, ArrowUp, ExternalLink, BookOpen } from 'lucide-react';
import { generateIdeaMetadata, generateLyrics, type MusicIdea, type LanguageConfig, setModel, getModel, getApiKey } from './services/ai';
import ApiKeyManager from './components/ApiKeyManager';
import SettingsPanel from './components/SettingsPanel';
import GenreGrid from './components/GenreGrid';
import ResultList from './components/ResultList';
import QuickJumpNav from './components/QuickJumpNav';
import ScrollToTop from './components/ScrollToTop';
import LoadingProgress from './components/LoadingProgress';
import UserGuide from './components/UserGuide';

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
  
  // User Guide state
  const [showUserGuide, setShowUserGuide] = useState(false);

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
    // Check if API Key is available
    const hasApiKey = getApiKey() || process.env.GEMINI_API_KEY;
    if (!hasApiKey) {
      setError("API 키가 등록되지 않았습니다. 우측 상단 열쇠 아이콘을 눌러 API 키를 등록해주세요.");
      setShowApiKeyManager(true);
      return;
    }

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

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
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
      <QuickJumpNav ideas={ideas} scrollToSection={scrollToSection} />

      {/* Scroll to Top Button (Right Bottom) */}
      <ScrollToTop showScrollTop={showScrollTop} scrollToTop={scrollToTop} />

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
          
          <div className="flex justify-center gap-4 mb-8 flex-wrap">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setShowUserGuide(true)}
              className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium border border-blue-500/20"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              사용 설명서
            </motion.button>

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
        <SettingsPanel
          showSettings={showSettings}
          ideasLength={ideas.length}
          isLoading={isLoading}
          mainLang={mainLang}
          setMainLang={setMainLang}
          subLang={subLang}
          setSubLang={setSubLang}
          langPercent={langPercent}
          setLangPercent={setLangPercent}
          vocalType={vocalType}
          setVocalType={setVocalType}
          currentModel={currentModel}
          handleModelChange={handleModelChange}
        />

        {/* Genre Selection Grid */}
        <GenreGrid
          ideasLength={ideas.length}
          isLoading={isLoading}
          handleGenreSelect={handleGenreSelect}
        />

        {/* Loading / Progress State */}
        <LoadingProgress
          isLoading={isLoading}
          statusMessage={statusMessage}
          progress={progress}
        />

        {/* Results Display */}
        <ResultList
          ideas={ideas}
          isLoading={isLoading}
          reset={reset}
          selectedGenre={selectedGenre}
          copyToClipboard={copyToClipboard}
          copiedId={copiedId}
        />

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

        {/* Kmong Button */}
        <div className="mt-24 flex justify-center pb-8">
          <a
            href="https://kmong.com/self-marketing/730531/ZQh4nXZpK5"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-6 py-3 rounded-xl bg-[#FFD400] text-[#333333] font-bold hover:bg-[#FFE033] transition-all hover:scale-105 shadow-lg shadow-yellow-500/10"
          >
            <span>크몽에서 전문가에게 의뢰하기</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
      <ApiKeyManager 
        isOpen={showApiKeyManager} 
        onClose={() => setShowApiKeyManager(false)} 
      />
      <UserGuide 
        isOpen={showUserGuide} 
        onClose={() => setShowUserGuide(false)} 
      />
    </div>
  );
}
