<template>
  <div class="app">
    <div class="header">
      <h1>MyBooks (Vue)</h1>
      <div>
        <select v-model="filter">
          <option value="all">Todos</option>
          <option value="read">Leídos</option>
          <option value="recommended">Recomendados</option>
          <option value="to-read">Por leer</option>
        </select>
      </div>
    </div>
    <div class="grid">
      <div>
        <BookList
          :books="filteredBooks"
          @remove="removeBook"
          @toggle="toggleBook"
        />
      </div>
      <div>
        <BookForm @add="addBook" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useBooksStore } from './store/books';
import BookList from './components/BookList.vue';
import BookForm from './components/BookForm.vue';

export default {
  components: { BookList, BookForm },
  setup() {
    const store = useBooksStore();
    const filter = ref('all');
    const filteredBooks = computed(() => {
      if (filter.value === 'all') return store.books;
      return store.books.filter((b) => b.status === filter.value);
    });
    function addBook(book) {
      store.addBook(book);
    }
    function removeBook(id) {
      store.removeBook(id);
    }
    function toggleBook(id, status) {
      store.updateStatus(id, status);
    }
    return { filter, filteredBooks, addBook, removeBook, toggleBook };
  },
};
</script>
