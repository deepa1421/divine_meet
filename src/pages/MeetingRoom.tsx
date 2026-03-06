import { useEffect, useRef, useState } from "react";
import namanLogo from "@/assets/naman-logo.webp";
import ChatPanel from "@/components/ChatPanel";
import { Maximize, Minimize, Volume2, Globe, MessageSquare, X, Users, Clock } from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
// Morning: 6:00 AM – 8:00 AM  |  Evening: 6:00 PM – 8:00 PM
function getSessionState() {
  const now = new Date();
  const s = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const todayDay = now.getDay();
  const tomorrowDay = (todayDay + 1) % 7;

  if (s >= 6 * 3600 && s < 8 * 3600)
    return { live: true as const, session: "morning", elapsed: s - 6 * 3600 };
  if (s >= 18 * 3600 && s < 20 * 3600)
    return { live: true as const, session: "evening", elapsed: s - 18 * 3600 };

  if (s < 6 * 3600)
    return { live: false as const, secondsToNext: 6 * 3600 - s, nextLabel: "Morning Aarti (6:00 AM)", nextDay: todayDay };
  if (s < 18 * 3600)
    return { live: false as const, secondsToNext: 18 * 3600 - s, nextLabel: "Evening Aarti (6:00 PM)", nextDay: todayDay };
  return { live: false as const, secondsToNext: 86400 - s + 6 * 3600, nextLabel: "Morning Aarti (6:00 AM)", nextDay: tomorrowDay };
}

function fmtTime(secs: number) {
  const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = secs % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function MeetingRoom() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastLine = useRef<number>(-1);
  const sessionRef = useRef<string>("");      // "0-morning" | "0-evening" etc.
  const loginShown = useRef<boolean>(false);  // show login only once per page load

  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [chantCount, setChantCount] = useState<number>(0);
  const [currentLine, setCurrentLine] = useState<number>(-1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [onlineCount, setOnlineCount] = useState(108);
  const [showLogin, setShowLogin] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [loopCount, setLoopCount] = useState(0);

  // Session / countdown
  const [isLive, setIsLive] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [nextLabel, setNextLabel] = useState("");
  const [nextDay, setNextDay] = useState(new Date().getDay());

  const day = new Date().getDay();

  const mantras: Record<number, any> = {
    0: {
      title: "☀️ Surya Bhagwan Mantra (Daily Jaap)",
      audio: "/audio/sunday.mp3",
      image: "/images/surya_bhagwan.sunday.png",
      deity: "surya",
      chantDuration: 22.496,
      timings: [
        [0.000, 5.412],
        [5.412, 9.875],
        [9.875, 14.921],
        [14.921, 22.496],
      ],
      subtitles: {
        en: [
          "Tato Yuddha Parishrantam Samare Chintaya Stitham | Ravanaam Chaagrato Drishtvaa Yuddhaaya Samupasthitam ||1||",
          "daiva taishcha samagamya drashtu mabhya gato ranam |",
          "upagamya bravidramam agastyo bhagavan rishihi || 2",
          "rama rama mahabaho shrinu guhyam sanatanam |",
          "yena sarvanarin vatsa samare vijayishyasi || 3",
          "aditya-hridayam punyam sarva shatru-vinashanam |",
          "jayavaham japen-nityam akshayyam paramam shivam || 4",
          "sarvamangala-mangalyam sarva papa pranashanam |",
          "chintashoka-prashamanam ayurvardhana-muttamam || 5",
          "rashmi mantam samudyantam devasura-namaskritam |",
          "pujayasva vivasvantam bhaskaram bhuvaneshvaram || 6",
          "sarva devatmako hyesha tejasvi rashmi-bhavanah |",
          "esha devasura gananlokan pati gabhastibhih || 7",
          "esha brahma cha vishnush cha shivah skandah prajapatihi |",
          "mahendro dhanadah kalo yamah somo hyapam patihi || 8",
          "pitaro vasavah sadhya hyashvinau maruto manuh |",
          "vayurvahnih praja-prana ritukarta prabhakarah || 9",
          "adityah savita suryah khagah pusha gabhastiman |",
          "suvarnasadrisho bhanur-hiranyareta divakarah || 10",
          "haridashvah sahasrarchih saptasapti-marichiman |",
          "timironmathanah shambhu-stvashta martanda amshuman || 11",
          "hiranyagarbhah shishira stapano bhaskaro ravihi |",
          "agni garbho'diteh putrah shankhah shishira nashanaha || 12",
          "vyomanathastamobhedi rigyajussamaparagaha |",
          "ghanavrishtirapam mitro vindhya-vithiplavangamaha || 13",
          "atapi mandali mrityuh pingalah sarvatapanaha |",
          "kavirvishvo mahatejah raktah sarva bhavodbhavaha || 14",
          "nakshatra grahataranam-adhipo vishva-bhavanah |",
          "tejasamapi tejasvi dvadashatman namo'stu te || 15",
          "namah purvaya giraye pashchimayadraye namah|",
          "jyotirgananam pataye dinaadhipataye namah || 16",
          "Jayaya jaya bhadraya haryashvaya namo namah |",
          "namo namah sahasramsho adityaya namo namah || 17",
          "nama ugraya viraya sarangaya namo namah |",
          "namah padma prabodhaya martandaya namo namah || 18",
          "brahmeshanachyuteshaya suryayadityavarchase |",
          "bhasvate sarva bhakshaya raudraya vapushe namaha || 19",
          "tamoghnaya himaghnaya shatrughnayamitatmane |",
          "kritaghnaghnaya devaya jyotisham pataye namaha || 20",
          "taptacami karabhaya vahnaye vishvakarmane |",
          "namastamo'bhinighnaya ravaye (rucaye) lokasakshine || 21",
          "nashayat yesha vai bhutam tadeva srijati prabhuh|",
          "payatyesha tapatyesha varshatyesha gabhastibhih || 22",
          "esha supteshu jagarti bhuteshu parinishthitaha |",
          "esha evagnihotram cha phalam chaivagnihotrinam || 23",
          "vedashcha kratavashcaiva kratunam phalam eva cha |",
          "yani krityani lokeshu sarva esha ravih prabhuh || 24",
          "ena-mapatsu krichchreshu kantareshu bhayeshu cha |",
          "kirtayan purushah kashchinnavasidati raghava || 25",
          "pujayasvaina-mekagro devadevam jagatpatim |",
          "etat trigunitam japtva yuddheshu vijayishyasi || 26",
          "asmin kshane mahabaho ravanam tvam vadhishyasi |",
          "evamuktva tada'gastyo jagama cha yathagatam || 27",
          "etachchrutva mahateja nashtashoko'bhavattada |",
          "dharayamasa suprito raghavah prayatatmavan || 28",
          "adityam prekshya japtva tu param harshamavaptavan |",
          "trirachamya shuchirbhutva dhanuradaya viryavan || 29",
          "ravanam prekshya hrishtatma yuddhaya samupagamat |",
          "sarvayatnena mahata vadhe tasya dhrito'bhavat || 30",
          "atha ravi-ravadan-nirikshya ramam",
          "mudita manah paramam prahrishyamanaha |",
          "nishicharapati-sankshayam viditva",
          "suragana-madhyagato vachastvareti || 31",
          "Ityarshe Srimadramayana Valmikye Adikavye Yudhkande Panchadhik Shattamaah Sargaah ll",
        ],
        hi: [
          "ततो युद्धपरिश्रान्तं समरे चिन्तया स्थितम्‌ । रावणं चाग्रतो दृष्ट्वा युद्धाय समुपस्थितम्‌ ॥1॥",
          "दैवतैश्च समागम्य द्रष्टुमभ्यागतो रणम्‌ । उपगम्याब्रवीद् राममगस्त्यो भगवांस्तदा ॥2॥",
          "राम राम महाबाहो श्रृणु गुह्मं सनातनम्‌ । येन सर्वानरीन्‌ वत्स समरे विजयिष्यसे ॥3॥",
          "आदित्यहृदयं पुण्यं सर्वशत्रुविनाशनम्‌ । जयावहं जपं नित्यमक्षयं परमं शिवम्‌ ॥4॥",
          "सर्वमंगलमागल्यं सर्वपापप्रणाशनम्‌ । चिन्ताशोकप्रशमनमायुर्वर्धनमुत्तमम्‌ ॥5॥",
          "रश्मिमन्तं समुद्यन्तं देवासुरनमस्कृतम्‌ । पुजयस्व विवस्वन्तं भास्करं भुवनेश्वरम्‌ ॥6॥",
          "सर्वदेवात्मको ह्येष तेजस्वी रश्मिभावन: । एष देवासुरगणांल्लोकान्‌ पाति गभस्तिभि: ॥7॥",
          "एष ब्रह्मा च विष्णुश्च शिव: स्कन्द: प्रजापति: । महेन्द्रो धनद: कालो यम: सोमो ह्यापां पतिः ॥8॥",
          "पितरो वसव: साध्या अश्विनौ मरुतो मनु: । वायुर्वहिन: प्रजा प्राण ऋतुकर्ता प्रभाकर: ॥9॥",
          "आदित्य: सविता सूर्य: खग: पूषा गभस्तिमान्‌ । सुवर्णसदृशो भानुर्हिरण्यरेता दिवाकर: ॥10॥",
          "हरिदश्व: सहस्त्रार्चि: सप्तसप्तिर्मरीचिमान्‌ । तिमिरोन्मथन: शम्भुस्त्वष्टा मार्तण्डकोंऽशुमान्‌ ॥11॥",
          "हिरण्यगर्भ: शिशिरस्तपनोऽहस्करो रवि: । अग्निगर्भोऽदिते: पुत्रः शंखः शिशिरनाशन: ॥12॥",
          "व्योमनाथस्तमोभेदी ऋग्यजु:सामपारग: । घनवृष्टिरपां मित्रो विन्ध्यवीथीप्लवंगमः ॥13॥",
          "आतपी मण्डली मृत्यु: पिगंल: सर्वतापन:। कविर्विश्वो महातेजा: रक्त:सर्वभवोद् भव: ॥14॥",
          "नक्षत्रग्रहताराणामधिपो विश्वभावन: । तेजसामपि तेजस्वी द्वादशात्मन्‌ नमोऽस्तु ते ॥15॥",
          "नम: पूर्वाय गिरये पश्चिमायाद्रये नम: । ज्योतिर्गणानां पतये दिनाधिपतये नम: ॥16॥",
          "जयाय जयभद्राय हर्यश्वाय नमो नम: । नमो नम: सहस्त्रांशो आदित्याय नमो नम: ॥17॥",
          "नम उग्राय वीराय सारंगाय नमो नम: । नम: पद्मप्रबोधाय प्रचण्डाय नमोऽस्तु ते ॥18॥",
          "ब्रह्मेशानाच्युतेशाय सुरायादित्यवर्चसे । भास्वते सर्वभक्षाय रौद्राय वपुषे नम: ॥19॥",
          "तमोघ्नाय हिमघ्नाय शत्रुघ्नायामितात्मने । कृतघ्नघ्नाय देवाय ज्योतिषां पतये नम: ॥20॥",
          "तप्तचामीकराभाय हरये विश्वकर्मणे । नमस्तमोऽभिनिघ्नाय रुचये लोकसाक्षिणे ॥21॥",
          "नाशयत्येष वै भूतं तमेष सृजति प्रभु: । पायत्येष तपत्येष वर्षत्येष गभस्तिभि: ॥22॥",
          "एष सुप्तेषु जागर्ति भूतेषु परिनिष्ठित: । एष चैवाग्निहोत्रं च फलं चैवाग्निहोत्रिणाम्‌ ॥23॥",
          "देवाश्च क्रतवश्चैव क्रतुनां फलमेव च । यानि कृत्यानि लोकेषु सर्वेषु परमं प्रभु: ॥24॥",
          "एनमापत्सु कृच्छ्रेषु कान्तारेषु भयेषु च । कीर्तयन्‌ पुरुष: कश्चिन्नावसीदति राघव ॥25॥",
          "पूजयस्वैनमेकाग्रो देवदेवं जगप्ततिम्‌ । एतत्त्रिगुणितं जप्त्वा युद्धेषु विजयिष्यसि ॥26॥",
          "अस्मिन्‌ क्षणे महाबाहो रावणं त्वं जहिष्यसि । एवमुक्ता ततोऽगस्त्यो जगाम स यथागतम्‌ ॥27॥",
          "एतच्छ्रुत्वा महातेजा नष्टशोकोऽभवत्‌ तदा ॥ धारयामास सुप्रीतो राघव प्रयतात्मवान्‌ ॥28॥",
          "आदित्यं प्रेक्ष्य जप्त्वेदं परं हर्षमवाप्तवान्‌ । त्रिराचम्य शूचिर्भूत्वा धनुरादाय वीर्यवान्‌ ॥29॥",
          "रावणं प्रेक्ष्य हृष्टात्मा जयार्थं समुपागतम्‌ । सर्वयत्नेन महता वृतस्तस्य वधेऽभवत्‌ ॥30॥",
          "अथ रविरवदन्निरीक्ष्य रामं मुदितमना: परमं प्रहृष्यमाण: । निशिचरपतिसंक्षयं विदित्वा सुरगणमध्यगतो वचस्त्वरेति ॥31॥",
          "इत्यर्षे श्रीमद्रमयाने वाल्मिक्ये आदिकाव्ये युद्धकाण्डे पञ्चाधिक शततमः सर्गः ॥",
        ],
      },
    },
    1: {
      title: "🔱 Maha Mrityunjay Jaap (108 Times)",
      audio: "/audio/monday.mp3",
      image: "/images/lordshiva.monday.jpg",
      deity: "shiva",
      chantDuration: 20.6,
      timings: [[3.2, 6.5], [7.2, 9.4], [10.0, 12.4], [12.8, 19.8]],
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
      image: "/images/hanumanji.tuesday.jpg",
      deity: "hanuman",
      chantDuration: 24.236,
      timings: [
        [0.000, 5.783],
        [5.783, 10.211],
        [10.211, 15.982],
        [15.982, 24.236],
      ],
      subtitles: {
        en: [
          "ShriGurucharansaroja-raj",
          "Nijamanumukurasudhaari",
          "Baranaurahubharabimalajasu",
          "Jodayakaphalachari",
          "Budhee-heenthanujanike",
          "Sumirowpavanakumara",
          "Bala-budheevidyadehoomohee",
          "Harahukaleshabikaara",
          "JaiHanumangyangunsagar",
          "JaiKapistihunlokujagar|| 1 ||",
          "Ramdootatulitbaldhama",
          "Anjaani-putraPavansutnama|| 2 ||",
          "MahabirBikramBajrangi",
          "KumatinivarsumatiKesangi|| 3 ||",
          "Kanchan baran birajsubesa",
          "KananKundalKunchitKesha|| 4 ||",
          "HathBajraAurDhvajaViraje",
          "Kaandhemoonjjaneusajai|| 5 ||",
          "SankarsuvankesariNandan",
          "Tejprataapmahajagbandan|| 6 ||",
          "Bidyavaanguniatichaatur",
          "Ramkajkaribekoaatur|| 7 ||",
          "Prabhucharitrasunibe-korasiya",
          "RamLakhanSitamanBasiya|| 8 ||",
          "SukshmaroopdhariSiyahidikhava",
          "Bikatroopdharilankajarava|| 9 ||",
          "Bhimaroopdhariasursanhare",
          "Ramachandrakekajsanvare|| 10 ||",
          "LayeSanjivanLakhanJiyaye",
          "ShriRaghubirHarashiurlaye|| 11 ||",
          "RaghupatiKinhibahutbadai",
          "TummampriyBharat-hi-sambhai|| 12 ||",
          "Sahasbadantumharojasgaavai",
          "Asa-kahiShripatikanthlagaavai|| 13 ||",
          "SanakadhikBrahmaadiMuneesa",
          "Narad-SaradsahitAheesa|| 14 ||",
          "JamaKuberDigpaalJahante",
          "Kavikovidkahisakekahante|| 15 ||",
          "TumupkarSugreevahinkeenha",
          "Rammilayerajpaddeenha|| 16 ||",
          "TumharomantraBibheeshanmaana",
          "LankeshwarBhayeSub jagjana|| 17 ||",
          "JugsahasrajojanparBhanu",
          "Leelyotahimadhurphaljanu|| 18 ||",
          "Prabhumudrikamelimukhmahee",
          "Jaladhilanghigayeachrajnahee|| 19 ||",
          "Durgaamkajjagathkejete",
          "Sugamanugrahatumhretete|| 20 ||",
          "Ramduaaretumrakhvare",
          "Hoatnaagyabinupaisare|| 21 ||",
          "Subsukhlahaetumharisarna",
          "Tumracchakkahukodarnaa|| 22 ||",
          "Aapantejsamharoaapai",
          "Teenhonlokhanktekanpai|| 23 ||",
          "BhootpisaachNikatnahinaavai",
          "Mahavirjabnaamsunavae|| 24 ||",
          "Nasaerogharaesabpeera",
          "JapatnirantarHanumantbeera|| 25 ||",
          "SankatseHanumanchudavae",
          "ManKrambachandhyanjolavai|| 26 ||",
          "Sabpar Ramtapasveeraja",
          "TinkekajsakalTumsaja|| 27 ||",
          "Aurmanorathjokoilavai",
          "Sohiamitjeevanphalpavai|| 28 ||",
          "Charonjugpartaptumhara",
          "Haipersidhjagatujiyara|| 29 ||",
          "SadhuSantketumRakhware",
          "AsurnikandanRamdulhare|| 30 ||",
          "Ashta-sidhinavnidhikedata",
          "As-baradeenJanakimata|| 31 ||",
          "Ramrasayantumharepasa",
          "SadarahoRaghupatikedasa|| 32 ||",
          "TumharebhajanRamkopavai",
          "Janam-janamkedukhbisraavai|| 33 ||",
          "Anth-kaalRaghubarpurjayee",
          "JahanjanamHari-BakhtKahayee|| 34 ||",
          "AurDevtaChitnadharehi",
          "Hanumatse hisarvesukhkarehi|| 35 ||",
          "Sankatkate-mitesabpeera",
          "JosumiraiHanumatBalbeera|| 36 ||",
          "Jai Jai JaiHanumanGosain",
          "KripaKarahuGurudevkinain|| 37 ||",
          "Jo sat bar pathkarekohi",
          "Chutahibandhimahasukhhohi|| 38 ||",
          "Jo yahpadhaeHanumanChalisa",
          "HoyesiddhisaakhiGaureesa|| 39 ||",
          "Tulsidassadaharichera",
          "KeejaiNathHridayemaheindera|| 40 ||",
          "PavanTanaySankatHarana,MangalaMuratiRoop|",
          "RamLakhanaSitaSahita,HridayBasahuSoorBhoop|",
        ],
        hi: [
          "श्रीगुरु चरन सरोज रज, निज मनु मुकुरु सुधारि।",
          "बरनऊं रघुबर बिमल जसु, जो दायकु फल चारि।। ",
          "बुद्धिहीन तनु जानिके, सुमिरौं पवन-कुमार।",
          "बल बुद्धि बिद्या देहु मोहिं, हरहु कलेस बिकार।। ",
          "जय हनुमान ज्ञान गुन सागर।",
          "जय कपीस तिहुं लोक उजागर।।",
          "रामदूत अतुलित बल धामा।",
          "अंजनि-पुत्र पवनसुत नामा।।",
          "महाबीर बिक्रम बजरंगी।",
          "कुमति निवार सुमति के संगी।।",
          "कंचन बरन बिराज सुबेसा।",
          "कानन कुंडल कुंचित केसा।।",
          "हाथ बज्र औ ध्वजा बिराजै।",
          "कांधे मूंज जनेऊ साजै।",
          "संकर सुवन केसरीनंदन।",
          "तेज प्रताप महा जग बन्दन।।",
          "विद्यावान गुनी अति चातुर।",
          "राम काज करिबे को आतुर।।",
          "प्रभु चरित्र सुनिबे को रसिया।",
          "राम लखन सीता मन बसिया।।",
          "सूक्ष्म रूप धरि सियहिं दिखावा।",
          "बिकट रूप धरि लंक जावा।।",
        ],
      },
    },
    3: {
      title: "🐘 Ganesh Chaturthi Satsang",
      audio: "/audio/wednesday.mp3",
      image: "/images/lordganesh.wednesday.jpg",
      deity: "ganesh",
      chantDuration: 25.182,
      timings: [
        [0.000, 5.821],
        [5.821, 9.968],
        [9.968, 15.082],
        [15.082, 25.182],
        [25.182, 31.003],
        [31.003, 35.150],
        [35.150, 40.264],
        [40.264, 50.364],
        [50.364, 56.185],
        [56.185, 60.332],
        [60.332, 65.446],
        [65.446, 75.546],
        [75.546, 81.367],
        [81.367, 85.514],
        [85.514, 90.628],
        [90.628, 100.728],
      ],
      subtitles: {
        en: [
          "Sukhkarta Dukhharta Varta Vighnachi ||",
          "Nurvi Purvi Prem Krupa Jayachi ||",
          "Sarvangi Sundar Uti Shendurachi ||",
          "Kanti Jhalke Mal Mukataphalaanchi ||",
          "Jaidev Jaidev Jai Mangal Murti ||",
          "Darshan Maatre Man: Kaamna Phurti ||",
          "Ratnakhachit Phara Tujh Gaurikumra ||",
          "Chandanaachi Uti Kumkumkeshara ||",
          "Hirejadit Mukut Shobhato Bara ||",
          "Runjhunati Nupure Charani Ghagriya ||",
          "Jaidev Jaidev Jai Mangal Murti ||",
          "Lambodar Pitaambar Phanivarvandana ||",
          "Saral Sond Vakratunda Trinayana ||",
          "Das Ramacha Vat Pahe Sadana ||",
          "Sankati Pavave Nirvani Rakshave Survarvandana ||",
          "Jaidev Jaidev Jai Mangal Murti ||",
        ],
        hi: [
          "सुखकर्ता दुखहर्ता वार्ता विघ्नाची",
          "नूर्वी पूर्वी प्रेम कृपा जयाची",
          "सर्वांगी सुन्दर उटी शेंदु राची",
          "कंठी झळके माल मुकताफळांची",
          "जय देव जय देव जय मंगल मूर्ति",
          "दर्शनमात्रे मनःकमाना पूर्ति",
          "जय देव जय देव",
          "रत्नखचित फरा तुझ गौरीकुमरा",
          "चंदनाची उटी कुमकुम केशरा",
          "हीरे जडित मुकुट शोभतो बरा",
          "रुन्झुनती नूपुरे चरनी घागरिया",
          "जय देव जय देव जय मंगल मूर्ति",
          "दर्शनमात्रे मनःकमाना पूर्ति",
          "जय देव जय देव",
          "लम्बोदर पीताम्बर फनिवर वंदना",
          "सरल सोंड वक्रतुंडा त्रिनयना",
          "दास रामाचा वाट पाहे सदना",
          "संकटी पावावे निर्वाणी रक्षावे सुरवर वंदना",
          "जय देव जय देव जय मंगल मूर्ति",
          "दर्शनमात्रे मनःकमाना पूर्ति",
          "जय देव जय देव",
          "शेंदुर लाल चढ़ायो अच्छा गजमुखको",
          "दोंदिल लाल बिराजे सुत गौरिहरको",
          "हाथ लिए गुडलद्दु सांई सुरवरको",
          "महिमा कहे न जाय लागत हूं पादको",
          "जय जय श्री गणराज विद्या सुखदाता",
          "धन्य तुम्हारा दर्शन मेरा मन रमता",
          "जय देव जय देव",
          "अष्टौ सिद्धि दासी संकटको बैरि",
          "विघ्नविनाशन मंगल मूरत अधिकारी",
          "कोटीसूरजप्रकाश ऐबी छबि तेरी",
          "गंडस्थलमदमस्तक झूले शशिबिहारि",
          "जय जय श्री गणराज विद्या सुखदाता",
          "धन्य तुम्हारा दर्शन मेरा मन रमता",
          "जय देव जय देव",
          "भावभगत से कोई शरणागत आवे",
          "संतत संपत सबही भरपूर पावे",
          "ऐसे तुम महाराज मोको अति भावे",
          "गोसावीनंदन निशिदिन गुन गावे",
          "जय जय श्री गणराज विद्या सुखदाता",
          "धन्य तुम्हारा दर्शन मेरा मन रमता",
          "जय देव जय देव",
          "सुखकर्ता दुखहर्ता वार्ता विघ्नाची",
          "नूर्वी पूर्वी प्रेम कृपा जयाची",
          "सर्वांगी सुन्दर उटी शेंदु राची",
          "कंठी झलके माल मुकताफळांची",
          "जय देव जय देव जय मंगल मूर्ति",
          "दर्शनमात्रे मनःकमाना पूर्ति",
          "जय देव जय देव",
          "दर्शनमात्रे मनःकमाना पूर्ति",
          "जय देव जय देव",
        ],
      },
    },
    4: {
      title: "🙏 Guru Brihaspati Mantra",
      audio: "/audio/thursday.mp3",
      image: "/images/gurubrihaspati.thursday.png",
      deity: "guru",
      chantDuration: 65.0,
      syncOffset: 0,
      timings: [
        [0, 4.8],
        [4.9, 10.2],
        [10.2, 16.2],
        [16.2, 22.0],
        [22.1, 32.0],
        [32.1, 48.0],
        [48.1, 53.1],
        [53.1, 60.0],
        [60.1, 65.0],
      ],
      subtitles: {
        en: [
          "Shri Ganeshaya Namah",
          "Gurur Brihaspatir Jivah",
          "Suracharyo Vidambarah",
          "Vagisho Dhishano Dirghashmashruh Pitambaro Yuva",
          "Sudhadrishti Grahaadhisho Grahapeedapaharakah",
          "Dayakara Saumyamoorti Surarchita Kunkumadyutih",
          "Lokapujyo Lokaguruh",
          "meitigno meitikarakah",
          "tarapatischangirsvah Vedavidyapitamah",
        ],
        hi: [
          "श्री गणेशाय नमः",
          "गुरुर बृहस्पतिः जीवः",
          "सुराचार्यो विदाम्बरः",
          "वागीशो धिषणो दीर्घश्मश्रुः",
          "पीताम्बरो युवा सुधादृष्टिः",
          "ग्रहाधीशो ग्रहपीडापहारकः",
          "दयाकरः सौम्यमूर्तिः",
          "सुरार्चितः कुंकुमद्युतिः",
          "लोकपूज्यो लोकगुरुः",
          "तारापतिश्च अंगिरसः",
          "वेदविद्यापितामहः",
        ],
      },
    },
    5: {
      title: "🌺 Gayatri Mantra (108 Times)",
      audio: "/audio/friday.mp3",
      image: "/images/gayatrimata.friday.jpg",
      deity: "gayatri",
      chantDuration: 14.050,
      timings: [
        [0.000, 3.900],
        [3.900, 7.575],
        [7.575, 11.050],
        [11.050, 14.595],
      ],
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
      audio: "/audio/saturday.mp3",
      image: "/images/kalabhairav.saturday.png",
      deity: "kalabhairav",
      chantDuration: 245.333,
      timings: [
        [0.000, 4.145],
        [4.145, 8.430],
        [8.430, 12.350],
        [12.350, 15.450],
        [15.450, 21.560],
        [21.560, 27.795],
        [27.795, 34.755],
        [34.755, 40.580],
        [40.580, 43.245],
        [43.245, 48.530],
        [48.530, 53.720],
        [53.720, 58.900],
        [58.900, 64.080],
        [64.080, 69.235],
        [69.235, 74.365],
        [74.365, 79.645],
        [79.645, 85.470],
        [85.470, 91.565],
        [91.565, 97.895],
        [97.895, 104.970],
        [104.970, 111.875],
        [111.875, 117.685],
        [117.685, 121.575],
        [121.575, 128.050],
        [128.050, 133.885],
        [133.885, 139.940],
        [139.940, 145.620],
        [145.620, 152.905],
        [152.905, 160.880],
        [160.880, 169.705],
        [169.705, 176.435],
        [176.435, 183.595],
        [183.595, 190.705],
        [190.705, 197.165],
        [197.165, 204.320],
        [204.320, 208.605],
        [208.605, 217.900],
        [217.900, 226.530],
        [226.530, 232.780],
        [232.780, 238.655],
        [238.655, 245.333],
      ],
      subtitles: {
        en: [
          "Om Kalabhairavaai namah",
          "Om Kalabhairavaai namah",
          "Om Kalabhairavaai namah",
          "Deva-Raaja-Sevyamaana-Paavana-Angghri-Pankajam Vyaala-Yajnya-Suutram-Indu-Shekharam Krpaakaram | Naarada-[A]adi-Yogi-Vrnda-Vanditam Digambaram Kaashikaa-Pura-Adhinaatha-Kaalabhairavam Bhaje ||1||",
          "Bhaanu-Kotti-Bhaasvaram Bhavaabdhi-Taarakam Param Neelkantham Iipsita-Artha-Daayakam Trilocanam | Kaala-Kaalam-Ambuja-Akssam-Akssa-Shuulam-Akssaram Kaashikaa-Pura-Adhinaatha-Kaalabhairavam Bhaje ||2||",
          "Shuula-Tanka-Paasha-Danndda-Paannim-Aadi-Kaarannam Shyaama-Kaayam-Aadi-Devam-Akssaram Nir-Aamayam | Bhiimavikramam Prabhum Vichitra-Taannddava-Priyam Kaashikaa-Pura-Adhinaatha-Kaalabhairavam Bhaje ||3||",
          "Bhukti-Mukti-Daayakam Prashasta-Caaru-Vigraham Bhakta-Vatsalam Sthitam Samasta-Loka-Vigraham | Vi-Nikvannan-Manojnya-Hema-Kinkinnii-Lasat-Kattim Kaashikaa-Pura-Adhinaatha-Kaalabhairavam Bhaje ||4||",
          "Dharma-Setu-Paalakam Tva-Adharma-Maarga-Naashakam Karma-Paasha-Mocakam Su-Sharma-Daayakam Vibhum | Svarnna-Varnna-Shessa-Paasha-Shobhitaangga-Mannddalam Kaashikaa-Pura-Adhinaatha-Kaalabhairavam Bhaje ||5||",
          "Ratna-Paadukaa-Prabhaabhi-Raama-Paada-Yugmakam Nityam-Advitiiyam-Isstta-Daivatam Niramjanam | Mrtyu-Darpa-Naashanam Karaala-Damssttra-Mokssannam Kaashikaa-Pura-Adhinaatha-Kaalabhairavam Bhaje ||6||",
          "Atttta-Haasa-Bhinna-Padmaja-Anndda-Kosha-Samtatim Drsstti-Paata-Nasstta-Paapa-Jaalam-Ugra-Shaasanam | Asstta-Siddhi-Daayakam Kapaala-Maalikaa-Dharam Kaashikaa-Pura-Adhinaatha-Kaalabhairavam Bhaje ||7||",
          "Bhuuta-Samgha-Naayakam Vishaala-Kiirti-Daayakam Kaashi-Vaasa-Loka-Punnya-Paapa-Shodhakam Vibhum | Niiti-Maarga-Kovidam Puraatanam Jagatpatim Kaashikaapuraadhinaathakaalabhairavam Bhaje ||8||",
          "Kaalabhairavaassttakam Patthamti Ye Manoharam Jnyaana-Mukti-Saadhanam Vicitra-Punnya-Vardhanam | Shoka-Moha-Dainya-Lobha-Kopa-Taapa-Naashanam Prayaanti Kaalabhairava-Amghri-Sannidhim Naraa Dhruvam ||9||",
        ],
        hi: [
          "ॐ कलाभैरवई नमः",
          "ॐ कलाभैरवई नमः",
          "ॐ कलाभैरवई नमः",
          "देवराज सेव्यमान पावनाङ्घ्रि पङ्कजंव्यालयज्ञ सूत्रमिन्दु शेखरं कृपाकरम् नारदादि योगिवृन्द वन्दितं दिगंबरंकाशिका पुराधिनाथ कालभैरवं भजे॥ १॥ ",
          "भानुकोटि भास्वरं भवाब्धितारकं परंनीलकण्ठम् ईप्सितार्थ दायकं त्रिलोचनम् ।कालकालम् अंबुजाक्षम् अक्षशूलम् अक्षरंकाशिका पुराधिनाथ कालभैरवं भजे॥२॥ ",
          "शूलटङ्क पाशदण्ड पाणिमादि कारणंश्यामकायम् आदिदेवम् अक्षरं निरामयम् ।भीमविक्रमं प्रभुं विचित्रताण्डवप्रियंकाशिका पुराधिनाथ कालभैरवं भजे ॥३॥ ",
          "भुक्तिमुक्तिदायकं प्रशस्तचारुविग्रहंभक्तवत्सलं स्थितं समस्तलोकविग्रहम् ।विनिक्वणन् मनोज्ञहेमकिङ्किणी लसत्कटिंकाशिका पुराधिनाथ कालभैरवं भजे ॥४॥ ",
          "धर्मसेतुपालकं त्वधर्ममार्गनाशकंकर्मपाश मोचकं सुशर्मदायकं विभुम् ।स्वर्णवर्णशेषपाश शोभिताङ्गमण्डलंकाशिका पुराधिनाथ कालभैरवं भजे ॥ ५॥ ",
          "रत्नपादुका प्रभाभिराम पादयुग्मकंनित्यम् अद्वितीयम् इष्टदैवतं निरञ्जनम् ।मृत्युदर्पनाशनं कराळदंष्ट्रमोक्षणंकाशिका पुराधिनाथ कालभैरवं भजे ॥६॥ ",
          "अट्टहास भिन्नपद्मजाण्डकोश सन्ततिंदृष्टिपातनष्टपाप जालमुग्रशासनम् ।अष्टसिद्धिदायकं कपाल मालिकन्धरंकाशिका पुराधिनाथ कालभैरवं भजे ॥७॥ ",
          "भूतसङ्घनायकं विशालकीर्तिदायकंकाशिवासलोक पुण्यपापशोधकं विभुम् ।नीतिमार्गकोविदं पुरातनं जगत्पतिंकाशिका पुराधिनाथ कालभैरवं भजे ॥८॥ ",
          "कालभैरवाष्टकं पठन्ति ये मनोहरंज्ञानमुक्तिसाधनं विचित्रपुण्यवर्धनम् ।शोक मोह दैन्य लोभ कोप ताप नाशनंते प्रयान्ति कालभैरवाङ्घ्रि सन्निधिं ध्रुवम् ॥९॥ ",
        ],
      },
    },
  };

  const todayMantra = mantras[day] || mantras[0];

  // ── 1. Wall-clock tick — master driver ────────────────────────────────────
  useEffect(() => {
    const tick = () => {
      const state = getSessionState();

      if (state.live) {
        setIsLive(true);
        const audio = audioRef.current;
        if (!audio) return;

        const sessionKey = `${day}-${state.session}`;
        const fileDur = todayMantra.chantDuration * 108;
        const target = state.elapsed % fileDur;

        if (sessionRef.current !== sessionKey) {
          // New session: load audio and seek to wall-clock position
          sessionRef.current = sessionKey;
          audio.src = todayMantra.audio;
          audio.loop = true;
          audio.load();
          audio.currentTime = target;
          audio.volume = 1;
          audio.play().catch(() => { });
        } else if (audio.paused) {
          // User rejoins mid-session
          audio.currentTime = target;
          audio.play().catch(() => { });
        } else if (Math.abs(audio.currentTime - target) > 3) {
          // Silent drift correction
          audio.currentTime = target;
        }
      } else {
        setIsLive(false);
        setCountdown(fmtTime(state.secondsToNext));
        setNextLabel(state.nextLabel);
        setNextDay(state.nextDay);

        if (audioRef.current && !audioRef.current.paused) {
          audioRef.current.pause();
          sessionRef.current = "";
        }
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [todayMantra, day]);

  // ── 2. rAF subtitle + chant counter sync ──────────────────────────────────
  useEffect(() => {
    let frame: number;
    let lastTime = 0;

    const sync = () => {
      const audio = audioRef.current;

      if (!audio || !todayMantra.chantDuration || !todayMantra.timings) {
        frame = requestAnimationFrame(sync);
        return;
      }

      const currentTime = audio.currentTime;
      const offset = todayMantra.syncOffset || 0;
      const adjustedTime = Math.max(0, currentTime - offset);
      const chantDuration = todayMantra.chantDuration;
      const timeInsideChant = adjustedTime % chantDuration;

      // Detect loop snap
      if (currentTime < lastTime - 1) {
        setLoopCount(prev => prev + 1);
        console.log("[MeetingRoom] Audio looped. Total loops:", loopCount + 1);
      }
      lastTime = currentTime;

      // Chant count from wall clock (authoritative)
      const state = getSessionState();
      if (state.live) {
        setChantCount(Math.min(Math.floor(state.elapsed / chantDuration), 108));
      }

      // Lyric line
      let lineIndex = -1;
      for (let i = 0; i < todayMantra.timings.length; i++) {
        const [start, end] = todayMantra.timings[i];
        if (timeInsideChant >= start && timeInsideChant < end) {
          lineIndex = i;
          break;
        }
      }

      setCurrentLine(lineIndex);

      if (lineIndex !== lastLine.current && lineIndex !== -1) {
        console.log("[MeetingRoom] Sync Debug:", {
          currentTime: currentTime.toFixed(2),
          adjustedTime: adjustedTime.toFixed(2),
          text: todayMantra.subtitles[language][lineIndex],
        });
        lastLine.current = lineIndex;
      }

      frame = requestAnimationFrame(sync);
    };

    frame = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(frame);
  }, [todayMantra, loopCount, language]);

  // ── 3. Dynamic online count ────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // ── 4. Fullscreen ──────────────────────────────────────────────────────────
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
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // ── 5. Login gate — show only ONCE after 5 chants ─────────────────────────
  useEffect(() => {
    if (chantCount >= 5 && !loginShown.current) {
      loginShown.current = true;
      setShowLogin(true);
      audioRef.current?.pause();
    }
  }, [chantCount]);

  const handleCloseLogin = () => {
    setShowLogin(false);
    audioRef.current?.play().catch(() => { });
  };

  // Derived
  const nextMantra = mantras[nextDay] || mantras[0];

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="flex flex-col h-[100dvh] bg-background overflow-hidden selection:bg-saffron/30 relative">

      {/* TOP BAR */}
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
          {isLive ? (
            <span className="inline-flex items-center gap-1.5 text-[10px] md:text-xs font-bold bg-destructive/10 text-destructive border border-destructive/20 px-3 py-1 rounded-full uppercase tracking-wider">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-destructive animate-pulse" />
              LIVE
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[10px] md:text-xs font-bold bg-white/5 text-white/50 border border-white/10 px-3 py-1 rounded-full">
              <Clock className="w-3 h-3 text-saffron" />
              {countdown}
            </span>
          )}
          <button
            onClick={() => setIsChatMinimized(!isChatMinimized)}
            className={`p-2 rounded-xl transition-all hidden md:block border ${isChatMinimized ? "bg-primary text-white border-primary shadow-[0_0_15px_rgba(255,165,0,0.4)]" : "hover:bg-white/10 border-white/5"}`}
            title={isChatMinimized ? "Show Chat" : "Maximize view (Hide Chat)"}
          >
            {isChatMinimized ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden relative">
        <div className="flex flex-col flex-1 relative overflow-hidden">

          {/* Background Image with Ken Burns */}
          <div
            className="absolute inset-0 bg-contain bg-center bg-no-repeat animate-ken-burns scale-105"
            style={{ backgroundImage: `url(${todayMantra.image})` }}
          />
          <div className="absolute inset-0 bg-black/60 md:bg-black/30 backdrop-brightness-75" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

          <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 md:px-12">

            {/* Chant Counter */}
            <div className="mt-6 md:mt-10 relative group scale-90 md:scale-100">
              <div className="absolute -inset-1 bg-gradient-to-r from-saffron to-temple-gold rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500" />
              <div className="relative flex items-center gap-3 bg-black/60 backdrop-blur-xl px-6 py-2.5 rounded-full border border-white/20 shadow-2xl">
                <span className="text-lg md:text-xl animate-spin-slow">📿</span>
                <span className="text-sm md:text-lg font-black tracking-widest text-white decoration-primary underline-offset-8 decoration-2">
                  <span className="text-primary">{chantCount}</span>
                  <span className="text-white/40 mx-2">/</span>
                  108 CHANTS
                </span>
                {isLive && <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-ping" />}
              </div>
            </div>

            {/* Mobile Controls */}
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

            {/* Desktop Controls */}
            <div className="mt-8 hidden md:flex gap-10 items-center bg-black/50 backdrop-blur-2xl px-8 py-4 rounded-[2rem] border border-white/10 shadow-2xl scale-95 md:scale-100">
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
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2 text-white/40">
                  <Volume2 className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Volume</span>
                </div>
                <input
                  type="range" min="0" max="1" step="0.05" defaultValue="1"
                  className="w-40 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
                  onChange={(e) => { if (audioRef.current) audioRef.current.volume = Number(e.target.value); }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        {!isChatMinimized && (
          <div className="w-[22rem] hidden lg:flex flex-col border-l border-white/5 relative bg-black/20 backdrop-blur-3xl animate-in slide-in-from-right duration-500">
            <ChatPanel deity={todayMantra.deity} />
          </div>
        )}

        {/* Mobile Chat */}
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

      {/* Audio */}
      <audio ref={audioRef} preload="auto" loop className="hidden" />

      {/* ── COUNTDOWN OVERLAY (session not live) ── */}
      {!isLive && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/92 backdrop-blur-3xl animate-in fade-in duration-700">
          <div className="text-center p-8 max-w-lg w-full flex flex-col items-center">

            {/* Next session deity image */}
            <div className="relative w-44 h-44 rounded-full mb-6 overflow-hidden border-2 border-saffron/50 shadow-[0_0_60px_rgba(255,153,51,0.3)]">
              <img src={nextMantra.image} alt="upcoming deity" className="w-full h-full object-cover object-top scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            <p className="text-saffron text-[10px] font-black uppercase tracking-[0.4em] mb-2">Upcoming Satsang</p>
            <h2 className="font-display text-2xl md:text-3xl font-black text-white mb-1 tracking-tight">
              {nextMantra.title}
            </h2>
            <p className="text-white/40 text-xs mb-4 font-medium uppercase tracking-widest">{nextLabel}</p>

            <p className="text-saffron/60 text-sm font-sanskrit italic mb-8 px-4 leading-relaxed">
              {nextMantra.subtitles.hi[0]}
            </p>

            <div className="inline-flex items-center gap-4 bg-black/70 backdrop-blur-xl px-8 py-5 rounded-2xl border border-saffron/20 shadow-2xl mb-6">
              <Clock className="w-5 h-5 text-saffron animate-pulse flex-shrink-0" />
              <span className="font-display text-4xl md:text-5xl font-black text-white tracking-[0.15em] tabular-nums">
                {countdown}
              </span>
            </div>

            <p className="text-white/25 text-[10px] tracking-widest uppercase">
              Aarti at 6:00 AM – 8:00 AM &amp; 6:00 PM – 8:00 PM daily
            </p>
          </div>
        </div>
      )}

      {/* ── LOGIN OVERLAY ── */}
      {showLogin && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
          <div className="relative w-full max-w-md glass-card p-8 md:p-10 border-saffron/30 shadow-[0_0_50px_rgba(255,153,51,0.2)] animate-in zoom-in slide-in-from-bottom-8 duration-700">

            {/* X Close — resumes audio */}
            <button
              onClick={handleCloseLogin}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white transition-all z-10"
              title="Continue Aarti"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-saffron rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,153,51,0.5)] border-4 border-black/40">
              <span className="text-4xl">🕉️</span>
            </div>

            <div className="text-center mt-6 mb-8">
              <h2 className="font-display text-3xl md:text-4xl font-black text-gradient-saffron mb-3">Join our Parivaar</h2>
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
                <span className="relative z-10 flex items-center justify-center gap-3">🛕 LOGIN WITH NAMAN DARSHAN</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>

              <div className="relative flex items-center justify-center py-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
                <span className="relative bg-[#1A1A1A] px-4 text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold">Or continue with</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => window.location.href = "https://namandarshan.com/login"}
                  className="bg-white/5 border border-white/10 py-3 rounded-xl hover:bg-white/10 transition-colors text-xs font-bold tracking-widest uppercase"
                >
                  Google
                </button>
                <button
                  onClick={() => window.location.href = "https://namandarshan.com/login"}
                  className="bg-white/5 border border-white/10 py-3 rounded-xl hover:bg-white/10 transition-colors text-xs font-bold tracking-widest uppercase"
                >
                  Mobile
                </button>
              </div>

              {/* Continue without login */}
              <button
                onClick={handleCloseLogin}
                className="w-full text-center text-xs text-white/40 hover:text-saffron transition-colors duration-200 pt-2 font-medium tracking-wide"
              >
                🕉️ Continue Aarti without login
              </button>

              <p className="text-center text-[10px] text-muted-foreground/60 leading-relaxed">
                By continuing, you agree to join the global Naman Darshan parivaar and receive spiritual updates.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VLC Subtitles */}
      <div className="fixed bottom-12 left-0 right-0 z-[150] flex flex-col items-center pointer-events-none px-6 mb-safe">
        {isLive && currentLine !== -1 && (
          <div key={currentLine} className="animate-in fade-in slide-in-from-bottom-1 duration-200 text-center">
            <div className="bg-black/60 backdrop-blur-md px-8 py-3 rounded-xl border border-white/10 shadow-2xl">
              <p className="font-sanskrit text-2xl md:text-4xl font-bold tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                <span className="bg-gradient-to-r from-temple-gold via-white to-temple-gold bg-clip-text text-transparent">
                  {todayMantra.subtitles[language][currentLine]}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}