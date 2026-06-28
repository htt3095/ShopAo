SET IDENTITY_INSERT [dbo].[Sizes] ON 

INSERT [dbo].[Sizes] ([id], [name]) VALUES (1, N'S')
INSERT [dbo].[Sizes] ([id], [name]) VALUES (2, N'M')
INSERT [dbo].[Sizes] ([id], [name]) VALUES (3, N'L')
INSERT [dbo].[Sizes] ([id], [name]) VALUES (4, N'XL')
INSERT [dbo].[Sizes] ([id], [name]) VALUES (5, N'XXL')
SET IDENTITY_INSERT [dbo].[Sizes] OFF
SET IDENTITY_INSERT [dbo].[Colors] ON 

INSERT [dbo].[Colors] ([id], [hex_code], [hexCode], [name]) VALUES (1, NULL, N'#000000', N'Đen')
INSERT [dbo].[Colors] ([id], [hex_code], [hexCode], [name]) VALUES (2, NULL, N'#FFFFFF', N'Trắng')
INSERT [dbo].[Colors] ([id], [hex_code], [hexCode], [name]) VALUES (3, NULL, N'#000080', N'Xanh Navy')
INSERT [dbo].[Colors] ([id], [hex_code], [hexCode], [name]) VALUES (4, NULL, N'#808080', N'Xám')
SET IDENTITY_INSERT [dbo].[Colors] OFF
SET IDENTITY_INSERT [dbo].[Brands] ON 

INSERT [dbo].[Brands] ([id], [logo_url], [logoUrl], [name]) VALUES (1, N'https://res.cloudinary.com/dmas2qrrw/image/upload/v1782284247/rme98fdsqww2wby4xojh.png', N'https://mms.img.susercontent.com/vn-11134216-7r98o-lstt6kckm7yhb6@resize_w120_nl.webp', N'Coolmate')
INSERT [dbo].[Brands] ([id], [logo_url], [logoUrl], [name]) VALUES (2, N'https://res.cloudinary.com/dmas2qrrw/image/upload/v1782284268/holyc4lqgikqdqcmup81.png', N'https://mms.img.susercontent.com/vn-11134216-7r98o-lstt6kcknliz02@resize_w120_nl.webp', N'Yody')
INSERT [dbo].[Brands] ([id], [logo_url], [logoUrl], [name]) VALUES (3, N'https://res.cloudinary.com/dmas2qrrw/image/upload/v1782284292/kfe5k5xh4kw6abukv2nh.png', N'https://mms.img.susercontent.com/sg-11134216-7rcen-ltv0y38rrtvba7@resize_w120_nl.webp', N'Adidas')
SET IDENTITY_INSERT [dbo].[Brands] OFF
SET IDENTITY_INSERT [dbo].[Categories] ON 

INSERT [dbo].[Categories] ([id], [image_url], [name]) VALUES (1, N'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80', N'Áo T-Shirt')
INSERT [dbo].[Categories] ([id], [image_url], [name]) VALUES (2, N'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&q=80', N'Áo Polo')
INSERT [dbo].[Categories] ([id], [image_url], [name]) VALUES (3, N'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&q=80', N'Áo Thể thao')
SET IDENTITY_INSERT [dbo].[Categories] OFF
SET IDENTITY_INSERT [dbo].[Products] ON 

INSERT [dbo].[Products] ([id], [created_at], [description], [image_url], [name], [product_code], [status], [updatedAt], [brand_id], [category_id]) VALUES (1, CAST(N'2026-06-15T20:54:59.1666667+00:00' AS DateTimeOffset), N'Áo thun thể thao nam Coolmate Active, chất liệu siêu nhẹ, thoáng mát, phù hợp để chạy bộ và tập gym.', N'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80', N'Áo Thun Thể Thao Nam Coolmate Active', N'CM-ACTIVE-01', N'ACTIVE', NULL, 1, 3)
INSERT [dbo].[Products] ([id], [created_at], [description], [image_url], [name], [product_code], [status], [updatedAt], [brand_id], [category_id]) VALUES (2, CAST(N'2026-06-15T20:54:59.1766667+00:00' AS DateTimeOffset), N'Áo Polo Yody chất liệu pique mắt chim độc quyền, khử mùi, siêu thoáng, tôn dáng mạnh mẽ.', N'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&q=80', N'Áo Polo Thể Thao Nam Yody Mắt Chim', N'YD-POLO-01', N'ACTIVE', NULL, 2, 2)
INSERT [dbo].[Products] ([id], [created_at], [description], [image_url], [name], [product_code], [status], [updatedAt], [brand_id], [category_id]) VALUES (3, CAST(N'2026-06-15T20:54:59.1900000+00:00' AS DateTimeOffset), N'Áo bóng đá nam Adidas Tiro 23 công nghệ AEROREADY thấm hút mồ hôi, nhẹ nhàng khô ráo.', N'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&q=80', N'Áo Thể Thao Adidas Tiro 23', N'AD-TIRO23', N'ACTIVE', NULL, 3, 3)
SET IDENTITY_INSERT [dbo].[Products] OFF
SET IDENTITY_INSERT [dbo].[ProductVariants] ON 

INSERT [dbo].[ProductVariants] ([id], [image_Url], [price], [status], [stock_Quantity], [updated_at], [color_id], [product_id], [size_id]) VALUES (1, N'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80', CAST(199000.00 AS Numeric(38, 2)), N'ACTIVE', 50, NULL, 1, 1, 2)
INSERT [dbo].[ProductVariants] ([id], [image_Url], [price], [status], [stock_Quantity], [updated_at], [color_id], [product_id], [size_id]) VALUES (2, N'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80', CAST(199000.00 AS Numeric(38, 2)), N'ACTIVE', 50, NULL, 3, 1, 3)
INSERT [dbo].[ProductVariants] ([id], [image_Url], [price], [status], [stock_Quantity], [updated_at], [color_id], [product_id], [size_id]) VALUES (3, N'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&q=80', CAST(299000.00 AS Numeric(38, 2)), N'ACTIVE', 20, NULL, 3, 2, 3)
INSERT [dbo].[ProductVariants] ([id], [image_Url], [price], [status], [stock_Quantity], [updated_at], [color_id], [product_id], [size_id]) VALUES (4, N'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&q=80', CAST(299000.00 AS Numeric(38, 2)), N'ACTIVE', 15, NULL, 2, 2, 4)
INSERT [dbo].[ProductVariants] ([id], [image_Url], [price], [status], [stock_Quantity], [updated_at], [color_id], [product_id], [size_id]) VALUES (5, N'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&q=80', CAST(450000.00 AS Numeric(38, 2)), N'ACTIVE', 20, NULL, 1, 3, 2)
SET IDENTITY_INSERT [dbo].[ProductVariants] OFF
SET IDENTITY_INSERT [dbo].[Accounts] ON 

INSERT [dbo].[Accounts] ([id], [account_code], [address], [created_at], [gmail], [img_url], [is_active], [password_hash], [phone], [username]) VALUES (1, N'ACC-ADMIN', NULL, CAST(N'2026-06-15T21:05:13.7433333+00:00' AS DateTimeOffset), N'admin@peakseven.com', NULL, 1, N'.HhV0sLh7a92.E3t8V2v49rYv1Vw3r2v4V0/w2e2v0z2', NULL, N'admin')
INSERT [dbo].[Accounts] ([id], [account_code], [address], [created_at], [gmail], [img_url], [is_active], [password_hash], [phone], [username]) VALUES (2, N'ACC-ADMIN-1', NULL, CAST(N'2026-06-15T14:09:51.7099894+00:00' AS DateTimeOffset), N'phianhduy2007@gmail.com', N'https://lh3.googleusercontent.com/a/ACg8ocK8VSQPsU9ZwjvPZF-cROQKBJpKDgFwzy4MkYw15FDwH_99U3A=s96-c', 1, N'$2a$10$55fpPga8n6ZHjQpCMlna4.AA3f5slYrijpyTfz8bCipOkk6ede/HO', NULL, N'phianhduy')
SET IDENTITY_INSERT [dbo].[Accounts] OFF
SET IDENTITY_INSERT [dbo].[PaymentMethods] ON 

INSERT [dbo].[PaymentMethods] ([id], [name]) VALUES (1, N'Thanh toán khi nh?n hàng (COD)')
INSERT [dbo].[PaymentMethods] ([id], [name]) VALUES (2, N'Thanh toán VNPay')
SET IDENTITY_INSERT [dbo].[PaymentMethods] OFF
SET IDENTITY_INSERT [dbo].[Orders] ON 

INSERT [dbo].[Orders] ([id], [created_at], [discount_amount], [email], [final_amount], [fullname], [payment_status], [phone], [return_reason], [shipping_address], [status], [total_money], [account_id], [payment_method_id], [voucher_id]) VALUES (1, CAST(N'2026-06-24T14:06:52.7300000+00:00' AS DateTimeOffset), CAST(0.00 AS Numeric(12, 2)), NULL, CAST(500000.00 AS Numeric(12, 2)), N'Nguy?n Van A', N'PENDING', N'0912345678', NULL, N'Hà Nội', N'NEW', CAST(500000.00 AS Numeric(12, 2)), 1, 1, NULL)
INSERT [dbo].[Orders] ([id], [created_at], [discount_amount], [email], [final_amount], [fullname], [payment_status], [phone], [return_reason], [shipping_address], [status], [total_money], [account_id], [payment_method_id], [voucher_id]) VALUES (2, CAST(N'2026-06-24T14:06:52.7300000+00:00' AS DateTimeOffset), CAST(200000.00 AS Numeric(12, 2)), NULL, CAST(1000000.00 AS Numeric(12, 2)), N'Tr?n Th? B', N'PAID', N'0987654321', NULL, N'TP.HCM', N'PROCESSING', CAST(1200000.00 AS Numeric(12, 2)), 1, 1, NULL)
INSERT [dbo].[Orders] ([id], [created_at], [discount_amount], [email], [final_amount], [fullname], [payment_status], [phone], [return_reason], [shipping_address], [status], [total_money], [account_id], [payment_method_id], [voucher_id]) VALUES (3, CAST(N'2026-06-24T14:06:52.7300000+00:00' AS DateTimeOffset), CAST(0.00 AS Numeric(12, 2)), NULL, CAST(750000.00 AS Numeric(12, 2)), N'Lê Van C', N'PENDING', N'0909090909', NULL, N'Đà Nẵng', N'DELIVERING', CAST(750000.00 AS Numeric(12, 2)), 1, 1, NULL)
INSERT [dbo].[Orders] ([id], [created_at], [discount_amount], [email], [final_amount], [fullname], [payment_status], [phone], [return_reason], [shipping_address], [status], [total_money], [account_id], [payment_method_id], [voucher_id]) VALUES (4, CAST(N'2026-06-24T14:06:52.7300000+00:00' AS DateTimeOffset), CAST(0.00 AS Numeric(12, 2)), NULL, CAST(300000.00 AS Numeric(12, 2)), N'Hoàng D', N'PENDING', N'0888888888', NULL, N'Cần Thơ', N'DELIVERED', CAST(300000.00 AS Numeric(12, 2)), 1, 1, NULL)
INSERT [dbo].[Orders] ([id], [created_at], [discount_amount], [email], [final_amount], [fullname], [payment_status], [phone], [return_reason], [shipping_address], [status], [total_money], [account_id], [payment_method_id], [voucher_id]) VALUES (5, CAST(N'2026-06-24T14:06:52.7300000+00:00' AS DateTimeOffset), CAST(0.00 AS Numeric(12, 2)), NULL, CAST(450000.00 AS Numeric(12, 2)), N'Ngô E', N'REFUNDED', N'0777777777', NULL, N'Hải Phòng', N'CANCELLED', CAST(450000.00 AS Numeric(12, 2)), 1, 1, NULL)
SET IDENTITY_INSERT [dbo].[Orders] OFF
SET IDENTITY_INSERT [dbo].[OrderItems] ON 

INSERT [dbo].[OrderItems] ([id], [price], [quantity], [order_id], [variant_id]) VALUES (2, CAST(500000.00 AS Numeric(38, 2)), 1, 1, 1)
INSERT [dbo].[OrderItems] ([id], [price], [quantity], [order_id], [variant_id]) VALUES (3, CAST(600000.00 AS Numeric(38, 2)), 2, 2, 1)
INSERT [dbo].[OrderItems] ([id], [price], [quantity], [order_id], [variant_id]) VALUES (4, CAST(750000.00 AS Numeric(38, 2)), 1, 3, 1)
INSERT [dbo].[OrderItems] ([id], [price], [quantity], [order_id], [variant_id]) VALUES (5, CAST(300000.00 AS Numeric(38, 2)), 1, 4, 1)
INSERT [dbo].[OrderItems] ([id], [price], [quantity], [order_id], [variant_id]) VALUES (6, CAST(450000.00 AS Numeric(38, 2)), 1, 5, 1)
SET IDENTITY_INSERT [dbo].[OrderItems] OFF
INSERT [dbo].[VariantImages] ([variant_id], [image_url]) VALUES (1, N'https://media.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/November2023/ActiveV1.Den.2.jpg')
INSERT [dbo].[VariantImages] ([variant_id], [image_url]) VALUES (1, N'https://media.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/November2023/ActiveV1.Den.3.jpg')
INSERT [dbo].[VariantImages] ([variant_id], [image_url]) VALUES (2, N'https://media.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/November2023/ActiveV1.Navy.2.jpg')
INSERT [dbo].[VariantImages] ([variant_id], [image_url]) VALUES (2, N'https://media.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/November2023/ActiveV1.Navy.3.jpg')
INSERT [dbo].[VariantImages] ([variant_id], [image_url]) VALUES (3, N'https://bizweb.dktcdn.net/100/438/408/products/apm6000-nav-7-23s096e22-8610-4fae-8488-dc78ee6c19f2.jpg')
INSERT [dbo].[VariantImages] ([variant_id], [image_url]) VALUES (3, N'https://bizweb.dktcdn.net/100/438/408/products/apm6000-nav-3-d95a5fbc-1857-4185-aa38-fb5d0e2ec3a4.jpg')
INSERT [dbo].[VariantImages] ([variant_id], [image_url]) VALUES (4, N'https://bizweb.dktcdn.net/100/438/408/products/apm6000-tra-8.jpg')
INSERT [dbo].[VariantImages] ([variant_id], [image_url]) VALUES (5, N'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/25f61778939c4a8ba9a7af3b0105cc51_9366/Ao_Dau_Tiro_23_Club_djen_HZ0136_21_model.jpg')
INSERT [dbo].[VariantImages] ([variant_id], [image_url]) VALUES (5, N'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/5863c0130d7045b8abadaf3b010629ec_9366/Ao_Dau_Tiro_23_Club_djen_HZ0136_22_model.jpg')
SET IDENTITY_INSERT [dbo].[Roles] ON 

INSERT [dbo].[Roles] ([id], [name]) VALUES (1, N'ADMIN')
INSERT [dbo].[Roles] ([id], [name]) VALUES (2, N'USER')
SET IDENTITY_INSERT [dbo].[Roles] OFF
INSERT [dbo].[AccountRoles] ([account_id], [role_id]) VALUES (1, 1)
INSERT [dbo].[AccountRoles] ([account_id], [role_id]) VALUES (2, 1)
