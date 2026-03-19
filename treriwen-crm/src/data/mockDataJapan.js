// ═══════════════════════════════════════════════════════════════════════════════
// EUR/JPY
// ═══════════════════════════════════════════════════════════════════════════════

export const eurJpyHistory = [
  { date: '2025-09-01', rate: 158.42 },
  { date: '2025-10-01', rate: 161.87 },
  { date: '2025-11-01', rate: 163.24 },
  { date: '2025-12-01', rate: 159.80 },
  { date: '2026-01-01', rate: 156.34 },
  { date: '2026-02-01', rate: 160.92 },
  { date: '2026-03-01', rate: 162.15 },
  { date: '2026-03-10', rate: 161.40 },
  { date: '2026-03-17', rate: 162.80 },
  { date: '2026-03-18', rate: 163.10 },
];

export const eurJpyAlerts = [
  { id: 1, type: 'above', threshold: 165, label: 'Taux favorable pour virer', active: true,  triggered: false },
  { id: 2, type: 'below', threshold: 155, label: 'Taux défavorable — attendre', active: true,  triggered: false },
  { id: 3, type: 'above', threshold: 160, label: 'Seuil acceptable virement', active: false, triggered: true  },
];

export const transfers = [
  { id: 1, date: '2025-12-10', amountEur: 5000,  rate: 159.80, amountJpy: 799000,  note: 'Travaux maison Kyoto',       method: 'Wise' },
  { id: 2, date: '2026-01-15', amountEur: 8000,  rate: 156.34, amountJpy: 1250720, note: 'Apport acquisition Sapporo', method: 'Virement SWIFT' },
  { id: 3, date: '2026-02-20', amountEur: 3000,  rate: 160.92, amountJpy: 482760,  note: 'Frais gestion Q1',           method: 'Wise' },
  { id: 4, date: '2026-03-05', amountEur: 2500,  rate: 162.15, amountJpy: 405375,  note: 'Taxe foncière Shibuya',      method: 'Wise' },
];

// Impact taux sur revenus locatifs (en €)
export const rentalEurImpact = [
  { month: 'Sep', jpyRevenue: 433000, rate: 158.42, eurRevenue: Math.round(433000/158.42) },
  { month: 'Oct', jpyRevenue: 445000, rate: 161.87, eurRevenue: Math.round(445000/161.87) },
  { month: 'Nov', jpyRevenue: 588000, rate: 163.24, eurRevenue: Math.round(588000/163.24) },
  { month: 'Déc', jpyRevenue: 644000, rate: 159.80, eurRevenue: Math.round(644000/159.80) },
  { month: 'Jan', jpyRevenue: 592000, rate: 156.34, eurRevenue: Math.round(592000/156.34) },
  { month: 'Fév', jpyRevenue: 604000, rate: 160.92, eurRevenue: Math.round(604000/160.92) },
  { month: 'Mar', jpyRevenue: 618000, rate: 163.10, eurRevenue: Math.round(618000/163.10) },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CALENDRIER CULTUREL JAPON
// ═══════════════════════════════════════════════════════════════════════════════

export const japanEvents = [
  // Fêtes nationales 2026
  { id: 1,  date: '2026-01-01', endDate: null,       title: 'お正月 — Oshōgatsu',          type: 'fete',     region: 'National', icon: '🎍', description: 'Nouvel An japonais. Fermeture des banques et administrations du 1 au 3 janvier.', immoImpact: 'Agences fermées 1-7 janvier', priority: 'high' },
  { id: 2,  date: '2026-02-11', endDate: null,       title: 'Kenkoku Kinen-no-Hi',          type: 'fete',     region: 'National', icon: '🇯🇵', description: 'Jour de la fondation nationale.', immoImpact: null, priority: 'low' },
  { id: 3,  date: '2026-03-20', endDate: null,       title: '春分の日 — Vernal Equinox',    type: 'saison',   region: 'National', icon: '🌸', description: 'Équinoxe de printemps. Début de la saison des cerisiers.', immoImpact: null, priority: 'medium' },
  { id: 4,  date: '2026-03-25', endDate: '2026-04-10', title: '桜 — Sakura Tokyo',         type: 'culture',  region: 'Tokyo',    icon: '🌸', description: 'Floraison des cerisiers à Tokyo. Période idéale pour visiter Shinjuku Gyoen et Ueno.', immoImpact: 'Hausse valorisation biens à proximité des parcs', priority: 'medium' },
  { id: 5,  date: '2026-04-01', endDate: '2026-04-10', title: '🏢 Foire immo printemps Tokyo', type: 'immo', region: 'Tokyo',    icon: '🏗️', description: 'Salon de l\'immobilier de printemps — Tokyo Big Sight. Nombreux investisseurs étrangers.', immoImpact: 'Opportunité networking et veille marché', priority: 'high' },
  { id: 6,  date: '2026-04-29', endDate: '2026-05-05', title: '🟢 Golden Week',             type: 'fete',     region: 'National', icon: '🎏', description: 'Semaine de fêtes nationales. Japonais en vacances massifs. Hausse du tourisme intérieur.', immoImpact: 'Banques et agences fermées. Virements impossibles. Airbnb Osaka record.', priority: 'high' },
  { id: 7,  date: '2026-05-15', endDate: '2026-05-17', title: '三社祭 — Sanja Matsuri',     type: 'culture',  region: 'Tokyo',    icon: '⛩️', description: 'L\'un des plus grands matsuri de Tokyo, à Asakusa. 1.5M de visiteurs.', immoImpact: null, priority: 'medium' },
  { id: 8,  date: '2026-06-21', endDate: null,       title: '夏至 — Solstice d\'été',       type: 'saison',   region: 'National', icon: '☀️', description: 'Début de la saison des pluies (tsuyu) dans la plupart des régions.', immoImpact: 'Vérifier étanchéité biens', priority: 'low' },
  { id: 9,  date: '2026-07-24', endDate: '2026-07-25', title: '天神祭 — Tenjin Matsuri',   type: 'culture',  region: 'Osaka',    icon: '🎆', description: 'L\'un des 3 grands matsuri du Japon, à Osaka. Feux d\'artifice sur le fleuve.', immoImpact: null, priority: 'medium' },
  { id: 10, date: '2026-08-13', endDate: '2026-08-16', title: 'お盆 — Obon',               type: 'fete',     region: 'National', icon: '🏮', description: 'Fête des ancêtres. Beaucoup de Japonais rentrent dans leur région natale.', immoImpact: 'Agences fermées, marché immobilier ralenti', priority: 'high' },
  { id: 11, date: '2026-09-01', endDate: null,       title: '防災の日 — Journée catastrophes', type: 'culture', region: 'National', icon: '⚠️', description: 'Journée nationale de prévention des catastrophes. Exercices sismiques.', immoImpact: 'Rappel : vérifier assurance tremblement de terre', priority: 'medium' },
  { id: 12, date: '2026-10-01', endDate: '2026-10-31', title: '紅葉 — Kōyō Kyoto',         type: 'saison',   region: 'Kyoto',    icon: '🍁', description: 'Feuillage automnal à Kyoto. Période la plus touristique après la Golden Week.', immoImpact: 'Taux occupation Airbnb Kyoto au maximum', priority: 'medium' },
  { id: 13, date: '2026-11-03', endDate: null,       title: 'Bunka-no-Hi — Fête de la culture', type: 'fete', region: 'National', icon: '🎨', description: 'Jour de la culture japonaise. Nombreuses expositions et événements.', immoImpact: null, priority: 'low' },
  { id: 14, date: '2026-12-31', endDate: null,       title: '大晦日 — Ōmisoka',            type: 'fete',     region: 'National', icon: '🔔', description: 'Réveillon japonais. 108 coups de cloche dans les temples bouddhistes.', immoImpact: null, priority: 'medium' },
  // Rappels perso
  { id: 15, date: '2026-03-15', endDate: null,       title: '📋 Déclaration revenus fonciers JP', type: 'rappel', region: 'Admin', icon: '📋', description: 'Date limite de déclaration des revenus fonciers japonais pour non-résidents.', immoImpact: 'Préparer documents : loyers perçus, charges, amortissements', priority: 'high' },
  { id: 16, date: '2026-04-30', endDate: null,       title: '💰 Virement prévu Q2',        type: 'rappel',   region: 'Finance', icon: '💸', description: 'Virement programmé pour financer les travaux Kyoto peinture façade.', immoImpact: 'Surveiller taux EUR/JPY — objectif >163', priority: 'high' },
  { id: 17, date: '2026-06-01', endDate: null,       title: '🏠 Renouvellement bail Sapporo', type: 'rappel', region: 'Immo',   icon: '🔑', description: 'Contacter l\'agence pour discuter du renouvellement 2 ans avec les Yamamoto.', immoImpact: 'Potentielle révision loyer +3%', priority: 'high' },
];

// Saisons par région
export const japanSeasons = [
  { region: 'Tokyo',   spring: 'Mars-Mai',  summer: 'Juin-Août', autumn: 'Sept-Nov', winter: 'Déc-Fév', bestVisit: 'Avril (sakura)' },
  { region: 'Kyoto',   spring: 'Mars-Mai',  summer: 'Juin-Août', autumn: 'Oct-Nov',  winter: 'Déc-Fév', bestVisit: 'Avril & Novembre' },
  { region: 'Osaka',   spring: 'Mars-Avr',  summer: 'Juin-Sept', autumn: 'Oct-Nov',  winter: 'Déc-Fév', bestVisit: 'Avril (sakura)' },
  { region: 'Sapporo', spring: 'Avr-Mai',   summer: 'Juin-Août', autumn: 'Sept-Oct', winter: 'Nov-Mar',  bestVisit: 'Février (neige) & Été' },
  { region: 'Fukuoka', spring: 'Mars-Mai',  summer: 'Juin-Sept', autumn: 'Oct-Nov',  winter: 'Déc-Fév', bestVisit: 'Avril & Octobre' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// APPRENTISSAGE JAPONAIS
// ═══════════════════════════════════════════════════════════════════════════════

export const jlptLevels = ['N5', 'N4', 'N3', 'N2', 'N1'];

export const studySessions = [
  { id: 1,  date: '2026-03-18', duration: 45, type: 'kanji',     level: 'N4', score: 82, notes: 'Révisé 20 kanji N4 — encore difficile avec 先 et 生' },
  { id: 2,  date: '2026-03-17', duration: 30, type: 'vocab',     level: 'N4', score: 88, notes: 'Flashcards vocabulaire quotidien' },
  { id: 3,  date: '2026-03-16', duration: 60, type: 'grammaire', level: 'N4', score: 75, notes: '〜てから, 〜ている, 〜てもいい patterns' },
  { id: 4,  date: '2026-03-15', duration: 20, type: 'hiragana',  level: 'N5', score: 98, notes: 'Révision complète hiragana — maîtrisé' },
  { id: 5,  date: '2026-03-13', duration: 45, type: 'vocab',     level: 'N4', score: 79, notes: 'Vocabulaire thème immobilier 不動産' },
  { id: 6,  date: '2026-03-12', duration: 35, type: 'kanji',     level: 'N4', score: 85, notes: '月、日、年、円、円 — thème finance' },
  { id: 7,  date: '2026-03-10', duration: 50, type: 'conversation', level: 'N4', score: 70, notes: 'Tandem avec Kenji — immobilier et locations' },
  { id: 8,  date: '2026-03-08', duration: 30, type: 'grammaire', level: 'N4', score: 80, notes: '〜が・〜は distinction' },
];

export const kanjiList = [
  // N5
  { kanji: '日', reading: 'にち・ひ',  meaning: 'jour, soleil',    level: 'N5', mastered: true  },
  { kanji: '月', reading: 'つき・げつ', meaning: 'mois, lune',     level: 'N5', mastered: true  },
  { kanji: '年', reading: 'とし・ねん', meaning: 'année',          level: 'N5', mastered: true  },
  { kanji: '円', reading: 'えん',       meaning: 'yen, cercle',    level: 'N5', mastered: true  },
  { kanji: '人', reading: 'ひと・じん', meaning: 'personne',       level: 'N5', mastered: true  },
  { kanji: '大', reading: 'おお・だい', meaning: 'grand',          level: 'N5', mastered: true  },
  { kanji: '学', reading: 'まなぶ・がく',meaning: 'étudier',       level: 'N5', mastered: false },
  { kanji: '生', reading: 'いきる・せい',meaning: 'vie, naître',   level: 'N5', mastered: false },
  // N4
  { kanji: '先', reading: 'さき・せん', meaning: 'avant, pointe',  level: 'N4', mastered: false },
  { kanji: '家', reading: 'いえ・か',   meaning: 'maison',         level: 'N4', mastered: true  },
  { kanji: '買', reading: 'かう',       meaning: 'acheter',        level: 'N4', mastered: false },
  { kanji: '売', reading: 'うる',       meaning: 'vendre',         level: 'N4', mastered: false },
  { kanji: '土', reading: 'つち・ど',   meaning: 'terre, sol',     level: 'N4', mastered: true  },
  { kanji: '地', reading: 'ち',         meaning: 'terrain',        level: 'N4', mastered: false },
  { kanji: '建', reading: 'たてる・けん',meaning: 'construire',    level: 'N4', mastered: false },
  { kanji: '物', reading: 'もの・ぶつ', meaning: 'objet, chose',   level: 'N4', mastered: true  },
];

export const vocabulary = [
  // Immobilier
  { id: 1,  japanese: '不動産',     reading: 'ふどうさん',   french: 'Immobilier',         category: 'immobilier', level: 'N4', mastered: true  },
  { id: 2,  japanese: '家賃',       reading: 'やちん',       french: 'Loyer',              category: 'immobilier', level: 'N4', mastered: true  },
  { id: 3,  japanese: '契約',       reading: 'けいやく',     french: 'Contrat',            category: 'immobilier', level: 'N4', mastered: true  },
  { id: 4,  japanese: '敷金',       reading: 'しきんもん',   french: 'Caution (dépôt)',    category: 'immobilier', level: 'N3', mastered: false },
  { id: 5,  japanese: '礼金',       reading: 'れいきん',     french: 'Key money',          category: 'immobilier', level: 'N3', mastered: false },
  { id: 6,  japanese: '管理費',     reading: 'かんりひ',     french: 'Frais de gestion',   category: 'immobilier', level: 'N3', mastered: false },
  { id: 7,  japanese: '修繕',       reading: 'しゅうぜん',   french: 'Réparation/travaux', category: 'immobilier', level: 'N3', mastered: false },
  // Finance
  { id: 8,  japanese: '銀行',       reading: 'ぎんこう',     french: 'Banque',             category: 'finance',    level: 'N5', mastered: true  },
  { id: 9,  japanese: '振込',       reading: 'ふりこみ',     french: 'Virement bancaire',  category: 'finance',    level: 'N4', mastered: true  },
  { id: 10, japanese: '為替',       reading: 'かわせ',       french: 'Taux de change',     category: 'finance',    level: 'N3', mastered: false },
  { id: 11, japanese: '税金',       reading: 'ぜいきん',     french: 'Impôts/taxes',       category: 'finance',    level: 'N4', mastered: false },
  // Quotidien
  { id: 12, japanese: 'よろしくお願いします', reading: 'よろしくおねがいします', french: 'Enchanté / S\'il vous plaît', category: 'politesse', level: 'N5', mastered: true },
  { id: 13, japanese: 'ありがとうございます', reading: 'ありがとうございます', french: 'Merci beaucoup', category: 'politesse', level: 'N5', mastered: true },
  { id: 14, japanese: '申し訳ありません', reading: 'もうしわけありません', french: 'Je suis désolé (formel)', category: 'politesse', level: 'N4', mastered: false },
  { id: 15, japanese: 'どこですか',  reading: 'どこですか',   french: 'Où est-ce ?',        category: 'conversation', level: 'N5', mastered: true  },
];

export const grammarPoints = [
  { id: 1, pattern: '〜てから',    meaning: 'Après avoir fait ~',         example: '仕事をしてから、食べます',  level: 'N4', mastered: true  },
  { id: 2, pattern: '〜ている',    meaning: 'Être en train de / état',    example: '日本語を勉強しています',    level: 'N5', mastered: true  },
  { id: 3, pattern: '〜てもいい',  meaning: 'Il est permis de ~',         example: 'ここに入ってもいいですか',   level: 'N4', mastered: true  },
  { id: 4, pattern: '〜てはいけない', meaning: 'Il est interdit de ~',   example: 'ここに入ってはいけない',     level: 'N4', mastered: false },
  { id: 5, pattern: '〜ようにする', meaning: 'Faire en sorte de ~',       example: '毎日運動するようにしている', level: 'N3', mastered: false },
  { id: 6, pattern: '〜ために',    meaning: 'Pour (but)',                 example: '日本語のために勉強する',     level: 'N4', mastered: false },
  { id: 7, pattern: '〜という',    meaning: 'Ce qu\'on appelle ~',        example: '東京という都市',             level: 'N3', mastered: false },
  { id: 8, pattern: 'AよりBのほうが', meaning: 'B est plus ~ que A',    example: '電車より車のほうが便利だ',   level: 'N5', mastered: true  },
];

export const jlptProgress = {
  N5: { total: 100, mastered: 98,  kanjis: 80,   kanjiMastered: 80,  status: 'done'       },
  N4: { total: 300, mastered: 180, kanjis: 166,  kanjiMastered: 94,  status: 'in_progress'},
  N3: { total: 650, mastered: 45,  kanjis: 367,  kanjiMastered: 12,  status: 'started'    },
  N2: { total: 1500,mastered: 0,   kanjis: 1110, kanjiMastered: 0,   status: 'not_started'},
  N1: { total: 2000,mastered: 0,   kanjis: 2000, kanjiMastered: 0,   status: 'not_started'},
};

export const hiragana = [
  { char: 'あ', romaji: 'a' },  { char: 'い', romaji: 'i' },  { char: 'う', romaji: 'u' },
  { char: 'え', romaji: 'e' },  { char: 'お', romaji: 'o' },  { char: 'か', romaji: 'ka' },
  { char: 'き', romaji: 'ki' }, { char: 'く', romaji: 'ku' }, { char: 'け', romaji: 'ke' },
  { char: 'こ', romaji: 'ko' }, { char: 'さ', romaji: 'sa' }, { char: 'し', romaji: 'shi'},
  { char: 'す', romaji: 'su' }, { char: 'せ', romaji: 'se' }, { char: 'そ', romaji: 'so' },
  { char: 'た', romaji: 'ta' }, { char: 'ち', romaji: 'chi'}, { char: 'つ', romaji: 'tsu'},
  { char: 'て', romaji: 'te' }, { char: 'と', romaji: 'to' }, { char: 'な', romaji: 'na' },
  { char: 'に', romaji: 'ni' }, { char: 'ぬ', romaji: 'nu' }, { char: 'ね', romaji: 'ne' },
  { char: 'の', romaji: 'no' }, { char: 'は', romaji: 'ha' }, { char: 'ひ', romaji: 'hi' },
  { char: 'ふ', romaji: 'fu' }, { char: 'へ', romaji: 'he' }, { char: 'ほ', romaji: 'ho' },
  { char: 'ま', romaji: 'ma' }, { char: 'み', romaji: 'mi' }, { char: 'む', romaji: 'mu' },
  { char: 'め', romaji: 'me' }, { char: 'も', romaji: 'mo' }, { char: 'や', romaji: 'ya' },
  { char: 'ゆ', romaji: 'yu' }, { char: 'よ', romaji: 'yo' }, { char: 'ら', romaji: 'ra' },
  { char: 'り', romaji: 'ri' }, { char: 'る', romaji: 'ru' }, { char: 'れ', romaji: 're' },
  { char: 'ろ', romaji: 'ro' }, { char: 'わ', romaji: 'wa' }, { char: 'を', romaji: 'wo' },
  { char: 'ん', romaji: 'n'  },
];

// ─── KATAKANA ─────────────────────────────────────────────────────────────────
export const katakana = [
  { char: 'ア', romaji: 'a'  }, { char: 'イ', romaji: 'i'  }, { char: 'ウ', romaji: 'u'  },
  { char: 'エ', romaji: 'e'  }, { char: 'オ', romaji: 'o'  }, { char: 'カ', romaji: 'ka' },
  { char: 'キ', romaji: 'ki' }, { char: 'ク', romaji: 'ku' }, { char: 'ケ', romaji: 'ke' },
  { char: 'コ', romaji: 'ko' }, { char: 'サ', romaji: 'sa' }, { char: 'シ', romaji: 'shi'},
  { char: 'ス', romaji: 'su' }, { char: 'セ', romaji: 'se' }, { char: 'ソ', romaji: 'so' },
  { char: 'タ', romaji: 'ta' }, { char: 'チ', romaji: 'chi'}, { char: 'ツ', romaji: 'tsu'},
  { char: 'テ', romaji: 'te' }, { char: 'ト', romaji: 'to' }, { char: 'ナ', romaji: 'na' },
  { char: 'ニ', romaji: 'ni' }, { char: 'ヌ', romaji: 'nu' }, { char: 'ネ', romaji: 'ne' },
  { char: 'ノ', romaji: 'no' }, { char: 'ハ', romaji: 'ha' }, { char: 'ヒ', romaji: 'hi' },
  { char: 'フ', romaji: 'fu' }, { char: 'ヘ', romaji: 'he' }, { char: 'ホ', romaji: 'ho' },
  { char: 'マ', romaji: 'ma' }, { char: 'ミ', romaji: 'mi' }, { char: 'ム', romaji: 'mu' },
  { char: 'メ', romaji: 'me' }, { char: 'モ', romaji: 'mo' }, { char: 'ヤ', romaji: 'ya' },
  { char: 'ユ', romaji: 'yu' }, { char: 'ヨ', romaji: 'yo' }, { char: 'ラ', romaji: 'ra' },
  { char: 'リ', romaji: 'ri' }, { char: 'ル', romaji: 'ru' }, { char: 'レ', romaji: 're' },
  { char: 'ロ', romaji: 'ro' }, { char: 'ワ', romaji: 'wa' }, { char: 'ヲ', romaji: 'wo' },
  { char: 'ン', romaji: 'n'  },
  // Mots katakana courants
  { char: 'コーヒー', romaji: 'kōhī',    meaning: 'café'          },
  { char: 'テレビ',   romaji: 'terebi',  meaning: 'télévision'    },
  { char: 'カメラ',   romaji: 'kamera',  meaning: 'appareil photo' },
  { char: 'パソコン', romaji: 'pasokon', meaning: 'ordinateur'    },
  { char: 'スマホ',   romaji: 'sumaho',  meaning: 'smartphone'    },
  { char: 'アパート', romaji: 'apāto',   meaning: 'appartement'   },
  { char: 'マンション',romaji: 'manshon',meaning: 'immeuble résidentiel' },
  { char: 'フランス', romaji: 'Furansu', meaning: 'France'        },
];

// ─── KANJI SUPPLÉMENTAIRES ────────────────────────────────────────────────────
export const kanjiExtra = [
  // N5 supplémentaires
  { kanji: '山', reading: 'やま・さん',  meaning: 'montagne',       level: 'N5', mastered: true  },
  { kanji: '川', reading: 'かわ・せん',  meaning: 'rivière',        level: 'N5', mastered: true  },
  { kanji: '火', reading: 'ひ・か',      meaning: 'feu',            level: 'N5', mastered: true  },
  { kanji: '水', reading: 'みず・すい',  meaning: 'eau',            level: 'N5', mastered: true  },
  { kanji: '木', reading: 'き・もく',    meaning: 'arbre, bois',    level: 'N5', mastered: false },
  { kanji: '金', reading: 'かね・きん',  meaning: 'argent, or',     level: 'N5', mastered: false },
  { kanji: '土', reading: 'つち・ど',    meaning: 'terre, sol',     level: 'N5', mastered: true  },
  { kanji: '天', reading: 'てん',        meaning: 'ciel, paradis',  level: 'N5', mastered: false },
  { kanji: '気', reading: 'き・け',      meaning: 'énergie, esprit',level: 'N5', mastered: false },
  { kanji: '白', reading: 'しろ・はく',  meaning: 'blanc',          level: 'N5', mastered: true  },
  { kanji: '黒', reading: 'くろ・こく',  meaning: 'noir',           level: 'N5', mastered: false },
  { kanji: '赤', reading: 'あか・せき',  meaning: 'rouge',          level: 'N5', mastered: false },
  { kanji: '青', reading: 'あお・せい',  meaning: 'bleu, vert',     level: 'N5', mastered: true  },
  { kanji: '犬', reading: 'いぬ',        meaning: 'chien',          level: 'N5', mastered: true  },
  { kanji: '猫', reading: 'ねこ',        meaning: 'chat',           level: 'N5', mastered: true  },
  { kanji: '食', reading: 'たべる・しょく', meaning: 'manger, nourriture', level: 'N5', mastered: false },
  { kanji: '飲', reading: 'のむ・いん',  meaning: 'boire',          level: 'N5', mastered: false },
  { kanji: '見', reading: 'みる・けん',  meaning: 'voir, regarder', level: 'N5', mastered: false },
  { kanji: '聞', reading: 'きく・ぶん',  meaning: 'entendre, écouter', level: 'N5', mastered: false },
  { kanji: '話', reading: 'はなす・わ',  meaning: 'parler, histoire', level: 'N5', mastered: false },
  // N4 supplémentaires
  { kanji: '会', reading: 'あう・かい',  meaning: 'rencontrer',     level: 'N4', mastered: false },
  { kanji: '社', reading: 'やしろ・しゃ', meaning: 'société, entreprise', level: 'N4', mastered: false },
  { kanji: '電', reading: 'でん',        meaning: 'électricité',    level: 'N4', mastered: false },
  { kanji: '車', reading: 'くるま・しゃ', meaning: 'voiture',       level: 'N4', mastered: true  },
  { kanji: '駅', reading: 'えき',        meaning: 'gare',           level: 'N4', mastered: true  },
  { kanji: '道', reading: 'みち・どう',  meaning: 'route, chemin',  level: 'N4', mastered: false },
  { kanji: '場', reading: 'ば・じょう',  meaning: 'endroit, lieu',  level: 'N4', mastered: false },
  { kanji: '町', reading: 'まち・ちょう', meaning: 'ville, quartier',level: 'N4', mastered: false },
  { kanji: '市', reading: 'いち・し',    meaning: 'marché, ville',  level: 'N4', mastered: false },
  { kanji: '区', reading: 'く',          meaning: 'arrondissement', level: 'N4', mastered: true  },
  { kanji: '番', reading: 'ばん',        meaning: 'numéro, tour',   level: 'N4', mastered: false },
  { kanji: '号', reading: 'ごう',        meaning: 'numéro, signal', level: 'N4', mastered: false },
  { kanji: '時', reading: 'とき・じ',    meaning: 'heure, moment',  level: 'N4', mastered: true  },
  { kanji: '分', reading: 'ふん・ぶん',  meaning: 'minute, comprendre', level: 'N4', mastered: true },
  { kanji: '半', reading: 'はん',        meaning: 'demi',           level: 'N4', mastered: true  },
  // N3
  { kanji: '観', reading: 'かんさつ・かん', meaning: 'observer, voir', level: 'N3', mastered: false },
  { kanji: '光', reading: 'ひかり・こう', meaning: 'lumière',        level: 'N3', mastered: false },
  { kanji: '旅', reading: 'たび・りょ',  meaning: 'voyage',         level: 'N3', mastered: false },
  { kanji: '館', reading: 'かん',        meaning: 'bâtiment, salle',level: 'N3', mastered: false },
  { kanji: '温', reading: 'あたたかい・おん', meaning: 'chaud, tiède', level: 'N3', mastered: false },
  { kanji: '泉', reading: 'いずみ・せん', meaning: 'source, fontaine', level: 'N3', mastered: false },
  { kanji: '神', reading: 'かみ・しん',  meaning: 'dieu, divinité', level: 'N3', mastered: false },
  { kanji: '社', reading: 'やしろ・しゃ', meaning: 'sanctuaire',     level: 'N3', mastered: false },
];

// ─── VOCABULAIRE SUPPLÉMENTAIRE ───────────────────────────────────────────────
export const vocabularyExtra = [
  // Voyages & Transports
  { id: 16, japanese: '新幹線',     reading: 'しんかんせん',  french: 'Shinkansen (TGV)',    category: 'transport',  level: 'N4', mastered: false },
  { id: 17, japanese: '乗り換え',   reading: 'のりかえ',      french: 'Correspondance',      category: 'transport',  level: 'N4', mastered: false },
  { id: 18, japanese: '切符',       reading: 'きっぷ',        french: 'Billet',              category: 'transport',  level: 'N5', mastered: true  },
  { id: 19, japanese: '空港',       reading: 'くうこう',      french: 'Aéroport',            category: 'transport',  level: 'N4', mastered: true  },
  { id: 20, japanese: '出口',       reading: 'でぐち',        french: 'Sortie',              category: 'transport',  level: 'N5', mastered: true  },
  { id: 21, japanese: '入口',       reading: 'いりぐち',      french: 'Entrée',              category: 'transport',  level: 'N5', mastered: true  },
  // Nourriture
  { id: 22, japanese: 'ラーメン',   reading: 'らーめん',      french: 'Ramen',               category: 'nourriture', level: 'N5', mastered: true  },
  { id: 23, japanese: '寿司',       reading: 'すし',          french: 'Sushi',               category: 'nourriture', level: 'N5', mastered: true  },
  { id: 24, japanese: '定食',       reading: 'ていしょく',    french: 'Menu du jour',        category: 'nourriture', level: 'N4', mastered: false },
  { id: 25, japanese: 'お土産',     reading: 'おみやげ',      french: 'Souvenir / cadeau',   category: 'nourriture', level: 'N4', mastered: false },
  { id: 26, japanese: '居酒屋',     reading: 'いざかや',      french: 'Bar japonais',        category: 'nourriture', level: 'N4', mastered: true  },
  // Quotidien
  { id: 27, japanese: '病院',       reading: 'びょういん',    french: 'Hôpital',             category: 'quotidien',  level: 'N5', mastered: false },
  { id: 28, japanese: '薬局',       reading: 'やっきょく',    french: 'Pharmacie',           category: 'quotidien',  level: 'N4', mastered: false },
  { id: 29, japanese: 'コンビニ',   reading: 'こんびに',      french: 'Supérette (convenience store)', category: 'quotidien', level: 'N5', mastered: true },
  { id: 30, japanese: '郵便局',     reading: 'ゆうびんきょく', french: 'Bureau de poste',    category: 'quotidien',  level: 'N4', mastered: false },
  { id: 31, japanese: '警察',       reading: 'けいさつ',      french: 'Police',              category: 'quotidien',  level: 'N4', mastered: false },
  // Immobilier supplémentaire
  { id: 32, japanese: '間取り',     reading: 'まどり',        french: 'Plan (layout)',       category: 'immobilier', level: 'N3', mastered: false },
  { id: 33, japanese: '築年数',     reading: 'ちくねんすう',  french: 'Année de construction', category: 'immobilier', level: 'N2', mastered: false },
  { id: 34, japanese: '物件',       reading: 'ぶっけん',      french: 'Bien immobilier',     category: 'immobilier', level: 'N3', mastered: false },
  { id: 35, japanese: '内覧',       reading: 'ないらん',      french: 'Visite du bien',      category: 'immobilier', level: 'N3', mastered: false },
  { id: 36, japanese: '登記',       reading: 'とうき',        french: 'Enregistrement cadastral', category: 'immobilier', level: 'N2', mastered: false },
  // Culture / Vie japonaise
  { id: 37, japanese: 'お疲れ様',   reading: 'おつかれさま',  french: 'Merci de ton travail',category: 'culture',    level: 'N4', mastered: true  },
  { id: 38, japanese: 'いただきます', reading: 'いただきます', french: 'Bon appétit (avant repas)', category: 'culture', level: 'N5', mastered: true },
  { id: 39, japanese: 'ごちそうさま', reading: 'ごちそうさま', french: 'C\'était délicieux',  category: 'culture',    level: 'N5', mastered: true  },
  { id: 40, japanese: 'お邪魔します', reading: 'おじゃまします', french: 'Désolé de déranger (en entrant)', category: 'culture', level: 'N4', mastered: false },
  // Finance supplémentaire
  { id: 41, japanese: '確定申告',   reading: 'かくていしんこく', french: 'Déclaration fiscale', category: 'finance',   level: 'N2', mastered: false },
  { id: 42, japanese: '源泉徴収',   reading: 'げんせんちょうしゅう', french: 'Retenue à la source', category: 'finance', level: 'N2', mastered: false },
  { id: 43, japanese: '口座',       reading: 'こうざ',        french: 'Compte bancaire',     category: 'finance',    level: 'N4', mastered: true  },
  { id: 44, japanese: '残高',       reading: 'ざんだか',      french: 'Solde bancaire',      category: 'finance',    level: 'N3', mastered: false },
  { id: 45, japanese: '手数料',     reading: 'てすうりょう',  french: 'Frais / commission',  category: 'finance',    level: 'N3', mastered: false },
];

// ─── GRAMMAIRE SUPPLÉMENTAIRE ─────────────────────────────────────────────────
export const grammarExtra = [
  { id: 9,  pattern: '〜たことがある', meaning: 'Avoir déjà fait ~',         example: '日本に行ったことがある',      level: 'N4', mastered: false },
  { id: 10, pattern: '〜なければならない', meaning: 'Devoir faire ~ (obligation)', example: '勉強しなければならない', level: 'N4', mastered: false },
  { id: 11, pattern: '〜てみる',      meaning: 'Essayer de faire ~',         example: '寿司を食べてみよう',          level: 'N4', mastered: true  },
  { id: 12, pattern: '〜ながら',      meaning: 'Tout en faisant ~ (simultané)', example: '音楽を聞きながら勉強する', level: 'N4', mastered: false },
  { id: 13, pattern: '〜そうだ',      meaning: 'On dirait que ~ / Il paraît', example: '雨が降りそうだ',             level: 'N3', mastered: false },
  { id: 14, pattern: '〜らしい',      meaning: 'Il semble que ~ (ouï-dire)', example: 'あの家は高いらしい',          level: 'N3', mastered: false },
  { id: 15, pattern: '〜ばかりだ',    meaning: 'Ne faire que ~ / Toujours',  example: '物価が上がるばかりだ',        level: 'N3', mastered: false },
  { id: 16, pattern: '〜に対して',    meaning: 'Envers ~ / Par rapport à ~', example: '投資に対して興味がある',      level: 'N3', mastered: false },
  { id: 17, pattern: '〜によって',    meaning: 'Selon ~ / Grâce à ~',       example: '為替によって利益が変わる',     level: 'N3', mastered: false },
  { id: 18, pattern: '〜わけだ',      meaning: 'C\'est la raison pour laquelle ~', example: 'だから失敗したわけだ', level: 'N3', mastered: false },
  { id: 19, pattern: 'もし〜なら',    meaning: 'Si ~ (hypothèse)',          example: 'もし雨なら、家にいる',         level: 'N4', mastered: true  },
  { id: 20, pattern: '〜はずだ',      meaning: 'Cela devrait être ~',       example: '電車は8時に来るはずだ',        level: 'N3', mastered: false },
];