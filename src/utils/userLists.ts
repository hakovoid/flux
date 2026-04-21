type ListKey = 'favorites' | 'read-later';
const STORAGE_PREFIX = 'flux-';

// Type for read-later items
interface ReadLaterItem {
  id: string;
  addedAt: number;
}

export function getList(key: ListKey): string[] | ReadLaterItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_PREFIX + key);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
}

export function setList(key: ListKey, items: string[] | ReadLaterItem[]): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(items));
  } catch (e) {
    // Silently fail if localStorage is unavailable
  }
}

export function toggle(key: ListKey, id: string): boolean {
  if (key === 'read-later') {
    // Handle read-later with timestamps
    const list = getList(key) as ReadLaterItem[];
    const index = list.findIndex(item => item.id === id);
    if (index === -1) {
      // Add new item with timestamp
      list.push({ id, addedAt: Date.now() });
      setList(key, list);
      return true;
    } else {
      // Remove existing item
      list.splice(index, 1);
      setList(key, list);
      return false;
    }
  } else {
    // Handle favorites (simple string array)
    const list = getList(key) as string[];
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
}

export function has(key: ListKey, id: string): boolean {
  if (key === 'read-later') {
    const list = getList(key) as ReadLaterItem[];
    return list.some(item => item.id === id);
  } else {
    return (getList(key) as string[]).includes(id);
  }
}

export function count(key: ListKey): number {
  if (key === 'read-later') {
    return (getList(key) as ReadLaterItem[]).length;
  } else {
    return (getList(key) as string[]).length;
  }
}

// Special function for read-later to get sorted items by addedAt
export function getReadLaterSorted(): ReadLaterItem[] {
  const list = getList('read-later') as ReadLaterItem[];
  return [...list].sort((a, b) => b.addedAt - a.addedAt);
}

// Special function to remove an item from read-later
export function removeFromReadLater(id: string): void {
  const list = getList('read-later') as ReadLaterItem[];
  const filtered = list.filter(item => item.id !== id);
  setList('read-later', filtered);
}