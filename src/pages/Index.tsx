import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import namanlogo from "@/assets/naman-logo.webp";

export default function Index() {
  const navigate = useNavigate();
  const day = new Date().getDay();

  const [devoteeCount, setDevoteeCount] = useState(0);

  // 🔢 Dynamic Devotee Count
  useEffect(() => {
    const baseCounts: Record<number, number> = {
      0: 95,
      1: 120,
      2: 156,
      3: 88,
      4: 110,
      5: 134,
      6: 142,
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

  // 🕰️ Satsang Time Logic
  const handleEnterTemple = () => {
    const now = new Date();
    const currentHour = now.getHours();

    let day = now.getDay();

    // after 8PM show tomorrow's satsang
    if (currentHour >= 20) {
      day = (day + 1) % 7;
    }
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours + minutes / 60;

    const isMorning = currentTime >= 6 && currentTime < 8;
    const isEvening = currentTime >= 18 && currentTime < 20;

    if (isMorning || isEvening) {
      navigate("/meeting");
    } else {
      let message = "";

      if (currentTime < 6) {
        message = "Satsang will begin at 6:00 AM. Please join then.";
      } else if (currentTime >= 8 && currentTime < 18) {
        message = "Satsang will begin at 6:00 PM. Please join then.";
      } else {
        message = "Satsang will begin tomorrow at 6:00 AM. Please join then.";
      }

      alert(message);
    }
  };

  // 📿 Mantra Content Based on Day
  const mantraContents: Record<number, { title: string; subtitle: string }> = {
    0: {
      title: "Pandit Ji ka Namaskar",
      subtitle: "Join the Surya Bhagwan Daily Jaap with our spiritual seekers",
    },
    1: {
      title: "Pandit Ji ka Namaskar",
      subtitle:
        "Join the Maha Mrityunjay Jaap 108 times with our spiritual seekers",
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
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-temple-gradient overflow-hidden px-4 sm:px-6">
      
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-saffron/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-temple-gold/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      </div>

      <div className="relative z-20 flex flex-col items-center w-full max-w-md sm:max-w-xl lg:max-w-2xl px-6 sm:px-8 py-10 sm:py-12 glass-card text-center">

        {/* Logo */}
        <div className="relative mb-10 group">
          {/* Layered Glow Effect behind the logo */}
          <div className="absolute inset-0 blur-3xl bg-orange-500/20 rounded-full scale-150 animate-pulse pointer-events-none" />

          <div className="relative animate-float-slow select-none transition-transform duration-500 group-hover:scale-110">
            <img
              src={namanlogo}
              alt="namanlogo"
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain"
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gradient-saffron mb-4 sm:mb-6">
          {mantraContent.title}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-md mb-10 sm:mb-12 px-2">
          {mantraContent.subtitle}
        </p>

        {/* Enter Temple Button */}
        <button
          onClick={handleEnterTemple}
          className="w-full sm:w-auto bg-primary text-primary-foreground font-display font-black text-lg sm:text-xl px-8 sm:px-12 py-4 sm:py-5 rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-transform touch-manipulation"
        >
          🛕 Enter the Temple
        </button>

        {/* Devotee Count */}
        <div className="mt-16 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/10 shadow-lg">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
            </span>
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-white/90">
              {devoteeCount} DEVOTEES CHANTING
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}