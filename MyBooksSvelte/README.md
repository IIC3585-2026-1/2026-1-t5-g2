# MyBooks - Svelte

### Qué hace esta aplicación

- Guarda una lista de libros leídos, recomendados y por leer.
- Permite buscar libros en Open Library por título o ISBN.
- Usa stores de Svelte para el manejo de estado.
- Persiste la lista en `localStorage` para que los libros se mantengan entre recargas.

### Cómo ejecutar

```bash
cd MyBooksSvelte
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

- La búsqueda trae portada y descripción cuando Open Library encuentra el libro.
- El formulario manual permite agregar libros propios.
- La lista puede filtrarse por estado.
