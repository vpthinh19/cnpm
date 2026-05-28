**HỆ THỐNG QUẢN LÝ NHÀ HÀNG**
**ĐẶC TẢ VÀ PHÂN TÍCH YÊU CẦU**

# 1. ĐẶC TẢ VÀ PHÂN TÍCH YÊU CẦU {#đặc-tả-và-phân-tích-yêu-cầu}

Nhà hàng cần quản lý toàn diện việc phục vụ khách hàng, chế biến, thanh toán và kiểm soát vật tư trên máy vi tính. Qua phân tích sơ đồ luồng dữ liệu, hệ thống nắm được những thông tin sau:

### Quản lý đặt bàn và gọi món:

Khách hàng có thể yêu cầu đặt bàn trực tiếp tại nhà hàng hoặc thông qua điện thoại. Nhân viên Phục vụ là người tiếp nhận thông tin đặt bàn, kiểm tra tình trạng bàn trống trên hệ thống và nhập thông tin đặt bàn vào phần mềm. Hệ thống ghi nhận thông tin khách hàng, số điện thoại, thời gian đặt, số người và bàn được chọn, sau đó cập nhật trạng thái bàn thành "Đã đặt". Đối với khách dùng bữa trực tiếp tại nhà hàng, nhân viên Phục vụ tiếp nhận yêu cầu gọi món và ghi nhận order trên hệ thống.

### Quy trình xử lý bếp và phục vụ:

Hệ thống tự động trích xuất các chi tiết món cần làm từ CSDL Phiếu Order để gửi lệnh in phiếu order xuống cho Bộ phận Bếp. Đối với đồ uống, hệ thống phân loại và gửi phiếu riêng đến Quầy pha chế. Sau khi chế biến xong, Bộ phận Bếp/Quầy pha chế cập nhật trạng thái món (Đang chế biến → Đã xong). Hệ thống ghi nhận thay đổi vào CSDL Phiếu Order và phát thông báo cho Phục vụ.

### Quy trình thanh toán:

Khi khách yêu cầu tính tiền, Thu ngân chọn bàn tương ứng. Hệ thống truy xuất dữ liệu các món từ CSDL Phiếu Order để tính tổng. Tổng tiền = Tổng tiền món + Thuế VAT (nếu áp dụng). Thu ngân xác nhận thu tiền (tiền mặt hoặc chuyển khoản). Hệ thống lưu giao dịch vào CSDL Hóa đơn, cập nhật bàn về \"Trống\", trả hóa đơn và tiền thừa cho khách.

### Quản lý kho hàng:

Bộ phận kho lập các lệnh nhập/xuất kho với đầy đủ thông tin số lượng và đơn giá. Hệ thống cập nhật số liệu tồn kho và lưu trữ phiếu nhập/xuất vào CSDL Kho.

### Quản lý thực đơn:

Quản lý nhà hàng quản lý danh sách món ăn/đồ uống. Khi có món mới, thêm vào CSDL Thực đơn (tên, loại, đơn giá, mô tả). Cập nhật trạng thái (Còn hàng/Hết hàng), chỉnh sửa đơn giá hoặc xóa món.

### Quản lý bàn:

Quản lý thiết lập danh sách bàn: số bàn, khu vực, sức chứa, trạng thái (Trống/Có khách/Đã đặt).

### Phân quyền người sử dụng:

Hệ thống phân quyền cho 5 vai trò: Quản lý (Admin), Phục vụ, Bộ phận Bếp, Thu ngân, Bộ phận Kho.

# 2. BẢNG YÊU CẦU CHỨC NĂNG NGHIỆP VỤ {#bảng-yêu-cầu-chức-năng-nghiệp-vụ}

## Bộ phận Thu ngân

| **STT** | **Công việc** | **Loại công việc** | **Quy định / Công thức liên quan** | **Biểu mẫu liên quan** | **Ghi chú** |
|----|----|----|----|----|----|
| 1 | Lập báo cáo doanh thu | Kết xuất | Tổng doanh thu = ∑ (Tổng tiền các hóa đơn đã thanh toán trong kỳ). | TN_BM1 |  |
| 2 | Xử lý thanh toán | Tính toán | TN_QĐ1 | TN_BM2 | Xem bảng quy định |
| 3 | Xuất hóa đơn | Kết xuất | Hóa đơn đầy đủ: thông tin nhà hàng, chi tiết món, SL, đơn giá, thành tiền, thuế VAT, ngày giờ. | TN_BM3 |  |

## Bộ phận Phục vụ

| **STT** | **Công việc** | **Loại công việc** | **Quy định / Công thức liên quan** | **Biểu mẫu liên quan** | **Ghi chú** |
|----|----|----|----|----|----|
| 1 | Tiếp nhận đặt bàn trực tiếp/qua điện thoại | Lưu trữ | PV_QĐ1 | PV_BM1 | Xem bảng quy định |
| 2 | Tiếp nhận khách đã đặt bàn (check-in) | Cập nhật | Chuyển trạng thái bàn "Đã đặt" → "Có khách" khi khách đến. | PV_BM5 |  |
| 3 | Ghi nhận gọi món | Lưu trữ | Món phải có trong thực đơn, trạng thái "Còn hàng". SL > 0. | PV_BM2 |  |
| 4 | Bàn giao cho bếp / quầy pha chế | Xử lý | Tự động phân loại: Món ăn → Bếp, Đồ uống → Quầy pha chế. Kích hoạt khi Phục vụ chốt order. | PV_BM3 |  |
| 5 | Phục vụ món ra bàn | Cập nhật | Nhận thông báo khi món "Đã xong". Xác nhận đã phục vụ → trạng thái món chuyển "Đã phục vụ". | PV_BM4 |  |

## Bộ phận Bếp

| **STT** | **Công việc** | **Loại công việc** | **Quy định / Công thức liên quan** | **Biểu mẫu liên quan** | **Ghi chú** |
|----|----|----|----|----|----|
| 1 | Nhận phiếu order | Xử lý | Nhận phiếu theo thứ tự thời gian. Xác nhận đã nhận. Kiểm tra nguyên liệu. | B_BM1 |  |
| 2 | Cập nhật trạng thái món | Cập nhật | Chờ chế biến → Đang chế biến → Đã xong. Thông báo tự động cho Phục vụ. |  |  |

## Bộ phận Kho

| **STT** | **Công việc** | **Loại công việc** | **Quy định / Công thức liên quan** | **Biểu mẫu liên quan** | **Ghi chú** |
|----|----|----|----|----|----|
| 1 | Lập phiếu nhập kho | Lưu trữ | K_QĐ1. Tính ngay tổng giá trị nhập = ∑ (SL × Đơn giá). | K_BM1 | Bao gồm tính hóa đơn nhập |
| 2 | Lập phiếu xuất kho | Lưu trữ | K_QĐ1. Không xuất quá tồn. Tính ngay tổng giá trị xuất = ∑ (SL × Đơn giá). | K_BM2 | Bao gồm tính hóa đơn xuất |
| 3 | Báo cáo tồn kho | Kết xuất | Tồn cuối = Tồn đầu + Nhập − Xuất. | K_BM3 |  |
| 4 | Báo cáo nhập kho | Kết xuất | Thống kê tổng NVL đã nhập trong khoảng thời gian. | K_BM4 |  |
| 5 | Báo cáo xuất kho | Kết xuất | Thống kê tổng NVL đã xuất trong khoảng thời gian. | K_BM5 |  |

## Quản lý (Admin)

| **STT** | **Công việc** | **Loại công việc** | **Quy định / Công thức liên quan** | **Biểu mẫu liên quan** | **Ghi chú** |
|----|----|----|----|----|----|
| 1 | Quản lý thực đơn | Lưu trữ | Thêm/sửa/xóa món. Cập nhật trạng thái, đơn giá. | QL_BM1 |  |
| 2 | Quản lý bàn | Lưu trữ | Thêm/sửa/xóa bàn. Thiết lập sức chứa, khu vực. | QL_BM2 |  |
| 3 | Quản lý tài khoản | Lưu trữ | QL_QĐ1. Tạo/sửa/khóa tài khoản. Phân quyền theo vai trò. | QL_BM3 |  |
| 4 | Xem báo cáo tổng hợp | Kết xuất | Xem tất cả báo cáo: doanh thu, tồn kho, nhập/xuất. | QL_BM4 |  |
| 5 | Cấu hình hệ thống | Lưu trữ | QL_QĐ2. Thiết lập tỷ lệ VAT, thời gian tự hủy đặt bàn, giờ hoạt động. | QL_BM5 |  |

## Toàn hệ thống

| **STT** | **Công việc** | **Loại công việc** | **Quy định / Công thức liên quan** | **Biểu mẫu liên quan** | **Ghi chú** |
|----|----|----|----|----|----|
| 1 | Đăng nhập / Đăng xuất | Xử lý | QL_QĐ1. Xác thực tài khoản, tạo phiên làm việc, ghi log. | SYS_BM1 | Áp dụng cho mọi vai trò |
| 2 | Sao lưu / Phục hồi dữ liệu | Xử lý | Định kỳ tự động + thủ công khi cần. Chỉ Admin thực hiện phục hồi. |  | Xem mục 5 |

# 3. DANH SÁCH CÁC YÊU CẦU {#danh-sách-các-yêu-cầu}

<table>
<colgroup>
<col style="width: 6%" />
<col style="width: 11%" />
<col style="width: 23%" />
<col style="width: 58%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><strong>STT</strong></th>
<th style="text-align: center;"><strong>Mã số</strong></th>
<th style="text-align: center;"><strong>Tên quy định</strong></th>
<th style="text-align: center;"><strong>Mô tả chi tiết</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td>
<td>TN_QĐ1</td>
<td>Quy định thanh toán</td>
<td><p>- Chỉ thanh toán khi tất cả món đã "Đã phục vụ" hoặc "Đã hủy".</p>
<p>- Tổng tiền = ∑ (SL × Đơn giá).</p>
<p>- Thuế VAT (nếu có) = Tổng tiền × Tỷ lệ VAT.</p>
<p>- Tổng thanh toán = Tổng tiền + Thuế VAT.</p>
<p>- Tiền thừa = Tiền khách đưa − Tổng thanh toán.</p>
<p>- Hỗ trợ tiền mặt hoặc chuyển khoản.</p></td>
</tr>
<tr>
<td>2</td>
<td>PV_QĐ1</td>
<td>Quy định đặt bàn</td>
<td><p>- Thời gian đặt trong giờ hoạt động.</p>
<p>- Bàn phải ở trạng thái "Trống".</p>
<p>- Số người ≤ sức chứa tối đa của bàn.</p>
<p>- Ghi nhận: tên khách, SĐT, thời gian, số người.</p>
<p>- Đặt quá 15 phút không đến → tự động hủy (tùy cấu hình).</p>
<p>-Hình thức tiếp nhận đặt bàn gồm: trực tiếp tại nhà hàng hoặc qua điện thoại.</p>
<p>-Nhân viên Phục vụ là người nhập thông tin đặt bàn vào hệ thống; khách hàng không tự thao tác trên phần mềm.</p></td>
</tr>
<tr>
<td>3</td>
<td>B_QĐ1</td>
<td>Quy định chế biến</td>
<td><p>- Bếp nhận phiếu theo thứ tự FIFO.</p>
<p>- Trạng thái: Chờ → Đang chế biến → Đã xong.</p>
<p>- Không bỏ qua bước trạng thái.</p>
<p>- Khi Đã xong → tự động thông báo Phục vụ.</p></td>
</tr>
<tr>
<td>4</td>
<td>K_QĐ1</td>
<td>Quy định nhập/xuất kho</td>
<td><p>- Phiếu nhập: NVL phải có trong danh mục; SL > 0; đơn giá > 0; phải gán nhà cung cấp.</p>
<p>- Phiếu xuất: SL xuất ≤ tồn kho hiện tại; phải gán bộ phận nhận (Bếp/Quầy pha chế).</p>
<p>- Mỗi phiếu phải có người lập; phiếu đã lưu không sửa, chỉ tạo phiếu điều chỉnh.</p>
<p>- Tồn kho cập nhật tức thời sau khi lưu phiếu: Tồn mới = Tồn cũ + Nhập − Xuất.</p>
<p>- Cảnh báo khi tồn ≤ định mức tối thiểu của NVL (cấu hình theo từng NVL).</p></td>
</tr>
<tr>
<td>5</td>
<td>QL_QĐ1</td>
<td>Quy định tài khoản và phân quyền</td>
<td><p>- Mỗi nhân viên có 1 tài khoản, gắn 1 vai trò: Admin / Phục vụ / Bếp / Thu ngân / Kho.</p>
<p>- Mật khẩu: tối thiểu 8 ký tự, có chữ và số; lưu dạng băm (hash), không lưu plaintext.</p>
<p>- Khóa tài khoản sau 5 lần đăng nhập sai liên tiếp; chỉ Admin mở khóa.</p>
<p>- Phiên làm việc tự đăng xuất sau 30 phút không thao tác (cấu hình).</p>
<p>- Ma trận chức năng ↔ vai trò: hệ thống chặn truy cập chức năng không thuộc vai trò.</p>
<p>- Mọi thao tác quan trọng (thanh toán, nhập/xuất kho, đổi cấu hình) đều ghi log audit (ai, khi nào, làm gì).</p></td>
</tr>
<tr>
<td>6</td>
<td>QL_QĐ2</td>
<td>Quy định cấu hình hệ thống</td>
<td><p>- Tỷ lệ VAT: số thực ∈ [0, 0.2]; có cờ bật/tắt áp dụng.</p>
<p>- Thời gian tự hủy đặt bàn quá hạn: số nguyên phút, mặc định 15, ∈ [5, 60].</p>
<p>- Giờ hoạt động nhà hàng: giờ mở – giờ đóng; chỉ trong khoảng này mới cho phép đặt bàn và gọi món.</p>
<p>- Định kỳ sao lưu dữ liệu: mặc định 1 lần/ngày vào giờ đóng cửa.</p>
<p>- Mọi thay đổi cấu hình ghi log (ai, khi nào, giá trị cũ → mới).</p></td>
</tr>
</tbody>
</table>

# 4. BIỂU MẪU LIÊN QUAN {#biểu-mẫu-liên-quan}

### TN_BM1:

**BÁO CÁO DOANH THU**

**Từ ngày:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Đến ngày:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

| **STT** | **Số hóa đơn** | **Ngày** | **Bàn** | **Tổng tiền** | **Hình thức TT** |
|---------|----------------|----------|---------|---------------|------------------|
| 1       |                |          |         |               |                  |
| 2       |                |          |         |               |                  |
| \...    |                |          |         |               |                  |

**Tổng doanh thu:** \...\...\...\...\...\...\...\....

**Ngày lập:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Người lập:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....


### TN_BM2:

**MÀN HÌNH THANH TOÁN**

**Bàn số:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Thu ngân:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

| **STT** | **Tên món** | **SL** | **Đơn giá** | **Thành tiền** | **Ghi chú** |
|---------|-------------|--------|-------------|----------------|-------------|
| 1       |             |        |             |                |             |
| 2       |             |        |             |                |             |

**Tổng tiền món:** \...\...\...\...\.....

**Thuế VAT:** \...\...\...\...\.....

**Tổng thanh toán:** \...\...\...\...\.....

**Tiền khách đưa:** \...\...\...\...\.....

**Tiền thừa:** \...\...\...\...\.....

**Hình thức:** \[ \] Tiền mặt \[ \] Chuyển khoản


### TN_BM3:

**HÓA ĐƠN THANH TOÁN**

**NHÀ HÀNG \[TÊN NHÀ HÀNG\]**

**Số HĐ:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Bàn số:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Ngày giờ:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Thu ngân:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

| **STT** | **Tên món** | **SL** | **Đơn giá** | **Thành tiền** |
|---------|-------------|--------|-------------|----------------|
| 1       |             |        |             |                |
| 2       |             |        |             |                |

**Tổng cộng:** \...\...\...\...\.....

**Thuế VAT:** \...\...\...\...\.....

**Tổng thanh toán:** \...\...\...\...\.....

*Cảm ơn Quý khách! Hẹn gặp lại!*


### PV_BM1:

**PHIẾU ĐẶT BÀN**

**Tên khách:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**SĐT:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Số người:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Bàn số:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Khu vực:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Thời gian đặt:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Ghi chú:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Hình thức đặt bàn:** \[ \] Trực tiếp \[ \] Qua điện thoại

**Nhân viên tiếp nhận:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Trạng thái đặt bàn:** \[ \] Đã đặt \[ \] Đã nhận bàn \[ \] Đã hủy


### PV_BM2:

**PHIẾU GỌI MÓN / ORDER**

**Bàn số:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**NV phục vụ:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Ngày giờ:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

| **STT** | **Tên món** | **Loại** | **SL** | **Đơn giá** | **Ghi chú** |
|---------|-------------|----------|--------|-------------|-------------|
| 1       |             |          |        |             |             |
| 2       |             |          |        |             |             |
| 3       |             |          |        |             |             |

**Loại:** MA = Món ăn, DU = Đồ uống


### PV_BM3:

**PHIẾU CHUYỂN BẾP / QUẦY PHA CHẾ**

**Bàn số:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Số phiếu order:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Chuyển đến:** \[ \] Bếp \[ \] Quầy pha chế

| **STT** | **Tên món** | **SL** | **Ghi chú** | **Trạng thái** |
|---------|-------------|--------|-------------|----------------|
| 1       |             |        |             | Chờ chế biến   |
| 2       |             |        |             | Chờ chế biến   |


### B_BM1:

**PHIẾU ORDER BẾP**

**Bàn số:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Thời gian nhận:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

| **STT** | **Tên món** | **SL** | **Ghi chú đặc biệt** | **Trạng thái** |
|---------|-------------|--------|----------------------|----------------|
| 1       |             |        |                      | Chờ chế biến   |
| 2       |             |        |                      | Chờ chế biến   |


### B_BM2:

**MÀN HÌNH CẬP NHẬT TRẠNG THÁI MÓN (KITCHEN DISPLAY)**

**Bộ phận:** \[ \] Bếp \[ \] Quầy pha chế

**Nhân viên:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

| **STT** | **Bàn** | **Tên món** | **SL** | **Ghi chú** | **Thời gian nhận** | **Trạng thái** | **Hành động** |
|---------|---------|-------------|--------|-------------|--------------------|----------------|---------------|
| 1       |         |             |        |             |                    | Chờ chế biến   | \[Bắt đầu\]   |
| 2       |         |             |        |             |                    | Đang chế biến  | \[Hoàn thành\]|

**Bộ lọc:** \[ \] Tất cả \[ \] Chờ \[ \] Đang chế biến \[ \] Đã xong


### PV_BM4:

**XÁC NHẬN PHỤC VỤ MÓN**

**NV phục vụ:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Thời gian:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

| **STT** | **Bàn** | **Tên món** | **SL** | **Trạng thái** | **Hành động** |
|---------|---------|-------------|--------|----------------|----------------|
| 1       |         |             |        | Đã xong        | \[Đã phục vụ\] |
| 2       |         |             |        | Đã xong        | \[Đã phục vụ\] |

*Ghi chú: chỉ hiển thị các món có trạng thái "Đã xong" chưa phục vụ.*


### PV_BM5:

**CHECK-IN KHÁCH ĐÃ ĐẶT BÀN**

**NV phục vụ:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

| **STT** | **Mã đặt** | **Tên khách** | **SĐT** | **Bàn** | **Thời gian đặt** | **Số người** | **Hành động** |
|---------|------------|---------------|---------|---------|-------------------|--------------|----------------|
| 1       |            |               |         |         |                   |              | \[Nhận bàn\] \[Hủy\] |
| 2       |            |               |         |         |                   |              | \[Nhận bàn\] \[Hủy\] |


### K_BM1:

**PHIẾU NHẬP KHO**

**Số phiếu:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Ngày nhập:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Nhà cung cấp:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

| **STT** | **Tên NVL** | **ĐVT** | **SL** | **Đơn giá** | **Thành tiền** | **Ghi chú** |
|---------|-------------|---------|--------|-------------|----------------|-------------|
| 1       |             |         |        |             |                |             |
| 2       |             |         |        |             |                |             |

**Tổng giá trị nhập:** \...\...\...\...\.....

**Người lập:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Người duyệt:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....


### K_BM2:

**PHIẾU XUẤT KHO**

**Số phiếu:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Ngày xuất:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Bộ phận nhận:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

| **STT** | **Tên NVL** | **ĐVT** | **SL** | **Đơn giá** | **Thành tiền** | **Ghi chú** |
|---------|-------------|---------|--------|-------------|----------------|-------------|
| 1       |             |         |        |             |                |             |
| 2       |             |         |        |             |                |             |

**Tổng giá trị xuất:** \...\...\...\...\.....

**Người lập:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Người duyệt:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....


### K_BM3:

**BÁO CÁO TỒN KHO**

**Từ ngày:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Đến ngày:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

| **STT** | **Tên NVL** | **ĐVT** | **Tồn đầu** | **Nhập** | **Xuất** | **Tồn cuối** | **Ghi chú** |
|----|----|----|----|----|----|----|----|
| 1 |  |  |  |  |  |  |  |
| 2 |  |  |  |  |  |  |  |

**Ngày lập:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Người lập:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....


### K_BM4:

**BÁO CÁO NHẬP KHO**

**Từ ngày:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Đến ngày:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

| **STT** | **Tên NVL** | **ĐVT** | **Tổng SL nhập** | **Tổng giá trị** | **NCC** |
|---------|-------------|---------|------------------|------------------|---------|
| 1       |             |         |                  |                  |         |
| 2       |             |         |                  |                  |         |

**Tổng giá trị nhập kỳ:** \...\...\...\...\.....

**Ngày lập:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Người lập:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....


### K_BM5:

**BÁO CÁO XUẤT KHO**

**Từ ngày:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Đến ngày:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

| **STT** | **Tên NVL** | **ĐVT** | **Tổng SL xuất** | **Tổng giá trị** | **BP nhận** |
|---------|-------------|---------|------------------|------------------|-------------|
| 1       |             |         |                  |                  |             |
| 2       |             |         |                  |                  |             |

**Tổng giá trị xuất kỳ:** \...\...\...\...\.....

**Ngày lập:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....

**Người lập:** \...\...\...\...\...\...\...\...\...\...\...\...\...\...\...\.....


### QL_BM1:

**MÀN HÌNH QUẢN LÝ THỰC ĐƠN**

**Chức năng:** \[ Thêm \] \[ Sửa \] \[ Xóa \] \[ Tìm kiếm \]

| **STT** | **Tên món** | **Loại món** | **Đơn giá** | **Trạng thái** | **Mô tả** |
|---------|-------------|--------------|-------------|----------------|-----------|
| 1       |             | Món ăn       |             | Còn hàng       |           |
| 2       |             | Đồ uống      |             | Hết hàng       |           |


### QL_BM2:

**MÀN HÌNH QUẢN LÝ BÀN**

**Chức năng:** \[ Thêm \] \[ Sửa \] \[ Xóa \]

| **STT** | **Số bàn** | **Khu vực** | **Sức chứa** | **Trạng thái** | **Ghi chú** |
|---------|------------|-------------|--------------|----------------|-------------|
| 1       |            | Tầng 1      |              | Trống          |             |
| 2       |            | Sân vườn    |              | Có khách       |             |


### QL_BM3:

**MÀN HÌNH QUẢN LÝ TÀI KHOẢN**

**Chức năng:** \[ Thêm \] \[ Sửa \] \[ Khóa/Mở khóa \] \[ Đặt lại mật khẩu \] \[ Tìm kiếm \]

| **STT** | **Mã NV** | **Họ tên** | **Tên đăng nhập** | **Vai trò** | **Trạng thái** | **Ngày tạo** |
|---------|-----------|------------|--------------------|-------------|----------------|--------------|
| 1       |           |            |                    | Phục vụ     | Hoạt động      |              |
| 2       |           |            |                    | Thu ngân    | Đã khóa        |              |

**Vai trò:** Admin / Phục vụ / Bếp / Thu ngân / Kho


### QL_BM4:

**BÁO CÁO TỔNG HỢP (DASHBOARD QUẢN LÝ)**

**Từ ngày:** \...\...\...\...\...\...\...\...\.....  **Đến ngày:** \...\...\...\...\...\...\...\...\.....

**A. Doanh thu**

| **STT** | **Ngày** | **Số hóa đơn** | **Tổng doanh thu** | **Tiền mặt** | **Chuyển khoản** |
|---------|----------|----------------|--------------------|--------------|------------------|
| 1       |          |                |                    |              |                  |

**Tổng doanh thu kỳ:** \...\...\...\...\.....

**B. Top món bán chạy**

| **STT** | **Tên món** | **Số lượng đã bán** | **Doanh thu** |
|---------|-------------|---------------------|---------------|
| 1       |             |                     |               |

**C. Tồn kho cảnh báo (≤ định mức tối thiểu)**

| **STT** | **Tên NVL** | **ĐVT** | **Tồn hiện tại** | **Định mức tối thiểu** |
|---------|-------------|---------|------------------|------------------------|
| 1       |             |         |                  |                        |

**Ngày lập:** \...\...\...\...\...\...\.....  **Người lập:** \...\...\...\...\...\...\.....


### QL_BM5:

**MÀN HÌNH CẤU HÌNH HỆ THỐNG**

| **Tham số** | **Giá trị hiện tại** | **Giá trị mới** |
|---|---|---|
| Áp dụng thuế VAT | \[ \] Bật \[ \] Tắt |  |
| Tỷ lệ VAT (%) |  |  |
| Thời gian tự hủy đặt bàn quá hạn (phút) |  |  |
| Giờ mở cửa |  |  |
| Giờ đóng cửa |  |  |
| Thời gian phiên đăng nhập (phút) |  |  |
| Lịch sao lưu tự động (HH:MM) |  |  |

**Người sửa:** \...\...\...\...\.....  **Thời gian:** \...\...\...\...\.....

\[ Lưu \] \[ Khôi phục mặc định \]


### SYS_BM1:

**MÀN HÌNH ĐĂNG NHẬP**

**Tên đăng nhập:** \...\...\...\...\...\...\...\...\.....

**Mật khẩu:** \...\...\...\...\...\...\...\...\.....

\[ Đăng nhập \] \[ Quên mật khẩu \]

*Ghi chú: Sau 5 lần sai liên tiếp → khóa tài khoản. Liên hệ Admin để mở khóa.*

# 5. BẢNG YÊU CẦU CHỨC NĂNG HỆ THỐNG {#bảng-yêu-cầu-chức-năng-hệ-thống}

<table>
<colgroup>
<col style="width: 6%" />
<col style="width: 16%" />
<col style="width: 76%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><strong>STT</strong></th>
<th style="text-align: center;"><strong>Nội dung</strong></th>
<th style="text-align: center;"><strong>Mô tả chi tiết</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td>
<td>Phân quyền sử dụng</td>
<td><p>- Admin: tất cả chức năng (quản lý tài khoản, thực đơn, bàn, cấu hình, báo cáo tổng hợp, sao lưu/phục hồi).</p>
<p>- Phục vụ: đặt bàn, check-in, gọi món, bàn giao bếp, xác nhận phục vụ món.</p>
<p>- Bếp: nhận phiếu order, cập nhật trạng thái món.</p>
<p>- Thu ngân: thanh toán, xuất hóa đơn, in lại hóa đơn, báo cáo doanh thu.</p>
<p>- Kho: phiếu nhập/xuất kho, báo cáo tồn/nhập/xuất.</p>
<p>- Mọi vai trò: đăng nhập/đăng xuất, đổi mật khẩu cá nhân.</p></td>
</tr>
<tr>
<td>2</td>
<td>Xác thực và phiên làm việc</td>
<td><p>- Đăng nhập bằng tên đăng nhập + mật khẩu (đã băm).</p>
<p>- Mỗi yêu cầu chức năng được kiểm tra quyền theo ma trận vai trò ↔ chức năng.</p>
<p>- Phiên tự đăng xuất sau khoảng thời gian cấu hình không thao tác (mặc định 30 phút).</p></td>
</tr>
<tr>
<td>3</td>
<td>Sao lưu và phục hồi</td>
<td><p>- Sao lưu tự động định kỳ (mặc định cuối ngày) + sao lưu thủ công khi cần.</p>
<p>- Lưu tối thiểu 30 bản sao lưu gần nhất.</p>
<p>- Phục hồi khi có sự cố — chỉ Admin có quyền thực hiện.</p>
<p>- Ghi log mỗi lần sao lưu/phục hồi (thời gian, người thực hiện, kết quả).</p></td>
</tr>
<tr>
<td>4</td>
<td>Ghi log audit</td>
<td><p>- Ghi log các thao tác quan trọng: đăng nhập/đăng xuất, thanh toán, nhập/xuất kho, thay đổi cấu hình, quản lý tài khoản.</p>
<p>- Lưu: thời gian, người thao tác, loại thao tác, đối tượng tác động.</p>
<p>- Log lưu tối thiểu 1 năm; chỉ Admin truy vấn được.</p></td>
</tr>
<tr>
<td>5</td>
<td>Số lượng người dùng đồng thời</td>
<td><p>- Hỗ trợ tối thiểu 20 người dùng truy cập đồng thời trong giờ cao điểm.</p>
<p>- Mỗi tài khoản chỉ được đăng nhập trên 1 phiên tại 1 thời điểm.</p></td>
</tr>
<tr>
<td>6</td>
<td>Thời gian lưu trữ dữ liệu</td>
<td><p>- Hóa đơn, phiếu nhập/xuất kho: lưu tối thiểu 5 năm theo quy định kế toán.</p>
<p>- Phiếu order, đặt bàn: lưu tối thiểu 2 năm.</p>
<p>- Log audit: tối thiểu 1 năm.</p></td>
</tr>
</tbody>
</table>

# 6. BẢNG YÊU CẦU VỀ CHẤT LƯỢNG HỆ THỐNG {#bảng-yêu-cầu-về-chất-lượng-hệ-thống}

| **STT** | **Nội dung** | **Tiêu chuẩn** | **Mô tả chi tiết** |
|----|----|----|----|
| 1 | Cho phép thay đổi tỷ lệ VAT | Tiến hóa | Admin cấu hình bật/tắt thuế VAT, thay đổi tỷ lệ. |
| 2 | Cấu hình thời gian hủy đặt bàn | Tiến hóa | Thay đổi thời gian chờ (mặc định 15 phút). |
| 3 | Giao diện nhất quán | Tiện dụng | Bố cục, màu sắc, phông chữ đồng nhất. Hỗ trợ phím tắt. |
| 4 | Tốc độ xử lý nhanh | Hiệu quả | Ghi order ≤ 5s. Xuất hóa đơn ≤ 10s. Lập báo cáo ≤ 30s. |
| 5 | Hỗ trợ in phiếu | Tương thích | Tương thích máy in nhiệt 80mm và máy in A4. |
| 6 | Hoạt động ổn định | Tin cậy | Liên tục trong giờ kinh doanh, tự xử lý lỗi kết nối. |
| 7 | Bảo mật xác thực | Bảo mật | Mật khẩu băm (bcrypt/argon2), không lưu plaintext. HTTPS cho mọi giao tiếp. |
| 8 | Chống truy cập trái phép | Bảo mật | Kiểm tra phân quyền ở mỗi API. Khóa tài khoản sau 5 lần sai. Phiên tự hết hạn. |
| 9 | Toàn vẹn dữ liệu giao dịch | Tin cậy | Thanh toán và cập nhật tồn kho dùng transaction (atomic). Rollback nếu lỗi giữa chừng. |

# 7. SƠ ĐỒ LUỒNG DỮ LIỆU CHO TỪNG YÊU CẦU {#sơ-đồ-luồng-dữ-liệu-cho-từng-yêu-cầu}

Phần này trình bày sơ đồ luồng dữ liệu (DFD) cho các yêu cầu chức năng nghiệp vụ chính của hệ thống. Mỗi sơ đồ tuân theo cấu trúc tổng quát gồm 6 luồng dữ liệu (D1--D6), với các thành phần: Người dùng, Khối xử lý, Thiết bị nhập/xuất, và Bộ nhớ phụ (CSDL).

**Ký hiệu tổng quát:**

| **Ký hiệu** | **Ý nghĩa trong thế giới thực** | **Ý nghĩa trong phần mềm** |
|----|----|----|
| Người dùng (hình chữ nhật) | Nhà chuyên môn / Bộ phận | Người thao tác trên phần mềm |
| Khối xử lý (hình elip) | Công việc cần thực hiện | Chức năng phần mềm |
| Luồng dữ liệu (mũi tên) | Thông tin trao đổi | Dữ liệu nhập/xuất |
| Bộ nhớ phụ (hai đường kẻ) | Hồ sơ, sổ sách | Cơ sở dữ liệu |

## 7.1. Sơ đồ luồng dữ liệu các yêu cầu Bộ phận Phục vụ {#sơ-đồ-luồng-dữ-liệu-các-yêu-cầu-bộ-phận-phục-vụ}

### 7.1.1. Tiếp nhận đặt bàn (Loại: Lưu trữ) {#tiếp-nhận-đặt-bàn-loại-lưu-trữ}

**Sơ đồ luồng dữ liệu:**

|  | **Nhân viên Phục vụ** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Tiếp nhận đặt bàn** | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin đặt bàn do khách hàng cung cấp trực tiếp hoặc qua điện thoại, được Nhân viên Phục vụ nhập vào hệ thống, gồm: tên khách, SĐT, số người, thời gian đặt, hình thức đặt bàn và bàn được chọn. |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Danh sách bàn (số bàn, khu vực, sức chứa, trạng thái), giờ hoạt động nhà hàng, thời gian tự động hủy đặt bàn. |
| D4 | Ghi vào CSDL: Thông tin đặt bàn (D1 + mã đặt bàn tự phát sinh). Cập nhật trạng thái bàn thành \"Đã đặt\". |
| D5 | Không có. |
| D6 | Hiển thị cho Phục vụ: Danh sách bàn trống để chọn, kết quả đặt bàn (thành công/thất bại). |

**Thuật toán xử lý:**

> **Bước 1:** Đọc D3: lấy danh sách bàn trống, giờ hoạt động từ CSDL.
>
> **Bước 2:** Hiển thị D6: danh sách bàn trống để Phục vụ chọn.
>
> **Bước 3:** Nhận D1 từ Phục vụ: tên khách, SĐT, số người, thời gian, bàn được chọn.
>
> **Bước 4:** Kiểm tra quy định PV_QĐ1: thời gian có trong giờ hoạt động không? Bàn còn trống không? Số người ≤ sức chứa không?
>
> **Bước 5:** Nếu không thỏa quy định → thông báo lỗi D6 → quay lại Bước 3.
>
> **Bước 6:** Nếu thỏa → phát sinh mã đặt bàn, ghi D4 vào CSDL Đặt bàn.
>
> **Bước 7:** Cập nhật trạng thái bàn thành \"Đã đặt\" trong CSDL Bàn.
>
> **Bước 8:** Hiển thị D6: thông báo đặt bàn thành công.
>
> **Bước 9:** Kết thúc.

### 7.1.2. Ghi nhận gọi món (Loại: Lưu trữ) {#ghi-nhận-gọi-món-loại-lưu-trữ}

**Sơ đồ luồng dữ liệu:**

|  | **Nhân viên Phục vụ** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Ghi nhận gọi món**  | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin gọi món do Phục vụ nhập: Bàn số, danh sách món (tên món, số lượng, ghi chú) (dựa vào PV_BM2). |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Danh sách thực đơn (tên, loại, đơn giá, trạng thái Còn hàng/Hết), danh sách bàn đang có khách. |
| D4 | Ghi vào CSDL: Phiếu order (mã order tự phát sinh + D1 + đơn giá tra từ thực đơn). Cập nhật trạng thái bàn thành \"Có khách\". |
| D5 | Không có. |
| D6 | Hiển thị cho Phục vụ: Thực đơn để chọn món, kết quả ghi nhận (thành công/thất bại, tổng tạm tính). |

**Thuật toán xử lý:**

> **Bước 1:** Đọc D3: lấy danh sách thực đơn (chỉ các món Còn hàng), danh sách bàn.
>
> **Bước 2:** Hiển thị D6: thực đơn cho Phục vụ chọn.
>
> **Bước 3:** Nhận D1: Phục vụ chọn bàn, chọn món, nhập số lượng, ghi chú.
>
> **Bước 4:** Kiểm tra: Món có trong thực đơn không? Trạng thái \"Còn hàng\"? Số lượng \> 0?
>
> **Bước 5:** Nếu không thỏa → thông báo lỗi D6 → quay lại Bước 3.
>
> **Bước 6:** Phát sinh mã order, tra đơn giá từ D3, ghi D4 vào CSDL Phiếu Order.
>
> **Bước 7:** Cập nhật trạng thái bàn thành \"Có khách\" (nếu chưa) trong CSDL Bàn.
>
> **Bước 8:** Hiển thị D6: thông báo ghi nhận thành công, tổng tạm tính.
>
> **Bước 9:** Kết thúc.

### 7.1.3. Bàn giao cho bếp / quầy pha chế (Loại: Xử lý) {#bàn-giao-cho-bếp-quầy-pha-chế-loại-xử-lý}

**Sơ đồ luồng dữ liệu:**

|  | **Nhân viên Phục vụ** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Bàn giao bếp / pha chế** | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin do Phục vụ thao tác: lệnh "Chốt order" (xác nhận chuyển order xuống bếp/pha chế) cho một bàn cụ thể. |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Chi tiết phiếu order chưa chuyển (món, loại MA/DU, SL, ghi chú). Đọc loại món để phân luồng (Món ăn → Bếp; Đồ uống → Quầy pha chế). |
| D4 | Ghi vào CSDL: Phát sinh 1 hoặc 2 phiếu chuyển (PV_BM3) — một cho Bếp (nếu có món ăn), một cho Quầy pha chế (nếu có đồ uống). Cập nhật trạng thái từng dòng món thành "Chờ chế biến". |
| D5 | Xuất ra máy in (tùy chọn): Phiếu chuyển bếp / phiếu chuyển pha chế (PV_BM3) in ra tại khu vực tương ứng. |
| D6 | Hiển thị cho Phục vụ: Kết quả chốt order, danh sách các phiếu vừa chuyển. |

**Thuật toán xử lý:**

> **Bước 1:** Nhận D1: Phục vụ chọn bàn và bấm "Chốt order".
>
> **Bước 2:** Đọc D3: lấy các dòng món của order chưa chuyển bếp/pha chế.
>
> **Bước 3:** Phân loại theo trường "Loại món": MA → nhóm Bếp; DU → nhóm Quầy pha chế.
>
> **Bước 4:** Với mỗi nhóm không rỗng: phát sinh mã phiếu chuyển, ghi D4 vào CSDL.
>
> **Bước 5:** Cập nhật trạng thái dòng món thành "Chờ chế biến".
>
> **Bước 6:** Xuất D5: in phiếu chuyển ra máy in của khu vực tương ứng (nếu cấu hình bật in).
>
> **Bước 7:** Hiển thị D6: thông báo chuyển thành công, danh sách phiếu.
>
> **Bước 8:** Kết thúc.

### 7.1.4. Phục vụ món ra bàn (Loại: Cập nhật) {#phục-vụ-món-ra-bàn-loại-cập-nhật}

**Sơ đồ luồng dữ liệu:**

|  | **Nhân viên Phục vụ** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Phục vụ món ra bàn** | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin do Phục vụ chọn: dòng món cần xác nhận đã phục vụ (theo bàn, mã món). |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Danh sách các dòng món có trạng thái "Đã xong" nhưng chưa được Phục vụ xác nhận đem ra bàn. |
| D4 | Ghi vào CSDL: Cập nhật trạng thái dòng món → "Đã phục vụ", ghi thời gian phục vụ và mã NV phục vụ. |
| D5 | Không có. |
| D6 | Hiển thị cho Phục vụ: Danh sách món "Đã xong" cần phục vụ (PV_BM4); thông báo cập nhật thành công; thông báo realtime khi có món mới sẵn sàng. |

**Thuật toán xử lý:**

> **Bước 1:** Đọc D3: truy vấn các dòng món trạng thái "Đã xong" của các bàn được phân công.
>
> **Bước 2:** Hiển thị D6: danh sách món sẵn sàng phục vụ (PV_BM4).
>
> **Bước 3:** Nhận D1: Phục vụ chọn dòng món và bấm "Đã phục vụ".
>
> **Bước 4:** Kiểm tra: trạng thái hiện tại của dòng món phải là "Đã xong" (tránh cập nhật trùng).
>
> **Bước 5:** Ghi D4: cập nhật trạng thái → "Đã phục vụ", ghi thời gian + mã NV.
>
> **Bước 6:** Hiển thị D6: thông báo thành công, loại dòng món vừa cập nhật khỏi danh sách chờ.
>
> **Bước 7:** Kết thúc.

### 7.1.5. Tiếp nhận khách đã đặt bàn — Check-in (Loại: Cập nhật) {#check-in-khách-đặt-bàn-loại-cập-nhật}

**Sơ đồ luồng dữ liệu:**

|  | **Nhân viên Phục vụ** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Check-in đặt bàn** | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin do Phục vụ thao tác: chọn phiếu đặt bàn của khách đến (theo mã đặt hoặc SĐT) và bấm "Nhận bàn". |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Danh sách đặt bàn trạng thái "Đã đặt" trong khoảng thời gian gần (giờ hiện tại ± cấu hình). |
| D4 | Ghi vào CSDL: Cập nhật phiếu đặt bàn → "Đã nhận bàn"; cập nhật bàn → "Có khách"; ghi thời gian check-in. |
| D5 | Không có. |
| D6 | Hiển thị cho Phục vụ: Danh sách đặt bàn chờ check-in (PV_BM5); thông báo thành công và mở màn hình gọi món cho bàn. |

**Thuật toán xử lý:**

> **Bước 1:** Đọc D3: lấy danh sách đặt bàn trạng thái "Đã đặt" sắp đến/đã qua giờ.
>
> **Bước 2:** Hiển thị D6: PV_BM5 cho Phục vụ chọn.
>
> **Bước 3:** Nhận D1: Phục vụ chọn phiếu đặt và bấm "Nhận bàn".
>
> **Bước 4:** Kiểm tra: bàn vẫn ở trạng thái "Đã đặt" (chưa bị job tự hủy).
>
> **Bước 5:** Ghi D4: cập nhật phiếu đặt → "Đã nhận bàn"; bàn → "Có khách"; ghi thời gian check-in.
>
> **Bước 6:** Hiển thị D6: chuyển hướng sang màn hình gọi món của bàn.
>
> **Bước 7:** Kết thúc.

*Ghi chú:* Việc tự động hủy phiếu đặt quá hạn (PV_QĐ1) do một job định kỳ trong hệ thống thực hiện, không thuộc luồng tương tác này.

## 7.2. Sơ đồ luồng dữ liệu các yêu cầu Bộ phận Thu ngân {#sơ-đồ-luồng-dữ-liệu-các-yêu-cầu-bộ-phận-thu-ngân}

### 7.2.1. Xử lý thanh toán (Loại: Tính toán) {#xử-lý-thanh-toán-loại-tính-toán}

**Sơ đồ luồng dữ liệu:**

|  | **Thu ngân** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Thanh toán** | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin do Thu ngân nhập: Bàn số cần thanh toán, tiền khách đưa, hình thức thanh toán (tiền mặt/chuyển khoản). |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Chi tiết phiếu order của bàn (tên món, SL, đơn giá, trạng thái), tỷ lệ VAT (từ CSDL Cấu hình). |
| D4 | Ghi vào CSDL: Kết quả tính toán (tổng tiền, thuế, tổng thanh toán, tiền thừa) → lưu vào CSDL Hóa đơn. Cập nhật trạng thái bàn → \"Trống\". |
| D5 | Xuất ra máy in: Hóa đơn thanh toán (TN_BM3). |
| D6 | Hiển thị cho Thu ngân: Màn hình thanh toán TN_BM2 (danh sách món, tổng tiền, thuế, tổng thanh toán, tiền thừa). |

**Thuật toán xử lý:**

> **Bước 1:** Nhận D1: Thu ngân chọn bàn cần thanh toán.
>
> **Bước 2:** Đọc D3: lấy chi tiết order của bàn, tỷ lệ VAT từ CSDL.
>
> **Bước 3:** Kiểm tra quy định TN_QĐ1: tất cả món đã \"Đã phục vụ\" hoặc \"Đã hủy\" chưa?
>
> **Bước 4:** Nếu chưa → thông báo lỗi D6 (\"Còn món chưa phục vụ xong\") → kết thúc.
>
> **Bước 5:** Tính toán theo quy định TN_QĐ1: Tổng tiền = ∑(SL × Đơn giá). Thuế VAT = Tổng tiền × Tỷ lệ VAT. Tổng thanh toán = Tổng tiền + Thuế.
>
> **Bước 6:** Hiển thị D6: màn hình thanh toán (danh sách món, tổng, thuế, tổng thanh toán).
>
> **Bước 7:** Nhận D1 (tiếp): tiền khách đưa, hình thức thanh toán.
>
> **Bước 8:** Tính tiền thừa = Tiền khách đưa − Tổng thanh toán. Kiểm tra tiền thừa ≥ 0.
>
> **Bước 9:** Ghi D4: lưu hóa đơn vào CSDL Hóa đơn. Cập nhật trạng thái bàn → \"Trống\".
>
> **Bước 10:** Hiển thị D6: kết quả thanh toán thành công, tiền thừa.
>
> **Bước 11:** Xuất D5: in hóa đơn (TN_BM3) ra máy in.
>
> **Bước 12:** Kết thúc.

### 7.2.2. Lập báo cáo doanh thu (Loại: Kết xuất) {#lập-báo-cáo-doanh-thu-loại-kết-xuất}

**Sơ đồ luồng dữ liệu:**

|  | **Thu ngân** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Lập báo cáo doanh thu** | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin do Thu ngân nhập: Ngày bắt đầu, ngày kết thúc kỳ báo cáo. |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Danh sách hóa đơn đã thanh toán trong kỳ (số HĐ, ngày, bàn, tổng tiền, hình thức TT). |
| D4 | Không có (báo cáo chỉ đọc, không ghi thêm dữ liệu mới). |
| D5 | Xuất ra máy in: Báo cáo doanh thu (TN_BM1). |
| D6 | Hiển thị cho Thu ngân: Bảng báo cáo doanh thu theo biểu mẫu TN_BM1 (danh sách HĐ, tổng doanh thu kỳ). |

**Thuật toán xử lý:**

> **Bước 1:** Nhận D1: Thu ngân nhập ngày bắt đầu và ngày kết thúc kỳ báo cáo.
>
> **Bước 2:** Kiểm tra: ngày bắt đầu ≤ ngày kết thúc.
>
> **Bước 3:** Đọc D3: truy vấn CSDL Hóa đơn, lấy tất cả hóa đơn đã thanh toán trong khoảng \[ngày bắt đầu, ngày kết thúc\].
>
> **Bước 4:** Tính tổng doanh thu = ∑ (Tổng tiền của từng hóa đơn trong kỳ).
>
> **Bước 5:** Hiển thị D6: báo cáo doanh thu theo biểu mẫu TN_BM1.
>
> **Bước 6:** Xuất D5: in báo cáo ra máy in (nếu Thu ngân yêu cầu).
>
> **Bước 7:** Kết thúc.

### 7.2.3. Xuất / In lại hóa đơn (Loại: Kết xuất) {#xuất-in-lại-hóa-đơn-loại-kết-xuất}

**Sơ đồ luồng dữ liệu:**

|  | **Thu ngân** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Xuất / In lại hóa đơn** | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin do Thu ngân nhập: Số hóa đơn cần in (hoặc tra theo bàn + ngày), số bản in. |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Hóa đơn (tổng tiền, VAT, hình thức TT), chi tiết món của hóa đơn, thông tin nhà hàng (tên, địa chỉ, MST từ CSDL Cấu hình). |
| D4 | Ghi vào CSDL: Ghi log audit (ai in lại, hóa đơn nào, lúc nào, số bản). Không sửa nội dung hóa đơn gốc. |
| D5 | Xuất ra máy in: Hóa đơn thanh toán (TN_BM3) — có thể đánh dấu "BẢN SAO" nếu in lại lần ≥ 2. |
| D6 | Hiển thị cho Thu ngân: Xem trước hóa đơn, kết quả in. |

**Thuật toán xử lý:**

> **Bước 1:** Nhận D1: Thu ngân nhập số hóa đơn (hoặc chọn từ danh sách hóa đơn theo bàn/ngày).
>
> **Bước 2:** Đọc D3: lấy hóa đơn, chi tiết món, thông tin nhà hàng.
>
> **Bước 3:** Nếu không tìm thấy → thông báo lỗi D6 → kết thúc.
>
> **Bước 4:** Hiển thị D6: bản xem trước hóa đơn theo TN_BM3.
>
> **Bước 5:** Thu ngân xác nhận in. Nếu đây là lần in ≥ 2 → đánh dấu "BẢN SAO".
>
> **Bước 6:** Xuất D5: in hóa đơn ra máy in.
>
> **Bước 7:** Ghi D4: lưu log in lại.
>
> **Bước 8:** Kết thúc.

## 7.3. Sơ đồ luồng dữ liệu các yêu cầu Bộ phận Bếp {#sơ-đồ-luồng-dữ-liệu-các-yêu-cầu-bộ-phận-bếp}

### 7.3.1. Nhận phiếu order (Loại: Xử lý) {#nhận-phiếu-order-loại-xử-lý}

**Sơ đồ luồng dữ liệu:**

|  | **Bộ phận Bếp** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Nhận phiếu order**  | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Không có (hệ thống tự động gửi phiếu, Bếp chỉ xác nhận). |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Danh sách phiếu order có trạng thái \"Chờ chế biến\" (sắp theo thời gian FIFO), chi tiết từng phiếu (bàn, món, SL, ghi chú). |
| D4 | Ghi vào CSDL: Cập nhật trạng thái phiếu order thành \"Đã nhận\" và ghi thời gian nhận. |
| D5 | Xuất ra máy in: Phiếu order bếp (B_BM1). |
| D6 | Hiển thị cho Bếp: Danh sách phiếu order đang chờ, chi tiết từng phiếu. |

**Thuật toán xử lý:**

> **Bước 1:** Đọc D3: lấy danh sách phiếu order có trạng thái \"Chờ chế biến\", sắp theo thứ tự thời gian (FIFO).
>
> **Bước 2:** Hiển thị D6: danh sách phiếu order đang chờ cho Bếp xem.
>
> **Bước 3:** Bếp chọn phiếu order để xác nhận đã nhận.
>
> **Bước 4:** Ghi D4: cập nhật trạng thái phiếu → \"Đã nhận\", ghi thời gian nhận.
>
> **Bước 5:** Xuất D5: in phiếu order bếp (B_BM1) ra máy in.
>
> **Bước 6:** Kết thúc.

### 7.3.2. Cập nhật trạng thái món (Loại: Cập nhật) {#cập-nhật-trạng-thái-món-loại-cập-nhật}

**Sơ đồ luồng dữ liệu:**

|  | **Bộ phận Bếp** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6|  |
| **Thiết bị nhập** → D2 → | **Xử lý Cập nhật trạng thái món** | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin do Bếp chọn: Món cần cập nhật trạng thái, trạng thái mới (Đang chế biến / Đã xong). |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Danh sách các món trong phiếu order đã nhận (trạng thái hiện tại của từng món). |
| D4 | Ghi vào CSDL: Cập nhật trạng thái món mới. Nếu \"Đã xong\" → ghi thời gian hoàn thành. |
| D5 | Không có. |
| D6 | Hiển thị cho Bếp: trạng thái cập nhật thành công. Hệ thống tự động gửi thông báo cho Phục vụ khi món \"Đã xong\". |

**Thuật toán xử lý:**

> **Bước 1:** Đọc D3: lấy danh sách món trong các phiếu order đã nhận từ CSDL.
>
> **Bước 2:** Hiển thị D6: danh sách món đang chế biến.
>
> **Bước 3:** Nhận D1: Bếp chọn món, chọn trạng thái mới.
>
> **Bước 4:** Kiểm tra quy định B_QĐ1: trạng thái phải chuyển tuần tự (Chờ → Đang chế biến → Đã xong). Không được bỏ bước.
>
> **Bước 5:** Nếu vi phạm thứ tự → thông báo lỗi D6 → quay lại Bước 3.
>
> **Bước 6:** Ghi D4: cập nhật trạng thái món trong CSDL Phiếu Order.
>
> **Bước 7:** Nếu trạng thái mới = \"Đã xong\" → hệ thống tự động gửi thông báo D6 cho Nhân viên Phục vụ.
>
> **Bước 8:** Kết thúc.

## 7.4. Sơ đồ luồng dữ liệu các yêu cầu Bộ phận Kho {#sơ-đồ-luồng-dữ-liệu-các-yêu-cầu-bộ-phận-kho}

### 7.4.1. Lập phiếu nhập kho (Loại: Lưu trữ) {#lập-phiếu-nhập-kho-loại-lưu-trữ}

**Sơ đồ luồng dữ liệu:**

|  | **Nhân viên Kho** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Lập phiếu nhập kho** | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin do NV Kho nhập: Ngày nhập, nhà cung cấp, danh sách NVL (tên, ĐVT, SL, đơn giá) (dựa vào K_BM1). |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Danh mục NVL (để chọn), danh sách nhà cung cấp, số liệu tồn kho hiện tại. |
| D4 | Ghi vào CSDL: Phiếu nhập kho (mã phiếu tự phát sinh + D1 + tổng giá trị nhập). Cập nhật tồn kho: Tồn mới = Tồn cũ + SL nhập. |
| D5 | Xuất ra máy in: Phiếu nhập kho (K_BM1). |
| D6 | Hiển thị cho NV Kho: Danh mục NVL, NCC để chọn. Kết quả lưu thành công, tổng giá trị nhập. |

**Thuật toán xử lý:**

> **Bước 1:** Đọc D3: lấy danh mục NVL, danh sách NCC từ CSDL.
>
> **Bước 2:** Hiển thị D6: danh mục NVL, NCC cho NV Kho chọn.
>
> **Bước 3:** Nhận D1: NV Kho nhập ngày, chọn NCC, chọn NVL, nhập SL, đơn giá.
>
> **Bước 4:** Kiểm tra: SL \> 0, đơn giá \> 0.
>
> **Bước 5:** Tính tổng giá trị nhập = ∑(SL × Đơn giá).
>
> **Bước 6:** Phát sinh mã phiếu, ghi D4: lưu phiếu nhập vào CSDL.
>
> **Bước 7:** Cập nhật tồn kho: Tồn mới = Tồn cũ + SL nhập.
>
> **Bước 8:** Hiển thị D6: thông báo thành công, tổng giá trị nhập.
>
> **Bước 9:** Xuất D5: in phiếu nhập kho (K_BM1) nếu cần.
>
> **Bước 10:** Kết thúc.

### 7.4.2. Báo cáo tồn kho (Loại: Kết xuất) {#báo-cáo-tồn-kho-loại-kết-xuất}

**Sơ đồ luồng dữ liệu:**

|  | **Nhân viên Kho** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Lập báo cáo tồn kho** | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin do NV Kho nhập: Ngày bắt đầu, ngày kết thúc kỳ báo cáo. |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Tồn đầu kỳ từng NVL, tổng SL nhập trong kỳ, tổng SL xuất trong kỳ (truy vấn CSDL Kho). |
| D4 | Không có (báo cáo chỉ đọc). |
| D5 | Xuất ra máy in: Báo cáo tồn kho (K_BM3). |
| D6 | Hiển thị cho NV Kho: Bảng báo cáo tồn kho theo K_BM3 (tồn đầu, nhập, xuất, tồn cuối từng NVL). |

**Thuật toán xử lý:**

> **Bước 1:** Nhận D1: NV Kho nhập khoảng thời gian báo cáo.
>
> **Bước 2:** Kiểm tra: ngày bắt đầu ≤ ngày kết thúc.
>
> **Bước 3:** Đọc D3: truy vấn CSDL, tính tồn đầu kỳ, tổng nhập, tổng xuất cho từng NVL.
>
> **Bước 4:** Tính tồn cuối kỳ = Tồn đầu kỳ + Nhập trong kỳ − Xuất trong kỳ (cho từng NVL).
>
> **Bước 5:** Hiển thị D6: báo cáo tồn kho theo biểu mẫu K_BM3.
>
> **Bước 6:** Xuất D5: in báo cáo (K_BM3) ra máy in nếu NV Kho yêu cầu.
>
> **Bước 7:** Kết thúc.

### 7.4.3. Lập phiếu xuất kho (Loại: Lưu trữ) {#lập-phiếu-xuất-kho-loại-lưu-trữ}

**Sơ đồ luồng dữ liệu:**

|  | **Nhân viên Kho** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Lập phiếu xuất kho** | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin do NV Kho nhập: Ngày xuất, bộ phận nhận (Bếp/Quầy pha chế), danh sách NVL (tên, ĐVT, SL, đơn giá), ghi chú (dựa vào K_BM2). |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Danh mục NVL, tồn kho hiện tại của từng NVL, danh sách bộ phận nhận. |
| D4 | Ghi vào CSDL: Phiếu xuất kho (mã phiếu tự phát sinh + D1 + tổng giá trị xuất). Cập nhật tồn kho: Tồn mới = Tồn cũ − SL xuất. |
| D5 | Xuất ra máy in: Phiếu xuất kho (K_BM2). |
| D6 | Hiển thị cho NV Kho: Danh mục NVL kèm tồn hiện tại để chọn. Kết quả lưu thành công, tổng giá trị xuất. |

**Thuật toán xử lý:**

> **Bước 1:** Đọc D3: lấy danh mục NVL + tồn hiện tại, danh sách bộ phận nhận.
>
> **Bước 2:** Hiển thị D6: danh mục NVL + tồn cho NV Kho chọn.
>
> **Bước 3:** Nhận D1: NV Kho nhập ngày, chọn bộ phận nhận, chọn NVL, nhập SL, đơn giá.
>
> **Bước 4:** Kiểm tra quy định K_QĐ1: SL > 0; đơn giá > 0; SL xuất ≤ tồn hiện tại.
>
> **Bước 5:** Nếu vi phạm → thông báo lỗi D6 → quay lại Bước 3.
>
> **Bước 6:** Tính tổng giá trị xuất = ∑(SL × Đơn giá).
>
> **Bước 7:** Phát sinh mã phiếu, ghi D4: lưu phiếu xuất vào CSDL trong 1 transaction.
>
> **Bước 8:** Cập nhật tồn kho: Tồn mới = Tồn cũ − SL xuất (cùng transaction). Nếu tồn mới ≤ định mức tối thiểu → đánh dấu cảnh báo.
>
> **Bước 9:** Hiển thị D6: thông báo thành công, tổng giá trị xuất, cảnh báo tồn thấp (nếu có).
>
> **Bước 10:** Xuất D5: in phiếu xuất kho (K_BM2) nếu cần.
>
> **Bước 11:** Kết thúc.

### 7.4.4. Báo cáo nhập kho (Loại: Kết xuất) {#báo-cáo-nhập-kho-loại-kết-xuất}

**Sơ đồ luồng dữ liệu:**

|  | **Nhân viên Kho** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Lập báo cáo nhập kho** | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin do NV Kho nhập: Ngày bắt đầu, ngày kết thúc kỳ báo cáo. Tùy chọn lọc theo NCC. |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Tất cả phiếu nhập kho trong khoảng thời gian, chi tiết NVL từng phiếu, danh sách NCC. |
| D4 | Không có (báo cáo chỉ đọc). |
| D5 | Xuất ra máy in: Báo cáo nhập kho (K_BM4). |
| D6 | Hiển thị cho NV Kho: Bảng báo cáo K_BM4 (NVL, tổng SL nhập, tổng giá trị, NCC). |

**Thuật toán xử lý:**

> **Bước 1:** Nhận D1: NV Kho nhập khoảng thời gian (và NCC nếu có).
>
> **Bước 2:** Kiểm tra: ngày bắt đầu ≤ ngày kết thúc.
>
> **Bước 3:** Đọc D3: truy vấn các phiếu nhập trong khoảng [BĐ, KT] (lọc theo NCC nếu có).
>
> **Bước 4:** Tổng hợp theo NVL: tổng SL nhập, tổng giá trị nhập, NCC chính.
>
> **Bước 5:** Tính tổng giá trị nhập kỳ = ∑ (tổng giá trị từng NVL).
>
> **Bước 6:** Hiển thị D6: báo cáo theo K_BM4.
>
> **Bước 7:** Xuất D5: in K_BM4 nếu NV Kho yêu cầu.
>
> **Bước 8:** Kết thúc.

### 7.4.5. Báo cáo xuất kho (Loại: Kết xuất) {#báo-cáo-xuất-kho-loại-kết-xuất}

**Sơ đồ luồng dữ liệu:**

|  | **Nhân viên Kho** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Lập báo cáo xuất kho** | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin do NV Kho nhập: Ngày bắt đầu, ngày kết thúc kỳ báo cáo. Tùy chọn lọc theo bộ phận nhận. |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Tất cả phiếu xuất kho trong khoảng thời gian, chi tiết NVL từng phiếu. |
| D4 | Không có (báo cáo chỉ đọc). |
| D5 | Xuất ra máy in: Báo cáo xuất kho (K_BM5). |
| D6 | Hiển thị cho NV Kho: Bảng báo cáo K_BM5 (NVL, tổng SL xuất, tổng giá trị, BP nhận). |

**Thuật toán xử lý:**

> **Bước 1:** Nhận D1: NV Kho nhập khoảng thời gian (và bộ phận nhận nếu có).
>
> **Bước 2:** Kiểm tra: ngày bắt đầu ≤ ngày kết thúc.
>
> **Bước 3:** Đọc D3: truy vấn phiếu xuất trong khoảng [BĐ, KT] (lọc bộ phận nếu có).
>
> **Bước 4:** Tổng hợp theo NVL: tổng SL xuất, tổng giá trị xuất, bộ phận nhận.
>
> **Bước 5:** Tính tổng giá trị xuất kỳ = ∑ (tổng giá trị từng NVL).
>
> **Bước 6:** Hiển thị D6: báo cáo theo K_BM5.
>
> **Bước 7:** Xuất D5: in K_BM5 nếu yêu cầu.
>
> **Bước 8:** Kết thúc.

## 7.5. Sơ đồ luồng dữ liệu các yêu cầu Quản lý (Admin) {#sơ-đồ-luồng-dữ-liệu-các-yêu-cầu-quản-lý-admin}

### 7.5.1. Quản lý thực đơn (Loại: Lưu trữ) {#quản-lý-thực-đơn-loại-lưu-trữ}

**Sơ đồ luồng dữ liệu:**

|  | **Quản lý (Admin)** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Quản lý thực đơn**  | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin do Admin nhập: Tên món, loại món (Món ăn/Đồ uống), đơn giá, mô tả, trạng thái (Còn hàng/Hết hàng) (dựa vào QL_BM1). |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Danh sách thực đơn hiện tại (để hiển thị, tìm kiếm, kiểm tra trùng lặp). |
| D4 | Ghi vào CSDL: Thêm món mới / Cập nhật thông tin món / Xóa món (đánh dấu ngừng kinh doanh). |
| D5 | Không có. |
| D6 | Hiển thị cho Admin: Danh sách thực đơn, kết quả thao tác (thêm/sửa/xóa thành công hay thất bại). |

**Thuật toán xử lý:**

> **Bước 1:** Đọc D3: lấy danh sách thực đơn hiện tại từ CSDL.
>
> **Bước 2:** Hiển thị D6: bảng thực đơn theo QL_BM1, các nút chức năng (Thêm/Sửa/Xóa/Tìm kiếm).
>
> **Bước 3:** Nhận D1: Admin thao tác thêm/sửa/xóa món.
>
> **Bước 4:** Kiểm tra: tên món không trùng (khi thêm mới), đơn giá \> 0, loại món hợp lệ.
>
> **Bước 5:** Nếu không hợp lệ → thông báo lỗi D6 → quay lại Bước 3.
>
> **Bước 6:** Ghi D4: thực hiện thao tác tương ứng trên CSDL Thực đơn.
>
> **Bước 7:** Hiển thị D6: thông báo thành công, cập nhật lại danh sách.
>
> **Bước 8:** Kết thúc.

### 7.5.2. Quản lý bàn (Loại: Lưu trữ) {#quản-lý-bàn-loại-lưu-trữ}

**Sơ đồ luồng dữ liệu:**

|  | **Quản lý (Admin)** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Quản lý bàn** | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin do Admin nhập: Số bàn, khu vực, sức chứa, ghi chú; lệnh thêm/sửa/xóa (dựa vào QL_BM2). |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Danh sách bàn hiện tại + trạng thái (Trống/Có khách/Đã đặt). |
| D4 | Ghi vào CSDL: Thêm bàn / cập nhật / xóa (đánh dấu ngừng sử dụng). Không xóa cứng nếu bàn đang có khách hoặc đã đặt. |
| D5 | Không có. |
| D6 | Hiển thị cho Admin: Bảng danh sách bàn (QL_BM2); kết quả thao tác. |

**Thuật toán xử lý:**

> **Bước 1:** Đọc D3: lấy danh sách bàn từ CSDL.
>
> **Bước 2:** Hiển thị D6: bảng bàn theo QL_BM2.
>
> **Bước 3:** Nhận D1: Admin thao tác thêm/sửa/xóa.
>
> **Bước 4:** Kiểm tra: số bàn không trùng (khi thêm); sức chứa > 0; khi xóa → bàn phải ở trạng thái "Trống".
>
> **Bước 5:** Nếu vi phạm → thông báo lỗi D6 → quay lại Bước 3.
>
> **Bước 6:** Ghi D4: thực hiện thao tác trên CSDL Bàn.
>
> **Bước 7:** Hiển thị D6: thông báo thành công.
>
> **Bước 8:** Kết thúc.

### 7.5.3. Quản lý tài khoản (Loại: Lưu trữ) {#quản-lý-tài-khoản-loại-lưu-trữ}

**Sơ đồ luồng dữ liệu:**

|  | **Quản lý (Admin)** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Quản lý tài khoản** | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin do Admin nhập: Họ tên, tên đăng nhập, mật khẩu khởi tạo, vai trò; lệnh thêm/sửa/khóa/mở khóa/đặt lại mật khẩu (dựa vào QL_BM3). |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Danh sách tài khoản hiện có, danh mục vai trò, ma trận phân quyền. |
| D4 | Ghi vào CSDL: Thêm/sửa tài khoản (mật khẩu hash), khóa/mở khóa, đặt lại mật khẩu. Ghi log audit (ai làm gì, lúc nào). |
| D5 | Không có. |
| D6 | Hiển thị cho Admin: Danh sách tài khoản (QL_BM3); kết quả thao tác. |

**Thuật toán xử lý:**

> **Bước 1:** Đọc D3: lấy danh sách tài khoản và vai trò từ CSDL.
>
> **Bước 2:** Hiển thị D6: bảng QL_BM3 và các nút chức năng.
>
> **Bước 3:** Nhận D1: Admin thao tác.
>
> **Bước 4:** Kiểm tra quy định QL_QĐ1: tên đăng nhập không trùng; mật khẩu ≥ 8 ký tự + có chữ và số; vai trò hợp lệ; không cho phép Admin tự khóa chính mình.
>
> **Bước 5:** Nếu vi phạm → thông báo lỗi D6 → quay lại Bước 3.
>
> **Bước 6:** Băm mật khẩu (nếu có), ghi D4 vào CSDL Tài khoản.
>
> **Bước 7:** Ghi D4 (log audit): thao tác Admin vừa thực hiện.
>
> **Bước 8:** Hiển thị D6: thông báo thành công.
>
> **Bước 9:** Kết thúc.

### 7.5.4. Cấu hình hệ thống (Loại: Lưu trữ) {#cấu-hình-hệ-thống-loại-lưu-trữ}

**Sơ đồ luồng dữ liệu:**

|  | **Quản lý (Admin)** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Cấu hình hệ thống** | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin do Admin nhập: Giá trị mới cho các tham số: bật/tắt VAT, tỷ lệ VAT, thời gian tự hủy đặt bàn, giờ mở/đóng cửa, thời gian phiên, lịch sao lưu (dựa vào QL_BM5). |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Giá trị hiện tại của tất cả tham số cấu hình. |
| D4 | Ghi vào CSDL: Giá trị mới của các tham số. Ghi log audit (giá trị cũ → mới, ai, khi nào). |
| D5 | Không có. |
| D6 | Hiển thị cho Admin: Màn hình QL_BM5; kết quả lưu cấu hình. |

**Thuật toán xử lý:**

> **Bước 1:** Đọc D3: lấy cấu hình hiện tại.
>
> **Bước 2:** Hiển thị D6: QL_BM5 với giá trị hiện tại.
>
> **Bước 3:** Nhận D1: Admin nhập giá trị mới.
>
> **Bước 4:** Kiểm tra quy định QL_QĐ2: VAT ∈ [0, 0.2]; thời gian hủy ∈ [5, 60] phút; giờ mở < giờ đóng; thời gian phiên > 0.
>
> **Bước 5:** Nếu vi phạm → thông báo lỗi D6 → quay lại Bước 3.
>
> **Bước 6:** Ghi D4: lưu giá trị mới + log audit.
>
> **Bước 7:** Hiển thị D6: thông báo thành công; nhắc Admin nếu thay đổi có hiệu lực ngay hay phải đăng nhập lại.
>
> **Bước 8:** Kết thúc.

### 7.5.5. Xem báo cáo tổng hợp (Loại: Kết xuất) {#xem-báo-cáo-tổng-hợp-loại-kết-xuất}

**Sơ đồ luồng dữ liệu:**

|  | **Quản lý (Admin)** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Lập báo cáo tổng hợp** | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin do Admin nhập: Khoảng thời gian báo cáo, các mục cần xem (doanh thu / top món / cảnh báo tồn / nhập-xuất). |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Hóa đơn, chi tiết order, phiếu nhập, phiếu xuất, tồn kho hiện tại, định mức tối thiểu. |
| D4 | Không có (báo cáo chỉ đọc). |
| D5 | Xuất ra máy in: Báo cáo tổng hợp (QL_BM4). |
| D6 | Hiển thị cho Admin: Dashboard QL_BM4 với 3 phần (doanh thu, top món, cảnh báo tồn). |

**Thuật toán xử lý:**

> **Bước 1:** Nhận D1: Admin nhập kỳ báo cáo và chọn mục.
>
> **Bước 2:** Kiểm tra: ngày bắt đầu ≤ ngày kết thúc.
>
> **Bước 3:** Đọc D3 — phần A (Doanh thu): tổng hợp hóa đơn theo ngày + theo hình thức thanh toán.
>
> **Bước 4:** Đọc D3 — phần B (Top món): tổng hợp số lượng bán + doanh thu theo món, sắp giảm dần, lấy top N.
>
> **Bước 5:** Đọc D3 — phần C (Cảnh báo tồn): lọc NVL có tồn ≤ định mức tối thiểu.
>
> **Bước 6:** Hiển thị D6: QL_BM4 đầy đủ 3 phần.
>
> **Bước 7:** Xuất D5: in nếu Admin yêu cầu.
>
> **Bước 8:** Kết thúc.

## 7.6. Sơ đồ luồng dữ liệu các chức năng hệ thống {#sơ-đồ-luồng-dữ-liệu-các-chức-năng-hệ-thống}

### 7.6.1. Đăng nhập / Đăng xuất (Loại: Xử lý) {#đăng-nhập-đăng-xuất-loại-xử-lý}

**Sơ đồ luồng dữ liệu:**

|  | **Người dùng (mọi vai trò)** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Đăng nhập / Đăng xuất** | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin do Người dùng nhập: Tên đăng nhập + mật khẩu (đăng nhập); hoặc lệnh "Đăng xuất". |
| D2 | Không có. |
| D3 | Đọc từ CSDL: Tài khoản theo tên đăng nhập (trạng thái, hash mật khẩu, số lần sai liên tiếp, vai trò), thời gian phiên (từ CSDL Cấu hình). |
| D4 | Ghi vào CSDL: Tăng/đặt lại số lần sai; khóa tài khoản nếu sai ≥ 5; tạo phiên đăng nhập (token + thời điểm hết hạn); kết thúc phiên khi đăng xuất; ghi log audit. |
| D5 | Không có. |
| D6 | Hiển thị cho Người dùng: Màn hình đăng nhập SYS_BM1; kết quả đăng nhập (thành công → mở giao diện theo vai trò; thất bại → thông báo lỗi); kết quả đăng xuất. |

**Thuật toán xử lý:**

> **Bước 1:** Nhận D1: tên đăng nhập + mật khẩu (hoặc lệnh "Đăng xuất").
>
> **Bước 2 (Đăng nhập):** Đọc D3: tài khoản theo tên đăng nhập.
>
> **Bước 3:** Nếu không tồn tại HOẶC trạng thái "Đã khóa" → thông báo lỗi D6 → kết thúc.
>
> **Bước 4:** So khớp mật khẩu (hash). Nếu sai → ghi D4 (tăng số lần sai); nếu lần sai ≥ 5 → khóa tài khoản; thông báo lỗi D6 → kết thúc.
>
> **Bước 5:** Nếu đúng → ghi D4: reset số lần sai, tạo phiên (token, hạn = giờ hiện tại + thời gian phiên), log audit.
>
> **Bước 6:** Hiển thị D6: mở giao diện theo vai trò.
>
> **Bước 7 (Đăng xuất):** Ghi D4: kết thúc phiên + log audit. Hiển thị D6: về màn hình đăng nhập.
>
> **Bước 8:** Kết thúc.

### 7.6.2. Sao lưu / Phục hồi dữ liệu (Loại: Xử lý) {#sao-lưu-phục-hồi-dữ-liệu-loại-xử-lý}

**Sơ đồ luồng dữ liệu:**

|  | **Quản lý (Admin)** |  |
|:--:|:--:|:--:|
|  | ↓ D1 ↑ D6 |  |
| **Thiết bị nhập** → D2 → | **Xử lý Sao lưu / Phục hồi** | → D5 → **Thiết bị xuất** |
|  | ↑ D3 ↓ D4 |  |
|  | **══ Bộ nhớ phụ (CSDL) ══** |  |

**Mô tả các luồng dữ liệu:**

| **Ký hiệu** | **Mô tả chi tiết** |
|----|----|
| D1 | Thông tin do Admin nhập: Lệnh "Sao lưu ngay" hoặc "Phục hồi" + chọn bản sao lưu nguồn. |
| D2 | File bản sao lưu (.bak) nạp vào (khi phục hồi từ file ngoài). |
| D3 | Đọc từ CSDL: Toàn bộ dữ liệu nghiệp vụ (khi sao lưu); danh sách bản sao lưu hiện có; cấu hình lịch sao lưu. |
| D4 | Ghi vào CSDL: Ghi nhận thông tin bản sao lưu (tên, kích thước, thời điểm, người thực hiện); log audit. Khi phục hồi: thay thế toàn bộ CSDL hiện tại. |
| D5 | Xuất ra thiết bị lưu trữ: File bản sao lưu (.bak) ghi ra ổ đĩa / thư mục cấu hình. |
| D6 | Hiển thị cho Admin: Danh sách bản sao lưu; tiến độ; kết quả thành công/thất bại. |

**Thuật toán xử lý:**

> **Bước 1:** Đọc D3: lấy danh sách bản sao lưu hiện có và cấu hình.
>
> **Bước 2:** Hiển thị D6: danh sách + nút "Sao lưu ngay" / "Phục hồi".
>
> **Bước 3:** Nhận D1: Admin chọn thao tác.
>
> **Bước 4 (Sao lưu):** Đọc D3 toàn bộ CSDL → ghi D5 ra file .bak → ghi D4 thông tin bản sao lưu + log → xóa bản sao lưu cũ vượt số bản giữ lại.
>
> **Bước 5 (Phục hồi):** Yêu cầu Admin xác nhận 2 lần (vì phá hủy dữ liệu hiện tại). Nhận D2 (file .bak) hoặc chọn từ danh sách.
>
> **Bước 6:** Khóa hệ thống (không cho người khác thao tác). Thay thế CSDL bằng dữ liệu từ bản sao lưu.
>
> **Bước 7:** Ghi D4: log audit (đã phục hồi từ bản nào, lúc nào, ai).
>
> **Bước 8:** Mở khóa hệ thống. Hiển thị D6: kết quả.
>
> **Bước 9:** Kết thúc.

*Ghi chú:* Sao lưu tự động theo lịch trong QL_QĐ2 do scheduler thực hiện ngầm, không cần tương tác Admin; thuật toán giống Bước 4 nhưng được kích hoạt bằng cron.
