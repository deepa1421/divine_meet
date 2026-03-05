import { useEffect, useRef, useState } from "react";
import namanLogo from "@/assets/naman-logo.webp";
import ChatPanel from "@/components/ChatPanel";
import { Maximize, Minimize, Volume2, Globe, MessageSquare, X, Users } from "lucide-react";

export default function MeetingRoom() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastLine = useRef<number>(-1);

  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [chantCount, setChantCount] = useState<number>(0);
  const [currentLine, setCurrentLine] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [onlineCount, setOnlineCount] = useState(108);
  const [showLogin, setShowLogin] = useState(false);

  const day = new Date().getDay();

  const mantras: Record<number, any> = {
    0: {
      title: "☀️ Surya Bhagwan Mantra (Daily Jaap)",
      audio: "/audio/sunday.mp3.mp3",
      image: "/images/surya_bhagwan.sunday.png",
      deity: "surya",
      chantDuration: 10.0,
      timings: [[2.0, 5.8], [6.0, 9.8]],
      subtitles: {
        en: ["Om Ghrini Suriyaya Namaha", "Om Hrim Srim Suriyaya Namaha"],
        hi: ["ॐ घृणि सूर्याय नमः", "ॐ ह्रीं श्रीं सूर्याय नमः"],
      },
    },
    1: {
      title: "🔱 Maha Mrityunjay Jaap (108 Times)",
      audio: "/audio/monday.mp3.mp3",
      image: "/images/lordshiva.monday.jpg",
      deity: "shiva",
      chantDuration: 20.6,
      timings: [[3.0, 6.8], [7.0, 9.6], [9.8, 12.4], [12.6, 20.2]],
      subtitles: {
        en: [
          "Om Tryambakam Yajamahe",
          "Sugandhim Pushtivardhanam",
          "Urvarukamiva Bandhanan",
          "Mrityor Mukshiya Maamritat",
        ],
        hi: [
          "ॐ त्र्यम्बकं यजामहे",
          "सुगन्धिं पुष्टिवर्धनम्",
          "उर्वारुकमिव बन्धनान्",
          "मृत्योर्मुक्षीय मामृतात्",
        ],
      },
    },
    2: {
      title: "🐒 Hanuman Chalisa (108 Times)",
      audio: "/audio/tuesday.mp3.mp3",
      image: "/images/hanumanji.tuesday.jpg",
      deity: "hanuman",
      chantDuration: 40.0,
      timings: [[2.0, 9.5], [10.0, 19.5], [20.0, 29.5], [30.5, 39.5]],
      subtitles: {
        en: [
          "Shri Guru Charan Saroj Raj",
          "Nij Man Mukur Sudhari",
          "Barnau Raghubar Bimal Jasu",
          "Jo Dayaku Phal Chari",
        ],
        hi: [
          "श्रीगुरु चरण सरोज रज",
          "निज मनु मुकुरु सुधारि",
          "बरनउँ रघुबर बिमल जसु",
          "जो दायकु फल चारि",
        ],
      },
    },
    3: {
      title: "🐘 Ganesh Chaturthi Satsang",
      audio: "/audio/wednesday.mp3.mp3",
      image: "/images/lordganesh.wednesday.jpg",
      deity: "ganesh",
      chantDuration: 25.0,
      timings: [[2.0, 7.8], [8.0, 13.8], [14.0, 19.8], [20.5, 24.8]],
      subtitles: {
        en: [
          "Gan-nāyakāya gan-daivatāya Ganādhyakṣāya dhīmahi",
          "Guṇa-śarīrāya guṇa-maṇḍitāya Guṇeśānāya dhīmahi",
          "Vakra-tuṇḍāya dhūmra-ketave Ganādhyakṣāya dhīmahi",
          "Ekadantāya vakra-tuṇḍāya Gaurī-tanayāya dhīmahi",
        ],
        hi: [
          "गणनायकाय गणदैवताय गणाध्यक्षाय धीमहि।",
          "गुणशरीराय गुणमण्डिताय गुणेशानाय धीमहि॥",
          "वक्रतुण्डाय धूम्रकेतवे गणाध्यक्षाय धीमहि।",
          "एकदन्ताय वक्रतुण्डाय गौरीतनयाय धीमहि।",
        ],
      },
    },
    4: {
      title: "🙏 Guru Brihaspati Mantra",
      audio: "/audio/thursday.mp3.mp3",
      image: "/images/gurubrihaspati.thursday.png",
      deity: "guru",
      chantDuration: 20.0,
      timings: [[2.0, 5.8], [6.0, 9.8], [10.0, 13.8], [14.0, 19.8]],
      subtitles: {
        en: [
          "Gurur Brahma Gurur Vishnu",
          "Gurur Devo Maheshwarah",
          "Guru Sakshat Param Brahma",
          "Tasmai Shri Gurave Namah",
        ],
        hi: [
          "गुरुर्ब्रह्मा गुरुर्विष्णुः",
          "गुरुर्देवो महेश्वरः",
          "गुरुः साक्षात् परब्रह्म",
          "तस्मै श्रीगुरवे नमः",
        ],
      },
    },
    5: {
      title: "🌺 Gayatri Mantra (108 Times)",
      audio: "/audio/friday.mp3.mp3",
      image: "/images/gayatrimata.friday.jpg",
      deity: "gayatri",
      chantDuration: 15.0,
      timings: [[2.0, 4.8], [5.0, 7.8], [8.0, 10.8], [11.0, 14.8]],
      subtitles: {
        en: [
          "Om Bhur Bhuvah Swaha",
          "Tat Savitur Varenyam",
          "Bhargo Devasya Dheemahi",
          "Dhiyo Yo Nah Prachodayat",
        ],
        hi: [
          "ॐ भूर्भुवः स्वः",
          "तत्सवितुर्वरेण्यं",
          "भर्गो देवस्य धीमहि",
          "धियो यो नः प्रचोदयात्",
        ],
      },
    },
    6: {
      title: "🛡️ Kalabhairav Ashtakam",
      audio: "/audio/saturday.mp3.mp3",
      image: "/images/kalabhairav.saturday.png",
      deity: "kalabhairav",
      chantDuration: 25.0,
      timings: [[2.0, 9.8], [10.5, 20.5]],
      subtitles: {
        en: [
          "Deva-Raja-Sevyamana-Pavanamghri-Pankajam",
          "Vyala-Yajia-Sutram-Indu-Shekharam-Kripakaram",
        ],
        hi: [
          "देवराजसेव्यमानपावनांघ्रिपंकजं",
          "व्यालयज्ञसूत्रमिन्दुशेखरं कृपाकरम्",
        ],
      },
    },
  };

  const todayMantra = mantras[day] || mantras[0];

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // 🔢 Dynamic Online Count
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount((prev) => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // 🔊 Autoplay Audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = todayMantra.audio;
    audio.load();
    audio.volume = 1;

    audio.play().catch(() => {
      const resume = () => {
        audio.play();
        document.removeEventListener("click", resume);
      };
      document.addEventListener("click", resume);
    });
  }, [todayMantra.audio]);

  // 🔥 Smooth Sync (No Lag)
  useEffect(() => {
    let frame: number;

    const sync = () => {
      const audio = audioRef.current;

      if (!audio || !todayMantra.chantDuration || !todayMantra.timings) {
        frame = requestAnimationFrame(sync);
        return;
      }

      const currentTime = audio.currentTime;
      const chantDuration = todayMantra.chantDuration;
      const chantIndex = Math.floor(currentTime / chantDuration);
      const timeInsideChant = currentTime % chantDuration;

      let lineIndex = -1;
      for (let i = 0; i < todayMantra.timings.length; i++) {
        const [start, end] = todayMantra.timings[i];
        if (timeInsideChant >= start && timeInsideChant <= end) {
          lineIndex = i;
          break;
        }
      }

      setChantCount(Math.min(chantIndex, 108));
      setCurrentLine(lineIndex);

      if (lineIndex !== lastLine.current && lineIndex !== -1) {
        console.log("[MeetingRoom] Lyric change:", {
          lineIndex,
          text: todayMantra.subtitles[language][lineIndex],
          timeInsideChant
        });
        lastLine.current = lineIndex;
      }

      frame = requestAnimationFrame(sync);
    };

    frame = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(frame);
  }, [todayMantra]);

  // 🚪 Show Login Form after 5 chants
  useEffect(() => {
    if (chantCount >= 5 && !showLogin) {
      setShowLogin(true);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [chantCount, showLogin]);

  return (
    <div ref={containerRef} className="flex flex-col h-screen bg-background overflow-hidden selection:bg-saffron/30">

      {/* TOP BAR - Glass Style */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/5 bg-black/40 backdrop-blur-md z-50">
        <div className="flex items-center gap-3 md:gap-5">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-saffron to-temple-gold rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000" />
            <img src={namanLogo} alt="Naman Darshan" className="relative h-7 md:h-10 w-auto" />
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-sm md:text-base font-bold text-foreground truncate tracking-tight">
              {todayMantra.title}
            </h1>
            <div className="flex items-center gap-2">
              <p className="text-[10px] md:text-xs text-muted-foreground truncate font-medium">
                Live • Naman Darshan Virtual Temple
              </p>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[10px] text-muted-foreground hidden sm:flex">
                <Users size={10} className="text-primary" />
                <span>{onlineCount} joined</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <span className="inline-flex items-center gap-1.5 text-[10px] md:text-xs font-bold bg-destructive/10 text-destructive border border-destructive/20 px-3 py-1 rounded-full uppercase tracking-wider">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-destructive animate-pulse" />
            LIVE
          </span>
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-white/10 rounded-xl transition-all hidden md:block border border-white/5"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Mantra Section */}
        <div className="flex flex-col flex-1 relative overflow-hidden">

          {/* Background Image with Ken Burns Effect */}
          <div
            className="absolute inset-0 bg-cover md:bg-contain bg-center bg-no-repeat animate-ken-burns scale-110"
            style={{ backgroundImage: `url(${todayMantra.image})` }}
          />
          <div className="absolute inset-0 bg-black/60 md:bg-black/30 backdrop-brightness-75" />

          {/* Subtle Ambient Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

          {/* Foreground Content */}
          <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 md:px-12">

            {/* Subtitles (Sanskrit PPT Style) */}
            <div className="text-center relative h-48 md:h-64 flex items-center justify-center max-w-5xl">
              {/* Mandala Background behind lyrics */}
              <div className="absolute inset-0 flex items-center justify-center opacity-10 animate-spin-slow pointer-events-none">
                <img src="/images/mandala.png" alt="" className="w-64 h-64 md:w-[32rem] md:h-[32rem] object-contain" />
              </div>

              {todayMantra.subtitles[language].map(
                (line: string, index: number) => (
                  <div
                    key={index}
                    className={`absolute transition-all duration-1000 ease-out transform text-center px-6 ${index === currentLine
                      ? "scale-100 opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8 scale-95 pointer-events-none"
                      }`}
                  >
                    <span className={`block font-sanskrit font-bold text-2xl md:text-5xl tracking-[0.05em] leading-[1.6]
                      ${index === currentLine
                        ? "bg-gradient-to-r from-[#FFCC33] via-[#FF9933] {to-[#FFCC33] bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] active-lyric-glow"
                        : "text-transparent"
                      }`}>
                      {line}
                    </span>
                    {index === currentLine && (
                      <div className="flex items-center justify-center gap-4 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                        <div className="h-[1px] w-12 md:w-24 bg-gradient-to-r from-transparent via-saffron/50 to-transparent" />
                        <span className="text-saffron/60 text-xl font-display">🕉️</span>
                        <div className="h-[1px] w-12 md:w-24 bg-gradient-to-l from-transparent via-saffron/50 to-transparent" />
                      </div>
                    )}
                  </div>
                )
              )}
            </div>

            {/* Chant Counting Ring/Capsule */}
            <div className="mt-12 md:mt-20 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-saffron to-temple-gold rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500" />
              <div className="relative flex items-center gap-3 bg-black/60 backdrop-blur-xl px-8 py-3.5 rounded-full border border-white/20 shadow-2xl">
                <span className="text-xl md:text-2xl animate-spin-slow">📿</span>
                <span className="text-base md:text-xl font-black tracking-widest text-white decoration-primary underline-offset-8 decoration-2">
                  <span className="text-primary">{chantCount}</span>
                  <span className="text-white/40 mx-2">/</span>
                  108 CHANTS
                </span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-ping" />
              </div>
            </div>

            {/* Mobile View Toggle & Controls Overlay */}
            <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-4 px-6 md:hidden">
              <div className="flex items-center gap-4 bg-black/80 backdrop-blur-2xl p-3 px-6 rounded-3xl border border-white/10 w-full justify-between shadow-2xl">
                <div className="flex gap-4">
                  <button
                    onClick={() => setLanguage("en")}
                    className={`text-xs font-black tracking-widest px-4 py-1.5 rounded-full transition-all ${language === "en" ? "bg-primary text-white shadow-[0_0_15px_rgba(255,165,0,0.4)]" : "text-white/40"}`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLanguage("hi")}
                    className={`text-xs font-black tracking-widest px-4 py-1.5 rounded-full transition-all ${language === "hi" ? "bg-primary text-white shadow-[0_0_15px_rgba(255,165,0,0.4)]" : "text-white/40"}`}
                  >
                    हिन्दी
                  </button>
                </div>
                <div className="flex items-center gap-5">
                  <button onClick={() => setIsChatOpen(true)} className="text-white/60 active:scale-95 transition-transform">
                    <MessageSquare className="w-6 h-6" />
                  </button>
                  <button onClick={toggleFullscreen} className="text-white/60 active:scale-95 transition-transform">
                    {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Controls - Floating Glass Bar */}
            <div className="mt-12 hidden md:flex gap-12 items-center bg-black/50 backdrop-blur-2xl px-10 py-5 rounded-[2rem] border border-white/10 shadow-2xl">
              {/* Language Toggle */}
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2 text-white/40">
                  <Globe className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Language</span>
                </div>
                <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5">
                  <button
                    onClick={() => setLanguage("en")}
                    className={`px-6 py-2 rounded-xl text-xs font-black tracking-wider transition-all duration-300 ${language === "en" ? "bg-primary text-white shadow-lg scale-[1.05]" : "text-white/40 hover:text-white"}`}
                  >
                    ENGLISH
                  </button>
                  <button
                    onClick={() => setLanguage("hi")}
                    className={`px-6 py-2 rounded-xl text-xs font-black tracking-wider transition-all duration-300 ${language === "hi" ? "bg-primary text-white shadow-lg scale-[1.05]" : "text-white/40 hover:text-white"}`}
                  >
                    HINDI
                  </button>
                </div>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2 text-white/40">
                  <Volume2 className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Volume</span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    defaultValue="1"
                    className="w-40 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary group"
                    onChange={(e) => {
                      if (audioRef.current) {
                        audioRef.current.volume = Number(e.target.value);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Sidebar (Desktop) - Improved UI */}
        <div className="w-[22rem] hidden lg:flex flex-col border-l border-white/5 relative bg-black/20 backdrop-blur-3xl">
          <ChatPanel deity={todayMantra.deity} />
        </div>

        {/* Mobile Chat Overlay */}
        {isChatOpen && (
          <div className="absolute inset-0 z-[100] flex flex-col bg-background lg:hidden animate-in slide-in-from-bottom duration-500">
            <div className="flex items-center justify-between p-5 border-b border-white/5 bg-black/40 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                <h2 className="font-display font-black tracking-wider text-sm">DEVOTEE CHAT</h2>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-all border border-white/5 shadow-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ChatPanel deity={todayMantra.deity} />
            </div>
          </div>
        )}
      </div>

      {/* Audio Element */}
      <audio ref={audioRef} preload="auto" className="hidden" />

      {/* Premium Login Form Overlay */}
      {showLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

          <div className="relative w-full max-w-md glass-card p-8 md:p-10 border-saffron/30 shadow-[0_0_50px_rgba(255,153,51,0.2)] animate-in zoom-in slide-in-from-bottom-8 duration-700">
            {/* Decorative Top Ornament */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-saffron rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,153,51,0.5)] border-4 border-black/40">
              <span className="text-4xl">🕉️</span>
            </div>

            <div className="text-center mt-6 mb-8">
              <h2 className="font-display text-3xl md:text-4xl font-black text-gradient-saffron mb-3">
                Join our Parivaar
              </h2>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                Aapne 5 chants poore kar liye hain! <br />
                Aage badhne ke liye kripya Naman Darshan mein login karein.
              </p>
            </div>

            <div className="space-y-6">
              <button
                onClick={() => window.location.href = "https://namandarshan.com/login"}
                className="w-full bg-primary text-primary-foreground font-display font-black text-xl py-5 rounded-2xl shadow-[0_10px_40px_rgba(255,153,51,0.3)] hover:scale-[1.03] active:scale-95 transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  🛕 LOGIN WITH NAMAN DARSHAN
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>

              <div className="relative flex items-center justify-center py-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                <span className="relative bg-[#1A1A1A] px-4 text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold">Or continue with</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => window.location.href = "https://namandarshan.com/login"} className="bg-white/5 border border-white/10 py-3 rounded-xl hover:bg-white/10 transition-colors text-xs font-bold tracking-widest uppercase">Google</button>
                <button onClick={() => window.location.href = "https://namandarshan.com/login"} className="bg-white/5 border border-white/10 py-3 rounded-xl hover:bg-white/10 transition-colors text-xs font-bold tracking-widest uppercase">Mobile</button>
              </div>

              <p className="text-center text-[10px] text-muted-foreground/60 leading-relaxed pt-4">
                By continuing, you agree to join the global Naman Darshan parivaar and receive spiritual updates.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
