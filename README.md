# Sauce Labs Playwright

🇬🇧 English · [🇪🇸 Español](#sauce-labs-playwright-español)

Test automation project for [Practice Software Testing](https://practicesoftwaretesting.com),
built with **Playwright** and **TypeScript**. It combines functional tests with a mocked API, contract tests
against the real API, and visual testing (with and without controlled data).

## Tech stack

- [Playwright Test](https://playwright.dev/) + TypeScript
- Allure and Playwright HTML report
- dotenv (credentials) and tsx (scripts)

## Architecture

The code follows the **Page Object Model** plus a **flows** layer, applying SOLID principles.

```
src/
├── pages/      Page Objects (and components such as NavBar and Footer)
├── flows/      Business flows combining several pages (login, product, home)
├── fixtures/   Playwright fixtures that inject the pages
├── mocks/      API mocks (catalog, login, cart, account, errors, timeouts)
├── data/       Test data and users
├── visual/     Viewport configuration for visual testing
└── setup/      Report cleanup before each run
tests/
├── mock/               Functional tests with mocked API + contract test
├── visual/             Visual testing against the real site (no mocks)
└── visual-controlled/  Visual testing with controlled data
docs/                   Visual testing scenario inventory
scripts/                Fixture capture from the real API
```

## Prerequisites

- Node.js (LTS recommended)
- npm

## Installation

```bash
npm ci
npx playwright install
```

Copy `.env.example` to `.env` and fill in the credentials:

```env
CUSTOMER_EMAIL=
CUSTOMER_PASSWORD=
CUSTOMER_INVALID_PASSWORD=
```

> The `.env` file contains credentials and must not be committed to the repository.

## Running tests

| Command | What it runs |
|---|---|
| `npm test` | All tests |
| `npm run test:mock` | Functional tests with mocked API (Chromium, Firefox and WebKit) plus the contract test |
| `npm run test:mock:headed` | Same as mock tests, in Chromium with a visible browser |
| `npm run test:contract` | Compares the real API structure against the fixtures |
| `npm run test:visual` | Visual testing without mocks, against the real site (desktop and mobile) |
| `npm run test:visual-controlled` | Visual testing with controlled data (desktop and mobile) |
| `npm run fixtures:update` | Recaptures the fixtures from the real API |

To regenerate image baselines: `npm run test:visual:update` or `npm run test:visual-controlled:update`.

## Testing strategy

### Mock and contract tests
They validate UI behavior against simulated API responses, including error, timeout and server-failure
scenarios. The **contract test** is the only one that calls the real API: it checks that its structure still
matches the fixtures in `tests/mock/fixtures/`.

### Visual testing
- **`tests/visual/`**: no mocks. Compares what the site shows today, so it may fail if its content changes.
- **`tests/visual-controlled/`**: a fixture (`controlledApi`) always returns the same responses and a single
  local image for every product. Any API call that is not pinned fails the test, reporting the method and path.

The full scenario inventory is in [`docs/visual-scenarios.md`](docs/visual-scenarios.md) (in Spanish).

> **Maintenance:** if you update the fixtures (`npm run fixtures:update`), regenerate and review the
> `visual-controlled` baselines with `npm run test:visual-controlled:update`.

## Reports

```bash
npx playwright show-report      # Playwright HTML report
npm run allure:serve            # Allure: generate and open in one step
npm run allure:generate         # Generate allure-report
npm run allure:open             # Open allure-report
```

## Notes

- At most 2 workers locally (1 on CI) to avoid triggering the site's Cloudflare protection.
- Visual baselines were generated on **Windows with Chromium**; on a Linux CI they must be regenerated there.

---

# Sauce Labs Playwright (Español)

[🇬🇧 English](#sauce-labs-playwright) · 🇪🇸 Español

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
