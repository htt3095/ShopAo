<template>
  <!-- Floating Chat Button -->
  <button
    v-if="!isOpen"
    type="button"
    class="chat-fab fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-orange-600 text-white shadow-lg shadow-primary/30 transition-all hover:scale-110 hover:shadow-xl hover:shadow-primary/40 active:scale-95"
    @click="openChat"
  >
    <span class="material-symbols-outlined text-[28px]">chat_bubble</span>
    <span class="chat-fab-ping absolute inset-0 rounded-full bg-primary opacity-30" />
  </button>

  <!-- Chat Panel -->
  <Teleport to="body">
    <Transition name="chat-panel">
      <div
        v-if="isOpen"
        class="fixed bottom-4 right-4 z-50 flex w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-[#3c342e] dark:bg-[#161210]"
        style="height: min(540px, calc(100vh - 2rem))"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between gap-3 bg-gradient-to-r from-primary to-orange-600 px-4 py-3 text-white"
        >
          <div class="flex items-center gap-2.5">
            <div class="flex size-9 items-center justify-center rounded-full bg-white/20">
              <span class="material-symbols-outlined text-[20px]">chat_bubble</span>
            </div>
            <div>
              <p class="text-sm font-bold leading-tight">Trợ lý mua sắm AI</p>
              <p class="text-[11px] leading-tight opacity-80">Hỏi gì cũng được!</p>
            </div>
          </div>
          <button
            type="button"
            class="rounded-lg p-1 transition hover:bg-white/20"
            @click="closeChat"
          >
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <!-- Messages Area -->
        <div ref="messagesContainer" class="flex-1 space-y-3 overflow-y-auto p-4">
          <!-- Welcome message -->
          <div class="chat-msg-bot flex gap-2.5">
            <div class="flex size-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <span class="material-symbols-outlined text-[16px]">chat_bubble</span>
            </div>
            <div class="max-w-[85%]">
              <div class="rounded-2xl rounded-tl-md bg-slate-100 px-3.5 py-2.5 text-sm text-slate-700 dark:bg-[#2b241f] dark:text-[#d5c6b7]">
                Xin chào! 👋 Tôi là trợ lý mua sắm của SportX. Bạn đang tìm loại áo nào? Hãy mô tả nhu cầu hoặc chọn gợi ý bên dưới nhé!
              </div>
            </div>
          </div>

          <!-- Chat messages -->
          <template v-for="(msg, idx) in messages" :key="idx">
            <!-- User message -->
            <div v-if="msg.role === 'user'" class="flex justify-end">
              <div class="max-w-[85%] rounded-2xl rounded-tr-md bg-primary px-3.5 py-2.5 text-sm text-white">
                {{ msg.text }}
              </div>
            </div>

            <!-- Bot message -->
            <div v-else class="chat-msg-bot flex gap-2.5">
              <div class="flex size-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span class="material-symbols-outlined text-[16px]">chat_bubble</span>
              </div>
              <div class="max-w-[85%] space-y-2">
                <div class="rounded-2xl rounded-tl-md bg-slate-100 px-3.5 py-2.5 text-sm text-slate-700 dark:bg-[#2b241f] dark:text-[#d5c6b7]">
                  {{ msg.text }}
                </div>
                <!-- Product cards -->
                <div v-if="msg.products && msg.products.length > 0" class="space-y-1.5">
                  <ChatProductCard
                    v-for="product in msg.products"
                    :key="product.id"
                    :product="product"
                    @click="closeChat"
                  />
                </div>
              </div>
            </div>
          </template>

          <!-- Typing indicator -->
          <div v-if="isTyping" class="chat-msg-bot flex gap-2.5">
            <div class="flex size-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <span class="material-symbols-outlined text-[16px]">chat_bubble</span>
            </div>
            <div class="rounded-2xl rounded-tl-md bg-slate-100 px-3.5 py-2.5 dark:bg-[#2b241f]">
              <div class="flex items-center gap-1">
                <span class="typing-dot size-2 rounded-full bg-slate-400" />
                <span class="typing-dot size-2 rounded-full bg-slate-400" style="animation-delay: 0.15s" />
                <span class="typing-dot size-2 rounded-full bg-slate-400" style="animation-delay: 0.3s" />
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Suggestions -->
        <div v-if="messages.length === 0" class="border-t border-slate-100 px-4 py-2.5 dark:border-[#2b241f]">
          <p class="mb-2 text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Gợi ý nhanh
          </p>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="chip in quickChips"
              :key="chip"
              type="button"
              class="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-[#3c342e] dark:bg-[#1f1a17] dark:text-[#d5c6b7]"
              @click="sendQuickChip(chip)"
            >
              {{ chip }}
            </button>
          </div>
        </div>

        <!-- Input Area -->
        <div class="border-t border-slate-200 px-3 py-2.5 dark:border-[#2b241f]">
          <form class="flex items-center gap-2" @submit.prevent="handleSend">
            <input
              ref="chatInput"
              v-model="inputText"
              type="text"
              placeholder="Nhập câu hỏi..."
              :disabled="isTyping"
              class="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:bg-white dark:border-[#3c342e] dark:bg-[#1f1a17] dark:focus:bg-[#2b241f]"
              @keydown.enter.prevent="handleSend"
            />
            <button
              type="submit"
              :disabled="isTyping || !inputText.trim()"
              class="flex size-10 items-center justify-center rounded-xl bg-primary text-white transition-all hover:bg-orange-600 disabled:opacity-40 disabled:hover:bg-primary"
            >
              <span class="material-symbols-outlined text-[20px]">send</span>
            </button>
          </form>
          <p class="mt-1.5 text-center text-[10px] text-slate-400">
            Powered by Google Gemini AI
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, nextTick, onMounted } from "vue";
import ChatProductCard from "@/components/ChatProductCard.vue";
import { sendChatMessage, initGemini, isGeminiConfigured, resetChat } from "@/services/geminiService";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const isOpen = ref(false);
const isTyping = ref(false);
const inputText = ref("");
const messages = ref([]);
const messagesContainer = ref(null);
const chatInput = ref(null);

const allProducts = ref([]);
const productsLoaded = ref(false);

const quickChips = [
  "Áo thể thao",
  "Áo polo",
  "Áo chạy bộ",
  "Dưới 300k",
  "Áo Adidas",
  "Áo Nike",
];

async function loadProducts() {
  if (productsLoaded.value) return;
  try {
    // Fetch products
    const prodRes = await fetch(`${API_BASE_URL}/products?page=0&size=200`);
    const prodData = await prodRes.json();
    const products = Array.isArray(prodData)
      ? prodData
      : Array.isArray(prodData?.content)
        ? prodData.content
        : Array.isArray(prodData?.data)
          ? prodData.data
          : [];

    // Fetch variants to get prices
    const varRes = await fetch(`${API_BASE_URL}/variants?page=0&size=500`);
    const varData = await varRes.json();
    const variants = Array.isArray(varData)
      ? varData
      : Array.isArray(varData?.content)
        ? varData.content
        : Array.isArray(varData?.data)
          ? varData.data
          : [];

    // Build price and image map: productId -> { minPrice, imageUrl }
    const variantInfoMap = new Map();
    for (const v of variants) {
      const pid = Number(v.productId || v.product_id);
      const price = Number(v.price || 0);
      const img = v.imageUrl || v.image_url || v.imgUrl;
      
      if (!pid) continue;
      
      const current = variantInfoMap.get(pid) || { minPrice: Infinity, imageUrl: null };
      
      if (price > 0 && price < current.minPrice) {
        current.minPrice = price;
      }
      if (!current.imageUrl && img) {
        current.imageUrl = img;
      }
      
      variantInfoMap.set(pid, current);
    }

    // Merge info into products
    allProducts.value = products.map((p) => {
      const vInfo = variantInfoMap.get(Number(p.id)) || { minPrice: 0, imageUrl: null };
      return {
        ...p,
        _minPrice: vInfo.minPrice === Infinity ? 0 : vInfo.minPrice,
        _imageUrl: p.imageUrl || p.image_url || p.imgUrl || vInfo.imageUrl,
      };
    });

    productsLoaded.value = true;
  } catch (err) {
    console.error("[Chatbot] Không tải được sản phẩm:", err);
    allProducts.value = [];
  }
}

function findProductsByIds(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return [];
  return ids
    .map((id) => allProducts.value.find((p) => Number(p.id) === Number(id)))
    .filter(Boolean)
    .slice(0, 4);
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
}

async function openChat() {
  isOpen.value = true;
  await loadProducts();
  initGemini();
  nextTick(() => {
    chatInput.value?.focus();
  });
}

function closeChat() {
  isOpen.value = false;
}

function sendQuickChip(text) {
  inputText.value = text;
  handleSend();
}

async function handleSend() {
  const text = inputText.value.trim();
  if (!text || isTyping.value) return;

  // Add user message
  messages.value.push({ role: "user", text });
  inputText.value = "";
  scrollToBottom();

  // Show typing indicator
  isTyping.value = true;
  scrollToBottom();

  if (!isGeminiConfigured()) {
    // Fallback: simple keyword matching when no API key
    await new Promise((r) => setTimeout(r, 600));
    const fallbackResult = fallbackSearch(text);
    messages.value.push({
      role: "bot",
      text: fallbackResult.message,
      products: fallbackResult.products,
    });
    isTyping.value = false;
    scrollToBottom();
    return;
  }

  try {
    const response = await sendChatMessage(text, allProducts.value);
    const matchedProducts = findProductsByIds(response.productIds);

    messages.value.push({
      role: "bot",
      text: response.message,
      products: matchedProducts,
    });
  } catch {
    messages.value.push({
      role: "bot",
      text: "Xin lỗi, tôi gặp sự cố khi xử lý. Vui lòng thử lại nhé!",
      products: [],
    });
  } finally {
    isTyping.value = false;
    scrollToBottom();
  }
}

// Fallback search when Gemini API key is not configured
function fallbackSearch(query) {
  const q = query
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  // Extract price filter
  let maxPrice = null;
  const priceMatch = query.match(/(\d+)\s*k/i);
  if (priceMatch) {
    maxPrice = parseInt(priceMatch[1]) * 1000;
  }
  const priceMatchFull = query.match(/duoi\s*(\d+)/i) || query.match(/under\s*(\d+)/i);
  if (!maxPrice && priceMatchFull) {
    maxPrice = parseInt(priceMatchFull[1]);
    if (maxPrice < 1000) maxPrice *= 1000;
  }

  const scored = allProducts.value.map((p) => {
    const name = String(p.name || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const brand = String(p.brandName || p.brand || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const category = String(p.categoryName || p.category || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const stopWords = ["ao", "giay", "quan", "mau", "size", "co", "khong", "nao", "cho", "toi", "xem", "muon", "mua", "tim", "nhung"];
    let score = 0;
    const words = q.split(/\s+/).filter((w) => w.length > 1 && !/^\d+k?$/i.test(w) && w !== "duoi" && w !== "tren" && !stopWords.includes(w));
    
    // If no significant words and no price filter, return score 0
    if (words.length === 0 && maxPrice === null) return { product: p, score: 0 };

    for (const word of words) {
      if (name.includes(word)) score += 3;
      if (brand.includes(word)) score += 5; // Brand match is more important
      if (category.includes(word)) score += 2;
    }
    
    // If there were significant words but NONE matched, penalize heavily
    if (words.length > 0 && score === 0) {
      score = -100;
    }
    const price = Number(p._minPrice || 0);
    if (maxPrice !== null) {
      if (price > 0 && price <= maxPrice) {
        score += 2;
      } else {
        // Product doesn't meet price requirement - exclude it
        score = -100;
      }
    }

    return { product: p, score };
  });

  const results = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((s) => s.product);

  if (results.length > 0) {
    return {
      message: `Tôi tìm thấy ${results.length} sản phẩm phù hợp với yêu cầu của bạn:`,
      products: results,
    };
  }

  // No match - say so honestly instead of showing random products
  if (maxPrice !== null) {
    return {
      message: `Xin lỗi, hiện tại shop chưa có sản phẩm nào dưới ${new Intl.NumberFormat("vi-VN").format(maxPrice)}đ phù hợp với yêu cầu của bạn. Bạn thử tăng ngân sách hoặc hỏi loại áo khác nhé!`,
      products: [],
    };
  }

  return {
    message: "Xin lỗi, tôi không tìm thấy sản phẩm phù hợp với yêu cầu. Bạn thử mô tả rõ hơn nhé! Ví dụ: \"áo thể thao\", \"áo polo dưới 300k\".",
    products: [],
  };
}

onMounted(() => {
  loadProducts();
});
</script>

<style scoped>
.chat-fab-ping {
  animation: chat-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes chat-ping {
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  75%,
  100% {
    transform: scale(1.6);
    opacity: 0;
  }
}

.chat-panel-enter-active {
  animation: chat-slide-up 0.3s ease-out;
}
.chat-panel-leave-active {
  animation: chat-slide-up 0.2s ease-in reverse;
}

@keyframes chat-slide-up {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.typing-dot {
  animation: typing-bounce 1.2s infinite ease-in-out;
}

@keyframes typing-bounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 4px;
}
</style>
