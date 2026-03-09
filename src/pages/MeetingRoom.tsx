import { useEffect, useRef, useState } from "react";
import namanLogo from "@/assets/naman-logo.webp";
import ChatPanel from "@/components/ChatPanel";
import { useNavigate } from "react-router-dom";
import { Maximize, Minimize, Volume2, Globe, MessageSquare, X, Users } from "lucide-react";
// 🔥 Calculate live satsang progress
const getLiveSatsangProgress = (chantDuration: number) => {
  const now = new Date();

  const morningStart = new Date();
  morningStart.setHours(6, 0, 0, 0);

  const eveningStart = new Date();
  eveningStart.setHours(18, 0, 0, 0);

  let startTime: Date | null = null;

  if (now >= morningStart && now < new Date(morningStart.getTime() + 2 * 60 * 60 * 1000)) {
    startTime = morningStart;
  }
  else if (now >= eveningStart && now < new Date(eveningStart.getTime() + 2 * 60 * 60 * 1000)) {
    startTime = eveningStart;
  }

  if (!startTime) {
    return {
      completed: 0,
      remaining: 108,
      audioPosition: 0
    };
  }

  const elapsedSeconds =
    (now.getTime() - startTime.getTime()) / 1000;

  const chantNumber = Math.floor(elapsedSeconds / chantDuration);

  const completed = Math.min(chantNumber, 108);
  const remaining = Math.max(108 - completed, 0);

  const audioPosition = elapsedSeconds % chantDuration;

  return {
    completed,
    remaining,
    audioPosition
  };
};
export default function MeetingRoom() {

  const navigate = useNavigate();
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
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [loginPromptShown, setLoginPromptShown] = useState(false);


  const day = new Date().getDay();
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = hours + minutes / 60;

  const isMorning = currentTime >= 6 && currentTime < 8;
  const isEvening = currentTime >= 18 && currentTime < 20;

  useEffect(() => {
    if (!isMorning && !isEvening) {
      let message = "";

      if (currentTime < 6) {
        message = "Satsang begins at 6:00 AM.";
      }
      else if (currentTime >= 8 && currentTime < 18) {
        message = "Satsang begins at 6:00 PM.";
      }
      else if (currentTime >= 20) {
        message = "Today's satsang is completed. Please join tomorrow at 6:00 AM.";
      }

      alert(message);
      navigate("/");
    }
  }, []);
  const mantras: Record<number, any> = {

    0: {
      title: "☀️ Surya Bhagwan Mantra (Daily Jaap)",
      audio: "/audio/sunday.mp3",
      image: "/images/surya_bhagwan.sunday.png",
      deity: "surya",
      chantDuration: 22.496,
      timings: [[0.000, 5.412],
      [5.412, 9.875],
      [9.875, 14.921],
      [14.921, 22.496],],
      subtitles: {
        en: ["Tato Yuddha Parishrantam Samare Chintaya Stitham | Ravanaam Chaagrato Drishtvaa Yuddhaaya Samupasthitam ||1||",

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
          "Ityarshe Srimadramayana Valmikye Adikavye Yudhkande Panchadhik Shattamaah Sargaah ll"
        ],
        hi: ["ततो युद्धपरिश्रान्तं समरे चिन्तया स्थितम्‌ । रावणं चाग्रतो दृष्ट्वा युद्धाय समुपस्थितम्‌ ॥1॥",
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

          "इत्यर्षे श्रीमद्रमयाने वाल्मिक्ये आदिकाव्ये युद्धकाण्डे पञ्चाधिक शततमः सर्गः ॥]"],
      },
    },
    1: {
      title: "🔱 Maha Mrityunjay Jaap (108 Times)",
      audio: "/audio/monday.mp3",
      image: "/images/lordshiva.monday.jpg",
      deity: "shiva",
      chantDuration: 20.6,
      timings: [[3.0, 7.0], [7.0, 9.8], [9.8, 12.6], [12.6, 20.6]],
      subtitles: {
        en: [
          "Tryambakam Yajamahe",
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
        [0.000, 6.460], [6.460, 12.930], [12.930, 19.390], [19.390, 25.850],
        [25.850, 32.310], [32.310, 38.780], [38.780, 45.240], [45.240, 51.700],
        [51.700, 58.170], [58.170, 64.630], [64.630, 71.090], [71.090, 77.560],
        [77.560, 84.020], [84.020, 90.480], [90.480, 96.950], [96.950, 103.410],
        [103.410, 109.870], [109.870, 116.340], [116.340, 122.800], [122.800, 129.260],
        [129.260, 135.730], [135.730, 142.190], [142.190, 148.650], [148.650, 155.120],
        [155.120, 161.580], [161.580, 168.040], [168.040, 174.510], [174.510, 180.970],
        [180.970, 187.430], [187.430, 193.900], [193.900, 200.360], [200.360, 206.820],
        [206.820, 213.290], [213.290, 219.750], [219.750, 226.210], [226.210, 232.680],
        [232.680, 239.140], [239.140, 245.600], [245.600, 252.070], [252.070, 258.530],
        [258.530, 264.990], [264.990, 271.460], [271.460, 277.920], [277.920, 284.380],
        [284.380, 290.850], [290.850, 297.310], [297.310, 303.770], [303.770, 310.240],
        [310.240, 316.700], [316.700, 323.160], [323.160, 329.630], [329.630, 336.090],
        [336.090, 342.550], [342.550, 349.020], [349.020, 355.480], [355.480, 361.940],
        [361.940, 368.410], [368.410, 374.870], [374.870, 381.330], [381.330, 387.800],
        [387.800, 394.260], [394.260, 400.720], [400.720, 407.190], [407.190, 413.650],
        [413.650, 420.110], [420.110, 426.580], [426.580, 433.040], [433.040, 439.500],
        [439.500, 445.970], [445.970, 452.430], [452.430, 458.890], [458.890, 465.360],
        [465.360, 471.820], [471.820, 478.280], [478.280, 484.750], [484.750, 491.210],
        [491.210, 497.670], [497.670, 504.140], [504.140, 510.600], [510.600, 517.060],
        [517.060, 523.530], [523.530, 529.990], [529.990, 536.450], [536.450, 542.920],
        [542.920, 549.380], [549.380, 555.840], [555.840, 562.310], [562.310, 568.770],
        [568.770, 575.200], [575.200, 580.000]
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
          "RamLakhanaSitaSahita,HridayBasahuSoorBhoop|"
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
      timings: [// Chant 1
        [0.000, 5.821],
        [5.821, 9.968],
        [9.968, 15.082],
        [15.082, 25.182],

        // Chant 2
        [25.182, 31.003],
        [31.003, 35.150],
        [35.150, 40.264],
        [40.264, 50.364],

        // Chant 3
        [50.364, 56.185],
        [56.185, 60.332],
        [60.332, 65.446],
        [65.446, 75.546],

        // Chant 4
        [75.546, 81.367],
        [81.367, 85.514],
        [85.514, 90.628],
        [90.628, 100.728]

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
      chantDuration: 160.0,
      syncOffset: 0,
      timings: [
        [1.82, 5.60], [5.60, 9.40], [9.40, 15.28], [15.28, 25.92], [25.92, 36.56],
        [36.56, 66.01], [66.01, 103.84], [103.84, 114.92], [114.92, 125.60],
        [125.60, 136.17], [136.17, 146.55], [146.55, 154.80], [154.80, 160.00]
      ],
      subtitles: {
        en: [
          "Shri Ganeshayanam,",
          "Guru Brihas Patil Jeevam,",
          "Suracharyo Vidambarakam",
          "Vaheesho, Dheeshano, Dheerghasma, Shukhu, Peethambaram Yuvam",
          "Sudha Drishtihi, Graha Dheesho, Graha Peedha Paharakaha",
          "Dayagarah, Saumya Murthihi, Surarchaha, Kumkumadhyuthihi  Lokapujyo, Lokadurukhu, Nidhikyo, Nidhikarakaha",
          "Tara Patishankhi Raso, Veda Vaidya Peetha Magadha",
          "Bhaktya Brihas Patil Smritva Namaanye Daliya Pateti",
          "Arogi, Balavan, Sriman, Putravan, Sabave Naraka",
          "Jeevet Varshashatam Matyo, Paapam Nashyati Nashyati",
          "Yath Poojayethi, Guru Dinam Peetha Gandhakshatam Baraihi",
          "Pushpati Kopakareshcha, Poojayithwa Brihas Patil",
          "Brahmanand, Bhojayithwacha, Peetha Shantir, Bhavedhuroga"
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
        [0.000, 3.900], // ॐ भूर्भुवः स्वः
        [3.900, 7.575], // तत्सवितुर्वरेण्यं
        [7.575, 11.050], // भर्गो देवस्य धीमहि
        [11.050, 14.595], // धियो यो नः प्रचोदयात्
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
        [0.000, 6.800],   // 00:00.00 Om Kalabhairavaai namah
        [6.800, 13.600],  // 00:06.80 Om Kalabhairavaai namah
        [13.600, 20.440], // 00:13.60 Om Kalabhairavaai namah
        [20.440, 44.000], // 00:20.44 Verse 1
        [44.000, 67.500], // 00:44.00 Verse 2
        [67.500, 91.000], // 01:07.50 Verse 3
        [91.000, 114.500],// 01:31.00 Verse 4
        [114.500, 138.000],// 01:54.50 Verse 5
        [138.000, 161.500],// 02:18.00 Verse 6
        [161.500, 185.000],// 02:41.50 Verse 7
        [185.000, 208.500],// 03:05.00 Verse 8
        [208.500, 245.333] // 03:28.50 Verse 9 + Outro
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
          "देवराज सेव्यमान पावनाङ्घ्रि पङ्कजंव्यालयज्ञ सूत्रमिन्दु शेखरं कृपाकरम् नारदादि योगिवृन्द वन्दितं दिगंबरंकाशिका पुराधिनाथ कालभैरवं भजे॥ १॥ ",
          "भानुकोटि भास्वरं भवाब्धितारकं परंनीलकण्ठम् ईप्सितार्थ दायकं त्रिलोचनम् ।कालकालम् अंबुजाक्षम् अक्षशूलम् अक्षरंकाशिका पुराधिनाथ कालभैरवं भजे॥२॥ ",
          "शूलटङ्क पाशदण्ड पाणिमादि कारणंश्यामकायम् आदिदेवम् अक्षरं निरामयम् ।भीमविक्रमं प्रभुं विचित्रताण्डवप्रियंकाशिका पुराधिनाथ कालभैरवं भजे ॥३॥ ",
          "भुक्तिमुक्तिदायकं प्रशस्तचारुविग्रहंभक्तवत्सलं स्थितं समस्तलोकविग्रहम् ।विनिक्वणन् मनोज्ञहेमकिङ्किणी लसत्कटिंकाशिका पुराधिनाथ कालभैरवं भजे ॥४॥ ",
          "धर्मसेतुपालकं त्वधर्ममार्गनाशकंकर्मपाश मोचकं सुशर्मदायकं विभुम् ।स्वर्णवर्णशेषपाश शोभिताङ्गमण्डलंकाशिका पुराधिनाथ कालभैरवं भजे ॥ ५॥ ",
          "रत्नपादुका प्रभाभिराम पादयुग्मकंनित्यम् अद्वितीयम् इष्टदैवतं निरञ्जनम् ।मृत्युदर्पनाशनं कराळदंष्ट्रमोक्षणंकाशिका पुराधिनाथ कालभैरवं भजे ॥६॥ ",
          "अट्टहास भिन्नपद्मजाण्डकोश सन्ततिंदृष्टिपातनष्टपाप जालमुग्रशासनम् ।अष्टसिद्धिदायकं कपाल मालिकन्धरंकाशिका पुराधिनाथ कालभैरवं भजे ॥७॥ ",
          "भूतसङ्घनायकं विशालकीर्तिदायकंकाशिवासलोक पुण्यपापशोधकं विभुम् ।नीतिमार्गकोविदं पुरातनं जगत्पतिंकाशिका पुराधिनाथ कालभैरवं भजे ॥८॥ ",
          "कालभैरवाष्टकं पठन्ति ये मनोहरंज्ञानमुक्तिसाधनं विचित्रपुण्यवर्धनम् ।शोक मोह दैन्य लोभ कोप ताप नाशनंते प्रयान्ति कालभैरवाङ्घ्रि सन्निधिं ध्रुवम् ॥९॥ ",
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
      setOnlineCount((prev) => Math.max(90, prev + (Math.random() > 0.5 ? 1 : -1)));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // 🔊 Autoplay Audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setChantCount((prev) => {
        const next = Math.min(prev + 1, 108);

        if (next < 108) {
          audio.currentTime = 0;
          audio.play();
        }

        return next;
      });
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  // 🔥 Smooth Sync (No Lag)

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


      lastTime = currentTime;

      const chantDuration = todayMantra.chantDuration;

      const timeInsideChant = adjustedTime % chantDuration;


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
          text: todayMantra.subtitles[language][lineIndex]
        });
        lastLine.current = lineIndex;
      }

      frame = requestAnimationFrame(sync);
    };

    frame = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(frame);
  }, [todayMantra, language]);

  // 🚪 Show Login Form after 5 chants

  useEffect(() => {
    if (chantCount >= 5 && !loginPromptShown) {
      setShowLogin(true);
      setLoginPromptShown(true);

      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [chantCount, loginPromptShown]);

  // ▶ Continue chanting without login
  const continueChanting = () => {
    setShowLogin(false);

    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <div ref={containerRef} className="flex flex-col h-[100dvh] bg-background overflow-hidden selection:bg-saffron/30 relative">

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

        {/* Mantra Section */}
        <div className="flex flex-col flex-1 relative overflow-hidden">

          {/* Background Image with Ken Burns Effect */}
          <div
            className="absolute inset-0 bg-contain bg-center bg-no-repeat animate-ken-burns scale-105"
            style={{ backgroundImage: `url(${todayMantra.image})` }}
          />
          <div className="absolute inset-0 bg-black/60 md:bg-black/30 backdrop-brightness-75" />

          {/* Subtle Ambient Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

          {/* Foreground Content */}
          <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 md:px-12">

            {/* Chant Counting Ring/Capsule */}
            <div className="mt-6 md:mt-10 relative group scale-90 md:scale-100">
              <div className="absolute -inset-1 bg-gradient-to-r from-saffron to-temple-gold rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500" />
              <div className="relative flex items-center gap-3 bg-black/60 backdrop-blur-xl px-6 py-2.5 rounded-full border border-white/20 shadow-2xl">
                <span className="text-lg md:text-xl animate-spin-slow">📿</span>
                <span className="text-sm md:text-lg font-black tracking-widest text-white decoration-primary underline-offset-8 decoration-2">
                  <span className="text-primary">{chantCount}</span>
                  <span className="text-white/40 mx-2">/</span>
                  108
                  <span className="text-xs ml-3 text-white/60">
                    ({108 - chantCount} remaining)
                  </span>
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
            <div className="mt-8 hidden md:flex gap-10 items-center bg-black/50 backdrop-blur-2xl px-8 py-4 rounded-[2rem] border border-white/10 shadow-2xl scale-95 md:scale-100">
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
        {!isChatMinimized && (
          <div className="w-[22rem] hidden lg:flex flex-col border-l border-white/5 relative bg-black/20 backdrop-blur-3xl animate-in slide-in-from-right duration-500">
            <ChatPanel deity={todayMantra.deity} />
          </div>
        )}

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
            </div><div className="space-y-6">

              {/* Continue Chanting */}
              <button
                onClick={continueChanting}
                className="w-full bg-white/10 border border-white/20 text-white font-display font-bold py-4 rounded-xl hover:bg-white/20 transition-all"
              >
                🙏 Continue Chanting as Guest
              </button>

              {/* Login Button */}
              <button
                onClick={() => window.location.href = "https://namandarshan.com/login"}
                className="w-full bg-primary text-primary-foreground font-display font-black text-xl py-5 rounded-2xl shadow-[0_10px_40px_rgba(255,153,51,0.3)] hover:scale-[1.03] active:scale-95 transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  🛕 LOGIN WITH NAMAN DARSHAN
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>

            </div>
          </div>
        </div>
      )}

      {/* Start Session Overlay (Audio Unblocker) */}
      {!isStarted && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-3xl animate-in fade-in duration-700">
          <div className="text-center p-8 max-w-lg">
            <div className="w-32 h-32 bg-saffron/20 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-saffron animate-pulse">
              <span className="text-6xl">🕉️</span>
            </div>
            <h2 className="font-display text-4xl font-black text-white mb-4 tracking-tight">Ready for Satsang?</h2>
            <p className="text-white/60 mb-10 leading-relaxed font-medium">Click below to start the spiritual journey and enable the divine audio experience.</p>
            <button
              onClick={() => {
                setIsStarted(true);
                if (!audioRef.current) return;
                const audio = audioRef.current;
                const progress = getLiveSatsangProgress(todayMantra.chantDuration);

                if (progress.completed >= 108) {
                  alert("Today's satsang is completed.");
                  navigate("/");
                  return;
                }
                // load audio
                audio.src = todayMantra.audio;
                // jump to correct LIVE position
                audio.currentTime = progress.audioPosition;
                // set chant progress
                setChantCount(progress.completed);

                audio.play();
              }}


              className="px-12 py-5 bg-saffron text-white font-display font-black text-xl rounded-2xl shadow-[0_10px_40px_rgba(255,153,51,0.4)] hover:scale-105 active:scale-95 transition-all duration-300"
            >
              START SPIRITUAL SESSION
            </button>
          </div>
        </div>
      )
      }

      {/* VLC-Style Bottom Subtitles */}
      <div className="fixed bottom-12 left-0 right-0 z-[150] flex flex-col items-center pointer-events-none px-6 mb-safe">
        {currentLine !== -1 && isStarted && (
          <div
            key={currentLine}
            className="animate-in fade-in slide-in-from-bottom-1 duration-200 text-center"
          >
            <div className="bg-black/60 backdrop-blur-md px-8 py-3 rounded-xl border border-white/10 shadow-2xl max-w-3xl">
              <p className="font-sanskrit text-lg md:text-2xl font-bold tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                <span className="bg-gradient-to-r from-temple-gold via-white to-temple-gold bg-clip-text text-transparent">
                  {todayMantra.subtitles[language][currentLine]}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div >
  );
}