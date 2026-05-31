const BASE = 'https://openlibrary.org'

function coverUrlFromDoc(d) {
    if (d.cover_i) return `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg`
    if (d.isbn && d.isbn.length > 0) return `https://covers.openlibrary.org/b/isbn/${d.isbn[0]}-M.jpg`
    if (d.cover_edition_key) return `https://covers.openlibrary.org/b/olid/${d.cover_edition_key}-M.jpg`
    return null
}

async function fetchWorkDescription(workKey) {
    try {
        const res = await fetch(`${BASE}${workKey}.json`)
        if (!res.ok) return null
        const j = await res.json()
        if (j.description) return typeof j.description === 'string' ? j.description : j.description.value
        return null
    } catch (e) { return null }
}

export async function fetchByQuery(q) {
    try {
        const isIsbn = /^(97(8|9))?\d{9}(\d|X)$/.test(q.replace(/[- ]/g, ''))
        if (isIsbn) {
            // try ISBN -> edition
            const res = await fetch(`${BASE}/isbn/${q}.json`)
            if (res.ok) {
                const data = await res.json()
                return {
                    title: data.title,
                    authors: (data.authors || []).map(a => a.name).filter(Boolean),
                    year: data.publish_date,
                    cover: data.covers && data.covers.length > 0 ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-M.jpg` : null,
                    olid: data.key || null,
                }
            }
        }

        const s = encodeURIComponent(q)
        const res = await fetch(`${BASE}/search.json?q=${s}&limit=1`)
        if (!res.ok) return null
        const j = await res.json()
        if (j.docs && j.docs.length > 0) {
            const d = j.docs[0]
            const cover = coverUrlFromDoc(d)
            const description = d.key ? await fetchWorkDescription(d.key) : null
            return { title: d.title, authors: d.author_name || [], year: d.first_publish_year, cover, description, workKey: d.key }
        }
        return null
    } catch (e) { console.warn(e); return null }
}

export function getCoverUrlFromBook(book) {
    if (!book) return null
    if (book.cover) return book.cover
    if (book.isbn && book.isbn.length > 0) return `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-M.jpg`
    return null
}

