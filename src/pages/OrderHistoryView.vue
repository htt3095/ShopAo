<template>
  <div class="retail-shell min-h-screen">
    <MainTopBar />

    <main
      class="mx-auto flex w-full max-w-[1240px] flex-col gap-8 px-4 py-10 md:px-8 xl:px-10"
    >
      <section class="retail-card px-5 py-5 sm:px-6 lg:px-7">
        <div
          class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between"
        >
          <div class="max-w-2xl">
            <div class="flex flex-wrap items-center gap-3">
              <span class="retail-kicker">Đơn hàng của bạn</span>
              <span
                class="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700"
              >
                <span class="material-symbols-outlined text-[16px]">schedule</span>
                {{ processingCount }} đang xử lý
              </span>
            </div>

            <div class="mt-4 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1
                  class="retail-heading text-3xl leading-tight text-slate-900 sm:text-4xl"
                >
                  Lịch sử mua sắm
                </h1>
                <p class="mt-2 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                  Xem nhanh trạng thái đơn, thanh toán và tổng chi tiêu mà không
                  phải cuộn qua một phần giới thiệu quá lớn.
                </p>
              </div>

              <div class="flex flex-wrap gap-3">
                <router-link
                  class="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary"
                  to="/profile"
                >
                  <span class="material-symbols-outlined text-[18px]">person</span>
                  Quay lại tài khoản
                </router-link>
                <router-link
                  class="inline-flex items-center gap-2 rounded-full bg-primary-white transition-colors hover:bg-[#a84f24]"
                  to="/shop"
                >
                  <span class="material-symbols-outlined text-[18px]">storefront</span>
                  Tiếp tục mua sắm
                </router-link>
              </div>
            </div>
          </div>

          <div class="grid flex-1 gap-3 sm:grid-cols-3 lg:max-w-[560px] lg:min-w-[420px]">
            <article class="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
              <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                Tổng đơn
              </p>
              <p class="mt-2 text-3xl font-bold leading-none text-slate-900">
                {{ totalOrders }}
              </p>
            </article>
            <article class="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
              <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                Đã giao
              </p>
              <p class="mt-2 text-3xl font-bold leading-none text-slate-900">
                {{ deliveredCount }}
              </p>
            </article>
            <article class="rounded-[20px] border border-slate-200 bg-slate-50 p-4 sm:col-span-3 lg:col-span-1">
              <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                Tổng chi
              </p>
              <p
                class="mt-2 break-words text-lg font-bold leading-snug text-slate-900 sm:text-xl"
                :title="formatMoney(totalSpent)"
              >
                {{ formatMoney(totalSpent) }}
              </p>
            </article>
          </div>
        </div>
      </section>

      <section v-if="isLoading" class="retail-card py-20 text-center">
        <div
          class="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-primary"
        />
        <p class="text-lg font-semibold text-slate-700 ">
          Đang tải lịch sử đơn hàng...
        </p>
      </section>

      <section v-else-if="errorMessage" class="retail-card py-20 text-center">
        <span class="material-symbols-outlined text-6xl text-red-400 opacity-50">error</span>
        <p class="mt-4 text-lg font-semibold text-red-600 ">
          {{ errorMessage }}
        </p>
        <button
          class="mt-5 rounded-full bg-primary-white transition-colors hover:bg-[#a84f24]"
          type="button"
          @click="loadOrders"
        >
          Tải lại
        </button>
      </section>

      <section
        v-else-if="orders.length === 0"
        class="retail-card py-20 text-center"
      >
        <span
          class="material-symbols-outlined text-6xl text-slate-400 opacity-50"
        >inventory_2</span>
        <p class="mt-4 text-lg font-semibold text-slate-700 ">
          Bạn chưa có đơn hàng nào.
        </p>
        <p class="mt-2 text-sm text-slate-500 ">
          Hãy bắt đầu từ Shop hoặc vào trang chỉnh sửa hồ sơ để quản lý nhanh.
        </p>
        <div class="mt-6 flex flex-wrap justify-center gap-3">
          <router-link
            class="rounded-full bg-primary-white transition-colors hover:bg-[#a84f24]"
            to="/shop"
          >
            Đi tới Shop
          </router-link>
          <router-link
            class="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary  "
            to="/profile/edit"
          >
            Mở hồ sơ
          </router-link>
        </div>
      </section>

      <section v-else class="space-y-5">
        <div class="flex flex-col gap-3 rounded-[20px] border border-slate-200/70 bg-white/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Hiển thị đơn hàng
            </p>
            <p class="mt-1 text-sm text-slate-700">
              {{ paginationLabel }}
            </p>
          </div>

          <div class="flex items-center gap-2 self-start sm:self-auto">
            <button
              class="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="currentPage === 1"
              type="button"
              @click="goToPreviousPage"
            >
              <span class="material-symbols-outlined text-[18px]">chevron_left</span>
              Trước
            </button>
            <span class="rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
              Trang {{ currentPage }}/{{ totalPages }}
            </span>
            <button
              class="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="currentPage === totalPages"
              type="button"
              @click="goToNextPage"
            >
              Sau
              <span class="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>

        <article class="retail-card hidden overflow-hidden p-0 md:block">
          <div class="overflow-x-auto">
            <table class="min-w-full text-left">
              <thead
                class="border-b border-slate-200 bg-[#f7efe6]  "
              >
                <tr>
                  <th
                    class="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 "
                  >
                    STT
                  </th>
                  <th
                    class="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 "
                  >
                    Sản phẩm
                  </th>
                  <th
                    class="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 "
                  >
                    Ngày đặt
                  </th>
                  <th
                    class="px-5 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 "
                  >
                    Trạng thái đơn
                  </th>
                  <th
                    class="px-5 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 "
                  >
                    Thanh toán
                  </th>
                  <th
                    class="px-5 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 "
                  >
                    Thành tiền
                  </th>
                  <th
                    class="px-5 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 "
                  >
                    Chi tiết
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200/70 ">
                <tr
                  v-for="(order, index) in paginatedOrders"
                  :key="order.id || `${order.createdAt}-${order.finalAmount}`"
                  class="transition-colors hover:bg-[#fbf4ec] :bg-[#2a231f]"
                >
                  <td
                    class="px-5 py-4 text-sm font-bold text-slate-900 "
                  >
                    {{ paginationStartIndex + index + 1 }}
                  </td>
                  <td
                    class="px-5 py-4 text-sm font-medium text-slate-900 "
                  >
                    {{ getOrderProductPreview(order) }}
                  </td>
                  <td
                    class="px-5 py-4 text-sm text-slate-600 "
                  >
                    {{ formatDate(order.createdAt) }}
                  </td>
                  <td class="px-5 py-4 text-center">
                    <span
                      class="inline-flex items-center justify-center min-w-[100px] rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em]"
                      :class="getStatusMeta(order.status).className"
                    >
                      {{ getStatusMeta(order.status).label }}
                    </span>
                  </td>
                  <td class="px-5 py-4 text-center">
                    <span
                      class="inline-flex flex-col items-center justify-center min-w-[140px] rounded-md px-2.5 py-1.5 leading-tight"
                      :class="getPaymentMeta(order.paymentStatus).className"
                    >
                      <span class="text-[11px] font-semibold uppercase tracking-[0.06em] whitespace-nowrap">{{ getPaymentMeta(order.paymentStatus).label }}</span>
                      <span v-if="!isRefundedPaymentStatus(order.paymentStatus)" class="mt-0.5 flex items-center justify-center gap-1 text-[10px] font-medium opacity-90 whitespace-nowrap">
                        <span class="material-symbols-outlined text-[13px] !leading-none">account_balance_wallet</span>
                        {{ getPaymentMethodShort(order) }}
                      </span>
                    </span>
                  </td>
                  <td
                    class="px-5 py-4 text-right text-sm font-bold text-slate-900 "
                  >
                    {{ formatMoney(order.finalAmount) }}
                  </td>
                  <td class="px-5 py-4 text-right whitespace-nowrap">
                    <button
                      class="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
                      :disabled="isDetailLoading"
                      type="button"
                      @click="openOrderDetailsFromList(order)"
                    >
                      <span class="material-symbols-outlined text-[15px]">visibility</span>
                      Xem
                    </button>

                    <button
                      v-if="['NEW', 'PENDING'].includes(order.status) && (order.paymentStatus === 'PENDING' || order.paymentStatus === 'FAILED') && isVnPay(order)"
                      class="ml-2 inline-flex items-center gap-1 rounded-full bg-primary text-white px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                      :disabled="isRepaying"
                      type="button"
                      @click="handleRepayVnpay(order)"
                    >
                      <span class="material-symbols-outlined text-[15px]">payment</span>
                      Thanh toán lại
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <article class="space-y-3 md:hidden">
          <div
            v-for="(order, index) in paginatedOrders"
            :key="order.id || `${order.createdAt}-${order.finalAmount}`"
            class="retail-card p-4"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <p
                  class="text-xs uppercase tracking-[0.14em] text-slate-500 "
                >
                  STT
                </p>
                <p
                  class="mt-1 text-sm font-bold text-slate-900 "
                >
                  {{ paginationStartIndex + index + 1 }}
                </p>
              </div>
              <span
                class="inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em]"
                :class="getStatusMeta(order.status).className"
              >
                {{ getStatusMeta(order.status).label }}
              </span>
            </div>

            <div class="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p
                  class="text-xs uppercase tracking-[0.14em] text-slate-500 "
                >
                  Ngày đặt
                </p>
                <p class="mt-1 text-slate-700 ">
                  {{ formatDate(order.createdAt) }}
                </p>
              </div>
              <div>
                <p
                  class="text-xs uppercase tracking-[0.14em] text-slate-500 "
                >
                  Thanh toán
                </p>
                <div class="mt-1">
                  <span
                    class="inline-flex flex-col items-center justify-center rounded-md px-2.5 py-1.5 leading-tight"
                    :class="getPaymentMeta(order.paymentStatus).className"
                  >
                    <span class="text-[11px] font-semibold uppercase tracking-[0.06em] whitespace-nowrap">{{ getPaymentMeta(order.paymentStatus).label }}</span>
                    <span v-if="!isRefundedPaymentStatus(order.paymentStatus)" class="mt-0.5 flex items-center justify-center gap-1 text-[10px] font-medium opacity-90 whitespace-nowrap">
                      <span class="material-symbols-outlined text-[13px] !leading-none">account_balance_wallet</span>
                      {{ getPaymentMethodShort(order) }}
                    </span>
                  </span>
                </div>
              </div>
              <div class="col-span-2">
                <p
                  class="text-xs uppercase tracking-[0.14em] text-slate-500 "
                >
                  Sản phẩm
                </p>
                <p class="mt-1 text-slate-700 ">
                  {{ getOrderProductPreview(order) }}
                </p>
              </div>
            </div>

            <div
              class="mt-4 border-t border-slate-200/70 pt-3 text-right "
            >
              <p
                class="text-xs uppercase tracking-[0.14em] text-slate-500 "
              >
                Thành tiền
              </p>
              <p
                class="mt-1 text-base font-bold text-slate-900 "
              >
                {{ formatMoney(order.finalAmount) }}
              </p>
            </div>

            <button
              class="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="isDetailLoading"
              type="button"
              @click="openOrderDetailsFromList(order)"
            >
              <span class="material-symbols-outlined text-[18px]">receipt_long</span>
              Xem chi tiết đơn
            </button>
            <button
              v-if="['NEW', 'PENDING'].includes(order.status) && (order.paymentStatus === 'PENDING' || order.paymentStatus === 'FAILED') && isVnPay(order)"
              class="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary text-white px-3 py-2 text-sm font-semibold transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="isRepaying"
              type="button"
              @click="handleRepayVnpay(order)"
            >
              <span class="material-symbols-outlined text-[18px]">payment</span>
              Thanh toán lại VNPay
            </button>
          </div>
        </article>

        <div v-if="totalPages > 1" class="flex justify-center">
          <div class="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-3 shadow-sm">
            <button
              class="inline-flex size-10 items-center justify-center rounded-full border border-slate-300 text-slate-700 transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="currentPage === 1"
              type="button"
              @click="goToPreviousPage"
            >
              <span class="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>

            <button
              v-for="page in visiblePageNumbers"
              :key="page"
              class="inline-flex size-10 items-center justify-center rounded-full text-sm font-semibold transition-colors"
              :class="page === currentPage ? 'bg-primary text-white' : 'border border-slate-300 text-slate-700 hover:border-primary hover:text-primary'"
              type="button"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>

            <button
              class="inline-flex size-10 items-center justify-center rounded-full border border-slate-300 text-slate-700 transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="currentPage === totalPages"
              type="button"
              @click="goToNextPage"
            >
              <span class="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </section>

      <transition name="fade-scale">
        <div
          v-if="isDetailOpen"
          class="fixed inset-0 z-[120] flex items-center justify-center px-4 py-6"
        >
          <button
            aria-label="Đóng chi tiết đơn hàng"
            class="absolute inset-0 bg-black/45 backdrop-blur-sm"
            type="button"
            @click="closeOrderDetails"
          />

          <article
            class="relative w-full max-w-3xl overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-2xl  "
          >
            <header
              class="flex items-start justify-between gap-3 border-b border-slate-200 px-6 py-5 "
            >
              <div>
                <p
                  class="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary"
                >
                  Chi tiết đơn hàng
                </p>
                <h3
                  class="mt-2 text-lg font-bold text-slate-900 "
                >
                  {{ getOrderDisplayLabel(activeDetailOrder) }}
                </h3>
              </div>
              <button
                class="inline-flex size-9 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition-colors hover:border-primary hover:text-primary  "
                type="button"
                @click="closeOrderDetails"
              >
                <span class="material-symbols-outlined text-[18px]">close</span>
              </button>
            </header>

            <div class="max-h-[72vh] overflow-y-auto px-6 py-5">
              <div v-if="isDetailLoading" class="py-12 text-center">
                <div
                  class="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-primary"
                />
                <p
                  class="text-sm font-semibold text-slate-600 "
                >
                  Đang tải chi tiết đơn...
                </p>
              </div>

              <div v-else-if="activeDetailOrder" class="space-y-5">
                <div
                  v-if="detailError"
                  class="rounded-2xl border border-red-200 bg-red-50 px-4 py-5 text-sm text-red-700   "
                >
                  <p class="font-semibold">
                    Không thể tải đủ dữ liệu chi tiết từ server.
                  </p>
                  <p class="mt-1">{{ detailError }}</p>
                  <p class="mt-1">
                    Đang hiển thị thông tin tóm tắt hiện có của đơn hàng.
                  </p>
                </div>

                <div class="grid gap-3 sm:grid-cols-2">
                  <article
                    class="rounded-2xl border border-slate-200/70 bg-[#f7efe6] px-4 py-3  "
                  >
                    <p
                      class="text-[11px] uppercase tracking-[0.18em] text-slate-500 "
                    >
                      Ngày đặt
                    </p>
                    <p
                      class="mt-1 text-sm font-semibold text-slate-900 "
                    >
                      {{ formatDateTime(activeDetailOrder.createdAt) }}
                    </p>
                  </article>
                  <article
                    class="rounded-2xl border border-slate-200/70 bg-[#f7efe6] px-4 py-3  "
                  >
                    <p
                      class="text-[11px] uppercase tracking-[0.18em] text-slate-500 "
                    >
                      Trạng thái
                    </p>
                    <p
                      class="mt-1 text-sm font-semibold text-slate-900 "
                    >
                      {{ getStatusMeta(activeDetailOrder.status).label }}
                    </p>
                  </article>
                  <article
                    class="rounded-2xl border border-slate-200/70 bg-[#f7efe6] px-4 py-3  "
                  >
                    <p
                      class="text-[11px] uppercase tracking-[0.18em] text-slate-500 "
                    >
                      Thanh toán
                    </p>
                    <p
                      class="mt-1 text-sm font-semibold text-slate-900 "
                    >
                      {{ getPaymentMeta(activeDetailOrder.paymentStatus).label }}<template v-if="!isRefundedPaymentStatus(activeDetailOrder.paymentStatus)"> • {{ getPaymentMethodShort(activeDetailOrder) }}</template>
                    </p>
                  </article>
                  <article
                    class="rounded-2xl border border-slate-200/70 bg-[#f7efe6] px-4 py-3  "
                  >
                    <p
                      class="text-[11px] uppercase tracking-[0.18em] text-slate-500 "
                    >
                      Người nhận
                    </p>
                    <p
                      class="mt-1 text-sm font-semibold text-slate-900 "
                    >
                      {{ getOrderRecipient(activeDetailOrder) }}
                    </p>
                  </article>
                </div>

                <article
                  class="rounded-2xl border border-slate-200/70 bg-white px-4 py-4  "
                >
                  <p
                    class="text-[11px] uppercase tracking-[0.18em] text-slate-500 "
                  >
                    Địa chỉ giao hàng
                  </p>
                  <p
                    class="mt-2 text-sm leading-6 text-slate-700 "
                  >
                    {{ getOrderAddress(activeDetailOrder) }}
                  </p>
                </article>

                <article
                  class="rounded-2xl border border-slate-200/70 bg-white px-4 py-4  "
                >
                  <div class="mb-3 flex items-center justify-between">
                    <p
                      class="text-[11px] uppercase tracking-[0.18em] text-slate-500 "
                    >
                      Sản phẩm trong đơn
                    </p>
                    <span
                      class="text-xs font-semibold text-slate-500 "
                    >{{ detailItems.length }} mục</span>
                  </div>

                  <div v-if="detailItems.length > 0" class="space-y-2">
                    <div
                      v-for="item in detailItems"
                      :key="item.key"
                      class="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-xl border border-slate-200/70 px-3 py-3 "
                    >
                      <div>
                        <p
                          class="text-sm font-semibold text-slate-900 "
                        >
                          {{ item.productName }}
                        </p>
                        <p
                          class="mt-0.5 text-xs text-slate-500 "
                        >
                          Đơn giá {{ formatMoney(item.unitPrice) }}<span v-if="item.productCode && item.productCode !== '?'"> | Mã SP: {{ item.productCode }}</span>
                        </p>
                      </div>
                      <span
                        class="text-sm font-semibold text-slate-600 "
                      >x{{ item.quantity }}</span>
                      <span
                        class="text-sm font-bold text-slate-900 "
                      >{{ formatMoney(item.lineTotal) }}</span>
                    </div>
                  </div>

                  <p
                    v-else
                    class="rounded-xl border border-dashed border-slate-300 px-3 py-5 text-sm text-slate-500  "
                  >
                    Không có dữ liệu chi tiết sản phẩm cho đơn này.
                  </p>
                </article>

                <article
                  class="grid gap-3 rounded-2xl border border-slate-200/70 bg-[#f7efe6] p-4   sm:grid-cols-4"
                >
                  <div>
                    <p
                      class="text-[11px] uppercase tracking-[0.18em] text-slate-500 "
                    >
                      Tạm tính
                    </p>
                    <p
                      class="mt-1 text-sm font-semibold text-slate-900 "
                    >
                      {{ formatMoney(detailSubtotal) }}
                    </p>
                  </div>
                  <div>
                    <p
                      class="text-[11px] uppercase tracking-[0.18em] text-slate-500 "
                    >
                      Giảm giá
                    </p>
                    <p
                      class="mt-1 text-sm font-semibold text-green-600 "
                    >
                      -{{ formatMoney(detailDiscount) }}
                    </p>
                  </div>
                  <div>
                    <p
                      class="text-[11px] uppercase tracking-[0.18em] text-slate-500 "
                    >
                      Phí ship
                    </p>
                    <p
                      class="mt-1 text-sm font-semibold text-slate-900 "
                    >
                      {{ formatMoney(detailShippingFee) }}
                    </p>
                  </div>
                  <div>
                    <p
                      class="text-[11px] uppercase tracking-[0.18em] text-slate-500 "
                    >
                      Thành tiền
                    </p>
                    <p
                      class="mt-1 text-base font-bold text-slate-900 "
                    >
                      {{ formatMoney(getDetailFinalAmount(activeDetailOrder)) }}
                    </p>
                  </div>
                </article>

                <article
                  v-if="orderRejectReason"
                  class="rounded-2xl border border-red-200/70 bg-red-50 p-4 mb-3"
                >
                  <p class="text-[11px] uppercase tracking-[0.18em] text-red-600 font-semibold">
                    Yêu cầu trả hàng đã bị từ chối
                  </p>
                  <p class="mt-2 text-sm text-red-700 font-medium">
                    Lý do: {{ orderRejectReason }}
                  </p>
                </article>

                <article
                  v-if="activeDetailOrder.returnReason && !orderRejectReason"
                  class="rounded-2xl border border-orange-200/70 bg-orange-50 p-4  "
                >
                  <p class="text-[11px] uppercase tracking-[0.18em] text-orange-600 ">
                    Lý do trả hàng
                  </p>
                  <p class="mt-2 text-sm text-slate-700 ">
                    {{ returnReasonText(activeDetailOrder.returnReason) }}
                  </p>
                  <div v-if="activeDetailOrder.returnImages && activeDetailOrder.returnImages.length > 0" class="mt-3">
                    <p class="mb-1.5 text-xs font-semibold text-slate-500 ">Ảnh minh chứng</p>
                    <div class="flex flex-wrap gap-2">
                      <div
                        v-for="(img, idx) in activeDetailOrder.returnImages"
                        :key="idx"
                        class="size-16 cursor-pointer overflow-hidden rounded-lg border border-slate-200  transition-transform hover:scale-105"
                        @click="window.open(img, '_blank')"
                      >
                        <img class="h-full w-full object-cover" :src="img">
                      </div>
                    </div>
                  </div>
                </article>

                <article
                  class="rounded-2xl border border-slate-200/70 bg-white p-4  "
                >
                  <div
                    class="flex flex-wrap items-center justify-between gap-3"
                  >
                    <p
                      class="text-[11px] uppercase tracking-[0.18em] text-slate-500 "
                    >
                      Hành động đơn hàng
                    </p>
                    <button
                      v-if="canCancelActiveOrder"
                      class="inline-flex items-center gap-2 rounded-full border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60    :bg-red-900/20"
                      :disabled="isCancellingOrder || isConfirmingOrder"
                      type="button"
                      @click="promptCancelOrder"
                    >
                      <span class="material-symbols-outlined text-[18px]">cancel</span>
                      {{
                        isCancellingOrder ? "Đang hủy đơn..." : "Hủy đơn này"
                      }}
                    </button>
                    <button
                      v-if="canConfirmActiveOrder"
                      class="inline-flex items-center gap-2 rounded-full border border-green-300 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 transition-colors hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-60    :bg-green-900/20"
                      :disabled="isConfirmingOrder || isCancellingOrder"
                      type="button"
                      @click="promptConfirmOrder"
                    >
                      <span class="material-symbols-outlined text-[18px]">task_alt</span>
                      {{
                        isConfirmingOrder
                          ? "Đang xác nhận..."
                          : "Xác nhận đã nhận hàng"
                      }}
                    </button>
                    <button
                      v-if="canReturnActiveOrder"
                      class="inline-flex items-center gap-2 rounded-full border border-orange-300 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 transition-colors hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-60    :bg-orange-900/20"
                      :disabled="isReturningOrder"
                      type="button"
                      @click="promptReturnOrder"
                    >
                      <span class="material-symbols-outlined text-[18px]">assignment_return</span>
                      {{
                        isReturningOrder ? "Đang gửi yêu cầu..." : "Trả hàng"
                      }}
                    </button>
                    <span
                      v-if="!hasAvailableOrderAction"
                      class="text-xs font-medium text-slate-500 "
                    >Đơn này chưa có thao tác khả dụng.</span>
                  </div>

                  <p
                    v-if="cancelOrderMessage"
                    class="mt-3 text-sm"
                    :class="
                      isCancelOrderError
                        ? 'text-red-600 '
                        : 'text-green-600 '
                    "
                  >
                    {{ cancelOrderMessage }}
                  </p>
                  <p
                    v-if="confirmOrderMessage"
                    class="mt-3 text-sm"
                    :class="
                      isConfirmOrderError
                        ? 'text-red-600 '
                        : 'text-green-600 '
                    "
                  >
                    {{ confirmOrderMessage }}
                  </p>
                </article>
              </div>

              <div
                v-else
                class="rounded-2xl border border-slate-200 px-4 py-5 text-sm text-slate-600  "
              >
                Không có dữ liệu chi tiết cho đơn hàng này.
              </div>
            </div>
          </article>
        </div>
      </transition>

      <transition name="fade-scale">
        <div
          v-if="confirmModal.show"
          class="fixed inset-0 z-[150] flex items-center justify-center px-4 py-6"
        >
          <div
            class="absolute inset-0 bg-black/60 backdrop-blur-sm"
            @click="!confirmModal.isLoading && (confirmModal.show = false)"
          />

          <div
            class="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-2xl  "
          >
            <div
              class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
              :class="
                confirmModal.type === 'cancel'
                  ? 'bg-red-500/10 text-red-500'
                  : 'bg-green-500/10 text-green-500'
              "
            >
              <span class="material-symbols-outlined text-4xl">{{
                confirmModal.type === "cancel" ? "warning" : "task_alt"
              }}</span>
            </div>

            <h3
              class="mb-2 text-xl font-bold tracking-tight text-slate-900 "
            >
              {{ confirmModal.title }}
            </h3>
            <p class="mb-6 text-sm text-slate-500 ">
              {{ confirmModal.message }}
            </p>

            <div v-if="confirmModal.type === 'return'" class="mb-6 text-left">
              <label class="mb-2 block text-sm font-semibold text-slate-700 ">Lý do hoàn hàng <span class="text-red-500">*</span></label>
              <textarea
                v-model="confirmModal.returnReason"
                class="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:border-primary focus:outline-none    :border-primary"
                placeholder="Vui lòng mô tả chi tiết lý do bạn muốn hoàn hàng..."
                rows="3"
              />
              <label class="mt-4 mb-2 block text-sm font-semibold text-slate-700 ">
                Ảnh minh chứng <span class="text-xs font-normal text-slate-400">(tùy chọn, tối đa 5 ảnh)</span>
              </label>
              <div class="flex flex-wrap gap-2 mb-2">
                <div
                  v-for="(img, idx) in confirmModal.returnImagePreviews"
                  :key="idx"
                  class="group relative size-16 overflow-hidden rounded-lg border border-slate-300 "
                >
                  <img class="h-full w-full object-cover" :src="img">
                  <button
                    class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                    type="button"
                    @click="removeReturnImage(idx)"
                  >
                    <span class="material-symbols-outlined text-slate-900 text-base">close</span>
                  </button>
                </div>
                <label
                  v-if="(confirmModal.returnImagePreviews || []).length < 5"
                  class="flex size-16 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-slate-300 text-slate-400 transition-colors hover:border-primary hover:text-primary  :border-primary"
                >
                  <span class="material-symbols-outlined text-xl">add_photo_alternate</span>
                  <input
                    accept="image/*"
                    class="hidden"
                    multiple
                    type="file"
                    @change="onReturnImageSelect"
                  >
                </label>
              </div>
            </div>

            <div class="flex gap-3">
              <button
                class="flex-1 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200   :bg-[#3c342e]"
                :disabled="confirmModal.isLoading"
                @click="confirmModal.show = false"
              >
                Đóng
              </button>
              <button
                class="flex-1 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 transition disabled:opacity-50"
                :class="
                  confirmModal.type === 'cancel'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                "
                :disabled="confirmModal.isLoading"
                @click="executeModalAction"
              >
                {{
                  confirmModal.isLoading
                    ? "Đang xử lý..."
                    : confirmModal.confirmText
                }}
              </button>
            </div>
          </div>
        </div>
      </transition>
    </main>
  </div>
</template>

<script setup>
  import axios from 'axios'
  import { computed, onMounted, reactive, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import MainTopBar from '@/components/MainTopBar.vue'
  import { orderAPI, orderUtils } from '@/services/orders'

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

  const route = useRoute()
  const router = useRouter()
  const currentUser = ref(null)
  const orders = ref([])
  const currentPage = ref(1)
  const isLoading = ref(false)
  const errorMessage = ref('')
  const isDetailOpen = ref(false)
  const isDetailLoading = ref(false)
  const detailError = ref('')
  const selectedOrder = ref(null)
  const selectedOrderDetail = ref(null)
  const isCancellingOrder = ref(false)
  const cancelOrderMessage = ref('')
  const isCancelOrderError = ref(false)
  const isConfirmingOrder = ref(false)
  const confirmOrderMessage = ref('')
  const isConfirmOrderError = ref(false)
  const isReturningOrder = ref(false)

  // Trạng thái trả hàng
  const canReturnActiveOrder = computed(() => {
    if (!activeDetailOrder.value || isDetailLoading.value) {
      return false
    }
    const category = getOrderStatusCategory(activeDetailOrder.value.status)
    return category === 'delivered' || category === 'completed'
  })

  const hasAvailableOrderAction = computed(
    () =>
      canCancelActiveOrder.value
      || canConfirmActiveOrder.value
      || canReturnActiveOrder.value,
  )

  // Trạng thái cho Modal Xác nhận
  const confirmModal = reactive({
    show: false,
    type: 'cancel', // 'cancel' | 'confirm' | 'return'
    title: '',
    message: '',
    confirmText: '',
    isLoading: false,
    returnReason: '',
    returnImageFiles: [],
    returnImagePreviews: [],
  })

  const totalOrders = computed(() => orders.value.length)
  const ordersPerPage = 6
  const totalPages = computed(() =>
    Math.max(1, Math.ceil(orders.value.length / ordersPerPage)),
  )
  const paginationStartIndex = computed(
    () => (currentPage.value - 1) * ordersPerPage,
  )
  const paginatedOrders = computed(() =>
    orders.value.slice(
      paginationStartIndex.value,
      paginationStartIndex.value + ordersPerPage,
    ),
  )
  const paginationLabel = computed(() => {
    if (orders.value.length === 0) {
      return 'Chưa có đơn hàng nào để hiển thị.'
    }

    const start = paginationStartIndex.value + 1
    const end = Math.min(
      paginationStartIndex.value + paginatedOrders.value.length,
      orders.value.length,
    )
    return `Đơn ${start}-${end} trên tổng ${orders.value.length} đơn`
  })
  const visiblePageNumbers = computed(() => {
    const radius = 2
    const start = Math.max(1, currentPage.value - radius)
    const end = Math.min(totalPages.value, currentPage.value + radius)
    return Array.from({ length: end - start + 1 }, (_, index) => start + index)
  })
  const deliveredCount = computed(
    () =>
      orders.value.filter(
        order => {
          const category = getOrderStatusCategory(order.status)
          return category === 'delivered' || category === 'completed'
        },
      ).length,
  )
  const processingCount = computed(
    () =>
      orders.value.filter(
        order => getOrderStatusCategory(order.status) === 'processing',
      ).length,
  )
  const totalSpent = computed(() =>
    orders.value.reduce((sum, order) => {
      if (!isPaidPaymentStatus(order.paymentStatus)) {
        return sum
      }
      return sum + Number(order.finalAmount || 0)
    }, 0),
  )
  const routeOrderId = computed(() => {
    const id = Number(route.params.id)
    return Number.isFinite(id) ? id : null
  })
  const activeDetailOrder = computed(() => {
    if (
      selectedOrderDetail.value
      && typeof selectedOrderDetail.value === 'object'
    ) {
      return selectedOrderDetail.value
    }

    if (selectedOrder.value && typeof selectedOrder.value === 'object') {
      return selectedOrder.value
    }

    return null
  })

  const orderRejectReason = computed(() => {
    if (!activeDetailOrder.value || activeDetailOrder.value.status !== 'SUCCESS') return null;
    
    // Check if rejectReason exists directly on the order
    if (activeDetailOrder.value.rejectReason) return activeDetailOrder.value.rejectReason;
    
    // Check inside returnReason if it's a JSON string
    if (activeDetailOrder.value.returnReason && typeof activeDetailOrder.value.returnReason === 'string' && activeDetailOrder.value.returnReason.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(activeDetailOrder.value.returnReason.trim());
        if (parsed && parsed.rejectReason) {
          return parsed.rejectReason;
        }
      } catch (e) {}
    }
    return null;
  })
  const canCancelActiveOrder = computed(() => {
    if (!activeDetailOrder.value || isDetailLoading.value) {
      return false
    }
    return isCancelableOrderStatus(activeDetailOrder.value.status)
  })
  const canConfirmActiveOrder = computed(() => {
    if (!activeDetailOrder.value || isDetailLoading.value) {
      return false
    }
    return getOrderStatusCategory(activeDetailOrder.value.status) === 'delivered'
  })
  const detailItems = computed(() =>
    normalizeOrderDetailItems(activeDetailOrder.value),
  )
  const detailShippingFee = computed(() =>
    Math.max(
      0,
      getOrderAmount(
        activeDetailOrder.value,
        ['shippingFee', 'shipping_fee'],
        0,
      ),
    ),
  )
  const detailDiscount = computed(() =>
    Math.min(
      detailSubtotal.value,
      Math.max(
        0,
        getOrderAmount(
          activeDetailOrder.value,
          ['discountAmount', 'discount_amount'],
          0,
        ),
      ),
    ),
  )
  const detailSubtotal = computed(() => {
    const explicitSubtotal = getOrderAmount(
      activeDetailOrder.value,
      [
        'subtotalAmount',
        'subtotal_amount',
        'totalMoney',
        'total_money',
        'totalAmount',
        'total_amount',
      ],
      Number.NaN,
    )

    if (Number.isFinite(explicitSubtotal) && explicitSubtotal > 0) {
      return explicitSubtotal
    }

    return detailItems.value.reduce((sum, item) => sum + item.lineTotal, 0)
  })

  function getAccountId (user) {
    const source = user && typeof user === 'object' ? user : {}
    const value
      = source.id !== undefined && source.id !== null
        ? source.id
        : (source.accountId !== undefined && source.accountId !== null
          ? source.accountId
          : source.account_id)

    const n = Number(value)
    return Number.isFinite(n) ? n : null
  }

  function normalizeStatusKey (status) {
    return String(status || '')
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036F]/g, '')
      .replace(/\s+/g, '_')
      .replace(/-/g, '_')
      .toUpperCase()
  }

  function isActivelyProcessingStatus (status) {
    const key = normalizeStatusKey(status)
    if (!key) return false

    return (
      key.includes('SHIP')
      || key.includes('TRANSIT')
      || key === 'PROCESSING'
      || key === 'CONFIRMED'
      || key === 'DANG_XU_LY'
      || key === 'XAC_NHAN'
      || key === 'IN_PROGRESS'
      || key === 'IN-PROGRESS'
    )
  }

  function isWaitingForProcessingStatus (status) {
    const key = normalizeStatusKey(status)
    if (!key) return false

    if (
      key.includes('DELIVER')
      || key.includes('SHIP')
      || key.includes('TRANSIT')
      || key.includes('RETURN')
      || key.includes('REFUND')
      || key.includes('CANCEL')
      || key.includes('FAIL')
      || key.includes('REJECT')
    ) {
      return false
    }

    return (
      key === 'PENDING'
      || key === 'CREATED'
      || key === 'WAITING'
      || key === 'CHUA_XU_LY'
      || key === 'CHO_XU_LY'
      || key === 'NEW'
      || key === 'AWAITING_PAYMENT'
      || key === 'AWAITING_CONFIRMATION'
      || key.includes('PEND')
      || key.includes('WAIT')
      || key.includes('AWAIT')
    )
  }

  function isCancelableOrderStatus (status) {
    const key = normalizeStatusKey(status)
    return (
      key === 'NEW'
      || key === 'PENDING'
      || key === 'WAITING'
      || key === 'CHUA_XU_LY'
      || key === 'CHO_XU_LY'
      || key === 'CONFIRMED'
      || key === 'PROCESSING'
      || key === 'DANG_XU_LY'
      || key === 'XAC_NHAN'
      || key === 'IN_PROGRESS'
    )
  }

  function getOrderStatusCategory (status) {
    const key = normalizeStatusKey(status)

    if (key === 'DELIVERED' || key === 'DA_GIAO' || key === 'GIAO_THANH_CONG') {
      return 'delivered'
    }

    if (
      key.includes('RECEIV')
      || key.includes('SUCCESS')
      || key.includes('COMPLETE')
      || key === 'THANH_CONG'
      || key === 'HOAN_THANH'
    ) {
      return 'completed'
    }

    if (
      key.includes('SHIP')
      || key.includes('TRANSIT')
      || key === 'DANG_GIAO'
    ) {
      return 'shipping'
    }

    if (
      key === 'DELIVERY_FAILED'
      || key === 'FAILED_DELIVERY'
      || key === 'GIAO_THAT_BAI'
      || key === 'UNDELIVERED'
    ) {
      return 'deliveryFailed'
    }

    if (key === 'DAMAGED' || key === 'HANG_HONG' || key === 'HANG_HONG_HONG') {
      return 'damaged'
    }

    if (key === 'LOST' || key === 'THAT_LAC' || key === 'PARCEL_LOST' || key === 'HANG_MAT' || key === 'MAT_HANG') {
      return 'lost'
    }

    if (
      key.includes('CANCEL')
      || key.includes('FAIL')
      || key.includes('REJECT')
      || key === 'DA_HUY'
      || key === 'HUY'
    ) {
      return 'cancelled'
    }

    if (
      key === 'RETURN_REQUEST'
      || key === 'YEU_CAU_TRA'
    ) {
      return 'return_request'
    }

    if (key === 'RETURN_APPROVED') {
      return 'return_approved'
    }

    if (
      key.includes('RETURNING')
      || key === 'TRA_HANG'
      || key === 'DANG_HOAN'
      || key === 'DANG_TRA_HANG'
    ) {
      return 'returning'
    }

    if (
      key.includes('RETURN')
      || key.includes('REFUND')
      || key === 'HOAN_TRA'
      || key === 'HOAN_TIEN'
      || key === 'RETURNED'
      || key === 'HOAN_HANG'
    ) {
      return 'returned'
    }

    return 'processing'
  }

  function getStatusMeta (status) {
    const category = getOrderStatusCategory(status)

    if (category === 'delivered') {
      return {
        label: 'Đã giao',
        className:
          'bg-teal-500 text-white shadow-sm',
      }
    }

    if (category === 'completed') {
      return {
        label: 'Thành công',
        className:
          'bg-green-500 text-white shadow-sm',
      }
    }

    if (category === 'shipping') {
      return {
        label: 'Đang giao',
        className:
          'bg-blue-500 text-white shadow-sm',
      }
    }

    if (category === 'cancelled') {
      return {
        label: 'Đã hủy',
        className: 'bg-red-500 text-white shadow-sm',
      }
    }

    if (category === 'deliveryFailed') {
      return {
        label: 'Giao thất bại',
        className:
          'bg-rose-500 text-white shadow-sm',
      }
    }

    if (category === 'damaged') {
      return {
        label: 'Hàng hỏng',
        className:
          'bg-red-500 text-white shadow-sm',
      }
    }

    if (category === 'lost') {
      return {
        label: 'Hàng mất',
        className:
          'bg-red-500 text-white shadow-sm',
      }
    }

    if (category === 'return_request') {
      return {
        label: 'Yêu cầu hoàn',
        className: 'bg-orange-500 text-white shadow-sm',
      }
    }

    if (category === 'return_approved') {
      return {
        label: 'Đã duyệt hoàn',
        className: 'bg-orange-500 text-white shadow-sm',
      }
    }

    if (category === 'returning') {
      return {
        label: 'Đang hoàn về',
        className:
          'bg-orange-500 text-white shadow-sm',
      }
    }

    if (category === 'returned') {
      return {
        label: 'Đã hoàn trả',
        className:
          'bg-slate-500 text-white shadow-sm',
      }
    }

    if (category === 'processing') {
      return {
        label: 'Đang xử lý',
        className:
          'bg-blue-500 text-white shadow-sm',
      }
    }

    return {
      label: 'Chờ xử lý',
      className:
        'bg-amber-500 text-white shadow-sm',
    }
  }

  function isRefundedPaymentStatus (paymentStatus) {
    const key = normalizeStatusKey(paymentStatus)
    return (
      key === 'REFUNDED'
      || key === 'REFUND'
      || key === 'HOAN_TIEN'
      || key === 'CHARGEBACK'
      || key === 'REVERSED'
    )
  }

  function getPaymentMeta (paymentStatus) {
    const key = normalizeStatusKey(paymentStatus)
    if (key === 'PAID') {
      return {
        label: 'Đã thanh toán',
        className:
          'bg-green-500 text-white shadow-sm',
      }
    }

    if (isRefundedPaymentStatus(paymentStatus)) {
      return {
        label: 'Hoàn tiền',
        className:
          'bg-slate-500 text-white shadow-sm',
      }
    }

    return {
      label: 'Chưa thanh toán',
      className:
        'bg-amber-500 text-white shadow-sm',
    }
  }

  function getPaymentMethodLabel (orderLike) {
    if (!orderLike) return 'N/A'
    const name = orderLike.paymentMethod?.name
      || orderLike.payment_method?.name
      || orderLike.paymentMethodName
      || orderLike.payment_method_name

    if (name) return name

    const id = orderLike.paymentMethod?.id
      || orderLike.payment_method?.id
      || orderLike.paymentMethodId
      || orderLike.payment_method_id

    if (id === 1 || id === '1') return 'Thanh toán khi nhận hàng (COD)'
    if (id === 2 || id === '2') return 'Thanh toán VNPay'

    return 'Chưa xác định'
  }

  function getPaymentMethodShort (orderLike) {
    if (isVnPay(orderLike)) return 'VNPay'

    const id = orderLike?.paymentMethod?.id
      || orderLike?.payment_method?.id
      || orderLike?.paymentMethodId
      || orderLike?.payment_method_id

    if (id === 1 || id === '1') return 'COD'

    const name = orderLike?.paymentMethod?.name
      || orderLike?.payment_method?.name
      || orderLike?.paymentMethodName
      || orderLike?.payment_method_name

    if (name && (name.toLowerCase().includes('nhận hàng') || name.toLowerCase().includes('cod'))) return 'COD'

    return name || 'N/A'
  }

  function isVnPay (orderLike) {
    if (!orderLike) return false
    const id = orderLike.paymentMethod?.id
      || orderLike.payment_method?.id
      || orderLike.paymentMethodId
      || orderLike.payment_method_id

    if (id === 2 || id === '2') return true

    const name = orderLike.paymentMethod?.name
      || orderLike.payment_method?.name
      || orderLike.paymentMethodName
      || orderLike.payment_method_name

    return name && (name.toLowerCase().includes('vnpay') || name.toLowerCase().includes('ví điện tử'))
  }

  function isPaidPaymentStatus (paymentStatus) {
    const key = normalizeStatusKey(paymentStatus)
    return (
      key === 'PAID'
      || key === 'DA_THANH_TOAN'
      || key === 'SETTLED'
      || key === 'CAPTURED'
    )
  }

  function formatDate (value) {
    if (!value) return '--'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '--'
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date)
  }

  function formatDateTime (value) {
    if (!value) return '--'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '--'
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  function returnReasonText (raw) {
    if (!raw || typeof raw !== 'string') return raw || ''
    const clean = raw.trim()
    if (!clean.startsWith('{')) return clean
    try {
      const parsed = JSON.parse(clean)
      if (parsed && parsed.__type === 'RETURN_RECORD') {
        const lines = []
        if (parsed.reason) lines.push(parsed.reason)
        if (Array.isArray(parsed.items) && parsed.items.length > 0) {
          lines.push(`Trả ${parsed.items.length} món`)
        }
        if (Array.isArray(parsed.refunds) && parsed.refunds.length > 0) {
          lines.push('Đã hoàn tiền')
        }
        return lines.join(' · ') || 'Đơn đã có yêu cầu trả hoàn'
      }
    } catch {
      /* fallthrough */
    }
    return clean
  }

  function formatMoney (value) {
    return orderUtils.formatPrice(Number(value || 0))
  }

  function getOrderCreatedTime (order) {
    const source = order && typeof order === 'object' ? order : {}
    const dateValue
      = source.createdAt
        || source.created_at
        || source.orderDate
        || source.order_date
        || source.createdOn
        || source.created_on
    const date = new Date(dateValue || 0)
    return Number.isFinite(date.getTime()) ? date.getTime() : 0
  }

  function sortOrdersNewestFirst (list) {
    return Array.isArray(list)
      ? list.slice().sort((a, b) => {
        const timeA = getOrderCreatedTime(a)
        const timeB = getOrderCreatedTime(b)
        if (timeA !== timeB) {
          return timeB - timeA
        }
        return Number(b.id || 0) - Number(a.id || 0)
      })
      : []
  }

  function getOrderItems (order) {
    const source = order && typeof order === 'object' ? order : {}
    if (Array.isArray(source.orderItems)) return source.orderItems
    if (Array.isArray(source.order_items)) return source.order_items
    if (Array.isArray(source.items)) return source.items
    if (Array.isArray(source.orderDetails)) return source.orderDetails
    if (Array.isArray(source.order_details)) return source.order_details
    return []
  }

  function getOrderItemName (item) {
    const source = item && typeof item === 'object' ? item : {}
    const rawName = firstDefined([
      source.productName,
      source.product_name,
      source.name,
      source.itemName,
      source.item_name,
      source.variantName,
      source.variant_name,
      source.title,
      source.product && source.product.name,
      source.product && source.product.productName,
      source.product && source.product.product_name,
      source.variant && source.variant.name,
      source.variant && source.variant.productName,
      source.variant && source.variant.product_name,
    ])

    return rawName ? String(rawName).trim() : ''
  }

  function getOrderProductPreview (order) {
    const items = getOrderItems(order)

    if (items.length > 0) {
      const uniqueNames = []
      for (const item of items) {
        const name = getOrderItemName(item)
        if (name && !uniqueNames.includes(name)) {
          uniqueNames.push(name)
        }
      }

      if (uniqueNames.length === 1) {
        return uniqueNames[0]
      }

      if (uniqueNames.length > 1) {
        return `${uniqueNames[0]} +${uniqueNames.length - 1} sản phẩm`
      }
    }

    const source = order && typeof order === 'object' ? order : {}
    const orderLevelName = firstDefined([
      source.productName,
      source.product_name,
      source.name,
      source.itemName,
      source.item_name,
      source.title,
    ])

    if (orderLevelName) {
      const normalizedName = String(orderLevelName).trim()
      if (normalizedName) {
        return normalizedName
      }
    }

    return 'Không rõ sản phẩm'
  }

  function hasProductPreviewData (order) {
    const preview = getOrderProductPreview(order)
    return preview !== 'Không rõ sản phẩm'
  }

  async function enrichOrdersWithItemNames (orderList) {
    const source = Array.isArray(orderList) ? orderList.slice() : []
    if (source.length === 0) {
      return source
    }

    const details = await Promise.all(
      source.map(async order => {
        if (hasProductPreviewData(order)) {
          return null
        }

        const id = Number(order && order.id)
        if (!Number.isFinite(id)) {
          return null
        }

        try {
          return await orderAPI.getOrder(id)
        } catch (error) {
          console.warn('Không thể tải tên sản phẩm cho đơn hàng:', error)
          return null
        }
      }),
    )

    return source.map((order, index) => {
      const detail = details[index]
      if (!detail || typeof detail !== 'object') {
        return order
      }

      return {
        ...order,
        ...detail,
        id: order && order.id ? order.id : detail.id,
      }
    })
  }

  function firstDefined (values) {
    for (const value of values) {
      if (value !== null && value !== undefined && value !== '') {
        return value
      }
    }
    return null
  }

  function getOrderAmount (order, keys, fallback = 0) {
    const source = order && typeof order === 'object' ? order : {}
    const raw = firstDefined(keys.map(key => source[key]))
    const n = Number(raw)
    return Number.isFinite(n) ? n : fallback
  }

  function normalizeOrderDetailItems (order) {
    const source = order && typeof order === 'object' ? order : {}
    const rawItems = Array.isArray(source.orderItems)
      ? source.orderItems
      : Array.isArray(source.order_items)
        ? source.order_items
        : Array.isArray(source.items)
          ? source.items
          : Array.isArray(source.orderDetails)
            ? source.orderDetails
            : Array.isArray(source.order_details)
              ? source.order_details
              : []

    return rawItems.map((rawItem, index) => {
      const item = rawItem && typeof rawItem === 'object' ? rawItem : {}
      const variant
        = item.variant && typeof item.variant === 'object' ? item.variant : {}
      const product
        = item.product && typeof item.product === 'object' ? item.product : {}
      const quantityRaw = firstDefined([
        item.quantity,
        item.qty,
        item.amount,
        item.count,
        1,
      ])
      const quantityNumber = Number(quantityRaw)
      const quantity
        = Number.isFinite(quantityNumber) && quantityNumber > 0
          ? quantityNumber
          : 1

      const unitPriceRaw = firstDefined([
        item.price,
        item.unitPrice,
        item.unit_price,
        item.productPrice,
        item.product_price,
        item.variantPrice,
        item.variant_price,
        item.priceAtOrder,
        item.price_at_order,
        item.basePrice,
        item.base_price,
        item.salePrice,
        item.sale_price,
        variant.price,
        variant.salePrice,
        variant.sale_price,
        product.price,
        product.salePrice,
        product.sale_price,
      ])
      const unitPriceNumber = Number(unitPriceRaw)
      const parsedUnitPrice = Number.isFinite(unitPriceNumber)
        ? Math.max(0, unitPriceNumber)
        : Number.NaN

      const lineTotalRaw = firstDefined([
        item.lineTotal,
        item.line_total,
        item.totalPrice,
        item.total_price,
        item.subtotal,
        item.sub_total,
        item.totalMoney,
        item.total_money,
        item.totalAmount,
        item.total_amount,
        item.total,
        item.amountTotal,
        item.amount_total,
        item.finalAmount,
        item.final_amount,
      ])
      const lineTotalNumber = Number(lineTotalRaw)
      const parsedLineTotal = Number.isFinite(lineTotalNumber)
        ? Math.max(0, lineTotalNumber)
        : Number.NaN

      const unitPrice
        = Number.isFinite(parsedUnitPrice) && parsedUnitPrice > 0
          ? parsedUnitPrice
          : (Number.isFinite(parsedLineTotal)
            && parsedLineTotal > 0
            && quantity > 0
            ? parsedLineTotal / quantity
            : 0)

      const lineTotal
        = Number.isFinite(parsedLineTotal) && parsedLineTotal > 0
          ? parsedLineTotal
          : unitPrice * quantity

      const productNameRaw = firstDefined([
        item.productName,
        item.product_name,
        item.name,
        item.variantName,
        item.variant_name,
        item.title,
        product.name,
        product.productName,
        product.product_name,
        variant.name,
        variant.productName,
        variant.product_name,
      ])

      const productCodeRaw = firstDefined([
        item.productCode,
        item.product_code,
        variant.code,
        product.code,
        variant.id,
        product.id,
      ])

      const keyRaw = firstDefined([
        item.id,
        item.orderItemId,
        item.order_item_id,
        `${index + 1}-${productNameRaw || 'item'}`,
      ])

      return {
        key: String(keyRaw),
        productName: productNameRaw
          ? String(productNameRaw)
          : `Sản phẩm ${index + 1}`,
        productCode: productCodeRaw ? String(productCodeRaw) : '?',
        quantity,
        unitPrice,
        lineTotal,
      }
    })
  }

  function getOrderDisplayLabel (order) {
    const orderNumber = getOrderSequence(order)
    if (Number.isFinite(orderNumber)) {
      return String(orderNumber)
    }

    return '--'
  }

  function getOrderActionLabel (order) {
    const orderNumber = getOrderSequence(order)
    if (Number.isFinite(orderNumber)) {
      return `đơn số ${orderNumber}`
    }

    return 'đơn hàng này'
  }

  function getOrderSequence (order) {
    const source = order && typeof order === 'object' ? order : {}
    const id = Number(source.id)

    if (Number.isFinite(id)) {
      const index = orders.value.findIndex(
        item => Number(item && item.id) === id,
      )
      if (index !== -1) {
        return index + 1
      }
    }

    return null
  }

  function getOrderRecipient (order) {
    const source = order && typeof order === 'object' ? order : {}
    const value = firstDefined([
      source.fullname,
      source.fullName,
      source.receiverName,
      source.receiver_name,
      source.customerName,
      source.customer_name,
      source.username,
      source.accountName,
    ])
    return value ? String(value) : 'Không rõ'
  }

  function getOrderAddress (order) {
    const source = order && typeof order === 'object' ? order : {}
    const value = firstDefined([
      source.shippingAddress,
      source.shipping_address,
      source.deliveryAddress,
      source.delivery_address,
      source.address,
    ])
    return value ? String(value) : 'Chưa có thông tin địa chỉ'
  }

  function getDetailFinalAmount (order) {
    const finalAmount = getOrderAmount(
      order,
      ['finalAmount', 'final_amount'],
      Number.NaN,
    )
    if (Number.isFinite(finalAmount) && finalAmount > 0) {
      return finalAmount
    }

    const fallbackAmount = detailSubtotal.value - detailDiscount.value
    return Math.max(0, fallbackAmount)
  }

  async function openOrderDetails (order) {
    cancelOrderMessage.value = ''
    isCancelOrderError.value = false
    confirmOrderMessage.value = ''
    isConfirmOrderError.value = false
    selectedOrder.value = order && typeof order === 'object' ? order : null
    selectedOrderDetail.value = null
    detailError.value = ''
    isDetailOpen.value = true

    const id = selectedOrder.value ? Number(selectedOrder.value.id) : Number.NaN
    if (!Number.isFinite(id)) {
      detailError.value = 'Không xác định được đơn hàng để tải chi tiết'
      return
    }

    try {
      isDetailLoading.value = true
      const detail = await orderAPI.getOrder(id)
      selectedOrderDetail.value = detail
    } catch (error) {
      detailError.value
        = error && error.message
          ? error.message
          : 'Không thể tải chi tiết đơn hàng'
    } finally {
      isDetailLoading.value = false
    }
  }

  function applyOrderPatch (orderId, patch) {
    const normalizedId = Number(orderId)
    if (!Number.isFinite(normalizedId) || !patch || typeof patch !== 'object') {
      return
    }

    orders.value = orders.value.map(order => {
      if (Number(order && order.id) !== normalizedId) {
        return order
      }
      return {
        ...order,
        ...patch,
      }
    })

    if (selectedOrder.value && Number(selectedOrder.value.id) === normalizedId) {
      selectedOrder.value = {
        ...selectedOrder.value,
        ...patch,
      }
    }

    if (
      selectedOrderDetail.value
      && Number(selectedOrderDetail.value.id) === normalizedId
    ) {
      selectedOrderDetail.value = {
        ...selectedOrderDetail.value,
        ...patch,
      }
    }
  }

  async function openOrderDetailsFromList (order) {
    const id = Number(order && order.id)
    if (Number.isFinite(id)) {
      await router.push({ name: 'order-detail', params: { id: String(id) } })
      return
    }

    await openOrderDetails(order)
  }

  const isRepaying = ref(false)

  async function handleRepayVnpay (order) {
    if (!order || !order.id) return
    try {
      isRepaying.value = true
      const { data } = await axios.post(`${API_BASE_URL}/payment/vnpay/create`, {
        orderId: order.id,
        amount: order.finalAmount || order.totalMoney,
      })
      if (data && data.success && data.paymentUrl) {
        window.location.href = data.paymentUrl
      } else {
        alert('Lỗi khi tạo link thanh toán VNPay: ' + (data?.message || 'Không có link trả về'))
      }
    } catch (error) {
      console.error('Lỗi thanh toán lại:', error)
      alert('Có lỗi xảy ra, vui lòng thử lại sau.')
    } finally {
      isRepaying.value = false
    }
  }

  async function openOrderDetailsById (orderId) {
    const normalizedId = Number(orderId)
    if (!Number.isFinite(normalizedId)) {
      return
    }

    const existingOrder = orders.value.find(
      order => Number(order && order.id) === normalizedId,
    )
    await openOrderDetails(existingOrder || { id: normalizedId })
  }

  // ========= LOGIC MỞ POPUP XÁC NHẬN HỦY ĐƠN =========
  function promptCancelOrder () {
    const id = Number(activeDetailOrder.value && activeDetailOrder.value.id)
    const orderLabel = getOrderActionLabel(activeDetailOrder.value)
    cancelOrderMessage.value = ''
    isCancelOrderError.value = false
    confirmOrderMessage.value = ''
    isConfirmOrderError.value = false

    if (!Number.isFinite(id)) {
      cancelOrderMessage.value = 'Không xác định được đơn hàng để hủy.'
      isCancelOrderError.value = true
      return
    }

    if (
      !isCancelableOrderStatus(
        activeDetailOrder.value && activeDetailOrder.value.status,
      )
    ) {
      cancelOrderMessage.value = 'Chỉ có thể hủy đơn trước khi đơn chuyển sang đang giao.'
      isCancelOrderError.value = true
      return
    }

    confirmModal.type = 'cancel'
    confirmModal.title = 'Xác nhận hủy đơn'
    confirmModal.message = `Bạn chắc chắn muốn hủy ${orderLabel}? Hành động này không thể hoàn tác.`
    confirmModal.confirmText = 'Có, Hủy đơn'
    confirmModal.show = true
  }

  // ========= THỰC THI HỦY ĐƠN =========
  async function executeCancelOrder () {
    const id = Number(activeDetailOrder.value && activeDetailOrder.value.id)
    const orderLabel = getOrderActionLabel(activeDetailOrder.value)

    try {
      isCancellingOrder.value = true
      cancelOrderMessage.value = ''
      isCancelOrderError.value = false

      const cancelledOrder = await orderAPI.cancelOrder(id)
      const nextStatus = (cancelledOrder && cancelledOrder.status) || 'CANCELLED'

      applyOrderPatch(id, {
        ...cancelledOrder,
        status: nextStatus,
      })

      cancelOrderMessage.value = `Đã hủy ${orderLabel} thành công.`
    } catch (error) {
      cancelOrderMessage.value
        = error && error.message ? error.message : 'Không thể hủy đơn hàng.'
      isCancelOrderError.value = true
    } finally {
      isCancellingOrder.value = false
    }
  }

  // ========= LOGIC MỞ POPUP XÁC NHẬN NHẬN HÀNG =========
  function promptConfirmOrder () {
    const id = Number(activeDetailOrder.value && activeDetailOrder.value.id)
    const orderLabel = getOrderActionLabel(activeDetailOrder.value)
    cancelOrderMessage.value = ''
    isCancelOrderError.value = false

    if (!Number.isFinite(id)) {
      confirmOrderMessage.value
        = 'Không xác định được đơn hàng để xác nhận nhận hàng.'
      isConfirmOrderError.value = true
      return
    }

    if (
      getOrderStatusCategory(
        activeDetailOrder.value && activeDetailOrder.value.status,
      ) !== 'delivered'
    ) {
      confirmOrderMessage.value
        = 'Chỉ đơn đã giao mới có thể xác nhận đã nhận hàng.'
      isConfirmOrderError.value = true
      return
    }

    confirmModal.type = 'confirm'
    confirmModal.title = 'Xác nhận nhận hàng'
    confirmModal.message = `Bạn xác nhận đã nhận ${orderLabel} và đồng ý thanh toán?`
    confirmModal.confirmText = 'Đã nhận hàng'
    confirmModal.show = true
  }

  // ========= THỰC THI XÁC NHẬN NHẬN HÀNG =========
  async function executeConfirmOrder () {
    const id = Number(activeDetailOrder.value && activeDetailOrder.value.id)
    const orderLabel = getOrderActionLabel(activeDetailOrder.value)

    try {
      isConfirmingOrder.value = true
      confirmOrderMessage.value = ''
      isConfirmOrderError.value = false

      const confirmedOrder = await orderAPI.confirmOrderReceived(id)
      const nextStatus = (confirmedOrder && confirmedOrder.status) || 'SUCCESS'
      const nextPaymentStatus = 'PAID'

      applyOrderPatch(id, {
        ...confirmedOrder,
        status: nextStatus,
        paymentStatus: nextPaymentStatus,
      })

      confirmOrderMessage.value = `Đã xác nhận nhận hàng cho ${orderLabel} và cập nhật thanh toán thành đã thanh toán.`
    } catch (error) {
      confirmOrderMessage.value
        = error && error.message ? error.message : 'Không thể xác nhận đơn hàng.'
      isConfirmOrderError.value = true
    } finally {
      isConfirmingOrder.value = false
    }
  }

  // ===== XÁC NHẬN HỦY HÀNG ======
  function promptReturnOrder () {
    const id = Number(activeDetailOrder.value && activeDetailOrder.value.id)
    const orderLabel = getOrderActionLabel(activeDetailOrder.value)
    confirmOrderMessage.value = ''
    isConfirmOrderError.value = false

    if (!Number.isFinite(id)) {
      confirmOrderMessage.value = 'Không xác định được đơn hàng để trả.'
      isConfirmOrderError.value = true
      return
    }

    confirmModal.type = 'return'
    confirmModal.title = 'Yêu cầu trả hàng'
    confirmModal.message = `Bạn muốn gửi yêu cầu trả hàng cho ${orderLabel}? Đơn sẽ chuyển về chờ xử lý để admin xác nhận các bước trả hàng.`
    confirmModal.confirmText = 'Xác nhận trả hàng'
    confirmModal.returnReason = '' // Reset reason
    confirmModal.returnImageFiles = []
    confirmModal.returnImagePreviews = []
    confirmModal.show = true
  }

  function onReturnImageSelect (event) {
    const files = Array.from(event.target.files || [])
    const remaining = 5 - (confirmModal.returnImagePreviews || []).length
    const toAdd = files.slice(0, remaining)

    for (const file of toAdd) {
      confirmModal.returnImageFiles.push(file)
      const reader = new FileReader()
      reader.addEventListener('load', e => {
        confirmModal.returnImagePreviews.push(e.target.result)
      })
      reader.readAsDataURL(file)
    }
    event.target.value = ''
  }

  function removeReturnImage (idx) {
    confirmModal.returnImageFiles.splice(idx, 1)
    confirmModal.returnImagePreviews.splice(idx, 1)
  }

  async function executeReturnOrder () {
    const id = Number(activeDetailOrder.value && activeDetailOrder.value.id)
    const orderLabel = getOrderActionLabel(activeDetailOrder.value)

    try {
      if (!confirmModal.returnReason || confirmModal.returnReason.trim() === '') {
        confirmOrderMessage.value = 'Vui lòng nhập lý do hoàn hàng.'
        isConfirmOrderError.value = true
        return
      }

      isReturningOrder.value = true
      confirmOrderMessage.value = ''
      isConfirmOrderError.value = false

      const returnedOrder = await orderAPI.updateOrder(id, {
        status: 'RETURN_REQUEST',
        paymentStatus: 'PAID',
        returnReason: confirmModal.returnReason.trim(),
      })

      // Upload ảnh minh chứng nếu có
      if (confirmModal.returnImageFiles && confirmModal.returnImageFiles.length > 0) {
        const formData = new FormData()
        for (const file of confirmModal.returnImageFiles) {
          formData.append('files', file)
        }
        try {
          await axios.post(`${API_BASE_URL}/orders/${id}/return-images`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
        } catch (error) {
          console.error('Lỗi upload ảnh hoàn hàng:', error)
        }
      }

      const nextStatus = (returnedOrder && returnedOrder.status) || 'RETURN_REQUEST'
      const nextPaymentStatus
        = (returnedOrder && returnedOrder.paymentStatus) || 'PAID'

      applyOrderPatch(id, {
        ...returnedOrder,
        status: nextStatus,
        paymentStatus: nextPaymentStatus,
      })

      confirmOrderMessage.value = `Đã gửi yêu cầu trả hàng cho ${orderLabel}. Admin sẽ kiểm tra và xử lý yêu cầu.`
    } catch (error) {
      confirmOrderMessage.value
        = error && error.message
          ? error.message
          : 'Không thể gửi yêu cầu trả hàng.'
      isConfirmOrderError.value = true
    } finally {
      isReturningOrder.value = false
    }
  }

  // ========= ĐIỀU PHỐI HÀNH ĐỘNG CỦA MODAL =========
  async function executeModalAction () {
    confirmModal.isLoading = true
    try {
      if (confirmModal.type === 'cancel') {
        await executeCancelOrder()
      } else if (confirmModal.type === 'return') {
        await executeReturnOrder()
      } else {
        await executeConfirmOrder()
      }

      if (!isCancelOrderError.value && !isConfirmOrderError.value) {
        confirmModal.show = false
      }
    } finally {
      confirmModal.isLoading = false
    }
  }

  function closeOrderDetails () {
    cancelOrderMessage.value = ''
    isCancelOrderError.value = false
    confirmOrderMessage.value = ''
    isConfirmOrderError.value = false
    isDetailOpen.value = false

    if (routeOrderId.value !== null) {
      router.replace({ name: 'orders' })
    }
  }

  function goToPage (page) {
    const nextPage = Number(page)
    if (!Number.isFinite(nextPage)) return
    currentPage.value = Math.min(Math.max(1, nextPage), totalPages.value)
  }

  function goToPreviousPage () {
    goToPage(currentPage.value - 1)
  }

  function goToNextPage () {
    goToPage(currentPage.value + 1)
  }

  async function loadOrders () {
    isLoading.value = true
    errorMessage.value = ''

    try {
      const rawUser = localStorage.getItem('user')
      if (!rawUser) {
        router.push('/login')
        return
      }

      const parsedUser = JSON.parse(rawUser)
      const accountId = getAccountId(parsedUser)

      if (accountId === null) {
        errorMessage.value
          = 'Không xác định được tài khoản để tải lịch sử đơn hàng'
        return
      }

      currentUser.value = parsedUser
      const list = await orderAPI.getUserOrders(accountId)
      const normalizedList = Array.isArray(list) ? list : []
      orders.value = sortOrdersNewestFirst(
        await enrichOrdersWithItemNames(normalizedList),
      )
      currentPage.value = 1
    } catch (error) {
      console.error('Lỗi lấy đơn hàng:', error)
      errorMessage.value
        = error && error.message
          ? error.message
          : 'Không thể tải lịch sử đơn hàng. Vui lòng thử lại.'
      orders.value = []
      currentPage.value = 1
    } finally {
      isLoading.value = false
    }
  }

  onMounted(async () => {
    await loadOrders()

    if (routeOrderId.value !== null) {
      await openOrderDetailsById(routeOrderId.value)
    }
  })

  watch(routeOrderId, async (next, previous) => {
    if (next === previous) return

    if (next === null) {
      isDetailOpen.value = false
      return
    }

    await openOrderDetailsById(next)
  })

  watch(totalPages, nextTotalPages => {
    if (currentPage.value > nextTotalPages) {
      currentPage.value = nextTotalPages
    }
  })
</script>

<style scoped>
@keyframes fade-scale-in {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.fade-scale-enter-active {
  animation: fade-scale-in 0.2s ease-out;
}

.fade-scale-leave-active {
  animation: fade-scale-in 0.16s reverse ease-in;
}
</style>
