const BASE = 'https://openlibrary.org'

function coverUrlFromDoc(doc) {
    if (doc.cover_i) return `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
    if (doc.isbn && doc.isbn.length > 0) return `https://covers.openlibrary.org/b/isbn/${doc.isbn[0]}-M.jpg`
    if (doc.cover_edition_key) return `https://covers.openlibrary.org/b/olid/${doc.cover_edition_key}-M.jpg`
    return null
}

async function fetchWorkDescription(workKey) {
    if (!workKey) return null
    try {
        const res = await fetch(`${BASE}${workKey}.json`)
        if (!res.ok) return null
        const json = await res.json()
        if (!json.description) return null
        return typeof json.description === 'string' ? json.description : json.description.value
    } catch (error) {
        return null
    }
}

export async function fetchByQuery(q) {
    try {
        const isIsbn = /^(97(8|9))?\d{9}(\d|X)$/.test(q.replace(/[- ]/g, ''))
        if (isIsbn) {
            const res = await fetch(`${BASE}/isbn/${q}.json`)
            if (res.ok) {
                const data = await res.json()
                return {
                    title: data.title,
                    authors: (data.authors || []).map((a) => a.name).filter(Boolean),
                    year: data.publish_date,
                    cover: data.covers && data.covers.length > 0 ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-M.jpg` : null,
                    description: null,
                }
            }
        }

        const s = encodeURIComponent(q)
        const res = await fetch(`${BASE}/search.json?q=${s}&limit=1`)
        if (!res.ok) return null
        const data = await res.json()
        if (data.docs && data.docs.length > 0) {
            const doc = data.docs[0]
            const cover = coverUrlFromDoc(doc)
            const description = doc.key ? await fetchWorkDescription(doc.key) : null
            return {
                title: doc.title,
                authors: doc.author_name || [],
                year: doc.first_publish_year,
                cover,
                description,
            }
        }
        return null
    } catch (error) {
        console.warn(error)
        return null
    }
}
