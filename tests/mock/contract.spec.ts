import * as allure from 'allure-js-commons';
import { APIRequestContext, expect, test } from '@playwright/test';
import { API_URL, PRODUCT_LIST_QUERY } from '../../src/data/realApi';
import { compararEstructura } from './estructura';
import brandsFixture from './fixtures/brands.json';
import categoriesFixture from './fixtures/categories.json';
import productDetailFixture from './fixtures/product-detail.json';
import productsFixture from './fixtures/products.json';
import relatedFixture from './fixtures/related.json';

/**
 * Única prueba que habla con el API REAL (sin navegador, sin mocks).
 * Comprueba que la ESTRUCTURA (campos y tipos, nunca valores) sigue igual a la de los fixtures.
 * Si falla, hay que actualizar los fixtures: `npm run fixtures:update`.
 */

interface Respuesta {
  estado: number;
  json: unknown;
}

async function consultar(
  request: APIRequestContext,
  metodo: 'GET' | 'QUERY',
  ruta: string,
  cuerpo?: object,
): Promise<Respuesta> {
  const respuesta = await request.fetch(`${API_URL}${ruta}`, {
    method: metodo,
    data: cuerpo,
    headers: { Accept: 'application/json' },
  });
  const json = respuesta.ok() ? await respuesta.json() : undefined;
  return { estado: respuesta.status(), json };
}

test.describe('Contrato del API real', () => {
  test.beforeEach(async () => {
    await allure.epic('Toolshop');
    await allure.feature('Contract');
    await allure.parentSuite('Contract');
    await allure.suite('API');
    await allure.subSuite('Fixtures vs API real');
    await allure.tags('contract');
  });

  test('la estructura del API real sigue igual a la de los fixtures', async ({ request }) => {
    await allure.story('Estructura de las respuestas');
    await allure.severity('critical');

    const problemas: string[] = [];
    const avisos: string[] = [];

    /** Consulta un endpoint y acumula sus diferencias de estructura contra su fixture. */
    async function verificar(
      etiqueta: string,
      metodo: 'GET' | 'QUERY',
      ruta: string,
      fixture: unknown,
      cuerpo?: object,
    ): Promise<Respuesta> {
      return test.step(etiqueta, async () => {
        const respuesta = await consultar(request, metodo, ruta, cuerpo);
        if (respuesta.estado !== 200) {
          problemas.push(`${etiqueta}: el API respondió HTTP ${respuesta.estado} (no se pudo comparar)`);
          return respuesta;
        }
        const { diferencias, noVerificables } = compararEstructura(fixture, respuesta.json);
        diferencias.forEach((d) => problemas.push(`${etiqueta} → ${d.ruta}: ${d.detalle}`));
        noVerificables.forEach((aviso) => avisos.push(`${etiqueta} → ${aviso}`));
        return respuesta;
      });
    }

    const lista = await verificar('QUERY /products', 'QUERY', '/products', productsFixture, PRODUCT_LIST_QUERY);

    // El detalle y los relacionados se piden con un id VIGENTE (el API se resiembra y los ids cambian).
    const primerProducto = (lista.json as { data?: Array<{ id: string }> } | undefined)?.data?.[0];
    if (primerProducto) {
      await verificar(
        'GET /products/{id}',
        'GET',
        `/products/${primerProducto.id}`,
        productDetailFixture,
      );
      await verificar(
        'GET /products/{id}/related',
        'GET',
        `/products/${primerProducto.id}/related`,
        relatedFixture,
      );
    } else if (lista.estado === 200) {
      problemas.push('QUERY /products: la lista llegó vacía; no hay producto para pedir el detalle');
    }

    await verificar('GET /brands', 'GET', '/brands', brandsFixture);
    await verificar('GET /categories/tree', 'GET', '/categories/tree', categoriesFixture);

    avisos.forEach((aviso) => test.info().annotations.push({ type: 'no verificable', description: aviso }));

    expect(
      problemas,
      [
        'El API real ya no coincide con los fixtures:',
        ...problemas.map((p) => `  - ${p}`),
        'Si el cambio es esperado, actualiza los fixtures con: npm run fixtures:update',
      ].join('\n'),
    ).toEqual([]);
  });
});
