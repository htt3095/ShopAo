/**
 * Gemini AI Service — Chatbot gợi ý sản phẩm
 * Sử dụng Google Gemini API (free tier) để trả lời câu hỏi mua sắm
 */
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

let genAI = null;
let chatSession = null;

const SYSTEM_PROMPT = `Bạn là trợ lý mua sắm AI của cửa hàng áo thể thao SportX. Nhiệm vụ:

1. Trả lời câu hỏi về sản phẩm bằng tiếng Việt, thân thiện, ngắn gọn (tối đa 2-3 câu).
2. Gợi ý sản phẩm phù hợp từ danh sách sản phẩm được cung cấp.
3. Khi gợi ý sản phẩm, trả về JSON với format CHÍNH XÁC sau:

{"message": "Câu trả lời tự nhiên của bạn", "productIds": [1, 2, 3]}

Quy tắc:
- productIds là mảng ID sản phẩm từ catalog, tối đa 4 sản phẩm.
- Nếu không tìm thấy sản phẩm phù hợp, trả productIds rỗng [] và nói rõ là shop không có sản phẩm phù hợp.
- Nếu khách hỏi về giá, lọc CHÍNH XÁC theo khoảng giá khách yêu cầu. KHÔNG gợi ý sản phẩm ngoài khoảng giá.
- Nếu khách hỏi chung chung ("có gì hay không?"), gợi ý sản phẩm bán chạy hoặc nổi bật.
- Nếu khách hỏi ngoài phạm vi (thời tiết, tin tức...), lịch sự từ chối và gợi ý hỏi về sản phẩm áo.
- LUÔN trả về đúng format JSON, không thêm markdown hay text ngoài JSON.
- Trả lời bằng tiếng Việt.`;

function buildProductCatalog(products) {
  if (!Array.isArray(products) || products.length === 0) {
    return "Chưa có sản phẩm nào trong hệ thống.";
  }

  const catalog = products.map((p) => ({
    id: p.id,
    name: p.name || "Không tên",
    price: p._minPrice || p.price || p.minPrice || 0,
    brand: p.brandName || p.brand || "",
    category: p.categoryName || p.category || "",
  }));

  return JSON.stringify(catalog, null, 0);
}

function parseGeminiResponse(text) {
  const cleaned = text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    return {
      message: String(parsed.message || parsed.text || parsed.reply || ""),
      productIds: Array.isArray(parsed.productIds)
        ? parsed.productIds.map(Number).filter(Number.isFinite)
        : [],
    };
  } catch {
    // Gemini sometimes returns plain text instead of JSON
    return {
      message: text.trim(),
      productIds: [],
    };
  }
}

export function isGeminiConfigured() {
  return !!GEMINI_API_KEY && GEMINI_API_KEY !== "your_gemini_api_key_here";
}

export function initGemini() {
  if (!isGeminiConfigured()) {
    console.warn("[Gemini] API key chưa được cấu hình. Thêm VITE_GEMINI_API_KEY vào file .env");
    return false;
  }

  try {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    chatSession = null;
    return true;
  } catch (err) {
    console.error("[Gemini] Khởi tạo thất bại:", err);
    return false;
  }
}

export async function sendChatMessage(userMessage, products = []) {
  if (!genAI) {
    const ok = initGemini();
    if (!ok) {
      return {
        message: "Trợ lý AI chưa được kích hoạt. Vui lòng liên hệ quản trị viên.",
        productIds: [],
      };
    }
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 1024,
      },
    });

    if (!chatSession) {
      const catalog = buildProductCatalog(products);
      chatSession = model.startChat({
        history: [
          {
            role: "user",
            parts: [
              {
                text: `${SYSTEM_PROMPT}\n\nDanh sách sản phẩm hiện có:\n${catalog}`,
              },
            ],
          },
          {
            role: "model",
            parts: [
              {
                text: '{"message": "Xin chào! Tôi là trợ lý mua sắm của SportX. Bạn đang tìm kiếm loại giày nào? Tôi có thể giúp bạn tìm sản phẩm phù hợp nhất!", "productIds": []}',
              },
            ],
          },
        ],
      });
    }

    const result = await chatSession.sendMessage(userMessage);
    const responseText = result.response.text();

    return parseGeminiResponse(responseText);
  } catch (err) {
    console.error("[Gemini] Lỗi gửi tin nhắn:", err);

    // Reset session on error so next message starts fresh
    chatSession = null;

    if (err?.message?.includes("SAFETY")) {
      return {
        message: "Xin lỗi, tôi không thể trả lời câu hỏi này. Bạn có thể hỏi về sản phẩm giày thể thao nhé!",
        productIds: [],
      };
    }

    return {
      message: "Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau nhé!",
      productIds: [],
    };
  }
}

export function resetChat() {
  chatSession = null;
}
