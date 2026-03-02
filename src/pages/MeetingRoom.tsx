import { useEffect, useRef, useState } from "react";
import namanLogo from "@/assets/naman-logo.webp";
import ChatPanel from "@/components/ChatPanel";

export default function MeetingRoom() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [chantCount, setChantCount] = useState<number>(0);
  const [currentLine, setCurrentLine] = useState<number>(0);

  const day = new Date().getDay();

  const mantras: Record<number, any> = {
    1: {
      title: "🔱 Maha Mrityunjay Jaap (108 Times)",
      audio: "/audio/monday.mp3",
      image: "/images/shiva.jpg",
      deity: "shiva",
      chantDuration: 20.6,
      timings: [3.0, 7.0, 9.8, 12.6],
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
      audio: "/audio/tuesday.mp3",
      image: "/images/hanuman.jpg",
      deity: "hanuman",
      chantDuration: 40.0,
      timings: [2.0, 10.0, 20.0, 30.0],
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
      title: "🌺 Gayatri Mantra (108 Times)",
      audio: "/audio/wednesday.mp3",
      image: "/images/gayatri.jpg",
      deity: "gayatri",
      chantDuration: 15.0,
      timings: [2.0, 5.0, 8.0, 11.0],
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
    4: {
      title: "🐘 Ganesh Chaturthi Satsang (Day 4)",
      audio: "/audio/thursday.mp3",
      image: "/images/ganesh.jpg",
      deity: "ganesh",
      chantDuration: 25.0, // Estimated
      timings: [2.0, 8.0, 14.0, 20.0],
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
  };

  const todayMantra = mantras[day] || mantras[1];


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

      let lineIndex = 0;

      for (let i = 0; i < todayMantra.timings.length; i++) {
        if (timeInsideChant >= todayMantra.timings[i]) {
          lineIndex = i;
        }
      }

      setChantCount(Math.min(chantIndex, 108));
      setCurrentLine(lineIndex);

      frame = requestAnimationFrame(sync);
    };

    frame = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(frame);
  }, [todayMantra]);
  return (
    <div className="flex flex-col h-screen bg-background">

      {/* TOP BAR */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <img src={namanLogo} alt="Naman Darshan" className="h-8 w-auto" />
          <div>
            <h1 className="font-display text-sm font-semibold text-foreground">
              {todayMantra.title}
            </h1>
            <p className="text-xs text-muted-foreground">
              Live • Naman Darshan Virtual Temple
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 text-xs bg-destructive/20 text-destructive px-2 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-destructive animate-pulse-glow" />
          LIVE
        </span>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden">

        {/* Mantra Section */}
        <div className="flex flex-col flex-1 relative">

          {/* Background Image (FITS SCREEN) */}
          <div
            className="absolute inset-0 bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${todayMantra.image})` }}
          />
          <div className="absolute inset-0 bg-black/60" />

          {/* Foreground Content */}
          <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6">

            {/* Subtitles */}
            <div className="text-center space-y-3 max-w-2xl">
              {todayMantra.subtitles[language].map(
                (line: string, index: number) => (
                  <div
                    key={index}
                    className={
                      index === currentLine
                        ? "text-yellow-400 text-2xl font-semibold transition-all duration-200"
                        : "text-white/60 text-xl"
                    }
                  >
                    {line}
                  </div>
                )
              )}
            </div>

            {/* Chant Counter */}
            <div className="mt-8 text-white text-lg bg-black/50 px-4 py-2 rounded">
              📿 {chantCount}/108 Chants
            </div>

            {/* Controls */}
            <div className="mt-6 flex gap-6 items-center">

              {/* Language Toggle */}
              <div className="flex gap-3">
                <button
                  onClick={() => setLanguage("en")}
                  className="px-4 py-1 bg-white/20 rounded hover:bg-white/30"
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage("hi")}
                  className="px-4 py-1 bg-white/20 rounded hover:bg-white/30"
                >
                  Hindi
                </button>
              </div>

              {/* Volume */}
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                defaultValue="1"
                onChange={(e) => {
                  if (audioRef.current) {
                    audioRef.current.volume = Number(e.target.value);
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        {/* Chat Sidebar */}
        <div className="w-80 hidden md:flex flex-col">
          <ChatPanel deity={todayMantra.deity} />
        </div>
      </div>

      {/* Hidden Audio */}
      <audio ref={audioRef} preload="auto" style={{ display: "none" }} />

    </div>
  );
}