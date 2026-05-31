const BASE = 'https://openlibrary.org'

export async function fetchByQuery(q) {
    try {
        const isIsbn = /^(97(8|9))?\d{9}(\d|X)$/.test(q.replace(/[- ]/g, ''))
        if (isIsbn) {
            const res = await fetch(`${BASE}/isbn/${q}.json`)
            if (res.ok) {
                const data = await res.json()
                return { title: data.title, authors: (data.authors || []).map(a => a.name).filter(Boolean), year: data.publish_date }
            }
        }
        const s = encodeURIComponent(q)
        const res = await fetch(`${BASE}/search.json?q=${s}&limit=1`)
        if (!res.ok) return null
        const j = await res.json()
        if (j.docs && j.docs.length > 0) {
            const d = j.docs[0]
            return { title: d.title, authors: d.author_name || [], year: d.first_publish_year }
        }
        return null
    } catch (e) { console.warn(e); return null }
}
