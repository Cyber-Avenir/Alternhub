/**
 * AlternHub Matching Engine
 * Computes a 0–100 compatibility score between a student's skills
 * and a job offer's required skills.
 *
 * Algorithm: weighted intersection score with penalty for missing required skills.
 */

export interface StudentSkill {
  skillId: string;
  level: number; // 1-5
}

export interface OffreRequirement {
  skillId: string;
  required: boolean;
  weight: number; // 1-3 (1=nice-to-have, 2=important, 3=critical)
}

export function computeMatchScore(
  userSkills: StudentSkill[],
  offreSkills: OffreRequirement[]
): number {
  if (offreSkills.length === 0) return 0;

  const skillMap = new Map(userSkills.map((s) => [s.skillId, s.level]));

  // Max possible weighted score (if student had level 5 on every required skill)
  const MAX_LEVEL = 5;
  const weightedTotal = offreSkills.reduce((sum, req) => sum + req.weight * MAX_LEVEL, 0);

  if (weightedTotal === 0) return 0;

  // Compute matched score
  let weightedMatched = 0;
  let missingRequired = 0;

  for (const req of offreSkills) {
    const studentLevel = skillMap.get(req.skillId) ?? 0;
    if (studentLevel > 0) {
      weightedMatched += req.weight * studentLevel;
    } else if (req.required) {
      missingRequired++;
    }
  }

  // Base percentage
  let score = (weightedMatched / weightedTotal) * 100;

  // Penalty for each missing required skill (-12 pts per missing, max 3 penalties)
  const penalties = Math.min(missingRequired, 3);
  score = score * Math.pow(0.88, penalties);

  return Math.round(Math.min(Math.max(score, 0), 100));
}

/**
 * Returns a color class and label for a match score.
 */
export function getMatchLabel(score: number): { label: string; color: string; bg: string; dot: string } {
  if (score >= 80) return { label: "Excellent match", color: "text-green-700", bg: "bg-green-100", dot: "bg-green-500" };
  if (score >= 60) return { label: "Bon match",       color: "text-blue-700",  bg: "bg-blue-100",  dot: "bg-blue-500" };
  if (score >= 40) return { label: "Match moyen",     color: "text-amber-700", bg: "bg-amber-100", dot: "bg-amber-500" };
  return               { label: "Faible match",       color: "text-slate-600", bg: "bg-slate-100", dot: "bg-slate-400" };
}

/**
 * Computes match scores for a list of offres against a student's skills.
 * Returns the list sorted by score descending.
 */
export function rankOffresForStudent<T extends { id: string; skills: OffreRequirement[] }>(
  offres: T[],
  userSkills: StudentSkill[]
): (T & { matchScore: number })[] {
  return offres
    .map((offre) => ({
      ...offre,
      matchScore: computeMatchScore(userSkills, offre.skills),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Computes match scores for a list of students against an offre's requirements.
 * Returns sorted by score descending.
 */
export function rankStudentsForOffre<T extends { id: string; skills: StudentSkill[] }>(
  students: T[],
  offreSkills: OffreRequirement[]
): (T & { matchScore: number })[] {
  return students
    .map((student) => ({
      ...student,
      matchScore: computeMatchScore(student.skills, offreSkills),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
}
