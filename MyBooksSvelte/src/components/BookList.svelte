<script>
  import { createEventDispatcher } from 'svelte'
  export let filtered
  const dispatch = createEventDispatcher()
  function remove(id) { dispatch('remove', id) }
  function toggle(book, status) { dispatch('toggle', { id: book.id, status }) }
</script>

{#if $filtered && $filtered.length > 0}
  {#each $filtered as book (book.id)}
    <div class="book">
      <div style="display:flex; justify-content:space-between">
        <div>
          <strong>{book.title}</strong>
          <div class="meta">{book.authors ? book.authors.join(', ') : ''} — {book.year || ''}</div>
        </div>
        <div class="controls">
          <select bind:value={book.status} on:change={(e)=>toggle(book,e.target.value)}>
            <option value="read">Leído</option>
            <option value="recommended">Recomendado</option>
            <option value="to-read">Por leer</option>
          </select>
          <button on:click={()=>remove(book.id)}>Eliminar</button>
        </div>
      </div>
    </div>
  {/each}
{:else}
  <div>No hay libros en esta lista.</div>
{/if}
