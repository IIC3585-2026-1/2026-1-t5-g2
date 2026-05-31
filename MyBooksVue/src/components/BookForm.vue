<template>
  <div>
    <h3>Buscar (Open Library)</h3>
    <div
      style="display: flex; gap: 8px; align-items: center; margin-bottom: 10px"
    >
      <input v-model="q" placeholder="Título o ISBN" />
      <button @click="search" :disabled="loading">Buscar</button>
      <span v-if="loading" style="display: flex; align-items: center; gap: 6px">
        <span class="spinner" aria-hidden="true"></span>
        <span>Buscando...</span>
      </span>
    </div>

    <div v-if="found">
      <div
        style="
          display: flex;
          gap: 12px;
          align-items: flex-start;
          margin-bottom: 10px;
        "
      >
        <img v-if="found.cover" :src="found.cover" alt="cover" width="90" />
        <div>
          <div>
            <strong>{{ found.title }}</strong>
          </div>
          <div class="meta">{{ found.authors?.join(', ') }}</div>
          <div v-if="found.description" class="meta">
            {{ found.description }}
          </div>
          <div style="margin-top: 8px">
            <label>Estado: </label>
            <select v-model="foundStatus">
              <option value="to-read">Por leer</option>
              <option value="recommended">Recomendado</option>
              <option value="read">Leído</option>
            </select>
          </div>
          <button style="margin-top: 8px" @click="addFound">Agregar</button>
        </div>
      </div>
    </div>

    <div
      v-if="searched && !loading && !found"
      class="meta"
      style="margin-bottom: 16px"
    >
      No se encontraron resultados para "{{ q }}".
    </div>

    <hr />

    <h3>Agregar manualmente</h3>
    <div
      style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px"
    >
      <input v-model="title" placeholder="Título" />
      <input v-model="authors" placeholder="Autores (comma)" />
      <select v-model="status">
        <option value="to-read">Por leer</option>
        <option value="recommended">Recomendado</option>
        <option value="read">Leído</option>
      </select>
      <button @click="manualAdd">Agregar</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { fetchByQuery } from '../services/openLibrary';

export default {
  emits: ['add'],
  setup(_, { emit }) {
    const q = ref('');
    const found = ref(null);
    const foundStatus = ref('to-read');
    const title = ref('');
    const authors = ref('');
    const status = ref('to-read');
    const loading = ref(false);
    const searched = ref(false);

    async function search() {
      found.value = null;
      searched.value = false;
      if (!q.value) return;
      loading.value = true;
      try {
        const r = await fetchByQuery(q.value);
        if (r) {
          found.value = r;
          foundStatus.value = 'to-read';
        }
      } finally {
        loading.value = false;
        searched.value = true;
      }
    }

    function addFound() {
      if (!found.value) return;
      emit('add', {
        title: found.value.title,
        authors: found.value.authors,
        status: foundStatus.value,
        cover: found.value.cover || null,
        description: found.value.description || null,
      });
      found.value = null;
      q.value = '';
    }

    function manualAdd() {
      emit('add', {
        title: title.value,
        authors: authors.value.split(',').map((s) => s.trim()),
        status: status.value,
      });
      title.value = '';
      authors.value = '';
    }

    return {
      q,
      found,
      foundStatus,
      title,
      authors,
      status,
      loading,
      searched,
      search,
      addFound,
      manualAdd,
    };
  },
};
</script>

<style scoped>
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
