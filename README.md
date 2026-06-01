# MyBooks: Vue y Svelte

Este repositorio contiene dos versiones de la misma aplicación de libros:

- `MyBooksVue`: implementada con Vue 3, Vite y Pinia.
- `MyBooksSvelte`: implementada con Svelte 4, Vite y stores de Svelte.

Ambas apps permiten:

- agregar libros manualmente,
- buscar libros en Open Library por título o ISBN,
- asignar un estado a cada libro (`Por leer`, `Recomendado`, `Leído`),
- cambiar el estado desde la lista,
- eliminar libros,
- persistir la lista en `localStorage`.

## Estructura del repositorio

- `MyBooksVue/`: app Vue con componentes y store Pinia.
- `MyBooksSvelte/`: app Svelte con componentes y stores nativos.

## Enfoque de cada framework

### Vue

- Usa componentes `.vue` que separan template, script y estilos.
- El estado de los libros se maneja con `Pinia` en `src/store/books.js`.
- La app principal `App.vue` consume el store y pasa datos a los componentes `BookList.vue` y `BookForm.vue`.
- `BookForm.vue` incluye:
  - búsqueda en Open Library,
  - un selector de estado para el libro encontrado,
  - un formulario manual separado.
- `BookList.vue` mantiene un estado local de selección para evitar que el `select` quede vacío al agregar un libro.
- `localStorage` se integra en el store para cargar y guardar la lista de libros automáticamente.

### Svelte

- Usa componentes `.svelte` donde el HTML, la lógica y los estilos conviven de forma reactiva.
- El estado de los libros se maneja con `writable` stores en `src/stores.js`.
- `App.svelte` crea un store derivado (`derived`) para filtrar por estado.
- `BookForm.svelte` contiene:
  - búsqueda en Open Library,
  - un selector de estado dentro del resultado encontrado,
  - un formulario manual separado.
- `BookList.svelte` muestra los libros y emite eventos para eliminar y cambiar el estado.
- `localStorage` se integra desde el store para persistir los libros entre recargas.

## Diferencias importantes en la implementación

### Manejo del estado

- En Vue, el estado se centraliza en Pinia. Los componentes consumen el store y ejecutan acciones.
- En Svelte, el estado se centraliza en un store nativo (`writable`) y se actualiza con `update`.
- Vue usa `computed` para derivar datos filtrados; Svelte usa `derived`.

### Búsqueda e integración con Open Library

- Ambas apps usan el mismo servicio de búsqueda en `src/services/openLibrary.js`.
- El resultado de la búsqueda incluye título, autores, año, portada y descripción cuando está disponible.
- Ambas versiones permiten elegir un estado antes de agregar el libro.

### Componentes y reactividad

- Vue requiere una capa explícita de reactividad en `BookList.vue` para que el `select` detecte el estado agregado inmediatamente.
- En Svelte, la reactividad es más directa: el binding de atributos y el store reactivo actualizan la UI automáticamente.

## En qué brilla cada uno en el contexto de MyBooks

### Vue

- Ventaja: arquitectura clara con separación definida entre lógica de estado y componentes.
- Es fácil ver qué parte es responsabilidad del store y qué parte es de la UI.
- Pinia facilita escribir acciones y mantener el estado consistente.
- Buena opción si se busca escalar a una app con muchos módulos y rutas.

### Svelte

- Ventaja: menos boilerplate y más reactividad “natural”.
- Los componentes son muy compactos y la actualización de la UI es sencilla.
- El código del formulario y la lista queda más directo al no necesitar un store externo adicional para la reactividad básica.
- Ideal para apps pequeñas o prototipos donde se quiere mayor rapidez de desarrollo.

## Debilidades en este ejercicio

### Vue

- Requiere un poco más de configuración y estructura, como el store de Pinia y el watch profundo.
- Puede sentirse más verboso que Svelte para una aplicación pequeña.

### Svelte

- Si la aplicación crece mucho, el manejo de stores personalizados puede volverse más manual.
- El uso de stores y bindings directos puede ocultar explicitud en el flujo de datos para desarrolladores que vienen de un enfoque más clásico de estado global.

## Cómo ejecutar cada app

### Vue

```bash
cd MyBooksVue
npm install
npm run dev
```

### Svelte

```bash
cd MyBooksSvelte
npm install
npm run dev
```

## Notas finales

Ambas versiones cumplen la misma funcionalidad básica del desafío. La diferencia real está en el estilo de implementación:

- Vue es más explícito y organizado con su store centralizado.
- Svelte es más directo y reactivo, con menos código de infraestructura.

Esto hace que el proyecto sea un buen comparativo entre ambos frameworks para una aplicación de listas y búsqueda de libros.
