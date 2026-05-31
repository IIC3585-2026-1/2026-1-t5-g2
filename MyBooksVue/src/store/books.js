import { defineStore } from 'pinia'

const STORAGE_KEY = 'mybooks-vue-books'

function loadBooks() {
    if (typeof window === 'undefined') return []
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        const books = raw ? JSON.parse(raw) : []
        if (Array.isArray(books)) {
            return books
        }
    } catch (e) {
        console.warn('Error leyendo libros de localStorage', e)
    }
    return []
}

function saveBooks(books) {
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(books))
    } catch (e) {
        console.warn('Error guardando libros en localStorage', e)
    }
}

let idCounter = Math.max(Date.now(), ...loadBooks().map((book) => book.id || 0))

export const useBooksStore = defineStore('books', {
    state: () => ({ books: loadBooks() }),
    actions: {
        addBook(payload) {
            this.books.push({
                id: ++idCounter,
                title: payload.title,
                authors: payload.authors || [],
                status: payload.status || 'to-read',
                year: payload.year || null,
                cover: payload.cover || null,
                description: payload.description || null,
            })
            saveBooks(this.books)
        },
        removeBook(id) {
            this.books = this.books.filter((b) => b.id !== id)
            saveBooks(this.books)
        },
        updateStatus(id, status) {
            const b = this.books.find((x) => x.id === id)
            if (b) {
                b.status = status
                saveBooks(this.books)
            }
        },
    },
})
