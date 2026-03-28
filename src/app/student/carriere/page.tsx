import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CarriereClient } from "./CarriereClient";

export const metadata = { title: "Ma Carrière" };

// Career KPI data seeded globally (would come from DB in production)
const CAREER_PATHS = [
  {
    id: "dev-fullstack",
    name: "Développeur Full Stack",
    icon: "💻",
    avgSalary: "35 000 – 55 000 €/an",
    successRate: 89,
    timeToJob: "2,3 mois",
    keySkills: ["React", "Node.js", "TypeScript", "SQL", "Git", "Docker"],
    topCompanies: ["Capgemini", "Sopra Steria", "Thales", "BNP Paribas", "SNCF"],
    testimonials: [
      { name: "Marie L.", school: "EPITA", text: "Mon alternance chez Société Générale m'a permis de trouver un CDI en 1 semaine après le diplôme.", role: "Dev Senior @ SG" },
      { name: "Thomas R.", school: "EFREI", text: "Les compétences cloud sont clés. Certifie-toi AWS ou Azure avant de chercher.", role: "Tech Lead @ OVHcloud" },
    ],
  },
  {
    id: "data-scientist",
    name: "Data Scientist / Analyste",
    icon: "📊",
    avgSalary: "38 000 – 58 000 €/an",
    successRate: 82,
    timeToJob: "2,8 mois",
    keySkills: ["Python", "SQL", "Machine Learning", "Pandas", "Power BI", "Statistics"],
    topCompanies: ["L'Oréal", "LVMH", "Crédit Agricole", "Engie", "Airbus"],
    testimonials: [
      { name: "Camille D.", school: "Mines ParisTech", text: "La data en finance est énorme. Maîtriser Spark + Python m'a ouvert toutes les portes.", role: "Data Analyst @ AXA" },
    ],
  },
  {
    id: "finance-trader",
    name: "Finance / Trading",
    icon: "📈",
    avgSalary: "45 000 – 90 000 €/an",
    successRate: 64,
    timeToJob: "4,1 mois",
    keySkills: ["Excel avancé", "VBA", "Python", "Bloomberg", "Marchés financiers", "Analyse quantitative"],
    topCompanies: ["BNP Paribas CIB", "Société Générale Markets", "Goldman Sachs", "JPMorgan", "Natixis"],
    testimonials: [
      { name: "Alexis M.", school: "ESSEC", text: "La sélectivité est élevée. Le networking et les stages de 3ème année sont décisifs.", role: "Trader Desk Taux @ BNP" },
      { name: "Sophie K.", school: "HEC Paris", text: "Prends des certifications CFA dès que possible. Ça fait vraiment la différence.", role: "Analyst @ Goldman Sachs" },
    ],
  },
  {
    id: "product-manager",
    name: "Product Manager",
    icon: "🎯",
    avgSalary: "40 000 – 65 000 €/an",
    successRate: 78,
    timeToJob: "3,2 mois",
    keySkills: ["Agile / Scrum", "User Research", "Figma", "SQL", "Analytics", "Communication"],
    topCompanies: ["Doctolib", "ManoMano", "Contentsquare", "Veepee", "Leboncoin"],
    testimonials: [
      { name: "Julie T.", school: "Sciences Po", text: "La compréhension des données + le sens produit est le combo gagnant en 2024.", role: "PM @ Doctolib" },
    ],
  },
  {
    id: "cybersecurity",
    name: "Cybersécurité",
    icon: "🔒",
    avgSalary: "42 000 – 70 000 €/an",
    successRate: 92,
    timeToJob: "1,8 mois",
    keySkills: ["Pentesting", "SIEM", "Linux", "Python", "Réseaux", "ISO 27001"],
    topCompanies: ["Thales", "Airbus CyberSecurity", "Orange Cyberdefense", "Capgemini", "ANSSI"],
    testimonials: [
      { name: "Rayan B.", school: "EPITA", text: "La demande est folle. J'ai reçu 3 offres avant même d'avoir fini mon alternance.", role: "SecOps @ Orange Cyberdefense" },
    ],
  },
];

export default async function CarrierePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  const userId = session.user.id!;

  const [careerPaths, userSkills, candidatures, missions] = await Promise.all([
    prisma.careerPath.findMany({
      where: { userId },
      orderBy: { startDate: "desc" },
    }),
    prisma.userSkill.findMany({
      where: { userId },
      include: { skill: true },
    }),
    prisma.candidature.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.mission.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <CarriereClient
      careerPaths={careerPaths}
      userSkills={userSkills}
      candidatures={candidatures}
      missions={missions}
      careerData={CAREER_PATHS}
    />
  );
}
