import type { Chapter } from "./types";

// THE SCRIPT. Edit dialogue, gestures, shots and timing here.
// Facts come only from lib/projects.ts, lib/skills.ts and lib/experience.ts.
// Story framing (the robot's jokes, "a question came up") is storytelling, not a claim about dates or events.

export const chapters: Chapter[] = [
  // ───────────────────────── OPENING ─────────────────────────
  {
    id: "intro", n: 0, title: "Hello?", subtitle: "A dark screen, a sleepy robot", env: "void", music: "void",
    start: [0, 0], basis: "Introduces Gautam Prajapati: developer, project builder, Accountbiz owner.",
    beats: [
      { id: "i-dark", emotion: "sleep", gesture: "idle", shot: "wide", pause: 1400 },
      { id: "i-wake", emotion: "neutral", gesture: "lookAround", shot: "eyes", pause: 2000, sfx: "wake" },
      {
        id: "i-test", emotion: "confused", gesture: "tilt", shot: "mid", tone: "soft",
        text: "Hello? Testing... testing...", hi: "हेलो? टेस्टिंग... टेस्टिंग...", en: "Hello? Testing... testing...",
      },
      {
        id: "i-arre", emotion: "surprised", gesture: "faceCamera", shot: "close", tone: "excited", sfx: "gasp",
        text: "Arre! Aap aa gaye? Finally!", hi: "अरे! आप आ गए? फ़ाइनली!", en: "Oh! You're here? Finally!",
      },
      {
        id: "i-watch", emotion: "sly", gesture: "checkWatch", shot: "mid",
        text: "Main toh kab se wait kar raha tha. Waise technically, website load hone mein sirf do second lage... par mere liye emotionally bahut time tha.",
        hi: "मैं तो कब से वेट कर रहा था। वैसे टेक्निकली, वेबसाइट लोड होने में सिर्फ़ दो सेकंड लगे... पर मेरे लिए इमोशनली बहुत टाइम था।",
        en: "I've been waiting forever. Technically the site took two seconds to load... but emotionally, that was a long time.",
      },
      {
        id: "i-story", emotion: "happy", gesture: "faceCamera", shot: "mid", tone: "excited",
        text: "Chaliye, aapko ek interesting bande ki story sunata hoon. Naam hai Gautam.",
        hi: "चलिए, आपको एक इंटरेस्टिंग बंदे की स्टोरी सुनाता हूँ। नाम है गौतम।",
        en: "Let me tell you the story of an interesting guy. His name is Gautam.",
      },
      { id: "i-beat", emotion: "soft", gesture: "idle", shot: "mid", pause: 1100 },
      {
        id: "i-dev", emotion: "proud", gesture: "point", shot: "mid", target: [2, 1.2, 0],
        text: "Developer hai. Projects banata hai. Accountbiz chalata hai.",
        hi: "डेवलपर है। प्रोजेक्ट्स बनाता है। अकाउंटबिज़ चलाता है।",
        en: "He's a developer. He builds projects. He runs Accountbiz.",
      },
      {
        id: "i-lean", emotion: "sly", gesture: "lean", shot: "eyes", set: ["title"],
        text: "Aur mujhe yeh sab explain karne ki responsibility de di. Khud code likh rahe hain. Classic.",
        hi: "और मुझे यह सब एक्सप्लेन करने की ज़िम्मेदारी दे दी। खुद कोड लिख रहे हैं। क्लासिक।",
        en: "And he handed ME the job of explaining all this. He's busy writing code. Classic.",
      },
      { id: "i-title", emotion: "happy", gesture: "idle", shot: "mid", set: ["title", "cta"], hold: true, pause: 1000 },
    ],
  },

  // ───────────────────────── 01 NUMBERS WORLD ─────────────────────────
  {
    id: "numbers", n: 1, title: "The Numbers World", subtitle: "Where the ledgers live", env: "office", music: "office",
    start: [-4, 1], basis: "Gautam's grounding in how businesses keep books: ledgers, vouchers, GST.",
    beats: [
      {
        id: "n-enter", emotion: "happy", gesture: "lookAround", shot: "wide", at: [0, 1], title: true,
        text: "Yeh dekhiye... Numbers World. Ledgers, vouchers, invoices, calculators. Yahan har cheez ka hisaab milta hai.",
        hi: "यह देखिए... नंबर्स वर्ल्ड। लेजर, वाउचर, इनवॉइस, कैलकुलेटर। यहाँ हर चीज़ का हिसाब मिलता है।",
        en: "Welcome to the Numbers World. Ledgers, vouchers, invoices, calculators. Everything here has to add up.",
      },
      {
        id: "n-gst", emotion: "sly", gesture: "point", shot: "right", target: [-3, 1.1, -2],
        text: "Aur yeh GST... naam sunte hi bade bade log chai mangwa lete hain.",
        hi: "और यह जीएसटी... नाम सुनते ही बड़े-बड़े लोग चाय मँगवा लेते हैं।",
        en: "And this is GST... just hearing the name makes grown-ups order tea.",
      },
      {
        id: "n-calc", emotion: "laugh", gesture: "laugh", shot: "mid", sfx: "laugh",
        text: "Mujhe toh lagta hai is calculator ko overtime milna chahiye. Din bhar bechara jodta hi rehta hai.",
        hi: "मुझे तो लगता है इस कैलकुलेटर को ओवरटाइम मिलना चाहिए। दिन भर बेचारा जोड़ता ही रहता है।",
        en: "I think this calculator deserves overtime. The poor thing adds things up all day.",
      },
      {
        id: "n-learn", emotion: "soft", gesture: "idle", shot: "close", tone: "soft",
        text: "Gautam ne yahin se seekha ki business apni books sach mein kaise sambhalta hai. Voucher se ledger tak.",
        hi: "गौतम ने यहीं से सीखा कि बिज़नेस अपनी बुक्स सच में कैसे संभालता है। वाउचर से लेजर तक।",
        en: "This is where Gautam learned how a business really keeps its books, from voucher to ledger.",
      },
      {
        id: "n-loop", emotion: "confused", gesture: "tilt", shot: "eyes", set: ["papersLoop"], sfx: "whoosh",
        text: "Par ek cheez khatak rahi thi. Wahi entries, baar baar, baar baar.",
        hi: "पर एक चीज़ खटक रही थी। वही एंट्रीज़, बार-बार, बार-बार।",
        en: "But something felt off. The same entries, again and again and again.",
      },
    ],
  },

  // ───────────────────────── 02 TURNING POINT ─────────────────────────
  {
    id: "turning", n: 2, title: "The Turning Point", subtitle: "From ledger to code", env: "corridor", music: "corridor",
    start: [0, 3], basis: "The shift from accounting into software: turning daily knowledge into code that removes repeated work.",
    beats: [
      {
        id: "t-q", emotion: "soft", gesture: "think", shot: "left", title: true, tone: "soft", at: [0, 2],
        text: "Phir ek sawaal aaya... jo kaam baar baar repeat hota hai, usse code se kyun na hataya jaye?",
        hi: "फिर एक सवाल आया... जो काम बार-बार रिपीट होता है, उसे कोड से क्यों न हटाया जाए?",
        en: "Then a question came up: if a task repeats again and again, why not remove it with code?",
      },
      { id: "t-walk", emotion: "neutral", gesture: "idle", shot: "follow", at: [0, -4], pause: 2600, sfx: "whoosh", set: ["codeRain"] },
      {
        id: "t-turn", emotion: "proud", gesture: "faceCamera", shot: "mid",
        text: "Yahin se ledger ki kahani, code ki kahani mein badalne lagi.",
        hi: "यहीं से लेजर की कहानी, कोड की कहानी में बदलने लगी।",
        en: "This is where the ledger story started turning into a code story.",
      },
      {
        id: "t-scared", emotion: "nervous", gesture: "tremble", shot: "close",
        text: "Waise ek baat bataun? Yeh corridor mujhe bhi thoda darawna lag raha hai. Chalo, aage chalte hain.",
        hi: "वैसे एक बात बताऊँ? यह कॉरिडोर मुझे भी थोड़ा डरावना लग रहा है। चलो, आगे चलते हैं।",
        en: "Honestly, this corridor scares me a little too. Come on, let's keep going.",
      },
      { id: "t-run", emotion: "happy", gesture: "idle", shot: "follow", at: [0, -12], run: true, pause: 2200, sfx: "whoosh" },
    ],
  },

  // ───────────────────────── 03 DEVELOPER LAB ─────────────────────────
  {
    id: "lab", n: 3, title: "The Developer Lab", subtitle: "What Gautam builds with", env: "lab", music: "lab",
    start: [-3, 1], basis: "Skills in lib/skills.ts: full-stack, mobile, databases, AI and automation, business.",
    beats: [
      {
        id: "l-welcome", emotion: "happy", gesture: "celebrate", shot: "wide", at: [0, 1], title: true, tone: "excited", set: ["skills"], sfx: "power",
        text: "Welcome to the Developer Lab! Full-stack mein React, Next.js, Node, Express... sab yahin hai.",
        hi: "वेलकम टू द डेवलपर लैब! फुल-स्टैक में रिएक्ट, नेक्स्ट जे एस, नोड, एक्सप्रेस... सब यहीं है।",
        en: "Welcome to the Developer Lab! Full-stack here means React, Next.js, Node, Express and more.",
      },
      {
        id: "l-db", emotion: "proud", gesture: "point", shot: "right", target: [3, 1.2, -2],
        text: "Mobile ke liye React Native. Databases mein MongoDB aur Microsoft SQL Server.",
        hi: "मोबाइल के लिए रिएक्ट नेटिव। डेटाबेसेस में मोंगोडीबी और माइक्रोसॉफ़्ट एसक्यूएल सर्वर।",
        en: "React Native for mobile. MongoDB and Microsoft SQL Server for databases.",
      },
      {
        id: "l-ssms", emotion: "confused", gesture: "shrug", shot: "mid",
        text: "Aur SQL Server Management Studio... naam itna lamba hai ki meri battery down ho jaati hai.",
        hi: "और एसक्यूएल सर्वर मैनेजमेंट स्टूडियो... नाम इतना लंबा है कि मेरी बैटरी डाउन हो जाती है।",
        en: "And SQL Server Management Studio... the name is so long my battery drains.",
      },
      {
        id: "l-ai", emotion: "proud", gesture: "lean", shot: "close",
        text: "AI aur automation bhi hai. Accountbiz mein document scan karke voucher pre-fill hota hai, aur bol ke invoice bhi ban jaata hai.",
        hi: "एआई और ऑटोमेशन भी है। अकाउंटबिज़ में डॉक्यूमेंट स्कैन करके वाउचर प्री-फ़िल होता है, और बोलकर इनवॉइस भी बन जाता है।",
        en: "There's AI and automation too. In Accountbiz, scanning a document pre-fills a voucher, and you can speak an invoice.",
      },
      {
        id: "l-click", emotion: "sly", gesture: "point", shot: "mid", hold: true, target: [0, 2, -2],
        text: "Kisi bhi skill par click kijiye, main bata dunga woh kahan kaam aayi. Percentage bar nahi dikhaunga. Jhooth bolna mujhe aata nahi.",
        hi: "किसी भी स्किल पर क्लिक कीजिए, मैं बता दूँगा वह कहाँ काम आई। परसेंटेज बार नहीं दिखाऊँगा। झूठ बोलना मुझे आता नहीं।",
        en: "Click any skill and I'll tell you where it was used. No percentage bars. I don't do lying.",
      },
    ],
  },

  // ───────────────────────── 04 LEGACY SYSTEM MYSTERY ─────────────────────────
  {
    id: "legacy", n: 4, title: "The Legacy System Mystery", subtitle: "Modernizing an old application", env: "legacy", music: "legacy",
    start: [-3, 2], basis: "Resume: modernized a legacy VBScript/MySQL application into a MERN web app; React, MongoDB, SQL Server, integration, database maintenance.",
    beats: [
      { id: "g-dark", emotion: "nervous", gesture: "tremble", shot: "wide", at: [-1, 1], pause: 1800, title: true, sfx: "glitch" },
      {
        id: "g-shh", emotion: "nervous", gesture: "lookAround", shot: "close", tone: "whisper",
        text: "Shhh... yahan dheere chalo. Yeh ek legacy system hai.",
        hi: "श्श्श... यहाँ धीरे चलो। यह एक लेगेसी सिस्टम है।",
        en: "Shhh... walk slowly. This is a legacy system.",
      },
      {
        id: "g-old", emotion: "nervous", gesture: "point", shot: "right", target: [3, 1.2, -2], tone: "soft",
        text: "Ek purani application. VBScript aur MySQL par bani hui. Enterprise CRM aur ERP ke kaam isi se jude the.",
        hi: "एक पुरानी एप्लिकेशन। वीबीस्क्रिप्ट और माईएसक्यूएल पर बनी हुई। एंटरप्राइज़ सीआरएम और ईआरपी के काम इसी से जुड़े थे।",
        en: "An old application built on VBScript and MySQL, tied to enterprise CRM and ERP work.",
      },
      {
        id: "g-scary", emotion: "surprised", gesture: "surprise", shot: "eyes", sfx: "gasp",
        text: "Aur ab sabse darawni baat... ise chhedna hai. Bina kuch toote.",
        hi: "और अब सबसे डरावनी बात... इसे छेड़ना है। बिना कुछ टूटे।",
        en: "And the scariest part: it has to be changed without breaking anything.",
      },
      {
        id: "g-fix", emotion: "proud", gesture: "celebrate", shot: "wide", set: ["legacyFixed"], sfx: "power", tone: "excited",
        text: "Gautam ne is modernization par kaam kiya. Naya web application, MERN technologies ke saath. React components, MongoDB, SQL Server, aur purani business application se integration bhi.",
        hi: "गौतम ने इस मॉडर्नाइज़ेशन पर काम किया। नया वेब एप्लिकेशन, मर्न टेक्नोलॉजीज़ के साथ। रिएक्ट कंपोनेंट्स, मोंगोडीबी, एसक्यूएल सर्वर, और पुरानी बिज़नेस एप्लिकेशन से इंटीग्रेशन भी।",
        en: "Gautam worked on this modernization: a new web app on MERN technologies, with React components, MongoDB, SQL Server and integration with the existing business application.",
      },
      {
        id: "g-db", emotion: "soft", gesture: "idle", shot: "mid", tone: "soft",
        text: "Database maintenance bhi kiya. Kaam boring lagta hai, par database ruk jaye toh poora kaam ruk jaata hai.",
        hi: "डेटाबेस मेंटेनेंस भी किया। काम बोरिंग लगता है, पर डेटाबेस रुक जाए तो पूरा काम रुक जाता है।",
        en: "He handled database maintenance too. It sounds boring, but if the database stops, everything stops.",
      },
      {
        id: "g-secret", emotion: "sly", gesture: "tilt", shot: "close",
        text: "Company ka naam, customer ka data, source code... yeh main nahi bataunga. Confidential hai. Robot hoon, par secret rakhna aata hai.",
        hi: "कंपनी का नाम, कस्टमर का डेटा, सोर्स कोड... यह मैं नहीं बताऊँगा। कॉन्फिडेंशियल है। रोबोट हूँ, पर सीक्रेट रखना आता है।",
        en: "Company name, customer data, source code: I won't share any of it. It's confidential. I'm a robot, but I can keep a secret.",
      },
    ],
  },

  // ───────────────────────── 05 PROJECT UNIVERSE ─────────────────────────
  {
    id: "universe", n: 5, title: "The Project Universe", subtitle: "Five projects, five portals", env: "universe", music: "universe",
    start: [0, 2], basis: "The five projects in lib/projects.ts.",
    beats: [
      {
        id: "u-intro", emotion: "happy", gesture: "celebrate", shot: "wide", title: true, tone: "excited", set: ["portals"], sfx: "sparkle", at: [0, 1],
        text: "Ab chalte hain Project Universe mein! Yahan paanch portals hain, har ek mein ek project.",
        hi: "अब चलते हैं प्रोजेक्ट यूनिवर्स में! यहाँ पाँच पोर्टल्स हैं, हर एक में एक प्रोजेक्ट।",
        en: "Now, the Project Universe! Five portals, one project in each.",
      },
      {
        id: "u-mobile", emotion: "proud", gesture: "point", shot: "left", target: [-3, 1.6, -2],
        text: "React Native mein do apps hain: ek client ke liye, aur ek jo legacy system se jud kar chalti hai.",
        hi: "रिएक्ट नेटिव में दो ऐप्स हैं: एक क्लाइंट के लिए, और एक जो लेगेसी सिस्टम से जुड़कर चलती है।",
        en: "Two React Native apps: one for a client, and one that connects to a legacy system.",
      },
      {
        id: "u-tools", emotion: "happy", gesture: "point", shot: "right", target: [3, 1.6, -2],
        text: "Clip-CSS ek component library hai. Aur Qresume mein resume, cover letter, resignation letter ke templates milte hain.",
        hi: "क्लिप-सीएसएस एक कंपोनेंट लाइब्रेरी है। और क्यूरेज़्यूमे में रिज़्यूमे, कवर लेटर, रेज़िग्नेशन लेटर के टेम्पलेट्स मिलते हैं।",
        en: "Clip-CSS is a component library. Qresume has templates for resumes, cover letters and resignation letters.",
      },
      {
        id: "u-click", emotion: "sly", gesture: "faceCamera", shot: "mid", hold: true,
        text: "Kisi bhi portal par click kijiye. Real links, real case studies. Koi fake button nahi.",
        hi: "किसी भी पोर्टल पर क्लिक कीजिए। रियल लिंक्स, रियल केस स्टडीज़। कोई फ़ेक बटन नहीं।",
        en: "Click any portal. Real links, real case studies. No fake buttons.",
      },
      {
        id: "u-fifth", emotion: "nervous", gesture: "lean", shot: "low", target: [0, 2, -4], tone: "whisper", sfx: "thud",
        text: "Aur woh paanchva portal? Usse dekh kar mere sensors ghabra rahe hain. Ise last ke liye bacha ke rakhte hain.",
        hi: "और वह पाँचवाँ पोर्टल? उसे देखकर मेरे सेंसर्स घबरा रहे हैं। इसे लास्ट के लिए बचा के रखते हैं।",
        en: "And that fifth portal? My sensors are nervous. Let's save it for last.",
      },
    ],
  },

  // ───────────────────────── 06 ACCOUNTBIZ REVEAL ─────────────────────────
  {
    id: "reveal", n: 6, title: "The Accountbiz Reveal", subtitle: "The flagship product", env: "reveal", music: "reveal",
    start: [0, 2], basis: "Accountbiz: owner, product lead and developer. Features are listed in lib/accountbiz.ts with an honest status for each.",
    beats: [
      { id: "r-dark", emotion: "soft", gesture: "idle", shot: "eyes", set: ["dark"], pause: 2200, title: true },
      {
        id: "r-drum", emotion: "nervous", gesture: "lean", shot: "close", tone: "whisper", sfx: "thud",
        text: "Ab... drum roll please.", hi: "अब... ड्रम रोल प्लीज़।", en: "And now... drum roll, please.",
      },
      { id: "r-light", emotion: "surprised", gesture: "surprise", shot: "low", pause: 1500, clear: ["dark"], set: ["reveal"], sfx: "power" },
      {
        id: "r-name", emotion: "proud", gesture: "celebrate", shot: "wide", tone: "excited", set: ["logo"], sfx: "chime",
        text: "Accountbiz!", hi: "अकाउंटबिज़!", en: "Accountbiz!",
      },
      {
        id: "r-what", emotion: "proud", gesture: "point", shot: "mid", target: [0, 2.2, -2],
        text: "Yeh Gautam ka apna product hai. Accounting aur billing software, jise woh khud banate aur chalate hain.",
        hi: "यह गौतम का अपना प्रोडक्ट है। अकाउंटिंग और बिलिंग सॉफ़्टवेयर, जिसे वह खुद बनाते और चलाते हैं।",
        en: "This is Gautam's own product: accounting and billing software he builds and runs himself.",
      },
      {
        id: "r-features", emotion: "happy", gesture: "faceCamera", shot: "right", set: ["features"],
        text: "Voucher entry, ledgers, GST, inventory, reports. Aur sab ek hi voucher engine ke rules se chalta hai.",
        hi: "वाउचर एंट्री, लेजर्स, जीएसटी, इन्वेंटरी, रिपोर्ट्स। और सब एक ही वाउचर इंजन के रूल्स से चलता है।",
        en: "Voucher entry, ledgers, GST, inventory and reports, all driven by one voucher engine.",
      },
      {
        id: "r-honest", emotion: "soft", gesture: "idle", shot: "close", tone: "soft",
        text: "Main features ko teen dabbon mein rakhta hoon: ban chuka, ban raha hai, aur sirf idea. Abhi sirf pehla dabba confirm hua hai.",
        hi: "मैं फ़ीचर्स को तीन डिब्बों में रखता हूँ: बन चुका, बन रहा है, और सिर्फ़ आइडिया। अभी सिर्फ़ पहला डिब्बा कन्फ़र्म हुआ है।",
        en: "I sort features into three boxes: built, in progress, and just an idea. Only the first box is confirmed so far.",
      },
      {
        id: "r-try", emotion: "happy", gesture: "point", shot: "mid", set: ["cta"], hold: true, target: [0, 1.5, -2],
        text: "Live app ka link yahin hai. Khud try kijiye.",
        hi: "लाइव ऐप का लिंक यहीं है। खुद ट्राई कीजिए।",
        en: "The live app link is right here. Try it yourself.",
      },
    ],
  },

  // ───────────────────────── 07 YOUR NEXT CHAPTER ─────────────────────────
  {
    id: "next", n: 7, title: "Your Next Chapter", subtitle: "Let's talk", env: "reveal", music: "finale",
    start: [0, 2], basis: "Contact links in lib/site.ts. Gautam is open to freelance projects.",
    beats: [
      {
        id: "x-end", emotion: "soft", gesture: "idle", shot: "close", title: true, tone: "soft", clear: ["features", "cta", "logo"], set: ["reveal"],
        text: "Toh yeh thi Gautam ki story. Ledger se codebase tak.",
        hi: "तो यह थी गौतम की स्टोरी। लेजर से कोडबेस तक।",
        en: "So that was Gautam's story: from ledger to codebase.",
      },
      {
        id: "x-invite", emotion: "happy", gesture: "faceCamera", shot: "mid", set: ["contact"],
        text: "Agar aapke paas koi system hai jo banana hai, ya purana system jo modern karna hai, toh Gautam se baat kijiye.",
        hi: "अगर आपके पास कोई सिस्टम है जो बनाना है, या पुराना सिस्टम जो मॉडर्न करना है, तो गौतम से बात कीजिए।",
        en: "If you have a system to build, or an old one to modernize, talk to Gautam.",
      },
      {
        id: "x-links", emotion: "proud", gesture: "point", shot: "mid", target: [0, 0.5, 3],
        text: "WhatsApp, LinkedIn, GitHub, Instagram. Sab neeche hai, aur story dekhe bina bhi hamesha wahan rehta hai.",
        hi: "व्हाट्सऐप, लिंक्डइन, गिटहब, इंस्टाग्राम। सब नीचे है, और स्टोरी देखे बिना भी हमेशा वहाँ रहता है।",
        en: "WhatsApp, LinkedIn, GitHub, Instagram: all below, and always available without watching the story.",
      },
      {
        id: "x-credit", emotion: "laugh", gesture: "laugh", shot: "mid", sfx: "laugh",
        text: "Aur haan, mujhe bhi thoda credit dena. Main bhi toh free mein kaam kar raha hoon.",
        hi: "और हाँ, मुझे भी थोड़ा क्रेडिट देना। मैं भी तो फ़्री में काम कर रहा हूँ।",
        en: "And please give me some credit too. I'm working for free here.",
      },
      {
        id: "x-bye", emotion: "happy", gesture: "wave", shot: "wide", set: ["end"], hold: true, tone: "excited",
        text: "Chalo, milte hain. Bye bye!", hi: "चलो, मिलते हैं। बाय बाय!", en: "See you around. Bye bye!",
      },
    ],
  },
];
