import { parts, scenes, topics, translations } from '@/data/vitrine'
import type { LanguageCode, Part, Scene, Topic, Translation } from './types'

export function getTopics(): Topic[] {
  return topics
}

export function getTopicBySlug(topicSlug: string): Topic | undefined {
  return topics.find((t) => t.slug === topicSlug)
}

export function getScenesByTopicSlug(topicSlug: string): Scene[] {
  const topic = getTopicBySlug(topicSlug)
  if (!topic) return []
  return scenes.filter((s) => s.topicId === topic.id)
}

export function getSceneBySlug(topicSlug: string, sceneSlug: string): Scene | undefined {
  const topic = getTopicBySlug(topicSlug)
  if (!topic) return undefined
  return scenes.find((s) => s.topicId === topic.id && s.slug === sceneSlug)
}

export function getPartsByScene(sceneId: string): Part[] {
  return parts.filter((p) => p.sceneId === sceneId)
}

export function getTranslationsByPart(partId: string): Translation[] {
  return translations.filter((t) => t.partId === partId)
}

export function getWord(partId: string, language: LanguageCode): string {
  const t = translations.find((tr) => tr.partId === partId && tr.languageCode === language)
  return t?.word ?? ''
}

export interface ProgressStat {
  learned: number
  total: number
  percent: number
}

function toProgress(learnedCount: number, total: number): ProgressStat {
  return { learned: learnedCount, total, percent: total > 0 ? Math.round((learnedCount / total) * 100) : 0 }
}

export function getSceneProgress(sceneId: string, learnedPartIds: ReadonlySet<string>): ProgressStat {
  const sceneParts = getPartsByScene(sceneId)
  const learned = sceneParts.filter((p) => learnedPartIds.has(p.id)).length
  return toProgress(learned, sceneParts.length)
}

export function getTopicProgress(topicSlug: string, learnedPartIds: ReadonlySet<string>): ProgressStat {
  const topicScenes = getScenesByTopicSlug(topicSlug)
  const topicParts = topicScenes.flatMap((s) => getPartsByScene(s.id))
  const learned = topicParts.filter((p) => learnedPartIds.has(p.id)).length
  return toProgress(learned, topicParts.length)
}

export function getOverallProgress(learnedPartIds: ReadonlySet<string>): ProgressStat {
  return toProgress(learnedPartIds.size, parts.length)
}
