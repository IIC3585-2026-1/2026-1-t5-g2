<script>
  import BookList from './components/BookList.svelte'
  import BookForm from './components/BookForm.svelte'
  import { books, addBook, removeBook, updateStatus } from './stores'
  import { derived, writable } from 'svelte/store'

  const filter = writable('all')
  const filtered = derived([books, filter], ([$books, $filter]) => {
    if ($filter === 'all') return $books
    return $books.filter((b) => b.status === $filter)
  })

  function handleAdd(book) {
    addBook(book)
  }

  function handleRemove(id) {
    removeBook(id)
  }

  function handleToggle(id, status) {
    updateStatus(id, status)
  }
</script>

<div class="app">
  <div class="header">
    <h1>MyBooks (Svelte)</h1>
    <div>
      <select bind:value={$filter}>
        <option value="all">Todos</option>
        <option value="read">Leídos</option>
        <option value="recommended">Recomendados</option>
        <option value="to-read">Por leer</option>
      </select>
    </div>
  </div>
  <div class="grid">
    <div>
      <BookList {filtered} on:remove={(e) => handleRemove(e.detail)} on:toggle={(e) => handleToggle(e.detail.id, e.detail.status)} />
    </div>
    <div>
      <BookForm on:add={(e) => handleAdd(e.detail)} />
    </div>
  </div>
</div>
