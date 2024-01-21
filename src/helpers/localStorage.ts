export function saveItem(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function loadItem(key: string) {
  const data = localStorage.getItem(key)
  if (typeof data !== 'string') return null
  return JSON.parse(data)
}