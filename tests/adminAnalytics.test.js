import test from 'node:test';
import assert from 'node:assert/strict';
import {
    buildRevenueBuckets,
    normalizeOrderStatusValue,
    normalizePaymentStatusValue,
} from '../src/utils/adminAnalytics.js';

test('recognizes damaged, lost, and return-in-progress states', () => {
    assert.equal(normalizeOrderStatusValue('DAMAGED'), 'DAMAGED');
    assert.equal(normalizeOrderStatusValue('LOST'), 'LOST');
    assert.equal(normalizeOrderStatusValue('RETURNED'), 'RETURNED');
    assert.equal(normalizeOrderStatusValue('RETURNING'), 'RETURNING');
    assert.equal(normalizeOrderStatusValue('RETURN_REQUEST'), 'RETURN_REQUEST');
});

test('counts refunded outcomes only for final refund-like statuses', () => {
    const buckets = buildRevenueBuckets([{
            id: 1,
            createdAt: '2026-08-10T10:00:00Z',
            status: 'RETURNING',
            paymentStatus: 'PAID',
            finalAmount: 100000,
        },
        {
            id: 2,
            createdAt: '2026-08-10T10:30:00Z',
            status: 'RETURNED',
            paymentStatus: 'PAID',
            finalAmount: 200000,
        },
        {
            id: 3,
            createdAt: '2026-08-10T11:00:00Z',
            status: 'DAMAGED',
            paymentStatus: 'PAID',
            finalAmount: 300000,
        },
    ], { mode: 'day', startDate: new Date('2026-08-10'), endDate: new Date('2026-08-10') });

    assert.equal(buckets[0].refundedCount, 2);
    assert.equal(buckets[0].refundedRevenue, 500000);
    assert.equal(buckets[0].netRevenue, -500000);
});

test('normalizes payment status from refund-like statuses', () => {
    assert.equal(normalizePaymentStatusValue('REFUNDED'), 'HOAN_TIEN');
    assert.equal(normalizePaymentStatusValue('PAID', 'RETURNED'), 'HOAN_TIEN');
});