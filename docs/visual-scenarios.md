# Inventario de escenarios de visual testing

Sitio: https://practicesoftwaretesting.com. Este documento solo inventaría; no hay tests nuevos.
Exploración hecha el 2026-11-12 con Chromium en 1280x720 y 375x812 (una navegación a la vez).

Criterio: un escenario existe si la pieza **podría verse mal aunque funcione bien**.

Convenciones: grupo `visual` = no depende del catálogo; `visual-controlled` = depende de productos, marcas o
categorías, o necesita un estado especial (vacío, agotado, error, sesión). Prioridad: Alta = estado normal en
inicio, detalle, login y partes comunes; Media = error, vacío, agotado y pantallas fuera del flujo principal;
Baja = hover, foco y estados secundarios.

## 1. Escenarios por pantalla

### Partes comunes

| ID | Pantalla | Pieza | Estado | Grupo | Tamaño | Tipo de captura | Requisitos | Prioridad | Implementación |
|---|---|---|---|---|---|---|---|---|---|
| VS-01 | Partes comunes | Barra de navegación | Normal, sesión cerrada | visual | Ambos | Recorte | Enmascarar `notification-bar` si queda dentro del recorte | Alta | Ya existe |
| VS-02 | Partes comunes | Menú móvil (hamburguesa) | Cerrado (misma foto que VS-01 en móvil) | visual | Móvil | Recorte | — | Alta | Ya existe |
| VS-03 | Partes comunes | Menú móvil (hamburguesa) | Abierto | visual | Móvil | Recorte | — | Alta | Ya existe |
| VS-04 | Partes comunes | Footer | Normal | visual | Ambos | Recorte | Enmascarar el texto «Built AAAA-MM-DD» | Alta | Ya existe |
| VS-05 | Partes comunes | Menú «Categories» | Desplegado | visual-controlled | Escritorio | Recorte | Fixture `categories` (ya existe) | Media | Ya existe |
| VS-06 | Partes comunes | Barra de navegación | Sesión iniciada (nombre de usuario; en móvil con el menú abierto). El contador del carrito no se fotografía aparte | visual-controlled | Ambos | Recorte | Sesión ficticia (`sesionIniciada`) | Media | Ya existe |
| VS-07 | Partes comunes | Menú de usuario | Abierto | visual-controlled | Escritorio | Recorte | Sesión ficticia (`sesionIniciada`) | Media | Ya existe |
| VS-08 | Partes comunes | Selector de idioma | Abierto (8 idiomas) | visual | Ambos | Recorte | — | Baja | Ya existe |
| VS-09 | Partes comunes | Barra de navegación | Hover sobre un enlace | visual | Escritorio | Recorte | — | Baja | Ya existe |
| VS-10 | Partes comunes | Barra de navegación | Foco de teclado en un enlace | visual | Escritorio | Recorte | — | Baja | Ya existe |

### Inicio

| ID | Pantalla | Pieza | Estado | Grupo | Tamaño | Tipo de captura | Requisitos | Prioridad | Implementación |
|---|---|---|---|---|---|---|---|---|---|
| VS-11 | Inicio | Inicio | Carga inicial | visual-controlled | Escritorio | Página completa | Máscaras actuales (`homeVolatileRegions`) | Alta | Ya existe |
| VS-12 | Inicio | Inicio | Carga inicial | visual-controlled | Móvil | Página completa | Proyecto `visual-controlled-mobile` ya definido; mismas máscaras | Alta | Ya existe |
| VS-13 | Inicio | Banner principal | Normal | visual | Ambos | Recorte | Asset estático; no depende del catálogo | Alta | Ya existe |
| VS-14 | Inicio | Buscador | Normal | visual | Escritorio | Recorte | En móvil no es visible (ver Hallazgos) | Alta | Ya existe |
| VS-15 | Inicio | Ordenamiento | Select cerrado | visual | Escritorio | Recorte | En móvil no es visible (ver Hallazgos) | Alta | Ya existe |
| VS-16 | Inicio | Panel de filtros | Normal (categorías, marcas, precio, eco) | visual-controlled | Ambos | Recorte | Fixtures `categories` y `brands` (ya existen) | Alta | Ya existe |
| VS-17 | Inicio | Tarjeta de producto | Normal | visual-controlled | Ambos | Recorte | Imagen local única (ya existe) | Alta | Ya existe |
| VS-18 | Inicio | Paginación | Página 1 (anterior inactivo) | visual-controlled | Ambos | Recorte | — | Alta | Ya existe |
| VS-19 | Inicio | Panel de filtros (móvil) | Abierto (misma foto que VS-16 en móvil) | visual-controlled | Móvil | Recorte | Verificar cómo se abre (ver Hallazgos) | Media | Ya existe |
| VS-20 | Inicio | Tarjeta de producto | Agotado (badge «Out of stock») | visual-controlled | Ambos | Recorte | Producto con `in_stock:false` en la lista (el campo ya existe en la fábrica) | Media | Ya existe |
| VS-21 | Inicio | Tarjeta de producto | Nombre muy largo | visual-controlled | Ambos | Recorte | Helper `unSoloProductoConNombreLargo` ya existe | Media | Ya existe |
| VS-22 | Inicio | Lista de productos | Vacía («There are no products found.») | visual-controlled | Ambos | Página completa | Helper `listaVacia` ya existe | Media | Ya existe |
| VS-23 | Inicio | Lista de productos | Cargando (tarjetas skeleton) | visual-controlled | Ambos | Página completa | `SlowProductListMock`; respuesta retenida hasta tomar la foto | Media | Ya existe |
| VS-24 | Inicio | Lista de productos | Error 500 (skeletons que no se quitan) | visual-controlled | Escritorio | Página completa | `ProductListServerErrorMock` | Media | Ya existe |
| VS-25 | Inicio | Buscador | Con texto escrito | visual | Escritorio | Recorte | — | Baja | Ya existe |
| VS-26 | Inicio | Buscador | Foco | visual | Escritorio | Recorte | — | Baja | Ya existe |
| VS-27 | Inicio | Tarjeta de producto | Hover | visual-controlled | Escritorio | Recorte | — | Baja | Ya existe |
| VS-28 | Inicio | Tarjeta de producto | Precio 0 | visual-controlled | Escritorio | Recorte | Helper `unSoloProductoConPrecioCero` ya existe | Baja | Ya existe |
| VS-29 | Inicio | Insignia CO₂ | Calificaciones A–E | visual-controlled | Escritorio | Recorte | Fábrica `productosConTodosLosCo2` (5 productos, A a E); recorte de la cuadrícula | Baja | Ya existe |
| VS-30 | Inicio | Panel de filtros | Categoría y marca seleccionadas | visual-controlled | Ambos | Recorte | — | Baja | Ya existe |
| VS-31 | Inicio | Filtro de precio (slider) | Rango modificado | visual-controlled | Escritorio | Recorte | — | Baja | Ya existe |
| VS-32 | Inicio | Paginación | Página intermedia seleccionada | visual-controlled | Escritorio | Recorte | `PaginatedProductListMock` responde con la página pedida | Baja | Ya existe |
| VS-33 | Inicio | Paginación | Una sola página | visual-controlled | Escritorio | Recorte | Verificar si el componente se oculta | Baja | No aplica (con una sola página no se muestra paginación) |

### Detalle de producto

| ID | Pantalla | Pieza | Estado | Grupo | Tamaño | Tipo de captura | Requisitos | Prioridad | Implementación |
|---|---|---|---|---|---|---|---|---|---|
| VS-34 | Detalle de producto | Detalle de producto | Normal | visual-controlled | Ambos | Página completa | Fixtures `product-detail` y `related`; imagen local; máscaras de inicio | Alta | Ya existe |
| VS-35 | Detalle de producto | Bloque principal (imagen, nombre, precio, descripción) | Normal | visual-controlled | Ambos | Recorte | — | Alta | Ya existe |
| VS-36 | Detalle de producto | Cantidad y «Add to cart» | Normal (dos fotos: control de cantidad y botones) | visual-controlled | Ambos | Recorte | — | Alta | Ya existe |
| VS-37 | Detalle de producto | Especificaciones | Tabla normal | visual-controlled | Ambos | Recorte | — | Alta | Ya existe |
| VS-38 | Detalle de producto | Productos relacionados | Normal | visual-controlled | Ambos | Recorte | — | Alta | Ya existe |
| VS-39 | Detalle de producto | Bloque principal | Agotado (badge, botón deshabilitado) | visual-controlled | Ambos | Recorte | Helper `detalleSinStock` ya existe | Media | Ya existe |
| VS-40 | Detalle de producto | Bloque principal | Nombre muy largo | visual-controlled | Ambos | Recorte | Helper `detalleConNombreLargo` ya existe | Media | Ya existe |
| VS-41 | Detalle de producto | Productos relacionados | Vacío (sección sin tarjetas) | visual-controlled | Escritorio | Recorte | Helper `relacionadosVacios` ya existe | Media | Ya existe |
| VS-42 | Detalle de producto | Productos relacionados | Cargando (skeleton) | visual-controlled | Escritorio | Recorte | Retener la respuesta de `/related` | Media | No aplica (sin indicador de carga) |
| VS-43 | Detalle de producto | Productos relacionados | Error 500 | visual-controlled | Escritorio | Recorte | `RelatedProductsServerErrorMock` | Media | Ya existe |
| VS-44 | Detalle de producto | Producto inexistente (404) o error 500 | Página sin contenido (dos fotos: 404 y 500) | visual-controlled | Escritorio | Página completa | `ProductNotFoundMock` / `ProductServerErrorMock` | Media | Ya existe |
| VS-45 | Detalle de producto | Cantidad | Valor modificado / foco | visual-controlled | Escritorio | Recorte | — | Baja | Ya existe |
| VS-46 | Detalle de producto | Botón «Add to cart» | Hover | visual-controlled | Escritorio | Recorte | — | Baja | Ya existe |
| VS-47 | Detalle de producto | Mensaje «Product added to shopping cart.» | Visible | visual-controlled | Escritorio | Recorte | Efímero; ver Hallazgos | Baja | Ya existe |
| VS-48 | Detalle de producto | Bloque principal | Precio 0 | visual-controlled | Escritorio | Recorte | Helper `detalleConPrecioCero` ya existe | Baja | Ya existe |

### Login

| ID | Pantalla | Pieza | Estado | Grupo | Tamaño | Tipo de captura | Requisitos | Prioridad | Implementación |
|---|---|---|---|---|---|---|---|---|---|
| VS-49 | Login | Formulario de login | Campos obligatorios vacíos | visual | Escritorio | Recorte | — | Alta | Ya existe |
| VS-50 | Login | Formulario de login | Campos obligatorios vacíos | visual | Móvil | Recorte | — | Alta | Ya existe |
| VS-51 | Login | Formulario de login | Normal (sin enviar) | visual | Escritorio | Recorte | — | Alta | Ya existe |
| VS-52 | Login | Formulario de login | Normal (sin enviar) | visual | Móvil | Recorte | — | Alta | Ya existe |
| VS-53 | Login | Formulario de login | Credenciales inválidas («Invalid email or password») | visual-controlled | Ambos | Recorte | `LoginMock` con credenciales del `.env`; estado de error | Media | Ya existe |
| VS-54 | Login | Formulario de login | Error 500 («Login failed») | visual-controlled | Escritorio | Recorte | `LoginServerErrorMock` | Media | Ya existe |
| VS-55 | Login | Recuperar contraseña | Normal | visual | Ambos | Página completa | — | Media | Ya existe |
| VS-56 | Login | Formulario de login | Foco en un campo | visual | Escritorio | Recorte | — | Baja | Ya existe |
| VS-57 | Login | Botón «Login» | Hover | visual | Escritorio | Recorte | — | Baja | Ya existe |

### Registro

| ID | Pantalla | Pieza | Estado | Grupo | Tamaño | Tipo de captura | Requisitos | Prioridad | Implementación |
|---|---|---|---|---|---|---|---|---|---|
| VS-58 | Registro | Formulario de registro | Normal | visual | Ambos | Página completa | Controles nativos (fecha, país); ver Hallazgos | Media | Ya existe |
| VS-59 | Registro | Formulario de registro | Campos obligatorios vacíos (12 mensajes) | visual | Ambos | Página completa | — | Media | Ya existe |

### Contacto

| ID | Pantalla | Pieza | Estado | Grupo | Tamaño | Tipo de captura | Requisitos | Prioridad | Implementación |
|---|---|---|---|---|---|---|---|---|---|
| VS-60 | Contacto | Formulario de contacto | Normal | visual | Ambos | Página completa | — | Media | Ya existe |
| VS-61 | Contacto | Formulario de contacto | Campos obligatorios vacíos (5 mensajes) | visual | Ambos | Página completa | — | Media | Ya existe |

### Cuenta del usuario

| ID | Pantalla | Pieza | Estado | Grupo | Tamaño | Tipo de captura | Requisitos | Prioridad | Implementación |
|---|---|---|---|---|---|---|---|---|---|
| VS-62 | Cuenta del usuario | Mi cuenta | Normal | visual-controlled | Ambos | Página completa | Sesión (mock de sesión + datos de cuenta) | Media | Ya existe |
| VS-63 | Cuenta del usuario | Favoritos | Con productos | visual-controlled | Ambos | Página completa | Sesión (mock de sesión + datos de cuenta); fixture nuevo de favoritos | Media | Ya existe |
| VS-64 | Cuenta del usuario | Favoritos | Vacío | visual-controlled | Escritorio | Página completa | Sesión (mock de sesión + datos de cuenta); fixture nuevo | Media | Ya existe |
| VS-65 | Cuenta del usuario | Perfil | Formulario con datos | visual-controlled | Ambos | Página completa | Sesión (mock de sesión + datos de cuenta); perfil ficticio | Media | Ya existe |
| VS-66 | Cuenta del usuario | Facturas | Con datos | visual-controlled | Ambos | Página completa | Sesión (mock de sesión + datos de cuenta); fixture nuevo de facturas | Media | Ya existe |
| VS-67 | Cuenta del usuario | Mensajes | Vacío | visual-controlled | Escritorio | Página completa | Sesión (mock de sesión + datos de cuenta) | Media | Ya existe |
| VS-68 | Cuenta del usuario | Perfil | Secciones de contraseña y 2FA | visual-controlled | Escritorio | Recorte | Sesión (mock de sesión + datos de cuenta) | Baja | Ya existe |
| VS-69 | Cuenta del usuario | Facturas | Paginación | visual-controlled | Escritorio | Recorte | Sesión (mock de sesión + datos de cuenta); fixture con varias páginas | Baja | Ya existe |

### Carrito y checkout

| ID | Pantalla | Pieza | Estado | Grupo | Tamaño | Tipo de captura | Requisitos | Prioridad | Implementación |
|---|---|---|---|---|---|---|---|---|---|
| VS-70 | Carrito y checkout | Carrito | Con un artículo (totales) | visual-controlled | Ambos | Recorte (`aw-wizard`) | Carrito ficticio por `sessionStorage` + GET /carts/{id} fijado (`carritoControlado`) | Media | Ya existe |
| VS-71 | Carrito y checkout | Checkout | Paso de login / invitado | visual-controlled | Escritorio | Recorte (`aw-wizard`) | Artículo en el carrito | Media | Ya existe |
| VS-72 | Carrito y checkout | Checkout | Dirección de facturación | visual-controlled | Escritorio | Recorte | Artículo en el carrito | Baja | Ya existe |
| VS-73 | Carrito y checkout | Checkout | Pago | visual-controlled | Escritorio | Recorte | Artículo en el carrito | Baja | Ya existe |

### Otras pantallas

| ID | Pantalla | Pieza | Estado | Grupo | Tamaño | Tipo de captura | Requisitos | Prioridad | Implementación |
|---|---|---|---|---|---|---|---|---|---|
| VS-74 | Otras pantallas | Política de privacidad | Normal | visual | Ambos | Página completa | Texto estático | Baja | Ya existe |
| VS-75 | Otras pantallas | Categoría «Rentals» | Lista con encabezado de categoría | visual-controlled | Ambos | Página completa | El mock debe filtrar por categoría | Baja | Ya existe |

## 2. Resumen

| Grupo | Alta | Media | Baja | Total |
|---|---|---|---|---|
| visual | 11 | 5 | 8 | 24 |
| visual-controlled | 10 | 25 | 16 | 51 |
| **Total** | 21 | 30 | 24 | 75 |

Ya existen 73 de 75; 2 no aplican (VS-33 y VS-42); pendientes 0 (Partes 1 a 7 hechas).

## 3. Hallazgos

**No existe como esperábamos**
- **No hay baseline de «login normal».** Las baselines que existen son: inicio controlado (escritorio), inicio con
  datos reales (`tests/visual/home.visual.spec.ts`, escritorio) y campos obligatorios del login (escritorio y móvil).
  El login inicial aparece como pendiente.
- **Inicio duplicado:** hay una baseline con datos reales (`visual`) y otra controlada. La real depende del
  catálogo de hoy; conviene decidir si se retira.
- **Carrito vacío sin mensaje:** `/checkout` sin artículos muestra la página sin contenido. Decisión: no se hace nada (sin escenario ni reporte).
- **No hay página 404:** una ruta inexistente redirige al inicio.
- **Mensajes de la cuenta** aparece vacío y sin texto de estado.
- **Pantalla de comparación:** las tarjetas y el detalle tienen `compare-btn` / `add-to-compare`, pero no exploré esa pantalla.
- **Idioma:** el selector muestra «EN» y hay 8 opciones; no comprobé que cambiar de idioma altere la pantalla.

**Se comporta distinto**
- **Paginación con una sola página:** el componente no se renderiza, así que VS-33 no aplica.
- **Checkout:** con sesión, el paso de login dice «you are already logged in»; el paso de dirección llama a `GET /postcode-lookup` y sustituye calle, ciudad y estado por los del código postal, por eso se fija con la dirección del perfil ficticio.
- **Cuenta de demostración real bloqueada:** al intentar un login real de comprobación, el API respondió 423 («Account locked, too many failed attempts»). Los tests no la usan (login mockeado), pero conviene saber que ese usuario puede quedar bloqueado.
- **Sesión:** el front guarda el token en `localStorage` (`auth-token`) y consulta `/users/me`; el carrito vive en `sessionStorage` (`cart_id`, `cart_quantity`). Los tests de cuenta y carrito los preparan así, sin pasar por el login.
- **Perfil:** al abrirse llama a `POST /totp/setup` y la cuenta de demostración recibe 403 con el aviso «Access denied…»; se fija igual para que salga el mismo mensaje.
- **Facturas con una sola página:** no se ve paginación.
- **Datos de cuenta ficticios:** `tests/mock/account.factories.ts` copia solo la forma de las respuestas; el contrato (`contract`) no las cubre porque exigen sesión.
- **Aviso de login fuera del formulario:** el mensaje («Invalid email or password», «Login failed») aparece debajo del formulario, no dentro; las fotos de error recortan la tarjeta `.auth-form` completa.
- **Botón «Sign in with Google» en el login:** viene de un script externo de Google y aparece en las fotos de la tarjeta de login. Es un riesgo de estabilidad que no se ha manifestado.
- **Relacionados no tiene estado de carga visible:** mientras `/related` no responde, solo se ve el título «Related products», sin skeletons; es igual que «vacío» y «error 500». Por eso VS-42 no aplica.
- **Producto inexistente (404) o error 500:** la página no queda en blanco: se ve el título «Related products» sobre un hueco y el footer subido. Las dos fotos son iguales.
- **Lista con error 500:** se ve idéntica a «cargando» (tarjetas skeleton), sin mensaje de error.
- **En móvil** buscador y ordenamiento están dentro del panel de filtros, colapsado tras el botón «Filters» (resuelto en la Parte 2: se abre y se fotografía el panel completo).
- **`data-test="filters"` está repetido:** lo llevan el botón «Filters» (móvil) y el panel; el panel se localiza por `#filters`.
- **El menú móvil** colapsa la barra (botón «Toggle navigation»).
- **Los mocks actuales solo sirven la página 1**; para paginación intermedia hay que responder por `page`.
- **`/account` sin sesión** redirige a `/auth/login`.

**No se puede fotografiar de forma estable (o solo con precauciones)**
- **Notification bar, promo de cursos y texto «Built …»:** cambian con el tiempo; hoy están enmascarados y por eso
  no tienen escenario propio. «Built» tapa una franja de ancho completo del pie.
- **Banner principal:** viene del servidor real (`barn-2400x1600.avif`); si cambia, cambia la foto.
- **Widgets flotantes (chat, actividad en vivo):** aparecen tarde; se ocultan con CSS.
- **Desplegables nativos** (ordenamiento, país, fecha): el popup lo dibuja el sistema operativo y no sale en
  capturas de página; solo se puede fotografiar el control cerrado.
- **Mensaje «Product added to shopping cart.»:** es efímero.
- **Cuenta con datos reales** (favoritos, facturas, perfil): cambia entre ejecuciones; por eso va controlada.
- **Estado «cargando»:** requiere retener la respuesta del mock mientras se toma la foto.
- **Plataforma:** las baselines se generaron en Windows; en CI con Linux hay que regenerarlas.

**Decisiones tomadas**
- Cuenta: se permiten fixtures con datos ficticios de favoritos, facturas y perfil (sin tokens ni usuarios reales);
  esto es una excepción acordada a la regla anterior.
- Carrito vacío sin mensaje: no se hace nada.
- Inicio con datos reales (`tests/visual/home.visual.spec.ts`): se deja.

## 4. Orden de implementación propuesto

- **Parte 1 – Alta de partes comunes y login** (`visual`, sin mocks): navbar, menú móvil cerrado y abierto, footer,
  login normal en escritorio y móvil.
- **Parte 2 – Alta de inicio:** inicio en móvil, tarjeta, filtros, paginación página 1 (`visual-controlled`); banner,
  buscador y ordenamiento (`visual`). Antes se aclara el comportamiento móvil.
- **Parte 3 – Alta de detalle:** detalle completo, bloque principal, cantidad y agregar, especificaciones, relacionados.
- **Parte 4 – Media de inicio y detalle:** agotado, nombre largo, vacío, cargando, error 500 y producto inexistente.
- **Parte 5 – Media de login y formularios:** credenciales inválidas, error 500, recuperar contraseña, registro y contacto.
- **Parte 6 – Media de cuenta y carrito:** fixtures ficticios aprobados; sesión mockeada, favoritos,
  perfil, facturas, mensajes, carrito y checkout.
- **Parte 7 – Baja:** hover, foco, selector de idioma, precio 0, paginación intermedia, CO₂, privacidad, categoría Rentals.
