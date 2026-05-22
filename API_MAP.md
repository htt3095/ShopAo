# API_MAP — Frontend ↔ Backend

Base URL (frontend default): `VITE_API_URL` or `http://localhost:8080/api`

This file maps frontend API helper functions (in `src/services/api.js`) to backend controller endpoints (in `FinalProject-Inteliji/src/main/java/com/finalproject2/controller`). Use these names when reporting issues.

## Accounts
- Backend controller: `AccountController` (`/api/accounts`)
  - POST `/api/accounts` ← `authApi.register()`
  - POST `/api/accounts/login` ← `authApi.login()`
  - POST `/api/accounts/google` ← `authApi.loginWithGoogle()`
  - POST `/api/accounts/forgot-password/request` ← `authApi.requestPasswordResetCode()`
  - POST `/api/accounts/forgot-password/verify` ← `authApi.verifyPasswordResetCode()`
  - POST `/api/accounts/forgot-password/reset` ← `authApi.resetPassword()`
  - GET `/api/accounts` ← `accountsApi.getAll()`
  - GET `/api/accounts/{id}` ← `accountsApi.getById(id)`
  - PUT `/api/accounts/{id}` ← `accountsApi.update(id, data)`
  - POST `/api/accounts/{id}/upload-avatar` (file upload)

Files referencing accounts: `src/pages/LoginView.vue`, `src/pages/RegisterView.vue`, `src/pages/ProfileEdit.vue`

## Products
- Backend controller: `ProductController` (`/api/products`)
  - GET `/api/products` ← `productsApi.getAll()`
  - GET `/api/products/{id}` ← `productsApi.getById(id)`
  - GET `/api/products?categoryId=...` ← `productsApi.getByCategory()`
  - GET `/api/products?brandId=...` ← `productsApi.getByBrand()`
  - POST `/api/products` ← (admin create) via admin pages
  - PUT `/api/products/{id}` ← (admin update)
  - DELETE `/api/products/{id}` ← (admin delete)
  - POST `/api/products/{id}/upload-image` (cloudinary upload)

Files: `src/pages/ProductView.vue`, `src/pages/AdminProductsView.vue`, `src/pages/HomeView.vue`

## Variants
- Backend controller: `ProductVariantController` (`/api/variants`)
  - GET `/api/variants` ← `variantsApi.getAll()`
  - GET `/api/variants/{id}` ← `variantsApi.getById()`
  - GET `/api/variants?productId=...` ← `variantsApi.getByProductId()`
  - POST `/api/variants` ← (admin)
  - PUT `/api/variants/{id}` ← (admin)
  - DELETE `/api/variants/{id}` ← (admin)
  - POST `/api/variants/{id}/upload-image` ← upload image for variant
  - POST `/api/variants/{id}/add-extra-image` ← add extra image
  - DELETE `/api/variants/{id}/extra-images/{index}` ← remove extra image
  - PUT `/api/variants/{id}/extra-images` ← update extra images

Files: `src/pages/ProductDetailView.vue`, `src/pages/AdminInventoryView.vue`

## Reviews
- Backend controller: `ProductReviewController` (`/api/reviews`)
  - GET `/api/reviews` ← `reviewsApi.getAll()` or `getByProductId()` or `getByAccountId()`
  - POST `/api/reviews` ← `reviewsApi.create()`
  - PUT `/api/reviews/{id}` ← `reviewsApi.update()`
  - DELETE `/api/reviews/{id}` ← `reviewsApi.delete()`

Files: `src/pages/ReviewFormView.vue`, `src/pages/ProductDetailView.vue`

## Brands & Categories
- `BrandController` (`/api/brands`) ← `brandsApi.*` (getAll, getById, create, update, delete)
- `CategoryController` (`/api/categories`) ← `categoriesApi.*`

Files: `src/pages/BrandView.vue`, admin brand/category pages

## Cart
- Backend controller: `CartController` (`/api/cart`)
  - POST `/api/cart/init` ← called by some flows to ensure cart exists
  - GET `/api/cart?accountId={accountId}` ← `cartApi.getCart(accountId)`
  - POST `/api/cart/add` ← `cartApi.addToCart()` (payload: accountId, variantId, quantity)
  - PUT `/api/cart/update/{cartItemId}` ← `cartApi.updateCartItem(cartItemId, quantity)`
  - DELETE `/api/cart/remove/{cartItemId}` ← `cartApi.removeCartItem()`
  - DELETE `/api/cart/clear?accountId={accountId}` ← clear cart

Files: `src/stores/cart.js`, `src/pages/CartView.vue`, `src/pages/CheckoutView.vue`

## Orders
- Backend controller: `OrderController` (`/api/orders`)
  - POST `/api/orders` ← `ordersApi.createOrder(orderData)`
  - GET `/api/orders?accountId=...` ← `ordersApi.getUserOrders()`
  - GET `/api/orders/{id}` ← `ordersApi.getOrderById()`
  - PUT `/api/orders/{id}` ← admin updates order status
  - GET `/api/orders/account/{accountId}` ← additional listing

Files: `src/pages/CheckoutView.vue`, `src/pages/OrderHistoryView.vue`, `src/pages/AdminOrdersView.vue`, `src/pages/AdminPOSView.vue`

## Vouchers
- Backend controller: `VoucherController` (`/api/vouchers`)
  - GET `/api/vouchers` ← `vouchersApi.getAllVouchers()`
  - GET `/api/vouchers/{voucherId}` ← get voucher by id
  - GET `/api/vouchers/apply?code=...&orderTotal=...` ← preview voucher (`vouchersApi.validateVoucher` uses `/validate` path but backend exposes `/apply`)
  - POST `/api/vouchers/use?code=...&orderTotal=...` ← `use` endpoint
  - GET `/api/vouchers/status/active` ← get active vouchers
  - POST `/api/vouchers` ← create voucher (admin)
  - PUT `/api/vouchers/{id}` ← update voucher
  - DELETE `/api/vouchers/{id}` ← delete

Files: `src/pages/HomeView.vue`, `src/pages/AdminVouchersView.vue`, `src/pages/AdminPOSView.vue`

## Payment
- Backend controller: `PaymentController` (`/api/payment`)
  - POST `/api/payment/vnpay/create` ← create VNPay payment and return `paymentUrl`
  - GET `/api/payment/vnpay/ipn` ← VNPay IPN callback
  - GET `/api/payment/vnpay/return` ← VNPay return URL

Files: `src/pages/CheckoutView.vue`, `src/pages/VnpayReturnView.vue`, `src/pages/AdminPOSView.vue`

## Misc
- Colors: `/api/colors` ← `colorsApi.getAll()`
- Sizes: `/api/sizes` ← `sizesApi.getAll()`
- Payment methods: `/api/payment-methods` (check backend)

## Hardcoded URLs found in frontend
- `http://localhost:8080/api/vouchers` used directly in `src/pages/AdminPOSView.vue` and `src/pages/HomeView.vue`
- Several pages define local `API_BASE_URL` instead of using `src/services/api.js` (e.g., `ProfileEdit.vue`, `AdminSettingsView.vue`) — consider standardizing to `authApi`/`productsApi` helpers.
- Image resolution: `BrandView.vue` builds `http://localhost:8080/images/...` in places — better to use `resolveImageUrl()` from `src/services/api.js`.

## Next steps
- Standardize frontend to use `src/services/api.js` everywhere.
- Optionally produce `API_EXAMPLES.md` with sample requests and expected responses for main flows (login, add-to-cart, create-order).

Generated: 2026-05-22
