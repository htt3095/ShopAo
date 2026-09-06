package com.finalproject2.model.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PosStockAdjustmentRequest {
    private Long variantId;
    private Integer reservedQuantityDelta;
}