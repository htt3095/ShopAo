# Backend Transfer Summary

## Paths
- New backend workspace: C:/Users/Dell/Downloads/custom/New folder/FinalProject-Inteliji
- Original backend (reference): C:/Users/Dell/Downloads/custom/FinalProject2

## Project type
- Java Spring Boot (Maven)
- Java version: 17 (from pom.xml)
- Key dependencies (from pom.xml):
  - `spring-boot-starter-web`
  - `spring-boot-starter-data-jpa`
  - `spring-boot-starter-security`
  - `spring-boot-starter-mail`
  - `mssql-jdbc` (Microsoft SQL Server driver)
  - `modelmapper`
  - `cloudinary-http44` (image uploads)
  - `jackson-datatype-jsr310` (date/time serialization)
  - `lombok` (provided)

## DB and schema
- The target database is `ShopGiay` (SQL Server).
- The original SQL script (schema) includes tables: `Accounts`, `Roles`, `Products`, `ProductVariants`, `VariantImages`, `Categories`, `Brands`, `Sizes`, `Colors`, `Carts`, `CartItems`, `Orders`, `OrderItems`, `ProductReviews`, `Vouchers`, `PaymentMethods`, `ProductCompares`, `Feedbacks`, `AccountVouchers`, `AccountRoles`.
- Key constraints and defaults: identity columns, foreign keys linking product→brand/category, variant→product/size/color, cart/order relationships, unique constraints on `product_code` and `gmail`.

## Expected REST endpoints (to map from frontend)
- Authentication: `/api/auth/login`, `/api/auth/register`, `/api/auth/google` (possible)
- Accounts: `/api/accounts/{id}`, `/api/accounts/profile`
- Products: `/api/products`, `/api/products/{id}`, `/api/products/{id}/variants`
- Categories/Brands: `/api/categories`, `/api/brands`
- Cart: `/api/cart`, `/api/cart/items`, `/api/cart/{id}`
- Orders: `/api/orders`, `/api/orders/{id}`
- Reviews: `/api/products/{id}/reviews`
- Vouchers: `/api/vouchers`, `/api/vouchers/apply`

> NOTE: These endpoints are inferred from frontend calls (`src/services/api.js`) and common REST patterns. Confirm exact mappings by inspecting controller classes in `src/main/java`.

## Important backend files to review (add links to file paths)
- Spring Boot application entry: `src/main/java/.../Application.java`
- Controllers: `src/main/java/.../controller/*Controller.java`
- Services: `src/main/java/.../service/*Service.java`
- Repositories (JPA): `src/main/java/.../repository/*Repository.java`
- DTOs / Models: `src/main/java/.../dto` and `src/main/java/.../model`
- Security configuration: `src/main/java/.../security` (if present)
- `application.properties` or `application.yml` for DB connection and Cloudinary settings

## How this file helps future analysis
- Use this as a quick reference to map frontend API calls to backend controllers.
- When reporting a bug, include the frontend route, the exact API request (method and URL), and this file helps identify corresponding backend controller and DB table.

## Next recommended actions
1. Run `mvn -q -DskipTests package` to build the backend and ensure dependencies resolve.
2. Search controller classes for the exact API endpoints and paste them under "Expected REST endpoints" above.
3. Add ER diagram or export from SQL Server for clearer relationship mapping.


---
Generated: 2026-05-22
