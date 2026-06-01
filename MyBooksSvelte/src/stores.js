import { writable } from 'svelte/store'

const STORAGE_KEY = 'mybooks-svelte-books'

function loadBooks() {
    if (typeof window === 'undefined') return []
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        const books = raw ? JSON.parse(raw) : []
        return Array.isArray(books) ? books : []
    } catch (error) {
        console.warn('Error leyendo libros de localStorage', error)
        return []
    }
}

function saveBooks(books) {
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(books))
    } catch (error) {
        console.warn('Error guardando libros en localStorage', error)
    }
}

const initialBooks = loadBooks()
let idCounter = Math.max(Date.now(), ...initialBooks.map((book) => book.id || 0))
export const books = writable(initialBooks)

export function addBook(payload) {
    books.update((current) => {
        const next = [
            ...current,
            {
                id: ++idCounter,
                title: payload.title,
                authors: payload.authors || [],
                status: payload.status || 'to-read',
                year: payload.year || null,
                cover: payload.cover || null,
                description: payload.description || null,
            },
        ]
        saveBooks(next)
        return next
    })
}

export function removeBook(id) {
    books.update((current) => {
        const next = current.filter((book) => book.id !== id)
        saveBooks(next)
        return next
    })
}

export function updateStatus(id, status) {
    books.update((current) => {
        const next = current.map((book) => (book.id === id ? { ...book, status } : book))
        saveBooks(next)
        return next
    })
}
