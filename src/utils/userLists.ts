type ListKey = 'favorites' | 'read-later';
const STORAGE_PREFIX = 'flux-';

export function getList(key: ListKey): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_PREFIX + key);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
}

export function setList(key: ListKey, ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(ids));
  } catch (e) {
    // Silently fail if localStorage is unavailable
  }
}

export function toggle(key: ListKey, id: string): boolean {
  const list = getList(key);
  const index = list.indexOf(id);
  if (index === -1) {
    list.push(id);
    setList(key, list);
    return true;
  } else {
    list.splice(index, 1);
    setList(key, list);
    return false;
  }
}

export function has(key: ListKey, id: string): boolean {
  return getList(key).includes(id);
}

export function count(key: ListKey): number {
  return getList(key).length;
}