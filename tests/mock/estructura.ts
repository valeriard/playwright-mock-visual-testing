/**
 * Comparación de ESTRUCTURA (campos y tipos, nunca valores) entre un fixture y una respuesta real.
 *
 * Reglas:
 * - Un campo `null` en cualquiera de los dos lados es compatible con cualquier tipo (puede ser opcional).
 * - Los objetos deben tener exactamente los mismos campos: se reporta el que falta y el que sobra.
 * - Los arrays se comparan por la estructura de su primer elemento. Si alguno está vacío no hay nada
 *   que comparar: se anota como "no verificable" en lugar de darlo por bueno o por malo.
 */

type Tipo = 'null' | 'boolean' | 'number' | 'string' | 'array' | 'object';

export interface Diferencia {
  ruta: string;
  detalle: string;
}

export interface ResultadoComparacion {
  diferencias: Diferencia[];
  noVerificables: string[];
}

function tipoDe(valor: unknown): Tipo {
  if (valor === null || valor === undefined) return 'null';
  if (Array.isArray(valor)) return 'array';
  if (typeof valor === 'boolean') return 'boolean';
  if (typeof valor === 'number') return 'number';
  if (typeof valor === 'string') return 'string';
  return 'object';
}

export function compararEstructura(esperado: unknown, real: unknown, ruta = '$'): ResultadoComparacion {
  const resultado: ResultadoComparacion = { diferencias: [], noVerificables: [] };
  comparar(esperado, real, ruta, resultado);
  return resultado;
}

function comparar(esperado: unknown, real: unknown, ruta: string, salida: ResultadoComparacion): void {
  const tipoEsperado = tipoDe(esperado);
  const tipoReal = tipoDe(real);

  if (tipoEsperado === 'null' || tipoReal === 'null') return;

  if (tipoEsperado !== tipoReal) {
    salida.diferencias.push({
      ruta,
      detalle: `tipo distinto (fixture: ${tipoEsperado}, API: ${tipoReal})`,
    });
    return;
  }

  if (tipoEsperado === 'array') {
    const lista = esperado as unknown[];
    const listaReal = real as unknown[];
    if (lista.length === 0 || listaReal.length === 0) {
      if (lista.length !== listaReal.length) {
        salida.noVerificables.push(
          `${ruta}[]: ${lista.length === 0 ? 'fixture' : 'API'} vacío; no se pueden comparar sus elementos`,
        );
      }
      return;
    }
    comparar(lista[0], listaReal[0], `${ruta}[]`, salida);
    return;
  }

  if (tipoEsperado === 'object') {
    const objetoEsperado = esperado as Record<string, unknown>;
    const objetoReal = real as Record<string, unknown>;
    const claves = new Set([...Object.keys(objetoEsperado), ...Object.keys(objetoReal)]);
    for (const clave of claves) {
      const rutaCampo = `${ruta}.${clave}`;
      if (!(clave in objetoReal)) {
        salida.diferencias.push({ ruta: rutaCampo, detalle: 'el API ya no devuelve este campo' });
      } else if (!(clave in objetoEsperado)) {
        salida.diferencias.push({ ruta: rutaCampo, detalle: 'campo nuevo en el API (no está en el fixture)' });
      } else {
        comparar(objetoEsperado[clave], objetoReal[clave], rutaCampo, salida);
      }
    }
  }
}
