/**
 * Fábricas de datos para los tests con mocks.
 *
 * Cada función devuelve una COPIA PROFUNDA del fixture capturado (tests/mock/fixtures) con solo los
 * cambios que se le pasen. Los fixtures originales están congelados: si algún código intenta
 * modificarlos, lanza un error en lugar de contaminar otros tests.
 *
 * Los nombres de campos son los reales del API (ver scripts/capturar-fixtures.ts).
 */
import brandsJson from './fixtures/brands.json';
import categoriesJson from './fixtures/categories.json';
import productDetailJson from './fixtures/product-detail.json';
import productsJson from './fixtures/products.json';
import relatedJson from './fixtures/related.json';

// ---------------------------------------------------------------------------------------------
// Tipos (asignar el JSON a estos tipos comprueba en compilación que el fixture los cumple)
// ---------------------------------------------------------------------------------------------

export interface ImagenProducto {
  id: string;
  by_name: string;
  by_url: string;
  source_name: string;
  source_url: string;
  file_name: string;
  title: string;
}

export interface ProductoLista {
  id: string;
  name: string;
  description: string;
  price: number;
  is_location_offer: boolean;
  is_rental: boolean;
  co2_rating: string;
  in_stock: boolean;
  is_eco_friendly: boolean;
  product_image: ImagenProducto;
  category: { id: string; name: string; slug: string };
  brand: { id: string; name: string };
}

/** Respuesta de `QUERY /products`. */
export interface ListaProductos {
  current_page: number;
  data: ProductoLista[];
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
}

export interface EspecificacionProducto {
  id: string;
  product_id: string;
  spec_name: string;
  spec_value: string;
  spec_unit: string | null;
}

/** Respuesta de `GET /products/{id}`. */
export interface DetalleProducto extends Omit<ProductoLista, 'category'> {
  category: { id: string; name: string; slug: string; parent_id: string };
  specs: EspecificacionProducto[];
}

/** Elemento de `GET /products/{id}/related` (sin `co2_rating`; `category` sin `slug`). */
export interface ProductoRelacionado extends Omit<ProductoLista, 'co2_rating' | 'category'> {
  category: { id: string; name: string };
}

export interface Marca {
  id: string;
  name: string;
  slug: string;
}

/** Elemento de `GET /categories/tree`. */
export interface Categoria {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  sub_categories: Categoria[];
}

// ---------------------------------------------------------------------------------------------
// Originales (congelados)
// ---------------------------------------------------------------------------------------------

function congelar<T>(valor: T): T {
  if (valor !== null && typeof valor === 'object') {
    Object.values(valor).forEach(congelar);
    Object.freeze(valor);
  }
  return valor;
}

const PRODUCTOS: ListaProductos = congelar(structuredClone(productsJson));
const DETALLE: DetalleProducto = congelar(structuredClone(productDetailJson));
const RELACIONADOS: ProductoRelacionado[] = congelar(structuredClone(relatedJson));
const MARCAS: Marca[] = congelar(structuredClone(brandsJson));
const CATEGORIAS: Categoria[] = congelar(structuredClone(categoriesJson));

/** Copia profunda editable de un original (nunca devuelve el objeto congelado). */
const copia = <T>(original: T): T => structuredClone(original);

// ---------------------------------------------------------------------------------------------
// Fábricas: una por fixture. `cambios` se mezcla sobre los campos de primer nivel de la copia.
// En las que devuelven arrays, `cambios` se aplica a cada elemento.
// ---------------------------------------------------------------------------------------------

export function crearProductos(cambios: Partial<ListaProductos> = {}): ListaProductos {
  return { ...copia(PRODUCTOS), ...copia(cambios) };
}

/** Un producto suelto con la forma de los elementos de la lista (el primero del fixture). */
export function crearProducto(cambios: Partial<ProductoLista> = {}): ProductoLista {
  return { ...copia(PRODUCTOS.data[0]), ...copia(cambios) };
}

export function crearDetalleProducto(cambios: Partial<DetalleProducto> = {}): DetalleProducto {
  return { ...copia(DETALLE), ...copia(cambios) };
}

/** `cantidad` limita cuántos relacionados se devuelven (por defecto todos los del fixture). */
export function crearRelacionados(
  cambios: Partial<ProductoRelacionado> = {},
  cantidad: number = RELACIONADOS.length,
): ProductoRelacionado[] {
  if (cantidad > RELACIONADOS.length) {
    throw new Error(`El fixture solo tiene ${RELACIONADOS.length} relacionados; se pidieron ${cantidad}.`);
  }
  return copia(RELACIONADOS)
    .slice(0, cantidad)
    .map((producto) => ({ ...producto, ...copia(cambios) }));
}

export function crearMarcas(cambios: Partial<Marca> = {}): Marca[] {
  return copia(MARCAS).map((marca) => ({ ...marca, ...copia(cambios) }));
}

export function crearCategorias(cambios: Partial<Categoria> = {}): Categoria[] {
  return copia(CATEGORIAS).map((categoria) => ({ ...categoria, ...copia(cambios) }));
}

// ---------------------------------------------------------------------------------------------
// Casos comunes
// ---------------------------------------------------------------------------------------------

const LONGITUD_NOMBRE_LARGO = 200;

/** Nombre real + relleno hasta alcanzar exactamente `longitud` caracteres. */
function nombreLargo(base: string, longitud: number): string {
  return `${base} ${'extra '.repeat(longitud)}`.slice(0, longitud).trimEnd();
}

/** Lista que el API devuelve cuando los filtros no encuentran nada. */
export function listaVacia(): ListaProductos {
  return crearProductos({ data: [], total: 0, from: null, to: null, last_page: 1 });
}

/** Lista con un único producto (resto de campos del producto = fixture). */
export function unSoloProducto(cambios: Partial<ProductoLista> = {}): ListaProductos {
  return crearProductos({
    data: [crearProducto(cambios)],
    total: 1,
    from: 1,
    to: 1,
    last_page: 1,
  });
}

export function unSoloProductoConNombreLargo(longitud: number = LONGITUD_NOMBRE_LARGO): ListaProductos {
  return unSoloProducto({ name: nombreLargo(crearProducto().name, longitud) });
}

export function unSoloProductoConPrecioCero(): ListaProductos {
  return unSoloProducto({ price: 0 });
}

export function detalleSinStock(): DetalleProducto {
  return crearDetalleProducto({ in_stock: false });
}

export function detalleConNombreLargo(longitud: number = LONGITUD_NOMBRE_LARGO): DetalleProducto {
  return crearDetalleProducto({ name: nombreLargo(crearDetalleProducto().name, longitud) });
}

export function detalleConPrecioCero(): DetalleProducto {
  return crearDetalleProducto({ price: 0 });
}

export function relacionadosVacios(): ProductoRelacionado[] {
  return crearRelacionados({}, 0);
}
