// ═══════════════════════════════════════════════════════════════════════════════
// PATRIMOINE & INVESTISSEMENTS
// ═══════════════════════════════════════════════════════════════════════════════

export const portfolioAccounts = [
  { id: 1, name: 'PEA Boursorama',      type: 'pea',       broker: 'Boursorama',    color: '#3d7fff', currency: 'EUR' },
  { id: 2, name: 'CTO Degiro',          type: 'cto',       broker: 'Degiro',         color: '#a78bfa', currency: 'EUR' },
  { id: 3, name: 'Assurance-vie Linxea',type: 'av',        broker: 'Linxea',         color: '#2dd4a0', currency: 'EUR' },
  { id: 4, name: 'Crypto Ledger',       type: 'crypto',    broker: 'Self-custody',   color: '#f5c842', currency: 'EUR' },
  { id: 5, name: 'Livret A + LDDS',     type: 'livret',    broker: 'Banque postale', color: '#fb923c', currency: 'EUR' },
];

export const holdings = [
  // PEA
  { id: 1, accountId: 1, ticker: 'LVMH', name: 'LVMH Moët Hennessy', type: 'action', category: 'CAC40', shares: 4, avgPrice: 680, currentPrice: 742, currency: 'EUR', country: 'FR' },
  { id: 2, accountId: 1, ticker: 'AIR',  name: 'Airbus SE',           type: 'action', category: 'CAC40', shares: 8, avgPrice: 128, currentPrice: 158, currency: 'EUR', country: 'FR' },
  { id: 3, accountId: 1, ticker: 'TTE',  name: 'TotalEnergies',        type: 'action', category: 'CAC40', shares: 20, avgPrice: 58, currentPrice: 62, currency: 'EUR', country: 'FR' },
  { id: 4, accountId: 1, ticker: 'EWLD', name: 'iShares MSCI World ETF', type: 'etf', category: 'ETF Monde', shares: 25, avgPrice: 76, currentPrice: 91.4, currency: 'EUR', country: 'IE' },
  // CTO
  { id: 5, accountId: 2, ticker: 'AAPL', name: 'Apple Inc.',            type: 'action', category: 'S&P500', shares: 12, avgPrice: 168, currentPrice: 189, currency: 'EUR', country: 'US' },
  { id: 6, accountId: 2, ticker: 'NVDA', name: 'Nvidia Corp.',          type: 'action', category: 'S&P500', shares: 5,  avgPrice: 480, currentPrice: 875, currency: 'EUR', country: 'US' },
  { id: 7, accountId: 2, ticker: 'VWCE', name: 'Vanguard FTSE All-World', type: 'etf', category: 'ETF Monde', shares: 30, avgPrice: 98, currentPrice: 118, currency: 'EUR', country: 'IE' },
  { id: 8, accountId: 2, ticker: 'BRK',  name: 'Berkshire Hathaway B', type: 'action', category: 'S&P500', shares: 3, avgPrice: 340, currentPrice: 418, currency: 'EUR', country: 'US' },
  // AV
  { id: 9, accountId: 3, ticker: 'FONDS-EURO', name: 'Fonds Euro Sécurité', type: 'fonds', category: 'Fonds euro', shares: 1, avgPrice: 18000, currentPrice: 18720, currency: 'EUR', country: 'FR' },
  { id: 10, accountId: 3, ticker: 'UC-WORLD', name: 'UC MSCI World',    type: 'etf',   category: 'ETF Monde', shares: 50, avgPrice: 104, currentPrice: 124, currency: 'EUR', country: 'IE' },
  // Crypto
  { id: 11, accountId: 4, ticker: 'BTC',  name: 'Bitcoin',              type: 'crypto', category: 'Crypto L1', shares: 0.42, avgPrice: 28000, currentPrice: 68200, currency: 'EUR', country: '-' },
  { id: 12, accountId: 4, ticker: 'ETH',  name: 'Ethereum',             type: 'crypto', category: 'Crypto L1', shares: 3.8,  avgPrice: 1600, currentPrice: 3580, currency: 'EUR', country: '-' },
  { id: 13, accountId: 4, ticker: 'SOL',  name: 'Solana',               type: 'crypto', category: 'Crypto L1', shares: 18,   avgPrice: 42, currentPrice: 168, currency: 'EUR', country: '-' },
  // Livrets
  { id: 14, accountId: 5, ticker: 'LIVRET-A', name: 'Livret A',         type: 'livret', category: 'Épargne réglementée', shares: 1, avgPrice: 18000, currentPrice: 18540, currency: 'EUR', country: 'FR' },
  { id: 15, accountId: 5, ticker: 'LDDS',     name: 'LDDS',             type: 'livret', category: 'Épargne réglementée', shares: 1, avgPrice: 12000, currentPrice: 12360, currency: 'EUR', country: 'FR' },
];

export const portfolioHistory = [
  { month: 'Sep', value: 118400 },
  { month: 'Oct', value: 122800 },
  { month: 'Nov', value: 127600 },
  { month: 'Déc', value: 134200 },
  { month: 'Jan', value: 129800 },
  { month: 'Fév', value: 138400 },
  { month: 'Mar', value: 146200 },
];

export const transactions = [
  { id: 1, date: '2024-03-10', type: 'buy',      ticker: 'NVDA', shares: 2,    price: 820, fees: 2.50, accountId: 2 },
  { id: 2, date: '2024-03-05', type: 'buy',      ticker: 'EWLD', shares: 5,    price: 90.2, fees: 0,    accountId: 1 },
  { id: 3, date: '2024-02-28', type: 'buy',      ticker: 'BTC',  shares: 0.05, price: 62000, fees: 12, accountId: 4 },
  { id: 4, date: '2024-02-15', type: 'dividend', ticker: 'TTE',  shares: 0,    price: 0,    fees: 0,    accountId: 1, amount: 48 },
  { id: 5, date: '2024-01-20', type: 'buy',      ticker: 'VWCE', shares: 10,   price: 114,  fees: 0.50, accountId: 2 },
  { id: 6, date: '2024-01-08', type: 'sell',     ticker: 'SOL',  shares: 5,    price: 98,   fees: 3,    accountId: 4 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SANTÉ & SPORT
// ═══════════════════════════════════════════════════════════════════════════════

export const workoutSessions = [
  { id: 1, date: '2026-03-17', type: 'muscu',   name: 'Push Day',      duration: 65,  calories: 380, feeling: 4, location: 'Salle', notes: 'Bon séance, PR sur développé couché' },
  { id: 2, date: '2026-03-15', type: 'cardio',  name: 'Run 10km',      duration: 52,  calories: 580, feeling: 5, location: 'Extérieur', notes: 'Meilleur temps de la saison' },
  { id: 3, date: '2026-03-13', type: 'muscu',   name: 'Pull Day',      duration: 70,  calories: 400, feeling: 3, location: 'Salle', notes: '' },
  { id: 4, date: '2026-03-11', type: 'muscu',   name: 'Leg Day',       duration: 75,  calories: 450, feeling: 4, location: 'Salle', notes: 'Squat lourd' },
  { id: 5, date: '2026-03-09', type: 'yoga',    name: 'Yoga Flow',     duration: 45,  calories: 150, feeling: 5, location: 'Maison', notes: '' },
  { id: 6, date: '2026-03-07', type: 'cardio',  name: 'Vélo 35km',     duration: 80,  calories: 720, feeling: 4, location: 'Extérieur', notes: '' },
  { id: 7, date: '2026-03-05', type: 'muscu',   name: 'Push Day',      duration: 60,  calories: 360, feeling: 3, location: 'Salle', notes: '' },
  { id: 8, date: '2026-03-03', type: 'cardio',  name: 'Run 7km',       duration: 38,  calories: 410, feeling: 4, location: 'Extérieur', notes: '' },
  { id: 9, date: '2026-03-01', type: 'muscu',   name: 'Pull Day',      duration: 68,  calories: 390, feeling: 5, location: 'Salle', notes: 'PR sur traction lestée' },
  { id: 10, date: '2026-02-27', type: 'muscu',  name: 'Leg Day',       duration: 72,  calories: 440, feeling: 4, location: 'Salle', notes: '' },
];

export const bodyMetrics = [
  { date: '2025-09-01', weight: 82.4, bodyFat: 18.2, muscleMass: 62.1, bmi: 24.8 },
  { date: '2025-10-01', weight: 81.8, bodyFat: 17.8, muscleMass: 62.4, bmi: 24.6 },
  { date: '2025-11-01', weight: 81.2, bodyFat: 17.2, muscleMass: 62.8, bmi: 24.4 },
  { date: '2025-12-01', weight: 80.9, bodyFat: 16.9, muscleMass: 63.0, bmi: 24.3 },
  { date: '2026-01-01', weight: 80.2, bodyFat: 16.4, muscleMass: 63.3, bmi: 24.1 },
  { date: '2026-02-01', weight: 79.6, bodyFat: 15.8, muscleMass: 63.7, bmi: 23.9 },
  { date: '2026-03-01', weight: 79.1, bodyFat: 15.2, muscleMass: 64.1, bmi: 23.7 },
];

export const personalRecords = [
  { id: 1, exercise: 'Développé couché',  category: 'muscu',  value: 102.5, unit: 'kg', date: '2026-03-17', previous: 100 },
  { id: 2, exercise: 'Squat barre',       category: 'muscu',  value: 140,   unit: 'kg', date: '2026-03-11', previous: 135 },
  { id: 3, exercise: 'Soulevé de terre',  category: 'muscu',  value: 180,   unit: 'kg', date: '2026-02-20', previous: 175 },
  { id: 4, exercise: 'Traction lestée',   category: 'muscu',  value: 25,    unit: 'kg ajoutés', date: '2026-03-01', previous: 22.5 },
  { id: 5, exercise: 'Run 10km',          category: 'cardio', value: 52,    unit: 'min', date: '2026-03-15', previous: 54 },
  { id: 6, exercise: 'Run 5km',           category: 'cardio', value: 24.5,  unit: 'min', date: '2026-02-10', previous: 25.2 },
  { id: 7, exercise: 'Vélo 100km',        category: 'cardio', value: 3.8,   unit: 'h',  date: '2026-01-28', previous: 4.1 },
];

export const weeklyPlan = [
  { day: 'Lundi',    type: 'muscu',  name: 'Push Day',  planned: true, done: true  },
  { day: 'Mardi',    type: 'cardio', name: 'Run 8km',   planned: true, done: true  },
  { day: 'Mercredi', type: 'muscu',  name: 'Pull Day',  planned: true, done: false },
  { day: 'Jeudi',    type: 'repos',  name: 'Repos actif', planned: true, done: false },
  { day: 'Vendredi', type: 'muscu',  name: 'Leg Day',   planned: true, done: false },
  { day: 'Samedi',   type: 'cardio', name: 'Vélo / Natation', planned: true, done: false },
  { day: 'Dimanche', type: 'yoga',   name: 'Yoga / Récup', planned: true, done: false },
];

export const nutritionLog = [
  { date: '2026-03-17', calories: 2480, protein: 182, carbs: 248, fat: 72, water: 2.8 },
  { date: '2026-03-16', calories: 2210, protein: 168, carbs: 220, fat: 68, water: 3.0 },
  { date: '2026-03-15', calories: 2820, protein: 175, carbs: 312, fat: 78, water: 3.2 },
  { date: '2026-03-14', calories: 2150, protein: 165, carbs: 205, fat: 65, water: 2.5 },
  { date: '2026-03-13', calories: 2540, protein: 188, carbs: 260, fat: 74, water: 2.9 },
  { date: '2026-03-12', calories: 2380, protein: 172, carbs: 240, fat: 70, water: 2.7 },
  { date: '2026-03-11', calories: 2690, protein: 185, carbs: 278, fat: 76, water: 3.1 },
];

export const nutritionGoals = { calories: 2500, protein: 180, carbs: 250, fat: 75, water: 3.0 };

// ═══════════════════════════════════════════════════════════════════════════════
// BUDGET & DÉPENSES
// ═══════════════════════════════════════════════════════════════════════════════

export const budgetCategories = [
  { id: 1,  name: 'Logement',          icon: '🏠', color: '#3d7fff',  planned: 1200,  type: 'expense' },
  { id: 2,  name: 'Alimentation',      icon: '🛒', color: '#2dd4a0',  planned: 600,   type: 'expense' },
  { id: 3,  name: 'Transport',         icon: '🚗', color: '#f5c842',  planned: 350,   type: 'expense' },
  { id: 4,  name: 'Santé & Sport',     icon: '💪', color: '#a78bfa',  planned: 200,   type: 'expense' },
  { id: 5,  name: 'Sorties & Loisirs', icon: '🎭', color: '#fb923c',  planned: 400,   type: 'expense' },
  { id: 6,  name: 'Abonnements',       icon: '📱', color: '#ff4d6a',  planned: 180,   type: 'expense' },
  { id: 7,  name: 'Vêtements',         icon: '👕', color: '#8892aa',  planned: 150,   type: 'expense' },
  { id: 8,  name: 'Épargne / Invest.', icon: '💰', color: '#2dd4a0',  planned: 1500,  type: 'saving'  },
  { id: 9,  name: 'Divers',            icon: '📦', color: '#4a5470',  planned: 200,   type: 'expense' },
];

export const budgetTransactions = [
  // Mars 2026
  { id: 1,  date: '2026-03-01', categoryId: 1,  label: 'Loyer',                     amount: 1200, type: 'expense' },
  { id: 2,  date: '2026-03-02', categoryId: 2,  label: 'Courses Monoprix',            amount: 142,  type: 'expense' },
  { id: 3,  date: '2026-03-03', categoryId: 6,  label: 'Netflix + Spotify',           amount: 26,   type: 'expense' },
  { id: 4,  date: '2026-03-05', categoryId: 3,  label: 'Essence',                     amount: 75,   type: 'expense' },
  { id: 5,  date: '2026-03-07', categoryId: 5,  label: 'Restaurant avec amis',        amount: 85,   type: 'expense' },
  { id: 6,  date: '2026-03-08', categoryId: 4,  label: 'Abonnement salle sport',      amount: 45,   type: 'expense' },
  { id: 7,  date: '2026-03-10', categoryId: 2,  label: 'Supermarché',                 amount: 98,   type: 'expense' },
  { id: 8,  date: '2026-03-12', categoryId: 7,  label: 'Vêtements Zara',              amount: 124,  type: 'expense' },
  { id: 9,  date: '2026-03-14', categoryId: 5,  label: 'Cinéma + bowling',            amount: 48,   type: 'expense' },
  { id: 10, date: '2026-03-15', categoryId: 8,  label: 'Virement PEA',                amount: 1000, type: 'expense' },
  { id: 11, date: '2026-03-15', categoryId: 8,  label: 'Achat ETF VWCE',              amount: 500,  type: 'expense' },
  { id: 12, date: '2026-03-16', categoryId: 3,  label: 'SNCF Paris-Lyon',             amount: 68,   type: 'expense' },
  { id: 13, date: '2026-03-17', categoryId: 2,  label: 'Courses online',              amount: 64,   type: 'expense' },
  { id: 14, date: '2026-03-18', categoryId: 6,  label: 'Adobe CC',                   amount: 59,   type: 'expense' },
  { id: 15, date: '2026-03-18', categoryId: 9,  label: 'Cadeau anniversaire',         amount: 80,   type: 'expense' },
];

export const incomes = [
  { id: 1, date: '2026-03-01', label: 'Salaire net',               amount: 3800, category: 'salaire',     recurrent: true  },
  { id: 2, date: '2026-03-05', label: 'Dividendes TotalEnergies',  amount: 48,   category: 'dividendes',  recurrent: false },
  { id: 3, date: '2026-03-10', label: 'Revenus YouTube/contenu',   amount: 2930, category: 'contenu',     recurrent: false },
  { id: 4, date: '2026-03-15', label: 'Loyers immobilier',         amount: 4580, category: 'immobilier',  recurrent: true  },
  { id: 5, date: '2026-03-20', label: 'Mission freelance',         amount: 1200, category: 'freelance',   recurrent: false },
];

export const budgetMonthly = [
  { month: 'Sep', income: 9840, expenses: 4280, savings: 5560 },
  { month: 'Oct', income: 10200, expenses: 4580, savings: 5620 },
  { month: 'Nov', income: 9640, expenses: 5120, savings: 4520 },
  { month: 'Déc', income: 11800, expenses: 6840, savings: 4960 },
  { month: 'Jan', income: 9480, expenses: 4120, savings: 5360 },
  { month: 'Fév', income: 10840, expenses: 4380, savings: 6460 },
  { month: 'Mar', income: 12558, expenses: 4614, savings: 7944 },
];

export const savingsGoals = [
  { id: 1, name: 'Fonds urgence',        target: 30000, current: 18540, color: '#2dd4a0', icon: '🛡️', deadline: '2026-12-31' },
  { id: 2, name: 'Voyage Japon (refonte)',target: 8000,  current: 5200,  color: '#3d7fff', icon: '✈️', deadline: '2026-10-01' },
  { id: 3, name: 'Voiture électrique',   target: 25000, current: 8400,  color: '#f5c842', icon: '🚗', deadline: '2027-06-30' },
  { id: 4, name: 'Apport immobilier #2', target: 60000, current: 22000, color: '#a78bfa', icon: '🏠', deadline: '2028-01-01' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// OBJECTIFS & OKR
// ═══════════════════════════════════════════════════════════════════════════════

export const objectives = [
  {
    id: 1,
    title: 'Atteindre l\'indépendance financière partielle',
    category: 'finance',
    color: '#2dd4a0',
    icon: '💰',
    period: 'annual',
    year: 2026,
    quarter: null,
    progress: 48,
    status: 'on_track',
    description: 'Générer suffisamment de revenus passifs pour couvrir 50% de mes charges mensuelles.',
    keyResults: [
      { id: 1, label: 'Portfolio investi > 160 000 €',       target: 160000, current: 146200, unit: '€',     progress: 91 },
      { id: 2, label: 'MRR immobilier > 600 000 ¥/mois',    target: 618000, current: 618000, unit: '¥',     progress: 100 },
      { id: 3, label: 'Revenus contenu > 2 500 €/mois',     target: 2500,   current: 2930,   unit: '€',     progress: 100 },
      { id: 4, label: 'Taux d\'épargne > 40%',              target: 40,     current: 34,     unit: '%',     progress: 85 },
    ],
    linkedModules: ['budget', 'patrimoine', 'immo'],
  },
  {
    id: 2,
    title: 'Atteindre 100 000 abonnés sur YouTube',
    category: 'contenu',
    color: '#ff4d6a',
    icon: '🎬',
    period: 'annual',
    year: 2026,
    quarter: null,
    progress: 28,
    status: 'at_risk',
    description: 'Passer de 28 400 à 100 000 abonnés sur la chaîne Nova Visuals.',
    keyResults: [
      { id: 5, label: 'Abonnés YouTube Shorts',    target: 100000, current: 28400, unit: 'abonnés', progress: 28 },
      { id: 6, label: 'Publier 52 vidéos dans l\'année', target: 52, current: 8,  unit: 'vidéos', progress: 15 },
      { id: 7, label: 'CTR moyen > 10%',          target: 10, current: 8.4,     unit: '%',     progress: 84 },
      { id: 8, label: 'Revenu YouTube > 3 000 €/mois', target: 3000, current: 2930, unit: '€', progress: 98 },
    ],
    linkedModules: ['contenu', 'social'],
  },
  {
    id: 3,
    title: 'Transformer ma condition physique',
    category: 'santé',
    color: '#a78bfa',
    icon: '💪',
    period: 'annual',
    year: 2026,
    quarter: null,
    progress: 62,
    status: 'on_track',
    description: 'Atteindre 12% de masse grasse et améliorer mes performances sportives.',
    keyResults: [
      { id: 9,  label: 'Masse grasse < 12%',       target: 12,  current: 15.2, unit: '%',   progress: 74 },
      { id: 10, label: 'Poids cible 76 kg',         target: 76,  current: 79.1, unit: 'kg',  progress: 53 },
      { id: 11, label: 'Développé couché 120 kg',   target: 120, current: 102.5, unit: 'kg', progress: 85 },
      { id: 12, label: 'Run 10km < 48 min',         target: 48,  current: 52,   unit: 'min', progress: 55 },
      { id: 13, label: 'S\'entraîner 4x/semaine',   target: 52*4, current: 40,  unit: 'séances', progress: 77 },
    ],
    linkedModules: ['santé'],
  },
  {
    id: 4,
    title: 'Acquérir un 6ème bien immobilier au Japon',
    category: 'immobilier',
    color: '#f5c842',
    icon: '🏠',
    period: 'annual',
    year: 2026,
    quarter: null,
    progress: 22,
    status: 'on_track',
    description: 'Identifier et acquérir un bien à Nara ou Kamakura pour 20-25M ¥.',
    keyResults: [
      { id: 14, label: 'Visiter 10 biens',                   target: 10,  current: 3,    unit: 'biens', progress: 30 },
      { id: 15, label: 'Financement validé (apport 30%)',     target: 100, current: 40,   unit: '%',     progress: 40 },
      { id: 16, label: 'Offre acceptée avant Q3',             target: 1,   current: 0,    unit: 'offre', progress: 0  },
      { id: 17, label: 'Rendement cible > 5.5%',             target: 5.5, current: 0,    unit: '%',     progress: 0  },
    ],
    linkedModules: ['immo'],
  },
  {
    id: 5,
    title: 'Lancer une formation en ligne',
    category: 'contenu',
    color: '#fb923c',
    icon: '📚',
    period: 'Q2',
    year: 2026,
    quarter: 2,
    progress: 15,
    status: 'at_risk',
    description: 'Créer et lancer une formation sur la création vidéo & setup créateur.',
    keyResults: [
      { id: 18, label: 'Programme de 10 modules rédigé',  target: 10, current: 2,    unit: 'modules', progress: 20 },
      { id: 19, label: 'Page de vente en ligne',          target: 1,  current: 0,    unit: 'page',    progress: 0  },
      { id: 20, label: '50 pré-inscriptions',             target: 50, current: 8,    unit: 'inscrits',progress: 16 },
      { id: 21, label: 'Lancement avant le 30 juin',      target: 1,  current: 0,    unit: 'launch',  progress: 0  },
    ],
    linkedModules: ['contenu'],
  },
];

export const weeklyCheckIns = [
  { id: 1, date: '2026-03-17', objectiveId: 1, note: 'Portfolio en hausse, revenus contenu record ce mois.', mood: 5 },
  { id: 2, date: '2026-03-17', objectiveId: 2, note: 'Vidéo Japon explose, +3200 subs ce mois.', mood: 4 },
  { id: 3, date: '2026-03-17', objectiveId: 3, note: 'PR développé couché ! Poids en baisse constante.', mood: 5 },
  { id: 4, date: '2026-03-10', objectiveId: 4, note: 'Rendez-vous avec l\'agent immobilier à Nara.', mood: 3 },
  { id: 5, date: '2026-03-10', objectiveId: 5, note: 'Début d\'écriture du module 2.', mood: 3 },
];