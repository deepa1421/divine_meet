import { useEffect, useRef } from "react";

// ============================================================
// DevoteeMessages.tsx
// Yeh ek headless component hai jo automatically devotees ke
// messages generate karta hai — bilkul ek live satsang jaisa!
// ============================================================

// 100 pehle naam × 55 aakhri naam = 5,500 unique combinations
// Itne zyada names hain ki repeat hone mein ghanton lag jaayenge 🙏
const FIRST_NAMES = [
  "Rahul", "Priya", "Amit", "Sunita", "Ramesh", "Anjali", "Vikram", "Meera",
  "Suresh", "Pooja", "Deepak", "Kavita", "Manoj", "Neha", "Arun", "Geeta",
  "Sanjay", "Rekha", "Rajesh", "Anita", "Vijay", "Usha", "Ravi", "Shanti",
  "Mohan", "Lata", "Ashok", "Savita", "Dinesh", "Nirmala", "Prakash", "Seema",
  "Sunil", "Kamla", "Vinod", "Sarla", "Mukesh", "Pushpa", "Rakesh", "Kiran",
  "Naresh", "Shobha", "Satish", "Sudha", "Mahesh", "Asha", "Umesh", "Manju",
  "Govind", "Rani", "Pramod", "Sushma", "Harish", "Ratna", "Yogesh", "Mamta",
  "Ganesh", "Padma", "Girish", "Vimla", "Rajendra", "Sunaina", "Hemant", "Chanda",
  "Lalit", "Sheela", "Naveen", "Kusum", "Arvind", "Sharda", "Anil", "Indira",
  "Santosh", "Urmila", "Virendra", "Meenakshi", "Devendra", "Sharmila", "Kamlesh", "Chameli",
  "Bharat", "Sarita", "Ramakant", "Renu", "Jitendra", "Indu", "Surendra", "Vina",
  "Trilok", "Mala", "Shivram", "Leela", "Balram", "Chitra", "Kailash", "Prabha",
  "Jagdish", "Shakuntala",
];

// Poore India ke common surnames — North se South tak sab covered hain
const LAST_NAMES = [
  "Sharma", "Verma", "Patel", "Singh", "Kumar", "Joshi", "Gupta", "Mishra",
  "Yadav", "Pandey", "Tiwari", "Agarwal", "Dubey", "Shukla", "Srivastava",
  "Chauhan", "Rao", "Nair", "Iyer", "Pillai", "Reddy", "Menon", "Chaudhary",
  "Bose", "Das", "Ghosh", "Chatterjee", "Banerjee", "Mukherjee", "Sen",
  "Trivedi", "Dixit", "Saxena", "Mathur", "Sinha", "Thakur", "Rajput", "Rathore",
  "Chaube", "Pathak", "Upadhyay", "Dwivedi", "Chaturvedi", "Tripathi", "Bajpai",
  "Malhotra", "Kapoor", "Bhatia", "Sethi", "Kohli", "Arora", "Dhawan", "Chopra",
  "Mehta", "Shah",
];

// Nested loop chalao aur saare first + last name combinations ek array mein daal do
// Total: 100 × 55 = 5,500 unique devotee names 🛕
const DEVOTEE_NAMES: string[] = [];
for (const first of FIRST_NAMES) {
  for (const last of LAST_NAMES) {
    DEVOTEE_NAMES.push(`🙏 ${first} ${last}`);
  }
}

// Fisher-Yates Shuffle Algorithm —
// Array ko randomly mix karta hai taaki names alphabetical order mein na dikhen.
// Ek baar shuffle, phir sequential read — ekdum smooth experience!
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Module load hote hi names shuffle ho jaate hain — har session mein alag order!
const SHUFFLED_NAMES = shuffleArray(DEVOTEE_NAMES);

// Yeh pointer track karta hai ki hum list mein kahan hain
let nameIndex = 0;

/** 
 * Ek ek karke saare 5,500 names return karta hai bina repeat kiye.
 * Jab poori list khatam ho jaaye, toh wapas shuru ho jaata hai (cycle).
 * ~8 sec average delay pe ek full cycle = lagbhag 12+ ghante bina repeat ke! 🙏
 */
function getNextName(): string {
  if (nameIndex >= SHUFFLED_NAMES.length) {
    nameIndex = 0;
  }
  return SHUFFLED_NAMES[nameIndex++];
}

// Woh bhakti-bhari baatein jo devotees satsang mein kehte hain —
// Hindi, Hinglish, aur pure bhakti ke jazbaaton ka mix 🚩🕉️
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
    // Recursive function jo khud ko baar baar schedule karti rehti hai
    // Har message ke beech 4 se 12 second ka random delay hota hai —
    // bilkul real devotees ki tarah, sab ek saath type nahi karte! 😄
    const scheduleNext = () => {
      const delay = 4000 + Math.random() * 8000; // 4–12 seconds ka random gap
      timerRef.current = setTimeout(() => {
        const name = getNextName();
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

    // Pehla message 3 second baad aata hai — thoda warm-up time milta hai UI ko
    timerRef.current = setTimeout(() => {
      const name = getNextName();
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

    // Cleanup: component unmount hone par timer saaf kar do — memory leak nahi chahiye!
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null; // Yeh component kuch render nahi karta — sirf peeche se kaam karta hai (headless) 🛕
}