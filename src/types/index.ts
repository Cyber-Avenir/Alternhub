export type Role = "STUDENT" | "ADMIN" | "MENTOR";
export type MissionStatus = "TODO" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface UserWithProfile {
  id: string;
  name: string | null;
  email: string;
  role: string;
  image: string | null;
  createdAt: Date;
  profile: {
    school: string | null;
    company: string | null;
    position: string | null;
    location: string | null;
  } | null;
  _count?: {
    missions: number;
    skills: number;
  };
}

export interface MissionWithUser {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  startDate: Date | null;
  endDate: Date | null;
  impact: string | null;
  tags: string;
  createdAt: Date;
  user?: {
    name: string | null;
    email: string;
  };
}

export interface SkillWithLevel {
  id: string;
  skillId: string;
  level: number;
  skill: {
    id: string;
    name: string;
    category: string;
  };
}

export interface DashboardStats {
  totalMissions: number;
  completedMissions: number;
  inProgressMissions: number;
  skillCount: number;
  score: number;
}

export interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalAdmins: number;
  totalMissions: number;
  completedMissions: number;
  newUsersThisMonth: number;
}
