<script>
  import { createEventDispatcher } from 'svelte'
  import { fetchByQuery } from '../services/openLibrary'
  let q = ''
  let found = null
  let title = ''
  let authors = ''
  let status = 'to-read'
  const dispatch = createEventDispatcher()

  async function search() {
    found = null
    if (!q) return
    const r = await fetchByQuery(q)
    if (r) found = r
  }
  function addFound() { dispatch('add', { title: found.title, authors: found.authors, status: 'to-read' }); found=null; q=''}
  function manualAdd() { dispatch('add', { title, authors: authors.split(',').map(s=>s.trim()), status }); title=''; authors=''}
</script>

<div>
  <h3>Agregar libro</h3>
  <div>
    <input bind:value={q} placeholder="Título o ISBN" />
    <button on:click={search}>Buscar</button>
  </div>
  {#if found}
    <div>
      <div><strong>{found.title}</strong></div>
      <div class="meta">{found.authors ? found.authors.join(', ') : ''}</div>
      <button on:click={addFound}>Agregar</button>
    </div>
  {/if}
  <hr />
  <div>
    <input bind:value={title} placeholder="Título" />
    <input bind:value={authors} placeholder="Autores (comma)" />
    <select bind:value={status}>
      <option value="to-read">Por leer</option>
      <option value="recommended">Recomendado</option>
      <option value="read">Leído</option>
    </select>
    <button on:click={manualAdd}>Agregar</button>
  </div>
</div>
