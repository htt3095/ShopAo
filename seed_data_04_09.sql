-- File: seed_data_04_09.sql
-- Mô tả: Dữ liệu giả lập 10 đơn hàng (có cả đơn thành công và đơn hoàn tiền/hủy)
-- Thời gian: Trải dài từ cuối tháng 8 đến mốc 04/09/2026

USE [ShopGiay]; -- Thay tên database nếu máy anh dùng tên khác
GO

-- 1. BẬT CHẾ ĐỘ CHÈN ID CỨNG CHO BẢNG ORDERS
SET IDENTITY_INSERT [dbo].[Orders] ON;

-- Đơn 1: Ngày 25/08
INSERT [dbo].[Orders] ([id], [created_at], [discount_amount], [email], [final_amount], [fullname], [payment_status], [phone], [shipping_address], [status], [total_money], [account_id], [payment_method_id], [shipping_fee]) 
VALUES (1001, '2026-08-25T10:15:00+00:00', 0, 'khach1@gmail.com', 480000, N'Khách hàng 1', 'PAID', '0912345678', N'Hà Nội', 'COMPLETED', 450000, 2, 1, 30000);

-- Đơn 2: Ngày 28/08
INSERT [dbo].[Orders] ([id], [created_at], [discount_amount], [email], [final_amount], [fullname], [payment_status], [phone], [shipping_address], [status], [total_money], [account_id], [payment_method_id], [shipping_fee]) 
VALUES (1002, '2026-08-28T14:20:00+00:00', 50000, 'khach2@gmail.com', 880000, N'Khách hàng 2', 'PAID', '0912345679', N'Hà Nội', 'COMPLETED', 900000, 2, 1, 30000);

-- Đơn 3: Ngày 01/09
INSERT [dbo].[Orders] ([id], [created_at], [discount_amount], [email], [final_amount], [fullname], [payment_status], [phone], [shipping_address], [status], [total_money], [account_id], [payment_method_id], [shipping_fee]) 
VALUES (1003, '2026-09-01T09:00:00+00:00', 0, 'khach3@gmail.com', 480000, N'Khách hàng 3', 'PAID', '0912345680', N'Hà Nội', 'DELIVERED', 450000, 2, 1, 30000);

-- Đơn 4: Ngày 02/09 (Đang giao)
INSERT [dbo].[Orders] ([id], [created_at], [discount_amount], [email], [final_amount], [fullname], [payment_status], [phone], [shipping_address], [status], [total_money], [account_id], [payment_method_id], [shipping_fee]) 
VALUES (1004, '2026-09-02T16:30:00+00:00', 0, 'khach4@gmail.com', 930000, N'Khách hàng 4', 'PENDING', '0912345681', N'TP.HCM', 'SHIPPING', 900000, 2, 1, 30000);

-- Đơn 5: Ngày 03/09 (ĐƠN HỦY/HOÀN TIỀN CỐ TÌNH ĐỂ TEST DOANH THU ÂM)
INSERT [dbo].[Orders] ([id], [created_at], [discount_amount], [email], [final_amount], [fullname], [payment_status], [phone], [shipping_address], [status], [total_money], [account_id], [payment_method_id], [shipping_fee]) 
VALUES (1005, '2026-09-03T11:15:00+00:00', 0, 'khach5@gmail.com', 480000, N'Khách hàng 5', 'REFUNDED', '0912345682', N'Đà Nẵng', 'CANCELLED', 450000, 2, 1, 30000);

-- Đơn 6: Ngày 04/09 (Mới nhất)
INSERT [dbo].[Orders] ([id], [created_at], [discount_amount], [email], [final_amount], [fullname], [payment_status], [phone], [shipping_address], [status], [total_money], [account_id], [payment_method_id], [shipping_fee]) 
VALUES (1006, '2026-09-04T08:00:00+00:00', 0, 'khach6@gmail.com', 480000, N'Khách hàng 6', 'PAID', '0912345683', N'Hải Phòng', 'CONFIRMED', 450000, 2, 1, 30000);

-- Đơn 7: Ngày 04/09 (Tiếp tục)
INSERT [dbo].[Orders] ([id], [created_at], [discount_amount], [email], [final_amount], [fullname], [payment_status], [phone], [shipping_address], [status], [total_money], [account_id], [payment_method_id], [shipping_fee]) 
VALUES (1007, '2026-09-04T10:20:00+00:00', 20000, 'khach7@gmail.com', 460000, N'Khách hàng 7', 'PAID', '0912345684', N'Hải Dương', 'CONFIRMED', 450000, 2, 1, 30000);

SET IDENTITY_INSERT [dbo].[Orders] OFF;


-- 2. BẬT CHẾ ĐỘ CHÈN ID CỨNG CHO BẢNG ORDER_ITEMS
SET IDENTITY_INSERT [dbo].[OrderItems] ON;

INSERT [dbo].[OrderItems] ([id], [price], [quantity], [order_id], [variant_id]) VALUES (1001, 450000, 1, 1001, 1);
INSERT [dbo].[OrderItems] ([id], [price], [quantity], [order_id], [variant_id]) VALUES (1002, 450000, 2, 1002, 1);
INSERT [dbo].[OrderItems] ([id], [price], [quantity], [order_id], [variant_id]) VALUES (1003, 450000, 1, 1003, 1);
INSERT [dbo].[OrderItems] ([id], [price], [quantity], [order_id], [variant_id]) VALUES (1004, 450000, 2, 1004, 1);
INSERT [dbo].[OrderItems] ([id], [price], [quantity], [order_id], [variant_id]) VALUES (1005, 450000, 1, 1005, 1);
INSERT [dbo].[OrderItems] ([id], [price], [quantity], [order_id], [variant_id]) VALUES (1006, 450000, 1, 1006, 1);
INSERT [dbo].[OrderItems] ([id], [price], [quantity], [order_id], [variant_id]) VALUES (1007, 450000, 1, 1007, 1);

SET IDENTITY_INSERT [dbo].[OrderItems] OFF;
