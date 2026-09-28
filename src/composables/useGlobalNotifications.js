import { ref, computed } from 'vue'
import { adminApi, ordersApi } from '@/services/api'

// Global state
const notifications = ref([])
const toasts = ref([])
let pollingInterval = null

// Admin tracker
let lastAdminOrderId = -1
let lastAdminReturnIds = null
export const globalOrderTrigger = ref(0)

// User tracker
let userOrderStates = {} // orderId -> status

// Load from localStorage if exists
try {
  const savedNotifs = localStorage.getItem('global_notifications')
  if (savedNotifs) notifications.value = JSON.parse(savedNotifs)
  const savedStates = localStorage.getItem('user_order_states')
  if (savedStates) userOrderStates = JSON.parse(savedStates)
  const savedAdminOrderId = localStorage.getItem('last_admin_order_id')
  if (savedAdminOrderId) lastAdminOrderId = parseInt(savedAdminOrderId, 10)
  const savedAdminReturnIds = localStorage.getItem('last_admin_return_ids')
  if (savedAdminReturnIds) lastAdminReturnIds = JSON.parse(savedAdminReturnIds)
} catch (e) {}

function saveState() {
  localStorage.setItem('global_notifications', JSON.stringify(notifications.value.slice(0, 50))) // keep max 50
  localStorage.setItem('user_order_states', JSON.stringify(userOrderStates))
  localStorage.setItem('last_admin_order_id', lastAdminOrderId.toString())
  if (lastAdminReturnIds) localStorage.setItem('last_admin_return_ids', JSON.stringify(lastAdminReturnIds))
}

function addNotification(notification) {
  const newNotif = {
    id: Date.now() + Math.random(),
    read: false,
    createdAt: new Date().toISOString(),
    ...notification
  }
  notifications.value.unshift(newNotif)
  saveState()
  
  // Also show as toast
  const toast = { ...newNotif }
  toasts.value.push(toast)
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== toast.id)
  }, 5000)
}

function markAllAsRead() {
  notifications.value.forEach(n => n.read = true)
  saveState()
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
      const raw = await adminApi.getOrders({ page: 0, size: 250 })
      
      const highestId = raw.length > 0 ? Math.max(...raw.map(o => o.id)) : 0
      if (lastAdminOrderId !== -1 && highestId > lastAdminOrderId) {
        addNotification({
          title: 'Có đơn hàng mới!',
          message: `Hệ thống vừa nhận được đơn hàng #${highestId}.`,
          type: 'success'
        })
      }
      lastAdminOrderId = highestId

      const returnReqs = raw.filter(o => o.status === 'RETURN_REQUEST')
      const currentReturnIds = returnReqs.map(o => o.id)
      
      if (lastAdminReturnIds !== null) {
        const newReturnIds = currentReturnIds.filter(id => !lastAdminReturnIds.includes(id))
        if (newReturnIds.length > 0) {
          addNotification({
            title: 'Yêu cầu hoàn trả!',
            message: `Có ${newReturnIds.length} yêu cầu hoàn trả đơn hàng mới.`,
            type: 'warning'
          })
        }
      }
      lastAdminReturnIds = currentReturnIds
      
      // Trigger update for AdminOrdersView
      globalOrderTrigger.value++
    }

    if (userId) {
      // User polling
      const myOrders = await ordersApi.getUserOrders(userId)
      let hasChanges = false
      for (const order of myOrders) {
        const oldStatus = userOrderStates[order.id]
        if (oldStatus && oldStatus !== order.status) {
          addNotification({
            title: 'Cập nhật đơn hàng',
            message: `Đơn hàng #${order.id} của bạn đã chuyển sang trạng thái: ${formatStatus(order.status)}`,
            type: 'info'
          })
          hasChanges = true
        }
        userOrderStates[order.id] = order.status
      }
      if (hasChanges) {
        globalOrderTrigger.value++
      }
    }
    saveState()
  } catch (e) {
    // silently fail
  }
}

function formatStatus(status) {
  const map = {
    NEW: 'Chờ xử lý',
    PENDING: 'Chờ xử lý',
    PROCESSING: 'Đang xử lý',
    CONFIRMED: 'Đang xử lý',
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
    stopPolling,
    globalOrderTrigger
  }
}
