import { ref, computed } from 'vue'
import { adminApi, ordersApi } from '@/services/api'

// Global state
const notifications = ref([])
const toasts = ref([])
let pollingInterval = null

// Admin tracker
let lastAdminOrderCount = -1
let lastAdminReturnCount = -1

// User tracker
let userOrderStates = {} // orderId -> status

function addNotification(notification) {
  const newNotif = {
    id: Date.now() + Math.random(),
    read: false,
    createdAt: new Date().toISOString(),
    ...notification
  }
  notifications.value.unshift(newNotif)
  
  // Also show as toast
  const toast = { ...newNotif }
  toasts.value.push(toast)
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== toast.id)
  }, 4000)
}

function markAllAsRead() {
  notifications.value.forEach(n => n.read = true)
}

function removeToast(id) {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

// We check if the user is admin
function isAdmin() {
  const role = localStorage.getItem('userRole')
  return role === 'ADMIN'
}

function getUserId() {
  try {
    const userString = localStorage.getItem('user')
    if (userString) {
      const user = JSON.parse(userString)
      return user.id || user.accountId || user.account_id
    }
  } catch (e) {}
  return null
}

async function pollNotifications() {
  try {
    const roleIsAdmin = isAdmin()
    const userId = getUserId()

    if (roleIsAdmin) {
      // Admin polling
      const raw = await adminApi.getOrders({ page: 0, size: 200 })
      const newOrders = raw.filter(o => o.status === 'NEW')
      const returnReqs = raw.filter(o => o.status === 'RETURN_REQUEST')
      
      if (lastAdminOrderCount !== -1 && newOrders.length > lastAdminOrderCount) {
        addNotification({
          title: 'Có đơn hàng mới!',
          message: 'Hệ thống vừa nhận được đơn đặt hàng mới.',
          type: 'success'
        })
      }
      if (lastAdminReturnCount !== -1 && returnReqs.length > lastAdminReturnCount) {
        addNotification({
          title: 'Yêu cầu hoàn trả!',
          message: 'Có khách hàng vừa gửi yêu cầu hoàn trả đơn hàng.',
          type: 'warning'
        })
      }
      
      lastAdminOrderCount = newOrders.length
      lastAdminReturnCount = returnReqs.length

    } else if (userId) {
      // User polling
      const myOrders = await ordersApi.getUserOrders(userId)
      // Check status changes
      for (const order of myOrders) {
        const oldStatus = userOrderStates[order.id]
        if (oldStatus && oldStatus !== order.status) {
          addNotification({
            title: 'Cập nhật đơn hàng',
            message: `Đơn hàng #${order.id} của bạn đã chuyển sang trạng thái: ${formatStatus(order.status)}`,
            type: 'info'
          })
        }
        userOrderStates[order.id] = order.status
      }
    }
  } catch (e) {
    // silently fail
  }
}

function formatStatus(status) {
  const map = {
    NEW: 'Chờ xử lý',
    CONFIRMED: 'Đã xác nhận',
    SHIPPING: 'Đang giao hàng',
    SUCCESS: 'Thành công',
    CANCELLED: 'Đã hủy',
    RETURN_REQUEST: 'Yêu cầu trả hàng',
    RETURN_APPROVED: 'Chờ nhận hoàn hàng',
    RETURNED: 'Đã hoàn trả'
  }
  return map[status] || status
}

function startPolling() {
  if (pollingInterval) return
  // Initial check
  pollNotifications()
  // Poll every 10 seconds
  pollingInterval = setInterval(pollNotifications, 10000)
}

function stopPolling() {
  if (pollingInterval) {
    clearInterval(pollingInterval)
    pollingInterval = null
  }
}

export function useGlobalNotifications() {
  return {
    notifications,
    toasts,
    unreadCount,
    addNotification,
    markAllAsRead,
    removeToast,
    startPolling,
    stopPolling
  }
}
