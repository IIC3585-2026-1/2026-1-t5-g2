<script>
  import { createEventDispatcher } from 'svelte'
  export let filtered
  const dispatch = createEventDispatcher()

  function remove(id) {
    dispatch('remove', id)
  }

  function toggle(id, status) {
    dispatch('toggle', { id, status })
  }
</script>

{#if $filtered && $filtered.length > 0}
  {#each $filtered as book (book.id)}
    <div class="book">
      <div style="display:flex; justify-content:space-between; gap:12px; align-items:center">
        <div style="display:flex; gap:12px; align-items:center">
          {#if book.cover}
            <img src={book.cover} alt="cover" width="64" />
          {/if}
          <div>
            <strong>{book.title}</strong>
            <div class="meta">{book.authors ? book.authors.join(', ') : ''} — {book.year || ''}</div>
          </div>
        </div>
        <div class="controls">
          <select value={book.status} on:change={(e) => toggle(book.id, e.target.value)}>
            <option value="read">Leído</option>
            <option value="recommended">Recomendado</option>
            <option value="to-read">Por leer</option>
          </select>
          <button on:click={() => remove(book.id)}>Eliminar</button>
        </div>
      </div>
    </div>
  {/each}
{:else}
  <div>No hay libros en esta lista.</div>
{/if}
