export function save<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function load<T>(key: string, defaultValue: T): T {
  const data = localStorage.getItem(key);

  if (!data) return defaultValue;

  try {
    return JSON.parse(data);
  } catch {
    return defaultValue;
  }
}