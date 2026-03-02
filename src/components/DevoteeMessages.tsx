import { useEffect, useRef } from "react";

const DEVOTEE_NAMES = [
  "🙏 Rahul Sharma", "🙏 Priya Verma", "🙏 Amit Patel", "🙏 Sunita Devi",
  "🙏 Ramesh Kumar", "🙏 Anjali Singh", "🙏 Vikram Joshi", "🙏 Meera Rani",
  "🙏 Suresh Gupta", "🙏 Pooja Mishra", "🙏 Deepak Yadav", "🙏 Kavita Pandey",
  "🙏 Manoj Tiwari", "🙏 Neha Agarwal", "🙏 Arun Dubey",
];

const DEVOTEE_MESSAGES = [
  "जय श्री राम 🙏",
  "Jai Hanuman! 🙏",
  "Har Har Mahadev 🕉️",
  "बजरंगबली की जय! 💪",
  "Very peaceful satsang 🛕",
  "Jai Bajrang Bali 🚩",
  "Om Namah Shivaya 🙏",
  "Beautiful recitation 🎵",
  "Feeling so blessed today 🙏✨",
  "Hanuman ji ki kripa sab par barse 🙏",
  "Sankat Mochan ki jai 🚩",
  "Ram Ram ji 🙏",
  "प्रभु की कृपा सब पर बनी रहे 🙏",
  "🚩 जय श्री राम 🚩",
  "Aaj ka path bahut acha hai 🙏",
  "Sab ke ghar mein sukh shanti ho 🏠🙏",
  "Bajrangbali sab ki raksha karein 🙏",
  "Goosebumps! Jai Hanuman 🙏",
  "Daily yahan aata hoon satsang ke liye 🛕",
  "Om 🙏",
];

interface Props {
  onNewMessage: (msg: {
    id: string;
    text: string;
    sender: "devotee";
    senderName: string;
    timestamp: Date;
  }) => void;
}

export default function DevoteeMessages({ onNewMessage }: Props) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const scheduleNext = () => {
      const delay = 4000 + Math.random() * 8000; // 4-12 seconds
      timerRef.current = setTimeout(() => {
        const name = DEVOTEE_NAMES[Math.floor(Math.random() * DEVOTEE_NAMES.length)];
        const text = DEVOTEE_MESSAGES[Math.floor(Math.random() * DEVOTEE_MESSAGES.length)];
        onNewMessage({
          id: `devotee-${Date.now()}`,
          text,
          sender: "devotee",
          senderName: name,
          timestamp: new Date(),
        });
        scheduleNext();
      }, delay);
    };

    // First message after 3 seconds
    timerRef.current = setTimeout(() => {
      const name = DEVOTEE_NAMES[Math.floor(Math.random() * DEVOTEE_NAMES.length)];
      const text = DEVOTEE_MESSAGES[Math.floor(Math.random() * DEVOTEE_MESSAGES.length)];
      onNewMessage({
        id: `devotee-${Date.now()}`,
        text,
        sender: "devotee",
        senderName: name,
        timestamp: new Date(),
      });
      scheduleNext();
    }, 3000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null; // This is a headless component
}
