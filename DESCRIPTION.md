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
| 2 | Ghi nhận gọi món | Lưu trữ | Món phải có trong thực đơn, trạng thái \"Còn hàng\". SL \> 0. | PV_BM2 |  |
| 3 | Bàn giao cho bếp | Xử lý | Tự động phân loại: Món ăn → Bếp, Đồ uống → Quầy pha chế. | PV_BM3 |  |
| 4 | Phục vụ món ra bàn | Xử lý | Nhận thông báo khi món đã xong. Xác nhận đã phục vụ. |  |  |

## Bộ phận Bếp

| **STT** | **Công việc** | **Loại công việc** | **Quy định / Công thức liên quan** | **Biểu mẫu liên quan** | **Ghi chú** |
|----|----|----|----|----|----|
| 1 | Nhận phiếu order | Xử lý | Nhận phiếu theo thứ tự thời gian. Xác nhận đã nhận. Kiểm tra nguyên liệu. | B_BM1 |  |
| 2 | Cập nhật trạng thái món | Cập nhật | Chờ chế biến → Đang chế biến → Đã xong. Thông báo tự động cho Phục vụ. |  |  |

## Bộ phận Kho

| **STT** | **Công việc** | **Loại công việc** | **Quy định / Công thức liên quan** | **Biểu mẫu liên quan** | **Ghi chú** |
|----|----|----|----|----|----|
| 1 | Lập phiếu nhập kho | Lưu trữ | Ghi nhận: NVL, SL, đơn giá, nhà cung cấp, ngày nhập. | K_BM1 |  |
| 2 | Lập phiếu xuất kho | Lưu trữ | Ghi nhận: NVL, SL, đơn giá, bộ phận nhận, ngày xuất. | K_BM2 |  |
| 3 | Tính hóa đơn nhập kho | Tính toán | Tổng giá trị nhập = ∑ (SL nhập × Đơn giá). | K_BM1 |  |
| 4 | Tính hóa đơn xuất kho | Tính toán | Tổng giá trị xuất = ∑ (SL xuất × Đơn giá). | K_BM2 |  |
| 5 | Báo cáo tồn kho | Kết xuất | Tồn cuối = Tồn đầu + Nhập − Xuất. | K_BM3 |  |
| 6 | Báo cáo nhập kho | Kết xuất | Thống kê tổng NVL đã nhập trong khoảng thời gian. | K_BM4 |  |
| 7 | Báo cáo xuất kho | Kết xuất | Thống kê tổng NVL đã xuất trong khoảng thời gian. | K_BM5 |  |

## Quản lý (Admin)

| **STT** | **Công việc** | **Loại công việc** | **Quy định / Công thức liên quan** | **Biểu mẫu liên quan** | **Ghi chú** |
|----|----|----|----|----|----|
| 1 | Quản lý thực đơn | Lưu trữ | Thêm/sửa/xóa món. Cập nhật trạng thái, đơn giá. | QL_BM1 |  |
| 2 | Quản lý bàn | Lưu trữ | Thêm/sửa/xóa bàn. Thiết lập sức chứa, khu vực. | QL_BM2 |  |
| 3 | Quản lý tài khoản | Lưu trữ | Tạo/sửa/khóa tài khoản. Phân quyền theo vai trò. |  |  |
| 4 | Xem báo cáo tổng hợp | Kết xuất | Xem tất cả báo cáo: doanh thu, tồn kho, nhập/xuất. |  |  |

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
<td><p>- Admin: tất cả chức năng (quản lý tài khoản, thực đơn, bàn, báo cáo).</p>
<p>- Phục vụ: đặt bàn, gọi món, bàn giao bếp, phục vụ món.</p>
<p>- Bếp: nhận phiếu order, cập nhật trạng thái món.</p>
<p>- Thu ngân: thanh toán, xuất hóa đơn, báo cáo doanh thu.</p>
<p>- Kho: phiếu nhập/xuất kho, báo cáo kho.</p></td>
</tr>
<tr>
<td>2</td>
<td>Sao lưu và phục hồi</td>
<td><p>- Sao lưu dữ liệu định kỳ.</p>
<p>- Phục hồi khi có sự cố.</p>
<p>- Chỉ Admin có quyền thực hiện.</p></td>
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
