# MyBooks - Vue

### Qué hace esta aplicación

- Guarda una lista de libros leídos, recomendados y por leer.
- Permite buscar libros en Open Library por título o ISBN.
- Usa Pinia para el manejo de estado.
- Persiste la lista en `localStorage` para que los libros sobrevivan a recargas.

### Cómo ejecutar

```bash
cd MyBooksVue
npm install
npm run dev
```

Luego abre la URL que muestre Vite (normalmente `http://localhost:5173`).

### Comandos útiles

```bash
npm run build
npm run preview
```

### Notas

- El formulario de búsqueda consulta Open Library.
- El formulario manual permite agregar libros propios.
- La lista de libros puede filtrarse por estado.
