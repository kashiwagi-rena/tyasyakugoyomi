export type NamingRecord = {
  date: string
  name: string
  reason: string
}

const KEY = 'tyasyakugoyomi_namings'

export function getNamings(): NamingRecord[] {
  const raw = localStorage.getItem(KEY)
  return raw ? JSON.parse(raw) : []
}

export function saveNaming(record: NamingRecord): void {
  const records = getNamings().filter((r) => r.date !== record.date)
  localStorage.setItem(KEY, JSON.stringify([record, ...records]))
}

export function deleteNaming(date: string): void {
  const records = getNamings().filter((r) => r.date !== date)
  localStorage.setItem(KEY, JSON.stringify(records))
}
