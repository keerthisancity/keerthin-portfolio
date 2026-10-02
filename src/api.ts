import type { Achievement, Bio, Education, Experience, Project, Skill } from './types'
import portfolioData from './data/portfolioData.json'

const data = portfolioData as {
  bio: Bio
  skills: Skill[]
  experience: Experience[]
  education: Education[]
  projects: Project[]
  achievements: Achievement[]
}

const resolve = <T>(value: T) => Promise.resolve(value)

const companyLogo = (company: string) => {
  const normalized = company.toLowerCase()
  if (normalized.includes('grant thornton')) return `${import.meta.env.BASE_URL}logos/grant-thornton.png`
  if (normalized.includes('d2l')) return `${import.meta.env.BASE_URL}logos/d2l.png`
  if (normalized.includes('neory')) return `${import.meta.env.BASE_URL}logos/neory.png`
  return undefined
}

export const getBio = () => resolve(data.bio)

export const getSkills = () => resolve(data.skills)

export const getExperience = () => resolve(data.experience.map((item, index) => ({
  ...item,
  id: item.id ?? index + 1,
  logoUrl: item.company ? companyLogo(item.company) : undefined,
})))

export const getEducation = () => resolve(data.education)

export const getProjects = () => resolve(data.projects)

export const getAchievements = () => resolve(data.achievements)

