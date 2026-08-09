const profitablePaymentStatuses = ["DA_THANH_TOAN", "PAID", "SETTLED", "CAPTURED"];
const deductedPaymentStatuses = ["HOAN_TIEN", "REFUNDED", "REFUND", "CHARGEBACK", "REVERSED"];

export function asNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
}

export function toCompactNumber(value) {
    return new Intl.NumberFormat("vi-VN", {
        maximumFractionDigits: 1,
    }).format(asNumber(value, 0));
}

export function formatCurrency(value) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(asNumber(value, 0));
}

export function formatShortDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "Không rõ";
    }

    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
    }).format(date);
}

export function formatLongDateTime(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "Không rõ";
    }

    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

export function normalizeStatusKey(value) {
    return String(value || "")
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "_")
        .replace(/-/g, "_")
        .toUpperCase();
}

export function normalizeOrderStatusValue(status) {
    const key = normalizeStatusKey(status);
    if (["NEW", "PENDING", "WAITING", "CHUA_XU_LY", "CHO_XU_LY"].includes(key)) return "CHUA_XU_LY";
    if (["CONFIRMED", "PROCESSING", "DANG_XU_LY", "XAC_NHAN", "IN_PROGRESS"].includes(key)) return "DANG_XU_LY";
    if (["SHIPPING", "DELIVERING", "DANG_GIAO", "IN_TRANSIT"].includes(key)) return "DANG_GIAO";
    if (["SUCCESS", "COMPLETED", "DELIVERED", "THANH_CONG", "HOAN_THANH"].includes(key)) return "THANH_CONG";
    if (["RETURN_REQUEST", "YEU_CAU_TRA"].includes(key)) return "RETURN_REQUEST";
    if (["RETURNING", "TRA_HANG", "DANG_HOAN", "DANG_TRA_HANG"].includes(key)) return "RETURNING";
    if (["RETURNED", "HOAN_TRA", "HOAN_TIEN", "REFUND", "REFUNDED", "HOAN_HANG"].includes(key)) return "RETURNED";
    if (["DAMAGED", "HANG_HONG", "HANG_HONG_HONG"].includes(key)) return "DAMAGED";
    if (["LOST", "HANG_MAT", "MAT_HANG", "THAT_LAC", "PARCEL_LOST"].includes(key)) return "LOST";
    if (["CANCELLED", "CANCELED", "DA_HUY", "HUY", "FAILED"].includes(key)) return "DA_HUY";
    return key || "CHUA_XU_LY";
}

export function orderStatusLabel(status) {
    const normalized = normalizeOrderStatusValue(status);
    if (normalized === "THANH_CONG") return "Thành công";
    if (normalized === "DANG_GIAO") return "Đang giao";
    if (normalized === "DANG_XU_LY") return "Đang xử lý";
    if (normalized === "DA_HUY") return "Đã hủy";
    return "Chưa xử lý";
}

export function normalizePaymentStatusValue(paymentStatus, orderStatus = null) {
    const key = normalizeStatusKey(paymentStatus || "CHUA_THANH_TOAN");
    const normalizedStatus = normalizeOrderStatusValue(orderStatus);
    const isRefundOrder = ["RETURNED", "DAMAGED", "LOST"].includes(normalizedStatus);

    if (["PENDING", "UNPAID", "CHUA_THANH_TOAN", "AWAITING_PAYMENT"].includes(key)) {
        return isRefundOrder ? "HOAN_TIEN" : "CHUA_THANH_TOAN";
    }
    if (["PAID", "DA_THANH_TOAN", "SETTLED", "CAPTURED"].includes(key)) {
        return isRefundOrder ? "HOAN_TIEN" : "DA_THANH_TOAN";
    }
    if (["REFUNDED", "REFUND", "HOAN_TIEN", "CHARGEBACK", "REVERSED"].includes(key)) return "HOAN_TIEN";
    return key;
}

export function paymentStatusLabel(paymentStatus, orderStatus = null) {
    const normalized = normalizePaymentStatusValue(paymentStatus, orderStatus);
    const normalizedStatus = normalizeOrderStatusValue(orderStatus);
    if (profitablePaymentStatuses.includes(normalized) && !["RETURNED", "DAMAGED", "LOST"].includes(normalizedStatus)) return "Đã thanh toán";
    if (deductedPaymentStatuses.includes(normalized) || ["RETURNED", "DAMAGED", "LOST"].includes(normalizedStatus)) return "Hoàn tiền";
    return "Chưa thanh toán";
}

export function parseOrderDate(order) {
    let candidate = null;

    if (order && order.createdAt) {
        candidate = order.createdAt;
    } else if (order && order.createdDate) {
        candidate = order.createdDate;
    } else if (order && order.orderDate) {
        candidate = order.orderDate;
    } else if (order && order.updatedAt) {
        candidate = order.updatedAt;
    }

    const date = new Date(candidate || 0);
    return Number.isNaN(date.getTime()) ? null : date;
}

export function getOrderAmount(order) {
    let amount = 0;

    if (order && order.finalAmount !== undefined && order.finalAmount !== null) {
        amount = order.finalAmount;
    } else if (order && order.totalMoney !== undefined && order.totalMoney !== null) {
        amount = order.totalMoney;
    }

    return Math.abs(asNumber(amount, 0));
}

export function getOrderPaymentImpact(order) {
    const paymentStatus = normalizePaymentStatusValue(order && order.paymentStatus ? order.paymentStatus : null);
    const statusKey = normalizeOrderStatusValue(order && order.status ? order.status : null);
    const amount = getOrderAmount(order);

    if (profitablePaymentStatuses.includes(paymentStatus) && !["RETURNED", "DAMAGED", "LOST"].includes(statusKey)) {
        return amount;
    }

    if (deductedPaymentStatuses.includes(paymentStatus) || ["RETURNED", "DAMAGED", "LOST"].includes(statusKey)) {
        return -amount;
    }

    return 0;
}

function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date, days) {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
}

function startOfWeek(date) {
    const value = startOfDay(date);
    const dayIndex = (value.getDay() + 6) % 7;
    return addDays(value, -dayIndex);
}

function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfYear(date) {
    return new Date(date.getFullYear(), 0, 1);
}

function endOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

function formatBucketKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function formatMonthKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
}

function formatYearKey(date) {
    return String(date.getFullYear());
}

function addMonths(date, months) {
    const next = new Date(date.getFullYear(), date.getMonth(), 1);
    next.setMonth(next.getMonth() + months);
    return next;
}

function addYears(date, years) {
    return new Date(date.getFullYear() + years, 0, 1);
}

function getIsoWeekNumber(date) {
    const temp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const day = temp.getUTCDay() || 7;
    temp.setUTCDate(temp.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1));
    return Math.ceil((((temp - yearStart) / 86400000) + 1) / 7);
}

function normalizeRangeStart(date, mode) {
    if (mode === "week") {
        return startOfWeek(date);
    }

    if (mode === "month") {
        return startOfMonth(date);
    }

    if (mode === "year") {
        return startOfYear(date);
    }

    return startOfDay(date);
}

function normalizeRangeEnd(date, mode) {
    if (mode === "week") {
        return endOfDay(addDays(startOfWeek(date), 6));
    }

    if (mode === "month") {
        return endOfDay(addDays(addMonths(startOfMonth(date), 1), -1));
    }

    if (mode === "year") {
        return endOfDay(addDays(addYears(startOfYear(date), 1), -1));
    }

    return endOfDay(startOfDay(date));
}

function nextBucketDate(date, mode) {
    if (mode === "week") {
        return addDays(date, 7);
    }

    if (mode === "month") {
        return addMonths(date, 1);
    }

    if (mode === "year") {
        return addYears(date, 1);
    }

    return addDays(date, 1);
}

function getBucketEndDate(date, mode) {
    if (mode === "week") {
        return addDays(date, 6);
    }

    if (mode === "month") {
        return addDays(addMonths(date, 1), -1);
    }

    if (mode === "year") {
        return addDays(addYears(date, 1), -1);
    }

    return date;
}

function getBucketKey(date, mode) {
    if (mode === "month") {
        return formatMonthKey(date);
    }

    if (mode === "year") {
        return formatYearKey(date);
    }

    return formatBucketKey(date);
}

function getBucketLabel(date, mode) {
    if (mode === "week") {
        return `T${getIsoWeekNumber(date)}`;
    }

    if (mode === "month") {
        return new Intl.DateTimeFormat("vi-VN", { month: "short" }).format(date);
    }

    if (mode === "year") {
        return `N${date.getFullYear()}`;
    }

    return new Intl.DateTimeFormat("vi-VN", { weekday: "short" }).format(date).replace(/^th /i, "T");
}

function getBucketSublabel(startDate, endDate, mode) {
    if (mode === "week") {
        return `${formatShortDate(startDate)} - ${formatShortDate(endDate)}`;
    }

    if (mode === "month") {
        return new Intl.DateTimeFormat("vi-VN", { month: "2-digit", year: "numeric" }).format(startDate);
    }

    if (mode === "year") {
        return String(startDate.getFullYear());
    }

    return formatShortDate(startDate);
}

export function buildRevenueBuckets(orders, { mode = "day", startDate = null, endDate = null } = {}) {
    const now = new Date();
    const rawStartDate = startDate instanceof Date && !Number.isNaN(startDate.getTime()) ? startDate : now;
    const rawEndDate = endDate instanceof Date && !Number.isNaN(endDate.getTime()) ? endDate : now;
    const normalizedStartDate = normalizeRangeStart(rawStartDate, mode);
    const normalizedEndDate = normalizeRangeEnd(rawEndDate, mode);
    const buckets = [];
    const bucketMap = new Map();

    if (normalizedStartDate > normalizedEndDate) {
        return buckets;
    }

    for (let bucketDate = new Date(normalizedStartDate); bucketDate <= normalizedEndDate; bucketDate = nextBucketDate(bucketDate, mode)) {
        const bucketStartDate = new Date(bucketDate);
        const bucketEndDate = getBucketEndDate(bucketStartDate, mode);
        const key = getBucketKey(bucketStartDate, mode);
        const label = getBucketLabel(bucketStartDate, mode);

        const bucket = {
            key,
            label,
            sublabel: getBucketSublabel(bucketStartDate, bucketEndDate, mode),
            startDate: bucketStartDate,
            endDate: bucketEndDate,
            grossRevenue: 0,
            refundedRevenue: 0,
            netRevenue: 0,
            orderCount: 0,
            paidCount: 0,
            refundedCount: 0,
        };

        buckets.push(bucket);
        bucketMap.set(key, bucket);
    }

    for (const order of orders || []) {
        const orderDate = parseOrderDate(order);
        if (!orderDate) continue;
        if (orderDate < normalizedStartDate || orderDate > normalizedEndDate) continue;

        const bucketStart = normalizeRangeStart(orderDate, mode);
        const bucket = bucketMap.get(getBucketKey(bucketStart, mode));
        if (!bucket) continue;

        const amount = getOrderAmount(order);
        const paymentStatus = normalizePaymentStatusValue(order.paymentStatus, order.status);
        const statusKey = normalizeOrderStatusValue(order.status);
        const isFinalRefundOutcome = ["RETURNED", "DAMAGED", "LOST"].includes(statusKey);
        const isInProgressReturn = ["RETURN_REQUEST", "RETURNING"].includes(statusKey);

        bucket.orderCount += 1;

        if (isFinalRefundOutcome || deductedPaymentStatuses.includes(paymentStatus)) {
            bucket.refundedRevenue += amount;
            bucket.refundedCount += 1;
            bucket.netRevenue -= amount;
        } else if (profitablePaymentStatuses.includes(paymentStatus) && !isInProgressReturn) {
            bucket.grossRevenue += amount;
            bucket.netRevenue += amount;
            bucket.paidCount += 1;
        }
    }

    return buckets;
}

export function getStatusBreakdown(orders) {
    const map = new Map();
    for (const order of orders || []) {
        const status = normalizeOrderStatusValue(order && order.status ? order.status : null);
        map.set(status, (map.get(status) || 0) + 1);
    }

    return [...map.entries()]
        .map(([status, count]) => ({
            status,
            label: orderStatusLabel(status),
            count,
        }))
        .sort((left, right) => right.count - left.count);
}

export function getPaymentBreakdown(orders) {
    const map = new Map([
        ["Đã thanh toán", 0],
        ["Hoàn tiền", 0],
        ["Chưa thanh toán", 0],
    ]);

    for (const order of orders || []) {
        const label = paymentStatusLabel(order && order.paymentStatus ? order.paymentStatus : null);
        map.set(label, (map.get(label) || 0) + 1);
    }

    return [...map.entries()].map(([label, count]) => ({ label, count }));
}

const PAYMENT_METHOD_LABELS = {
    1: "Tiền mặt",
    2: "VNPay",
    3: "Momo",
    4: "Chuyển khoản ngân hàng",
    5: "ZaloPay",
};

export function resolvePaymentMethodLabel(order) {
    const id = Number(order && order.paymentMethodId);
    if (Number.isFinite(id) && PAYMENT_METHOD_LABELS[id]) {
        return PAYMENT_METHOD_LABELS[id];
    }

    const name = String((order && order.paymentMethodName) || "").trim();
    if (name) return name;

    return "Không rõ";
}

export function getPaymentMethodBreakdown(orders) {
    const map = new Map();

    for (const order of orders || []) {
        const paymentStatus = normalizePaymentStatusValue(order && order.paymentStatus ? order.paymentStatus : null);
        if (!profitablePaymentStatuses.includes(paymentStatus)) continue;

        const label = resolvePaymentMethodLabel(order);
        const amount = getOrderAmount(order);

        if (!map.has(label)) {
            map.set(label, { label, count: 0, revenue: 0 });
        }

        const entry = map.get(label);
        entry.count += 1;
        entry.revenue += amount;
    }

    const result = [...map.values()].sort((a, b) => b.revenue - a.revenue);
    const totalRevenue = result.reduce((sum, r) => sum + r.revenue, 0);

    return result.map((entry) => ({
        ...entry,
        share: totalRevenue > 0 ? ((entry.revenue / totalRevenue) * 100).toFixed(1) : "0.0",
    }));
}

export function sumNetRevenue(orders) {
    return (orders || []).reduce((sum, order) => sum + getOrderPaymentImpact(order), 0);
}

export function sumPositiveRevenue(orders) {
    return (orders || []).reduce((sum, order) => {
        const value = getOrderPaymentImpact(order);
        return value > 0 ? sum + value : sum;
    }, 0);
}

export function sumRefundRevenue(orders) {
    return (orders || []).reduce((sum, order) => {
        const value = getOrderPaymentImpact(order);
        return value < 0 ? sum + Math.abs(value) : sum;
    }, 0);
}

export function filterOrdersByPayment(orders, paymentFilter) {
    if (!paymentFilter || paymentFilter === "ALL") {
        return orders || [];
    }

    return (orders || []).filter((order) => {
        return normalizePaymentStatusValue(order && order.paymentStatus ? order.paymentStatus : null) === paymentFilter;
    });
}

export function filterOrdersByDateRange(orders, startDate, endDate) {
    return (orders || []).filter((order) => {
        const value = parseOrderDate(order);
        if (!value) {
            return false;
        }

        if (startDate && value < startDate) {
            return false;
        }

        if (endDate && value > endOfDay(endDate)) {
            return false;
        }

        return true;
    });
}

export function sortRevenueBuckets(buckets, sortBy) {
    const rows = (buckets || []).slice();

    if (sortBy === "revenue-desc") {
        rows.sort((left, right) => right.netRevenue - left.netRevenue);
    } else if (sortBy === "revenue-asc") {
        rows.sort((left, right) => left.netRevenue - right.netRevenue);
    } else if (sortBy === "orders-desc") {
        rows.sort((left, right) => right.orderCount - left.orderCount);
    } else if (sortBy === "orders-asc") {
        rows.sort((left, right) => left.orderCount - right.orderCount);
    } else if (sortBy === "oldest") {
        rows.sort((left, right) => left.startDate - right.startDate);
    } else {
        rows.sort((left, right) => right.startDate - left.startDate);
    }

    return rows;
}