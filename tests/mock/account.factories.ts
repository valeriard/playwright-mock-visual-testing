/**
 * Fábricas de datos FICTICIOS para la cuenta del usuario y el carrito (visual-controlled).
 *
 * A diferencia de factories.ts, no salen de fixtures capturados: la cuenta real tiene datos de una persona
 * y cambian entre ejecuciones. Aquí solo se copia la FORMA de las respuestas reales (campos y tipos);
 * los valores son inventados. Los productos sí vienen de las fábricas de factories.ts.
 */
import { crearDetalleProducto, crearProductos, ProductoLista } from './factories';

export interface PerfilUsuario {
  id: string;
  provider: string | null;
  first_name: string;
  last_name: string;
  phone: string | null;
  dob: string;
  email: string;
  totp_enabled: boolean;
  created_at: string;
  address: {
    street: string;
    house_number: string | null;
    city: string;
    state: string | null;
    country: string;
    postal_code: string | null;
  };
}

export function crearPerfilUsuario(cambios: Partial<PerfilUsuario> = {}): PerfilUsuario {
  return {
    id: 'usuario-ficticio',
    provider: null,
    first_name: 'Jane',
    last_name: 'Doe',
    phone: '0612345678',
    dob: '1990-01-15',
    email: 'jane.doe@example.com',
    totp_enabled: false,
    created_at: '2026-01-01 10:00:00',
    address: {
      street: 'Calle Falsa',
      house_number: '123',
      city: 'Springfield',
      state: 'Ejemplo',
      country: 'NL',
      postal_code: '1234AB',
    },
    ...cambios,
  };
}

/** Campos de producto que el API incluye dentro de favoritos y carritos (sin category ni brand). */
function productoResumido(producto: ProductoLista) {
  const { id, name, description, price, is_location_offer, is_rental, co2_rating, in_stock, is_eco_friendly, product_image } =
    producto;
  return { id, name, description, price, is_location_offer, is_rental, co2_rating, in_stock, is_eco_friendly, product_image };
}

/** `cantidad` favoritos con los primeros productos del fixture (0 = lista vacía). */
export function crearFavoritos(cantidad = 2) {
  return crearProductos()
    .data.slice(0, cantidad)
    .map((producto, i) => ({
      id: `favorito-${i + 1}`,
      user_id: 'usuario-ficticio',
      product_id: producto.id,
      product: productoResumido(producto),
    }));
}

export interface PaginaFacturas {
  current_page: number;
  data: object[];
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
}

/** Una página con `cantidad` facturas ficticias; `paginas` > 1 hace que el API declare más páginas. */
export function crearFacturas(cantidad = 5, paginas = 1): PaginaFacturas {
  const data = Array.from({ length: cantidad }, (_, i) => {
    const n = cantidad - i;
    return {
      id: `factura-${n}`,
      user_id: 'usuario-ficticio',
      invoice_number: `INV-2026000000${String(n).padStart(2, '0')}`,
      invoice_date: `2026-01-${String(n).padStart(2, '0')} 10:00:00`,
      status: 'COMPLETED',
      total: n * 12.5,
      subtotal: null,
      billing_street: `Calle Falsa ${n}`,
      billing_city: 'Springfield',
      billing_state: 'Ejemplo',
      billing_country: 'NL',
      billing_postal_code: '1234AB',
      additional_discount_percentage: null,
      additional_discount_amount: null,
      invoicelines: [],
      payment: { payment_method: 'cash-on-delivery' },
    };
  });
  return {
    current_page: 1,
    data,
    from: cantidad ? 1 : null,
    last_page: paginas,
    per_page: 15,
    to: cantidad || null,
    total: cantidad * paginas,
  };
}

/** Página de mensajes vacía (el estado normal de la cuenta de demostración). */
export function crearMensajesVacios() {
  return { current_page: 1, data: [], from: null, last_page: 1, per_page: 15, to: null, total: 0 };
}

export const ID_CARRITO = 'carrito-ficticio';

/** Carrito con `cantidad` unidades del producto del detalle. */
export function crearCarrito(cantidad = 1) {
  const detalle = crearDetalleProducto();
  const { id, name, description, price, is_location_offer, is_rental, co2_rating, in_stock, is_eco_friendly } = detalle;
  return {
    id: ID_CARRITO,
    additional_discount_percentage: null,
    lat: null,
    lng: null,
    cart_items: [
      {
        id: 'item-ficticio',
        quantity: cantidad,
        discount_percentage: null,
        cart_id: ID_CARRITO,
        product_id: id,
        product: { id, name, description, price, is_location_offer, is_rental, co2_rating, in_stock, is_eco_friendly },
      },
    ],
  };
}
