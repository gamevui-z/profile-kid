# Free, quyền lợi trả phí và nhãn tuổi

Tài liệu này cập nhật và thay thế phần phân gói, ngày sinh, nhóm tuổi trong unified-family.md và child-presets.md.

## Gói

Giá hiện trực tiếp trên thẻ, chọn bằng nút; không cần mở dropdown. Free 0đ không hết hạn: 1 con, giới hạn tuổi và thời gian/ngày. Standard 49.000đ/tháng kế thừa Free, thêm lịch tuần/giờ nghỉ, chọn nhiều danh mục, từ khóa. Pro 79.000đ và Pro+ 109.000đ là giá đề xuất, kế thừa gói thấp và tăng số con/khả năng báo cáo. Kỳ dài chỉ giảm giá.

“Không quảng cáo” là quyền lợi sản phẩm Standard trở lên nhưng CHƯA được triển khai trong game: cần contract với hệ thống quảng cáo GameVui và từng SDK game. UI có dấu * và chú thích, không thông báo đang chặn quảng cáo. Không được mở bán dịch vụ thật dựa trên demo này.

## Nội dung và ngày sinh

Danh mục checkbox độc lập, chọn nhiều, lưu/hủy đúng từng con. Bỏ tất cả nghĩa là danh sách cho phép rỗng, không phải tất cả. Free không sửa danh mục/từ khóa; nâng gói mở khóa. Dữ liệu cũ dạng nhóm chuyển thành danh sách khi hiển thị. Cần taxonomy GameVui thật và enforcement server/game trước production.

Ngày sinh là ba select Ngày/Tháng/Năm; không có năm tương lai, tháng/ngày bị giới hạn bởi ngày hiện tại, xử lý số ngày từng tháng/năm nhuận. Vẫn kiểm tra toàn bộ ngày hợp lệ và tuổi dưới 18 khi submit. Không dùng lịch native cho phép cuộn năm tương lai.

## Nhãn tuổi

Nguồn gốc: khoản 1 Điều 38 Nghị định 147/2024/NĐ-CP, Mục 3. Trang văn bản Chính phủ: https://vanban.chinhphu.vn/?classid=1&docid=211654&pageid=27160 ; bản ký: https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/147-nd.signed.pdf . Đây không phải báo cáo xác minh toàn bộ hiệu lực pháp luật hoặc chứng nhận tuân thủ.

Chỉ dùng nhãn 00+, 12+, 16+, 18+. Nhãn là tuổi tối thiểu, không phải tuổi tối đa. Bỏ 6+, “không giới hạn” và “≤12”. Chính sách UI: dưới 12 chỉ 00+; 12–15 có thể chọn 00+/12+; 16–17 có thể chọn 00+/12+/16+. Cha mẹ chọn chặt hơn được; không mở vượt tuổi thực. 18+ hiển thị vô hiệu cho tài khoản con. Ngày sinh được kiểm tra khi lưu để tránh chỉ dựa vào disabled UI.

Gợi ý thời gian 20/45/60 phút chỉ là giá trị demo cha mẹ chỉnh được, không phải mức pháp luật hay khuyến nghị sức khỏe. Phân loại game phải dựa trên nội dung đã thẩm định và metadata đáng tin; từ khóa không thay thế phân loại. Các giới hạn thời gian pháp luật và kiểm soát tổng thời gian cần rà soát/triển khai riêng ở backend.

## Kiểm thử

Kiểm tra Free/upgrade, giá nhìn thấy, chọn nhiều/lưu/hủy danh mục, không năm tương lai, năm nhuận, các mốc 11/12/15/16 tuổi, nhãn bị khóa, hồi quy toàn bộ form/gói, responsive và keyboard. Chưa thực thi thanh toán, quảng cáo, lọc game hay đồng bộ máy thật. Các báo cáo vẫn là dữ liệu demo.

