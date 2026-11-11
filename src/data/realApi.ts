/** Datos del API real que comparten los mocks, el script de captura y la prueba de contrato. */

export const API_URL = 'https://api.practicesoftwaretesting.com';

/** Mismo cuerpo que envía la página al listar productos (método QUERY, filtros en el cuerpo). */
export const PRODUCT_LIST_QUERY = { page: '1', between: 'price,1,100', is_rental: 'false' };
