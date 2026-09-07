<template>
  <AdminShell>
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.18em] text-primary">Bán hàng POS</p>
          <h2 class="mt-1 text-2xl font-bold">Điểm bán hàng</h2>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <div class="inline-flex items-center overflow-hidden rounded-full border border-slate-200 bg-slate-50 text-sm text-slate-700">
            <div class="inline-flex items-center gap-1.5 px-3 py-1.5">
              <span class="material-symbols-outlined text-[17px] text-primary">receipt_long</span>
              <span class="font-semibold">{{ activeInvoiceTitle }}</span>
            </div>
            <div class="h-5 w-px bg-slate-200" />
            <div class="px-3 py-1.5 text-slate-500">
              {{ activeInvoice?.cart?.length || 0 }} sản phẩm
            </div>
            <button
              aria-label="Tạo hóa đơn mới"
              class="inline-flex size-8 items-center justify-center border-l border-slate-200 text-slate-500 transition hover:bg-white hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="invoices.length >= MAX_INVOICES"
              title="Tạo hóa đơn mới"
              type="button"
              @click="addInvoice"
            >
              <span class="material-symbols-outlined text-[19px]">add</span>
            </button>
          </div>
          <button
            aria-label="Làm mới hóa đơn hiện tại"
            class="inline-flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-primary hover:text-primary"
            title="Làm mới hóa đơn hiện tại"
            type="button"
            @click="resetInvoice"
          >
            <span class="material-symbols-outlined text-[18px]">refresh</span>
          </button>
        </div>
      </div>
    </template>

    <div class="space-y-4">
      <div v-if="invoices.length > 1" class="rounded-2xl border border-slate-200 bg-white px-3 py-2">
        <div class="flex flex-wrap items-center gap-1.5">
          <span class="mr-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Hóa đơn</span>
          <div
            v-for="invoice in invoices"
            :key="invoice.id"
            class="inline-flex items-center overflow-hidden rounded-full border text-xs font-semibold transition"
            :class="invoice.id === activeInvoiceId ? 'border-primary bg-primary/10 text-primary' : 'border-transparent bg-slate-50 text-slate-600 hover:bg-slate-100'"
          >
            <button
              class="inline-flex items-center gap-1.5 px-2.5 py-1.5 transition"
              type="button"
              @click="activeInvoiceId = invoice.id"
            >
              <span class="material-symbols-outlined text-[15px]">receipt_long</span>
              {{ invoice.orderId ? `#${invoice.orderId}` : `Tạm ${invoice.number}` }}
            </button>
            <button
              v-if="!invoice.orderId"
              aria-label="Xóa hóa đơn tạm"
              class="inline-flex size-7 items-center justify-center border-l border-white/60 text-slate-400 transition hover:bg-red-100 hover:text-red-600"
              title="Xóa hóa đơn tạm"
              type="button"
              @click.stop="removeInvoice(invoice.id)"
            >
              <span class="material-symbols-outlined text-[12px]">close</span>
            </button>
          </div>
          <button
            aria-label="Tạo hóa đơn mới"
            class="inline-flex size-7 items-center justify-center rounded-full border border-dashed border-slate-300 text-slate-500 transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
            :disabled="invoices.length >= MAX_INVOICES"
            title="Tạo hóa đơn mới"
            type="button"
            @click="addInvoice"
          >
            <span class="material-symbols-outlined text-[17px]">add</span>
          </button>
        </div>
      </div>

      <div class="grid gap-3 lg:grid-cols-[1.8fr_0.85fr]">
        <section class="space-y-3">
          <div class="rounded-xl border border-slate-200 bg-white p-3">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[20px] text-primary">search</span>
                <div>
                  <p class="text-[13px] font-semibold text-slate-900">Tìm sản phẩm</p>
                  <p class="text-xs text-slate-500">Tìm theo tên hoặc mã sản phẩm.</p>
                </div>
              </div>
              <div class="flex w-full items-center gap-2 sm:w-[340px]">
                <input
                  v-model="searchQuery"
                  class="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-900 outline-none focus:border-primary"
                  placeholder="Nhập từ khóa hoặc ID biến thể..."
                  type="text"
                >
                <button
                  class="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-600"
                  type="button"
                  @click="startQrScanner"
                >
                  <span class="material-symbols-outlined text-[18px]">qr_code_scanner</span>
                  Quét QR
                </button>
              </div>
            </div>
            <div class="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              <div
                v-for="product in filteredVariants"
                :key="product.productId"
                class="group flex cursor-pointer gap-2 rounded-xl border border-slate-200 p-2.5 transition hover:border-primary hover:bg-slate-50"
                @click="addToCart(product)"
              >
                <div class="aspect-square w-12 overflow-hidden rounded-lg bg-slate-100">
                  <img v-if="product.imageUrl" class="h-full w-full object-cover" :src="product.imageUrl">
                  <span v-else class="material-symbols-outlined flex h-full items-center justify-center text-slate-400">inventory_2</span>
                </div>
                <div class="flex flex-1 flex-col justify-between overflow-hidden">
                  <div>
                    <p class="truncate text-[13px] font-bold text-slate-900" :title="product.productName">{{ product.productName }}</p>
                    <p class="mt-0.5 truncate text-[11px] text-slate-500">Mã SP: {{ product.productCode || "--" }}</p>
                    <p class="mt-0.5 text-[11px] text-slate-500">{{ product.variants.length }} biến thể</p>
                  </div>
                  <div class="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span class="font-semibold text-primary">{{ formatMoney(product.price) }}</span>
                    <span class="font-semibold">Kho: {{ product.variants.reduce((sum, variant) => sum + Number(variant.stockQuantity || variant.stock_quantity || 0), 0) }}</span>
                  </div>
                </div>
              </div>
              <div v-if="filteredVariants.length === 0" class="col-span-full rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center text-sm text-slate-500">
                Không tìm thấy sản phẩm.
              </div>
            </div>
          </div>

          <div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div class="border-b border-slate-200 bg-slate-50 px-3 py-2">
              <h3 class="text-sm font-bold text-slate-900">Sản phẩm trong giỏ hàng</h3>
            </div>
            <div class="max-h-[520px] overflow-y-auto">
              <table class="w-full text-left text-xs">
                <thead class="sticky top-0 z-10 border-b border-slate-200 bg-slate-50">
                  <tr class="text-slate-500">
                    <th class="w-10 px-3 py-2 font-semibold">STT</th>
                    <th class="px-2 py-2 font-semibold">Sản phẩm</th>
                    <th class="w-28 px-2 py-2 font-semibold">Số lượng</th>
                    <th class="px-2 py-2 text-right font-semibold">Thành tiền</th>
                    <th class="w-10 px-3 py-2 text-center font-semibold" />
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-for="(item, index) in activeInvoice.cart" :key="item.cartItemId" class="hover:bg-slate-50">
                    <td class="px-3 py-2 font-bold text-slate-400">{{ index + 1 }}</td>
                    <td class="px-2 py-2">
                      <p class="font-bold text-slate-900">{{ item.product.productName }}</p>
                      <p class="mt-0.5 text-[11px] text-slate-500">Mã biến thể: {{ getVariant(item).variantCode || getVariantCode(item.product.productCode, getVariant(item).colorName, getVariant(item).sizeName) }}</p>
                      <select v-model="item.variantId" class="mt-1 block w-full rounded-md border border-slate-300 py-1 text-[11px] text-slate-700" @change="validateQuantity(item)">
                        <option v-for="variant in item.product.variants" :key="variant.variantId" :value="variant.variantId">
                          {{ variant.colorName }} / Size {{ variant.sizeName }} - {{ variant.variantCode || getVariantCode(item.product.productCode, variant.colorName, variant.sizeName) }} (Kho: {{ variant.stockQuantity }})
                        </option>
                      </select>
                    </td>
                    <td class="px-2 py-2">
                      <div class="flex w-fit items-center overflow-hidden rounded-lg border border-slate-200">
                        <button class="px-2 py-0.5 text-slate-700 hover:bg-slate-100" @click="updateQuantity(item, -1)">-</button>
                        <input
                          v-model.number="item.quantity"
                          class="w-10 border-none bg-transparent p-0 text-center text-xs text-slate-900 focus:ring-0"
                          min="1"
                          type="number"
                          @change="validateQuantity(item)"
                        >
                        <button class="px-2 py-0.5 text-slate-700 hover:bg-slate-100" @click="updateQuantity(item, 1)">+</button>
                      </div>
                    </td>
                    <td class="px-2 py-2 text-right font-bold text-slate-900">{{ formatMoney(getVariant(item).price * item.quantity) }}</td>
                    <td class="px-3 py-2 text-center">
                      <button class="rounded-lg p-1 text-red-500 transition-colors hover:bg-red-50" @click="removeFromCart(item.cartItemId)">
                        <span class="material-symbols-outlined text-[17px]">delete</span>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="activeInvoice.cart.length === 0">
                    <td class="py-10 text-center text-slate-400" colspan="5">Chưa có sản phẩm nào trong giỏ hàng.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <aside class="space-y-3">
          <div class="sticky top-6 space-y-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div class="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div>
                <p class="text-[13px] font-semibold text-slate-900">Áp dụng voucher</p>
              </div>
              <div class="flex gap-2">
                <div class="flex flex-1 items-center rounded-lg border border-slate-200 bg-white px-2.5 py-1.5">
                  <input
                    v-model="activeInvoice.voucherInput"
                    class="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none uppercase"
                    placeholder="Nhập mã voucher..."
                    type="text"
                    @keyup.enter="applyVoucherByInput"
                  >
                </div>
                <button class="rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-slate-800" @click="applyVoucherByInput">Áp dụng</button>
              </div>
              <div class="max-h-48 space-y-2 overflow-y-auto pr-1">
                <div v-for="voucher in processedVouchers" :key="voucher.id || voucher.code" class="flex items-center justify-between gap-2 rounded-lg border p-2.5" :class="[voucher.isApplied ? 'border-primary bg-primary/5' : 'border-slate-200', !voucher.isEligible ? 'opacity-60 grayscale' : '', !voucher.isActive ? 'bg-slate-100 opacity-80' : '']">
                  <div class="min-w-0">
                    <p class="truncate text-sm font-black text-slate-900" :class="voucher.isApplied ? 'text-primary' : ''">{{ voucher.code }}</p>
                    <p class="mt-0.5 text-xs text-slate-500">Giảm {{ formatDiscountLabel(voucher) }}, tối thiểu {{ formatMoney(voucher.minOrder) }}</p>
                    <p v-if="voucher.reason" class="mt-1 text-[11px] font-semibold text-slate-500">{{ voucher.reason }}</p>
                  </div>
                  <div class="shrink-0">
                    <button v-if="voucher.isApplied" class="rounded-md bg-primary/10 px-2 py-1 text-[11px] font-bold text-primary transition-colors hover:bg-primary hover:text-white" @click="removeVoucher">Bỏ mã</button>
                    <button v-else-if="voucher.isActive && voucher.isEligible" class="rounded-md bg-primary/10 px-2 py-1 text-[11px] font-bold text-primary transition-colors hover:bg-primary hover:text-white" @click="applySpecificVoucher(voucher)">Dùng mã</button>
                    <span v-else class="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-500">{{ voucher.isActive ? 'Chưa đủ' : 'Tắt' }}</span>
                  </div>
                </div>
                <div v-if="processedVouchers.length === 0" class="text-center text-sm text-slate-500">Không có mã giảm giá khả dụng.</div>
              </div>
            </div>

            <div class="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div class="flex items-center justify-between text-sm text-slate-600">
                <span>Tạm tính</span>
                <span class="font-bold text-slate-900">{{ formatMoney(activeSubtotal) }}</span>
              </div>
              <div v-if="activeDiscount > 0" class="mt-2 flex items-center justify-between text-sm text-green-600">
                <span>Giảm giá</span>
                <span class="font-bold">- {{ formatMoney(activeDiscount) }}</span>
              </div>
              <div class="mt-3 flex items-center justify-between border-t border-slate-200 pt-2">
                <span class="text-sm font-bold text-slate-900">Cần thanh toán</span>
                <span class="text-xl font-black text-primary">{{ formatMoney(activeTotal) }}</span>
              </div>
            </div>

            <div class="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p class="text-[13px] font-semibold text-slate-900">Phương thức thanh toán</p>
              <div class="mt-2 grid gap-2 sm:grid-cols-2">
                <button class="rounded-lg border px-3 py-1.5 text-xs font-semibold transition" :class="activeInvoice.paymentMethodId === 1 ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 bg-white text-slate-700'" type="button" @click="activeInvoice.paymentMethodId = 1">Tiền mặt</button>
                <button class="rounded-lg border px-3 py-1.5 text-xs font-semibold transition" :class="activeInvoice.paymentMethodId === 2 ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 bg-white text-slate-700'" type="button" @click="activeInvoice.paymentMethodId = 2">Chuyển khoản</button>
              </div>
              <div v-if="activeInvoice.paymentMethodId === 2" class="mt-2 rounded-lg border border-slate-200 bg-white p-2.5">
                <label class="mb-2 block text-xs font-bold uppercase text-slate-500">Kênh trực tuyến</label>
                <select v-model.number="activeInvoice.digitalPaymentMethodId" class="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-900 outline-none">
                  <option v-for="method in digitalPaymentMethods" :key="method.id" :value="method.id">{{ method.name }}</option>
                </select>
              </div>
              <div v-if="activeInvoice.paymentMethodId === 1" class="mt-2 rounded-lg border border-slate-200 bg-white p-2.5">
                <div class="flex items-center justify-between text-sm text-slate-600">
                  <span>Khách đưa</span>
                  <input v-model.number="activeInvoice.customerPaid" class="money-input w-28 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-right text-base font-bold text-slate-900 outline-none" type="number">
                </div>
                <div class="mt-2 flex items-center justify-between text-sm text-slate-500">
                  <span>Tiền thừa</span>
                  <span class="font-bold text-orange-500">{{ formatMoney(Math.max(0, activeInvoice.customerPaid - activeTotal)) }}</span>
                </div>
              </div>
            </div>

            <button class="w-full rounded-lg bg-primary py-2.5 text-sm font-black text-white shadow-lg shadow-primary/30 transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50" :disabled="activeInvoice.cart.length === 0 || isProcessing" @click="handlePlaceOrder">
              <span v-if="isProcessing" class="material-symbols-outlined animate-spin">sync</span>
              <span v-else class="material-symbols-outlined">check_circle</span>
              <span class="ml-2">{{ isProcessing ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN THANH TOÁN' }}</span>
            </button>
          </div>
        </aside>
      </div>

      <Teleport to="body">
        <div
          v-if="showReceipt && lastReceipt"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          @click.self="closeReceipt"
        >
          <div class="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div class="border-b border-slate-200 px-4 py-3">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-xs uppercase tracking-[0.18em] text-primary">Hóa đơn</p>
                  <h3 class="mt-1 text-lg font-bold">
                    {{ lastReceipt.orderCode || (lastReceipt.orderId ? `Hóa đơn #${lastReceipt.orderId}` : "Hóa đơn POS") }}
                  </h3>
                  <p class="text-sm text-slate-500">Sẵn sàng in hóa đơn cho giao dịch vừa hoàn tất.</p>
                </div>
                <button
                  aria-label="Đóng biên lai"
                  class="inline-flex size-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-primary hover:text-primary"
                  type="button"
                  @click="closeReceipt"
                >
                  <span class="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>

            <div class="max-h-[75vh] overflow-y-auto p-4">
              <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div class="flex flex-wrap items-start justify-between gap-3 border-b border-dashed border-slate-300 pb-3">
                  <div>
                    <p class="text-sm font-black text-slate-900">SportX</p>
                    <p class="text-xs text-slate-500">Hóa đơn thanh toán</p>
                  </div>
                  <div class="text-right text-xs text-slate-500">
                    <p>Mã: <span class="font-semibold text-slate-900">{{ lastReceipt.orderCode || `#${lastReceipt.orderId || '-'}` }}</span></p>
                    <p>{{ new Date(lastReceipt.createdAt).toLocaleString("vi-VN") }}</p>
                  </div>
                </div>

                <div class="mt-3 text-sm md:text-right">
                  <p class="text-xs uppercase tracking-wide text-slate-400">Thanh toán</p>
                  <p class="mt-1 font-semibold text-slate-900">{{ lastReceipt.paymentMethodLabel }}</p>
                  <p class="text-slate-600">{{ lastReceipt.shippingAddress }}</p>
                  <p class="text-slate-600">Voucher: {{ lastReceipt.voucherCode || "None" }}</p>
                </div>

                <div class="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <table class="w-full text-left text-xs">
                    <thead class="border-b border-slate-200 bg-slate-50 text-slate-500">
                      <tr>
                        <th class="px-3 py-2 font-semibold">Sản phẩm</th>
                        <th class="px-3 py-2 font-semibold">SL</th>
                        <th class="px-3 py-2 text-right font-semibold">Đơn giá</th>
                        <th class="px-3 py-2 text-right font-semibold">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                      <tr v-for="item in lastReceipt.items" :key="item.key">
                        <td class="px-3 py-2">
                          <p class="font-semibold text-slate-900">{{ item.productName }}</p>
                          <p class="text-[11px] text-slate-500">Mã SP: {{ item.productCode || "--" }}</p>
                          <p class="text-[11px] text-slate-500">{{ item.variantName }}</p>
                        </td>
                        <td class="px-3 py-2 text-slate-700">{{ item.quantity }}</td>
                        <td class="px-3 py-2 text-right text-slate-700">{{ formatMoney(item.price) }}</td>
                        <td class="px-3 py-2 text-right font-semibold text-slate-900">{{ formatMoney(item.lineTotal) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="mt-4 grid gap-3 md:grid-cols-[1fr_280px]">
                  <div class="rounded-xl border border-dashed border-slate-300 bg-white p-3 text-sm text-slate-600">
                    <div class="flex justify-between gap-3">
                      <span>Tạm tính</span>
                      <span class="font-semibold text-slate-900">{{ formatMoney(lastReceipt.subtotal) }}</span>
                    </div>
                    <div class="mt-1 flex justify-between gap-3">
                      <span>Giảm giá</span>
                      <span class="font-semibold text-green-600">- {{ formatMoney(lastReceipt.discount) }}</span>
                    </div>
                    <div class="mt-1 flex justify-between gap-3">
                      <span>Phải thanh toán</span>
                      <span class="font-semibold text-slate-900">{{ formatMoney(lastReceipt.total) }}</span>
                    </div>
                  </div>
                  <div class="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                    <div class="flex justify-between gap-3">
                      <span>Khách đưa</span>
                      <span class="font-semibold text-slate-900">{{ formatMoney(lastReceipt.customerPaid) }}</span>
                    </div>
                    <div class="mt-1 flex justify-between gap-3">
                      <span>Tiền thừa</span>
                      <span class="font-semibold text-orange-500">{{ formatMoney(lastReceipt.changeDue) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap justify-end gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3">
              <button
                class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-400"
                type="button"
                @click="closeReceipt"
              >
                Đóng
              </button>
              <button
                class="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
                type="button"
                @click="printReceipt(lastReceipt)"
              >
                In hóa đơn
              </button>
            </div>
          </div>
        </div>
      </Teleport>

      <Teleport to="body">
        <div
          v-if="paymentDialog"
          class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
          @click.self="closePaymentDialog"
        >
          <div class="w-full max-w-lg overflow-hidden rounded-3xl border border-white/60 bg-white shadow-2xl">
            <div
              class="border-b border-slate-200 px-5 py-4"
              :class="paymentDialog.type === 'success' ? 'bg-gradient-to-r from-emerald-50 via-white to-sky-50' : paymentDialog.type === 'confirm' ? 'bg-gradient-to-r from-amber-50 via-white to-orange-50' : 'bg-gradient-to-r from-rose-50 via-white to-amber-50'"
            >
              <div class="flex items-start gap-3">
                <div
                  class="flex size-11 items-center justify-center rounded-2xl"
                  :class="paymentDialog.type === 'success' ? 'bg-emerald-100 text-emerald-600' : paymentDialog.type === 'confirm' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'"
                >
                  <span class="material-symbols-outlined text-[22px]">
                    {{ paymentDialog.type === 'success' ? 'check_circle' : paymentDialog.type === 'confirm' ? 'shopping_cart_checkout' : 'warning' }}
                  </span>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-xs uppercase tracking-[0.18em]" :class="paymentDialog.type === 'success' ? 'text-emerald-500' : paymentDialog.type === 'confirm' ? 'text-amber-600' : 'text-rose-500'">
                    {{ paymentDialog.type === 'success' ? 'Thanh toán thành công' : paymentDialog.type === 'confirm' ? 'Xác nhận tạo hóa đơn' : 'Thanh toán thất bại' }}
                  </p>
                  <h3 class="mt-1 text-lg font-bold text-slate-900">
                    {{ paymentDialog.title }}
                  </h3>
                  <p class="mt-1 text-sm text-slate-600">
                    {{ paymentDialog.message }}
                  </p>
                </div>
              </div>
            </div>

            <div class="px-5 py-4">
              <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div v-if="paymentDialog.details?.itemCount != null" class="flex items-center justify-between gap-3 text-sm">
                  <span class="text-slate-500">Số dòng hàng</span>
                  <span class="font-semibold text-slate-900">{{ paymentDialog.details.itemCount }}</span>
                </div>
                <div v-if="paymentDialog.details?.orderCode" class="flex items-center justify-between gap-3 text-sm">
                  <span class="text-slate-500">Hóa đơn</span>
                  <span class="font-semibold text-slate-900">{{ paymentDialog.details.orderCode }}</span>
                </div>
                <div v-if="paymentDialog.details?.total != null" class="mt-2 flex items-center justify-between gap-3 text-sm">
                  <span class="text-slate-500">Tổng thanh toán</span>
                  <span class="font-semibold text-slate-900">{{ formatMoney(paymentDialog.details.total) }}</span>
                </div>
              </div>

              <div class="mt-4 flex flex-wrap justify-end gap-2">
                <button
                  class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400"
                  type="button"
                  @click="closePaymentDialog"
                >
                  {{ paymentDialog.secondaryLabel || 'Đóng' }}
                </button>
                <button
                  class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-lg transition"
                  :class="paymentDialog.type === 'success' ? 'bg-emerald-600 shadow-emerald-200 hover:bg-emerald-700' : paymentDialog.type === 'confirm' ? 'bg-amber-600 shadow-amber-200 hover:bg-amber-700' : 'bg-primary shadow-primary/30 hover:bg-blue-600'"
                  type="button"
                  @click="handlePaymentDialogPrimary"
                >
                  {{ paymentDialog.primaryLabel || 'Tiếp tục' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Teleport>
      <!-- Modal quét QR -->
      <Teleport to="body">
        <div
          v-if="qrScannerVisible"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          @click.self="stopQrScanner"
        >
          <div class="w-full max-w-md rounded-2xl bg-white p-4 shadow-2xl">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-bold">Quét mã QR</h3>
              <button
                class="rounded-lg p-1 hover:bg-slate-100"
                type="button"
                @click="stopQrScanner"
              >
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
            <div id="qr-reader" class="mt-3 w-full" />
            <p v-if="qrScanError" class="mt-2 text-sm text-red-500">{{ qrScanError }}</p>
            <div class="mt-3 flex justify-end">
              <button
                class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:border-slate-400"
                type="button"
                @click="stopQrScanner"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </AdminShell>
</template>

<script setup>
  import axios from 'axios'
  import { Html5Qrcode, Html5QrcodeScanType } from 'html5-qrcode'
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
  import AdminShell from '@/components/admin/AdminShell.vue'
  import { adminApi, colorsApi, sizesApi, stockApi } from '@/services/api'
  import { voucherAPI } from '@/services/orders'
  import { buildVariantCode } from '@/utils/variantValues'

  function removeVietnameseTones (str) {
    if (!str) return ''; return str.normalize('NFD').replace(/[\u0300-\u036F]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')
  }

  function getInitials (str) {
    if (!str) return 'XX'
    const clean = removeVietnameseTones(str).toUpperCase().trim()
    const words = clean.split(/\s+/)
    if (words.length === 1) return words[0].slice(0, 3) || 'XX'
    return words.map(w => w[0]).join('')
  }

  function getVariantCode (productCode, colorName, sizeName) {
    return buildVariantCode(productCode, colorName, sizeName)
  }
  const MAX_INVOICES = 5
  const POS_DRAFT_STORAGE_KEY = 'shopao.pos.pending-invoices'
  const POS_DEFAULT_CUSTOMER = Object.freeze({
    fullname: 'POS',
    phone: '00000000',
    email: 'pos@local.shop',
  })
  let nextInvoiceNumber = 1
  const searchQuery = ref('')
  const systemVouchers = ref([])
  const inventoryVariants = ref([])
  const lastReceipt = ref(null)
  const showReceipt = ref(false)
  const paymentDialog = ref(null)
  const invoices = ref([createNewInvoice()])
  const activeInvoiceId = ref(invoices.value[0].id)
  const isProcessing = ref(false)

  const qrScannerVisible = ref(false)
  const qrScanner = ref(null)
  const qrScanError = ref('')
  let isScannerStopping = false

  const activeInvoice = computed(() => invoices.value.find(invoice => invoice.id === activeInvoiceId.value) || invoices.value[0])
  const activeInvoiceTitle = computed(() => {
    const invoice = activeInvoice.value
    if (!invoice) return 'Hóa đơn POS'
    if (invoice.orderCode) return `Hóa đơn ${invoice.orderCode}`
    if (invoice.orderId) return `Hóa đơn #${invoice.orderId}`
    return `Hóa đơn tạm ${invoice.number}`
  })

  const activeSubtotal = computed(() => {
    if (!activeInvoice.value) return 0
    return activeInvoice.value.cart.reduce((sum, item) => {
      const variant = item.product.variants.find(variant => variant.variantId === item.variantId)
      return sum + (variant ? Number(variant.price || 0) : 0) * Number(item.quantity || 0)
    }, 0)
  })

  function getVoucherMinOrder (voucher) {
    return Number(voucher?.minOrderValue ?? voucher?.min_order_value ?? voucher?.min_order ?? 0) || 0
  }

  function getVoucherDiscountValue (voucher) {
    return Number(voucher?.discountValue ?? voucher?.discount_value ?? voucher?.value ?? 0) || 0
  }

  function getVoucherDiscountType (voucher) {
    return String(voucher?.discountType ?? voucher?.discount_type ?? 'FIXED').toUpperCase()
  }

  function getVoucherMaxDiscount (voucher) {
    return Number(voucher?.maxDiscountAmount ?? voucher?.max_discount_amount ?? voucher?.max_discount ?? 0) || 0
  }

  function getVoucherUsageState (voucher) {
    const limit = Number(voucher?.usageLimit ?? voucher?.usage_limit ?? voucher?.limit ?? 0) || 0
    const used = Number(voucher?.usedCount ?? voucher?.used_count ?? voucher?.used ?? 0) || 0
    const remaining = limit > 0 ? Math.max(0, limit - used) : null
    return { limit, used, remaining, exhausted: limit > 0 && used >= limit }
  }

  function getVoucherAvailabilityReason (voucher) {
    if (!voucher) return 'Voucher không khả dụng'
    const status = String(voucher.status || voucher.state || '').trim().toUpperCase()
    if (['INACTIVE', 'DISABLED', 'DELETED'].includes(status)) return 'Voucher không còn hoạt động'
    if (status === 'EXPIRED') return 'Voucher đã hết hạn'
    if (status === 'USED') return 'Voucher đã hết lượt sử dụng'
    if (voucher.isActive === false || voucher.is_active === false) return 'Voucher không còn hoạt động'

    const endDateRaw = voucher.endDate || voucher.end_date || voucher.expiryDate || voucher.expire_date
    if (endDateRaw) {
      const endTime = new Date(endDateRaw).getTime()
      if (Number.isFinite(endTime) && endTime < Date.now()) return 'Voucher đã hết hạn'
    }

    return getVoucherUsageState(voucher).exhausted ? 'Voucher đã hết lượt sử dụng' : null
  }

  const isVoucherActive = voucher => !getVoucherAvailabilityReason(voucher)

  function computeVoucherDiscount (voucher, baseAmount) {
    const base = Math.max(0, Number(baseAmount) || 0)
    const val = getVoucherDiscountValue(voucher)
    const type = getVoucherDiscountType(voucher)
    const maxCap = getVoucherMaxDiscount(voucher)
    if (type === 'PERCENT') {
      const raw = (base * val) / 100
      return Math.max(0, maxCap > 0 ? Math.min(raw, maxCap) : raw)
    }
    return Math.max(0, Math.min(val, base))
  }

  const processedVouchers = computed(() => {
    if (!systemVouchers.value) return []

    return systemVouchers.value
      .map(voucher => {
        const minOrder = getVoucherMinOrder(voucher)
        const isEligible = activeSubtotal.value >= minOrder
        const calculatedDiscount = isEligible ? computeVoucherDiscount(voucher, activeSubtotal.value) : 0
        const reason = getVoucherAvailabilityReason(voucher)

        const isApplied
          = activeInvoice.value
            && activeInvoice.value.appliedVoucher
            && String(activeInvoice.value.appliedVoucher.code || '').toUpperCase() === String(voucher.code || '').toUpperCase()

        return { ...voucher, minOrder, isEligible, calculatedDiscount, isApplied, isActive: !reason, reason }
      })
      .sort((a, b) => b.calculatedDiscount - a.calculatedDiscount)
  })

  function formatDiscountLabel (voucher) {
    const type = getVoucherDiscountType(voucher)
    const val = getVoucherDiscountValue(voucher)
    const maxCap = getVoucherMaxDiscount(voucher)
    if (type === 'PERCENT') {
      return maxCap > 0 ? `${val}% (tối đa ${formatMoney(maxCap)})` : `${val}%`
    }
    return formatMoney(val)
  }

  const activeDiscount = computed(() => {
    if (!activeInvoice.value || !activeInvoice.value.appliedVoucher) return 0
    if (activeInvoice.value.appliedVoucher.discountAmount != null) {
      return Math.min(
        Math.max(0, activeSubtotal.value),
        Math.max(0, Number(activeInvoice.value.appliedVoucher.discountAmount) || 0),
      )
    }
    return computeVoucherDiscount(activeInvoice.value.appliedVoucher, activeSubtotal.value)
  })

  const activeTotal = computed(() => Math.max(0, activeSubtotal.value - activeDiscount.value))

  function savePendingInvoices () {
    const pendingInvoices = invoices.value.filter(invoice => !invoice.orderId)
    localStorage.setItem(POS_DRAFT_STORAGE_KEY, JSON.stringify({
      activeInvoiceId: activeInvoiceId.value,
      nextInvoiceNumber,
      invoices: pendingInvoices,
    }))
  }

  function restorePendingInvoices () {
    try {
      const saved = JSON.parse(localStorage.getItem(POS_DRAFT_STORAGE_KEY) || 'null')
      if (!Array.isArray(saved?.invoices) || saved.invoices.length === 0) return

      invoices.value = saved.invoices.slice(0, MAX_INVOICES)
      nextInvoiceNumber = Math.max(Number(saved.nextInvoiceNumber) || 1, ...invoices.value.map(invoice => Number(invoice.number) || 0))
      activeInvoiceId.value = invoices.value.some(invoice => invoice.id === saved.activeInvoiceId)
        ? saved.activeInvoiceId
        : invoices.value[0].id
    } catch (error) {
      console.warn('Không thể khôi phục hóa đơn POS đang chờ.', error)
      localStorage.removeItem(POS_DRAFT_STORAGE_KEY)
    }
  }

  watch(invoices, savePendingInvoices, { deep: true })
  watch(activeInvoiceId, savePendingInvoices)

  function autoPickBestEligibleVoucher () {
    const invoice = activeInvoice.value
    if (!invoice || invoice.voucherPreference === 'none' || invoice.appliedVoucher || activeSubtotal.value <= 0) return

    const bestVoucher = processedVouchers.value.find(voucher => voucher.isEligible)
    if (!bestVoucher) return

    invoice.appliedVoucher = bestVoucher
    invoice.voucherInput = bestVoucher.code || ''
  }

  watch(activeSubtotal, newSubtotal => {
    const invoice = activeInvoice.value
    if (!invoice) return

    if (invoice.appliedVoucher) {
      const minOrder = getVoucherMinOrder(invoice.appliedVoucher)
      if (newSubtotal < minOrder) {
        invoice.appliedVoucher = null
        invoice.voucherInput = ''
      }
    }

    autoPickBestEligibleVoucher()
  })

  watch(processedVouchers, () => {
    autoPickBestEligibleVoucher()
  })

  async function refreshInventory () {
    try {
      const [variantData, productData, colorData, sizeData] = await Promise.all([
        adminApi.getVariants({ page: 0, size: 1000 }).catch(() => []),
        adminApi.getProducts({ page: 0, size: 1000 }).catch(() => []),
        colorsApi?.getAll ? colorsApi.getAll().catch(() => []) : Promise.resolve([]),
        sizesApi?.getAll ? sizesApi.getAll().catch(() => []) : Promise.resolve([]),
      ])

      const rawVariants = toList(variantData)
      const rawProducts = toList(productData)
      const rawColors = toList(colorData)
      const rawSizes = toList(sizeData)

      const productMap = new Map()
      for (const product of rawProducts) {
        if (product && product.id != null) productMap.set(Number(product.id), product)
      }

      const colorMap = new Map()
      for (const color of rawColors) {
        if (color && color.id != null) colorMap.set(Number(color.id), color)
      }

      const sizeMap = new Map()
      for (const size of rawSizes) {
        if (size && size.id != null) sizeMap.set(Number(size.id), size)
      }

      const productGroup = new Map()
      for (const variant of rawVariants) {
        const productId = Number(variant.productId || variant.product_id || 0)
        const colorId = Number(variant.colorId || variant.color_id || 0)
        const sizeId = Number(variant.sizeId || variant.size_id || 0)

        const product = productMap.get(productId) || {}
        const color = colorMap.get(colorId) || {}
        const size = sizeMap.get(sizeId) || {}

        const productName = variant.productName || variant.product_name || product.name || `Sản phẩm #${productId || '?'}`
        const variantModel = {
          ...variant,
          variantId: variant.id || variant.variantId || `${productId}-${colorId}-${sizeId}-${Math.random()}`,
          productName,
          productCode: variant.productCode || variant.product_code || product.productCode || product.product_code || '',
          variantCode: variant.variantCode || variant.variant_code || buildVariantCode(product.productCode || product.product_code, variant.colorName || variant.color_name || color.name, variant.sizeName || variant.size_name || size.name),
          colorName: variant.colorName || variant.color_name || color.name || 'Mặc định',
          sizeName: variant.sizeName || variant.size_name || size.name || 'Mặc định',
          price: Number(variant.price || 0),
          stockQuantity: Number(variant.stockQuantity || variant.stock_quantity || 0),
          imageUrl: variant.imageUrl || variant.image_url || product.imageUrl || product.image_url || null,
        }

        if (!productGroup.has(productId)) {
          productGroup.set(productId, {
            productId,
            productName,
            productCode: variantModel.productCode,
            imageUrl: variantModel.imageUrl,
            price: variantModel.price,
            variants: [],
          })
        }
        productGroup.get(productId).variants.push(variantModel)
      }

      inventoryVariants.value = Array.from(productGroup.values())
    } catch (error) {
      console.error('Lỗi tải dữ liệu POS:', error)
    }
  }

  onMounted(async () => {
    try {
      try {
        const voucherResponse = await voucherAPI.getAllVouchers(0, 100, 'createdAt', 'DESC')
        systemVouchers.value = toList(voucherResponse).filter(voucher => isVoucherActive(voucher))
      } catch (error) {
        console.warn('Không tải được danh sách voucher', error)
        systemVouchers.value = []
      }

      await refreshInventory()
      restorePendingInvoices()
    } catch (error) {
      console.error('Lỗi tải dữ liệu POS:', error)
    }
  })
  onBeforeUnmount(() => {
    if (qrScanner.value) {
      try {
        qrScanner.value.stop().catch(() => {})
        qrScanner.value.clear().catch(() => {})
      } catch {}
      qrScanner.value = null
    }
  })
  const filteredVariants = computed(() => {
    const query = String(searchQuery.value || '').toLowerCase().trim()
    if (!query) return inventoryVariants.value

    return inventoryVariants.value.filter(product => {
      const name = String(product.productName || '').toLowerCase()
      const codeMatches = product.variants.some(variant => String(variant.productCode || variant.product_code || '').toLowerCase().includes(query))
      return name.includes(query) || codeMatches
    })
  })

  function addInvoice () {
    if (invoices.value.length >= MAX_INVOICES) {
      alert('Chỉ được tạo tối đa 5 hóa đơn cùng lúc.')
      return
    }
    const newInvoice = createNewInvoice()
    invoices.value.push(newInvoice)
    activeInvoiceId.value = newInvoice.id
  }

  function removeInvoice (invoiceId) {
    const invoice = invoices.value.find(entry => entry.id === invoiceId)
    if (!invoice || invoice.orderId) return

    invoices.value = invoices.value.filter(entry => entry.id !== invoiceId)
    if (invoices.value.length === 0) {
      const newInvoice = createNewInvoice()
      invoices.value = [newInvoice]
      activeInvoiceId.value = newInvoice.id
      return
    }
    if (activeInvoiceId.value === invoiceId) activeInvoiceId.value = invoices.value[0].id
  }

  function resetInvoice () {
    const invoice = activeInvoice.value
    if (!invoice) return
    invoice.customer = { ...POS_DEFAULT_CUSTOMER }
    invoice.voucherInput = ''
    invoice.appliedVoucher = null
    invoice.cart = []
    invoice.paymentMethodId = 1
    invoice.digitalPaymentMethodId = 4
    invoice.customerPaid = 0
    invoice.orderId = null
    invoice.orderCode = null
  }

  function removeFromCart (cartItemId) {
    if (!activeInvoice.value) return
    const item = activeInvoice.value.cart.find(entry => entry.cartItemId === cartItemId)
    if (!item) return
    activeInvoice.value.cart = activeInvoice.value.cart.filter(entry => entry.cartItemId !== cartItemId)
  }

  async function addToCart (product) {
    if (!activeInvoice.value) return

    const defaultVariant = product.variants.find(variant => Number(variant.stockQuantity || 0) > 0) || product.variants[0]
    if (!defaultVariant || Number(defaultVariant.stockQuantity || 0) <= 0) {
      alert('Sản phẩm này đã hết hàng!')
      return
    }

    // Query real-time stock from backend to ensure accurate availability
    let maxStock = Number(defaultVariant.stockQuantity || 0)
    try {
      const realStock = await stockApi.getVariantStock(defaultVariant.variantId)
      if (Number(realStock) >= 0) {
        maxStock = Number(realStock)
      }
    } catch (error) {
      console.warn('POS real-time stock check failed, using local stock:', error)
    }

    if (maxStock <= 0) {
      alert('Sản phẩm này đã hết hàng!')
      return
    }

    const variantId = defaultVariant.variantId
    const existing = activeInvoice.value.cart.find(item => item.variantId === variantId)
    if (existing) {
      if (existing.quantity >= maxStock) {
        alert(`Không thêm được nữa, sản phẩm này chỉ còn ${maxStock} trong kho`)
        existing.quantity = maxStock
        return
      }
      const nextQuantity = Math.min(existing.quantity + 1, maxStock)
      existing.quantity = nextQuantity
      return
    }

    activeInvoice.value.cart.push({
      cartItemId: `${Date.now()}-${Math.random()}`,
      product,
      variantId,
      quantity: 1,
      price: Number(defaultVariant.price || 0),
    })
  }

  function getVariant (item) {
    return item.product.variants.find(variant => variant.variantId === item.variantId)
      || item.product.variants[0]
      || { price: 0, stockQuantity: 0 }
  }

  async function updateQuantity (item, change) {
    const variant = getVariant(item)
    let maxStock = Number(variant.stockQuantity || 0)
    try {
      const realStock = await stockApi.getVariantStock(item.variantId)
      if (Number(realStock) >= 0) maxStock = Number(realStock)
    } catch (error) {
      console.warn('POS updateQuantity stock check failed, using local:', error)
    }
    const newQty = Number(item.quantity || 0) + change
    if (newQty < 1) return
    if (newQty > maxStock) {
      alert(`Không thêm được nữa, sản phẩm này chỉ còn ${maxStock} trong kho`)
      item.quantity = maxStock
      return
    }
    item.quantity = newQty
  }

  async function validateQuantity (item) {
    const variant = getVariant(item)
    let maxStock = Number(variant.stockQuantity || 0)
    try {
      const realStock = await stockApi.getVariantStock(item.variantId)
      if (Number(realStock) >= 0) maxStock = Number(realStock)
    } catch (error) {
      console.warn('POS validateQuantity stock check failed, using local:', error)
    }
    const requestedQuantity = Math.max(1, Number(item.quantity) || 1)
    if (requestedQuantity > maxStock) {
      alert(`Số lượng vượt quá tồn kho, chỉ còn ${maxStock}`)
      item.quantity = maxStock
      return
    }
    item.quantity = requestedQuantity
  }

  function applySpecificVoucher (voucher) {
    if (!activeInvoice.value) return
    if (!voucher.isEligible) {
      alert(`Đơn hàng cần đạt tối thiểu ${formatMoney(getVoucherMinOrder(voucher))} để áp dụng mã này!`)
      return
    }
    const usage = getVoucherUsageState(voucher)
    if (usage.exhausted) {
      alert('Mã voucher này đã hết lượt sử dụng.')
      return
    }
    activeInvoice.value.voucherPreference = 'auto'
    activeInvoice.value.appliedVoucher = voucher
    activeInvoice.value.voucherInput = voucher.code || ''
  }

  async function applyVoucherByInput () {
    if (!activeInvoice.value) return
    const code = String(activeInvoice.value.voucherInput || '').trim().toUpperCase()
    if (!code) return

    if (activeSubtotal.value === 0) {
      alert('Vui lòng thêm sản phẩm vào giỏ hàng trước khi nhập mã!')
      return
    }

    const found = processedVouchers.value.find(voucher => String(voucher.code || '').toUpperCase() === code)
    if (!found) {
      alert('Mã giảm giá không tồn tại!')
      return
    }

    if (!found.isEligible) {
      alert(`Đơn hàng cần đạt tối thiểu ${formatMoney(getVoucherMinOrder(found))} để áp dụng mã này!`)
      return
    }

    try {
      const validated = await voucherAPI.applyVoucher(code, activeSubtotal.value)
      const usage = getVoucherUsageState({ ...found, ...validated })
      if (usage.exhausted) {
        throw new Error('Mã voucher này đã hết lượt sử dụng.')
      }
      activeInvoice.value.voucherPreference = 'auto'
      activeInvoice.value.appliedVoucher = {
        ...found,
        ...validated,
        code: validated.code || found.code || code,
      }
      activeInvoice.value.voucherInput = activeInvoice.value.appliedVoucher.code || code
    } catch (error) {
      console.warn('Không thể xác thực voucher từ API, dùng dữ liệu gợi ý cục bộ.', error)
      const usage = getVoucherUsageState(found)
      if (usage.exhausted) {
        alert('Mã voucher này đã hết lượt sử dụng.')
        return
      }
      activeInvoice.value.appliedVoucher = found
      activeInvoice.value.voucherInput = found.code || ''
    }
  }

  function removeVoucher () {
    if (!activeInvoice.value) return
    activeInvoice.value.voucherPreference = 'none'
    activeInvoice.value.appliedVoucher = null
    activeInvoice.value.voucherInput = ''
  }

  function formatMoney (value) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value) || 0)
  }

  function escapeHtml (value) {
    return String(value ?? '').replace(/[&<>"']/g, character => {
      if (character === '&') return '&amp;'
      if (character === '<') return '&lt;'
      if (character === '>') return '&gt;'
      if (character === '"') return '&quot;'
      return '&#39;'
    })
  }

  function applyDefaultPosCustomer (invoice) {
    if (!invoice) return
    if (!invoice.customer || typeof invoice.customer !== 'object') {
      invoice.customer = { ...POS_DEFAULT_CUSTOMER }
      return
    }
    invoice.customer.fullname = POS_DEFAULT_CUSTOMER.fullname
    invoice.customer.phone = POS_DEFAULT_CUSTOMER.phone
    invoice.customer.email = POS_DEFAULT_CUSTOMER.email
  }

  function validateInvoiceBeforeSubmit (invoice) {
    if (!invoice) {
      return 'Không tìm thấy hóa đơn hiện tại.'
    }
    if (!Array.isArray(invoice.cart) || invoice.cart.length === 0) {
      return 'Vui lòng thêm ít nhất một sản phẩm vào giỏ hàng.'
    }
    if (invoice.paymentMethodId === 1 && Number(invoice.customerPaid || 0) < activeTotal.value) {
      return 'Tiền khách đưa không đủ! Vui lòng nhập số tiền khách trả.'
    }

    for (const item of invoice.cart) {
      const variant = getVariant(item)
      const quantity = Number(item.quantity || 0)
      const stockQuantity = Number(variant.stockQuantity || 0)
      if (!variant) {
        return 'Có biến thể sản phẩm không hợp lệ trong giỏ hàng.'
      }
      if (quantity < 1) {
        return 'Số lượng sản phẩm phải lớn hơn 0.'
      }
      if (stockQuantity > 0 && quantity > stockQuantity) {
        return `Sản phẩm ${item.product?.productName || 'đang chọn'} vượt quá tồn kho hiện tại.`
      }
    }

    return ''
  }

  function resolveEffectivePaymentMethodId (invoice) {
    if (!invoice || invoice.paymentMethodId === 1) return 1
    const selected = Number(invoice.digitalPaymentMethodId || 4)
    return Number.isFinite(selected) ? selected : 4
  }

  function getPaymentMethodLabel (invoice) {
    if (!invoice) return 'Tiền mặt'
    if (Number(invoice.paymentMethodId) === 1) return 'Tiền mặt'
    const selected = digitalPaymentMethods.find(method => Number(method.id) === Number(invoice.digitalPaymentMethodId))
    return selected ? selected.name : 'Chuyển khoản'
  }

  function buildReceiptSnapshot (invoice, orderData, returnedOrderId, returnedOrderCode) {
    const items = invoice.cart.map(item => {
      const variant = getVariant(item)
      const price = Number(variant.price || 0)
      const quantity = Number(item.quantity || 0)
      return {
        key: item.cartItemId,
        productName: item.product?.productName || item.product?.name || 'Sản phẩm',
        productCode: variant.variantCode || buildVariantCode(item.product && item.product.productCode, variant.colorName, variant.sizeName), variantColor: variant.colorName, variantSize: variant.sizeName,
        variantName: [variant.colorName, variant.sizeName].filter(Boolean).join(' / ') || 'Phiên bản mặc định',
        quantity,
        price,
        lineTotal: price * quantity,
      }
    })

    const customerPaid = Number(invoice.customerPaid || 0)
    return {
      orderId: returnedOrderId || null,
      orderCode: returnedOrderCode || null,
      createdAt: new Date().toISOString(),
      customer: {
        fullname: invoice.customer.fullname,
        phone: invoice.customer.phone,
        email: invoice.customer.email || '',
      },
      shippingAddress: orderData.shippingAddress,
      paymentMethodLabel: getPaymentMethodLabel(invoice),
      voucherCode: invoice.appliedVoucher ? invoice.appliedVoucher.code : null,
      storeName: 'SportX',
      subtotal: activeSubtotal.value,
      discount: activeDiscount.value,
      total: activeTotal.value,
      customerPaid,
      changeDue: Math.max(0, customerPaid - activeTotal.value),
      items,
    }
  }

  function printReceipt (receipt) {
    if (!receipt) return

    const receiptId = receipt.orderCode || (receipt.orderId ? `HD${receipt.orderId}` : 'POS')
    const itemRows = receipt.items
      .map(
        item => `
        <tr>
          <td>${escapeHtml(item.productName)}<div class="muted">Mã SP: ${escapeHtml(item.productCode || '--')}</div><div class="muted">${escapeHtml(item.variantName)}</div></td>
          <td class="center">${escapeHtml(item.quantity)}</td>
          <td class="right">${escapeHtml(formatMoney(item.price))}</td>
          <td class="right">${escapeHtml(formatMoney(item.lineTotal))}</td>
        </tr>`,
      )
      .join('')

    const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Hóa đơn ${escapeHtml(receiptId)}</title>
        <style>
          @page { size: 80mm auto; margin: 8mm; }
          body { font-family: Arial, sans-serif; color: #0f172a; margin: 0; background: #fff; }
          .sheet { max-width: 320px; margin: 0 auto; border: 1px solid #cbd5e1; border-radius: 12px; overflow: hidden; }
          .header { padding: 14px 14px 12px; text-align: center; background: linear-gradient(180deg, #eff6ff 0%, #ffffff 100%); border-bottom: 1px solid #cbd5e1; }
          h1 { font-size: 20px; margin: 0; text-align: center; letter-spacing: 0.06em; }
          .brand { margin-top: 4px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: #2563eb; font-weight: 700; }
          .muted { font-size: 11px; color: #64748b; }
          .section { padding: 12px 14px; }
          .meta { font-size: 12px; margin: 3px 0; }
          .divider { border-top: 1px dashed #cbd5e1; margin: 0 14px; }
          .title-row { display: flex; justify-content: space-between; gap: 12px; align-items: center; }
          .badge { display: inline-block; padding: 4px 8px; border: 1px solid #93c5fd; border-radius: 999px; color: #1d4ed8; font-size: 11px; font-weight: 700; background: #eff6ff; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
          thead th { border-bottom: 1px solid #cbd5e1; padding: 8px 0; }
          th, td { padding: 7px 0; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
          th { text-align: left; font-size: 11px; color: #64748b; }
          tbody tr:last-child td { border-bottom: none; }
          .line-item { padding-top: 4px; }
          .right { text-align: right; }
          .center { text-align: center; }
          .summary { margin-top: 10px; font-size: 12px; border: 1px solid #dbeafe; border-radius: 10px; background: #f8fbff; padding: 10px 12px; }
          .summary div { display: flex; justify-content: space-between; gap: 12px; margin: 4px 0; }
          .summary .total { margin-top: 8px; padding-top: 8px; border-top: 1px dashed #93c5fd; font-weight: 800; font-size: 13px; }
          .footer { padding: 12px 14px 14px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px dashed #cbd5e1; }
          .footer strong { display: block; color: #0f172a; margin-bottom: 4px; }
        </style>
      </head>
      <body>
        <div class="sheet">
          <div class="header">
            <div class="brand">${escapeHtml(receipt.storeName || 'SportX')}</div>
            <h1>HÓA ĐƠN</h1>
            <div class="muted">HÓA ĐƠN THANH TOÁN</div>
          </div>
          <div class="section">
            <div class="title-row">
              <div>
                <div class="meta"><strong>Mã:</strong> ${escapeHtml(receiptId)}</div>
                <div class="meta"><strong>Thời gian:</strong> ${escapeHtml(new Date(receipt.createdAt).toLocaleString('vi-VN'))}</div>
              </div>
              <span class="badge">ĐÃ THANH TOÁN</span>
            </div>
          </div>
          <div class="divider"></div>
          <div class="section">
            <div class="meta"><strong>Thanh toán:</strong> ${escapeHtml(receipt.paymentMethodLabel)}</div>
            <div class="meta"><strong>Địa chỉ:</strong> ${escapeHtml(receipt.shippingAddress)}</div>
            <div class="meta"><strong>Voucher:</strong> ${escapeHtml(receipt.voucherCode || 'None')}</div>
          </div>
          <div class="divider"></div>
          <div class="section">
            <table>
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th class="center">SL</th>
                  <th class="right">ĐG</th>
                  <th class="right">TT</th>
                </tr>
              </thead>
              <tbody>
                ${itemRows}
              </tbody>
            </table>
            <div class="summary">
              <div><span>Tạm tính</span><span>${escapeHtml(formatMoney(receipt.subtotal))}</span></div>
              <div><span>Giảm giá</span><span>${escapeHtml(formatMoney(receipt.discount))}</span></div>
              <div class="total"><span>Phải thanh toán</span><span>${escapeHtml(formatMoney(receipt.total))}</span></div>
              <div><span>Khách đưa</span><span>${escapeHtml(formatMoney(receipt.customerPaid))}</span></div>
              <div><span>Tiền thừa</span><span>${escapeHtml(formatMoney(receipt.changeDue))}</span></div>
            </div>
          </div>
          <div class="footer"><strong>SportX</strong>Cảm ơn quý khách đã mua hàng</div>
        </div>
      </body>
    </html>`

    const printWindow = window.open('', '_blank', 'width=420,height=760')
    if (!printWindow) {
      alert('Trình duyệt đã chặn cửa sổ in. Vui lòng cho phép pop-up để in hóa đơn.')
      return
    }

    printWindow.document.open()
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    printWindow.addEventListener('load', () => {
      printWindow.print()
    })
  }

  function closeReceipt () {
    showReceipt.value = false
  }

  function closePaymentDialog () {
    paymentDialog.value = null
  }

  function showPaymentDialog (config) {
    paymentDialog.value = {
      type: config.type || 'error',
      title: config.title || '',
      message: config.message || '',
      primaryLabel: config.primaryLabel || 'Tiếp tục',
      secondaryLabel: config.secondaryLabel || 'Đóng',
      details: config.details || null,
      onPrimary: typeof config.onPrimary === 'function' ? config.onPrimary : null,
    }
  }

  function handlePaymentDialogPrimary () {
    const dialog = paymentDialog.value
    if (dialog?.onPrimary) {
      dialog.onPrimary()
    }
    paymentDialog.value = null
  }

  async function processOrder (invoice) {
    if (!invoice) return

    applyDefaultPosCustomer(invoice)

    // ── STOCK VALIDATION: Kiểm tra tồn kho trước khi tạo đơn POS ──
    const stockCheckItems = invoice.cart.map(item => {
      const variant = getVariant(item)
      return {
        variantId: item.variantId,
        quantity: Number(item.quantity || 0),
        productName: item.product?.productName || item.product?.name || 'Sản phẩm',
      }
    })
    try {
      const stockResult = await stockApi.checkStock(stockCheckItems)
      if (!stockResult.valid) {
        const errorMsg = stockResult.errors.map(e => e.message).join('\n')
        showPaymentDialog({
          type: 'error',
          title: 'Hết hàng',
          message: `Một số sản phẩm không còn đủ tồn kho:\n${errorMsg}`,
          primaryLabel: 'Quay lại sửa',
          secondaryLabel: 'Đóng',
        })
        return
      }
    } catch (error) {
      console.warn('POS stock check failed, proceeding:', error)
    }
    // ── End STOCK VALIDATION ──

    isProcessing.value = true
    try {
      let adminId = 1
      try {
        const userString = localStorage.getItem('user')
        if (userString) {
          const userObject = JSON.parse(userString)
          adminId = Number(userObject.id || userObject.accountId || userObject.account_id || 1)
        }
      } catch (error) {
        console.warn('Không lấy được user từ localStorage', error)
      }

      const orderData = {
        accountId: adminId,
        orderSource: 'POS',
        salesChannel: 'IN_STORE',
        fullname: invoice.customer.fullname,
        phone: invoice.customer.phone,
        email: invoice.customer.email || 'khachle@peakseven.com',
        shippingAddress: 'Mua trực tiếp tại cửa hàng',
        paymentMethodId: resolveEffectivePaymentMethodId(invoice),
        voucherCode: invoice.appliedVoucher ? invoice.appliedVoucher.code : null,
        stockAlreadyDeducted: false,
        items: invoice.cart.map(item => ({
          variantId: item.variantId,
          price: Number(getVariant(item).price || 0),
          quantity: Number(item.quantity || 0),
        })),
      }

      const token = localStorage.getItem('token')
      const headers = {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      }

      const response = await axios.post('http://localhost:8080/api/orders', orderData, { headers })
      const returnedOrderId = response.data?.orderId || response.data?.id || null
      const returnedOrderCode = response.data?.orderCode || (returnedOrderId ? `HD${returnedOrderId}` : null)

      if (returnedOrderId) {
        invoice.orderId = returnedOrderId
        invoice.orderCode = returnedOrderCode
        await axios.put(
          `http://localhost:8080/api/orders/${returnedOrderId}`,
          { status: 'SUCCESS', paymentStatus: 'PAID' },
          { headers },
        )
      }

      lastReceipt.value = buildReceiptSnapshot(invoice, orderData, returnedOrderId, returnedOrderCode)
      showReceipt.value = true

      // Refresh inventory to update stock numbers after order
      refreshInventory().catch(() => {})

      // Reset giỏ hàng POS ngay sau khi thanh toán thành công (không cần F5)
      invoice.cart = []
      invoice.customer = { ...POS_DEFAULT_CUSTOMER }
      invoice.voucherInput = ''
      invoice.appliedVoucher = null
      invoice.voucherPreference = 'auto'
      invoice.customerPaid = 0
      const freshInvoice = createNewInvoice()
      invoices.value = [...invoices.value, freshInvoice]
      activeInvoiceId.value = freshInvoice.id
    } catch (error) {
      console.error('Lỗi thanh toán:', error)
      const message = error.response?.data?.message || error.message || 'Không xác định'
      showPaymentDialog({
        type: 'error',
        title: 'Thanh toán thất bại',
        message,
        primaryLabel: 'Đóng',
        secondaryLabel: 'Đóng',
      })
    } finally {
      isProcessing.value = false
    }
  }

  async function handlePlaceOrder () {
    const invoice = activeInvoice.value
    if (!invoice) return

    const validationMessage = validateInvoiceBeforeSubmit(invoice)
    if (validationMessage) {
      showPaymentDialog({
        type: 'error',
        title: 'Kiểm tra thông tin trước khi thanh toán',
        message: validationMessage,
        primaryLabel: 'Quay lại sửa',
        secondaryLabel: 'Đóng',
      })
      return
    }

    showPaymentDialog({
      type: 'confirm',
      title: 'Xác nhận tạo hóa đơn',
      message: 'Bạn có chắc chắn muốn tạo đơn này không?',
      primaryLabel: 'Tạo đơn',
      secondaryLabel: 'Quay lại sửa',
      details: {
        total: activeTotal.value,
        itemCount: invoice.cart.length,
      },
      onPrimary: () => {
        void processOrder(invoice)
      },
    })
  }
  function startQrScanner () {
    if (inventoryVariants.value.length === 0) {
      alert('Dữ liệu sản phẩm chưa được tải, vui lòng thử lại sau.')
      return
    }

    if (qrScanner.value) {
      stopQrScanner()
    }

    qrScannerVisible.value = true
    qrScanError.value = ''
    isScannerStopping = false

    nextTick(() => {
      const element = document.querySelector('#qr-reader')
      if (!element) {
        qrScanError.value = 'Không tìm thấy phần tử quét QR.'
        return
      }

      element.innerHTML = ''

      try {
        const scanner = new Html5Qrcode('qr-reader')
        qrScanner.value = scanner

        const config = {
          fps: 20,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
        }

        scanner.start(
          { facingMode: 'environment' },
          config,
          onQrScanSuccess,
          onQrScanError,
        ).catch(error => {
          qrScanError.value = 'Không thể khởi tạo camera: ' + error.message
          console.error(error)
          qrScannerVisible.value = false
          qrScanner.value = null
        })
      } catch (error) {
        qrScanError.value = 'Lỗi tạo scanner: ' + error.message
        console.error(error)
        qrScannerVisible.value = false
      }
    })
  }

  async function stopQrScanner () {
    if (isScannerStopping) return
    isScannerStopping = true

    const scanner = qrScanner.value
    qrScanner.value = null

    if (scanner) {
      try {
        await scanner.stop().catch(() => {})
        await scanner.clear().catch(() => {})
      } catch {}
    }

    isScannerStopping = false
    qrScannerVisible.value = false
  }

  async function onQrScanSuccess (decodedText) {
    await stopQrScanner()
    handleQrData(decodedText)
  }

  function onQrScanError () {}

  function handleQrData (decodedText) {
    if (!decodedText) return

    const rawText = decodedText.trim().replace(/\/+$/, '')

    let productId = null
    const match = rawText.match(/(\d+)$/)

    productId = match ? Number(match[1]) : Number(rawText)

    if (!productId || isNaN(productId) || productId <= 0) {
      alert('Mã QR không hợp lệ (không tìm thấy ID sản phẩm).')
      return
    }

    let foundProduct = null
    for (const product of inventoryVariants.value) {
      if (Number(product.productId) === productId || Number(product.id) === productId) {
        foundProduct = product
        break
      }
    }

    if (!foundProduct) {
      alert(`Không tìm thấy sản phẩm với ID #${productId}.`)
      return
    }

    addToCart(foundProduct)
  }

  function toList (rawValue) {
    if (Array.isArray(rawValue)) return rawValue
    if (rawValue == null) return []
    if (Array.isArray(rawValue.data)) return rawValue.data
    if (Array.isArray(rawValue.content)) return rawValue.content
    if (Array.isArray(rawValue.items)) return rawValue.items
    if (rawValue.data && Array.isArray(rawValue.data.content)) return rawValue.data.content
    if (rawValue.data && Array.isArray(rawValue.data.items)) return rawValue.data.items
    return [rawValue]
  }

  function createNewInvoice () {
    return {
      id: Date.now() + Math.floor(Math.random() * 10000),
      number: nextInvoiceNumber++,
      orderId: null,
      orderCode: null,
      customer: {
        ...POS_DEFAULT_CUSTOMER,
      },
      voucherInput: '',
      appliedVoucher: null,
      voucherPreference: 'auto',
      cart: [],
      paymentMethodId: 1,
      digitalPaymentMethodId: 4,
      customerPaid: 0,
    }
  }

  const digitalPaymentMethods = [
    { id: 2, name: 'VNPay' },
    { id: 3, name: 'Momo' },
    { id: 4, name: 'Chuyển khoản ngân hàng' },
    { id: 5, name: 'ZaloPay' },
  ]
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fadeInUp 0.4s ease-out forwards;
}

.money-input::-webkit-outer-spin-button,
.money-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.money-input {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
