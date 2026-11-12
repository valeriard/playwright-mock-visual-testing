import path from 'node:path';
import { API_URL } from '../../src/data/realApi';
import { ApiMock } from '../../src/mocks/ApiMock';
import { ApiMocker } from '../../src/mocks/ApiMocker';
import { CatalogMock } from '../../src/mocks/CatalogMock';
import { SessionMock } from '../../src/mocks/SessionMock';
import { CartMock } from '../../src/mocks/CartMock';
import { fakeJwt } from '../../src/mocks/fakeJwt';
import { ProductDetailMock } from '../../src/mocks/ProductDetailMock';
import {
  crearCategorias,
  crearDetalleProducto,
  crearRelacionados,
  crearMarcas,
  crearNombresEspecificaciones,
  crearProductos,
} from '../mock/factories';
import { crearCarrito, crearPerfilUsuario, ID_CARRITO, PerfilUsuario } from '../mock/account.factories';
import { expect, test as visualTest } from '../visual/helpers';

/*
 * Visual tests with CONTROLLED DATA. They only take screenshots: page.route is used here for one
 * purpose, to serve the same data every time so the image is stable. Behaviour is not validated.
 * Everything else (VisualChecker, baseline names, masks, Allure labels) comes from ../visual/helpers.
 */
export { BASELINES, homeVolatileRegions, labelVisualTest } from '../visual/helpers';

/** The one product image every card shows (the real ones are served by the site, not by the API). */
const PRODUCT_IMAGE = path.resolve(__dirname, 'assets', 'producto.png');

const isRealApi = (url: URL): boolean => url.origin === API_URL;
const isProductImage = (url: URL): boolean => url.pathname.startsWith('/assets/img/products/');

const describir = (request: { method(): string; url(): string }): string =>
  `${request.method()} ${new URL(request.url()).pathname}`;

interface ControlledFixtures {
  /**
   * A signed-in visitor: the token the front looks for is in localStorage from the first load and
   * GET /users/me answers a FICTIONAL profile (see tests/mock/account.factories.ts). Returns that profile.
   * Endpoints of each account section are pinned by the test with `pin`.
   */
  sesionIniciada: PerfilUsuario;

  /** A cart with one unit of the factories' product: sessionStorage `cart_id` + GET /carts/{id}. */
  carritoControlado: ReturnType<typeof crearCarrito>;

  /**
   * Pins one more endpoint BEFORE navigation (a special state: empty list, error, out of stock...).
   * Registered after `controlledApi`, so it takes precedence over the default answers.
   */
  pin: (mock: ApiMock) => Promise<void>;

  /**
   * Pins GET /products/{id} and /related with the factories' product (in stock, with related products)
   * and returns it. Registered after `controlledApi`, so it takes precedence over its catch-all.
   */
  productoControlado: ReturnType<typeof crearDetalleProducto>;

  /**
   * Auto fixture. Pins every API call the home page makes and every product image, BEFORE navigation.
   * Any other call to the real API aborts and fails the test, naming method and path.
   * Its value is the list of API calls the page attempted (handy to debug).
   */
  controlledApi: string[];
}

export const test = visualTest.extend<ControlledFixtures>({
  controlledApi: [
    async ({ page }, use) => {
      const llamadas: string[] = [];
      const noControladas: string[] = [];

      page.on('request', (request) => {
        if (isRealApi(new URL(request.url()))) llamadas.push(describir(request));
      });

      // 1. Catch-all FIRST: Playwright tries the most recently registered route first,
      //    so every fixed route below takes precedence over this one.
      await page.route(isRealApi, (route) => {
        noControladas.push(describir(route.request()));
        return route.abort();
      });

      // 2. Fixed endpoints (same factories and mocks the mock tests use).
      await new ApiMocker([
        new CatalogMock({
          productos: crearProductos(),
          marcas: crearMarcas(),
          categorias: crearCategorias(),
          especificaciones: crearNombresEspecificaciones(),
        }),
        new SessionMock(), // /users/me without a token: 401, like a visitor without a session
      ]).apply(page);

      // 3. Product images: always the same local file.
      await page.route(isProductImage, (route) => route.fulfill({ path: PRODUCT_IMAGE, contentType: 'image/png' }));

      await use(llamadas);

      expect(noControladas, `Llamada no controlada a la API: ${noControladas.join(', ')}`).toEqual([]);
    },
    { auto: true },
  ],

  pin: async ({ page, controlledApi }, use) => {
    void controlledApi; // fixture dependency: its catch-all must be registered first
    await use((mock) => new ApiMocker([mock]).apply(page));
  },

  sesionIniciada: async ({ page, pin }, use) => {
    const perfil = crearPerfilUsuario();
    const token = fakeJwt();
    await page.addInitScript((t) => localStorage.setItem('auth-token', t), token);
    await pin(new SessionMock(perfil)); // after the default one: takes precedence
    await use(perfil);
  },

  carritoControlado: async ({ page, pin }, use) => {
    const carrito = crearCarrito();
    await page.addInitScript(
      ([id, cantidad]) => {
        sessionStorage.setItem('cart_id', id);
        sessionStorage.setItem('cart_quantity', cantidad);
      },
      [ID_CARRITO, '1'],
    );
    await pin(new CartMock(carrito));
    await use(carrito);
  },

  productoControlado: async ({ page, controlledApi }, use) => {
    void controlledApi; // fixture dependency: its catch-all must be registered first
    const detalle = crearDetalleProducto();
    await new ApiMocker([new ProductDetailMock(detalle, crearRelacionados())]).apply(page);
    await use(detalle);
  },
});

export { expect };
