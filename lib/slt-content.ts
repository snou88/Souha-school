export const sltIdentity = {
  officialName: "Souha School OF Languages and Training",
  phones: ["(+213) 0560 68 74 85"],
  address: "42 Cooperative Djenane – Dely Ibrahim – Algérie",
  description:
    "Souha School of Languages and Training est un établissement privé agréé, spécialisé dans la formation professionnelle (courte, moyenne et longue durée), ainsi que dans les séminaires, formations spécialisées, team building et services de conseil aux entreprises.",
  objective:
    "Assurer l’adéquation entre les compétences des collaborateurs et les exigences du marché du travail afin d’améliorer la performance et la compétitivité des organisations.",
} as const

export const sltNav = {
  links: [
    { href: "/", label: "Accueil" },
    { href: "/formations", label: "Formations" },
    { href: "/about", label: "À propos" },
    { href: "/contact", label: "Contact" },
  ],
  cta: { href: "/inscription", label: "S’inscrire" },
} as const

export const sltHomeContent = {
  hero: {
    pill: "Inscriptions ouvertes — 2026",
    title: "Développez vos compétences avec",
    titleAccent: "une formation professionnelle",
    lead:
      "Des programmes conçus pour répondre aux besoins du marché et renforcer la performance des organisations. Formations de courte, moyenne et longue durée, avec des intervenants experts.",
    primaryCta: "Découvrir nos formations",
    secondaryCta: "Déposer une demande",
    proofTitle: "Un accompagnement orienté résultats",
    proofSubtitle: "Des parcours adaptés aux besoins des entreprises et des apprenants",
    stats: [
      { value: "Agréé", label: "Établissement privé" },
      { value: "National & international", label: "Formateurs experts" },
      { value: "Sur mesure", label: "Programmes flexibles" },
      { value: "Conseil", label: "Accompagnement entreprises" },
    ],
    certifiedTitle: "Prestations certifiantes",
    certifiedSubtitle: "Formations et séminaires à forte valeur ajoutée",
  },
  whyUs: {
    eyebrow: "Pourquoi nous ?",
    title: "Une offre complète au service de votre performance",
    lead:
      "Qualité pédagogique, expertise terrain et dispositifs flexibles: nous construisons des parcours alignés sur vos objectifs.",
    items: [
      { title: "Qualité", description: "Une démarche qualité orientée résultats et amélioration continue." },
      { title: "Formateurs experts", description: "Intervenants nationaux et internationaux, spécialistes de leur domaine." },
      { title: "Programmes sur mesure", description: "Des contenus modulables et adaptés à vos enjeux métiers." },
      { title: "Team building & séminaires", description: "Des formats engageants pour renforcer cohésion et compétences." },
      { title: "Installations modernes", description: "Piscine, jardin, restaurant et salles équipées pour un cadre optimal." },
      { title: "Développement continu", description: "Veille, mise à jour des contenus et innovation pédagogique." },
    ],
  },
  problems: {
    eyebrow: "Vos problématiques",
    title: "Les défis rencontrés par les organisations",
    items: [
      "Compétences limitées ou non alignées sur les besoins actuels",
      "Difficulté d’adaptation au changement",
      "Fluctuations économiques et incertitudes",
      "Complexité des lois et des réglementations",
      "Productivité insuffisante et collaboration perfectible",
      "Manque d’innovation et de leadership",
    ],
  },
  solutions: {
    eyebrow: "Nos solutions",
    title: "Des réponses concrètes et opérationnelles",
    items: [
      "Renforcement des compétences et montée en qualification",
      "Accompagnement à l’adaptation au changement",
      "Préparation et anticipation des enjeux économiques",
      "Maîtrise des exigences réglementaires et conformité",
      "Optimisation de la productivité et de la collaboration",
      "Développement de l’innovation et du leadership",
    ],
  },
  trainings: {
    eyebrow: "Nos formations professionnelles",
    title: "Des parcours structurés et adaptables",
    items: [
      { title: "Formations techniques", description: "Métiers, procédures et outils opérationnels." },
      { title: "Formations informatiques", description: "Compétences numériques et solutions IT." },
      { title: "Programmes personnalisés", description: "Conception sur mesure selon vos objectifs." },
    ],
  },
  transversal: {
    eyebrow: "Formations transversales",
    title: "Compétences comportementales et langues",
    items: [
      "Gestion du temps et du stress",
      "Travail en équipe",
      "Leadership",
      "Langues : anglais, français, espagnol, allemand, italien",
    ],
  },
  seminars: {
    eyebrow: "Séminaires & team building",
    title: "Des formats dynamiques pour fédérer et développer",
    types: [
      "Séminaire d’intégration",
      "Séminaire de formation",
      "Séminaire team building",
      "Séminaire management",
      "Séminaire direction",
    ],
    themesTitle: "Exemples de thématiques",
    themes: [
      "Gestion des tableaux de bord RH sous Excel",
      "Plan de formation",
      "Gestion des conflits",
      "Communication en entreprise",
      "Audit RH",
      "Processus de recrutement",
      "Management",
      "Organisation du travail",
      "Etc.",
    ],
  },
} as const

export const sltUiLabels = {
  status: {
    Pending: "En attente",
    Approved: "Approuvée",
    Rejected: "Rejetée",
    Active: "Actif",
    Inactive: "Inactif",
    Graduated: "Diplômé",
    Draft: "Brouillon",
    Archived: "Archivé",
  } as Record<string, string>,
  accountType: {
    Individual: "Particulier",
    Company: "Entreprise",
  } as Record<string, string>,
} as const

