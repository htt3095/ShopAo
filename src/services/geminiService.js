/**
 * Gemini AI Service — Chatbot gợi ý sản phẩm
 * Sử dụng Google Gemini API (free tier) để trả lời câu hỏi mua sắm
 */
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY =
    import.meta.env.VITE_GEMINI_API_KEY || "";

let genAI = null;
let chatSession = null;

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
- Nếu khách hỏi dạng khám phá catalog như "shop có những loại áo gì", "có hãng nào", "có gì trong shop", hãy tóm tắt ngắn gọn các nhóm sản phẩm hoặc thương hiệu đang có rồi gợi ý 2-4 sản phẩm đại diện.
- Với câu hỏi khám phá chung, ưu tiên trả lời như một tư vấn viên thật: mô tả ngắn gọn shop đang có gì, điểm khác nhau giữa các dòng áo, mức giá tương đối và chỉ dùng productIds như phần gợi ý thêm, không biến câu trả lời thành danh sách máy móc.
- Nếu khách chưa nói rõ nhu cầu, hãy hỏi thêm 1 câu ngắn để hiểu phong cách, ngân sách, kích cỡ hoặc mục đích.
- Nếu không có sản phẩm phù hợp, hãy nói rõ và đề xuất cách hỗ trợ tiếp theo.
- Nếu câu hỏi ngoài phạm vi sản phẩm áo thể thao, hãy lịch sự từ chối và chuyển hướng lại về sản phẩm.
- LUÔN trả về đúng format JSON, không thêm markdown hay text ngoài JSON.
- Trả lời bằng tiếng Việt và cố gắng giúp khách hàng quyết định dễ hơn.`;

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
        keywords: [
            p.name || "",
            p.brandName || p.brand || "",
            p.categoryName || p.category || "",
            p.description || p.shortDescription || "",
        ].filter(Boolean).join(" | "),
    }));

    return JSON.stringify(catalog, null, 0);
}

function normalizeQueryText(value) {
    return String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

function isOverviewIntent(query) {
    const normalizedQuery = normalizeQueryText(query);
    return [
        "co nhung loai",
        "co loai nao",
        "co gi trong shop",
        "shop co gi",
        "co gi hay",
        "quan ao trong shop",
        "nhung hang nao",
        "co hang nao",
        "biet them",
        "them ve ao",
        "ao trong shop",
        "xem ao",
        "tell me about",
        "what can you tell me",
        "what do you have",
        "what is in the shop",
        "shirts in the shop",
        "about the shirts",
        "about shirts",
        "what brands",
        "any brands",
    ].some((pattern) => normalizedQuery.includes(pattern));
}

function filterMerchandiseProducts(products) {
    const list = Array.isArray(products) ? products : [];
    return list.filter((product) => {
        const name = normalizeQueryText(product && product.name);
        const price = Number(product && (product._minPrice || product.price || product.minPrice || 0));
        return !name.includes("test") && price >= 1000;
    });
}

function collectUniqueValues(items, getter, limit = 6) {
    const values = [];
    const seen = new Set();

    for (const item of items) {
        const value = String(getter(item) || "").trim();
        if (!value) continue;

        const key = value.toLowerCase();
        if (seen.has(key)) continue;

        seen.add(key);
        values.push(value);

        if (values.length >= limit) break;
    }

    return values;
}

function buildDynamicQueryContext(userMessage, products) {
    const usableProducts = filterMerchandiseProducts(products);
    if (usableProducts.length === 0) {
        return "Không có thêm dữ liệu catalog sạch để tham chiếu cho câu hỏi này.";
    }

    const normalizedQuery = normalizeQueryText(userMessage);
    const categories = collectUniqueValues(usableProducts, (item) => item.categoryName || item.category, 5);
    const brands = collectUniqueValues(usableProducts, (item) => item.brandName || item.brand, 5);
    const prices = usableProducts
        .map((item) => Number(item._minPrice || item.price || item.minPrice || 0))
        .filter((value) => Number.isFinite(value) && value > 0);
    const minPrice = prices.length > 0 ? Math.min(...prices) : null;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : null;

    const candidateProducts = usableProducts.slice(0, 4).map((item) => ({
        id: item.id,
        name: item.name,
        brand: item.brandName || item.brand || "",
        category: item.categoryName || item.category || "",
        price: item._minPrice || item.price || item.minPrice || 0,
    }));

    if (isOverviewIntent(normalizedQuery)) {
        return [
            "Đây là câu hỏi khám phá catalog tổng quát.",
            "Hãy trả lời tự nhiên như nhân viên tư vấn, không mở đầu bằng việc đếm số sản phẩm tìm thấy.",
            `Nhóm sản phẩm nổi bật: ${categories.join(", ") || "chưa rõ"}.`,
            `Thương hiệu hiện có: ${brands.join(", ") || "chưa rõ"}.`,
            minPrice !== null && maxPrice !== null ?
            `Khoảng giá tham khảo: ${minPrice} đến ${maxPrice} VND.` :
            "Khoảng giá: chưa xác định rõ.",
            `Một vài sản phẩm đại diện: ${JSON.stringify(candidateProducts)}.`,
            "Nếu phù hợp, hãy gợi ý 2-4 sản phẩm đại diện bằng productIds, nhưng phần message phải là câu trả lời tư vấn tự nhiên.",
        ].join("\n");
    }

    return [
        "Đây là dữ liệu tham chiếu thêm cho câu hỏi hiện tại.",
        `Thương hiệu liên quan: ${brands.join(", ") || "chưa rõ"}.`,
        `Danh mục liên quan: ${categories.join(", ") || "chưa rõ"}.`,
        `Ứng viên sản phẩm: ${JSON.stringify(candidateProducts)}.`,
    ].join("\n");
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
            productIds: Array.isArray(parsed.productIds) ?
                parsed.productIds.map(Number).filter(Number.isFinite) : [],
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
                history: [{
                        role: "user",
                        parts: [{
                            text: `${SYSTEM_PROMPT}\n\nDanh sách sản phẩm hiện có:\n${catalog}`,
                        }, ],
                    },
                    {
                        role: "model",
                        parts: [{
                            text: '{"message": "Xin chào! Tôi có thể giúp bạn tìm áo thể thao phù hợp với phong cách, ngân sách và kích cỡ của bạn. Bạn đang muốn tìm sản phẩm nào?", "productIds": []}',
                        }, ],
                    },
                ],
            });
        }

        const queryContext = buildDynamicQueryContext(userMessage, products);
        const result = await chatSession.sendMessage(
            `${userMessage}\n\n[NGU CANH NOI BO - KHONG LAP LAI NGUYEN VAN]\n${queryContext}`,
        );
        const responseText = result.response.text();

        return parseGeminiResponse(responseText);
    } catch (err) {
        console.error("[Gemini] Lỗi gửi tin nhắn:", err);

        // Reset session on error so next message starts fresh
        chatSession = null;

        var errorMessage = err && err.message ? err.message : "";

        if (errorMessage.indexOf("SAFETY") !== -1) {
            return {
                message: "Xin lỗi, tôi không thể trả lời câu hỏi này. Bạn có thể hỏi về sản phẩm áo thể thao hoặc nhu cầu mua sắm của mình nhé!",
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