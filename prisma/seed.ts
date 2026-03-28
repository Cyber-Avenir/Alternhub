import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ────────────────────────────────────────────
// DATA: SKILLS
// ────────────────────────────────────────────
const skills = [
  { name: "React", category: "Frontend" },
  { name: "Vue.js", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "TypeScript", category: "Frontend" },
  { name: "HTML/CSS", category: "Frontend" },
  { name: "TailwindCSS", category: "Frontend" },
  { name: "Node.js", category: "Backend" },
  { name: "Python", category: "Backend" },
  { name: "Java", category: "Backend" },
  { name: "Express.js", category: "Backend" },
  { name: "Django", category: "Backend" },
  { name: "Spring Boot", category: "Backend" },
  { name: "NestJS", category: "Backend" },
  { name: "PostgreSQL", category: "Database" },
  { name: "MySQL", category: "Database" },
  { name: "MongoDB", category: "Database" },
  { name: "Redis", category: "Database" },
  { name: "Prisma", category: "Database" },
  { name: "Docker", category: "DevOps" },
  { name: "Kubernetes", category: "DevOps" },
  { name: "CI/CD", category: "DevOps" },
  { name: "AWS", category: "DevOps" },
  { name: "Git", category: "DevOps" },
  { name: "Linux", category: "DevOps" },
  { name: "Figma", category: "Design" },
  { name: "Adobe XD", category: "Design" },
  { name: "UX Research", category: "Design" },
  { name: "Prototypage", category: "Design" },
  { name: "Machine Learning", category: "Data" },
  { name: "SQL Analytics", category: "Data" },
  { name: "Power BI", category: "Data" },
  { name: "Pandas", category: "Data" },
  { name: "TensorFlow", category: "Data" },
  { name: "Cybersécurité", category: "Security" },
  { name: "Pentest", category: "Security" },
  { name: "SIEM", category: "Security" },
  { name: "Communication", category: "Soft Skills" },
  { name: "Gestion de projet", category: "Soft Skills" },
  { name: "Agile/Scrum", category: "Soft Skills" },
  { name: "Leadership", category: "Soft Skills" },
];

// ────────────────────────────────────────────
// DATA: BONS PLANS (simulés scraping)
// ────────────────────────────────────────────
const bonsPlans = [
  // Logement
  {
    title: "APL — Aide Personnalisée au Logement",
    description: "Réduisez votre loyer grâce aux aides de la CAF. Jusqu'à 250€/mois selon vos ressources et votre localisation.",
    category: "LOGEMENT",
    discount: "Jusqu'à -250€/mois",
    url: "https://www.caf.fr/allocataires/aides-et-demarches/droits-et-prestations/se-loger/l-aide-personnalisee-au-logement-apl",
    source: "caf.fr",
  },
  {
    title: "Action Logement — Avance Loca-Pass",
    description: "Financement du dépôt de garantie sans intérêts. Jusqu'à 1 200€ remboursables en 25 mois.",
    category: "LOGEMENT",
    discount: "Avance gratuite jusqu'à 1 200€",
    url: "https://www.actionlogement.fr/le-loca-pass",
    source: "actionlogement.fr",
  },
  {
    title: "Mobili-Jeune — Action Logement",
    description: "Aide pour les jeunes en alternance qui louent dans le parc privé. De 10€ à 100€ par mois.",
    category: "LOGEMENT",
    discount: "10€ à 100€/mois",
    url: "https://www.actionlogement.fr/le-mobili-jeune",
    source: "actionlogement.fr",
  },
  {
    title: "Résidences CROUS — Tarifs étudiants",
    description: "Logement en cité universitaire de 160€ à 380€/mois selon la région. Priorité aux alternants boursiers.",
    category: "LOGEMENT",
    discount: "Dès 160€/mois",
    url: "https://www.messervices.etudiant.gouv.fr/envole/portal/index.php#tab/1",
    source: "crous.fr",
  },
  // Transport
  {
    title: "Pass Navigo Annuel — Remboursement employeur",
    description: "Votre employeur est obligé de rembourser 50% de votre Pass Navigo. Pensez à demander le formulaire RH.",
    category: "TRANSPORT",
    discount: "-50% sur le Pass Navigo",
    url: "https://www.service-public.fr/particuliers/vosdroits/F19846",
    source: "service-public.fr",
  },
  {
    title: "TGV Max Jeunes — Trains illimités",
    description: "Tous les TGV, Intercités et TER en illimité pour 79€/mois. Idéal si votre alternance est loin de chez vous.",
    category: "TRANSPORT",
    discount: "Trains illimités dès 79€/mois",
    originalPrice: "250€+",
    finalPrice: "79€/mois",
    url: "https://www.sncf-connect.com/app/abonnement-tgv-max",
    source: "sncf-connect.com",
  },
  {
    title: "Vélib' Métropole — 1 an à -75%",
    description: "Abonnement annuel Vélib' à 25€ au lieu de 100€ pour les moins de 27 ans.",
    category: "TRANSPORT",
    discount: "-75% pour les -27 ans",
    originalPrice: "100€/an",
    finalPrice: "25€/an",
    url: "https://www.velib-metropole.fr/offres",
    source: "velib-metropole.fr",
  },
  {
    title: "Blablacar — 10% de réduction",
    description: "Code promo étudiant valable sur tous vos trajets. Vérifiez votre portail école.",
    category: "TRANSPORT",
    discount: "-10% sur chaque trajet",
    url: "https://www.blablacar.fr",
    source: "blablacar.fr",
  },
  // Alimentation
  {
    title: "CROUS — Repas à 3,30€",
    description: "Accédez aux restaurants universitaires avec le statut étudiant. Repas complet pour 3,30€ (moins si boursier).",
    category: "ALIMENTATION",
    discount: "Repas à 3,30€",
    url: "https://www.etudiant.gouv.fr/fr/les-restaurants-et-cafeterias-du-crous-1504",
    source: "etudiant.gouv.fr",
  },
  {
    title: "Too Good To Go — Anti-gaspi à prix réduit",
    description: "Récupérez des paniers repas invendus à -70% du prix normal. Plus de 60 000 partenaires en France.",
    category: "ALIMENTATION",
    discount: "Jusqu'à -70% sur les repas",
    url: "https://www.toogoodtogo.com/fr-fr",
    source: "toogoodtogo.com",
  },
  {
    title: "UberEats / Deliveroo — Abonnement étudiant",
    description: "Livraison gratuite illimitée sur la plupart des restaurants avec l'abonnement étudiant vérifié.",
    category: "ALIMENTATION",
    discount: "Livraison gratuite illimitée",
    finalPrice: "2,99€/mois (1 mois offert)",
    url: "https://www.ubereats.com/fr/eats-pass",
    source: "ubereats.com",
  },
  // Tech
  {
    title: "GitHub Student Developer Pack",
    description: "Pack d'outils premium GRATUITS : GitHub Copilot, Heroku, DigitalOcean 200$, Notion Pro, Canva Pro...",
    category: "TECH",
    discount: "Pack à plus de 200 000€ de valeur",
    url: "https://education.github.com/pack",
    source: "education.github.com",
  },
  {
    title: "Notion — Gratuit pour les étudiants",
    description: "Accès Notion Pro entièrement gratuit avec votre adresse email étudiante.",
    category: "TECH",
    discount: "Gratuit (Pro = 10€/mois)",
    url: "https://www.notion.so/fr-fr/product/notion-for-education",
    source: "notion.so",
  },
  {
    title: "Figma — Plan Education gratuit",
    description: "Figma Professional entièrement gratuit pour les étudiants. Projets illimités, plugins, partage.",
    category: "TECH",
    discount: "Gratuit (Pro = 15€/mois)",
    url: "https://www.figma.com/fr-fr/education/",
    source: "figma.com",
  },
  {
    title: "JetBrains — Suite complète gratuite",
    description: "Tous les IDE JetBrains (IntelliJ, PyCharm, WebStorm, etc.) gratuits avec votre email étudiant.",
    category: "TECH",
    discount: "Suite à 700€/an offerte",
    url: "https://www.jetbrains.com/fr-fr/community/education/",
    source: "jetbrains.com",
  },
  {
    title: "Microsoft Office 365 — Gratuit",
    description: "Word, Excel, PowerPoint, Teams, OneDrive 1 To entièrement gratuits via votre école.",
    category: "TECH",
    discount: "Gratuit via votre école",
    url: "https://www.microsoft.com/fr-fr/education/products/office",
    source: "microsoft.com",
  },
  {
    title: "AWS Educate — 100$ de crédits",
    description: "100$ de crédits AWS + formations cloud. Idéal pour les alternants DevOps ou Data.",
    category: "TECH",
    discount: "100$ de crédits offerts",
    url: "https://aws.amazon.com/fr/education/awseducate/",
    source: "aws.amazon.com",
  },
  // Formation / Culture
  {
    title: "Pass Culture — 300€ pour les 18 ans",
    description: "300€ de crédit pour acheter des livres, aller au cinéma, concerts, ateliers. Valable jusqu'à vos 21 ans.",
    category: "FORMATION",
    discount: "300€ de crédit culturel",
    url: "https://pass.culture.fr",
    source: "pass.culture.fr",
  },
  {
    title: "Coursera / Udemy — Plans étudiants",
    description: "Coursera for Students : certifications Google, Meta, IBM à prix réduit. Udemy régulièrement à 9,99€.",
    category: "FORMATION",
    discount: "Certifications dès 9,99€",
    url: "https://www.coursera.org/for-students",
    source: "coursera.org",
  },
  {
    title: "LinkedIn Learning — 1 mois gratuit",
    description: "Accès à 20 000+ formations LinkedIn Learning. 1 mois d'essai gratuit, parfait pour booster son profil.",
    category: "FORMATION",
    discount: "1 mois offert",
    url: "https://www.linkedin.com/learning/",
    source: "linkedin.com",
  },
  {
    title: "Spotify / Deezer — Tarif étudiant",
    description: "Abonnement Premium à 5,99€/mois au lieu de 9,99€. Vérification via SheerID.",
    category: "FORMATION",
    discount: "-40% tarif étudiant",
    originalPrice: "9,99€/mois",
    finalPrice: "5,99€/mois",
    url: "https://www.spotify.com/fr/student/",
    source: "spotify.com",
  },
  // Banque
  {
    title: "Carte Étudiante des Métiers (CEM)",
    description: "Carte de réduction réservée aux apprentis. Cinéma, restaurants, transports, loisirs, shopping...",
    category: "BANQUE",
    discount: "Réductions chez +15 000 partenaires",
    url: "https://www.cem.fr",
    source: "cem.fr",
  },
  {
    title: "Boursobank / N26 — Compte gratuit",
    description: "Compte bancaire 100% en ligne, sans frais, avec carte Visa gratuite. Parfait pour les apprentis.",
    category: "BANQUE",
    discount: "0€ de frais bancaires",
    url: "https://www.boursobank.com",
    source: "boursobank.com",
  },
  // Loisirs / Sport
  {
    title: "Prime Sport (Amazon) — 2€/mois",
    description: "Ligue 1, Ligue des Champions et plus pour 2€/mois avec Amazon Prime Student.",
    category: "LOISIRS",
    discount: "2€/mois (vs 13,99€)",
    finalPrice: "2€/mois",
    url: "https://www.amazon.fr/joindre-prime",
    source: "amazon.fr",
  },
  {
    title: "Canal+ Étudiant — -50%",
    description: "Canal+, Netflix, Disney+, Paramount+ dans un seul pack à tarif étudiant.",
    category: "LOISIRS",
    discount: "Pack TV -50%",
    url: "https://www.canalplus.com/series-films/offres/canal-plus-a-la-carte/",
    source: "canalplus.com",
  },
];

// ────────────────────────────────────────────
// DATA: AIDES FINANCIÈRES
// ────────────────────────────────────────────
const aides = [
  {
    title: "Prime d'apprentissage (aide unique employeur)",
    description: "Aide financière versée à votre employeur pour vous recruter. Entre 2 000€ et 6 000€/an selon votre niveau d'études.",
    organisme: "État français",
    amount: "2 000€ à 6 000€/an",
    category: "PRIME",
    eligibility: "Tous les alternants en contrat d'apprentissage. L'aide est versée à l'employeur.",
    url: "https://www.alternance.emploi.gouv.fr/aide-unique-alternance",
  },
  {
    title: "APL — Aide Personnalisée au Logement",
    description: "Réduction directe sur votre loyer versée par la CAF. Montant variable selon vos ressources, votre loyer et votre localisation.",
    organisme: "CAF",
    amount: "50€ à 350€/mois",
    category: "LOGEMENT",
    eligibility: "Locataire d'un logement conventionné. Ressources sous un plafond. Faire la simulation sur caf.fr.",
    url: "https://www.caf.fr/allocataires/aides-et-demarches/droits-et-prestations/se-loger/l-aide-personnalisee-au-logement-apl",
  },
  {
    title: "ALS — Allocation de Logement Sociale",
    description: "Alternative à l'APL pour les logements non conventionnés. Même principe, mêmes conditions de ressources.",
    organisme: "CAF",
    amount: "30€ à 250€/mois",
    category: "LOGEMENT",
    eligibility: "Locataire d'un logement non conventionné. Ressources inférieures au plafond CAF.",
    url: "https://www.caf.fr/allocataires/aides-et-demarches/droits-et-prestations/se-loger/l-allocation-de-logement-sociale",
  },
  {
    title: "Mobili-Jeune — Action Logement",
    description: "Aide mensuelle pour les apprentis et alternants de moins de 30 ans qui louent dans le parc privé.",
    organisme: "Action Logement",
    amount: "10€ à 100€/mois",
    category: "LOGEMENT",
    eligibility: "Moins de 30 ans, contrat d'alternance ou d'apprentissage, logement en dehors du domicile des parents.",
    url: "https://www.actionlogement.fr/le-mobili-jeune",
  },
  {
    title: "Avance Loca-Pass",
    description: "Prêt sans intérêts pour financer votre dépôt de garantie. Remboursement sur 25 mois max.",
    organisme: "Action Logement",
    amount: "Jusqu'à 1 200€",
    category: "LOGEMENT",
    eligibility: "Moins de 30 ans ou salarié du secteur privé. Demande avant ou pendant les 2 mois suivant l'entrée.",
    url: "https://www.actionlogement.fr/le-loca-pass",
  },
  {
    title: "Pass Culture",
    description: "Crédit pour la culture : cinéma, livres, concerts, ateliers, abonnements culturels. Valable jusqu'à 21 ans.",
    organisme: "Ministère de la Culture",
    amount: "300€",
    category: "SOCIAL",
    eligibility: "Toute personne domiciliée en France à l'âge de 18 ans.",
    url: "https://pass.culture.fr",
  },
  {
    title: "Bourse sur critères sociaux (BCS)",
    description: "Aide mensuelle pour les étudiants en difficulté financière. 6 échelons de 0 à 5 000€/an.",
    organisme: "CROUS",
    amount: "0€ à 5 800€/an",
    category: "SOCIAL",
    eligibility: "Étudiant de moins de 28 ans. Ressources du foyer fiscal inférieures aux plafonds selon l'échelon.",
    url: "https://www.etudiant.gouv.fr/fr/bourses-et-aides/bourses-sur-criteres-sociaux-1441",
  },
  {
    title: "Aide à la mobilité internationale",
    description: "Financement d'un stage ou d'une période d'études à l'étranger dans le cadre de votre alternance.",
    organisme: "CROUS / Agence Erasmus+",
    amount: "200€ à 800€/mois",
    category: "FORMATION",
    eligibility: "Étudiant en formation supérieure, projet de mobilité internationale validé par l'établissement.",
    url: "https://www.etudiant.gouv.fr/fr/bourses-et-aides/aide-a-la-mobilite-internationale-ami-4060",
  },
  {
    title: "CEJ — Contrat d'Engagement Jeune",
    description: "Accompagnement renforcé par un conseiller + allocation mensuelle si vous cherchez encore votre alternance.",
    organisme: "France Travail / Mission Locale",
    amount: "Jusqu'à 528€/mois",
    category: "PRIME",
    eligibility: "Moins de 26 ans (29 ans si reconnu travailleur handicapé), sans emploi, peu ou pas de revenus.",
    url: "https://www.1jeune1solution.gouv.fr/contrat-engagement-jeune",
  },
  {
    title: "Prime de retour à l'emploi",
    description: "Prime unique pour les bénéficiaires du RSA reprenant une activité via l'alternance.",
    organisme: "CAF / Département",
    amount: "1 000€ unique",
    category: "PRIME",
    eligibility: "Bénéficiaire RSA depuis au moins 6 mois qui reprend une activité d'au moins 15h/semaine.",
    url: "https://www.service-public.fr/particuliers/vosdroits/F32422",
  },
];

// ────────────────────────────────────────────
// DATA: ECOLES
// ────────────────────────────────────────────
const ecoles = [
  {
    name: "EPITECH — École pour l'informatique et les nouvelles technologies",
    slug: "epitech",
    city: "Paris",
    region: "Île-de-France",
    type: "GRANDE_ECOLE",
    category: "INFORMATIQUE",
    website: "https://www.epitech.eu",
    phone: "+33 1 44 08 01 01",
    email: "admission@epitech.eu",
    description: "L'une des meilleures écoles d'informatique en France. Pédagogie par projets, forte communauté alumni, 100% alternance possible.",
    tags: JSON.stringify(["informatique", "coding", "projets", "innovation", "alternance"]),
    specialities: JSON.stringify(["Développement logiciel", "Architecture systèmes", "Intelligence artificielle", "Cybersécurité"]),
    successRate: 94.0,
    alternanceRate: 78.0,
    employmentRate: 96.0,
    avgSalary: "38 000 – 55 000 €/an",
    tuitionFee: "7 700€/an (remboursé en alternance)",
    duration: "5 ans (BAC+5)",
    levels: JSON.stringify(["BAC+3", "BAC+5"]),
    isPremium: false,
  },
  {
    name: "EFREI Paris — École d'ingénieur du numérique",
    slug: "efrei",
    city: "Villejuif",
    region: "Île-de-France",
    type: "GRANDE_ECOLE",
    category: "INFORMATIQUE",
    website: "https://www.efrei.fr",
    phone: "+33 1 46 77 46 77",
    email: "admissions@efrei.fr",
    description: "Ingénierie du numérique : développement, data, réseaux, cybersécurité. Forte présence en alternance dans les grandes entreprises.",
    tags: JSON.stringify(["ingénierie", "numérique", "data", "réseaux", "cybersécurité"]),
    specialities: JSON.stringify(["Data Science", "Cybersécurité", "Cloud Computing", "Développement web et mobile"]),
    successRate: 91.0,
    alternanceRate: 85.0,
    employmentRate: 95.0,
    avgSalary: "35 000 – 52 000 €/an",
    tuitionFee: "6 900€/an",
    duration: "3 ou 5 ans",
    levels: JSON.stringify(["BAC+3", "BAC+5"]),
    isPremium: false,
  },
  {
    name: "ESGI — École Supérieure de Génie Informatique",
    slug: "esgi",
    city: "Paris",
    region: "Île-de-France",
    type: "GRANDE_ECOLE",
    category: "INFORMATIQUE",
    website: "https://www.esgi.fr",
    phone: "+33 1 53 38 44 00",
    email: "admission@esgi.fr",
    description: "Spécialisée en développement, réseaux, cybersécurité. 90% des étudiants en alternance dès la 3ème année.",
    tags: JSON.stringify(["développement", "réseaux", "sécurité", "alternance", "entreprise"]),
    specialities: JSON.stringify(["Développement Full Stack", "Réseaux & Cybersécurité", "Big Data", "DevOps"]),
    successRate: 88.0,
    alternanceRate: 90.0,
    employmentRate: 92.0,
    avgSalary: "32 000 – 48 000 €/an",
    tuitionFee: "6 200€/an",
    duration: "3 ou 5 ans",
    levels: JSON.stringify(["BAC+2", "BAC+3", "BAC+5"]),
    isPremium: false,
  },
  {
    name: "HEC Paris",
    slug: "hec-paris",
    city: "Jouy-en-Josas",
    region: "Île-de-France",
    type: "GRANDE_ECOLE",
    category: "FINANCE",
    website: "https://www.hec.edu",
    phone: "+33 1 39 67 70 00",
    email: "admission@hec.fr",
    description: "La plus grande école de commerce française. Réseau alumni exceptionnel. Formation en management, finance, entrepreneuriat.",
    tags: JSON.stringify(["management", "finance", "entrepreneuriat", "leadership", "international"]),
    specialities: JSON.stringify(["Finance d'entreprise", "Stratégie", "Entrepreneuriat", "Marketing", "Conseil"]),
    successRate: 97.0,
    alternanceRate: 45.0,
    employmentRate: 99.0,
    avgSalary: "52 000 – 90 000 €/an",
    tuitionFee: "16 700€/an",
    duration: "3 ans (Programme Grande École)",
    levels: JSON.stringify(["BAC+5"]),
    isPremium: true,
  },
  {
    name: "ESSEC Business School",
    slug: "essec",
    city: "Cergy",
    region: "Île-de-France",
    type: "GRANDE_ECOLE",
    category: "FINANCE",
    website: "https://www.essec.edu",
    phone: "+33 1 34 43 30 00",
    email: "admissions@essec.edu",
    description: "Grande école de commerce, leader en finance et management. Programme apprentissage très développé.",
    tags: JSON.stringify(["finance", "commerce", "management", "alternance", "international"]),
    specialities: JSON.stringify(["Finance de marché", "Comptabilité", "Marketing", "Supply Chain"]),
    successRate: 96.0,
    alternanceRate: 55.0,
    employmentRate: 98.0,
    avgSalary: "48 000 – 80 000 €/an",
    tuitionFee: "15 000€/an",
    duration: "3 ans",
    levels: JSON.stringify(["BAC+5"]),
    isPremium: true,
  },
  {
    name: "INSA Lyon",
    slug: "insa-lyon",
    city: "Lyon",
    region: "Auvergne-Rhône-Alpes",
    type: "GRANDE_ECOLE",
    category: "INGENIERIE",
    website: "https://www.insa-lyon.fr",
    phone: "+33 4 72 43 83 83",
    email: "direction.formation@insa-lyon.fr",
    description: "Institut National des Sciences Appliquées. Formation d'ingénieurs généralistes et spécialisés. Fort ancrage industriel.",
    tags: JSON.stringify(["ingénierie", "informatique", "génie civil", "mécanique", "alternance"]),
    specialities: JSON.stringify(["Informatique", "Génie électrique", "Mécanique", "Biosciences", "Génie civil"]),
    successRate: 93.0,
    alternanceRate: 60.0,
    employmentRate: 97.0,
    avgSalary: "36 000 – 58 000 €/an",
    tuitionFee: "610€/an (public)",
    duration: "5 ans",
    levels: JSON.stringify(["BAC+5"]),
    isPremium: false,
  },
  {
    name: "IIM Digital School",
    slug: "iim",
    city: "Paris",
    region: "Île-de-France",
    type: "GRANDE_ECOLE",
    category: "DESIGN",
    website: "https://www.iim.fr",
    phone: "+33 1 55 26 28 28",
    email: "admission@iim.fr",
    description: "École du digital : webdesign, UX/UI, marketing digital, développement web. Forte orientation pratique.",
    tags: JSON.stringify(["digital", "webdesign", "UX", "marketing", "créativité"]),
    specialities: JSON.stringify(["UX/UI Design", "Marketing Digital", "Développement Web", "Game Design"]),
    successRate: 85.0,
    alternanceRate: 80.0,
    employmentRate: 89.0,
    avgSalary: "28 000 – 42 000 €/an",
    tuitionFee: "7 500€/an",
    duration: "3 ou 5 ans",
    levels: JSON.stringify(["BAC+3", "BAC+5"]),
    isPremium: false,
  },
  {
    name: "42 Paris",
    slug: "42-paris",
    city: "Paris",
    region: "Île-de-France",
    type: "GRANDE_ECOLE",
    category: "INFORMATIQUE",
    website: "https://42.fr",
    phone: null,
    email: "contact@42.fr",
    description: "École de coding unique au monde. Pas de cours, pas de professeurs, pédagogie par projets et peer-learning. Gratuite.",
    tags: JSON.stringify(["coding", "peer-learning", "projets", "gratuit", "innovant"]),
    specialities: JSON.stringify(["Développement C/C++", "Algorithmes", "Systèmes", "Web", "Sécurité"]),
    successRate: 82.0,
    alternanceRate: 70.0,
    employmentRate: 94.0,
    avgSalary: "36 000 – 55 000 €/an",
    tuitionFee: "Gratuit (sélection sur Piscine)",
    duration: "3 à 5 ans (libre)",
    levels: JSON.stringify(["BAC+3", "BAC+5"]),
    isPremium: false,
  },
  {
    name: "CentraleSupélec",
    slug: "centralesupelec",
    city: "Gif-sur-Yvette",
    region: "Île-de-France",
    type: "GRANDE_ECOLE",
    category: "INGENIERIE",
    website: "https://www.centralesupelec.fr",
    phone: "+33 1 69 85 10 00",
    email: "communication@centralesupelec.fr",
    description: "Parmi les meilleures grandes écoles d'ingénieurs françaises. Excellence en mathématiques, informatique, énergie.",
    tags: JSON.stringify(["ingénierie", "mathématiques", "informatique", "énergie", "recherche"]),
    specialities: JSON.stringify(["Data Science", "Intelligence Artificielle", "Énergie", "Systèmes embarqués"]),
    successRate: 98.0,
    alternanceRate: 40.0,
    employmentRate: 99.0,
    avgSalary: "45 000 – 75 000 €/an",
    tuitionFee: "610€/an (public)",
    duration: "3 ans",
    levels: JSON.stringify(["BAC+5"]),
    isPremium: true,
  },
  {
    name: "ISCOM Paris",
    slug: "iscom",
    city: "Paris",
    region: "Île-de-France",
    type: "GRANDE_ECOLE",
    category: "COMMERCE",
    website: "https://www.iscom.com",
    phone: "+33 1 55 34 44 00",
    email: "admission.paris@iscom.com",
    description: "École de communication et marketing. Formation en publicité, stratégie de marque, marketing digital.",
    tags: JSON.stringify(["communication", "marketing", "publicité", "digital", "créativité"]),
    specialities: JSON.stringify(["Marketing Digital", "Communication", "Publicité", "Brand Management", "Relations Publiques"]),
    successRate: 84.0,
    alternanceRate: 75.0,
    employmentRate: 87.0,
    avgSalary: "27 000 – 40 000 €/an",
    tuitionFee: "7 200€/an",
    duration: "3 ou 5 ans",
    levels: JSON.stringify(["BAC+3", "BAC+5"]),
    isPremium: false,
  },
];

// ────────────────────────────────────────────
// DATA: OFFRES D'ALTERNANCE
// ────────────────────────────────────────────
const offresData = [
  {
    title: "Alternant Développeur Full Stack React/Node.js",
    description: "Rejoignez notre équipe produit pour développer de nouvelles fonctionnalités sur notre plateforme SaaS. Vous travaillerez sur le frontend React et le backend Node.js, en étroite collaboration avec les PMs et designers.",
    contractType: "ALTERNANCE",
    location: "Paris 9ème",
    remote: true,
    salary: "1 600 – 1 900€/mois",
    duration: "12 mois",
    requiredLevel: "BAC+3",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "Git"],
    requiredSkills: ["React", "TypeScript", "Git"],
  },
  {
    title: "Alternant Data Scientist — NLP & Machine Learning",
    description: "Au sein de notre équipe Data, vous contribuerez à l'entraînement et l'évaluation de modèles NLP pour l'analyse de sentiments client. Python, Scikit-learn, PyTorch.",
    contractType: "ALTERNANCE",
    location: "Paris 8ème",
    remote: false,
    salary: "1 700 – 2 000€/mois",
    duration: "24 mois",
    requiredLevel: "BAC+5",
    skills: ["Python", "Machine Learning", "Pandas", "TensorFlow", "SQL Analytics"],
    requiredSkills: ["Python", "Machine Learning", "Pandas"],
  },
  {
    title: "Alternant UX/UI Designer — Design System",
    description: "Vous rejoindrez l'équipe Design pour construire et enrichir notre design system. Figma, tokens design, composants réutilisables.",
    contractType: "ALTERNANCE",
    location: "Lyon",
    remote: true,
    salary: "1 500 – 1 750€/mois",
    duration: "12 mois",
    requiredLevel: "BAC+3",
    skills: ["Figma", "UX Research", "Prototypage", "Adobe XD", "Communication"],
    requiredSkills: ["Figma", "UX Research"],
  },
  {
    title: "Alternant DevOps / Cloud Engineer AWS",
    description: "Intégrez notre équipe infrastructure pour automatiser nos pipelines CI/CD, gérer nos clusters Kubernetes sur AWS et améliorer notre observabilité.",
    contractType: "ALTERNANCE",
    location: "Grenoble",
    remote: true,
    salary: "1 750 – 2 100€/mois",
    duration: "24 mois",
    requiredLevel: "BAC+5",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Linux", "Git"],
    requiredSkills: ["Docker", "AWS", "Git"],
  },
  {
    title: "Alternant Analyste Cybersécurité — SOC",
    description: "Au sein du Security Operations Center, vous participerez à la surveillance des incidents, à l'analyse des logs via le SIEM et aux campagnes de pentest.",
    contractType: "ALTERNANCE",
    location: "Paris La Défense",
    remote: false,
    salary: "1 800 – 2 200€/mois",
    duration: "12 mois",
    requiredLevel: "BAC+3",
    skills: ["Cybersécurité", "SIEM", "Pentest", "Linux", "Python"],
    requiredSkills: ["Cybersécurité", "Linux"],
  },
  {
    title: "Alternant Product Manager — FinTech",
    description: "Définissez la roadmap de nos produits paiement avec les équipes tech et business. User stories, priorisation, tests A/B, suivi des KPIs.",
    contractType: "ALTERNANCE",
    location: "Paris",
    remote: true,
    salary: "1 800 – 2 000€/mois",
    duration: "12 mois",
    requiredLevel: "BAC+5",
    skills: ["Gestion de projet", "Agile/Scrum", "Communication", "Figma", "Leadership"],
    requiredSkills: ["Gestion de projet", "Agile/Scrum"],
  },
  {
    title: "Alternant Développeur Backend — Microservices Java",
    description: "Développez de nouveaux microservices en Java Spring Boot dans notre architecture événementielle. Tests, monitoring, documentation API.",
    contractType: "ALTERNANCE",
    location: "Nantes",
    remote: false,
    salary: "1 500 – 1 800€/mois",
    duration: "12 mois",
    requiredLevel: "BAC+3",
    skills: ["Java", "Spring Boot", "PostgreSQL", "Docker", "Git"],
    requiredSkills: ["Java", "Docker", "Git"],
  },
  {
    title: "Alternant Data Analyst — Business Intelligence",
    description: "Création de dashboards Power BI pour les équipes commerciales, analyse des données de vente, reportings automatisés.",
    contractType: "ALTERNANCE",
    location: "Toulouse",
    remote: true,
    salary: "1 400 – 1 700€/mois",
    duration: "12 mois",
    requiredLevel: "BAC+3",
    skills: ["Power BI", "SQL Analytics", "Python", "Pandas", "Communication"],
    requiredSkills: ["Power BI", "SQL Analytics"],
  },
];

// ────────────────────────────────────────────
// DATA: STUDENTS
// ────────────────────────────────────────────
const students = [
  {
    name: "Marie Dupont",
    email: "marie.dupont@email.fr",
    profile: {
      bio: "Développeuse web passionnée en 3ème année de Bachelor. J'aime créer des interfaces modernes et performantes.",
      school: "EPITECH Paris",
      company: "TechCorp France",
      position: "Développeuse Frontend",
      location: "Paris, France",
      linkedinUrl: "https://linkedin.com",
      githubUrl: "https://github.com",
    },
    skillNames: ["React", "TypeScript", "Next.js", "TailwindCSS", "Git", "Communication"],
    skillLevels: [4, 3, 3, 4, 4, 4],
    missions: [
      {
        title: "Refonte de l'interface utilisateur du dashboard",
        description: "Modernisation complète du dashboard client avec React et TailwindCSS.",
        status: "COMPLETED",
        priority: "HIGH",
        impact: "Augmentation du temps moyen de session de 35%",
        tags: JSON.stringify(["React", "UI/UX", "Performance"]),
      },
      {
        title: "Intégration API REST pour le module de paiement",
        description: "Développement des composants d'intégration avec l'API Stripe.",
        status: "COMPLETED",
        priority: "URGENT",
        impact: "Réduction du temps d'intégration de 60%",
        tags: JSON.stringify(["API", "Stripe", "React"]),
      },
      {
        title: "Développement du système de notifications temps réel",
        description: "Mise en place de WebSockets pour les notifications push.",
        status: "IN_PROGRESS",
        priority: "HIGH",
        impact: null,
        tags: JSON.stringify(["WebSocket", "React", "Node.js"]),
      },
      {
        title: "Optimisation des performances frontend",
        description: "Analyse et optimisation du bundle, lazy loading, code splitting.",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        impact: "Réduction du LCP de 2.8s à 1.2s",
        tags: JSON.stringify(["Performance", "Webpack", "React"]),
      },
    ],
    candidatures: [
      {
        company: "Figma",
        role: "Frontend Engineer (Alternance)",
        location: "Paris, France",
        status: "INTERVIEW",
        source: "LinkedIn",
        appliedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        salary: "1 800€/mois",
        url: "https://figma.com/careers",
        notes: "Entretien technique React prévu la semaine prochaine",
      },
      {
        company: "Vercel",
        role: "Developer Experience (Alternance)",
        location: "Remote",
        status: "APPLIED",
        source: "Welcome to the Jungle",
        appliedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        salary: "1 700€/mois",
        url: "https://vercel.com/careers",
        notes: "CV envoyé, en attente de réponse",
      },
      {
        company: "Doctolib",
        role: "React Developer (Alternance)",
        location: "Paris, France",
        status: "REJECTED",
        source: "Indeed",
        appliedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        notes: "Profil trop junior selon leur retour",
      },
      {
        company: "Spotify",
        role: "UI Engineer (Alternance)",
        location: "Paris, France",
        status: "WISHLIST",
        source: "LinkedIn",
        salary: "2 000€/mois",
        url: "https://spotify.com/jobs",
      },
    ],
  },
  {
    name: "Thomas Martin",
    email: "thomas.martin@email.fr",
    profile: {
      bio: "Data Scientist en formation, passionné par le ML et l'analyse de données.",
      school: "CentraleSupélec",
      company: "DataLabs Analytics",
      position: "Data Scientist Junior",
      location: "Lyon, France",
      linkedinUrl: "https://linkedin.com",
      githubUrl: "https://github.com",
    },
    skillNames: ["Python", "Machine Learning", "SQL Analytics", "Pandas", "TensorFlow", "Power BI"],
    skillLevels: [4, 3, 4, 3, 2, 3],
    missions: [
      {
        title: "Modèle de prédiction de churn client",
        description: "Développement d'un modèle ML pour prédire les clients susceptibles de résilier.",
        status: "COMPLETED",
        priority: "HIGH",
        impact: "Précision de 87%, sauvegarde estimée de 2M€/an",
        tags: JSON.stringify(["ML", "Python", "Scikit-learn"]),
      },
      {
        title: "Pipeline ETL pour l'ingestion de données",
        description: "Création d'un pipeline automatisé pour l'extraction et la transformation.",
        status: "COMPLETED",
        priority: "HIGH",
        impact: "Réduction du temps de traitement de 8h à 45min",
        tags: JSON.stringify(["ETL", "Python", "Airflow"]),
      },
      {
        title: "Dashboard analytics Power BI",
        description: "Création d'un dashboard de KPIs pour le comité de direction.",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        impact: null,
        tags: JSON.stringify(["Power BI", "Data Viz", "KPIs"]),
      },
    ],
    candidatures: [
      {
        company: "Google",
        role: "Data Analyst (Alternance)",
        location: "Paris, France",
        status: "APPLIED",
        source: "Google Careers",
        appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        salary: "2 100€/mois",
        url: "https://careers.google.com",
        notes: "Postuler aussi sur la version Zurich",
      },
      {
        company: "BNP Paribas",
        role: "Data Scientist (Alternance)",
        location: "Paris, France",
        status: "INTERVIEW",
        source: "LinkedIn",
        appliedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        salary: "1 900€/mois",
        notes: "2ème entretien RH passé. En attente décision finale.",
      },
      {
        company: "Criteo",
        role: "ML Engineer (Alternance)",
        location: "Paris, France",
        status: "OFFER",
        source: "Indeed",
        appliedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
        salary: "2 200€/mois",
        notes: "Offre reçue ! Deadline de réponse : 15 jours",
      },
    ],
  },
  {
    name: "Sophie Bernard",
    email: "sophie.bernard@email.fr",
    profile: {
      bio: "UX Designer avec une approche centrée utilisateur.",
      school: "IIM Digital School",
      company: "DesignStudio Agency",
      position: "UX/UI Designer",
      location: "Bordeaux, France",
      linkedinUrl: "https://linkedin.com",
    },
    skillNames: ["Figma", "UX Research", "Adobe XD", "Prototypage", "Communication", "Gestion de projet"],
    skillLevels: [5, 4, 3, 4, 5, 3],
    missions: [
      {
        title: "Refonte UX de l'application mobile",
        description: "Audit UX complet et refonte de l'application mobile B2C.",
        status: "COMPLETED",
        priority: "URGENT",
        impact: "Augmentation du taux de conversion de 23%",
        tags: JSON.stringify(["UX", "Mobile", "Figma"]),
      },
      {
        title: "Système de design et composants",
        description: "Création d'un design system complet avec Figma.",
        status: "IN_PROGRESS",
        priority: "HIGH",
        impact: null,
        tags: JSON.stringify(["Design System", "Figma", "Composants"]),
      },
    ],
    candidatures: [
      {
        company: "Figma",
        role: "Product Designer (Alternance)",
        location: "Paris, France",
        status: "WISHLIST",
        source: "LinkedIn",
        salary: "1 900€/mois",
      },
      {
        company: "Airbnb",
        role: "UX Designer (Alternance)",
        location: "Paris, France",
        status: "APPLIED",
        source: "Welcome to the Jungle",
        appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        salary: "2 000€/mois",
      },
    ],
  },
  {
    name: "Lucas Moreau",
    email: "lucas.moreau@email.fr",
    profile: {
      bio: "Passionné par l'infrastructure cloud et l'automatisation DevOps.",
      school: "INSA Lyon",
      company: "CloudSystems Pro",
      position: "DevOps Engineer",
      location: "Grenoble, France",
      githubUrl: "https://github.com",
    },
    skillNames: ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux", "Git"],
    skillLevels: [4, 3, 4, 4, 5, 5],
    missions: [
      {
        title: "Migration vers Kubernetes — Production",
        description: "Migration de l'infrastructure de Docker Compose vers AWS EKS.",
        status: "COMPLETED",
        priority: "URGENT",
        impact: "Réduction des coûts infra de 30%",
        tags: JSON.stringify(["Kubernetes", "AWS", "EKS"]),
      },
      {
        title: "Pipeline CI/CD avec GitHub Actions",
        description: "Mise en place de pipelines CI/CD pour automatiser les déploiements.",
        status: "COMPLETED",
        priority: "HIGH",
        impact: "Déploiements quotidiens, 0 downtime",
        tags: JSON.stringify(["CI/CD", "GitHub Actions", "DevOps"]),
      },
      {
        title: "Monitoring avec Prometheus/Grafana",
        description: "Mise en place d'une stack de monitoring complète.",
        status: "IN_PROGRESS",
        priority: "HIGH",
        impact: null,
        tags: JSON.stringify(["Monitoring", "Prometheus", "Grafana"]),
      },
    ],
    candidatures: [
      {
        company: "OVH Cloud",
        role: "DevOps Engineer (Alternance)",
        location: "Roubaix, France",
        status: "APPLIED",
        source: "OVH Careers",
        appliedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        salary: "1 800€/mois",
      },
      {
        company: "Scaleway",
        role: "Cloud Engineer (Alternance)",
        location: "Paris, France",
        status: "INTERVIEW",
        source: "LinkedIn",
        appliedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
        salary: "1 900€/mois",
        notes: "Entretien technique très bien passé",
      },
    ],
  },
  {
    name: "Emma Leroy",
    email: "emma.leroy@email.fr",
    profile: {
      bio: "Product Manager en devenir, à l'interface entre business et tech.",
      school: "HEC Paris",
      company: "StartupX",
      position: "Product Manager Junior",
      location: "Paris, France",
      linkedinUrl: "https://linkedin.com",
    },
    skillNames: ["Gestion de projet", "Agile/Scrum", "Communication", "Leadership", "Figma"],
    skillLevels: [4, 4, 5, 3, 2],
    missions: [
      {
        title: "Lancement du MVP — Feature de recherche avancée",
        description: "Définition du périmètre, coordination des équipes tech et design.",
        status: "COMPLETED",
        priority: "URGENT",
        impact: "+15% d'engagement utilisateur",
        tags: JSON.stringify(["Product", "MVP", "Agile"]),
      },
      {
        title: "Roadmap produit Q4 2024",
        description: "Priorisation des features, présentation au COMEX.",
        status: "COMPLETED",
        priority: "HIGH",
        impact: "Roadmap validée, budget alloué",
        tags: JSON.stringify(["Roadmap", "Stratégie", "B2B"]),
      },
    ],
    candidatures: [
      {
        company: "Notion",
        role: "Product Manager (Alternance)",
        location: "Paris, France",
        status: "WISHLIST",
        source: "LinkedIn",
        salary: "2 100€/mois",
      },
      {
        company: "Backmarket",
        role: "Product Analyst (Alternance)",
        location: "Paris, France",
        status: "APPLIED",
        source: "Welcome to the Jungle",
        appliedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        salary: "1 950€/mois",
      },
    ],
  },
  // 5 more students with fewer candidatures
  {
    name: "Antoine Petit",
    email: "antoine.petit@email.fr",
    profile: {
      bio: "Développeur mobile React Native.",
      school: "ESGI Paris",
      company: "MobileFirst App",
      position: "Développeur Mobile",
      location: "Nantes, France",
      githubUrl: "https://github.com",
    },
    skillNames: ["React", "TypeScript", "Node.js", "Git", "Agile/Scrum"],
    skillLevels: [4, 3, 3, 4, 3],
    missions: [
      {
        title: "Feature push notifications",
        description: "Intégration des notifications push avec Firebase Cloud Messaging.",
        status: "COMPLETED",
        priority: "HIGH",
        impact: "Augmentation du taux d'engagement de 28%",
        tags: JSON.stringify(["Mobile", "Firebase", "React Native"]),
      },
      {
        title: "Refactoring Clean Architecture",
        description: "Migration vers une Clean Architecture.",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        impact: null,
        tags: JSON.stringify(["Architecture", "React Native"]),
      },
    ],
    candidatures: [
      {
        company: "Deezer",
        role: "Mobile Developer (Alternance)",
        location: "Paris, France",
        status: "APPLIED",
        source: "LinkedIn",
        appliedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        salary: "1 750€/mois",
      },
    ],
  },
  {
    name: "Camille Roux",
    email: "camille.roux@email.fr",
    profile: {
      bio: "Développeuse backend spécialisée en microservices.",
      school: "Université Paris-Saclay",
      company: "FinTechPay",
      position: "Développeuse Backend",
      location: "Paris, France",
      githubUrl: "https://github.com",
    },
    skillNames: ["Node.js", "NestJS", "PostgreSQL", "Redis", "Docker", "TypeScript"],
    skillLevels: [4, 3, 4, 3, 4, 4],
    missions: [
      {
        title: "Architecture microservices — Service paiement",
        description: "Conception du service de paiement en microservice NestJS.",
        status: "COMPLETED",
        priority: "URGENT",
        impact: "Traitement de 10 000 transactions/jour",
        tags: JSON.stringify(["Microservices", "NestJS", "Paiement"]),
      },
      {
        title: "Mise en cache Redis",
        description: "Stratégie de cache pour l'API publique haute fréquence.",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        impact: null,
        tags: JSON.stringify(["Redis", "Cache", "API"]),
      },
    ],
    candidatures: [
      {
        company: "Stripe",
        role: "Backend Engineer (Alternance)",
        location: "Paris, France",
        status: "WISHLIST",
        source: "LinkedIn",
        salary: "2 200€/mois",
      },
    ],
  },
  {
    name: "Maxime Girard",
    email: "maxime.girard@email.fr",
    profile: {
      bio: "Étudiant en cybersécurité, spécialisé pentest.",
      school: "ENSIBS Vannes",
      company: "SecureCo",
      position: "Analyste Cybersécurité",
      location: "Rennes, France",
    },
    skillNames: ["Cybersécurité", "Pentest", "SIEM", "Linux", "Python"],
    skillLevels: [4, 3, 3, 5, 3],
    missions: [
      {
        title: "Audit de sécurité — Application web",
        description: "Pentest complet sur l'application web principale.",
        status: "COMPLETED",
        priority: "URGENT",
        impact: "15 vulnérabilités corrigées dont 3 critiques",
        tags: JSON.stringify(["Pentest", "OWASP"]),
      },
    ],
    candidatures: [
      {
        company: "Thales",
        role: "Analyste SOC (Alternance)",
        location: "Paris, France",
        status: "INTERVIEW",
        source: "Thales Careers",
        appliedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
        salary: "1 850€/mois",
        notes: "Entretien de sécurité habilitation prévu",
      },
    ],
  },
  {
    name: "Léa Dubois",
    email: "lea.dubois@email.fr",
    profile: {
      bio: "Spécialiste marketing digital, SEO et content.",
      school: "ISCOM Paris",
      company: "AgenceWeb360",
      position: "Chargée de Marketing Digital",
      location: "Marseille, France",
      linkedinUrl: "https://linkedin.com",
    },
    skillNames: ["Communication", "Gestion de projet", "Power BI", "Agile/Scrum", "Leadership"],
    skillLevels: [5, 4, 3, 3, 3],
    missions: [
      {
        title: "Stratégie SEO — refonte B2B",
        description: "Audit SEO, optimisation et netlinking.",
        status: "COMPLETED",
        priority: "HIGH",
        impact: "+180% trafic organique en 3 mois",
        tags: JSON.stringify(["SEO", "Content Marketing"]),
      },
    ],
    candidatures: [
      {
        company: "HubSpot",
        role: "Marketing Manager (Alternance)",
        location: "Paris, France",
        status: "APPLIED",
        source: "LinkedIn",
        appliedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
        salary: "1 800€/mois",
      },
    ],
  },
  {
    name: "Nicolas Robert",
    email: "nicolas.robert@email.fr",
    profile: {
      bio: "Développeur Full Stack avec appétence pour l'architecture.",
      school: "42 Paris",
      company: "Agence360",
      position: "Développeur Full Stack",
      location: "Paris, France",
      githubUrl: "https://github.com",
      linkedinUrl: "https://linkedin.com",
    },
    skillNames: ["React", "Node.js", "PostgreSQL", "Docker", "TypeScript", "Git"],
    skillLevels: [4, 4, 3, 3, 4, 5],
    missions: [
      {
        title: "Développement plateforme e-commerce",
        description: "Architecture full stack avec Next.js et Node.js.",
        status: "COMPLETED",
        priority: "HIGH",
        impact: "500 commandes/jour en production",
        tags: JSON.stringify(["Next.js", "E-commerce"]),
      },
      {
        title: "Migration PostgreSQL",
        description: "Revue du schéma de BDD et mise en place d'index.",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        impact: null,
        tags: JSON.stringify(["PostgreSQL", "Migration"]),
      },
    ],
    candidatures: [
      {
        company: "Alan",
        role: "Full Stack Engineer (Alternance)",
        location: "Paris, France",
        status: "APPLIED",
        source: "Welcome to the Jungle",
        appliedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        salary: "1 950€/mois",
      },
      {
        company: "Pennylane",
        role: "Software Engineer (Alternance)",
        location: "Paris, France",
        status: "INTERVIEW",
        source: "LinkedIn",
        appliedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        salary: "2 000€/mois",
        notes: "Très bon fit culturel, process rapide",
      },
    ],
  },
];

// ────────────────────────────────────────────
// MAIN
// ────────────────────────────────────────────
async function main() {
  console.log("🌱 Démarrage du seed AlternHub v3...\n");

  // Clean in dependency order
  await prisma.offreSkill.deleteMany();
  await prisma.offreEcole.deleteMany();
  await prisma.offre.deleteMany();
  await prisma.recruteurProfile.deleteMany();
  await prisma.careerPath.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.mission.deleteMany();
  await prisma.candidature.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.bonPlan.deleteMany();
  await prisma.aide.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.ecole.deleteMany();

  console.log("✓ Base de données nettoyée\n");

  // Skills
  console.log("📚 Création des compétences...");
  const createdSkills = await Promise.all(
    skills.map((s) => prisma.skill.create({ data: s }))
  );
  console.log(`✓ ${createdSkills.length} compétences\n`);

  // Bons plans
  console.log("💰 Injection des bons plans...");
  await prisma.bonPlan.createMany({ data: bonsPlans });
  console.log(`✓ ${bonsPlans.length} bons plans\n`);

  // Aides
  console.log("🏦 Injection des aides financières...");
  await prisma.aide.createMany({ data: aides });
  console.log(`✓ ${aides.length} aides\n`);

  // Admin
  // Build skill map for later use
  const skillMap = Object.fromEntries(createdSkills.map((s) => [s.name, s]));

  // Ecoles
  console.log("🎓 Création des écoles...");
  const createdEcoles = await Promise.all(
    ecoles.map((e) => prisma.ecole.create({ data: e }))
  );
  console.log(`✓ ${createdEcoles.length} écoles\n`);

  console.log("🛡️  Création admin...");
  const adminPassword = await bcrypt.hash("Admin1234!", 12);
  await prisma.user.create({
    data: {
      name: "Admin AlternHub",
      email: "admin@alternhub.fr",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("✓ admin@alternhub.fr / Admin1234!\n");

  // Recruiter
  console.log("🏢 Création du recruteur démo...");
  const recruteurPassword = await bcrypt.hash("Recruteur1234!", 12);
  const recruteurUser = await prisma.user.create({
    data: {
      name: "Sophie Lecomte",
      email: "recruteur@techcorp.fr",
      password: recruteurPassword,
      role: "RECRUTEUR",
      subscriptionTier: "PRO",
      recruteurProfile: {
        create: {
          companyName: "TechCorp France",
          companySize: "201-500",
          industry: "Tech / Numérique",
          companyWebsite: "https://techcorp.fr",
          phone: "+33 1 23 45 67 89",
          location: "Paris, France",
          bio: "TechCorp France est une scale-up tech spécialisée en SaaS B2B. Nous recrutons des alternants passionnés pour rejoindre nos équipes produit et engineering.",
          offreQuota: 20,
          cvViewQuota: 100,
        },
      },
    },
  });
  console.log("✓ recruteur@techcorp.fr / Recruteur1234!\n");

  // Offres
  console.log("📋 Création des offres d'alternance...");
  for (const offre of offresData) {
    const createdOffre = await prisma.offre.create({
      data: {
        recruteurId: recruteurUser.id,
        title: offre.title,
        description: offre.description,
        contractType: offre.contractType,
        location: offre.location,
        remote: offre.remote,
        salary: offre.salary,
        duration: offre.duration,
        requiredLevel: offre.requiredLevel,
        status: "PUBLISHED",
        viewCount: Math.floor(Math.random() * 150) + 10,
        startDate: new Date("2025-09-01"),
      },
    });

    // Attach skills
    for (const skillName of offre.skills) {
      const skill = skillMap[skillName];
      if (skill) {
        await prisma.offreSkill.create({
          data: {
            offreId: createdOffre.id,
            skillId: skill.id,
            required: offre.requiredSkills.includes(skillName),
            weight: offre.requiredSkills.includes(skillName) ? 3 : 1,
          },
        });
      }
    }

    console.log(`  ✓ ${offre.title.substring(0, 60)}...`);
  }
  console.log(`✓ ${offresData.length} offres publiées\n`);

  // Students
  console.log("👨‍🎓 Création des étudiants...");
  const studentPassword = await bcrypt.hash("Student1234!", 12);
  const now = new Date();
  let totalMissions = 0;
  let totalCandidatures = 0;

  for (const student of students) {
    const user = await prisma.user.create({
      data: {
        name: student.name,
        email: student.email,
        password: studentPassword,
        role: "STUDENT",
        profile: {
          create: {
            bio: student.profile.bio,
            school: student.profile.school,
            company: student.profile.company,
            position: student.profile.position,
            location: student.profile.location ?? null,
            linkedinUrl: (student.profile as { linkedinUrl?: string }).linkedinUrl ?? null,
            githubUrl: (student.profile as { githubUrl?: string }).githubUrl ?? null,
            startDate: new Date("2024-09-01"),
            endDate: new Date("2025-08-31"),
          },
        },
      },
    });

    // Skills
    for (let i = 0; i < student.skillNames.length; i++) {
      const skill = skillMap[student.skillNames[i]];
      if (skill) {
        await prisma.userSkill.create({
          data: { userId: user.id, skillId: skill.id, level: student.skillLevels[i] },
        });
      }
    }

    // Missions
    for (const m of student.missions) {
      const daysAgo = Math.floor(Math.random() * 60);
      const createdAt = new Date(now);
      createdAt.setDate(createdAt.getDate() - daysAgo);
      await prisma.mission.create({
        data: {
          userId: user.id,
          title: m.title,
          description: m.description,
          status: m.status,
          priority: m.priority,
          impact: m.impact,
          tags: m.tags,
          createdAt,
          updatedAt: createdAt,
        },
      });
      totalMissions++;
    }

    // Candidatures
    for (const c of (student as { candidatures?: typeof students[0]["candidatures"] }).candidatures ?? []) {
      await prisma.candidature.create({
        data: {
          userId: user.id,
          company: c.company,
          role: c.role,
          location: c.location ?? null,
          status: c.status,
          source: c.source ?? null,
          appliedAt: (c as { appliedAt?: Date }).appliedAt ?? null,
          salary: (c as { salary?: string }).salary ?? null,
          url: (c as { url?: string }).url ?? null,
          notes: (c as { notes?: string }).notes ?? null,
          lastActionAt: (c as { appliedAt?: Date }).appliedAt ?? now,
        },
      });
      totalCandidatures++;
    }

    console.log(
      `  ✓ ${student.name} (${student.missions.length} missions, ${(student as { candidatures?: unknown[] }).candidatures?.length ?? 0} candidatures)`
    );
  }

  console.log(`\n✅ Seed terminé !`);
  console.log(`\n📊 Résumé :`);
  console.log(`  - 1 admin + 1 recruteur (TechCorp) + ${students.length} étudiants`);
  console.log(`  - ${totalMissions} missions · ${totalCandidatures} candidatures`);
  console.log(`  - ${offresData.length} offres d'alternance publiées`);
  console.log(`  - ${createdEcoles.length} écoles référencées`);
  console.log(`  - ${bonsPlans.length} bons plans · ${aides.length} aides financières`);
  console.log(`  - ${createdSkills.length} compétences`);
  console.log(`\n🔑 Comptes démo :`);
  console.log(`  admin@alternhub.fr      / Admin1234!`);
  console.log(`  recruteur@techcorp.fr   / Recruteur1234!`);
  console.log(`  marie.dupont@email.fr   / Student1234!`);
  console.log(`\n🚀 npm run dev → http://localhost:3000`);
}

main()
  .catch((e) => { console.error("❌", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
