const PANDIT_RESPONSES = [
  "🙏 जय श्री राम! Hanuman ji ki kripa aap par sada bani rahe. Keep chanting with devotion.",
  "🙏 Jai Bajrang Bali! Remember, Hanuman Chalisa removes all obstacles from your path. चालीसा पढ़ते रहिए।",
  "🕉️ Very good devotion! Hanuman ji says — संकट कटै मिटै सब पीरा, जो सुमिरै हनुमत बलबीरा।",
  "🙏 Wonderful! Keep your heart pure and chant with faith. Hanuman ji listens to every sincere prayer.",
  "🛕 Jai Shri Ram! The power of Hanuman Chalisa is immense. Even a single verse recited with devotion can move mountains.",
  "🙏 Remember the words — बुद्धिहीन तनु जानिके, सुमिरौं पवन कुमार। बल बुद्धि विद्या देहु मोहिं, हरहु कलेश विकार।",
  "🕉️ Hanuman ji is the remover of all difficulties. Keep faith, keep chanting. Jai Hanuman! 🙏",
  "🙏 आपकी भक्ति देख कर बहुत अच्छा लगा। Hanuman ji will surely bless you. राम राम!",
  "🛕 The 40 verses of Hanuman Chalisa contain the essence of all Vedas. Chant daily for peace and strength.",
  "🙏 Bajrang Baan ke prabhav se koi bhi sankat door ho jata hai. Keep your devotion strong!"
];

let responseIndex = 0;

export function getPanditResponse(): string {
  const response = PANDIT_RESPONSES[responseIndex % PANDIT_RESPONSES.length];
  responseIndex++;
  return response;
}

export function getGreeting(): string {
  return "🙏 Jai Shri Ram! Welcome to the virtual Hanuman Chalisa satsang. I am your AI Pandit. Feel free to ask anything about Hanuman Chalisa or share your prayers. 🙏";
}
