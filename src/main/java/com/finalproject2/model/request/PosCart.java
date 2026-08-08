package com.finalproject2.model.request;

import java.util.List;

public class PosCart {
    private Long invoiceId;
    private List<PosCartItem> items;

    public PosCart() {}
    public PosCart(Long invoiceId, List<PosCartItem> items) {
        this.invoiceId = invoiceId;
        this.items = items;
    }

    // getters & setters
    public Long getInvoiceId() { return invoiceId; }
    public void setInvoiceId(Long invoiceId) { this.invoiceId = invoiceId; }
    public List<PosCartItem> getItems() { return items; }
    public void setItems(List<PosCartItem> items) { this.items = items; }
}

