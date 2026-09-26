<template>
  <AdminShell>
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p class="text-xs uppercase tracking-[0.18em] text-primary">
            Quản lý đơn hàng
          </p>
          <h2 class="mt-1 text-xl font-bold">Quản lý đơn hàng</h2>
          <p class="mt-1 text-sm text-slate-500 ">
            Lợi nhuận được tính theo trạng thái thanh toán: đã thanh toán cộng,
            hoàn tiền trừ.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button
            class="inline-flex items-center gap-1.5  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-1.5 text-sm font-medium hover:border-primary hover:text-primary "
            type="button"
            @click="loadOrders"
          >
            <span class="material-symbols-outlined text-[18px]">refresh</span>
            Làm mới
          </button>
        </div>
      </div>
    </template>

    <div class="space-y-3">
      <section class="retail-card p-3">
        <div class="grid gap-3 md:grid-cols-[1fr_240px]">
          <label
            class="flex items-center gap-2  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-1.5 "
          >
            <span class="material-symbols-outlined text-[18px] text-slate-400">search</span>
            <input
              v-model="search"
              class="w-full bg-transparent text-sm outline-none"
              placeholder="Tìm theo ID, tên khách hàng, số điện thoại"
              type="text"
            >
          </label>

          <label
            class="flex items-center gap-2  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-1.5"
          >
            <span class="material-symbols-outlined text-[18px] text-slate-400">filter_list</span>
            <select
              v-model="statusFilter"
              class="w-full cursor-pointer bg-white text-slate-700 dark:bg-transparent dark:text-[#eadfd3] outline-none"
            >
              <option class="bg-white text-slate-700 dark:bg-[#1f1a17] dark:text-[#eadfd3]" value="ALL">Tất cả trạng thái</option>
              <option
                v-for="status in statusOptions"
                :key="status.value"
                class="bg-white text-slate-700 dark:bg-[#1f1a17] dark:text-[#eadfd3]"
                :value="status.value"
              >
                {{ status.label }}
              </option>
            </select>
          </label>
        </div>

        <div class="hidden">
          <button
            class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
            :class="statusFilter === 'ALL' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:hover:bg-[#3c342e]'"
            @click="statusFilter = 'ALL'"
          >
            Tất cả
          </button>
          <button
            v-for="status in statusOptions"
            :key="status.value"
            class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
            :class="statusFilter === status.value ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:hover:bg-[#3c342e]'"
            @click="statusFilter = status.value"
          >
            {{ status.label }}
          </button>
        </div>
      </section>

      <section class="retail-card p-3">
        <div class="mb-3 grid grid-cols-1 gap-2 text-xs md:grid-cols-4">
          <div
            class="rounded-xl border border-slate-200 px-3 py-2 "
          >
            Tổng đơn: <span class="font-semibold">{{ orders.length }}</span>
          </div>
          <div
            class="rounded-xl border border-slate-200 px-3 py-2 "
          >
            Đơn ghi nhận doanh thu:
            <span class="font-semibold">{{ profitableOrdersCount }}</span>
          </div>
          <div
            class="rounded-xl border border-slate-200 px-3 py-2 "
          >
            Đơn hoàn tiền:
            <span class="font-semibold">{{ deductedOrdersCount }}</span>
          </div>
          <div
            class="rounded-xl border border-slate-200 px-3 py-2 "
          >
            Lợi nhuận ròng:
            <span class="font-semibold">{{ formatCurrency(netRevenue) }}</span>
          </div>
        </div>

        <!-- Order Progress Tracker -->
        <div v-if="activeTrackedOrder" class="mb-4  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 p-4 ">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="font-bold text-slate-800 flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">local_shipping</span>
              Theo dõi tiến độ đơn hàng <span class="text-primary">#{{ activeTrackedOrder.id }}</span>
            </h3>
            <div class="flex items-center gap-4">
              <button
                v-if="canProcessReturn(activeTrackedOrder)"
                class="rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-blue-600 shadow-sm"
                @click="openReturnModal(activeTrackedOrder)"
              >
                Trả hàng
              </button>
              <button
                v-if="canRefund(activeTrackedOrder)"
                class="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-red-600 shadow-sm"
                @click="openRefundModal(activeTrackedOrder)"
              >
                Hoàn tiền
              </button>
              <span class="text-xs text-slate-500 ">Khách hàng: {{ activeTrackedOrder.fullName || activeTrackedOrder.fullname || 'Khách hàng' }}</span>
            </div>
          </div>

          <div class="relative flex items-center justify-between w-full mt-6 px-4">
            <div class="absolute left-4 right-4 top-1/2 h-1 -translate-y-1/2 bg-slate-100 rounded-full" />
            <div
              class="absolute left-4 top-1/2 h-1 -translate-y-1/2 rounded-full transition-all duration-500"
              :class="trackingSteps.some(s => s.isError) ? 'bg-red-500' : (trackingSteps.some(s => s.isWarning) ? 'bg-amber-500' : 'bg-primary')"
              :style="{ width: `calc(${(Math.max(0, trackingSteps.map(s => s.isActive).lastIndexOf(true)) / (trackingSteps.length - 1 || 1) * 100)}% - 32px)` }"
            />

            <div v-for="(step, idx) in trackingSteps" :key="idx" class="relative flex flex-col items-center gap-2" :class="step.isActive ? (step.isError ? 'text-red-500' : step.isWarning ? 'text-amber-500' : 'text-primary') : 'text-slate-400 '">
              <div
                class="flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white transition-colors"
                :class="step.isActive ? (step.isError ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : step.isWarning ? 'border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]' : 'border-primary shadow-[0_0_10px_rgba(198,98,49,0.3)]') : 'border-slate-200 '"
              >
                <span class="material-symbols-outlined text-[16px]">{{ step.icon }}</span>
              </div>
              <span class="text-xs font-semibold whitespace-nowrap">{{ step.label }}</span>
            </div>
          </div>
        </div>

        <div
          v-if="error"
          class="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700   "
        >
          {{ error }}
        </div>

        <div
          v-if="hiddenOrders.length > 0"
          class="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-slate-700  "
        >
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="font-semibold">Đơn hàng ẩn tạm</p>
              <p class="text-xs text-slate-500 ">
                Những đơn hàng đã xóa mềm sẽ tạm ẩn khỏi danh sách được dùng.
                Bạn có thể khôi phục lại khi cần.
              </p>
            </div>
            <button
              class="rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-white hover:opacity-90"
              type="button"
              @click="restoreAllHiddenOrders"
            >
              Khôi phục tất cả
            </button>
          </div>
          <div class="mt-3 space-y-2">
            <div
              v-for="order in hiddenOrders"
              :key="order.id"
              class="flex flex-wrap items-center justify-between gap-2  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 "
            >
              <div class="text-sm">
                <span class="font-semibold">#{{ order.id }}</span>
                <span class="ml-2">{{ order.fullName || "Khách hàng" }}</span>
              </div>
              <button
                class="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-emerald-600"
                type="button"
                @click="restoreOrder(order)"
              >
                Khôi phục
              </button>
            </div>
          </div>
        </div>

        <div
          v-if="pendingReturnRequests.length > 0"
          class="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm text-slate-700  "
        >
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="font-bold text-red-600 flex items-center gap-1.5"><span class="material-symbols-outlined text-[18px]">campaign</span> Có {{ pendingReturnRequests.length }} yêu cầu hoàn hàng chờ xử lý</p>
              <p class="text-xs text-slate-500 mt-0.5">
                Khách hàng đã gửi yêu cầu hoàn tiền/trả hàng. Vui lòng kiểm tra và xử lý.
              </p>
            </div>
          </div>
          <div class="mt-3 space-y-2">
            <div
              v-for="order in pendingReturnRequests"
              :key="order.id"
              class="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 px-3 py-2 cursor-pointer border border-red-100"
              @click="selectOrderToTrack(order)"
            >
              <div class="text-sm">
                <span class="font-bold text-red-600">#{{ order.id }}</span>
                <span class="ml-2 font-semibold text-slate-800">{{ order.fullName || "Khách hàng" }}</span>
                <span class="ml-2 text-xs text-slate-500 hidden sm:inline">- {{ formatCurrency(order.finalAmount || order.totalMoney) }}</span>
              </div>
              <button
                class="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-600"
                type="button"
                @click.stop="selectOrderToTrack(order); openReviewModal(order)"
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>

        <div
          v-if="loading"
          class="py-8 text-center text-sm text-slate-500 "
        >
          Đang tải danh sách đơn hàng...
        </div>

        <div
          v-else-if="filteredOrders.length === 0"
          class="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 "
        >
          Không tìm thấy đơn hàng phù hợp.
        </div>

        <div v-else class="admin-orders-table-scroll max-h-[58vh] overflow-auto">
          <table class="admin-orders-table w-full min-w-[1328px] table-fixed text-left text-xs">
            <colgroup>
              <col class="w-[64px]">
              <col class="w-[140px]">
              <col class="w-[190px]">
              <col class="w-[145px]">
              <col class="w-[220px]">
              <col class="w-[120px]">
              <col class="w-[140px]">
              <col class="w-[132px]">
              <col class="w-[145px]">
              <col class="w-[112px]">
            </colgroup>
            <thead>
              <tr
                class="border-b border-slate-200 text-slate-500 "
              >
                <th class="sticky left-0 z-20 bg-white px-2 py-2 font-medium shadow-[1px_0_0_rgba(60,52,46,0.9)]">ID</th>
                <th class="px-2 py-2 font-medium">Khách hàng</th>
                <th class="px-2 py-2 font-medium">Sản phẩm</th>
                <th class="px-2 py-2 font-medium">Liên hệ</th>
                <th class="px-2 py-2 font-medium">
                  Địa chỉ giao hàng
                </th>
                <th class="px-2 py-2 font-medium">Tổng tiền</th>
                <th class="px-2 py-2 font-medium">Thanh toán</th>
                <th class="px-2 py-2 font-medium whitespace-nowrap">Trạng thái</th>
                <th class="px-2 py-2 font-medium">Ngày tạo</th>
                <th class="sticky right-0 z-20 bg-white px-2 py-2 text-right font-medium shadow-[-1px_0_0_rgba(60,52,46,0.9)]">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="order in paginatedOrders"
                :key="order.id"
                class="border-b border-slate-100 last:border-none dark:border-[#2b241f] cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/5"
                :class="{ 'bg-primary/5 dark:bg-primary/10 border-l-2 border-l-primary': activeTrackedOrder?.id === order.id }"
                @click="selectOrderToTrack(order)"
              >
                <td class="sticky left-0 z-10 bg-white px-2 py-1.5 font-semibold shadow-[1px_0_0_rgba(60,52,46,0.75)]">#{{ order.id || "-" }}</td>
                <td class="px-2 py-1.5">
                  <p class="truncate" :title="order.fullName || 'Khách hàng'">
                    {{ order.fullName || "Khách hàng" }}
                  </p>
                </td>
                <td class="px-2 py-1.5 text-slate-600 ">
                  <p
                    v-for="(itemText, idx) in getOrderItemsPreview(order)"
                    :key="`${order.id || 'order'}-item-${idx}`"
                    class="truncate"
                  >
                    {{ itemText }}
                  </p>
                </td>
                <td class="px-2 py-1.5 text-slate-500 ">
                  <p class="truncate" :title="order.phone || '-'">{{ order.phone || "-" }}</p>
                  <p class="truncate" :title="order.email || '-'">{{ order.email || "-" }}</p>
                </td>
                <td
                  class="px-2 py-1.5 text-xs text-slate-600 "
                >
                  <p
                    class="line-clamp-2"
                    :title="
                      order.shippingAddress ||
                        order.shipping_address ||
                        order.address
                    "
                  >
                    {{
                      order.shippingAddress ||
                        order.shipping_address ||
                        order.address ||
                        "Mua tại quầy"
                    }}
                  </p>
                </td>
                <td class="px-2 py-1.5 font-bold text-primary">
                  {{ formatCurrency(order.finalAmount || order.totalMoney) }}
                </td>
                <td class="px-2 py-1.5">
                  <div class="truncate font-medium text-slate-700 " :title="getPaymentMethodLabel(order)">{{ getPaymentMethodLabel(order) }}</div>
                  <div class="mt-0.5 text-[11px] text-slate-500">{{ getPaymentStatusLabel(order.paymentStatus) }}</div>
                </td>
                <td class="px-2 py-1.5 whitespace-nowrap">
                  <span
                    class="inline-flex whitespace-nowrap rounded-full px-2 py-1 text-xs font-semibold"
                    :class="statusClass(order.status)"
                  >
                    {{ getOrderStatusLabel(order.status) }}
                  </span>
                </td>
                <td class="px-2 py-1.5 text-slate-500 whitespace-nowrap">
                  {{ formatDate(order.createdAt) }}
                </td>
                <td class="sticky right-0 z-10 bg-white px-2 py-1.5 text-right shadow-[-1px_0_0_rgba(60,52,46,0.75)]">
                  <div class="flex items-center justify-end gap-1">
                    <button
                      class="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-white"
                      title="Chỉnh sửa"
                      @click="openEdit(order)"
                    >
                      <span
                        class="material-symbols-outlined text-[18px] text-slate-500"
                      >edit</span>
                    </button>

                    <!-- Xác nhận đơn (PENDING -> PROCESSING) -->
                    <button
                      v-if="order.status === 'PENDING'"
                      class="rounded-lg p-1.5 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                      title="Xác nhận đơn (Chuyển sang Đang xử lý)"
                      @click="quickUpdateStatus(order, 'PROCESSING')"
                    >
                      <span
                        class="material-symbols-outlined text-[18px] text-amber-500"
                      >inventory_2</span>
                    </button>

                    <!-- Giao hàng (PROCESSING -> SHIPPING) -->
                    <button
                      v-if="order.status === 'PROCESSING'"
                      class="rounded-lg p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      title="Giao hàng (Chuyển sang Đang giao)"
                      @click="quickUpdateStatus(order, 'SHIPPING')"
                    >
                      <span
                        class="material-symbols-outlined text-[18px] text-blue-500"
                      >local_shipping</span>
                    </button>

                    <!-- Hoàn thành (SHIPPING -> SUCCESS) -->
                    <button
                      v-if="order.status === 'SHIPPING'"
                      class="rounded-lg p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                      title="Đánh dấu hoàn thành (Thành công)"
                      @click="quickUpdateStatus(order, 'SUCCESS')"
                    >
                      <span
                        class="material-symbols-outlined text-[18px] text-emerald-600"
                      >check_circle</span>
                    </button>

                    <!-- Trả hàng (RETURN_REQUEST / RETURNING) -->
                    <button
                      v-if="canProcessReturn(order)"
                      class="rounded-lg p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      title="Xử lý trả hàng"
                      @click="openReturnModal(order)"
                    >
                      <span
                        class="material-symbols-outlined text-[18px] text-blue-500"
                      >assignment_return</span>
                    </button>

                    <!-- Hoàn tiền -->
                    <button
                      v-if="canRefund(order)"
                      class="rounded-lg p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Hoàn tiền"
                      @click="openRefundModal(order)"
                    >
                      <span
                        class="material-symbols-outlined text-[18px] text-red-500"
                      >payments</span>
                    </button>

                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="filteredOrders.length > 0" class="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div class="text-slate-500">
            Hiển thị <span class="font-semibold text-slate-700">{{ pageStart }}</span>-
            <span class="font-semibold text-slate-700">{{ pageEnd }}</span>
            / <span class="font-semibold text-slate-700">{{ filteredOrders.length }}</span> đơn
          </div>

          <div class="flex items-center gap-2">
            <label class="text-slate-500">Mỗi trang</label>
            <select v-model.number="pageSize" class="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs">
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="30">30</option>
              <option :value="50">50</option>
            </select>

            <button
              class="rounded-lg border border-slate-200 px-2 py-1 text-xs disabled:opacity-50"
              :disabled="currentPage <= 1"
              type="button"
              @click="currentPage = Math.max(1, currentPage - 1)"
            >
              Trước
            </button>

            <span class="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
              {{ currentPage }} / {{ totalPages }}
            </span>

            <button
              class="rounded-lg border border-slate-200 px-2 py-1 text-xs disabled:opacity-50"
              :disabled="currentPage >= totalPages"
              type="button"
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
            >
              Sau
            </button>
          </div>
        </div>
      </section>
    </div>

    <Teleport to="body">
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="closeModal"
      >
        <div
          class="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl "
        >
          <h3 class="mb-4 text-base font-bold">
            {{
              editingOrderId
                ? (form.status === 'SUCCESS' ? `Xem chi tiết đơn hàng #${editingOrderId}` : `Sửa đơn hàng #${editingOrderId}`)
                : "Tạo đơn hàng mới"
            }}
          </h3>

          <div v-if="isOrderLocked" class="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
            Đơn hàng đang giao hoặc đã thành công — đã khóa sửa thông tin khách hàng và số tiền.
          </div>

          <div class="grid gap-3 md:grid-cols-2">
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-500">
                ID tài khoản
                <span
                  v-if="accountLookupLoading"
                  class="ml-1 text-primary"
                >(Đang tải...)</span>
              </label>
              <input
                v-model.number="form.accountId"
                class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-1.5 text-sm "
                :disabled="isOrderLocked"
                min="1"
                type="number"
              >
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-500">Tên khách hàng *</label>
              <input
                v-model.trim="form.fullName"
                class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm "
                :disabled="isOrderLocked"
                type="text"
              >
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-500">Số điện thoại</label>
              <input
                v-model.trim="form.phone"
                class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm "
                :disabled="isOrderLocked"
                type="text"
              >
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-500">Email</label>
              <input
                v-model.trim="form.email"
                class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm "
                :disabled="isOrderLocked"
                type="email"
              >
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-500">Tổng tiền *</label>
              <input
                v-model.number="form.totalMoney"
                class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm "
                :disabled="isOrderLocked"
                min="0"
                type="number"
              >
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-500">Thành tiền *</label>
              <input
                v-model.number="form.finalAmount"
                class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm "
                :disabled="isOrderLocked"
                min="0"
                type="number"
              >
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-500">Phí giao hàng</label>
              <input
                class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 "
                readonly
                title="Phí ship (chỉ hiển thị)"
                :value="formatCurrency(form.shippingFee || 0)"
              >
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-500">Giảm giá (voucher)</label>
              <input
                class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-red-500 "
                readonly
                title="Số tiền giảm từ mã giảm giá (chỉ hiển thị)"
                :value="`-${formatCurrency(form.discountAmount || 0)}`"
              >
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-500">Trạng thái</label>
              <select
                v-model="form.status"
                class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm "
              >
                <option
                  v-for="status in statusOptions"
                  :key="status.value"
                  :disabled="isStatusOptionDisabled(status.value)"
                  :value="status.value"
                >
                  {{ status.label }}
                </option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-500">Thanh toán</label>
              <select
                v-model="form.paymentStatus"
                class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm "
              >
                <option
                  v-for="status in paymentStatusOptions"
                  :key="status.value"
                  :disabled="isPaymentStatusOptionDisabled(status.value)"
                  :value="status.value"
                >
                  {{ status.label }}
                </option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-500">Phương thức thanh toán</label>
              <input
                class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 "
                readonly
                title="Phương thức thanh toán (chỉ hiển thị)"
                :value="getPaymentMethodLabel(form)"
              >
            </div>

            <div v-if="form.returnReason" class="md:col-span-2">
              <label class="mb-1 block text-xs font-medium text-red-500">Lý do yêu cầu trả hàng</label>
              <div
                class="w-full rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700  whitespace-pre-wrap"
              >
                {{ displayReturnReason(form.returnReason) }}
              </div>
            </div>

            <div v-if="form.returnImages && form.returnImages.length > 0" class="md:col-span-2">
              <label class="mb-1 block text-xs font-medium text-slate-500 ">Ảnh minh chứng hoàn hàng</label>
              <div class="flex flex-wrap gap-2">
                <div
                  v-for="(img, idx) in form.returnImages"
                  :key="idx"
                  class="group relative size-20 cursor-pointer overflow-hidden rounded-lg border border-slate-200 "
                  @click="window.open(img, '_blank')"
                >
                  <img class="h-full w-full object-cover transition-transform group-hover:scale-110" :src="img">
                </div>
              </div>
            </div>

            <div
              class="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs "
            >
              <p class="mb-2 font-semibold text-slate-700 ">
                Sản phẩm trong đơn
              </p>

              <div
                v-if="selectedOrderItems.length === 0"
                class="text-slate-500 "
              >
                Chưa có dữ liệu sản phẩm cho đơn hàng này.
              </div>

              <div v-else class="space-y-3 text-slate-600 ">
                <div
                  v-for="(item, idx) in selectedOrderItems"
                  :key="`modal-item-${idx}`"
                  class="flex items-center gap-3"
                >
                  <img v-if="item.image" class="w-10 h-10 object-cover rounded border border-slate-200" :src="item.image">
                  <div v-else class="w-10 h-10 bg-slate-100 rounded border border-slate-200 flex items-center justify-center">
                    <span class="material-symbols-outlined text-slate-400 text-sm">image</span>
                  </div>
                  <div class="flex-1 truncate">
                    <p class="truncate text-sm font-medium" :title="item.text">{{ item.text }}</p>
                    <p class="text-xs text-slate-500">
                      {{ item.priceText }}
                      <span v-if="item.code" class="ml-1 border-l pl-1 border-slate-300">Mã SP: {{ item.code }}</span>
                    </p>
                  </div>
                </div>

                <div v-if="editingOrderId" class="mt-4 border-t border-slate-100 pt-3 text-right text-sm">
                  <p class="text-slate-500 mb-1">Phí ship: {{ formatCurrency(form.shippingFee || 0) }}</p>
                  <p class="text-slate-500 mb-1">Giảm giá: -{{ formatCurrency(form.discountAmount || 0) }}</p>
                  <p class="font-bold text-primary mt-1 text-base">Tổng cộng: {{ formatCurrency(form.finalAmount || 0) }}</p>
                </div>
              </div>
            </div>

            <div class="md:col-span-2">
              <label class="mb-1 block text-xs font-medium text-slate-500">Địa chỉ giao hàng</label>
              <textarea
                v-model.trim="form.address"
                class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm "
                :disabled="isOrderLocked"
                rows="2"
              />
            </div>
          </div>

          <p v-if="modalError" class="mt-3 text-xs text-red-500">
            {{ modalError }}
          </p>

          <div class="mt-4 flex justify-end gap-2">
            <button
              class="rounded-xl border border-slate-300 bg-white px-5 py-2 font-semibold text-slate-700 hover:bg-slate-50"
              type="button"
              @click="showModal = false"
            >
              {{ form.status === 'SUCCESS' ? 'Đóng' : 'Hủy' }}
            </button>
            <button
              v-if="form.status !== 'SUCCESS'"
              class="rounded-xl bg-primary px-5 py-2 font-semibold text-white hover:opacity-90 disabled:opacity-50"
              :disabled="saving"
              type="button"
              @click="saveOrder"
            >
              {{
                saving ? "Đang lưu..." : editingOrderId ? "Cập nhật" : "Tạo mới"
              }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Toast Notification -->
    <Teleport to="body">
      <div v-if="newOrderToast" class="fixed bottom-4 right-4 z-50 animate-slide-in-up">
        <div class="flex items-center gap-3 rounded-xl border border-primary/20 bg-white p-4 shadow-xl  ">
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <span class="material-symbols-outlined">notifications_active</span>
          </div>
          <div>
            <h4 class="font-bold text-slate-800 ">{{ newOrderToast.title }}</h4>
            <p class="text-sm text-slate-500 ">{{ newOrderToast.message }}</p>
          </div>
          <button class="ml-4 text-slate-400 hover:text-slate-600" @click="newOrderToast = null">
            <span class="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      </div>
    </Teleport>

    <!-- Modal Duyệt Yêu Cầu Hoàn -->
    <Teleport to="body">
      <div
        v-if="showReviewModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="closeReviewModal"
      >
        <div class="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl">
          <div class="mb-4 flex items-center gap-2">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-500">
              <span class="material-symbols-outlined">plagiarism</span>
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900">Chi tiết yêu cầu hoàn/trả hàng</h3>
              <p class="text-xs text-slate-500">Đơn hàng #{{ reviewForm.orderId }}</p>
            </div>
          </div>

          <div class="space-y-4">
            <div v-if="reviewForm.customerReason">
              <label class="mb-1 block text-xs font-medium text-slate-500">Lý do khách hàng yêu cầu</label>
              <div class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 whitespace-pre-wrap">
                {{ reviewForm.customerReason }}
              </div>
            </div>

            <div v-if="reviewForm.customerImages && reviewForm.customerImages.length > 0">
              <label class="mb-1 block text-xs font-medium text-slate-500">Ảnh minh chứng</label>
              <div class="flex flex-wrap gap-2">
                <div v-for="(img, idx) in reviewForm.customerImages" :key="idx" class="group relative size-20 cursor-pointer overflow-hidden rounded-lg border border-slate-200" @click="window.open(img, '_blank')">
                  <img class="h-full w-full object-cover transition-transform group-hover:scale-110" :src="img">
                </div>
              </div>
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-500">Lý do từ chối (bắt buộc nếu từ chối)</label>
              <textarea v-model="reviewForm.rejectReason" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary" placeholder="Nhập lý do từ chối..." rows="3" />
            </div>
          </div>

          <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <button class="rounded-xl px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 transition" @click="closeReviewModal">Đóng</button>
            <button class="flex items-center justify-center gap-2 rounded-xl bg-slate-200 px-6 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-300 transition disabled:opacity-50" :disabled="reviewing" @click="rejectReturnRequest">
              Từ chối
            </button>
            <button class="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-2 text-sm font-bold text-white shadow-lg hover:bg-emerald-600 transition disabled:opacity-50" :disabled="reviewing" @click="approveReturnRequest">
              <span v-if="reviewing" class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
              Duyệt
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal Trả Hàng -->
    <Teleport to="body">
      <div
        v-if="showReturnModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="closeReturnModal"
      >
        <div class="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl">
          <div class="mb-4 flex items-center gap-2">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-500">
              <span class="material-symbols-outlined">assignment_return</span>
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900">Trả hàng</h3>
              <p class="text-xs text-slate-500">Đơn hàng #{{ returnForm.orderId }}</p>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-500">Chọn sản phẩm & số lượng trả</label>
              <div class="overflow-hidden rounded-xl border border-slate-200">
                <div v-for="row in returnForm.items" :key="row.orderItemId" class="flex items-center gap-3 border-b border-slate-100 px-3 py-2 last:border-b-0">
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-medium text-slate-800">{{ row.label }}</p>
                    <p class="text-xs text-slate-500">{{ formatCurrency(row.price) }}/sp · có thể trả: {{ row.maxReturnable }}</p>
                  </div>
                  <div class="flex w-28 items-center gap-1">
                    <button class="rounded-lg border border-slate-200 px-2 py-1 text-slate-600 hover:bg-slate-100 transition" :disabled="row.qty <= 0" type="button" @click="row.qty = Math.max(0, row.qty - 1)">−</button>
                    <input
                      v-model.number="row.qty"
                      class="w-12 rounded-lg border border-slate-200 px-1 py-1 text-center text-sm font-bold outline-none"
                      :max="row.maxReturnable"
                      min="0"
                      type="number"
                    >
                    <button class="rounded-lg border border-slate-200 px-2 py-1 text-slate-600 hover:bg-slate-100 transition" :disabled="row.qty >= row.maxReturnable" type="button" @click="row.qty = Math.min(row.maxReturnable, row.qty + 1)">+</button>
                  </div>
                  <div class="w-24 text-right">
                    <p class="text-sm font-bold text-blue-600">{{ formatCurrency(returnPreview.byId[row.orderItemId]?.refund ?? 0) }}</p>
                    <button class="text-[11px] font-semibold text-blue-500 hover:underline" type="button" @click="row.qty = row.maxReturnable">Tất cả</button>
                  </div>
                </div>
                <div v-if="returnForm.items.length === 0" class="px-3 py-4 text-center text-sm text-slate-500">
                  Không còn sản phẩm nào để trả
                </div>
              </div>
            </div>

            <div class="rounded-xl border border-blue-100 bg-blue-50 p-3">
              <p class="text-xs text-blue-700">
                Tiền hoàn mỗi món tính theo <b>giá gốc</b> × số lượng trả (không chia theo mã giảm giá).
              </p>
              <p class="mt-1 text-sm font-bold text-blue-800">
                Tổng tiền hoàn dự kiến: {{ formatCurrency(returnPreview.totalRefund) }}
              </p>
            </div>

            <div class="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
              <input id="restoreStockCheckbox" v-model="returnForm.restoreStock" class="mt-0.5 rounded border-amber-300 text-amber-600 focus:ring-amber-500" type="checkbox">
              <label class="text-sm font-medium text-amber-800" for="restoreStockCheckbox">
                Cộng lại số lượng vào kho
                <span class="block mt-1 text-xs text-amber-700 font-normal">Chỉ nên chọn nếu khách trả lại hàng nguyên vẹn. Không tick nếu hàng bị lỗi hỏng không bán được.</span>
              </label>
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-500">Lý do trả hàng <span class="text-red-500">*</span></label>
              <textarea v-model="returnForm.reason" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary" placeholder="Nhập lý do chi tiết..." rows="3" />
            </div>
          </div>

          <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <button class="rounded-xl px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 transition" @click="closeReturnModal">Đóng</button>
            <button class="flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-6 py-2 text-sm font-bold text-white shadow-lg hover:bg-blue-600 transition disabled:opacity-50" :disabled="returning || returnPreview.totalRefund <= 0" @click="submitReturn">
              <span v-if="returning" class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
              Xác nhận Trả Hàng
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal Hoàn Tiền -->
    <Teleport to="body">
      <div
        v-if="showRefundModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="closeRefundModal"
      >
        <div class="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
          <div class="mb-4 flex items-center gap-2">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-500">
              <span class="material-symbols-outlined">payments</span>
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900">Hoàn tiền</h3>
              <p class="text-xs text-slate-500">Đơn hàng #{{ refundForm.orderId }}</p>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-500">Số tiền hoàn (VND)</label>
              <input v-model.number="refundForm.amount" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-red-500 outline-none" min="0" type="number">
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-500">Phương thức hoàn</label>
              <select v-model="refundForm.method" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none">
                <option value="VNPay">VNPay</option>
                <option value="COD">COD</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-500">Ghi chú hoàn tiền</label>
              <textarea v-model="refundForm.note" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary" placeholder="Nhập ghi chú..." rows="3" />
            </div>

            <div v-if="refundForm.customerReason || (refundForm.customerImages && refundForm.customerImages.length > 0)" class="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p class="mb-2 text-xs font-bold uppercase text-slate-500">Phản hồi khách hàng</p>
              <div v-if="refundForm.customerReason" class="mb-2 text-sm text-slate-800 italic">
                "{{ refundForm.customerReason }}"
              </div>
              <div v-if="refundForm.customerImages && refundForm.customerImages.length > 0" class="flex flex-wrap gap-2">
                <div v-for="(img, idx) in refundForm.customerImages" :key="idx" class="group relative size-16 cursor-pointer overflow-hidden rounded-lg border border-slate-200" @click="window.open(img, '_blank')">
                  <img class="h-full w-full object-cover transition-transform group-hover:scale-110" :src="img">
                </div>
              </div>
            </div>

          </div>

          <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <button class="rounded-xl px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 transition" @click="closeRefundModal">Đóng</button>
            <button class="flex items-center justify-center gap-2 rounded-xl bg-red-500 px-6 py-2 text-sm font-bold text-white shadow-lg hover:bg-red-600 transition disabled:opacity-50" :disabled="refunding || !refundForm.amount || refundForm.amount <= 0" @click="submitRefund">
              <span v-if="refunding" class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
              Xác nhận Hoàn Tiền
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </AdminShell>
</template>

<script setup>
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

  import AdminShell from '@/components/admin/AdminShell.vue'
  import { accountsApi, adminApi, ordersApi } from '@/services/api'
  import { buildVariantCode } from '@/utils/variantValues'

  const loading = ref(false)
  const error = ref('')
  const orders = ref([])
  const search = ref('')
  const statusFilter = ref('ALL')
  const currentPage = ref(1)
  const pageSize = ref(20)

  const showModal = ref(false)
  const showRefundModal = ref(false)
  const showReturnModal = ref(false)
  const refundForm = ref({
    orderId: null,
    amount: 0,
    method: 'VNPay',
    note: '',
    customerReason: '',
    customerImages: [],
  })
  const refunding = ref(false)
  const returnForm = ref({
    orderId: null,
    reason: '',
    restoreStock: true,
    items: [],
  })
  const returning = ref(false)

  const showReviewModal = ref(false)
  const reviewing = ref(false)
  const reviewForm = ref({
    orderId: null,
    customerReason: '',
    customerImages: [],
    rejectReason: '',
  })

  function displayReturnReason (raw) {
    if (!raw || typeof raw !== 'string') return raw || ''
    const record = parseReturnRecord(raw)
    if (!record) return raw
    const lines = []
    if (record.reason) lines.push(record.reason)
    if (Array.isArray(record.items) && record.items.length > 0) {
      const qtyTotal = record.items.reduce((sum, it) => sum + asNumber(it.quantity), 0)
      lines.push(`Trả ${record.items.length} món (${qtyTotal} sản phẩm)`)
    }
    if (Array.isArray(record.refunds) && record.refunds.length > 0) {
      for (const f of record.refunds) {
        lines.push(`Hoàn ${formatCurrency(f.amount)} (${f.method})`)
      }
    }
    return lines.join(' · ')
  }

  function parseReturnRecord (returnReason) {
    if (!returnReason || typeof returnReason !== 'string') return null
    const raw = returnReason.trim()
    if (!raw.startsWith('{')) return null
    try {
      const parsed = JSON.parse(raw)
      if (parsed && parsed.__type === 'RETURN_RECORD') return parsed
    } catch {
      // không phải JSON record
    }
    return null
  }

  function mergeOrder (updatedOrder) {
    if (!updatedOrder) return
    const id = Number(updatedOrder.id)
    const idx = orders.value.findIndex(o => Number(o.id) === id)
    if (idx !== -1) {
      orders.value[idx] = { ...orders.value[idx], ...updatedOrder }
    }
  }

  function canRefund (order) {
    if (!order) return false
    const paymentStatus = normalizePaymentStatusValue(order.paymentStatus)
    if (paymentStatus === 'REFUNDED' || paymentStatus === 'HOAN_TIEN') return false
    const status = normalizeOrderStatusValue(order.status)
    if (['NEW', 'PENDING', 'PROCESSING', 'SHIPPING', 'SUCCESS', 'RETURN_REQUEST'].includes(status)) return false
    return true
  }

  function canProcessReturn (order) {
    if (!order) return false
    const status = normalizeOrderStatusValue(order.status)
    if (status === 'RETURNED' || status === 'DAMAGED' || status === 'LOST') return false
    return status === 'RETURN_APPROVED' || status === 'RETURNING'
  }

  function openRefundModal (order) {
    let images = []
    if (order.returnImages) {
      if (Array.isArray(order.returnImages)) {
        images = order.returnImages
      } else if (typeof order.returnImages === 'string') {
        try {
          images = JSON.parse(order.returnImages)
        } catch {
          images = order.returnImages.split(',').filter(Boolean)
        }
      }
    }

    const record = parseReturnRecord(order.returnReason)
    const rawReason = order.returnReason || ''
    const reasonText = record
      ? (record.reason || '')
      : (rawReason.startsWith('{') ? '' : rawReason)
    const defaultAmount = 0
    const defaultMethod = (order.paymentMethodName || '').toLowerCase().includes('vnpay')
      ? 'VNPay'
      : 'COD'

    refundForm.value = {
      orderId: order.id,
      amount: defaultAmount,
      method: defaultMethod,
      note: reasonText,
      customerReason: reasonText,
      customerImages: images,
    }
    showRefundModal.value = true
  }

  function closeRefundModal () {
    showRefundModal.value = false
  }

  async function submitRefund () {
    if (refunding.value) return
    const amount = asNumber(refundForm.value.amount)
    if (amount <= 0) {
      alert('Vui lòng nhập số tiền hoàn hợp lệ')
      return
    }
    refunding.value = true
    try {
      const payload = {
        amount,
        method: refundForm.value.method,
        note: refundForm.value.note,
      }
      const result = await adminApi.processOrderRefund(refundForm.value.orderId, payload)
      showRefundModal.value = false
      await loadOrders(true)
      if (result && result.order) {
        mergeOrder(result.order)
      }
    } catch (error_) {
      alert(error_.message || 'Lỗi khi xử lý hoàn tiền!')
    } finally {
      refunding.value = false
    }
  }

  function openReturnModal (order) {
    const record = parseReturnRecord(order.returnReason)
    const alreadyReturned = {}
    if (record && Array.isArray(record.items)) {
      for (const item of record.items) {
        const key = String(item.orderItemId ?? '')
        alreadyReturned[key] = (alreadyReturned[key] || 0) + asNumber(item.quantity)
      }
    }

    const rawItems = extractOrderItems(order)
    const items = rawItems.map(rawItem => {
      const price = Number(rawItem.price || rawItem.unitPrice || rawItem.variant?.price || 0)
      const quantity = Number(rawItem.quantity || rawItem.qty || 1)
      const already = asNumber(alreadyReturned[String(rawItem.id)])
      return {
        orderItemId: Number(rawItem.id),
        label: formatOrderItemText(rawItem),
        price: Number.isFinite(price) ? price : 0,
        quantity,
        maxReturnable: Math.max(0, quantity - already),
        qty: 0,
      }
    }).filter(item => item.maxReturnable > 0)

    returnForm.value = {
      orderId: order.id,
      reason: (record && record.reason) || order.returnReason || '',
      restoreStock: true,
      items,
    }
    showReturnModal.value = true
  }

  function closeReturnModal () {
    showReturnModal.value = false
  }

  const returnPreview = computed(() => {
    let totalRefund = 0
    const byId = {}
    const lines = (returnForm.value.items || []).map(item => {
      const qty = Math.min(asNumber(item.qty), item.maxReturnable)
      const refund = Math.round(item.price * qty)
      totalRefund += refund
      const row = { ...item, qty: Math.max(0, qty), refund }
      byId[String(item.orderItemId)] = row
      return row
    })
    return { totalRefund: Math.round(totalRefund), lines, byId }
  })

  const returnOrder = computed(() =>
    orders.value.find(o => Number(o.id) === Number(returnForm.value.orderId)) || null,
  )

  const lockedOrderStatuses = new Set(['SHIPPING', 'DELIVERING', 'SUCCESS'])
  const isOrderLocked = computed(() =>
    editingOrderId.value && lockedOrderStatuses.has(String(form.value.status || '').trim().toUpperCase()),
  )

  async function submitReturn () {
    if (returning.value) return
    const selected = returnPreview.value.lines
      .filter(item => item.qty > 0)
      .map(item => ({ orderItemId: item.orderItemId, quantity: item.qty }))
    if (selected.length === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm và số lượng cần trả')
      return
    }
    returning.value = true
    try {
      const payload = {
        items: selected,
        reason: returnForm.value.reason,
        restoreStock: returnForm.value.restoreStock,
      }
      const result = await adminApi.processOrderReturn(returnForm.value.orderId, payload)
      showReturnModal.value = false
      await loadOrders(true)
      if (result && result.order) {
        mergeOrder(result.order)
      }
    } catch (error_) {
      alert(error_.message || 'Lỗi khi xử lý trả hàng!')
    } finally {
      returning.value = false
    }
  }

  function openReviewModal (order) {
    let images = []
    if (order.returnImages) {
      if (Array.isArray(order.returnImages)) {
        images = order.returnImages
      } else if (typeof order.returnImages === 'string') {
        try {
          images = JSON.parse(order.returnImages)
        } catch {
          images = order.returnImages.split(',').filter(Boolean)
        }
      }
    }

    const record = parseReturnRecord(order.returnReason)
    const rawReason = order.returnReason || ''
    const reasonText = record
      ? (record.reason || '')
      : (rawReason.startsWith('{') ? '' : rawReason)

    reviewForm.value = {
      orderId: order.id,
      customerReason: reasonText,
      customerImages: images,
      rejectReason: ''
    }
    showReviewModal.value = true
  }

  function closeReviewModal () {
    showReviewModal.value = false
  }

  async function approveReturnRequest() {
    if (reviewing.value) return
    reviewing.value = true
    try {
      await adminApi.updateOrder(reviewForm.value.orderId, { status: 'RETURN_APPROVED' })
      showReviewModal.value = false
      await loadOrders(true)
    } catch (error_) {
      alert(error_.message || 'Lỗi khi duyệt yêu cầu!')
    } finally {
      reviewing.value = false
    }
  }

  async function rejectReturnRequest () {
    if (reviewing.value) return
    reviewing.value = true
    try {
      const payload = {
        status: 'SUCCESS',
        rejectReason: reviewForm.value.rejectReason || 'Bị từ chối'
      }
      await adminApi.updateOrder(reviewForm.value.orderId, payload)
      showReviewModal.value = false
      await loadOrders(true)
    } catch (error_) {
      alert(error_.message || 'Lỗi khi từ chối yêu cầu!')
    } finally {
      reviewing.value = false
    }
  }

  const editingOrderId = ref(null)
  const saving = ref(false)
  const modalError = ref('')
  const form = ref(emptyForm())
  const isApplyingOrderRules = ref(false)
  const orderRuleHint = ref('')
  const selectedOrderItems = ref([])

  const hiddenOrders = ref([])

  const newOrderToast = ref(null)
  const trackedOrder = ref(null)
  let pollingInterval = null
  const isFirstLoad = ref(true)

  const visibleOrders = computed(() => {
    return orders.value.filter(
      order =>
        !hiddenOrders.value.some(
          hidden => Number(order.id) === Number(hidden.id),
        ),
    )
  })

  const pendingReturnRequests = computed(() => {
    return visibleOrders.value.filter(order => order.status === 'RETURN_REQUEST')
  })

  const latestOrder = computed(() => {
    return visibleOrders.value.length > 0 ? visibleOrders.value[0] : null
  })

  const activeTrackedOrder = computed(() => {
    return trackedOrder.value || latestOrder.value
  })

  function selectOrderToTrack (order) {
    trackedOrder.value = order
  }

  const trackingSteps = computed(() => {
    if (!activeTrackedOrder.value) return []
    const status = normalizeOrderStatusValue(activeTrackedOrder.value.status)

    const steps = [
      { label: 'Chờ xử lý', icon: 'receipt_long', isActive: true, isError: false, isWarning: false },
      { label: 'Đang xử lý', icon: 'inventory_2', isActive: ['PROCESSING', 'SHIPPING', 'SUCCESS', 'RETURN_REQUEST', 'RETURN_APPROVED', 'RETURNING', 'RETURNED'].includes(status), isError: false, isWarning: false },
    ]

    if (status === 'CANCELLED') {
      steps.push({ label: 'Đã hủy', icon: 'cancel', isActive: true, isError: true, isWarning: false })
    } else if (['DAMAGED', 'LOST'].includes(status)) {
      steps.push({ label: 'Đang giao', icon: 'local_shipping', isActive: true, isError: false, isWarning: false }, { label: 'Hàng hỏng / mất', icon: 'warning', isActive: true, isError: true, isWarning: true })
    } else if (['RETURN_REQUEST', 'RETURN_APPROVED', 'RETURNING', 'RETURNED'].includes(status)) {
      steps.push({ label: 'Đang giao', icon: 'local_shipping', isActive: true, isError: false, isWarning: false }, { label: 'Thành công', icon: 'check_circle', isActive: true, isError: false, isWarning: false }, { label: 'Yêu cầu hoàn', icon: 'assignment_return', isActive: true, isError: false, isWarning: true })
      steps.push({ label: 'Đang hoàn về', icon: 'local_shipping', isActive: ['RETURNING', 'RETURNED'].includes(status), isError: false, isWarning: true }, { label: 'Đã hoàn', icon: 'settings_backup_restore', isActive: status === 'RETURNED', isError: false, isWarning: true })
    } else {
      steps.push({ label: 'Đang giao', icon: 'local_shipping', isActive: ['SHIPPING', 'SUCCESS'].includes(status), isError: false, isWarning: false }, { label: 'Thành công', icon: 'check_circle', isActive: status === 'SUCCESS', isError: false, isWarning: false })
    }

    return steps
  })

  function normalizeStatusKey (value) {
    return String(value || '')
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036F]/g, '')
      .replace(/\s+/g, '_')
      .replace(/-/g, '_')
      .toUpperCase()
  }

  function normalizeOrderStatusValue (value) {
    const key = normalizeStatusKey(value)

    if (['NEW', 'PENDING', 'WAITING', 'CHUA_XU_LY', 'CHO_XU_LY'].includes(key)) {
      return 'PENDING'
    }
    if (
      [
        'CONFIRMED',
        'PROCESSING',
        'DANG_XU_LY',
        'XAC_NHAN',
        'IN_PROGRESS',
      ].includes(key)
    ) {
      return 'PROCESSING'
    }
    if (['SHIPPING', 'DANG_GIAO', 'DELIVERING', 'IN_TRANSIT'].includes(key)) {
      return 'SHIPPING'
    }
    if (
      ['SUCCESS', 'COMPLETED', 'DELIVERED', 'THANH_CONG', 'HOAN_THANH'].includes(
        key,
      )
    ) {
      return 'SUCCESS'
    }
    if (['RETURN_REQUEST', 'YEU_CAU_TRA'].includes(key)) {
      return 'RETURN_REQUEST'
    }
    if (['RETURNING', 'TRA_HANG', 'DANG_HOAN', 'DANG_TRA_HANG'].includes(key)) {
      return 'RETURNING'
    }
    if (
      ['RETURNED', 'HOAN_TRA', 'HOAN_TIEN', 'REFUND', 'REFUNDED', 'HOAN_HANG'].includes(key)
    ) {
      return 'RETURNED'
    }
    if (['DAMAGED', 'HANG_HONG', 'HANG_HONG_HONG'].includes(key)) {
      return 'DAMAGED'
    }
    if (['LOST', 'HANG_MAT', 'MAT_HANG', 'THAT_LAC', 'PARCEL_LOST'].includes(key)) {
      return 'LOST'
    }
    if (['CANCELLED', 'CANCELED', 'DA_HUY', 'HUY', 'FAILED'].includes(key)) {
      return 'CANCELLED'
    }

    return key || 'PENDING'
  }

  function normalizePaymentStatusValue (paymentStatus) {
    const key = normalizeStatusKey(paymentStatus)

    if (
      ['PENDING', 'UNPAID', 'CHUA_THANH_TOAN', 'AWAITING_PAYMENT'].includes(key)
    ) {
      return 'PENDING'
    }
    if (['PAID', 'DA_THANH_TOAN', 'SETTLED', 'CAPTURED'].includes(key)) {
      return 'PAID'
    }
    if (
      ['REFUNDED', 'REFUND', 'HOAN_TIEN', 'CHARGEBACK', 'REVERSED'].includes(key)
    ) {
      return 'REFUNDED'
    }

    return key || 'PENDING'
  }

  const statusOptions = [
    { value: 'PENDING', label: 'Chờ xử lý' },
    { value: 'PROCESSING', label: 'Đang xử lý' },
    { value: 'SHIPPING', label: 'Đang giao' },
    { value: 'SUCCESS', label: 'Thành công' },
    { value: 'RETURN_REQUEST', label: 'Yêu cầu hoàn' },
    { value: 'RETURN_APPROVED', label: 'Đã duyệt hoàn' },
    { value: 'RETURNING', label: 'Đang hoàn về' },
    { value: 'RETURNED', label: 'Đã hoàn trả' },
    { value: 'CANCELLED', label: 'Đã hủy' },
    { value: 'DAMAGED', label: 'Hàng hỏng' },
    { value: 'LOST', label: 'Hàng mất' },
  ]

  const paymentStatusOptions = [
    { value: 'PENDING', label: 'Chưa thanh toán' },
    { value: 'PAID', label: 'Đã thanh toán' },
    { value: 'REFUNDED', label: 'Hoàn tiền' },
    { value: 'FAILED', label: 'Thất bại' },
  ]
  const profitablePaymentStatuses = new Set(['PAID', 'SETTLED', 'CAPTURED'])
  const deductedPaymentStatuses = new Set([
    'REFUNDED',
    'REFUND',
    'CHARGEBACK',
    'REVERSED',
  ])

  const filteredOrders = computed(() => {
    const keyword = search.value.trim().toLowerCase()
    return visibleOrders.value
      .filter(order => {
        const statusMatch
          = statusFilter.value === 'ALL'
            || normalizeOrderStatusValue(order.status) === statusFilter.value

        if (!statusMatch) {
          return false
        }

        if (!keyword) {
          return true
        }

        const haystack = [
          order.id,
          order.fullName,
          order.phone,
          order.email,
          order.status,
          order.paymentStatus,
        ]
          .filter(item => item !== undefined && item !== null)
          .join(' ')
          .toLowerCase()

        return haystack.includes(keyword)
      })
      .sort((a, b) => {
        const timeA = new Date(a.createdAt || 0).getTime()
        const timeB = new Date(b.createdAt || 0).getTime()
        if (timeA !== timeB) {
          return timeB - timeA
        }
        return Number(b.id || 0) - Number(a.id || 0)
      })
  })

  const totalPages = computed(() => {
    const total = Math.ceil(filteredOrders.value.length / pageSize.value)
    return Math.max(total, 1)
  })

  const paginatedOrders = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return filteredOrders.value.slice(start, end)
  })

  const pageStart = computed(() => {
    if (filteredOrders.value.length === 0) return 0
    return (currentPage.value - 1) * pageSize.value + 1
  })

  const pageEnd = computed(() => {
    if (filteredOrders.value.length === 0) return 0
    return Math.min(currentPage.value * pageSize.value, filteredOrders.value.length)
  })

  watch([search, statusFilter], () => {
    currentPage.value = 1
  })

  watch([filteredOrders, pageSize], () => {
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value
    }
  })

  function isRefundedOrder (order) {
    const paymentStatus = normalizePaymentStatusValue(order?.paymentStatus)
    const status = normalizeOrderStatusValue(order?.status)
    return deductedPaymentStatuses.has(paymentStatus) || ['RETURN_REQUEST', 'RETURNING', 'RETURNED', 'DAMAGED', 'LOST'].includes(status)
  }

  const profitableOrders = computed(() => {
    return orders.value.filter(order => {
      const paymentStatus = normalizePaymentStatusValue(order.paymentStatus)
      return !isRefundedOrder(order) && profitablePaymentStatuses.has(paymentStatus)
    })
  })

  const deductedOrders = computed(() => {
    return orders.value.filter(order => isRefundedOrder(order))
  })

  const profitableOrdersCount = computed(() => profitableOrders.value.length)
  const deductedOrdersCount = computed(() => deductedOrders.value.length)

  const profitableRevenue = computed(() => {
    return profitableOrders.value.reduce((sum, order) => {
      const amount = Math.abs(Number(order.finalAmount ?? order.totalMoney ?? 0))
      return sum + (Number.isFinite(amount) ? amount : 0)
    }, 0)
  })

  const deductedRevenue = computed(() => {
    return deductedOrders.value.reduce((sum, order) => {
      const amount = Math.abs(Number(order.finalAmount ?? order.totalMoney ?? 0))
      return sum + (Number.isFinite(amount) ? amount : 0)
    }, 0)
  })

  const netRevenue = computed(
    () => profitableRevenue.value - deductedRevenue.value,
  )

  function emptyForm () {
    return {
      accountId: null,
      fullName: '',
      phone: '',
      email: '',
      address: '',
      paymentMethodId: null,
      paymentMethod: '',
      paymentMethodName: '',
      totalMoney: 0,
      finalAmount: 0,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      returnReason: '',
      shippingFee: 0,
      discountAmount: 0,
    }
  }

  function normalizePaymentMethodKey (value) {
    return normalizeStatusKey(value).replace(/\s+/g, '_')
  }

  function getPaymentMethodId (orderLike) {
    const source = orderLike && typeof orderLike === 'object' ? orderLike : {}
    const rawId
      = source.paymentMethodId
        ?? source.payment_method_id
        ?? source.paymentMethod?.id
        ?? source.payment_method?.id
        ?? null
    const methodId = Number(rawId)

    if (Number.isFinite(methodId) && methodId > 0) {
      return methodId
    }

    const methodKey = normalizePaymentMethodKey(
      source.paymentMethodName
      ?? source.payment_method_name
        ?? source.paymentMethod?.name
      ?? source.payment_method?.name
        ?? source.paymentMethod
      ?? source.payment_method
        ?? '',
    )

    if (['COD', 'CASH', 'TIEN_MAT', 'THANH_TOAN_KHI_NHAN_HANG'].some(token => methodKey.includes(token))) return 1
    if (methodKey.includes('VNPAY')) return 2
    if (methodKey.includes('MOMO')) return 3
    if (['BANK', 'TRANSFER', 'CHUYEN_KHOAN'].some(token => methodKey.includes(token))) return 4
    if (methodKey.includes('ZALOPAY')) return 5

    return null
  }

  function isCashOnDeliveryMethod (orderLike) {
    const source = orderLike && typeof orderLike === 'object' ? orderLike : {}
    const methodId = getPaymentMethodId(source)
    const methodKey = normalizePaymentMethodKey(
      source.paymentMethod
      ?? source.payment_method
        ?? source.paymentMethodName
      ?? source.payment_method_name
        ?? '',
    )

    if (methodId === 1) return true
    return ['COD', 'CASH', 'TIEN_MAT', 'THANH_TOAN_KHI_NHAN_HANG'].some(token =>
      methodKey.includes(token),
    )
  }

  function isPrepaidMethod (orderLike) {
    const source = orderLike && typeof orderLike === 'object' ? orderLike : {}
    const methodId = getPaymentMethodId(source)
    const methodKey = normalizePaymentMethodKey(
      source.paymentMethod
      ?? source.payment_method
        ?? source.paymentMethodName
      ?? source.payment_method_name
        ?? '',
    )

    if (methodId === 2) return true
    return ['QR', 'VNPAY', 'MOMO', 'BANK', 'TRANSFER', 'WALLET', 'CARD'].some(
      token => methodKey.includes(token),
    )
  }

  function resolveManagedOrderState (
    orderLike,
    nextStatusInput,
    nextPaymentStatusInput,
  ) {
    let nextStatus = normalizeOrderStatusValue(nextStatusInput)
    let nextPaymentStatus = normalizePaymentStatusValue(nextPaymentStatusInput)
    const currentStatus = normalizeOrderStatusValue(orderLike?.status)
    const currentPayment = normalizePaymentStatusValue(orderLike?.paymentStatus)
    const isCod = isCashOnDeliveryMethod(orderLike)
    const isPrepaid = isPrepaidMethod(orderLike)
    const isReturnRequestPending
      = currentStatus === 'SUCCESS' && nextStatus === 'PENDING'

    if (isFinalOrderStatus(currentStatus) && nextStatus !== currentStatus) {
      return {
        status: currentStatus,
        paymentStatus: currentPayment,
      }
    }

    // Return request phase: move back to waiting while keeping payment as paid.
    if (isReturnRequestPending) {
      nextPaymentStatus = 'PAID'
    }

    // Returning stage keeps paid state until return is fully confirmed.
    if (nextStatus === 'RETURNING') {
      nextPaymentStatus = 'PAID'
    }

    // Returned orders must be refunded.
    if (nextStatus === 'RETURNED') {
      nextPaymentStatus = 'REFUNDED'
    }

    if (nextStatus === 'DAMAGED') {
      return { status: 'DAMAGED', paymentStatus: 'REFUNDED' }
    }
    if (nextStatus === 'LOST') {
      return { status: 'LOST', paymentStatus: 'REFUNDED' }
    }

    // Cancelled orders: prepaid -> refunded (if paid), COD -> pending (customer did not receive item).
    if (nextStatus === 'CANCELLED') {
      if (isPrepaid) {
        nextPaymentStatus = currentPayment === 'PAID' ? 'REFUNDED' : 'PENDING'
      } else if (isCod) {
        nextPaymentStatus = 'PENDING'
      }
    }

    // Always keep successful orders in paid state.
    if (nextStatus === 'SUCCESS') {
      nextPaymentStatus = 'PAID'
    }

    // Prepaid/QR orders must be paid to enter fulfillment pipeline.
    if (
      isPrepaid
      && ['PROCESSING', 'SHIPPING', 'SUCCESS'].includes(nextStatus)
    ) {
      nextPaymentStatus = 'PAID'
    }

    // COD orders are unpaid until successful completion.
    if (
      !isReturnRequestPending
      && isCod
      && ['PENDING', 'PROCESSING', 'SHIPPING'].includes(nextStatus)
    ) {
      nextPaymentStatus = 'PENDING'
    }

    // Refunded payment implies a fully confirmed return or prepaid cancellation.
    if (nextPaymentStatus === 'REFUNDED') {
      if (isCod && nextStatus === 'CANCELLED') {
        nextPaymentStatus = 'PENDING'
      } else if (!['RETURNED', 'CANCELLED'].includes(nextStatus)) {
        nextStatus = 'RETURNED'
      }
    }

    // If admin marks COD as paid, promote to success to keep states linked.
    // Exception: Do not promote to success if the order is in the return flow.
    if (
      isCod
      && nextPaymentStatus === 'PAID'
      && !['SUCCESS', 'RETURN_REQUEST', 'RETURNING', 'RETURNED', 'CANCELLED'].includes(nextStatus)
    ) {
      return {
        status: 'SUCCESS',
        paymentStatus: 'PAID',
      }
    }

    return {
      status: nextStatus,
      paymentStatus: nextPaymentStatus,
    }
  }

  function isFinalOrderStatus (statusValue) {
    const normalized = normalizeOrderStatusValue(statusValue)
    return ['SUCCESS', 'CANCELLED', 'RETURNED'].includes(normalized)
  }

  function isStatusOptionDisabled (statusValue) {
    if (!showModal.value) return false

    const normalizedStatus = normalizeOrderStatusValue(statusValue)
    const currentStatus = normalizeOrderStatusValue(form.value.status)

    if (isFinalOrderStatus(currentStatus) && normalizedStatus !== currentStatus) {
      return true
    }

    const currentPayment = normalizePaymentStatusValue(form.value.paymentStatus)
    const managedState = resolveManagedOrderState(
      form.value,
      normalizedStatus,
      currentPayment,
    )

    return managedState.status !== normalizedStatus
  }

  function isPaymentStatusOptionDisabled (paymentStatusValue) {
    if (!showModal.value) return false

    const normalizedPayment = normalizePaymentStatusValue(paymentStatusValue)
    const currentStatus = normalizeOrderStatusValue(form.value.status)
    const managedState = resolveManagedOrderState(
      form.value,
      currentStatus,
      normalizedPayment,
    )

    return managedState.paymentStatus !== normalizedPayment
  }

  const paymentFlowLabel = computed(() => {
    if (isPrepaidMethod(form.value)) return 'Trả trước (QR/chuyển khoản)'
    if (isCashOnDeliveryMethod(form.value))
      return 'COD (thanh toán khi nhận hàng)'
    return 'Không xác định'
  })

  function applyManagedOrderRules (trigger = '') {
    if (!showModal.value || isApplyingOrderRules.value) return

    const currentStatus = normalizeOrderStatusValue(form.value.status)
    const currentPaymentStatus = normalizePaymentStatusValue(
      form.value.paymentStatus,
    )
    const managed = resolveManagedOrderState(
      form.value,
      currentStatus,
      currentPaymentStatus,
    )

    const statusChanged = managed.status !== currentStatus
    const paymentChanged = managed.paymentStatus !== currentPaymentStatus

    if (!statusChanged && !paymentChanged) {
      if (trigger === 'status' || trigger === 'payment') {
        orderRuleHint.value = 'Trạng thái và thanh toán đã đúng theo quy tắc.'
      }
      return
    }

    isApplyingOrderRules.value = true
    form.value.status = managed.status
    form.value.paymentStatus = managed.paymentStatus
    isApplyingOrderRules.value = false

    if (statusChanged && paymentChanged) {
      orderRuleHint.value
        = 'Đã tự đồng bộ cả trạng thái đơn và trạng thái thanh toán.'
      return
    }
    if (statusChanged) {
      orderRuleHint.value
        = 'Đã tự cập nhật trạng thái đơn để đồng bộ với trạng thái thanh toán.'
      return
    }
    orderRuleHint.value
      = 'Đã tự cập nhật trạng thái thanh toán để đồng bộ với trạng thái đơn.'
  }

  function getOrderStatusLabel (status) {
    const value = normalizeOrderStatusValue(status)

    if (value === 'DAMAGED') return 'Hàng hỏng'
    if (value === 'LOST') return 'Hàng mất'

    const found = statusOptions.find(item => item.value === value)
    return found ? found.label : 'Không xác định'
  }

  function getPaymentStatusLabel (status) {
    const value = normalizePaymentStatusValue(status)
    const found = paymentStatusOptions.find(item => item.value === value)
    return found ? found.label : 'Chưa thanh toán'
  }

  function getPaymentMethodLabel (orderLike) {
    const source = orderLike && typeof orderLike === 'object' ? orderLike : {}
    const methodId = getPaymentMethodId(source)
    const rawMethod = String(
      source.paymentMethodName
      ?? source.payment_method_name
        ?? source.paymentMethod?.name
      ?? source.payment_method?.name
        ?? source.paymentMethod
      ?? source.payment_method
        ?? '',
    ).trim()

    const normalized = normalizePaymentMethodKey(rawMethod)
    if (methodId === 1) return 'Thanh toán khi nhận hàng (COD)'
    if (methodId === 2 || normalized.includes('VNPAY')) return 'VNPay'
    if (methodId === 3 || normalized.includes('MOMO')) return 'Momo'
    if (
      methodId === 4
      || normalized.includes('BANK')
      || normalized.includes('TRANSFER')
    ) {
      return 'Chuyển khoản ngân hàng'
    }
    if (methodId === 5 || normalized.includes('ZALOPAY')) return 'ZaloPay'

    return rawMethod || 'Không xác định'
  }

  function asNumber (value, fallback = 0) {
    const n = Number(value)
    return Number.isFinite(n) ? n : fallback
  }

  function formatCurrency (value) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(asNumber(value, 0))
  }

  function formatDate (value) {
    const time = new Date(value || 0)
    if (Number.isNaN(time.getTime())) {
      return 'Không rõ'
    }
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(time)
  }

  function unwrapOrderPayload (payload) {
    if (!payload || typeof payload !== 'object') return null
    if (payload.data && typeof payload.data === 'object') return payload.data
    if (payload.content && typeof payload.content === 'object')
      return payload.content
    return payload
  }

  function extractOrderItems (orderLike) {
    const source = unwrapOrderPayload(orderLike)
    if (!source || typeof source !== 'object') return []

    const candidates = [
      source.orderItems,
      source.order_items,
      source.items,
      source.orderDetails,
      source.order_details,
    ]

    const found = candidates.find(candidate => Array.isArray(candidate))
    return Array.isArray(found) ? found : []
  }

  function formatOrderItemText (itemLike) {
    const item = itemLike && typeof itemLike === 'object' ? itemLike : {}
    const productName
      = item.productName
        || item.product_name
        || item.name
        || item.variantName
        || item.variant_name
        || item.variant?.productName
        || item.variant?.product?.name
        || `Sản phẩm #${item.productId ?? item.product_id ?? item.variantId ?? item.variant_id ?? '?'}`

    const colorName
      = item.colorName
        || item.color_name
        || item.color?.name
        || item.variant?.colorName
        || item.variant?.color?.name
        || ''

    const sizeName
      = item.sizeName
        || item.size_name
        || item.size?.name
        || item.variant?.sizeName
        || item.variant?.size?.name
        || ''

    const quantity = Number(item.quantity ?? item.qty ?? 0)
    const qtyLabel
      = Number.isFinite(quantity) && quantity > 0 ? `x${quantity}` : 'x1'
    const variantText = [colorName, sizeName].filter(Boolean).join('/')

    return variantText
      ? `${productName} (${variantText}) ${qtyLabel}`
      : `${productName} ${qtyLabel}`
  }

  function normalizeOrderItemsForDisplay (orderLike) {
    return extractOrderItems(orderLike).map(formatOrderItemText).filter(Boolean)
  }

  function normalizeOrderItemsForModal (orderLike) {
    return extractOrderItems(orderLike).map(item => {
      const text = formatOrderItemText(item)
      const image = item.imageUrl || item.image || item.variant?.imageUrl || item.product?.imageUrl || ''
      const variant = item.variant || {}
      const product = item.product || variant.product || {}
      const productCode = item.productCode || item.product_code || product.productCode || product.product_code || variant.productCode || variant.product_code || ''
      const code = item.variantCode || item.variant_code || variant.variantCode || variant.variant_code || buildVariantCode(productCode, item.colorName || variant.colorName || variant.color_name, item.sizeName || variant.sizeName || variant.size_name)
      const price = Number(item.price || item.unitPrice || item.variant?.price || item.product?.price || 0)
      const qty = Number(item.quantity || item.qty || 1)
      const priceText = `${formatCurrency(price)} x ${qty}`

      return { text, image, code, priceText }
    }).filter(Boolean)
  }

  function getOrderItemsPreview (orderLike) {
    const lines = normalizeOrderItemsForDisplay(orderLike)
    if (lines.length === 0) {
      return ['Chưa có dữ liệu sản phẩm']
    }

    const max = 2
    if (lines.length <= max) {
      return lines
    }

    return [...lines.slice(0, max), `+${lines.length - max} sản phẩm khác`]
  }

  function statusClass (status) {
    const normalized = normalizeOrderStatusValue(status)
    if (['SUCCESS'].includes(normalized)) {
      return 'bg-green-100 text-green-700  '
    }
    if (['PROCESSING', 'SHIPPING'].includes(normalized)) {
      return 'bg-blue-100 text-blue-700  '
    }
    if (['RETURN_REQUEST', 'RETURN_APPROVED', 'RETURNING'].includes(normalized)) {
      return 'bg-orange-100 text-orange-700  '
    }
    if (['DAMAGED', 'LOST'].includes(normalized)) {
      return 'bg-rose-100 text-rose-700  '
    }
    if (['CANCELLED', 'RETURNED'].includes(normalized)) {
      return 'bg-red-100 text-red-700  '
    }
    return 'bg-yellow-100 text-yellow-700  '
  }

  const accountLookupLoading = ref(false)

  async function fillAccountInfo (accountId, allowOverwrite = false) {
    const id = Number(accountId)
    if (!Number.isFinite(id) || id <= 0) return
    accountLookupLoading.value = true
    try {
      const raw = await accountsApi.getById(id)
      const acc = raw && (raw.data || raw)
      if (!acc) return
      if (allowOverwrite || !form.value.fullName)
        form.value.fullName
          = acc.username || acc.fullName || acc.name || form.value.fullName
      if (allowOverwrite || !form.value.phone)
        form.value.phone = acc.phone || form.value.phone
      if (allowOverwrite || !form.value.email)
        form.value.email = acc.gmail || acc.email || form.value.email
      if (allowOverwrite || !form.value.address)
        form.value.address = acc.address || form.value.address
    } catch {
    // Silently ignore lookup failure — admin can fill fields manually
    } finally {
      accountLookupLoading.value = false
    }
  }

  function openCreate () {
    editingOrderId.value = null
    form.value = emptyForm()
    orderRuleHint.value = ''
    selectedOrderItems.value = []
    modalError.value = ''
    showModal.value = true
    applyManagedOrderRules('init')
  }

  async function openEdit (order) {
    selectedOrderItems.value = normalizeOrderItemsForModal(order)

    if (Number.isFinite(Number(order.id))) {
      try {
        const orderDetail = await ordersApi.getOrderById(order.id)
        if (orderDetail && typeof orderDetail === 'object') {
          order = { ...order, ...orderDetail }
          selectedOrderItems.value = normalizeOrderItemsForModal(order)
        }
      } catch {
      // Keep list data when the detailed order cannot be loaded.
      }
    }

    editingOrderId.value = order.id
    form.value = {
      accountId: Number.isFinite(Number(order.accountId))
        ? Number(order.accountId)
        : Number.isFinite(Number(order.account_id))
          ? Number(order.account_id)
          : Number.isFinite(Number(order.account?.id))
            ? Number(order.account.id)
            : null,
      fullName: order.fullName || order.fullname || '',
      phone: order.phone || '',
      email: order.email || order.gmail || '',
      address:
        order.shippingAddress || order.shipping_address || order.address || '',
      paymentMethodId: getPaymentMethodId(order),
      paymentMethod:
        order.paymentMethod
        || order.payment_method
        || order.paymentMethod?.name
        || order.payment_method?.name
        || order.paymentMethodName
        || '',
      paymentMethodName:
        order.paymentMethodName
        || order.payment_method_name
        || order.paymentMethod?.name
        || order.payment_method?.name
        || '',
      shippingFee: asNumber(
        order.shippingFee
        ?? order.shipping_fee
          ?? order.shipping
        ?? order.shippingAmount
          ?? order.shipping_amount
        ?? order.deliveryFee
          ?? order.delivery_fee
        ?? order.shipFee
          ?? order.ship_fee
        ?? order.feeShip
          ?? order.fee_ship,
        0,
      ),
      discountAmount: asNumber(order.discountAmount ?? order.discount_amount, 0),
      totalMoney: asNumber(order.totalMoney ?? order.total_money, 0),
      finalAmount: asNumber(
        order.finalAmount
        ?? order.final_amount
          ?? order.totalMoney
        ?? order.total_money,
        0,
      ),
      status: normalizeOrderStatusValue(order.status),
      paymentStatus: normalizePaymentStatusValue(order.paymentStatus),
      returnReason: order.returnReason || '',
      returnImages: (typeof order.returnImages === 'string'
        ? (() => {
          try {
            return JSON.parse(order.returnImages)
          } catch {
            return order.returnImages.split(',').filter(Boolean)
          }
        })()
        : order.returnImages) || [],
    }
    orderRuleHint.value = ''
    modalError.value = ''
    showModal.value = true
    applyManagedOrderRules('init')

    // Auto-fill missing email / address from the account record
    const hasAccountId = Number.isFinite(Number(order.accountId))
    const missingContactInfo = !order.email || !order.address
    if (hasAccountId && missingContactInfo) {
      await fillAccountInfo(order.accountId, false)
    }
  }

  // When admin changes the accountId field while creating / editing, auto-fill details
  watch(
    () => form.value.accountId,
    (newId, oldId) => {
      if (!showModal.value) return
      if (newId === oldId) return
      fillAccountInfo(newId, true)
    },
  )

  watch(
    () => form.value.status,
    (next, prev) => {
      if (next === prev) return
      applyManagedOrderRules('status')
    },
  )

  watch(
    () => form.value.paymentStatus,
    (next, prev) => {
      if (next === prev) return
      applyManagedOrderRules('payment')
    },
  )

  watch(
    () => [form.value.paymentMethodId, form.value.paymentMethod, form.value.paymentMethodName],
    () => {
      applyManagedOrderRules('method')
    },
  )

  function closeModal () {
    showModal.value = false
  }

  async function saveOrder () {
    modalError.value = ''
    const f = form.value

    if (!f.fullName) {
      modalError.value = 'Vui lòng nhập tên khách hàng.'
      return
    }

    if (!Number.isFinite(Number(f.totalMoney)) || Number(f.totalMoney) <= 0) {
      modalError.value = 'Tổng tiền phải lớn hơn 0.'
      return
    }

    const managedState = resolveManagedOrderState(f, f.status, f.paymentStatus)

    const payload = {
      accountId: Number.isFinite(Number(f.accountId))
        ? Number(f.accountId)
        : null,
      fullname: f.fullName,
      email: f.email || '',
      phone: f.phone || '',
      shippingAddress: f.address || '',
      address: f.address || '', // Bao lô ở đây để backend luôn nhận được!
      totalMoney: asNumber(f.totalMoney, 0),
      finalAmount: asNumber(f.finalAmount, 0),
      shippingFee: asNumber(f.shippingFee, 0),
      discountAmount: asNumber(f.discountAmount, 0),
      status: managedState.status,
      paymentStatus: managedState.paymentStatus,
      paymentMethodId: Number.isFinite(Number(f.paymentMethodId))
        ? Number(f.paymentMethodId)
        : 1,
    }

    saving.value = true
    try {
      await (editingOrderId.value ? adminApi.updateOrder(editingOrderId.value, payload) : adminApi.createOrder(payload))

      closeModal()
      await loadOrders()
    } catch (error_) {
      modalError.value = error_?.message || 'Không thể lưu đơn hàng.'
    } finally {
      saving.value = false
    }
  }

  async function quickUpdateStatus (order, status) {
    try {
      const currentStatus = normalizeOrderStatusValue(order.status)
      if (
        isFinalOrderStatus(currentStatus)
        && currentStatus !== normalizeOrderStatusValue(status)
      ) {
        error.value
          = 'Đơn hàng đã ở trạng thái cuối, không thể thay đổi trạng thái.'
        return
      }

      const managedState = resolveManagedOrderState(
        order,
        status,
        normalizePaymentStatusValue(order.paymentStatus),
      )
      await adminApi.updateOrder(order.id, {
        status: managedState.status,
        paymentStatus: managedState.paymentStatus,
      })
      await loadOrders()
    } catch (error_) {
      error.value = error_?.message || 'Không thể cập nhật trạng thái đơn hàng.'
    }
  }

  async function restoreOrder (order) {
    try {
      await adminApi.restoreOrder(order.id, order.status, order.paymentStatus)
      const restoredId = Number(order?.id)
      hiddenOrders.value = hiddenOrders.value.filter(
        hidden => Number(hidden.id) !== restoredId,
      )
      await loadOrders()
    } catch {
      error.value = 'Không thể khôi phục đơn hàng.'
    }
  }

  async function restoreAllHiddenOrders () {
    try {
      for (const order of hiddenOrders.value) {
        await adminApi.restoreOrder(order.id, order.status, order.paymentStatus)
      }
      hiddenOrders.value = []
      await loadOrders()
    } catch {
      error.value = 'Có lỗi xảy ra khi khôi phục.'
    }
  }

  async function loadOrders (silent = false) {
    if (!silent) {
      loading.value = true
      error.value = ''
    }
    try {
      const data = await adminApi.getOrders({ page: 0, size: 250 })
      const newOrdersList = Array.isArray(data) ? data : []

      if (!isFirstLoad.value && newOrdersList.length > 0) {
        // Check for new return requests
        const oldPendingReturn = orders.value.filter(o => o.status === 'RETURN_REQUEST').length
        const newPendingReturn = newOrdersList.filter(o => o.status === 'RETURN_REQUEST').length
        if (newPendingReturn > oldPendingReturn) {
          newOrderToast.value = {
            title: 'Có yêu cầu hoàn hàng mới!',
            message: `Khách hàng đã gửi yêu cầu hoàn tiền/trả hàng. Vui lòng kiểm tra và xử lý.`,
          }
          setTimeout(() => {
            newOrderToast.value = null
          }, 5000)
        }

        // Check for new orders
        const oldLatestId = orders.value.length > 0 ? orders.value[0].id : 0
        const newLatestId = newOrdersList[0].id
        if (newLatestId > oldLatestId) {
          newOrderToast.value = {
            title: 'Có đơn hàng mới!',
            message: `Khách hàng ${newOrdersList[0].fullname || newOrdersList[0].fullName || 'mới'} vừa đặt đơn #${newLatestId}.`,
          }
          setTimeout(() => {
            newOrderToast.value = null
          }, 5000)
        }
      }

      orders.value = newOrdersList
      isFirstLoad.value = false
    } catch (error_) {
      console.error('Failed to load admin orders:', error_)
      if (!silent) error.value = 'Không thể tải đơn hàng. Vui lòng kiểm tra backend API.'
    } finally {
      if (!silent) loading.value = false
    }
  }

  onMounted(() => {
    loadOrders()
    pollingInterval = setInterval(() => {
      loadOrders(true)
    }, 10_000) // Poll every 10 seconds
  })
  onUnmounted(() => {
    if (pollingInterval) clearInterval(pollingInterval)
  })
</script>

<style scoped>
@keyframes slideInUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
.animate-slide-in-up {
  animation: slideInUp 0.3s ease-out forwards;
}

.admin-orders-table-scroll {
  scrollbar-width: thin;
  scrollbar-color: #c66231 transparent;
}

.admin-orders-table-scroll::-webkit-scrollbar {
  height: 10px;
}

.admin-orders-table-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.admin-orders-table-scroll::-webkit-scrollbar-thumb {
  border: 3px solid transparent;
  background-clip: content-box;
  border-radius: 999px;
  background: #c66231;
}

.admin-orders-table-scroll::-webkit-scrollbar-thumb:hover {
  background: #a94f24;
}

.admin-orders-table tbody tr:hover > td {
  background-color: #f8fafc;
}

:global(.dark) .admin-orders-table-scroll {
  scrollbar-color: #c66231 transparent;
}

:global(.dark) .admin-orders-table-scroll::-webkit-scrollbar-track {
  background: transparent;
}

:global(.dark) .admin-orders-table-scroll::-webkit-scrollbar-thumb {
  border-color: transparent;
}

:global(.dark) .admin-orders-table tbody tr:hover > td {
  background-color: rgba(255, 255, 255, 0.05);
}
</style>
