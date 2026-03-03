import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Index() {
  const navigate = useNavigate();
  const day = new Date().getDay();

  const [devoteeCount, setDevoteeCount] = useState(0);

  // 🔢 Dynamic Devotee Count
  useEffect(() => {
    const baseCounts: Record<number, number> = {
      0: 95,  // Sunday Surya
      1: 120, // Monday Shiva
      2: 156, // Tuesday Hanuman
      3: 88,  // Wednesday Ganesh
      4: 110, // Thursday Guru
      5: 134, // Friday Gayatri
      6: 142, // Saturday Kalabhairav
    };

    const base = baseCounts[day] || 100;
    setDevoteeCount(base + Math.floor(Math.random() * 30));

    const interval = setInterval(() => {
      setDevoteeCount((prev) =>
        prev + (Math.random() > 0.5 ? 1 : -1)
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [day]);

  // 📿 Mantra Content Based on Day
  const mantraContents: Record<number, { title: string; subtitle: string }> = {
    0: {
      title: "Pandit Ji ka Namaskar",
      subtitle: "Join the Surya Bhagwan Daily Jaap with our spiritual seekers",
    },
    1: {
      title: "Pandit Ji ka Namaskar",
      subtitle: "Join the Maha Mrityunjay Jaap 108 times with our spiritual seekers",
    },
    2: {
      title: "Pandit Ji ka Namaskar",
      subtitle: "Join the Hanuman Chalisa 108 times with our spiritual seekers",
    },
    3: {
      title: "Pandit Ji ka Namaskar",
      subtitle: "Join the Shree Ganeshaaya Dheemahi satsang with our devotees",
    },
    4: {
      title: "Pandit Ji ka Namaskar",
      subtitle: "Join the Guru Brihaspati Shanti Jaap with our virtual temple",
    },
    5: {
      title: "Pandit Ji ka Namaskar",
      subtitle: "Join the Gayatri Mantra 108 times with our spiritual seekers",
    },
    6: {
      title: "Pandit Ji ka Namaskar",
      subtitle: "Join the Kalabhairav Ashtakam with our spiritual seekers",
    },
  };

  const mantraContent = mantraContents[day] || mantraContents[1];

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-temple-gradient overflow-hidden px-4">

      {/* Dynamic Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-saffron/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-temple-gold/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-2xl px-8 py-12 glass-card text-center animate-in fade-in zoom-in duration-700">

        {/* Floating Icon */}
        <div className="text-7xl animate-float-slow mb-8 select-none drop-shadow-[0_0_25px_rgba(255,165,0,0.5)]">
          🙏
        </div>

        {/* Dynamic Title */}
        <h1 className="font-display text-4xl md:text-6xl font-black text-gradient-saffron mb-6 tracking-tight leading-tight">
          {mantraContent.title}
        </h1>

        {/* Dynamic Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-md mb-12 leading-relaxed font-medium">
          {mantraContent.subtitle}
        </p>

        {/* Button container with glow */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-saffron to-temple-gold rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
          <button
            onClick={() => navigate("/meeting")}
            className="relative bg-primary text-primary-foreground font-display font-black text-xl px-12 py-5 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center gap-3 overflow-hidden shadow-2xl"
          >
            <span className="relative z-10 flex items-center gap-3">
              🛕 Enter the Temple
            </span>
            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer" />
          </button>
        </div>

        {/* Dynamic Devotee Count */}
        <div className="mt-16 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/10 shadow-lg">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
            </span>
            <span className="text-sm font-semibold tracking-wide text-white/90">
              {devoteeCount} DEVOTEES CHANTING
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-bold">
            Live Streamed from Varansi & Haridwar
          </p>
        </div>
      </div>

    </div>
  );
}
