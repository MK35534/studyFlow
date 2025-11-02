// Landing Page Configuration
// Modify these values to customize the landing page

export const landingConfig = {
  // Brand
  brand: {
    name: 'StudyUp',
    tagline: 'Planifie intelligemment, progresse sereinement.',
    description: "L'app qui aide les étudiants à gagner du temps et à rester constants dans leur travail.",
  },

  // Hero Section
  hero: {
    badge: 'Actuellement en bêta',
    title: {
      gradient: 'Planifie intelligemment,',
      normal: 'progresse sereinement.',
    },
    subtitle: "L'app qui aide les étudiants à gagner du temps et à rester constants dans leur travail.",
    cta: {
      primary: 'Rejoindre la bêta',
      secondary: 'Découvrir les fonctionnalités',
    },
    stats: [
      { value: '500+', label: 'Étudiants inscrits' },
      { value: '10k+', label: 'Devoirs organisés' },
      { value: '95%', label: 'De satisfaction' },
    ],
  },

  // Problem Section
  problem: {
    title: 'Trop d\'outils, pas assez de clarté',
    subtitle: 'Tu jongles entre Notion, Google Agenda, Todoist, et une dizaine d\'autres apps juste pour suivre tes cours et devoirs.',
    problems: [
      {
        emoji: '😵',
        title: 'Trop dispersé',
        description: 'Perdre du temps à switcher entre 5 apps différentes chaque jour.',
      },
      {
        emoji: '😰',
        title: 'Trop compliqué',
        description: 'Passer plus de temps à configurer qu\'à travailler efficacement.',
      },
      {
        emoji: '😞',
        title: 'Pas adapté',
        description: 'Aucun outil pensé spécifiquement pour les étudiants.',
      },
    ],
    solution: {
      icon: '💡',
      title: 'Tu n\'as pas besoin de dix outils pour t\'organiser.',
      subtitle: 'Un seul suffit. 🎯',
    },
  },

  // Features Section
  features: {
    title: 'Tout ce dont tu as besoin, rien de superflu',
    items: [
      {
        emoji: '📚',
        gradient: 'from-blue-500 to-blue-600',
        title: 'Organise tes cours et devoirs simplement',
        description: 'Centralise tous tes devoirs, notes et sessions d\'étude dans un seul endroit. Fini les oublis et le stress de dernière minute.',
        features: [
          'Vue calendrier intuitive',
          'Gestion par matière avec couleurs',
          'Deadlines et priorités claires',
        ],
      },
      {
        emoji: '📅',
        gradient: 'from-purple-500 to-purple-600',
        title: 'Planifie tes sessions sans stress',
        description: 'Crée des blocs de travail adaptés à ton rythme. Visualise ta semaine d\'un coup d\'œil et reste motivé.',
        features: [
          'Planification intelligente',
          'Vue semaine complète',
          'Statistiques de progression',
        ],
      },
      {
        emoji: '🎯',
        gradient: 'from-pink-500 to-pink-600',
        title: 'Reste concentré avec le mode Focus',
        description: 'Lance une session de travail immersive avec timer Pomodoro, sons d\'ambiance et suivi de temps automatique.',
        features: [
          'Timer Pomodoro intégré',
          'Sons d\'ambiance relaxants',
          'Suivi automatique du temps',
        ],
      },
      {
        emoji: '🔄',
        gradient: 'from-indigo-500 to-indigo-600',
        title: 'Synchronise ton emploi du temps Pronote',
        description: 'Importe automatiquement tes devoirs et ton emploi du temps depuis Pronote. Tout est synchronisé en temps réel.',
        features: [
          'Import automatique Pronote',
          'Sync en temps réel',
          'Compatible tous ENT',
        ],
      },
    ],
  },

  // Testimonials Section
  testimonials: {
    title: 'Ce que disent nos étudiants',
    items: [
      {
        initial: 'M',
        name: 'Marie L.',
        role: 'Terminale S',
        gradient: 'from-blue-500 to-purple-500',
        text: 'J\'ai enfin trouvé un outil qui me simplifie vraiment la vie. Plus besoin de jongler entre 10 apps. Tout est là, clair et efficace. 🎯',
      },
      {
        initial: 'T',
        name: 'Thomas B.',
        role: '1ère année Licence',
        gradient: 'from-purple-500 to-pink-500',
        text: 'Le mode Focus est un game changer. Je reste concentré 2x plus longtemps et je procrastine beaucoup moins. Merci StudyUp ! 🚀',
      },
      {
        initial: 'S',
        name: 'Sarah K.',
        role: 'Seconde',
        gradient: 'from-pink-500 to-red-500',
        text: 'La sync Pronote est magique ! Tous mes devoirs apparaissent automatiquement. Je ne rate plus aucune deadline. 📚✨',
      },
      {
        initial: 'L',
        name: 'Lucas D.',
        role: 'Terminale ES',
        gradient: 'from-indigo-500 to-blue-500',
        text: 'Interface ultra intuitive, design moderne et fonctionnalités bien pensées. C\'est exactement ce dont j\'avais besoin. 💯',
      },
      {
        initial: 'E',
        name: 'Emma R.',
        role: '2ème année Prépa',
        gradient: 'from-green-500 to-teal-500',
        text: 'Même avec un emploi du temps de fou, je reste organisée et sereine grâce à StudyUp. Un vrai boost de productivité ! 💪',
      },
      {
        initial: 'A',
        name: 'Alexandre M.',
        role: '1ère STI2D',
        gradient: 'from-orange-500 to-yellow-500',
        text: 'Mes notes ont littéralement décollé depuis que j\'utilise StudyUp. Je planifie mieux et je travaille plus efficacement. 📈',
      },
    ],
    trustIndicators: [
      '🎓 Lycée Henri IV',
      '🎓 Lycée Louis-le-Grand',
      '🎓 Université Paris-Saclay',
    ],
  },

  // CTA Section
  cta: {
    badge: 'Places limitées',
    title: 'Rejoins les étudiants qui s\'organisent mieux',
    subtitle: 'Rejoins la bêta privée et sois parmi les premiers à découvrir StudyUp. Accès gratuit et prioritaire.',
    placeholder: 'ton.email@exemple.com',
    button: 'Rejoindre la bêta',
    successMessage: 'Merci ! Tu es inscrit à la bêta. Check tes emails 📧',
    trustBadges: [
      { icon: '✓', text: 'Gratuit pendant la bêta' },
      { icon: '✓', text: 'Sans engagement' },
      { icon: '✓', text: 'Accès prioritaire' },
    ],
    socialProof: 'Déjà 500+ étudiants inscrits 🎉',
  },

  // Footer
  footer: {
    description: 'L\'outil tout-en-un qui aide les étudiants à s\'organiser, rester concentrés et progresser sereinement.',
    links: {
      product: {
        title: 'Produit',
        items: [
          { label: 'Fonctionnalités', href: '#features' },
          { label: 'Témoignages', href: '#testimonials' },
          { label: 'Tarifs', href: '#' },
          { label: 'FAQ', href: '#' },
        ],
      },
      support: {
        title: 'Support',
        items: [
          { label: 'Contact', href: '#' },
          { label: 'Documentation', href: '#' },
          { label: 'Confidentialité', href: '#' },
          { label: 'CGU', href: '#' },
        ],
      },
    },
    social: [
      { name: 'Facebook', icon: 'facebook', href: '#' },
      { name: 'Twitter', icon: 'twitter', href: '#' },
      { name: 'GitHub', icon: 'github', href: '#' },
    ],
    copyright: '© 2025 StudyUp. Tous droits réservés.',
  },

  // Colors (Tailwind classes)
  colors: {
    primary: 'blue-600',
    secondary: 'purple-600',
    accent: 'pink-600',
    gradient: 'from-blue-600 via-purple-600 to-pink-600',
  },

  // Animations timing (in ms)
  animations: {
    fast: 150,
    normal: 300,
    slow: 600,
    verySlow: 800,
  },
}
