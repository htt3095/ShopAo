<template>
  <AdminShell>
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-xs uppercase tracking-[0.18em] text-primary">Phân tích quản trị</p>
          <h2 class="mt-1 text-2xl font-bold">Báo cáo doanh thu kế toán</h2>
          <p class="mt-1 text-sm text-slate-500 ">
            Tổng quan đơn giản, rõ số liệu và in theo đúng bộ lọc hiện tại.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <details class="relative">
            <summary class="list-none inline-flex cursor-pointer items-center gap-2  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm font-medium hover:border-primary hover:text-primary ">
              <span class="material-symbols-outlined text-[18px]">download</span>
              Xuất dữ liệu
              <span class="material-symbols-outlined text-[16px]">expand_more</span>
            </summary>
            <div class="absolute right-0 z-20 mt-2 w-56 overflow-hidden  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 shadow-xl ">
              <button type="button" class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-white" @click="exportSummaryCsv">
                <span class="material-symbols-outlined text-[16px]">overview</span>
                CSV tóm tắt
              </button>
              <button type="button" class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-white" @click="exportCurrentCsv">
                <span class="material-symbols-outlined text-[16px]">table_chart</span>
                CSV chi tiết
              </button>
              <button type="button" class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-white" @click="exportAuditCsv">
                <span class="material-symbols-outlined text-[16px]">fact_check</span>
                CSV kiểm toán
              </button>
            </div>
          </details>

          <button
            type="button"
            class="inline-flex items-center gap-2  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm font-medium hover:border-primary hover:text-primary "
            @click="printReport"
          >
            <span class="material-symbols-outlined text-[18px]">print</span>
            In báo cáo
          </button>

          <button
            type="button"
            class="inline-flex items-center gap-2  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm font-medium hover:border-primary hover:text-primary "
            @click="loadReport"
          >
            <span class="material-symbols-outlined text-[18px]">refresh</span>
            Làm mới
          </button>
        </div>
      </div>
    </template>

    <div class="space-y-6">
      <div v-if="error" class="retail-card border-red-200 bg-red-50 p-4 text-sm text-red-700 /40 /20 ">
        {{ error }}
      </div>

      <section class="retail-card p-4">
        <div class="grid gap-3 xl:grid-cols-5">
          <label class="flex min-w-0 flex-col gap-1 text-xs font-medium uppercase tracking-wide text-slate-500 ">
            Xem theo
            <select v-model="reportMode" class=" shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm font-medium text-slate-900 ">
              <option value="day">Theo ngày</option>
              <option value="week">Theo tuần</option>
              <option value="month">Theo tháng</option>
              <option value="year">Theo năm</option>
            </select>
          </label>

          <label class="flex min-w-0 flex-col gap-1 text-xs font-medium uppercase tracking-wide text-slate-500 ">
            Từ ngày
            <input v-model="startDateInput" type="date" class=" shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm font-medium text-slate-900 " />
          </label>

          <label class="flex min-w-0 flex-col gap-1 text-xs font-medium uppercase tracking-wide text-slate-500 ">
            Đến ngày
            <input v-model="endDateInput" type="date" class=" shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm font-medium text-slate-900 " />
          </label>

          <label class="flex min-w-0 flex-col gap-1 text-xs font-medium uppercase tracking-wide text-slate-500 ">
            Thanh toán
            <select v-model="paymentFilter" class=" shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm font-medium text-slate-900 ">
              <option value="ALL">Tất cả</option>
              <option value="DA_THANH_TOAN">Đã thanh toán</option>
              <option value="HOAN_TIEN">Hoàn tiền</option>
              <option value="CHUA_THANH_TOAN">Chưa thanh toán</option>
            </select>
          </label>

          <label class="flex min-w-0 flex-col gap-1 text-xs font-medium uppercase tracking-wide text-slate-500 ">
            Thứ tự hiển thị
            <select v-model="bucketSort" class=" shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm font-medium text-slate-900 ">
              <option value="newest">Mới nhất ở trên</option>
              <option value="oldest">Cũ nhất ở trên</option>
            </select>
          </label>
        </div>

        <div class="mt-3 flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500 ">Khoảng nhanh</span>
          <button
            v-for="preset in reportPresets"
            :key="preset.value"
            type="button"
            class="rounded-lg border px-2.5 py-1 text-xs font-semibold transition"
            :class="reportPreset === preset.value ? 'border-primary bg-primary text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-primary hover:text-primary '"
            @click="applyReportPreset(preset.value)"
          >
            {{ preset.label }}
          </button>
        </div>
      </section>

      <section class="retail-card p-5">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold">Tổng quan</h3>
          <span class="text-xs uppercase tracking-wide text-slate-500 ">{{ selectedRangeText }}</span>
        </div>

        <div class="overflow-hidden rounded-2xl border border-slate-200 ">
          <table class="w-full text-sm">
            <tbody>
              <tr class="border-b border-slate-200 dark:border-[#3c342e]"><td class="px-4 py-3 text-slate-500 dark:text-[#b9aa9a]">Tổng đơn</td><td class="px-4 py-3 text-right font-semibold">{{ filteredOrders.length }}</td></tr>
              <tr class="border-b border-slate-200 dark:border-[#3c342e]"><td class="px-4 py-3 text-slate-500 dark:text-[#b9aa9a]">Đơn đã thanh toán</td><td class="px-4 py-3 text-right font-semibold">{{ paidOrdersCount }}</td></tr>
              <tr class="border-b border-slate-200 dark:border-[#3c342e]"><td class="px-4 py-3 text-slate-500 dark:text-[#b9aa9a]">Đơn chưa thanh toán</td><td class="px-4 py-3 text-right font-semibold">{{ unpaidOrdersCount }}</td></tr>
              <tr class="border-b border-slate-200 dark:border-[#3c342e]"><td class="px-4 py-3 text-slate-500 dark:text-[#b9aa9a]">Đơn hoàn tiền</td><td class="px-4 py-3 text-right font-semibold">{{ refundedOrdersCount }}</td></tr>
              <tr class="border-b border-slate-200 dark:border-[#3c342e]"><td class="px-4 py-3 text-slate-500 dark:text-[#b9aa9a]">Doanh thu vào</td><td class="px-4 py-3 text-right font-semibold">{{ formatCurrency(filteredProfitRevenue) }}</td></tr>
              <tr class="border-b border-slate-200 dark:border-[#3c342e]"><td class="px-4 py-3 text-slate-500 dark:text-[#b9aa9a]">Hoàn tiền</td><td class="px-4 py-3 text-right font-semibold text-red-500 dark:text-red-400">{{ formatCurrency(Math.abs(filteredRefundRevenue)) }}</td></tr>
              <tr class="border-b border-slate-200 bg-slate-50 dark:border-[#3c342e] dark:bg-[#181310]"><td class="px-4 py-3 font-semibold">Doanh thu ròng</td><td class="px-4 py-3 text-right font-bold" :class="filteredNetRevenue >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'">{{ formatCurrency(filteredNetRevenue) }}</td></tr>
              <tr><td class="px-4 py-3 text-slate-500 dark:text-[#b9aa9a]">Trung bình mỗi đơn</td><td class="px-4 py-3 text-right font-semibold">{{ formatCurrency(averageOrderValue) }}</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="retail-card p-5">
        <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 class="text-lg font-semibold">Phân tích trực quan</h3>
            <p class="text-sm text-slate-500 ">Chi tiết theo chỉ số, có nhiều loại chart nhưng giữ bố cục gọn để đọc nhanh.</p>
          </div>
          <div class="text-right space-y-2">
            <div class="inline-flex  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 p-1 ">
              <button
                v-for="item in reportMetricOptions"
                :key="item.value"
                type="button"
                class="rounded-lg px-2.5 py-1 text-xs font-semibold transition"
                :class="reportChartMetric === item.value ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100 dark:hover:bg-white'"
                @click="reportChartMetric = item.value"
              >
                {{ item.label }}
              </button>
            </div>
            <p class="text-xs text-slate-500 ">Tổng chỉ số đang xem</p>
            <p class="font-semibold" :style="{ color: reportMetricColor }">{{ reportMetricTotalFormatted }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <div class="space-y-4">
            <div class="overflow-x-auto rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4 dark:from-[#1f1a17] dark:to-[#181310]">
              <svg viewBox="0 0 640 240" class="h-full min-h-[250px] w-full" preserveAspectRatio="none">
                <line x1="24" y1="200" x2="616" y2="200" stroke="rgba(148,163,184,0.35)" stroke-width="1" />
                <line x1="24" y1="24" x2="24" y2="200" stroke="rgba(148,163,184,0.2)" stroke-width="1" />
                <g v-for="bar in reportBarSeries" :key="bar.key">
                  <rect :x="bar.x" :y="bar.y" :width="bar.width" :height="bar.height" rx="6" :fill="bar.fill" opacity="0.86" />
                  <text :x="bar.x + (bar.width / 2)" y="218" text-anchor="middle" fill="currentColor" class="fill-slate-500 text-[10px] dark:fill-[#b9aa9a]">
                    {{ bar.label }}
                  </text>
                </g>
                <path :d="reportTrendPath" fill="none" :stroke="reportMetricColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                <g v-for="point in reportLinePoints" :key="point.key">
                  <circle :cx="point.x" :cy="point.y" r="4" fill="#fff" :stroke="reportMetricColor" stroke-width="2.2" />
                </g>
              </svg>
            </div>

            <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <div v-for="bucket in reportHighlights" :key="bucket.key" class="min-w-0 rounded-xl border border-slate-200 px-3 py-3 ">
                <p class="truncate text-xs uppercase tracking-wide text-slate-500 ">{{ bucket.sublabel }}</p>
                <p class="mt-2 break-words text-sm font-semibold">{{ formatCurrency(bucket.netRevenue) }}</p>
                <p class="mt-1 text-xs text-slate-500 ">{{ bucket.orderCount }} đơn | Đã thanh toán {{ bucket.paidCount }} | Hoàn {{ bucket.refundedCount }}</p>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div class="rounded-2xl border border-slate-200 p-4 ">
              <div class="mb-3 flex items-center justify-between">
                <h4 class="font-semibold">Donut thanh toán</h4>
                <span class="text-xs text-slate-500 ">{{ filteredOrders.length }} đơn</span>
              </div>
              <div class="mx-auto flex h-40 w-40 items-center justify-center rounded-full" :style="paymentPieStyle">
                <div class="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-white text-center ">
                  <span class="text-[10px] uppercase tracking-wide text-slate-500 ">Tổng</span>
                  <span class="mt-1 text-xl font-bold">{{ filteredOrders.length }}</span>
                </div>
              </div>
            </div>

            <div class="rounded-2xl border border-slate-200 p-4 ">
              <h4 class="mb-3 font-semibold">Phân bố trạng thái đơn</h4>
              <div class="space-y-3">
                <div v-for="item in statusRowsWithShare" :key="item.status" class="space-y-1">
                  <div class="flex items-center justify-between text-sm">
                    <span>{{ item.label }}</span>
                    <span class="font-medium">{{ item.count }} ({{ item.share }}%)</span>
                  </div>
                  <div class="h-2 overflow-hidden rounded-full bg-slate-100 ">
                    <div class="h-full rounded-full bg-primary/80" :style="{ width: `${item.share}%` }" />
                  </div>
                </div>
              </div>
            </div>

            <div class="rounded-2xl border border-slate-200 p-4 dark:border-[#3c342e]" v-if="refundBreakdown.length > 0">
              <h4 class="mb-3 font-semibold text-red-500 dark:text-red-400">Chi tiết Hoàn tiền</h4>
              <div class="space-y-3">
                <div v-for="item in refundBreakdown" :key="item.method" class="space-y-1">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-slate-600 dark:text-[#b9aa9a]">{{ item.method }}</span>
                    <span class="font-medium text-red-500">{{ formatCurrency(item.amount) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section class="retail-card min-w-0 p-5">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-semibold">Bảng doanh thu {{ reportModeText }}</h3>
            <span class="text-xs uppercase tracking-wide text-slate-500 ">{{ selectedRangeText }}</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr class="border-b border-slate-200 text-slate-500 ">
                  <th class="px-2 py-3 font-medium">{{ reportColumnLabel }}</th>
                  <th class="px-2 py-3 font-medium">Từ ngày</th>
                  <th class="px-2 py-3 font-medium">Đến ngày</th>
                  <th class="px-2 py-3 font-medium">Tổng đơn</th>
                  <th class="px-2 py-3 font-medium">Đơn đã thanh toán</th>
                  <th class="px-2 py-3 font-medium">Đơn hoàn tiền</th>
                  <th class="px-2 py-3 font-medium">Doanh thu vào</th>
                  <th class="px-2 py-3 font-medium">Hoàn tiền</th>
                  <th class="px-2 py-3 font-medium">Doanh thu ròng</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in sortedActiveBuckets" :key="row.key" class="border-b border-slate-100 last:border-none ">
                  <td class="px-2 py-3 font-medium">{{ row.sublabel }}</td>
                  <td class="px-2 py-3">{{ formatDateCell(row.startDate) }}</td>
                  <td class="px-2 py-3">{{ formatDateCell(row.endDate) }}</td>
                  <td class="px-2 py-3">{{ row.orderCount }}</td>
                  <td class="px-2 py-3">{{ row.paidCount }}</td>
                  <td class="px-2 py-3">{{ row.refundedCount }}</td>
                  <td class="px-2 py-3">{{ formatCurrency(row.grossRevenue) }}</td>
                  <td class="px-2 py-3">{{ formatCurrency(row.refundedRevenue) }}</td>
                  <td class="px-2 py-3 font-semibold" :class="row.netRevenue >= 0 ? 'text-green-600 ' : 'text-red-500 '">{{ formatCurrency(row.netRevenue) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="retail-card min-w-0 p-5">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-semibold">Phân bố thanh toán</h3>
            <span class="text-xs uppercase tracking-wide text-slate-500 ">{{ filteredOrders.length }} đơn</span>
          </div>

          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-slate-200 text-slate-500 ">
                <th class="px-2 py-3 font-medium text-left">Nhóm</th>
                <th class="px-2 py-3 font-medium text-right">Số đơn</th>
                <th class="px-2 py-3 font-medium text-right">Tỷ lệ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in paymentBreakdownWithShare" :key="item.label" class="border-b border-slate-100 last:border-none ">
                <td class="px-2 py-3">{{ item.label }}</td>
                <td class="px-2 py-3 text-right">{{ item.count }}</td>
                <td class="px-2 py-3 text-right">{{ item.share }}%</td>
              </tr>
            </tbody>
          </table>

          <div class="mt-8 mb-4 flex items-center justify-between">
            <h3 class="text-lg font-semibold">Doanh thu theo PT thanh toán</h3>
          </div>

          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-slate-200 text-slate-500 dark:border-[#3c342e] dark:text-[#b9aa9a]">
                <th class="px-2 py-3 font-medium text-left">Phương thức</th>
                <th class="px-2 py-3 font-medium text-right">Doanh thu</th>
                <th class="px-2 py-3 font-medium text-right">Tỷ lệ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="method in paymentMethodBreakdown" :key="method.label" class="border-b border-slate-100 last:border-none dark:border-[#2b241f]">
                <td class="px-2 py-3">{{ method.label }}</td>
                <td class="px-2 py-3 text-right">
                  <div class="font-semibold">{{ formatCurrency(method.revenue) }}</div>
                  <div class="text-xs text-slate-500 dark:text-[#b9aa9a]">{{ method.count }} đơn</div>
                </td>
                <td class="px-2 py-3 text-right">{{ method.share }}%</td>
              </tr>
              <tr v-if="paymentMethodBreakdown.length === 0">
                <td class="px-2 py-3 text-center text-slate-500 dark:text-[#b9aa9a]" colspan="3">Chưa có dữ liệu</td>
              </tr>
            </tbody>
          </table>

          <div class="mt-4 overflow-hidden rounded-2xl border border-slate-200 dark:border-[#3c342e]">
            <table class="w-full text-sm">
              <tbody>
                <tr class="border-b border-slate-200 dark:border-[#3c342e]"><td class="px-4 py-3 text-slate-500 dark:text-[#b9aa9a]">Khoảng báo cáo</td><td class="px-4 py-3 text-right font-semibold">{{ selectedRangeText }}</td></tr>
                <tr class="border-b border-slate-200 dark:border-[#3c342e]"><td class="px-4 py-3 text-slate-500 dark:text-[#b9aa9a]">Doanh thu vào</td><td class="px-4 py-3 text-right font-semibold">{{ formatCurrency(filteredProfitRevenue) }}</td></tr>
                <tr class="border-b border-slate-200 dark:border-[#3c342e]"><td class="px-4 py-3 text-slate-500 dark:text-[#b9aa9a]">Hoàn tiền</td><td class="px-4 py-3 text-right font-semibold text-red-500 dark:text-red-400">{{ formatCurrency(Math.abs(filteredRefundRevenue)) }}</td></tr>
                <tr class="border-b border-slate-200 bg-slate-50 dark:border-[#3c342e] dark:bg-[#181310]"><td class="px-4 py-3 font-semibold">Lợi nhuận ròng kế toán</td><td class="px-4 py-3 text-right font-bold" :class="filteredNetRevenue >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'">{{ formatCurrency(filteredNetRevenue) }}</td></tr>
                <tr><td class="px-4 py-3 text-slate-500 dark:text-[#b9aa9a]">Tỷ lệ hoàn tiền</td><td class="px-4 py-3 text-right font-semibold">{{ refundRate }}%</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  </AdminShell>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";

import AdminShell from "@/components/admin/AdminShell.vue";
import { adminApi } from "@/services/api";
import {
  buildRevenueBuckets,
  filterOrdersByDateRange,
  filterOrdersByPayment,
  formatCurrency,
  formatLongDateTime,
  getPaymentBreakdown,
  getStatusBreakdown,
  normalizePaymentStatusValue,
  sortRevenueBuckets,
  sumNetRevenue,
  sumPositiveRevenue,
  sumRefundRevenue,
  getPaymentMethodBreakdown,
} from "@/utils/adminAnalytics";

const loading = ref(false);
const error = ref("");
const orders = ref([]);
const reportMode = ref("day");
const paymentFilter = ref("ALL");
const bucketSort = ref("newest");
const reportChartMetric = ref("net");
const reportPreset = ref("this_month");
const startDateInput = ref(defaultStartDateValue());
const endDateInput = ref(defaultEndDateValue());

const reportPresets = [
  { value: "7d", label: "7 ngày" },
  { value: "30d", label: "30 ngày" },
  { value: "qtd", label: "Quý này" },
  { value: "ytd", label: "Năm nay" },
  { value: "this_month", label: "Tháng này" },
];

function defaultEndDateValue() {
  return formatDateInput(new Date());
}

function defaultStartDateValue() {
  const today = new Date();
  return formatDateInput(new Date(today.getFullYear(), today.getMonth(), 1));
}

function formatDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateInput(value, fallbackDate) {
  if (!value) return new Date(fallbackDate);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return new Date(fallbackDate);
  return date;
}

function formatDateCell(value) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(value);
}

function createCsvContent(rows) {
  return `\uFEFF${rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(";"))
    .join("\r\n")}`;
}

function getOrderAmount(order) {
  const amount = Number(order?.finalAmount ?? order?.totalMoney ?? 0);
  return Number.isFinite(amount) ? Math.abs(amount) : 0;
}

function getOrderPaymentImpact(order) {
  const status = normalizePaymentStatusValue(order?.paymentStatus || null);
  const amount = getOrderAmount(order);

  if (["DA_THANH_TOAN", "PAID", "SETTLED", "CAPTURED"].includes(status)) {
    return amount;
  }
  if (["HOAN_TIEN", "REFUNDED", "REFUND", "CHARGEBACK", "REVERSED"].includes(status)) {
    return -amount;
  }
  return 0;
}

function paymentStatusText(value) {
  const status = normalizePaymentStatusValue(value || null);
  if (["DA_THANH_TOAN", "PAID", "SETTLED", "CAPTURED"].includes(status)) return "Đã thanh toán";
  if (["HOAN_TIEN", "REFUNDED", "REFUND", "CHARGEBACK", "REVERSED"].includes(status)) return "Hoàn tiền";
  return "Chưa thanh toán";
}

const selectedStartDate = computed(() => parseDateInput(startDateInput.value, new Date()));
const selectedEndDate = computed(() => parseDateInput(endDateInput.value, new Date()));

watch([startDateInput, endDateInput], () => {
  if (selectedStartDate.value.getTime() > selectedEndDate.value.getTime()) {
    endDateInput.value = startDateInput.value;
  }
  reportPreset.value = "custom";
});

function applyReportPreset(preset) {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let start = new Date(end);

  if (preset === "7d") {
    start.setDate(end.getDate() - 6);
    reportMode.value = "day";
  } else if (preset === "30d") {
    start.setDate(end.getDate() - 29);
    reportMode.value = "day";
  } else if (preset === "qtd") {
    const quarterStartMonth = Math.floor(end.getMonth() / 3) * 3;
    start = new Date(end.getFullYear(), quarterStartMonth, 1);
    reportMode.value = "month";
  } else if (preset === "ytd") {
    start = new Date(end.getFullYear(), 0, 1);
    reportMode.value = "month";
  } else {
    start = new Date(end.getFullYear(), end.getMonth(), 1);
    reportMode.value = "day";
  }

  reportPreset.value = preset;
  startDateInput.value = formatDateInput(start);
  endDateInput.value = formatDateInput(end);
}

const rangedOrders = computed(() => filterOrdersByDateRange(orders.value, selectedStartDate.value, selectedEndDate.value));
const filteredOrders = computed(() => filterOrdersByPayment(rangedOrders.value, paymentFilter.value));

const activeBuckets = computed(() => {
  return buildRevenueBuckets(filteredOrders.value, {
    mode: reportMode.value,
    startDate: selectedStartDate.value,
    endDate: selectedEndDate.value,
  });
});

const sortedActiveBuckets = computed(() => sortRevenueBuckets(activeBuckets.value, bucketSort.value));
const filteredNetRevenue = computed(() => sumNetRevenue(filteredOrders.value));
const filteredProfitRevenue = computed(() => sumPositiveRevenue(filteredOrders.value));
const filteredRefundRevenue = computed(() => sumRefundRevenue(filteredOrders.value));

const paymentBreakdown = computed(() => getPaymentBreakdown(filteredOrders.value));

const paymentBreakdownWithShare = computed(() => {
  const total = Math.max(filteredOrders.value.length, 1);
  return paymentBreakdown.value.map((item) => ({
    ...item,
    share: Math.round((item.count / total) * 100),
  }));
});

const statusBreakdown = computed(() => getStatusBreakdown(filteredOrders.value));

const refundBreakdown = computed(() => {
  const refunds = filteredOrders.value.filter(o => {
    const st = normalizePaymentStatusValue(o?.paymentStatus || null);
    return ["HOAN_TIEN", "REFUNDED", "REFUND", "CHARGEBACK", "REVERSED"].includes(st);
  });
  
  const groups = {};
  for (const r of refunds) {
    const method = r.paymentMethodName || r.paymentMethod || "Khác";
    const amount = Math.abs(Number(r.finalAmount ?? r.totalMoney ?? 0));
    groups[method] = (groups[method] || 0) + amount;
  }
  
  return Object.entries(groups).map(([method, amount]) => ({ method, amount })).sort((a,b) => b.amount - a.amount);
});

const reportMetricOptions = [
  { value: "net", label: "Ròng" },
  { value: "gross", label: "Doanh thu" },
  { value: "refund", label: "Hoàn" },
  { value: "orders", label: "Đơn" },
];

function getReportMetricValue(item) {
  if (!item) return 0;
  if (reportChartMetric.value === "gross") return Number(item.grossRevenue || 0);
  if (reportChartMetric.value === "refund") return Number(item.refundedRevenue || 0);
  if (reportChartMetric.value === "orders") return Number(item.orderCount || 0);
  return Number(item.netRevenue || 0);
}

const reportMetricColor = computed(() => {
  if (reportChartMetric.value === "gross") return "#2563eb";
  if (reportChartMetric.value === "refund") return "#ef4444";
  if (reportChartMetric.value === "orders") return "#7c3aed";
  return "#c66231";
});

const reportMetricLabel = computed(() => {
  const found = reportMetricOptions.find((item) => item.value === reportChartMetric.value);
  return found ? found.label : "Ròng";
});

const reportMetricTotal = computed(() => {
  return sortedActiveBuckets.value.reduce((sum, row) => sum + getReportMetricValue(row), 0);
});

const reportMetricTotalFormatted = computed(() => {
  if (reportChartMetric.value === "orders") return `${Math.round(reportMetricTotal.value)} đơn`;
  return formatCurrency(reportMetricTotal.value);
});

const reportBarSeries = computed(() => {
  const rows = sortedActiveBuckets.value;
  const values = rows.map((item) => Math.abs(getReportMetricValue(item)));
  const maxValue = Math.max(...values, 1);
  const count = Math.max(rows.length, 1);
  const step = count > 10 ? 42 : 78;
  const width = count > 10 ? 20 : 36;

  return rows.map((item, index) => {
    const metricValue = getReportMetricValue(item);
    const height = Math.max(8, (Math.abs(metricValue) / maxValue) * 148);
    return {
      key: `${item.key}-bar`,
      label: item.label,
      x: 44 + (index * step),
      y: 196 - height,
      width,
      height,
      fill: metricValue >= 0 ? reportMetricColor.value : "#ef4444",
    };
  });
});

const reportLinePoints = computed(() => {
  const rows = sortedActiveBuckets.value;
  const values = rows.map((item) => getReportMetricValue(item));
  const maxValue = Math.max(...values, 1);
  const minValue = Math.min(...values, 0);
  const range = Math.max(maxValue - minValue, 1);
  const count = Math.max(rows.length, 1);
  const step = count > 10 ? 42 : 78;
  const width = count > 10 ? 20 : 36;

  return rows.map((item, index) => ({
    key: `${item.key}-line`,
    x: 44 + (index * step) + (width / 2),
    y: 186 - (((getReportMetricValue(item) - minValue) / range) * 138),
  }));
});

const reportTrendPath = computed(() => {
  return reportLinePoints.value
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`)
    .join(" ");
});

const reportHighlights = computed(() => sortedActiveBuckets.value.slice(0, Math.min(4, sortedActiveBuckets.value.length)));

const paymentPieStyle = computed(() => {
  const total = Math.max(filteredOrders.value.length, 1);
  const colorByLabel = {
    "Đã thanh toán": "#16a34a",
    "Hoàn tiền": "#ef4444",
    "Chưa thanh toán": "#2563eb",
  };

  let start = 0;
  const segments = paymentBreakdownWithShare.value.map((item) => {
    const end = start + ((item.count / total) * 100);
    const color = colorByLabel[item.label] || "#64748b";
    const seg = `${color} ${start}% ${end}%`;
    start = end;
    return seg;
  });

  return {
    background: `conic-gradient(${segments.join(",")})`,
  };
});

const statusRowsWithShare = computed(() => {
  const total = Math.max(filteredOrders.value.length, 1);
  return statusBreakdown.value.map((item) => ({
    ...item,
    share: Math.round((item.count / total) * 100),
  }));
});

const paymentMethodBreakdown = computed(() => {
  return getPaymentMethodBreakdown(filteredOrders.value);
});

const selectedRangeText = computed(() => `${formatDateCell(selectedStartDate.value)} đến ${formatDateCell(selectedEndDate.value)}`);

const reportModeLabel = computed(() => {
  if (reportMode.value === "week") return "Theo tuần";
  if (reportMode.value === "month") return "Theo tháng";
  if (reportMode.value === "year") return "Theo năm";
  return "Theo ngày";
});

const reportModeText = computed(() => {
  if (reportMode.value === "week") return "theo tuần";
  if (reportMode.value === "month") return "theo tháng";
  if (reportMode.value === "year") return "theo năm";
  return "theo ngày";
});

const reportColumnLabel = computed(() => {
  if (reportMode.value === "week") return "Tuần";
  if (reportMode.value === "month") return "Tháng";
  if (reportMode.value === "year") return "Năm";
  return "Ngày";
});

const paymentFilterLabel = computed(() => {
  if (paymentFilter.value === "DA_THANH_TOAN") return "Đã thanh toán";
  if (paymentFilter.value === "HOAN_TIEN") return "Hoàn tiền";
  if (paymentFilter.value === "CHUA_THANH_TOAN") return "Chưa thanh toán";
  return "Tất cả thanh toán";
});

const paidOrdersCount = computed(() => paymentBreakdown.value.find((entry) => entry.label === "Đã thanh toán")?.count || 0);
const refundedOrdersCount = computed(() => paymentBreakdown.value.find((entry) => entry.label === "Hoàn tiền")?.count || 0);
const unpaidOrdersCount = computed(() => paymentBreakdown.value.find((entry) => entry.label === "Chưa thanh toán")?.count || 0);

const averageOrderValue = computed(() => {
  if (filteredOrders.value.length === 0) return 0;
  return Math.round(filteredNetRevenue.value / filteredOrders.value.length);
});

const refundRate = computed(() => {
  if (filteredProfitRevenue.value <= 0) return 0;
  return Math.round((filteredRefundRevenue.value / filteredProfitRevenue.value) * 1000) / 10;
});

async function loadReport() {
  loading.value = true;
  error.value = "";

  try {
    const ordersData = await adminApi.getOrders({ page: 0, size: 800 });
    orders.value = Array.isArray(ordersData) ? ordersData : [];
  } catch (err) {
    console.error("Failed to load reports:", err);
    error.value = "Không thể tải báo cáo tổng hợp. Vui lòng kiểm tra backend API.";
  } finally {
    loading.value = false;
  }
}

function buildCsvRows(mode = "detailed") {
  const rows = [
    ["BÁO CÁO DOANH THU KẾ TOÁN"],
    ["Generated At", new Date().toISOString()],
    ["Khoảng xem", selectedRangeText.value],
    ["Nhóm số liệu", reportModeLabel.value],
    ["Lọc thanh toán", paymentFilterLabel.value],
    ["Xuất lúc", formatLongDateTime(new Date())],
    [],
    ["TÓM TẮT"],
    ["Tổng đơn", filteredOrders.value.length],
    ["Đơn đã thanh toán", paidOrdersCount.value],
    ["Đơn chưa thanh toán", unpaidOrdersCount.value],
    ["Đơn hoàn tiền", refundedOrdersCount.value],
    ["Doanh thu vào", filteredProfitRevenue.value],
    ["Hoàn tiền", filteredRefundRevenue.value],
    ["Doanh thu ròng", filteredNetRevenue.value],
  ];

  if (mode === "summary") return rows;

  rows.push([]);
  rows.push(["CHI TIẾT THEO MỐC"]);
  rows.push([
    "period_label",
    "from_date",
    "to_date",
    "order_count",
    "paid_count",
    "refunded_count",
    "gross_revenue",
    "refunded_revenue",
    "net_revenue",
  ]);

  for (const item of sortedActiveBuckets.value) {
    rows.push([
      item.sublabel,
      formatDateCell(item.startDate),
      formatDateCell(item.endDate),
      item.orderCount,
      item.paidCount,
      item.refundedCount,
      item.grossRevenue,
      item.refundedRevenue,
      item.netRevenue,
    ]);
  }

  if (mode === "audit") {
    rows.push([]);
    rows.push(["ĐƠN HÀNG (TỐI ĐA 500 DÒNG)"]);
    rows.push(["order_id", "created_at_iso", "payment_status", "payment_impact"]);

    for (const order of filteredOrders.value.slice(0, 500)) {
      rows.push([
        order?.id ?? "",
        order?.createdAt ? new Date(order.createdAt).toISOString() : "",
        order?.paymentStatus || "",
        getOrderPaymentImpact(order),
      ]);
    }
  }

  return rows;
}

function downloadCsv(rows, suffix) {
  const csv = createCsvContent(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `bao-cao-ke-toan-${suffix}-${reportMode.value}-${startDateInput.value}-den-${endDateInput.value}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function exportSummaryCsv() {
  downloadCsv(buildCsvRows("summary"), "summary");
}

function exportCurrentCsv() {
  downloadCsv(buildCsvRows("detailed"), "detailed");
}

function exportAuditCsv() {
  downloadCsv(buildCsvRows("audit"), "audit");
}

function escaped(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function printReport() {
  const revenueChartRows = sortedActiveBuckets.value.slice(0, 16);
  const revenueMax = Math.max(...revenueChartRows.map((row) => Math.abs(Number(row.netRevenue || 0))), 1);
  const revenueChartBars = revenueChartRows
    .map((row, index) => {
      const value = Number(row.netRevenue || 0);
      const x = 20 + index * 42;
      const h = Math.max(6, Math.round((Math.abs(value) / revenueMax) * 150));
      const y = 180 - h;
      const color = value >= 0 ? "#16a34a" : "#dc2626";
      return `
        <rect x="${x}" y="${y}" width="24" height="${h}" fill="${color}" rx="4" />
        <text x="${x + 12}" y="196" text-anchor="middle" font-size="9" fill="#64748b">${escaped(String(row.sublabel || "").slice(0, 8))}</text>
      `;
    })
    .join("");

  const revenueRows = sortedActiveBuckets.value
    .map(
      (row) => `
        <tr>
          <td>${escaped(row.sublabel)}</td>
          <td>${escaped(formatDateCell(row.startDate))}</td>
          <td>${escaped(formatDateCell(row.endDate))}</td>
          <td class="right">${escaped(row.orderCount)}</td>
          <td class="right">${escaped(row.paidCount)}</td>
          <td class="right">${escaped(row.refundedCount)}</td>
          <td class="right">${escaped(formatCurrency(row.grossRevenue))}</td>
          <td class="right">${escaped(formatCurrency(row.refundedRevenue))}</td>
          <td class="right">${escaped(formatCurrency(row.netRevenue))}</td>
        </tr>`,
    )
    .join("");

  const paymentRows = paymentBreakdownWithShare.value
    .map(
      (item) => `
        <tr>
          <td>${escaped(item.label)}</td>
          <td class="right">${escaped(item.count)}</td>
          <td class="right">${escaped(item.share)}%</td>
        </tr>`,
    )
    .join("");

  const paymentChartRows = paymentBreakdownWithShare.value
    .map((item) => {
      const width = Math.max(0, Math.min(100, Number(item.share || 0)));
      const color =
        item.label === "Đã thanh toán"
          ? "#16a34a"
          : item.label === "Hoàn tiền"
            ? "#dc2626"
            : "#2563eb";
      return `
        <div class="pay-row">
          <div class="pay-head"><span>${escaped(item.label)}</span><span>${escaped(item.count)} đơn (${escaped(item.share)}%)</span></div>
          <div class="pay-track"><div class="pay-fill" style="width:${width}%;background:${color};"></div></div>
        </div>
      `;
    })
    .join("");

  const statusRows = statusRowsWithShare.value
    .map(
      (item) => `
        <tr>
          <td>${escaped(item.label)}</td>
          <td class="right">${escaped(item.count)}</td>
          <td class="right">${escaped(item.share)}%</td>
        </tr>`,
    )
    .join("");

  const statusChartRows = statusRowsWithShare.value
    .map((item) => {
      const width = Math.max(0, Math.min(100, Number(item.share || 0)));
      return `
        <div class="pay-row">
          <div class="pay-head"><span>${escaped(item.label)}</span><span>${escaped(item.count)} đơn (${escaped(item.share)}%)</span></div>
          <div class="pay-track"><div class="pay-fill" style="width:${width}%;background:#0f766e;"></div></div>
        </div>
      `;
    })
    .join("");

  const orderRows = filteredOrders.value
    .slice(0, 500)
    .map((order, index) => {
      const orderStatus = order?.status || order?.orderStatus || order?.deliveryStatus || "-";
      const amount = getOrderAmount(order);
      const impact = getOrderPaymentImpact(order);
      return `
        <tr>
          <td class="right">${escaped(index + 1)}</td>
          <td>${escaped(order?.id ?? "-")}</td>
          <td>${escaped(formatLongDateTime(order?.createdAt || ""))}</td>
          <td>${escaped(paymentStatusText(order?.paymentStatus))}</td>
          <td>${escaped(String(orderStatus))}</td>
          <td class="right">${escaped(formatCurrency(amount))}</td>
          <td class="right">${escaped(formatCurrency(impact))}</td>
        </tr>
      `;
    })
    .join("");

  const html = `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <title>Báo cáo doanh thu kế toán</title>
    <style>
      @page { margin: 10mm; size: A4; }
      * { box-sizing: border-box; }
      body { margin: 0; font-family: Arial, sans-serif; color: #0f172a; }
      .shell { padding: 10mm; }
      h1 { margin: 0 0 6px; font-size: 20px; }
      .meta { margin: 0 0 14px; color: #475569; font-size: 12px; }
      h2 { margin: 16px 0 8px; font-size: 15px; }
      table { width: 100%; border-collapse: collapse; table-layout: fixed; }
      th, td { border: 1px solid #cbd5e1; padding: 6px 8px; font-size: 11px; vertical-align: top; }
      th { background: #f8fafc; text-align: left; }
      .right { text-align: right; }
      .center { text-align: center; }
      .summary td:first-child { width: 45%; }
      .summary td:last-child { width: 55%; }
      .section { margin-top: 10px; }
      tr { page-break-inside: avoid; break-inside: avoid; }
      thead { display: table-header-group; }
      tfoot { display: table-footer-group; }
      .chart-box { border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px; margin-top: 6px; }
      .chart-title { margin: 0 0 6px; font-size: 12px; font-weight: 700; color: #334155; }
      .pay-row { margin-bottom: 8px; }
      .pay-head { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 3px; }
      .pay-track { width: 100%; height: 8px; background: #e2e8f0; border-radius: 999px; overflow: hidden; }
      .pay-fill { height: 100%; border-radius: 999px; }
      .muted { color: #475569; }
    </style>
  </head>
  <body>
    <div class="shell">
      <h1>Báo cáo doanh thu kế toán</h1>
      <p class="meta">Khoảng: ${escaped(selectedRangeText.value)} | Nhóm: ${escaped(reportModeLabel.value)} | Lọc thanh toán: ${escaped(paymentFilterLabel.value)} | Sắp xếp: ${escaped(bucketSort.value === "oldest" ? "Cũ nhất ở trên" : "Mới nhất ở trên")}</p>
      <p class="meta muted">Thời điểm in: ${escaped(formatLongDateTime(new Date()))}</p>

      <div class="section">
        <h2>1) Tóm tắt chỉ số quan trọng</h2>
        <table class="summary">
          <tbody>
            <tr><td>Tổng đơn</td><td class="right">${escaped(filteredOrders.value.length)}</td></tr>
            <tr><td>Đơn đã thanh toán</td><td class="right">${escaped(paidOrdersCount.value)}</td></tr>
            <tr><td>Đơn chưa thanh toán</td><td class="right">${escaped(unpaidOrdersCount.value)}</td></tr>
            <tr><td>Đơn hoàn tiền</td><td class="right">${escaped(refundedOrdersCount.value)}</td></tr>
            <tr><td>Doanh thu vào</td><td class="right">${escaped(formatCurrency(filteredProfitRevenue.value))}</td></tr>
            <tr><td>Hoàn tiền</td><td class="right">${escaped(formatCurrency(Math.abs(filteredRefundRevenue.value)))}</td></tr>
            <tr><td>Doanh thu ròng</td><td class="right">${escaped(formatCurrency(filteredNetRevenue.value))}</td></tr>
            <tr><td>Trung bình mỗi đơn</td><td class="right">${escaped(formatCurrency(averageOrderValue.value))}</td></tr>
            <tr><td>Tỷ lệ hoàn tiền</td><td class="right">${escaped(refundRate.value)}%</td></tr>
          </tbody>
        </table>
      </div>

      <div class="section">
        <h2>2) Biểu đồ tổng quan</h2>
        <div class="chart-box">
          <p class="chart-title">Doanh thu ròng theo ${escaped(reportModeText.value)} (tối đa 16 mốc)</p>
          <svg width="100%" height="210" viewBox="0 0 720 210" preserveAspectRatio="xMidYMid meet">
            <line x1="16" y1="180" x2="704" y2="180" stroke="#94a3b8" stroke-width="1" />
            ${revenueChartBars || ""}
          </svg>
        </div>
        <div class="chart-box" style="margin-top:10px;">
          <p class="chart-title">Phân bố thanh toán</p>
          ${paymentChartRows || '<p style="font-size:11px;color:#64748b;">Không có dữ liệu</p>'}
        </div>
        <div class="chart-box" style="margin-top:10px;">
          <p class="chart-title">Phân bố trạng thái đơn</p>
          ${statusChartRows || '<p style="font-size:11px;color:#64748b;">Không có dữ liệu</p>'}
        </div>
      </div>

      <div class="section">
        <h2>3) Phân bố thanh toán</h2>
        <table>
          <thead>
            <tr><th>Nhóm</th><th class="right">Số đơn</th><th class="right">Tỷ lệ</th></tr>
          </thead>
          <tbody>${paymentRows || '<tr><td colspan="3">Không có dữ liệu</td></tr>'}</tbody>
        </table>
      </div>

      <div class="section">
        <h2>4) Phân bố trạng thái đơn</h2>
        <table>
          <thead>
            <tr><th>Trạng thái</th><th class="right">Số đơn</th><th class="right">Tỷ lệ</th></tr>
          </thead>
          <tbody>${statusRows || '<tr><td colspan="3">Không có dữ liệu</td></tr>'}</tbody>
        </table>
      </div>

      <div class="section">
        <h2>5) Bảng doanh thu ${escaped(reportModeText.value)}</h2>
        <table>
          <thead>
            <tr>
              <th>${escaped(reportColumnLabel.value)}</th>
              <th>Từ ngày</th>
              <th>Đến ngày</th>
              <th class="right">Tổng đơn</th>
              <th class="right">Đơn đã thanh toán</th>
              <th class="right">Đơn hoàn tiền</th>
              <th class="right">Doanh thu vào</th>
              <th class="right">Hoàn tiền</th>
              <th class="right">Doanh thu ròng</th>
            </tr>
          </thead>
          <tbody>${revenueRows || '<tr><td colspan="9">Không có dữ liệu</td></tr>'}</tbody>
        </table>
      </div>

      <div class="section">
        <h2>6) Danh sách đơn hàng chi tiết (tối đa 500 dòng)</h2>
        <table>
          <thead>
            <tr>
              <th class="right" style="width:44px;">STT</th>
              <th style="width:92px;">Mã đơn</th>
              <th style="width:130px;">Thời gian tạo</th>
              <th style="width:95px;">Thanh toán</th>
              <th style="width:110px;">Trạng thái đơn</th>
              <th class="right" style="width:104px;">Giá trị đơn</th>
              <th class="right" style="width:104px;">Tác động ròng</th>
            </tr>
          </thead>
          <tbody>${orderRows || '<tr><td colspan="7" class="center">Không có dữ liệu</td></tr>'}</tbody>
        </table>
      </div>
    </div>
  </body>
</html>`;

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  document.body.appendChild(iframe);

  const cleanup = () => {
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 500);
  };

  iframe.onload = () => {
    const w = iframe.contentWindow;
    if (!w) {
      cleanup();
      return;
    }
    w.focus();
    w.print();
    cleanup();
  };

  iframe.srcdoc = html;
}

onMounted(loadReport);
</script>
