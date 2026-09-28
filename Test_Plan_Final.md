# 📋 Kế Hoạch Kiểm Thử (Test Plan) Trọng Điểm

Dưới đây là kịch bản test chi tiết cho 5 luồng chức năng chính mà chúng ta đã tái cấu trúc và sửa lỗi. Anh và nhóm bám sát theo các bước này để nghiệm thu nhé.

---

## 1. Mua Hàng Online (Online Checkout & Cart)

| ID | Hạng mục kiểm tra | Kịch bản / Các bước thực hiện | Kết quả mong đợi (Pass) |
| :--- | :--- | :--- | :--- |
| **ONL-1** | **Giỏ hàng - Nút xóa** | Truy cập giỏ hàng, thử xóa sản phẩm. Chuyển sang trang thanh toán. | Nút xóa **chỉ tồn tại** trong giỏ hàng. Trang Thanh toán (Checkout) tuyệt đối không có nút xóa. |
| **ONL-2** | **Tự động điền địa chỉ (Bản đồ)** | Gõ một địa chỉ (VD: "42 Kim Giang") vào ô tự động điền. Chọn gợi ý. | Hệ thống tự động tách và chọn đúng **Tỉnh/Thành, Quận/Huyện, Phường/Xã** trên dropdown (nhờ tích hợp Nominatim API tiếng Việt). Không bị lặp chữ. |
| **ONL-3** | **Validate form địa chỉ** | Cố tình để trống Phường/Xã hoặc Phí ship chưa được tính. Bấm Đặt Hàng. | Hệ thống chặn lại và báo lỗi yêu cầu chọn đầy đủ địa chỉ giao hàng. |
| **ONL-4** | **Thanh toán VNPay (Hủy/Thất bại)** | Chọn thanh toán VNPay. Chuyển sang cổng VNPay nhưng bấm "Hủy giao dịch" hoặc tắt tab. | Đơn hàng chuyển trạng thái Đã Hủy, **tồn kho tự động được cộng lại** như cũ. |
| **ONL-5** | **Thanh toán VNPay (Thành công)** | Thực hiện thanh toán VNPay thành công. | Chuyển về trang kết quả thành công, giỏ hàng được làm sạch, tồn kho bị trừ vĩnh viễn, trạng thái "Thành công". |

---

## 2. Bán Hàng Tại Quầy (POS)

| ID | Hạng mục kiểm tra | Kịch bản / Các bước thực hiện | Kết quả mong đợi (Pass) |
| :--- | :--- | :--- | :--- |
| **POS-1** | **Lưu thông tin khách hàng** | Tại POS, **không nhập** tên/sđt. Bấm thanh toán. | Đơn hàng lưu tên khách là **"POS"**, sđt trống. |
| **POS-2** | **Lưu thông tin khách hàng (Có nhập)** | Nhập "Anh Duy", SĐT "0987654321". Bấm thanh toán. | Đơn hàng ghi nhận chính xác tên "Anh Duy" và SĐT trên biên lai và trang Quản lý đơn hàng. |
| **POS-3** | **Đồng bộ tồn kho Real-time** | Thêm sản phẩm A vào giỏ POS. Mở tab khác xem tồn kho sản phẩm A. | Tồn kho của A lập tức **bị trừ đi tạm thời** để tránh khách online mua trùng. |
| **POS-4** | **Giải phóng tồn kho khi thoát** | Đang có hàng trong giỏ POS. Đóng thẳng tab trình duyệt (không thanh toán). | Hệ thống tự động **cộng trả lại tồn kho** cho sản phẩm vừa bị giữ. |
| **POS-5** | **In hóa đơn** | Thanh toán 1 đơn POS gồm 3-4 sản phẩm tên dài. Bấm in hóa đơn. | Các cột Số lượng, Đơn giá, Thành tiền **không bị dính chữ vào nhau**, bố cục rõ ràng, thẳng hàng. |

---

## 3. Quản Lý Đơn Hàng (Admin Orders)

| ID | Hạng mục kiểm tra | Kịch bản / Các bước thực hiện | Kết quả mong đợi (Pass) |
| :--- | :--- | :--- | :--- |
| **ORD-1** | **Badge Nhận diện POS / ONL** | Xem danh sách đơn hàng. | Nhãn **POS** (tím) hoặc **ONL** (xanh) nằm ngay phía dưới Mã đơn hàng (#ID) một cách nổi bật, không bị lệch. |
| **ORD-2** | **Bộ lọc Tab Trạng thái** | Click thử các tab trạng thái ngang phía trên (Tất cả, Yêu cầu hoàn, v.v.). | Bảng danh sách lập tức lọc ra đúng đơn hàng. Giao diện thay thế hoàn toàn cho Select Dropdown cũ. |
| **ORD-3** | **Thông báo toàn cục (Global Bell)** | Đứng ở trang Quản lý Sản Phẩm (Admin). Dùng máy điện thoại (Khách) đặt 1 đơn mới. | Có **Pop-up Toast** nảy lên góc phải báo "Có đơn hàng mới". Số trên icon Chuông báo tăng lên 1. |
| **ORD-4** | **Phê duyệt Hoàn Tiền** | Chọn 1 đơn đã thanh toán, khách yêu cầu trả hàng. Vào Xử lý -> Bấm Hoàn Tiền. | Hệ thống tính toán **số tiền hoàn trả tỷ lệ thuận** (nếu đơn có dùng voucher). Không cho phép hoàn số tiền lớn hơn thực trả. |
| **ORD-5** | **Xóa đơn (Ẩn)** | Tìm các nút xóa cứng đơn hàng. | Tuyệt đối **không có nút xóa vĩnh viễn** để đảm bảo không bị thất thoát báo cáo tài chính. |

---

## 4. Quản Lý Sản Phẩm & Biến Thể

| ID | Hạng mục kiểm tra | Kịch bản / Các bước thực hiện | Kết quả mong đợi (Pass) |
| :--- | :--- | :--- | :--- |
| **PRD-1** | **Thêm sản phẩm mới** | Tạo 1 sản phẩm mới hoàn toàn. Ra ngoài Store (giao diện khách) kiểm tra. | Sản phẩm **không có sẵn review/đánh giá ảo** nào (0 sao, 0 lượt đánh giá). |
| **PRD-2** | **Quản lý biến thể** | Sửa số lượng tồn kho của một biến thể màu/size cụ thể. | Dữ liệu cập nhật ngay lập tức. Khách mua online hoặc POS mua đúng biến thể đó sẽ trừ đúng số lượng. |
| **PRD-3** | **Vô hiệu hóa (Hidden)** | Chuyển trạng thái sản phẩm sang Hidden (Ẩn). | Khách hàng không thể tìm hoặc xem được sản phẩm đó trên cửa hàng online nữa. Không dùng xóa cứng (Delete). |

---

## 5. Quản Lý Khuyến Mãi (Voucher)

| ID | Hạng mục kiểm tra | Kịch bản / Các bước thực hiện | Kết quả mong đợi (Pass) |
| :--- | :--- | :--- | :--- |
| **VOU-1** | **Giới hạn số lần sử dụng** | Tạo Voucher X giới hạn **3 lần dùng**. Đặt 3 đơn dùng Voucher X. Đến đơn thứ 4 thử áp dụng. | Hệ thống báo lỗi "Voucher đã hết lượt sử dụng". (Kiểm tra theo số tổng, không phải giới hạn mỗi khách 1 lần như cũ). |
| **VOU-2** | **Mức giảm tối đa (Max Discount)** | Tạo Voucher giảm **50%**, giới hạn giảm tối đa **50.000đ**. Áp dụng cho đơn 500.000đ. | Số tiền giảm thực tế chỉ là **50.000đ** (chặn trần max), không phải 250.000đ. |
| **VOU-3** | **Logic Min Order** | Giỏ hàng 200k, áp dụng Voucher yêu cầu đơn tối thiểu 250k. | Không thể áp dụng (Nút áp dụng mờ hoặc báo lỗi). |
| **VOU-4** | **Rớt ngưỡng (Auto-remove)** | Giỏ hàng 300k. Đã áp Voucher min 250k. Khách xóa 1 sản phẩm làm giỏ hàng còn 100k. | Voucher **tự động bị gỡ bỏ** khỏi đơn hàng và tính lại tiền. |

---

> **Lưu ý cho Team Test:** 
> Vui lòng test theo luồng end-to-end (từ tạo sản phẩm -> tạo voucher -> khách đặt mua -> xem thông báo admin -> in hóa đơn POS -> xử lý hoàn tiền). Nếu phát hiện exception trên console hoặc logic lệch, vui lòng note lại mã đơn hàng để em xử lý!
