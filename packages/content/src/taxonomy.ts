export const TRACK_LABELS: Record<string, string> = {
  'ai-engineering': 'AI Engineering',
  'english-for-tech': 'English for Tech',
  'leadership-and-delivery': 'Leadership and Delivery',
  programming: 'Programming',
  systems: 'Systems and Architecture',
}

export const TOPIC_LABELS: Record<string, string> = {
  'ai-engineering': 'AI Engineering',
  'coding-interview': 'Coding Challenges',
  delivery: 'Delivery',
  javascript: 'JavaScript',
  leadership: 'Leadership',
  node: 'Node',
  react: 'React',
  'system-design': 'System Design',
  'tech-english': 'Tech English',
}

export function getTrackLabel(track: string): string {
  return TRACK_LABELS[track] ?? track
}

export function getTopicLabel(topic: string): string {
  return TOPIC_LABELS[topic] ?? topic
}
