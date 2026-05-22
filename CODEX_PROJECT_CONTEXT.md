# Codex Project Context

This file is for future Codex sessions working on this project. Read it before making changes.

## Repository Mapping

- GitHub: `https://github.com/htt3095/FinalProject.git`
- Backend branch: `master`
- Frontend branch: `vue`
- Local frontend path: `C:\Users\Dell\Downloads\custom\FinalProject-1`
- Local backend path: `C:\Users\Dell\Downloads\custom\FinalProject2`

The two local folders are separate working copies. The frontend folder is the current writable workspace for this Codex session.

Git may report "dubious ownership" in this environment because the folders are owned by the Windows user `Dell` while Codex runs as `CodexSandboxOffline`. Avoid changing global git config unless the user asks or git operations are required.

## Frontend Overview

Frontend stack:

- Vue 3 with Vite
- Pinia for state
- Vue Router
- Vuetify and Tailwind CSS
- Fetch API/axios dependency, but most API calls use `fetch`

Important frontend files:

- `package.json`: scripts are `npm run dev`, `npm run build`, `npm run preview`, `npm run lint`
- `vite.config.mjs`: dev server runs on port `3002` with strict port enabled
- `src/router/index.js`: route definitions and simple route guards
- `src/services/api.js`: main backend API facade and admin normalization layer
- `src/services/orders.js`: cart, checkout, order, voucher, and payment API helpers
- `src/stores/products.js`: product, brand, category, variant store
- `src/stores/cart.js`: cart store, backend sync, localStorage fallback
- `src/components/admin/AdminShell.vue`: shared admin layout
- `src/pages/Admin*.vue`: admin screens

Vite proxy:

- `/api` -> `http://localhost:8080`
- `/images` -> `http://localhost:8080`

Frontend API base:

- `src/services/api.js` and `src/services/orders.js` use `import.meta.env.VITE_API_URL || "http://localhost:8080/api"`
- `.env.example` exists. Use `VITE_API_URL` when the backend is not on local port `8080`.

## Backend Overview

Backend stack:

- Spring Boot
- Java 17
- Maven
- SQL Server
- Spring Data JPA
- Spring Security, currently configured permissively
- Cloudinary upload support
- Google login support
- Gmail SMTP support

Active backend app appears to be the root project in `FinalProject2`, package `com.finalproject2`.

Important backend files:

- `pom.xml`: root backend Maven project
- `src/main/resources/application.properties`: database, upload, Cloudinary, Google, and mail config
- `src/main/java/com/finalproject2/FinalProject2Application.java`: app entry point
- `src/main/java/com/finalproject2/controller/*Controller.java`: REST controllers
- `src/main/java/com/finalproject2/service/*Service*.java`: business logic
- `src/main/java/com/finalproject2/entity/*.java`: JPA entities
- `src/main/java/com/finalproject2/model/request/*.java`: request DTOs
- `src/main/java/com/finalproject2/model/response/*.java`: response DTOs
- `src/main/java/com/finalproject2/repository/*.java`: JPA repositories
- `src/main/java/com/finalproject2/SecurityConfiguration/WebConfig.java`: CORS
- `src/main/java/com/finalproject2/SecurityConfiguration/SecurityConfig.java`: password encoder/security chain

The backend folder also contains nested `FinalProject` and `InternshipProject` projects. Treat those as historical/reference material unless the user explicitly asks about them. The active backend used by the frontend is the root `com.finalproject2` app.

## Backend Runtime Notes

`application.properties` currently points to:

- SQL Server: `jdbc:sqlserver://localhost:1433;databaseName=ShopGiay;encrypt=true;trustServerCertificate=true;`
- Username: `sa`
- Password: present in properties
- `spring.jpa.hibernate.ddl-auto=update`
- static resources from `classpath:/static/` and `file:public/`

The properties file contains real service credentials for Cloudinary, Google client ID, and Gmail SMTP. Do not copy these into public documentation, commits, chat output, or examples. Prefer moving secrets to environment variables if asked to harden the project.

## Database Schema Notes

The SQL Server database is `ShopGiay`. The user provided an SSMS "Generate Scripts" schema export on 2026-05-16. Keep this schema in mind when changing backend entities, DTOs, or frontend normalization.

Main tables:

- `Accounts`: `id int identity`, `account_code`, `username`, unique required `gmail`, required `password_hash`, `phone`, `address`, `img_url`, `created_at`, `is_active`
- `Roles`: `id int identity`, `name`; allowed values are `USER`, `ADMIN`, `GUEST`
- `AccountRoles`: join table with composite key `(account_id, role_id)`
- `Brands`: `id bigint identity`, `name`, `logo_url`, also has duplicate-style `logoUrl`
- `Categories`: `id bigint identity`, `name`, `image_url`
- `Colors`: `id bigint identity`, `name`, `hex_code`, also has duplicate-style `hexCode`
- `Sizes`: `id bigint identity`, `name`
- `Products`: `id bigint identity`, required `name`, unique required `product_code`, `description`, required `category_id`, required `brand_id`, `status`, `image_url`, `created_at`, `updatedAt`
- `ProductVariants`: `id bigint identity`, required `product_id`, `size_id`, `color_id`, `price`, required `stock_quantity`, `image_url`, `updated_at`
- `VariantImages`: `variant_id`, `image_url`
- `Carts`: `id bigint identity`, unique required `account_id`
- `CartItems`: `id bigint identity`, required `cart_id`, required `variant_id`, required `quantity`
- `Orders`: `id bigint identity`, `account_id`, `voucher_id`, `fullname`, `phone`, required `shipping_address`, required `total_money`, `discount_amount`, required `final_amount`, required `payment_method_id`, `payment_status`, `status`, `created_at`, `email`
- `OrderItems`: `id bigint identity`, required `order_id`, required `variant_id`, `price`, required `quantity`
- `PaymentMethods`: `id bigint identity`, `name`
- `Vouchers`: `id bigint identity`, unique `code`, `discount_type`, required `discount_value`, `min_order_value`, `start_date`, `end_date`, `usage_limit`, `used_count`, `is_active`, `created_at`, `updated_at`
- `AccountVouchers`: `id int identity`, `account_id`, `voucher_id`, `used_at`
- `ProductReviews`: `id bigint identity`, required `product_id`, required `account_id`, `rating`, `comment`, `created_at`; unique `(product_id, account_id)`
- `ProductCompares`: composite key `(account_id, product_id)`
- `Feedbacks`: `id bigint identity`, `account_id`, `title`, required `content`, `admin_reply`, `created_at`

Important database constraints/defaults:

- `Accounts.account_code` defaults to `ACC` plus a six-digit value from sequence `AccountSeq`
- `Accounts.created_at` defaults to `getdate()`
- `Accounts.is_active` defaults to `1`
- `Products.status` defaults to `AVAILABLE`; allowed statuses are `AVAILABLE`, `OUT_OF_STOCK`, `HIDDEN`
- `ProductVariants.stock_quantity >= 0`
- `ProductVariants` has unique `(product_id, size_id, color_id)`
- `CartItems.quantity > 0`
- `CartItems` has unique `(cart_id, variant_id)`
- `Orders.discount_amount` defaults to `0`
- `Orders.payment_status` defaults to `PENDING`; allowed values are `PENDING`, `PAID`, `REFUNDED`
- `Orders.status` defaults to `NEW`; allowed values are `NEW`, `CONFIRMED`, `SHIPPING`, `SUCCESS`, `CANCELLED`, `RETURN_REQUEST`, `RETURNED`
- `ProductReviews.rating` must be between `1` and `5`
- `Vouchers.discount_type` must be `PERCENT` or `AMOUNT`
- `Vouchers.min_order_value` defaults to `0`
- `Vouchers.usage_limit` defaults to `100`
- `Vouchers.used_count` defaults to `0`
- `Vouchers.is_active` defaults to `1`

Schema compatibility cautions:

- The database mixes snake_case and camelCase columns, for example `logo_url` plus `logoUrl`, `hex_code` plus `hexCode`, and `updatedAt`. Keep frontend/backend normalization tolerant.
- Several foreign keys do not cascade deletes. Hard deletes for accounts, products, variants, brands, vouchers, and orders can fail once referenced. Prefer soft-delete/status updates in user-facing admin flows.
- `Orders.status` allows `RETURN_REQUEST`, while frontend normalizers currently use/expect `RETURNING` in some places. Map both values carefully.
- `ProductVariants.image_url` and `VariantImages.image_url` are `varchar(255)`, while `Products.image_url` is `varchar(2048)`. Cloudinary URLs may fit products but could exceed variant image column length if long transformations are used.
- The generated SQL includes physical file paths under `E:\MSSQL13.MSSQLSERVER\...`; do not assume those paths exist on another machine.

Current CORS only allows:

- `http://localhost:3002`
- `http://127.0.0.1:3002`

This matches the frontend dev server port in `vite.config.mjs`.

Current security:

- CSRF disabled
- stateless session policy
- `/api/accounts/**` permit all
- all other requests also permit all

So admin protection is mostly frontend route guarding, not backend authorization.

## Main API Endpoints Observed

Backend controllers expose:

- `/api/accounts`
- `/api/accounts/{id}`
- `/api/accounts/login`
- `/api/accounts/google`
- `/api/accounts/forgot-password/request`
- `/api/accounts/forgot-password/verify`
- `/api/accounts/forgot-password/reset`
- `/api/accounts/{id}/upload-avatar`
- `/api/products`
- `/api/products/{id}`
- `/api/products/{id}/upload-image`
- `/api/variants`
- `/api/variants/{id}`
- `/api/variants/{id}/upload-image`
- `/api/variants/{id}/add-extra-image`
- `/api/variants/{id}/extra-images/{index}`
- `/api/variants/{id}/extra-images`
- `/api/brands`
- `/api/brands/{id}`
- `/api/categories`
- `/api/categories/{id}`
- `/api/colors`
- `/api/sizes`
- `/api/reviews`
- `/api/reviews/{id}`
- `/api/cart`
- `/api/cart/init`
- `/api/cart/add`
- `/api/cart/update/{cartItemId}`
- `/api/cart/remove/{cartItemId}`
- `/api/cart/clear`
- `/api/orders`
- `/api/orders/{id}`
- `/api/orders/account/{accountId}`
- `/api/vouchers`
- `/api/vouchers/{voucherId}`
- `/api/vouchers/apply`
- `/api/vouchers/use`
- `/api/vouchers/status/active`

Important mismatch to watch:

- `src/services/api.js` has an older `cartApi` using `/carts/{accountId}` and `/cart-items`.
- `src/services/orders.js` has the newer cart API using `/cart?accountId=...`, `/cart/add`, `/cart/update/{cartItemId}`, `/cart/remove/{cartItemId}`, `/cart/clear`.
- `src/stores/cart.js` imports `cartAPI` from `src/services/orders.js`, so the active cart flow uses the newer backend-compatible endpoints.

## Frontend Data Normalization Patterns

The frontend frequently accepts both camelCase and snake_case backend fields. Preserve that style when fixing API bugs.

Examples already handled:

- `accountId` / `account_id`
- `productId` / `product_id`
- `brandId` / `brand_id`
- `categoryId` / `category_id`
- `imageUrl` / `image_url`
- `stockQuantity` / `stock_quantity`
- `paymentStatus` / `payment_status`
- `finalAmount` / `final_amount`

`src/services/api.js` contains many admin helpers:

- list payload extraction from arrays, `content`, `list`, or `data`
- role normalization
- boolean normalization
- order/payment status normalization
- product/variant/account/voucher normalization
- soft-delete fallbacks for entities that cannot be hard-deleted

When adding frontend features, prefer extending these normalizers rather than duplicating one-off parsing inside pages.

## Auth And Local Storage

Login state is held in localStorage, mainly:

- `user`
- `userRole`
- `cart`

Route guards in `src/router/index.js`:

- checkout requires a valid account id in `localStorage.user`
- admin routes require role exactly `ADMIN`

Role resolution is frontend-only in the router. Backend does not currently enforce admin authorization.

## Admin Customers Page

Active IDE file when this note was created:

- `src/pages/AdminCustomersView.vue`

Current behavior:

- Uses `AdminShell`
- Calls `adminApi.getCustomerAccounts()`
- Filters out `ADMIN` and `GUEST` in the API normalization layer
- Supports search and active/locked filter
- Can create/update accounts via `adminApi.createAccount` and `adminApi.updateAccount`
- Delete attempts hard delete first, then falls back to soft disabling `isActive=false`

Important compatibility detail:

- Backend `AccountController` supports `PUT /api/accounts/{id}` but not `PATCH`.
- `adminApi.updateAccount` tries `PUT`, then `PATCH`, so this is compatible.
- Backend `AccountController` supports `DELETE /api/accounts/{id}`. If delete fails because of references, frontend soft-disables the account.

## Encoding Issue To Watch

Several frontend Vue files display mojibake text such as `Quáº£n lÃ½` instead of proper Vietnamese. This likely means text was saved or decoded with the wrong encoding at some point. Be careful when editing Vietnamese UI strings:

- Preserve existing file encoding unless deliberately fixing text.
- If fixing Vietnamese labels, verify in browser after editing.
- Avoid broad automated rewrites of UI text.

## Local Development Commands

Frontend:

```powershell
cd C:\Users\Dell\Downloads\custom\FinalProject-1
npm run dev
npm run build
```

Backend:

```powershell
cd C:\Users\Dell\Downloads\custom\FinalProject2
.\mvnw.cmd spring-boot:run
```

Expected local URLs:

- Frontend: `http://localhost:3002`
- Backend API: `http://localhost:8080/api`
- Backend static images: `http://localhost:8080/images/...`

## Working Guidelines For Future Codex Sessions

1. Start by reading this file and the exact page/service involved.
2. For frontend API fixes, inspect `src/services/api.js` and `src/services/orders.js` first.
3. For backend contract fixes, inspect the matching controller, request DTO, response DTO, service, and entity.
4. Preserve compatibility with both direct list responses and Spring Page-style responses.
5. Preserve camelCase/snake_case tolerance unless the backend contract is made strict everywhere.
6. Do not assume nested backend projects are active.
7. Do not expose credentials from backend properties.
8. If a frontend admin action fails due to missing backend endpoint, either add a backend endpoint on `master` or add a narrow fallback in `adminApi`; document which approach was used.
9. Avoid destructive git commands. The worktree may have user changes.
10. After frontend changes, run `npm run build` when feasible. After backend changes, run `.\mvnw.cmd test` or targeted Maven tests when feasible.

## External Project Reference

Teacher-provided YouTube reference:

- `https://www.youtube.com/watch?v=6jATVOF-ZLw&list=PLuj-4yRnzmrgdfrr7fG16epG-Hg4yoxxv&index=3`

User context:

- The teacher sent this video as a reference project.
- The referenced project was considered fairly decent by the teacher.
- The referenced project was used as a graduation project, so treat it as a quality benchmark for expected scope, polish, and presentation.

Codex note:

- The YouTube page metadata/transcript was not accessible from the Codex environment when this was added, so do not assume the video's exact title or contents unless the user provides a transcript/screenshots or asks Codex to inspect it in a browser-capable workflow.
- When comparing this project against the reference, focus on practical graduation-project quality: complete CRUD/admin workflows, reliable API integration, clear database consistency, usable UI, validation/error handling, and a coherent demo path.

## Context Created In This Session

Created on 2026-05-16.

Initial note created on 2026-05-16.

## Change Log For Codex

2026-05-16:

- Checkout address UX changed from province/district/ward dropdowns to one freeform address input in `src/pages/CheckoutView.vue`.
- Checkout still uses Nominatim/OSRM for shipping fee calculation. The typed address is now the canonical shipping address to avoid duplicated address strings after auto-detection.
- Admin order edit rules in `src/pages/AdminOrdersView.vue` were revised:
  - Prepaid payment methods no longer force `PAID` before delivery; `PENDING` is valid before `SUCCESS`.
  - COD remains `PENDING` until delivery success.
  - `SUCCESS` requires `PAID`.
  - Return flow now uses backend-compatible `RETURN_REQUEST`, then `RETURNED`.
  - `CANCELLED` and `RETURNED` are final states.
- Order status normalization in `src/services/api.js` and `src/services/orders.js` now maps return-in-progress to `RETURN_REQUEST` for backend compatibility.
- Product selling status was moved out of the product admin UI and into variants:
  - `src/pages/AdminProductsView.vue` no longer shows/edits product status.
  - `src/pages/AdminInventoryView.vue` now shows and edits variant status: `SELLING`, `OUT_OF_STOCK`, `HIDDEN`.
  - `src/services/api.js` and `src/stores/products.js` normalize variant status.
  - `src/pages/ProductDetailView.vue` blocks add-to-cart for non-selling variants and shows selected variant status.
  - `src/pages/ShopView.vue` shows product-level variant availability indicators based on variant statuses and stock.
  - `src/pages/AdminPOSView.vue` filters out hidden/out-of-stock variants.
- Backend variant persistence was added:
  - `ProductVariant` now has `status`.
  - `ProductVariantRequest` and `ProductVariantResponse` include `status`.
  - `ProductVariantServiceImpl` normalizes variant statuses and marks FK-blocked deletes as `HIDDEN`.
- Verification:
  - `npm run build` passed after running outside the sandbox due a Windows path permission issue.
  - `.\mvnw.cmd test` passed. Maven logged an existing Hibernate DDL warning about altering `Accounts.created_at`, but tests completed with build success.
- Admin order table UI was later adjusted for usability:
  - Sticky action column on the right.
  - Sticky ID column on the left.
  - Top horizontal scrollbar synced with the table scroll.
  - Header row uses a unified muted admin surface instead of mismatched sticky-cell colors.
  - Future UI fixes should check both light and dark theme cohesion, especially when using sticky table cells, custom scrollbars, and admin card surfaces.
