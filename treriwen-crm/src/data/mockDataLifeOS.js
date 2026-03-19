// ═══════════════════════════════════════════════════════════════════════════════
// HABITUDES & ROUTINES
// ═══════════════════════════════════════════════════════════════════════════════

export const habits = [
  { id: 1,  name: 'Méditation',       icon: '🧘', color: '#a78bfa', category: 'bien-être',  routine: 'matin',  linkedOKRId: null, targetStreak: 30, currentStreak: 14, bestStreak: 21 },
  { id: 2,  name: 'Lecture 30min',    icon: '📚', color: '#3d7fff', category: 'développement', routine: 'soir', linkedOKRId: null, targetStreak: 30, currentStreak: 8,  bestStreak: 22 },
  { id: 3,  name: 'Sport / Workout',  icon: '🏋️', color: '#ff4d6a', category: 'santé',      routine: null,     linkedOKRId: 3,   targetStreak: 20, currentStreak: 5,  bestStreak: 12 },
  { id: 4,  name: 'Journaling',       icon: '✍️', color: '#2dd4a0', category: 'bien-être',  routine: 'soir',   linkedOKRId: null, targetStreak: 30, currentStreak: 22, bestStreak: 22 },
  { id: 5,  name: 'Eau 2L',           icon: '💧', color: '#69C9D0', category: 'santé',      routine: null,     linkedOKRId: null, targetStreak: 30, currentStreak: 18, bestStreak: 28 },
  { id: 6,  name: 'Pas de réseaux <21h', icon: '📵', color: '#f5c842', category: 'bien-être', routine: 'soir', linkedOKRId: null, targetStreak: 21, currentStreak: 3,  bestStreak: 9  },
  { id: 7,  name: 'Veille contenu',   icon: '📰', color: '#fb923c', category: 'professionnel', routine: 'matin', linkedOKRId: 2, targetStreak: 20, currentStreak: 11, bestStreak: 15 },
  { id: 8,  name: 'Révision finances',icon: '💰', color: '#2dd4a0', category: 'finances',   routine: null,     linkedOKRId: 1,   targetStreak: 7,  currentStreak: 6,  bestStreak: 7  },
];

// Historique 21 derniers jours (true = fait, false = raté, null = futur)
const today = new Date();
function genHistory(streak, total = 21) {
  const h = [];
  for (let i = total - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (i === 0) h.push({ date: d.toISOString().slice(0, 10), done: true });
    else if (i < streak + 3) h.push({ date: d.toISOString().slice(0, 10), done: Math.random() > 0.15 });
    else h.push({ date: d.toISOString().slice(0, 10), done: Math.random() > 0.5 });
  }
  return h;
}

export const habitHistory = {
  1: genHistory(14), 2: genHistory(8),  3: genHistory(5),
  4: genHistory(22), 5: genHistory(18), 6: genHistory(3),
  7: genHistory(11), 8: genHistory(6),
};

export const routines = {
  matin: [
    { time: '07:00', label: 'Réveil sans snooze',   done: true  },
    { time: '07:10', label: 'Verre d\'eau + vitamine', done: true },
    { time: '07:20', label: 'Méditation 10min',      done: true  },
    { time: '07:30', label: 'Lecture actualités',    done: true  },
    { time: '08:00', label: 'Petite-déjeuner riche', done: false },
    { time: '08:20', label: 'Définir top 3 du jour', done: false },
  ],
  soir: [
    { time: '21:00', label: 'Pas d\'écran',          done: false },
    { time: '21:30', label: 'Lecture 30min',          done: false },
    { time: '22:00', label: 'Journaling / bilan',    done: false },
    { time: '22:30', label: 'Sommeil',                done: false },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// BASE DE CONNAISSANCES
// ═══════════════════════════════════════════════════════════════════════════════

export const knowledgeItems = [
  {
    id: 1, type: 'note', title: 'Stratégie contenu 2026',
    content: '## Stratégie YouTube 2026\n\n### Objectifs\n- Atteindre 100k abonnés avant fin 2026\n- Publier 1 vidéo/semaine minimum\n- Diversifier sur Shorts + Instagram Reels\n\n### Formats qui marchent\n1. **Reviews matériel** — meilleur CTR (~11%)\n2. **Vlogs voyage** — meilleur engagement (8.9%)\n3. **Tutoriels** — meilleur taux de rétention (57%)\n\n### Actions Q2\n- Tester format interview\n- Lancer la série "Setup Tour"\n- Négocier 3 nouveaux partenariats',
    tags: ['youtube', 'stratégie', 'contenu', '2026'], category: 'Contenu',
    color: '#ff4d6a', createdAt: '2026-02-15', updatedAt: '2026-03-10',
    linkedProject: null, pinned: true,
  },
  {
    id: 2, type: 'bookmark', title: 'Investissement immo au Japon — Guide complet',
    content: 'Guide détaillé sur les procédures d\'achat immobilier au Japon pour non-résidents. Couvre la fiscalité, les prêts bancaires, les agences recommandées.',
    url: 'https://example.com/immo-japon-guide',
    tags: ['immobilier', 'japon', 'investissement'], category: 'Immobilier',
    color: '#f5c842', createdAt: '2026-01-20', updatedAt: '2026-01-20',
    linkedProject: 'Acquisition bien Nara', pinned: false,
  },
  {
    id: 3, type: 'idea', title: 'Idée série documentaire Japon',
    content: '## Concept : "Building in Japan"\n\nSérie documentaire sur la construction/rénovation d\'un bien au Japon. Montrer tout le processus depuis la recherche jusqu\'à la location.\n\n**Angle unique** : Vue de l\'investisseur étranger\n**Format** : 5-8 épisodes de 20-25min\n**Monétisation** : AdSense + sponsoring immobilier\n\n→ À pitcher aux partenaires en Q3',
    tags: ['idée', 'youtube', 'japon', 'immobilier'], category: 'Idées',
    color: '#2dd4a0', createdAt: '2026-03-05', updatedAt: '2026-03-05',
    linkedProject: null, pinned: true,
  },
  {
    id: 4, type: 'resource', title: 'Convention fiscale France-Japon (texte officiel)',
    content: 'Document de référence pour la convention fiscale bilatérale FR-JP. Essentiel pour déclarer correctement les revenus fonciers japonais en France.',
    url: 'https://example.com/convention-fiscale-fr-jp',
    tags: ['fiscal', 'japon', 'france', 'immobilier'], category: 'Fiscal',
    color: '#3d7fff', createdAt: '2022-06-10', updatedAt: '2024-01-15',
    linkedProject: 'Déclaration revenus fonciers', pinned: false,
  },
  {
    id: 5, type: 'note', title: 'Notes formation DaVinci Resolve',
    content: '## DaVinci Resolve — Astuces avancées\n\n### Fusion (VFX)\n- Nœuds de base : MediaIn → Merge → MediaOut\n- Masques animés avec des tracker\n\n### Color Grading\n- Commencer toujours par la balance des noirs\n- LUT personnalisées pour cohérence de couleur entre caméras (Sony + DJI)\n- Export : H.265 Main10 pour YouTube HDR\n\n### Optimisation\n- Proxy média pour M3 : utiliser DNxHR LB\n- Raccourcis custom sauvegardés dans ~/resolve-shortcuts.json',
    tags: ['vidéo', 'montage', 'davinci', 'technique'], category: 'Technique',
    color: '#a78bfa', createdAt: '2025-11-20', updatedAt: '2026-02-08',
    linkedProject: null, pinned: false,
  },
  {
    id: 6, type: 'bookmark', title: 'ETF All-World vs S&P500 — Comparaison approfondie',
    content: 'Analyse comparative des deux ETF phares : VWCE vs CSPX. Performances, frais, diversification géographique, impact fiscal pour un résident français.',
    url: 'https://example.com/etf-comparison',
    tags: ['investissement', 'etf', 'bourse'], category: 'Finance',
    color: '#2dd4a0', createdAt: '2026-01-05', updatedAt: '2026-01-05',
    linkedProject: null, pinned: false,
  },
  {
    id: 7, type: 'idea', title: 'Formation création vidéo — Plan de cours',
    content: '## Structure formation "Creator Pro"\n\n### Module 1 : Fondamentaux\n- Choisir sa caméra et son matériel\n- Réglages essentiels\n\n### Module 2 : Tournage\n- Composition et cadrage\n- Son : micro-cravate vs perche\n- Lumière naturelle vs artificielle\n\n### Module 3 : Montage\n- DaVinci Resolve de A à Z\n- Color grading\n- Exports optimisés\n\n### Module 4 : Distribution\n- SEO YouTube\n- Miniatures qui convertissent\n- Analytics et itération\n\n**Prix cible** : 197€ | **Objectif** : 50 ventes en lancement',
    tags: ['formation', 'contenu', 'business', 'idée'], category: 'Idées',
    color: '#fb923c', createdAt: '2026-03-01', updatedAt: '2026-03-15',
    linkedProject: 'Lancement formation Q2', pinned: true,
  },
  {
    id: 8, type: 'resource', title: 'Check-list acquisition bien immobilier JP',
    content: '## Checklist achat immo Japon\n\n### Avant visite\n- [ ] Vérifier le hanrei (historique)\n- [ ] Consulter plan cadastral\n- [ ] Vérifier zone sismique\n\n### Due diligence\n- [ ] Bâtiment construit avant/après 1981 (nouvelle norme)\n- [ ] Statut shikichi (propriété terrain)\n- [ ] Charges copropriété\n\n### Financement\n- [ ] Taux en cours banques JP (SBI, SMBC)\n- [ ] Apport minimum 30% non-résidents\n\n### Admin\n- [ ] Hanko (sceau personnel)\n- [ ] Numéro My Number\n- [ ] Compte bancaire JP actif',
    tags: ['immobilier', 'japon', 'checklist', 'achat'], category: 'Immobilier',
    color: '#f5c842', createdAt: '2026-02-28', updatedAt: '2026-03-12',
    linkedProject: 'Acquisition bien Nara', pinned: false,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// NOTIFICATIONS & ALERTES
// ═══════════════════════════════════════════════════════════════════════════════

export const notifications = [
  // CRM
  { id: 1,  module: 'crm',          type: 'warning', priority: 'high',   title: 'Deal proche de l\'échéance',         body: 'Le deal "Refonte SI Nexus" doit être clôturé avant le 31 mars.', date: '2026-03-18', read: false, link: '/deals' },
  { id: 2,  module: 'crm',          type: 'info',    priority: 'medium', title: '3 tâches en retard',                  body: 'Vous avez 3 tâches dont la date est dépassée.', date: '2026-03-18', read: false, link: '/tasks' },
  // Immobilier
  { id: 3,  module: 'immobilier',   type: 'danger',  priority: 'high',   title: 'Inspection urgente — Sapporo',        body: 'L\'inspection électrique complète est planifiée pour le 30 mars.', date: '2026-03-17', read: false, link: '/immo/travaux' },
  { id: 4,  module: 'immobilier',   type: 'warning', priority: 'high',   title: 'Bail Tanaka expire dans 42 jours',    body: 'Le bail de Yuki Tanaka (Shibuya) expire le 30 avril 2024.', date: '2026-03-16', read: false, link: '/immo/locataires' },
  { id: 5,  module: 'immobilier',   type: 'info',    priority: 'medium', title: 'Renouvellement Booking.com en cours', body: 'Deuxième vidéo du contrat Booking — tournage Avril.', date: '2026-03-15', read: true,  link: '/immo' },
  // Finances
  { id: 6,  module: 'budget',       type: 'warning', priority: 'medium', title: 'Budget "Sorties" à 93%',              body: 'Vous avez dépensé 373€ sur 400€ prévus pour les sorties.', date: '2026-03-18', read: false, link: '/budget' },
  { id: 7,  module: 'investissements', type: 'success', priority: 'low', title: 'Portfolio +5.6% ce mois',            body: 'Votre portfolio a progressé de +7 800€ ce mois. NVDA +82%.', date: '2026-03-17', read: true,  link: '/patrimoine' },
  // OKR
  { id: 8,  module: 'okr',          type: 'danger',  priority: 'high',   title: 'OKR "YouTube 100k" à risque',        body: 'Progression 28% pour un objectif annuel — rythme insuffisant.', date: '2026-03-18', read: false, link: '/okr' },
  { id: 9,  module: 'okr',          type: 'danger',  priority: 'high',   title: 'OKR "Formation" à risque',           body: 'Lancement Q2 mais seulement 15% de progression.', date: '2026-03-18', read: false, link: '/okr' },
  // Santé
  { id: 10, module: 'santé',        type: 'success', priority: 'low',    title: 'Nouveau PR — Développé couché',      body: '102.5kg atteints aujourd\'hui ! Record personnel battu.', date: '2026-03-17', read: true,  link: '/sante' },
  { id: 11, module: 'santé',        type: 'info',    priority: 'medium', title: 'Objectif poids : encore 3.1kg',      body: 'Vous êtes à 79.1kg. Objectif 76kg — continuez !', date: '2026-03-16', read: true,  link: '/sante' },
  // Contenu
  { id: 12, module: 'contenu',      type: 'success', priority: 'low',    title: 'Record vues — Vidéo Japon',          body: 'La vidéo documentaire Japon dépasse 168 000 vues en 17 jours.', date: '2026-03-15', read: true,  link: '/content/videos' },
  { id: 13, module: 'contenu',      type: 'info',    priority: 'medium', title: 'Partenariat NordVPN en négociation', body: 'Contre-offre envoyée à 1 800€. En attente de retour.', date: '2026-03-14', read: true,  link: '/content/partnerships' },
  // Habitudes
  { id: 14, module: 'habitudes',    type: 'warning', priority: 'medium', title: 'Streak "Pas de réseaux" = 3 jours',  body: 'Objectif : 21 jours. Continuez ce soir !', date: '2026-03-18', read: false, link: '/habitudes' },
  { id: 15, module: 'habitudes',    type: 'success', priority: 'low',    title: 'Streak journaling = 22 jours 🔥',    body: 'Nouveau meilleur record ! Objectif 30 jours en vue.', date: '2026-03-17', read: true,  link: '/habitudes' },
  // Maintenance immo
  { id: 16, module: 'immobilier',   type: 'warning', priority: 'high',   title: 'Maintenance : inspection électrique', body: 'Appartement Sapporo — prévoir intervention avant location.', date: '2026-03-15', read: false, link: '/immo/travaux' },
  { id: 17, module: 'immobilier',   type: 'info',    priority: 'low',    title: 'Loyers mars tous reçus',             body: 'Tous les loyers de mars ont été encaissés. Total : 618 000 ¥', date: '2026-03-05', read: true,  link: '/immo' },
];