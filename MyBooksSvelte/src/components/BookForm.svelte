<script>
  import { createEventDispatcher } from 'svelte'
  import { fetchByQuery } from '../services/openLibrary'

  let q = ''
  let found = null
  let foundStatus = 'to-read'
  let title = ''
  let authors = ''
  let status = 'to-read'
  let loading = false
  let searched = false

  const dispatch = createEventDispatcher()

  async function search() {
    found = null
    searched = false
    if (!q) return
    loading = true
    try {
      const result = await fetchByQuery(q)
      if (result) {
        found = result
        foundStatus = 'to-read'
      }
    } finally {
      loading = false
      searched = true
    }
  }

  function addFound() {
    if (!found) return
    dispatch('add', {
      title: found.title,
      authors: found.authors,
      status: foundStatus,
      year: found.year || null,
      cover: found.cover || null,
      description: found.description || null,
    })
    found = null
    q = ''
  }

  function manualAdd() {
    dispatch('add', {
      title,
      authors: authors.split(',').map((s) => s.trim()),
      status,
    })
    title = ''
    authors = ''
  }
</script>

<div>
  <h3>Buscar (Open Library)</h3>
  <div style="display:flex; gap:8px; align-items:center; margin-bottom:10px">
    <input bind:value={q} placeholder="Título o ISBN" />
    <button on:click={search} disabled={loading}>Buscar</button>
    {#if loading}
      <span style="display:flex; align-items:center; gap:6px">
        <span class="spinner" aria-hidden="true"></span>
        <span>Buscando...</span>
      </span>
    {/if}
  </div>

  {#if found}
    <div style="display:flex; gap:12px; align-items:flex-start; margin-bottom:10px">
      {#if found.cover}
        <img src={found.cover} alt="cover" width="90" />
      {/if}
      <div>
        <div><strong>{found.title}</strong></div>
        <div class="meta">{found.authors ? found.authors.join(', ') : ''}</div>
        {#if found.description}
          <div class="meta">{found.description}</div>
        {/if}
        <div style="margin-top:8px">
          <label for="found-status">Estado: </label>
          <select id="found-status" bind:value={foundStatus}>
            <option value="to-read">Por leer</option>
            <option value="recommended">Recomendado</option>
            <option value="read">Leído</option>
          </select>
        </div>
        <button style="margin-top:8px" on:click={addFound}>Agregar</button>
      </div>
    </div>
  {/if}

  {#if searched && !loading && !found}
    <div class="meta" style="margin-bottom:16px">No se encontraron resultados para "{q}".</div>
  {/if}

  <hr />

  <h3>Agregar manualmente</h3>
  <div style="display:flex; flex-direction:column; gap:8px; margin-top:10px">
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

<style>
  .spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid #ddd;
    border-top-color: #333;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
