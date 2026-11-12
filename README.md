# sauce-labs-playwright

Pruebas automatizadas de https://practicesoftwaretesting.com con Playwright (TypeScript), patrón POM,
flows y principios SOLID.

## Configuración

1. `npm ci`
2. `npx playwright install`
3. Copia `.env.example` a `.env` y completa `CUSTOMER_EMAIL`, `CUSTOMER_PASSWORD` y
   `CUSTOMER_INVALID_PASSWORD`.

## Grupos de pruebas

| Script | Qué ejecuta |
|---|---|
| `npm run test:mock` | Comportamiento con el API mockeado (3 navegadores) y la prueba de contrato contra el API real |
| `npm run test:contract` | Solo la prueba de contrato (compara estructura del API real con los fixtures) |
| `npm run test:visual` | Visual testing **sin mocks**, contra el sitio real (`tests/visual/`) |
| `npm run test:visual-controlled` | Visual testing con **datos controlados** (`tests/visual-controlled/`) |
| `npm run fixtures:update` | Vuelve a capturar los fixtures desde el API real (`tests/mock/fixtures/`) |

Los scripts `test:visual:update` y `test:visual-controlled:update` regeneran las baselines del grupo
correspondiente. Máximo 2 workers (Cloudflare).

## Visual testing

- `tests/visual/`: sin mocks. Compara lo que el sitio muestra hoy, así que puede fallar si cambia su contenido.
- `tests/visual-controlled/`: solo toma fotos. Un fixture automático (`controlledApi`) entrega siempre las
  mismas respuestas del API y una única imagen local para todos los productos
  (`tests/visual-controlled/assets/producto.png`). Cualquier llamada a `api.practicesoftwaretesting.com`
  que no esté fijada hace fallar el test indicando método y ruta.
- Ambos grupos comparten `tests/visual/helpers.ts` (esperas, política de comparación, nombres de baseline).

> **Mantenimiento:** si se actualizan los fixtures (`npm run fixtures:update`), hay que regenerar y revisar
> las baselines de `visual-controlled` (`npm run test:visual-controlled:update`).

Las baselines se generaron en Windows con Chromium; en un CI con Linux hay que regenerarlas allí.
