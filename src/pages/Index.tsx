import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Index() {
  const navigate = useNavigate();
  const day = new Date().getDay();

  const [devoteeCount, setDevoteeCount] = useState(0);

  // 🔢 Dynamic Devotee Count
  useEffect(() => {
    const base =
      day === 1 ? 84 :      // Monday Shiva
        day === 2 ? 108 :     // Tuesday Hanuman
          day === 3 ? 72 :      // Wednesday Gayatri
            day === 4 ? 150 :     // Thursday Ganesh
              84;

    setDevoteeCount(base + Math.floor(Math.random() * 30));

    const interval = setInterval(() => {
      setDevoteeCount((prev) =>
        prev + (Math.random() > 0.5 ? 1 : -1)
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [day]);

  // 📿 Mantra Content Based on Day
  const mantraContent =
    day === 1
      ? {
        title: "Pandit Ji ka Namaskar",
        subtitle:
          "Join the Maha Mrityunjay Jaap 108 times with our spiritual seekers",
      }
      : day === 2
        ? {
          title: "Pandit Ji ka Namaskar",
          subtitle:
            "Join the Hanuman Chalisa 108 times with our spiritual seekers",
        }
        : day === 3
          ? {
            title: "Pandit Ji ka Namaskar",
            subtitle:
              "Join the Gayatri Mantra 108 times with our spiritual seekers",
          }
          : day === 4
            ? {
              title: "Pandit Ji ka Namaskar",
              subtitle:
                "Join the Shree Ganeshaaya Dheemahi satsang for Day 4",
            }
            : {
              title: "Pandit Ji ka Namaskar",
              subtitle:
                "Join the Maha Mrityunjay Jaap 108 times with our spiritual seekers",
            };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-temple-gradient px-4">

      {/* Floating Icon */}
      <div className="text-6xl animate-float mb-6 select-none">🙏</div>

      {/* Dynamic Title */}
      <h1 className="font-display text-4xl md:text-5xl font-bold text-gradient-saffron text-center mb-3">
        {mantraContent.title}
      </h1>

      {/* Dynamic Subtitle */}
      <p className="text-muted-foreground text-center max-w-md mb-8 leading-relaxed">
        {mantraContent.subtitle}
      </p>

      {/* Button */}
      <button
        onClick={() => navigate("/meeting")}
        className="group relative bg-primary text-primary-foreground font-display font-semibold text-lg px-8 py-4 rounded-xl glow-saffron hover:scale-105 transition-transform duration-300"
      >
        🛕 Join Now
      </button>

      {/* Dynamic Devotee Count */}
      <div className="mt-12 flex items-center gap-3 text-sm text-muted-foreground">
        <span className="w-2 h-2 rounded-full bg-destructive animate-pulse-glow" />
        {devoteeCount} devotees are chanting right now
      </div>

    </div>
  );
}