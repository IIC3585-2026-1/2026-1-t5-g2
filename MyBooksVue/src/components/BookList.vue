<template>
  <div>
    <div v-for="book in books" :key="book.id" class="book">
      <div style="display: flex; justify-content: space-between">
        <div style="display: flex; gap: 12px; align-items: center">
          <img v-if="book.cover" :src="book.cover" alt="cover" width="64" />
          <div>
            <strong>{{ book.title }}</strong>
            <div class="meta">
              {{ book.authors?.join(', ') }} — {{ book.year || '' }}
            </div>
          </div>
        </div>
        <div class="controls">
          <select v-model="localStatus[book.id]" @change="emitToggle(book)">
            <option value="read">Leído</option>
            <option value="recommended">Recomendado</option>
            <option value="to-read">Por leer</option>
          </select>
          <button @click="$emit('remove', book.id)">Eliminar</button>
        </div>
      </div>
    </div>
    <div v-if="books.length === 0">No hay libros en esta lista.</div>
  </div>
</template>

<script>
import { reactive, watch } from 'vue';
export default {
  props: ['books'],
  setup(props, { emit }) {
    const localStatus = reactive({});
    watch(
      () => props.books,
      (bs) => {
        if (!Array.isArray(bs)) return;
        bs.forEach((b) => {
          localStatus[b.id] = b.status ?? 'to-read';
        });
      },
      { immediate: true, deep: true },
    );
    function emitToggle(book) {
      emit('toggle', book.id, localStatus[book.id]);
    }
    return { localStatus, emitToggle };
  },
};
</script>
