# 🛒 Tech-Trend

Bienvenido a Tech-Trend! Un e-commerce desarrollado con Angular y NestJS. Este proyecto está diseñado para ofrecer una experiencia de compra en línea fluida y eficiente, integrando diversas funcionalidades esenciales para la gestión de productos, usuarios y órdenes.

![image](https://github.com/user-attachments/assets/b7d16805-6104-4c92-bfc9-2af1fcac664d)

> [!IMPORTANT]
> Cabe recalcar que es un proyecto personal, por lo que todos los productos son de ejemplo, y los pagos no estan vinculados a ninguna cuenta.

## 🚀 Tecnologías Utilizadas

- **Frontend:** Angular
- **Backend:** NestJS
- **Base de Datos:** PostgreSQL
- **Autenticación:** JWT (JSON Web Tokens)
- **Servicios Integrados:** Stripe y Cloudinary

## ✨ Funcionalidades

- **🔒 Autenticación y Autorización:** Sistema seguro de login y gestión de roles (usuario y administrador).
- **🛍️ Catálogo de Productos:** Visualización, filtrado y búsqueda de productos.
- **🛒 Carrito de Compras:** Los usuarios pueden agregar, actualizar y eliminar productos en su carrito.
- **📦 Gestión de Órdenes:** Realización de órdenes con integración de pago mediante Stripe.
- **📊 Dashboard Administrativo:** Gestión de productos y categorías, incluyendo la carga de imágenes.
- **📈 Gráficos y Estadísticas:** Visualización de estadísticas sobre productos, ordenes, usuarios y categorías.

## 🚧 Próximas Mejoras

- **Métodos de Pago:** Adición de métodos de pago como PayPal y MercadoPago.
- **Valoraciones de Productos:** Sección para que los usuarios valoren los productos.
- **Productos Destacados:** Mostrar productos destacados basados en valoraciones de usuarios.

## ⚙️ Levantar el proyecto en modo de desarrollo

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/Martinchx/Tech-Trend
   cd Tech-Trend
   ```

2. **Backend:**

   - Navegar al directorio backend:
     ```bash
     cd backend
     ```
   - Instalar dependencias:
     ```bash
     npm install
     ```
   - Configurar las variables de entorno (`.env`):

     ```env
     PORT = 3000

     FRONTEND_URL = http://localhost:4200
     BACKEND_URL = http://localhost:3000/api

     DATABASE_URL = postgresql://admin:admin@localhost:5432/tech-trend

     JWT_SECRET = your_jwt_secret

     CLOUDINARY_NAME = your_cloudinary_name
     CLOUDINARY_API_KEY = your_cloudinary_api_key
     CLOUDINARY_API_SECRET = your_cloudinary_api_secret

     STRIPE_SECRET_KEY = your_stripe_secret_key
     STRIPE_ENDPOINT_SECRET = your_stripe_endpoint_secret
     ```

   - Levantar contenedor de la base de datos
     ```bash
     docker compose up -d
     ```
   - Ejecutar migraciones de Prisma:
     ```bash
     npx prisma migrate dev
     ```
   - Iniciar el servidor:
     ```bash
     npm run start:dev
     ```

3. **Frontend:**
   - Navegar al directorio frontend:
     ```bash
     cd frontend
     ```
   - Instalar dependencias:
     ```bash
     npm install
     ```
   - Configurar las variables de entorno (`.env`):
     ```env
     NG_APP_BACKEND_URL = http://localhost:3000/api
     ```
   - Iniciar la aplicación Angular:
     ```bash
     ng serve
     ```
