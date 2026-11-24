# Sauce Labs Playwright

Proyecto de automatización de pruebas para [Practice Software Testing](https://practicesoftwaretesting.com),
construido con **Playwright** y **TypeScript**. Combina pruebas funcionales con API mockeada, pruebas de
contrato contra el API real y visual testing (con y sin datos controlados).

## Tecnologías

- [Playwright Test](https://playwright.dev/) + TypeScript
- Allure y reporte HTML de Playwright
- dotenv (credenciales) y tsx (scripts)

## Arquitectura

El código sigue el patrón **Page Object Model** más una capa de **flows**, aplicando principios SOLID.

```
src/
├── pages/      Page Objects (y componentes como NavBar y Footer)
├── flows/      Flujos de negocio que combinan varias páginas (login, producto, inicio)
├── fixtures/   Fixtures de Playwright que inyectan las páginas
├── mocks/      Mocks del API (catálogo, login, carrito, cuenta, errores, timeouts)
├── data/       Datos de prueba y usuarios
├── visual/     Configuración de viewports para visual testing
└── setup/      Limpieza de reportes antes de cada ejecución
tests/
├── mock/               Pruebas funcionales con API mockeada + prueba de contrato
├── visual/             Visual testing contra el sitio real (sin mocks)
└── visual-controlled/  Visual testing con datos controlados
docs/                   Inventario de escenarios de visual testing
scripts/                Captura de fixtures desde el API real
```

## Requisitos previos

- Node.js (versión LTS recomendada)
- npm

## Instalación

```bash
npm ci
npx playwright install
```

Copia `.env.example` a `.env` y completa las credenciales:

```env
CUSTOMER_EMAIL=
CUSTOMER_PASSWORD=
CUSTOMER_INVALID_PASSWORD=
```

> El archivo `.env` contiene credenciales y no debe subirse al repositorio.

## Ejecución de pruebas

| Comando | Qué ejecuta |
|---|---|
| `npm test` | Todas las pruebas |
| `npm run test:mock` | Pruebas funcionales con API mockeada (Chromium, Firefox y WebKit) y prueba de contrato |
| `npm run test:mock:headed` | Igual que las mock, en Chromium con navegador visible |
| `npm run test:contract` | Compara la estructura del API real con los fixtures |
| `npm run test:visual` | Visual testing sin mocks, contra el sitio real (escritorio y móvil) |
| `npm run test:visual-controlled` | Visual testing con datos controlados (escritorio y móvil) |
| `npm run fixtures:update` | Recaptura los fixtures desde el API real |

Para regenerar las baselines de imágenes: `npm run test:visual:update` o
`npm run test:visual-controlled:update`.

## Estrategia de pruebas

### Pruebas con mocks y contrato
Validan el comportamiento de la interfaz con respuestas del API simuladas, incluyendo escenarios de error,
timeout y respuestas de servidor. La **prueba de contrato** es la única que consulta el API real: verifica
que su estructura siga coincidiendo con los fixtures de `tests/mock/fixtures/`.

### Visual testing
- **`tests/visual/`**: sin mocks. Compara lo que el sitio muestra hoy, por lo que puede fallar si cambia su contenido.
- **`tests/visual-controlled/`**: un fixture (`controlledApi`) entrega siempre las mismas respuestas y una única
  imagen local para todos los productos. Cualquier llamada al API no fijada hace fallar la prueba indicando
  método y ruta.

El inventario completo de escenarios está en [`docs/visual-scenarios.md`](docs/visual-scenarios.md).

> **Mantenimiento:** si actualizas los fixtures (`npm run fixtures:update`), regenera y revisa las baselines
> de `visual-controlled` con `npm run test:visual-controlled:update`.

## Reportes

```bash
npx playwright show-report      # Reporte HTML de Playwright
npm run allure:serve            # Allure: genera y abre en un paso
npm run allure:generate         # Genera allure-report
npm run allure:open             # Abre allure-report
```

## Notas

- Se usan máximo 2 workers en local (1 en CI) para no activar la protección de Cloudflare del sitio.
- Las baselines visuales se generaron en **Windows con Chromium**; en un CI con Linux hay que regenerarlas allí.
