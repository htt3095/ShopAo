function firstDefined(values) {
    for (const value of values) {
        if (value !== null && value !== undefined) {
            return value
        }
    }
    return null
}

function normalizeCode(value) {
    if (value === null || value === undefined) {
        return ''
    }
    const code = String(value).trim()
    return code
}

function toFiniteNumber(value) {
    if (value === null || value === undefined) {
        return null
    }
    const n = Number(value)
    return Number.isFinite(n) ? n : null
}

export function normalizeAppliedVoucher(rawVoucher, fallbackCode = '') {
    const source = rawVoucher && typeof rawVoucher === 'object' ? rawVoucher : {}
    const nested = source.voucher && typeof source.voucher === 'object' ? source.voucher : {}

    const normalizedCode = normalizeCode(
        firstDefined([
            source.code,
            source.voucherCode,
            source.voucher_code,
            nested.code,
            fallbackCode,
        ]),
    )

    const voucherId = toFiniteNumber(
        firstDefined([
            source.voucherId,
            source.voucher_id,
            source.id,
            nested.id,
        ]),
    )

    const discountType = normalizeCode(
        firstDefined([
            source.discountType,
            source.discount_type,
            nested.discountType,
            nested.discount_type,
        ]),
    )

    const discountValue = Math.max(
        0,
        toFiniteNumber(
            firstDefined([
                source.discountValue,
                source.discount_value,
                nested.discountValue,
                nested.discount_value,
            ]),
        ) || 0,
    )

    const discountAmount = Math.max(
        0,
        toFiniteNumber(
            firstDefined([
                source.discountAmount,
                source.discount_amount,
                source.amount,
                source.value,
                nested.discountAmount,
                nested.discount_amount,
            ]),
        ) || 0,
    )

    const minOrderValue = Math.max(
        0,
        toFiniteNumber(
            firstDefined([
                source.minOrderValue,
                source.min_order_value,
                nested.minOrderValue,
                nested.min_order_value,
            ]),
        ) || 0,
    )

    return {
        id: voucherId,
        code: normalizedCode,
        discountType,
        discountValue,
        discountAmount,
        minOrderValue,
        raw: source,
    }
}