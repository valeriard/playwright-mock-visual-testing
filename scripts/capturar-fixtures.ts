/**
 * Captura una vez las respuestas reales del API de catálogo y las guarda como fixtures
 * en tests/mock/fixtures/. Se ejecuta con `npm run fixtures:update`.
 *
 * Solo endpoints públicos del catálogo: nunca /users, tokens ni credenciales.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { API_URL, PRODUCT_LIST_QUERY } from '../src/data/realApi';

const OUTPUT_DIR = path.resolve(__dirname, '..', 'tests', 'mock', 'fixtures');

async function llamar<T>(ruta: string, init: RequestInit = {}): Promise<T> {
  const respuesta = await fetch(`${API_URL}${ruta}`, {
    ...init,
    headers: { Accept: 'application/json', ...(init.headers ?? {}) },
  });
  if (!respuesta.ok) {
    throw new Error(`${init.method ?? 'GET'} ${ruta} respondió ${respuesta.status}; no se guarda nada.`);
  }
  return (await respuesta.json()) as T;
}

async function guardar(nombre: string, datos: unknown): Promise<void> {
  const destino = path.join(OUTPUT_DIR, nombre);
  await writeFile(destino, `${JSON.stringify(datos, null, 2)}\n`, 'utf8');
  console.log(`  guardado ${path.relative(process.cwd(), destino)}`);
}

async function main(): Promise<void> {
  console.log(`Capturando fixtures desde ${API_URL}`);
  await mkdir(OUTPUT_DIR, { recursive: true });

  // Todas las llamadas se hacen antes de escribir, para no dejar fixtures a medias si algo falla.
  const products = await llamar<{ data: Array<{ id: string }> }>('/products', {
    method: 'QUERY',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(PRODUCT_LIST_QUERY),
  });
  if (products.data.length === 0) throw new Error('El listado de productos llegó vacío.');

  const productId = products.data[0].id;
  const productDetail = await llamar(`/products/${productId}`);
  const related = await llamar(`/products/${productId}/related`);
  const brands = await llamar('/brands');
  const categories = await llamar('/categories/tree');

  await guardar('products.json', products);
  await guardar('product-detail.json', productDetail);
  await guardar('related.json', related);
  await guardar('brands.json', brands);
  await guardar('categories.json', categories);
  console.log('Listo.');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
