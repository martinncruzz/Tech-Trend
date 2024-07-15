# 🛒 Tech-Trend

Welcome to Tech-Trend! An e-commerce platform developed with Angular and Nest. This project aims to provide a seamless and efficient online shopping experience, integrating various essential features for managing products, users, and orders.

![image](https://github.com/user-attachments/assets/b7d16805-6104-4c92-bfc9-2af1fcac664d)

> [!IMPORTANT]
> Please note that this is a personal project; all products are examples, and payments are not linked to any actual accounts.

## 🚀 Technologies Used

- **Frontend:** Angular
- **Backend:** Nest
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **Integrated Services:** Stripe and Cloudinary

## ✨ Features

- **🔒 Authentication and Authorization:** Secure login and role management system (user and admin).
- **🛍️ Product Catalog:** View, filter, and search products.
- **🛒 Shopping Cart:** Users can add, update, and remove products from their cart.
- **📦 Order Management:** Place orders with payment integration via Stripe.
- **📊 Admin Dashboard:** Manage products and categories, including image uploads.
- **📈 Charts and Statistics:** View statistics on products, orders, users, and categories.

## 🚧 Upcoming Improvements

- **Payment Methods:** Add payment methods like PayPal and MercadoPago.
- **Product Reviews:** Section for users to review products.
- **Featured Products:** Display featured products based on user reviews.

## ⚙️ Running the Project in Development Mode

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Martinchx/Tech-Trend
   cd Tech-Trend
   ```

2. **Backend:**

   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Configure environment variables (.env):

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

   - Start the database container:
     ```bash
     docker compose up -d
     ```
   - Run Prisma migrations:
     ```bash
     npx prisma migrate dev
     ```
   - Start the server:
     ```bash
     npm run start:dev
     ```

3. **Frontend:**

   - Navigate to the frontend directory:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Configure environment variables (.env):
     ```env
     NG_APP_BACKEND_URL = http://localhost:3000/api
     ```
   - Start the Angular application:
     ```bash
     ng serve
     ```
