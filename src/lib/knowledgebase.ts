// ============================================================
// knowledgebase.ts  →  src/lib/knowledgebase.ts
//
// Poora devotional knowledge base — pure TypeScript mein 📚
// Yeh chunks browser mein embed hote hain (Transformers.js se)
// aur cosine similarity se search hote hain.
//
// Koi server nahi, koi backend nahi — 100% frontend RAG ✅
// ============================================================

export interface KnowledgeChunk {
  id: string;
  deity: "hanuman" | "shiva" | "gayatri" | "ganesh";
  category: "mantra" | "meaning" | "benefit" | "story" | "ritual";
  title: string;
  content: string;
  tags: string[];
}

// ============================================================
// HANUMAN KNOWLEDGE BASE
// ============================================================

const HANUMAN_CHUNKS: KnowledgeChunk[] = [
  {
    id: "han_chalisa_doha1",
    deity: "hanuman",
    category: "mantra",
    title: "Hanuman Chalisa — Opening Doha",
    content: `श्री गुरु चरन सरोज रज, निज मनु मुकुरु सुधारि।
बरनउँ रघुबर बिमल जसु, जो दायकु फल चारि।।
बुद्धिहीन तनु जानिके, सुमिरौं पवन-कुमार।
बल बुद्धि विद्या देहु मोहिं, हरहु कलेश विकार।।

Meaning: After purifying my mind with the dust of the Guru's lotus feet,
I describe the pure glory of Shri Ram, which grants the four fruits of life.
Knowing myself to be ignorant, I remember Pavan Kumar (Hanuman).
Grant me strength, wisdom, and knowledge — remove my afflictions and impurities.`,
    tags: ["doha", "opening", "guru", "strength", "wisdom", "chalisa"],
  },
  {
    id: "han_chalisa_1_4",
    deity: "hanuman",
    category: "mantra",
    title: "Hanuman Chalisa — Chaupai 1-4 (Hanuman's Glory)",
    content: `जय हनुमान ज्ञान गुन सागर। जय कपीस तिहुँ लोक उजागर।।
रामदूत अतुलित बलधामा। अंजनिपुत्र पवनसुत नामा।।
महावीर विक्रम बजरंगी। कुमति निवार सुमति के संगी।।
कंचन बरन बिराज सुबेसा। कानन कुंडल कुंचित केसा।।

Meaning: Victory to Hanuman — ocean of wisdom, illuminator of all three worlds.
Messenger of Ram, abode of incomparable strength, son of Anjani and Pavan.
The great hero, brave as thunderbolt, remover of evil thoughts.
Golden complexion, adorned in fine clothes, earrings, curly hair.`,
    tags: ["chaupai", "glory", "strength", "ram", "anjani", "bajrangi", "wisdom"],
  },
  {
    id: "han_sankat_mochan",
    deity: "hanuman",
    category: "benefit",
    title: "Hanuman — Sankat Mochan, Remover of All Problems",
    content: `Hanuman ji are known as Sankat Mochan (Remover of Difficulties).

संकट कटै मिटै सब पीरा। जो सुमिरै हनुमत बलबीरा।।
(All troubles are cut away and all pain vanishes for those who remember brave Hanuman.)

जो यह पढ़ै हनुमान चालीसा। होय सिद्धि साखी गौरीसा।।
(Whoever reads Hanuman Chalisa achieves perfection — Shiva is the witness.)

Benefits of chanting Hanuman Chalisa:
- Removes fear, negativity, and evil influences
1. Grants protection from enemies and difficulties
2. Brings health, wealth, and prosperity
- Tuesday and Saturday are especially auspicious for Hanuman worship`,
    tags: ["sankat mochan", "benefits", "protection", "fear", "problems", "tuesday", "saturday"],
  },
  {
    id: "han_bajrang_baan",
    deity: "hanuman",
    category: "mantra",
    title: "Bajrang Baan — Powerful Protection Mantra",
    content: `Bajrang Baan is one of the most powerful Hanuman stotras for protection and removal of evil.

निश्चय प्रेम प्रतीति ते, बिनय करैं सनमान।
तेहि के कारज सकल शुभ, सिद्ध करैं हनुमान।।
(With firm devotion and faith, all auspicious tasks are fulfilled by Hanuman ji.)

जय हनुमंत संत हितकारी। सुन लीजे प्रभु अरज हमारी।।
(Victory to Hanuman, benefactor of saints — please hear our prayer.)

Bajrang Baan is recited when facing severe difficulties, danger, or negative energies.
It should be read with full faith on Tuesday and Saturday.`,
    tags: ["bajrang baan", "protection", "powerful", "evil", "danger", "faith"],
  },
  {
    id: "han_sundarkand",
    deity: "hanuman",
    category: "story",
    title: "Sundarkand — Hanuman's Greatest Feat in Lanka",
    content: `Sundarkand is the 5th chapter of Ramcharitmanas — Hanuman ji's journey to Lanka.

Key events:
1. Hanuman leaps across the ocean to Lanka — demonstrating infinite power
2. Finds Mata Sita in Ashok Vatika, held captive by Ravana
3. Presents Ram's ring to Sita as proof of identity
4. Sita gives her Chudamani (jewel) to be returned to Ram
5. Destroys Ashok Vatika and battles Lanka's warriors
6. His tail is set on fire — he uses it to burn Lanka
7. Returns to Ram with Sita's location

जामवंत के बचन सुहाए। सुनि हनुमंत हृदय हरषाए।।
(Hearing Jambavan's inspiring words, Hanuman's heart was filled with joy.)

Reading Sundarkand removes obstacles, fulfills wishes, and brings peace to the household.`,
    tags: ["sundarkand", "lanka", "sita", "ocean", "ramcharitmanas", "obstacles"],
  },
  {
    id: "han_puja_vidhi",
    deity: "hanuman",
    category: "ritual",
    title: "Hanuman Ji Puja Vidhi — How to Worship",
    content: `Hanuman Ji Puja Method:

Best days: Tuesday (Mangalwar) and Saturday (Shaniwar)
Best time: Early morning or evening

Puja Items: Sindoor, red flowers, sesame oil lamp, besan ladoo as prasad

Steps:
1. Wear clean orange or red clothes
2. Light a diya with sesame oil or ghee
3. Apply sindoor tilak on Hanuman ji's idol
4. Offer red flowers
5. Recite Hanuman Chalisa 1, 3, 5, or 11 times
6. Sing Hanuman Aarti: आरती कीजे हनुमान लला की
7. Offer prasad and distribute to family
8. Chant: ॐ हनुमते नमः (108 times for best results)

On Saturdays, Hanuman ji's worship also reduces ill effects of Shani (Saturn).`,
    tags: ["puja", "worship", "ritual", "tuesday", "saturday", "sindoor", "how to"],
  },
];

// ============================================================
// SHIVA KNOWLEDGE BASE
// ============================================================

const SHIVA_CHUNKS: KnowledgeChunk[] = [
  {
    id: "shiv_maha_mrityunjay",
    deity: "shiva",
    category: "mantra",
    title: "Maha Mrityunjay Mantra — Complete Text and Meaning",
    content: `ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्।
उर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय माऽमृतात्।।

Om Tryambakam Yajamahe Sugandhin Pushtivardhanam
Urvaarukamiva Bandhanaan Mrityormukshiya Maamritaat

Word-by-word meaning:
- Om: The primordial sound, the universe
- Tryambakam: The three-eyed one (Lord Shiva)
- Yajamahe: We worship, honor
- Sugandhin: The fragrant one who nourishes all
- Pushtivardhanam: Who increases strength and prosperity
- Urvaarukamiva: Like a cucumber (fruit) from the vine
- Bandhanaan: From bondage
- Mrityormukshiya: Free us from death
- Maamritaat: Grant us immortality (moksha)

Overall meaning: We worship three-eyed Lord Shiva who nourishes all beings.
May He liberate us from death like a ripe cucumber freed from its vine — granting us immortality.`,
    tags: ["maha mrityunjay", "mantra", "moksha", "death", "liberation", "three eyed", "meaning", "arth"],
  },
  {
    id: "shiv_mrityunjay_benefits",
    deity: "shiva",
    category: "benefit",
    title: "Maha Mrityunjay Mantra — Benefits and When to Chant",
    content: `Benefits of chanting Maha Mrityunjay Mantra:

1. Health and Healing: Extremely powerful for recovery from serious illness
2. Protection from Accidents and Untimely Death
3. Fear Removal: Removes fear of death and the unknown
4. Mental Peace: Calms anxiety, stress, and grief
5. Moksha: With sincere practice, leads towards liberation
6. Longevity: Regular chanting blesses with a long, healthy life

When to chant:
- Brahma Muhurta (4-6 AM) — most powerful time
- During Shiva Ratri and Maha Shivratri
- When someone is ill — chant 108 times with a rudraksha mala
- Monday is Lord Shiva's day — most auspicious
- During Shravan month — extremely powerful

How many times:
- 11 times daily for protection
- 108 times for serious illness or problems
- 1008 times for major life crises`,
    tags: ["benefits", "health", "illness", "protection", "monday", "shivratri", "how many times"],
  },
  {
    id: "shiv_rudrashtakam",
    deity: "shiva",
    category: "mantra",
    title: "Rudrashtakam — 8 Verses in Praise of Shiva by Tulsidas",
    content: `नमामीशमीशान निर्वाणरूपं विभुं व्यापकं ब्रह्मवेदस्वरूपम्।
निजं निर्गुणं निर्विकल्पं निरीहं चिदाकाशमाकाशवासं भजेऽहम्।।

(I bow to the Lord — form of liberation, omnipresent, embodiment of Vedic knowledge.
Self-existent, without attributes, beyond thought, desireless — I worship Him.)

मंदाकिनी सलिल चंदन चर्चिताय नंदीश्वर प्रमथनाथ महेश्वराय।
मंदारपुष्प बहुपुष्प सुपूजिताय उमेश भक्तजनपालक शंकरय नम:।।

(To the one adorned with Ganga water and sandalwood, lord of Nandi,
worshipped with mandara flowers, Lord of Uma, protector of devotees — salutations.)

Rudrashtakam was composed by Goswami Tulsidas.
It praises Shiva's infinite qualities — destroyer of evil, compassion for devotees,
his form as pure consciousness.`,
    tags: ["rudrashtakam", "tulsidas", "eight verses", "praise", "stotram", "shankar"],
  },
  {
    id: "shiv_om_namah_shivay",
    deity: "shiva",
    category: "mantra",
    title: "Om Namah Shivaya — The Panchakshara Mantra",
    content: `ॐ नमः शिवाय — The Panchakshara (Five-Syllable) Mantra

Five syllables representing the five elements:
Na (न) = Earth (Prithvi) — the physical body
Ma (म) = Water (Jal) — the life force
Shi (शि) = Fire (Agni) — inner light, consciousness
Va (व) = Air (Vayu) — the breath, vital energy
Ya (य) = Space (Akasha) — infinite consciousness

Om represents the primordial sound beyond the five elements — the absolute Brahman.

Meaning: "I bow to Shiva" — deeper meaning:
"I bow to the auspicious one who is within me and all around me."

Benefits:
- Cleanses the mind and soul
- Creates positive vibrations
- Connects devotee with Shiva consciousness
- Can be chanted anytime, anywhere — no restrictions
- 108 times daily on a rudraksha mala is ideal`,
    tags: ["om namah shivaya", "panchakshara", "five elements", "meaning", "meditation", "108"],
  },
  {
    id: "shiv_puja_vidhi",
    deity: "shiva",
    category: "ritual",
    title: "Shiva Puja Vidhi — How to Worship Lord Shiva",
    content: `Shiva Puja Complete Method:

Best day: Monday (Somwar) — Shiva's own day
Best months: Shravan, Kartik
Most auspicious: Maha Shivratri, Pradosh (13th lunar day)

Puja Items: Bel patra (Bilva leaves), dhatura flowers, white flowers,
milk, curd, honey, ghee, sugar (for Panchamrit abhishek), sandalwood paste

Abhishek (Sacred Bath) — Most important Shiva ritual.
Pour over Shiva linga in sequence:
1. Water, 2. Milk, 3. Curd, 4. Honey, 5. Ghee, 6. Sugar, 7. Gangajal

While pouring, chant: ॐ नमः शिवाय

After abhishek, offer Bel patra chanting:
त्रिदलं त्रिगुणाकारं त्रिनेत्रं च त्रिधायुतम्

Avoid: Red flowers, Ketaki flowers, and Tulsi are generally not offered to Shiva.`,
    tags: ["puja", "ritual", "abhishek", "monday", "bel patra", "shivling", "how to worship"],
  },
];

// ============================================================
// GAYATRI KNOWLEDGE BASE
// ============================================================

const GAYATRI_CHUNKS: KnowledgeChunk[] = [
  {
    id: "gay_mantra_full",
    deity: "gayatri",
    category: "mantra",
    title: "Gayatri Mantra — Complete Text, Transliteration, and Meaning",
    content: `ॐ भूर्भुवः स्वः।
तत्सवितुर्वरेण्यं।
भर्गो देवस्य धीमहि।
धियो यो नः प्रचोदयात्।।

Om Bhur Bhuvah Swah
Tat Savitur Varenyam
Bhargo Devasya Dheemahi
Dhiyo Yo Nah Prachodayat

Word-by-word meaning:
- Om: The primordial sound, Brahman
- Bhur: Earth plane (physical world)
- Bhuvah: Astral/vital plane
- Swah: Celestial/mental plane
- Tat Savitur: That Divine Sun (source of creation)
- Varenyam: Most worthy of worship
- Bhargo: Spiritual light that burns away sins
- Devasya: Of the Divine
- Dheemahi: We meditate upon
- Dhiyo Yo Nah Prachodayat: May that inspire and illuminate our intellect

Complete meaning: We meditate upon the Divine Light of the Sun (Savitri) who pervades all
three worlds. May that Divine radiance illuminate our intellect and inspire us toward
righteous wisdom.`,
    tags: ["gayatri mantra", "meaning", "arth", "om", "sun", "savitri", "meditation", "24 syllables"],
  },
  {
    id: "gay_24_syllables",
    deity: "gayatri",
    category: "mantra",
    title: "Gayatri's 24 Syllables — Secret Significance",
    content: `The Gayatri Mantra has exactly 24 syllables (excluding Om and Vyahritis):

tat(1) sa(2) vi(3) tur(4) va(5) re(6) ni(7) yam(8)
bhar(9) go(10) de(11) vas(12) ya(13) dhee(14) ma(15) hi(16)
dhi(17) yo(18) yo(19) nah(20) pra(21) cho(22) da(23) yat(24)

Why 24 syllables are special:
- 24 Avatars of Vishnu are associated with each syllable
- 24 hours of the day — chanting connects you to all time
- Each syllable corresponds to a specific divine shakti (power)

The Three Vyahritis (Bhur, Bhuvah, Swah) represent:
- Bhur: The gross body (sthula sharira)
- Bhuvah: The subtle body (sukshma sharira)
- Swah: The causal body (karana sharira)

Gayatri Devi has 5 faces (Panch Mukhi) representing 5 pranas,
10 hands holding divine weapons, and rides a swan representing viveka (discrimination).
She is called Veda Mata — Mother of all Vedas.`,
    tags: ["24 syllables", "significance", "gayatri devi", "vedas", "power", "panch mukhi"],
  },
  {
    id: "gay_benefits",
    deity: "gayatri",
    category: "benefit",
    title: "Benefits of Gayatri Mantra — Why It Is the Maha Mantra",
    content: `Gayatri Mantra is called the Maha Mantra (Great Mantra) of the Vedas.
Rishis say: One who chants Gayatri with understanding gains the benefits of all other mantras.

Specific benefits:
1. Intellect and Wisdom: Sharpens the mind, improves memory and concentration
2. Spiritual Purification: Burns away sins and negative karma
3. Health: Creates healing vibrations — 432 Hz frequency
4. Protection: Powerful protective shield around the devotee
5. Positive Energy: Transforms negative thought patterns
6. Intuition: Opens the Ajna chakra (third eye) with regular practice
7. Liberation (Moksha): Ultimately leads to freedom from rebirth

From Bhagavad Gita (10:35): Krishna says "Among mantras, I am the Gayatri."

Ideal practice:
- Chant at Sandhya times: dawn, noon, and dusk
- 108 times per sitting on a tulsi or crystal mala
- Face East at sunrise, North at noon, West at sunset
- Minimum 3, 9, 27, or 108 times`,
    tags: ["benefits", "why chant", "maha mantra", "intellect", "wisdom", "moksha", "gita"],
  },
  {
    id: "gay_sandhya_vandanam",
    deity: "gayatri",
    category: "ritual",
    title: "Sandhya Vandanam — The Complete Gayatri Daily Ritual",
    content: `Sandhya Vandanam — worshipping Gayatri at three sandhya (junction) times.

Three Sandhyas:
1. Pratah Sandhya (Dawn) — at sunrise, most powerful time
2. Madhyahna Sandhya (Noon) — at midday
3. Sayam Sandhya (Dusk) — at sunset

Basic Steps:
1. Achamana: Sip water 3 times chanting ॐ केशवाय नमः...
2. Pranayama: Breathe while mentally chanting the mantra
3. Arghya: Cup both palms, pour water while chanting to Surya
4. Gayatri Japa: 10 times minimum, 108 times ideal
5. Close with Namaskara

For modern practitioners: Even 3-10 minutes of sincere Gayatri meditation
at sunrise while facing East is deeply beneficial.

Students chanting daily show marked improvement in memory and focus.`,
    tags: ["sandhya vandanam", "ritual", "sunrise", "sunset", "how to", "daily practice", "arghya"],
  },
  {
    id: "gay_rules",
    deity: "gayatri",
    category: "ritual",
    title: "Rules and Guidelines for Gayatri Mantra Chanting",
    content: `Traditional guidelines for Gayatri Mantra practice:

Who can chant:
- In modern practice, Gayatri Mantra is open to all sincere seekers
- Women: Modern Vedic scholars confirm women can and should chant Gayatri
- Children: Highly beneficial for students and young learners

Best times (in order of power):
1. Brahma Muhurta (3:40 AM - 5:30 AM) — most powerful
2. Sunrise (Pratah Sandhya)
3. Noon (Madhyahna)
4. Sunset (Sayam Sandhya)

What to use:
- Mala: Tulsi mala (most auspicious), crystal sphatika, or rudraksha
- Direction: Face East at sunrise, North or East at other times
- Asana: Sit on a mat (wool, cotton, or kusha grass)

Mental chanting (manasik japa) is more powerful than verbal chanting.

A simple daily practice:
Sit quietly at sunrise, face east, close eyes, take 3 deep breaths,
and sincerely chant Om Bhur Bhuvah Swah... 11 or 21 times.
This alone can transform one's life gradually.`,
    tags: ["rules", "guidelines", "who can chant", "mala", "women", "children", "practice"],
  },
];

// ============================================================
// GANESH KNOWLEDGE BASE (Day 4)
// ============================================================

const GANESH_CHUNKS: KnowledgeChunk[] = [
  {
    id: "gan_dheemahi_stotram",
    deity: "ganesh",
    category: "mantra",
    title: "Shree Ganeshaaya Dheemahi — Powerful Ganesha Stotram",
    content: `गणनायकाय गणदैवताय गणाध्यक्षाय धीमहि।
गुणशरीराय गुणमण्डिताय गुणेशानाय धीमहि॥

वक्रतुण्डाय धूम्रकेतवे गणाध्यक्षाय धीमहि।
गुणशरीराय गुणमण्डिताय गुणेशानाय धीमहि॥

एकदन्ताय वक्रतुण्डाय गौरीतनयाय धीमहि।
गजेशानाय भालचन्द्राय श्री गणेशाय धीमहि॥

गजवक्त्राय गजमुखाय गणाध्यक्षाय धीमहि।
गुणशरीराय गुणमण्डिताय गुणेशानाय धीमहि॥

English Transliteration:
Gan-nāyakāya gan-daivatāya Ganādhyakṣāya dhīmahi
Guṇa-śarīrāya guṇa-maṇḍitāya Guṇeśānāya dhīmahi

Vakra-tuṇḍāya dhūmra-ketave Ganādhyakṣāya dhīmahi
Guṇa-śarīrāya guṇa-maṇḍitāya Guṇeśānāya dhīmahi

Ekadantāya vakra-tuṇḍāya Gaurī-tanayāya dhīmahi
Gajeśānāya bhāla-candrāya Śrī Gaṇeśāya dhīmahi

Gaja-vaktrāya gaja-mukhāya Ganādhyakṣāya dhīmahi
Guṇa-śarīrāya guṇa-maṇḍitāya Guṇeśānāya dhīmahi`,
    tags: ["ganesh", "stotram", "dheemahi", "ganpati", "obstacle remover"],
  },
  {
    id: "gan_meaning_dheemahi",
    deity: "ganesh",
    category: "meaning",
    title: "Meaning of Ganesha Dheemahi Stotram",
    content: `This powerful stotram praises Lord Ganesha's various divine attributes:

1. Gan-nayakaya: The leader of all groups/senses.
2. Gan-daivataya: The deity of the Ganas (Shiva's followers).
3. Vakra-tundaya: The one with the curved trunk.
4. Gauri-tanayaya: The beloved son of Mata Gauri (Parvati).
5. Gajeshanaya: The Lord of Elephants.
6. Bhalachandraya: The one who wears the crescent moon on his forehead.

'Dheemahi' means 'We meditate upon'. 

Overall Meaning: We meditate upon the Lord of the Ganas, the one with the curved trunk, the son of Gauri, the elephant-headed deity who is adorned with all virtues and who is the supreme leader of all divine forces.`,
    tags: ["meaning", "arth", "dheemahi", "attributes"],
  },
  {
    id: "gan_benefits",
    deity: "ganesh",
    category: "benefit",
    title: "Benefits of Ganesha Worship (Day 4)",
    content: `Lord Ganesha is Vighnaharta — the remover of all obstacles.

Benefits of chanting Ganesh Stotrams:
- Removal of hurdles in education, career, and personal life.
- Bringing auspiciousness (Shubh) and profit (Laabh) to the household.
- Gaining wisdom (Buddhi) and success (Siddhi).
- Every new beginning (Shubhaarambh) should start with 'Om Gan Ganapataye Namah'.

Day 4 (Chaturthi) is especially dedicated to Lord Ganesha.`,
    tags: ["benefits", "vighnaharta", "success", "new beginnings"],
  },
];

// ============================================================
// COMBINED KNOWLEDGE BASE
// ============================================================

// Saare chunks ek jagah — vectorstore yahi use karta hai
export const ALL_CHUNKS: KnowledgeChunk[] = [
  ...HANUMAN_CHUNKS,
  ...SHIVA_CHUNKS,
  ...GAYATRI_CHUNKS,
  ...GANESH_CHUNKS,
];

export const CHUNK_COUNT = ALL_CHUNKS.length;
