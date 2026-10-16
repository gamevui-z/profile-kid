# Giá và quyền lợi mô phỏng

## Cập nhật phân tầng quyền lợi

Bảng gói mới bỏ giá quy đổi mỗi tháng, nhấn tổng giá và đặt nút chọn trước danh sách quyền lợi. Gói 6 tháng được đánh dấu “Đề xuất”, không dùng tuyên bố phổ biến không có dữ liệu. Tham khảo cách kế thừa quyền lợi của https://chatgpt.com/pricing/.

Quyền lợi đề xuất mới thay thế phương án mọi gói giống nhau bên dưới: dùng thử 1 hồ sơ/biểu đồ 7 ngày; 3 tháng 2 hồ sơ/lịch sử 30 ngày/báo cáo tháng; 6 tháng 3 hồ sơ/lịch sử 90 ngày/lịch chơi từng ngày/so sánh tuần; 1 năm 5 hồ sơ/lịch sử 365 ngày/xuất báo cáo/tổng kết năm. Các gói kế thừa quyền lợi gói thấp hơn.

Đây là thay đổi thiết kế bảng gói, chưa triển khai hạn mức hồ sơ hoặc tính năng nâng cao trong quản lý. Những quyền lợi này có dấu * và chú thích ngay dưới bảng, đồng thời được nhắc ở bước xác nhận. Gia hạn dùng thử 30.000đ/tháng giữ quyền lợi cơ bản dùng thử. Cần chốt chính sách và triển khai enforcement, lưu lịch sử/báo cáo trước production.

Cập nhật thay thế thông tin “Giá sẽ công bố” và “không tự gia hạn” của gói dùng thử trong tài liệu cũ.

- Dùng thử: đầy đủ tính năng, 0đ tháng đầu; điều kiện mô phỏng tự gia hạn 30.000đ/tháng sau đó, hủy trước kỳ gia hạn để không bị tính phí.
- 3 tháng: 89.000đ, khoảng 29.667đ/tháng.
- 6 tháng: 159.000đ, 26.500đ/tháng; tiết kiệm 19.000đ (10,7%) so với 2 gói 3 tháng.
- 12 tháng: 269.000đ, khoảng 22.417đ/tháng; tiết kiệm 87.000đ (24,4%) so với 4 gói 3 tháng.

Các gói trả trước không tự gia hạn trong phương án mô phỏng này. Quyền lợi chung: tài khoản con, hạn mức mỗi ngày, lọc tuổi game và biểu đồ 7 ngày. Khác biệt là thời hạn và chi phí; không tạo tính năng premium chưa có.

Giá 6/12 tháng và giá gia hạn 30.000đ là đề xuất để demo. Điều kiện gia hạn được nhắc trên thẻ và bước xác nhận, không tích sẵn đồng ý. Không có thanh toán, lịch trừ tiền, phương thức thanh toán hoặc chức năng hủy thuê bao backend. Trước production cần triển khai các phần này và phê duyệt chính sách giá/gia hạn.

Kiểm thử Edge: 9/9 nhóm hiện có đạt; kiểm tra bổ sung đúng giá từng gói, nội dung đồng ý và checkbox không tích sẵn. Đã xem ảnh desktop/mobile. Không thêm tài nguyên ngoài/CDN.

