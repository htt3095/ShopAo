const profitablePaymentStatuses = new Set(['DA_THANH_TOAN', 'PAID', 'SETTLED', 'CAPTURED'])
const deductedPaymentStatuses = new Set(['HOAN_TIEN', 'REFUNDED', 'REFUND', 'CHARGEBACK', 'REVERSED'])

export function asNumber (value, fallback = 0) {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

export function toCompactNumber (value) {
  return new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: 1,
  }).format(asNumber(value, 0))
}

export function formatCurrency (value) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(asNumber(value, 0))
}

export function formatShortDate (value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return 'Không rõ'
  }

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
  }).format(date)
}

export function formatLongDateTime (value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return 'Không rõ'
  }

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function normalizeStatusKey (value) {
  return String(value || '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036F]/g, '')
    .replace(/\s+/g, '_')
    .replace(/-/g, '_')
    .toUpperCase()
}

export function normalizeOrderStatusValue (status) {
  const key = normalizeStatusKey(status)
  if (['NEW', 'PENDING', 'WAITING', 'CHUA_XU_LY', 'CHO_XU_LY'].includes(key)) {
    return 'CHUA_XU_LY'
  }
  if (['CONFIRMED', 'PROCESSING', 'DANG_XU_LY', 'XAC_NHAN', 'IN_PROGRESS'].includes(key)) {
    return 'DANG_XU_LY'
  }
  if (['SHIPPING', 'DELIVERING', 'DANG_GIAO', 'IN_TRANSIT'].includes(key)) {
    return 'DANG_GIAO'
  }
  if (['SUCCESS', 'COMPLETED', 'DELIVERED', 'THANH_CONG', 'HOAN_THANH'].includes(key)) {
    return 'THANH_CONG'
  }
  if (['CANCELLED', 'CANCELED', 'DA_HUY', 'HUY', 'FAILED'].includes(key)) {
    return 'DA_HUY'
  }
  return key || 'CHUA_XU_LY'
}

export function orderStatusLabel (status) {
  const normalized = normalizeOrderStatusValue(status)
  if (normalized === 'THANH_CONG') {
    return 'Thành công'
  }
  if (normalized === 'DANG_GIAO') {
    return 'Đang giao'
  }
  if (normalized === 'DANG_XU_LY') {
    return 'Đang xử lý'
  }
  if (normalized === 'DA_HUY') {
    return 'Đã hủy'
  }
  if (normalized === 'CHUA_XU_LY') {
    return 'Chưa xử lý'
  }
  if (normalized === 'RETURN_REQUEST') {
    return 'Yêu cầu hoàn trả'
  }
  if (normalized === 'RETURNING') {
    return 'Đang hoàn trả'
  }
  if (normalized === 'RETURNED') {
    return 'Đã hoàn trả'
  }
  if (normalized === 'DAMAGED') {
    return 'Hàng hư hỏng'
  }
  if (normalized === 'LOST') {
    return 'Thất lạc'
  }
  return 'Trạng thái khác'
}

export function normalizePaymentStatusValue (paymentStatus, orderStatus = null) {
  const orderStatusKey = normalizeOrderStatusValue(orderStatus)
  if (['RETURNED', 'DAMAGED', 'LOST'].includes(orderStatusKey)) {
    return 'HOAN_TIEN'
  }

  const key = normalizeStatusKey(paymentStatus || 'CHUA_THANH_TOAN')
  if (['PENDING', 'UNPAID', 'CHUA_THANH_TOAN', 'AWAITING_PAYMENT'].includes(key)) {
    return 'CHUA_THANH_TOAN'
  }
  if (['PAID', 'DA_THANH_TOAN', 'SETTLED', 'CAPTURED'].includes(key)) {
    return 'DA_THANH_TOAN'
  }
  if (['REFUNDED', 'REFUND', 'HOAN_TIEN', 'CHARGEBACK', 'REVERSED'].includes(key)) {
    return 'HOAN_TIEN'
  }
  return key
}

export function paymentStatusLabel (paymentStatus) {
  const normalized = normalizePaymentStatusValue(paymentStatus)
  if (profitablePaymentStatuses.has(normalized)) {
    return 'Đã thanh toán'
  }
  if (deductedPaymentStatuses.has(normalized)) {
    return 'Hoàn tiền'
  }
  return 'Chưa thanh toán'
}

export function parseOrderDate (order) {
  let candidate = null

  if (order && order.createdAt) {
    candidate = order.createdAt
  } else if (order && order.createdDate) {
    candidate = order.createdDate
  } else if (order && order.orderDate) {
    candidate = order.orderDate
  } else if (order && order.updatedAt) {
    candidate = order.updatedAt
  }

  const date = new Date(candidate || 0)
  return Number.isNaN(date.getTime()) ? null : date
}

export function getOrderAmount (order) {
  let amount = 0

  if (order && order.finalAmount !== undefined && order.finalAmount !== null) {
    amount = order.finalAmount
  } else if (order && order.totalMoney !== undefined && order.totalMoney !== null) {
    amount = order.totalMoney
  }

  return Math.abs(asNumber(amount, 0))
}

export function getOrderPaymentImpact (order) {
  const paymentStatus = normalizePaymentStatusValue(order && order.paymentStatus, order && order.status)
  const amount = getOrderAmount(order)

  if (isRevenueOrder(order, paymentStatus)) {
    return amount
  }

  return 0
}

function isRevenueOrder (order, normalizedPaymentStatus = null) {
  const orderStatus = normalizeOrderStatusValue(order && order.status)
  const paymentStatus = normalizedPaymentStatus || normalizePaymentStatusValue(order && order.paymentStatus, orderStatus)

  // Luôn loại trừ đơn hủy và đang hoàn trả khỏi doanh thu, bất kể payment_status
  if (orderStatus === 'DA_HUY' || ['RETURN_REQUEST', 'RETURNING'].includes(orderStatus)) {
    return false
  }
  return orderStatus === 'THANH_CONG' || profitablePaymentStatuses.has(paymentStatus)
}

function startOfDay (date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function addDays (date, days) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function startOfWeek (date) {
  const value = startOfDay(date)
  const dayIndex = (value.getDay() + 6) % 7
  return addDays(value, -dayIndex)
}

function startOfMonth (date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function startOfYear (date) {
  return new Date(date.getFullYear(), 0, 1)
}

function endOfDay (date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)
}

function formatBucketKey (date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatMonthKey (date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

function formatYearKey (date) {
  return String(date.getFullYear())
}

function addMonths (date, months) {
  const next = new Date(date.getFullYear(), date.getMonth(), 1)
  next.setMonth(next.getMonth() + months)
  return next
}

function addYears (date, years) {
  return new Date(date.getFullYear() + years, 0, 1)
}

function getIsoWeekNumber (date) {
  const temp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const day = temp.getUTCDay() || 7
  temp.setUTCDate(temp.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1))
  return Math.ceil((((temp - yearStart) / 86_400_000) + 1) / 7)
}

function normalizeRangeStart (date, mode) {
  if (mode === 'week') {
    return startOfWeek(date)
  }

  if (mode === 'month') {
    return startOfMonth(date)
  }

  if (mode === 'year') {
    return startOfYear(date)
  }

  return startOfDay(date)
}

function normalizeRangeEnd (date, mode) {
  if (mode === 'week') {
    return endOfDay(addDays(startOfWeek(date), 6))
  }

  if (mode === 'month') {
    return endOfDay(addDays(addMonths(startOfMonth(date), 1), -1))
  }

  if (mode === 'year') {
    return endOfDay(addDays(addYears(startOfYear(date), 1), -1))
  }

  return endOfDay(startOfDay(date))
}

function nextBucketDate (date, mode) {
  if (mode === 'week') {
    return addDays(date, 7)
  }

  if (mode === 'month') {
    return addMonths(date, 1)
  }

  if (mode === 'year') {
    return addYears(date, 1)
  }

  return addDays(date, 1)
}

function getBucketEndDate (date, mode) {
  if (mode === 'week') {
    return addDays(date, 6)
  }

  if (mode === 'month') {
    return addDays(addMonths(date, 1), -1)
  }

  if (mode === 'year') {
    return addDays(addYears(date, 1), -1)
  }

  return date
}

function getBucketKey (date, mode) {
  if (mode === 'month') {
    return formatMonthKey(date)
  }

  if (mode === 'year') {
    return formatYearKey(date)
  }

  return formatBucketKey(date)
}

function getBucketLabel (date, mode) {
  if (mode === 'week') {
    return `T${getIsoWeekNumber(date)}`
  }

  if (mode === 'month') {
    return new Intl.DateTimeFormat('vi-VN', { month: 'short' }).format(date)
  }

  if (mode === 'year') {
    return `N${date.getFullYear()}`
  }

  return new Intl.DateTimeFormat('vi-VN', { weekday: 'short' }).format(date).replace(/^th /i, 'T')
}

function getBucketSublabel (startDate, endDate, mode) {
  if (mode === 'week') {
    return `${formatShortDate(startDate)} - ${formatShortDate(endDate)}`
  }

  if (mode === 'month') {
    return new Intl.DateTimeFormat('vi-VN', { month: '2-digit', year: 'numeric' }).format(startDate)
  }

  if (mode === 'year') {
    return String(startDate.getFullYear())
  }

  return formatShortDate(startDate)
}

export function buildRevenueBuckets (orders, { mode = 'day', startDate = null, endDate = null } = {}) {
  const now = new Date()
  const rawStartDate = startDate instanceof Date && !Number.isNaN(startDate.getTime()) ? startDate : now
  const rawEndDate = endDate instanceof Date && !Number.isNaN(endDate.getTime()) ? endDate : now
  const normalizedStartDate = normalizeRangeStart(rawStartDate, mode)
  const normalizedEndDate = normalizeRangeEnd(rawEndDate, mode)
  const buckets = []
  const bucketMap = new Map()

  if (normalizedStartDate > normalizedEndDate) {
    return buckets
  }

  for (let bucketDate = new Date(normalizedStartDate); bucketDate <= normalizedEndDate; bucketDate = nextBucketDate(bucketDate, mode)) {
    const bucketStartDate = new Date(bucketDate)
    const bucketEndDate = getBucketEndDate(bucketStartDate, mode)
    const key = getBucketKey(bucketStartDate, mode)
    const label = getBucketLabel(bucketStartDate, mode)

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
    }

    buckets.push(bucket)
    bucketMap.set(key, bucket)
  }

  for (const order of orders || []) {
    const orderDate = parseOrderDate(order)
    if (!orderDate) {
      continue
    }
    if (orderDate < normalizedStartDate || orderDate > normalizedEndDate) {
      continue
    }

    const bucketStart = normalizeRangeStart(orderDate, mode)
    const bucket = bucketMap.get(getBucketKey(bucketStart, mode))
    if (!bucket) {
      continue
    }

    const amount = getOrderAmount(order)
    const paymentStatus = normalizePaymentStatusValue(order.paymentStatus, order.status)

    bucket.orderCount += 1

    if (isRevenueOrder(order, paymentStatus)) {
      bucket.grossRevenue += amount
      bucket.netRevenue += amount
      bucket.paidCount += 1
    } else if (deductedPaymentStatuses.has(paymentStatus)) {
      bucket.refundedRevenue += amount
      bucket.refundedCount += 1
    }
  }

  return buckets
}

export function getStatusBreakdown (orders) {
  const map = new Map()
  for (const order of orders || []) {
    const normalizedStatus = normalizeOrderStatusValue(order && order.status ? order.status : null)
    const status = orderStatusLabel(normalizedStatus) === 'Trạng thái khác' ? 'KHAC' : normalizedStatus
    map.set(status, (map.get(status) || 0) + 1)
  }

  return [...map.entries()]
    .map(([status, count]) => ({
      status,
      label: orderStatusLabel(status),
      count,
    }))
    .toSorted((left, right) => right.count - left.count)
}

export function getPaymentBreakdown (orders) {
  const map = new Map([
    ['Đã thanh toán', 0],
    ['Hoàn tiền', 0],
    ['Chưa thanh toán', 0],
  ])

  for (const order of orders || []) {
    const label = paymentStatusLabel(normalizePaymentStatusValue(order && order.paymentStatus, order && order.status))
    map.set(label, (map.get(label) || 0) + 1)
  }

  return [...map.entries()].map(([label, count]) => ({ label, count }))
}

const PAYMENT_METHOD_LABELS = {
  1: 'Tiền mặt',
  2: 'VNPay',
  3: 'Momo',
  4: 'Chuyển khoản ngân hàng',
  5: 'ZaloPay',
}

export function resolvePaymentMethodLabel (order) {
  const id = Number(order && order.paymentMethodId)
  if (Number.isFinite(id) && PAYMENT_METHOD_LABELS[id]) {
    return PAYMENT_METHOD_LABELS[id]
  }

  const name = String((order && order.paymentMethodName) || '').trim()
  if (name) {
    return name
  }

  return 'Không rõ'
}

export function resolveOrderChannel (order) {
  const source = normalizeStatusKey(
    (order && order.orderSource) || (order && order.order_source) || (order && order.salesChannel) || (order && order.sales_channel) || (order && order.channel),
  )
  if (['POS', 'IN_STORE', 'INSTORE', 'STORE', 'COUNTER'].includes(source)) {
    return 'Mua tại cửa hàng (POS)'
  }

  // Support POS orders saved before a dedicated source field existed.
  const address = normalizeStatusKey((order && order.shippingAddress) || (order && order.shipping_address) || (order && order.address))
  const email = String((order && order.email) || '').trim().toLowerCase()
  if (
    ['MUA_TAI_QUAY', 'MUA_TRUC_TIEP_TAI_CUA_HANG'].includes(address)
    || email === 'pos@local.shop'
  ) {
    return 'Mua tại cửa hàng (POS)'
  }

  return 'Mua Online'
}

export function getPaymentMethodBreakdown (orders) {
  const map = new Map()

  for (const order of orders || []) {
    const paymentStatus = normalizePaymentStatusValue(order && order.paymentStatus, order && order.status)
    if (!isRevenueOrder(order, paymentStatus)) {
      continue
    }

    const label = resolveOrderChannel(order)

    const amount = getOrderAmount(order)

    if (!map.has(label)) {
      map.set(label, { label, count: 0, revenue: 0 })
    }

    const entry = map.get(label)
    entry.count += 1
    entry.revenue += amount
  }

  const result = [...map.values()].toSorted((a, b) => b.revenue - a.revenue)
  const totalRevenue = result.reduce((sum, r) => sum + r.revenue, 0)

  return result.map(entry => ({
    ...entry,
    share: totalRevenue > 0 ? ((entry.revenue / totalRevenue) * 100).toFixed(1) : '0.0',
  }))
}

export function sumNetRevenue (orders) {
  return (orders || []).reduce((sum, order) => sum + getOrderPaymentImpact(order), 0)
}

export function sumPositiveRevenue (orders) {
  return (orders || []).reduce((sum, order) => {
    const value = getOrderPaymentImpact(order)
    return value > 0 ? sum + value : sum
  }, 0)
}

export function sumRefundRevenue (orders) {
  return (orders || []).reduce((sum, order) => {
    const paymentStatus = normalizePaymentStatusValue(order && order.paymentStatus, order && order.status)
    if (deductedPaymentStatuses.has(paymentStatus)) {
      return sum + getOrderAmount(order)
    }
    return sum
  }, 0)
}

export function filterOrdersByPayment (orders, paymentFilter) {
  if (!paymentFilter || paymentFilter === 'ALL') {
    return orders || []
  }

  return (orders || []).filter(order => {
    return normalizePaymentStatusValue(order && order.paymentStatus, order && order.status) === paymentFilter
  })
}

export function filterOrdersByDateRange (orders, startDate, endDate) {
  return (orders || []).filter(order => {
    const value = parseOrderDate(order)
    if (!value) {
      return false
    }

    if (startDate && value < startDate) {
      return false
    }

    if (endDate && value > endOfDay(endDate)) {
      return false
    }

    return true
  })
}

export function sortRevenueBuckets (buckets, sortBy) {
  const rows = (buckets || []).slice()

  switch (sortBy) {
    case 'revenue-desc':
    {
      rows.sort((left, right) => right.netRevenue - left.netRevenue)

      break
    }
    case 'revenue-asc':
    {
      rows.sort((left, right) => left.netRevenue - right.netRevenue)

      break
    }
    case 'orders-desc':
    {
      rows.sort((left, right) => right.orderCount - left.orderCount)

      break
    }
    case 'orders-asc':
    {
      rows.sort((left, right) => left.orderCount - right.orderCount)

      break
    }
    case 'oldest':
    {
      rows.sort((left, right) => left.startDate - right.startDate)

      break
    }
    default:
    {
      rows.sort((left, right) => right.startDate - left.startDate)
    }
  }

  return rows
}
