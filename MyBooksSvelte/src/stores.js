import { writable } from 'svelte/store'

let idCounter = Date.now()
export const books = writable([])

export function addBook(payload) {
    books.update(b => [...b, { id: ++idCounter, title: payload.title, authors: payload.authors || [], status: payload.status || 'to-read' }])
}
export function removeBook(id) { books.update(b => b.filter(x => x.id !== id)) }
export function updateStatus(id, status) { books.update(b => { b.forEach(x => { if (x.id === id) x.status = status }); return b }) }
