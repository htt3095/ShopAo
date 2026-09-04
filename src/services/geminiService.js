/**
 * Gemini AI Service — Chatbot gợi ý sản phẩm
 * Sử dụng Google Gemini API (free tier) để trả lời câu hỏi mua sắm
 */
import { GoogleGenerativeAI } from '@google/generative-ai'

const GEMINI_API_KEY
  = import.meta.env.VITE_GEMINI_API_KEY || ''

let genAI = null
let chatSession = null

const SYSTEM_PROMPT = `Bạn là trợ lý mua sắm AI của cửa hàng áo thể thao SportX. Nhiệm vụ:

1. Giao tiếp tự nhiên, thân thiện và như một nhân viên tư vấn bán hàng thật.
2. Trả lời bằng tiếng Việt, ngắn gọn nhưng hữu ích, thường 1-3 câu.
3. Khi khách hỏi về sản phẩm, hãy dùng thông tin trong catalog để gợi ý sản phẩm phù hợp nhất.
4. Khi gợi ý sản phẩm, luôn trả về đúng định dạng JSON sau:

{"message": "Câu trả lời tự nhiên của bạn", "productIds": [1, 2, 3]}

Quy tắc:
- productIds là mảng ID sản phẩm từ catalog, tối đa 4 sản phẩm.
- Nếu khách hỏi về giá, hãy lọc đúng theo khoảng giá họ nêu và không gợi ý sản phẩm ngoài khoảng đó.
- Nếu khách hỏi chung chung như "có gì hay không?", hãy gợi ý sản phẩm nổi bật, bán chạy hoặc phù hợp nhất.
- Nếu khách chưa nói rõ nhu cầu, hãy hỏi thêm 1 câu ngắn để hiểu phong cách, ngân sách, kích cỡ hoặc mục đích.
- Nếu không có sản phẩm phù hợp, hãy nói rõ và đề xuất cách hỗ trợ tiếp theo.
- Nếu câu hỏi ngoài phạm vi sản phẩm áo thể thao, hãy lịch sự từ chối và chuyển hướng lại về sản phẩm.
- LUÔN trả về đúng format JSON, không thêm markdown hay text ngoài JSON.
- Trả lời bằng tiếng Việt và cố gắng giúp khách hàng quyết định dễ hơn.`

function buildProductCatalog (products) {
  if (!Array.isArray(products) || products.length === 0) {
    return 'Chưa có sản phẩm nào trong hệ thống.'
  }

  const catalog = products.map(p => ({
    id: p.id,
    name: p.name || 'Không tên',
    price: p._minPrice || p.price || p.minPrice || 0,
    brand: p.brandName || p.brand || '',
    category: p.categoryName || p.category || '',
    description: p.description || '',
  }))

  return JSON.stringify(catalog, null, 0)
}

function parseGeminiResponse (text) {
  const cleaned = text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim()

  try {
    const parsed = JSON.parse(cleaned)
    return {
      message: String(parsed.message || parsed.text || parsed.reply || ''),
      productIds: Array.isArray(parsed.productIds)
        ? parsed.productIds.map(Number).filter(Number.isFinite)
        : [],
    }
  } catch {
    // Gemini sometimes returns plain text instead of JSON
    return {
      message: text.trim(),
      productIds: [],
    }
  }
}

export function isGeminiConfigured () {
  return !!GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here'
}

export function initGemini () {
  if (!isGeminiConfigured()) {
    console.warn('[Gemini] API key chưa được cấu hình. Thêm VITE_GEMINI_API_KEY vào file .env')
    return false
  }

  try {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    chatSession = null
    return true
  } catch (error) {
    console.error('[Gemini] Khởi tạo thất bại:', error)
    return false
  }
}

export async function sendChatMessage (userMessage, products = []) {
  if (!genAI) {
    const ok = initGemini()
    if (!ok) {
      return {
        message: 'Trợ lý AI chưa được kích hoạt. Vui lòng liên hệ quản trị viên.',
        productIds: [],
      }
    }
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.5-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 1024,
      },
    })

    if (!chatSession) {
      const catalog = buildProductCatalog(products)
      chatSession = model.startChat({
        history: [{
          role: 'user',
          parts: [{
            text: `${SYSTEM_PROMPT}\n\nDanh sách sản phẩm hiện có:\n${catalog}`,
          }],
        },
        {
          role: 'model',
          parts: [{
            text: '{"message": "Xin chào! Tôi có thể giúp bạn tìm áo thể thao phù hợp với phong cách, ngân sách và kích cỡ của bạn. Bạn đang muốn tìm sản phẩm nào?", "productIds": []}',
          }],
        },
        ],
      })
    }

    const result = await chatSession.sendMessage(userMessage)
    const responseText = result.response.text()

    return parseGeminiResponse(responseText)
  } catch (error) {
    console.error('[Gemini] Lỗi gửi tin nhắn:', error)

    // Reset session on error so next message starts fresh
    chatSession = null

    const errorMessage = error && error.message ? error.message : ''

    if (errorMessage.includes('SAFETY')) {
      return {
        message: 'Xin lỗi, tôi không thể trả lời câu hỏi này. Bạn có thể hỏi về sản phẩm áo thể thao hoặc nhu cầu mua sắm của mình nhé!',
        productIds: [],
      }
    }

    return {
      message: 'Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau nhé!',
      productIds: [],
    }
  }
}

export function resetChat () {
  chatSession = null
}
