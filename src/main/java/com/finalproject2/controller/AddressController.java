package com.finalproject2.controller;

import com.finalproject2.entity.Account;
import com.finalproject2.entity.Address;
import com.finalproject2.exception.BadRequestException;
import com.finalproject2.exception.NotFoundException;
import com.finalproject2.repository.AccountRepository;
import com.finalproject2.repository.AddressRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/addresses")
@CrossOrigin(originPatterns = "*")
public class AddressController {

    private final AddressRepository addressRepo;
    private final AccountRepository accountRepo;

    public AddressController(AddressRepository addressRepo, AccountRepository accountRepo) {
        this.addressRepo = addressRepo;
        this.accountRepo = accountRepo;
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<?> getAddressesByAccount(@PathVariable Integer accountId) {
        List<Address> addresses = addressRepo.findByAccount_Id(accountId);
        return ResponseEntity.ok(addresses);
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> createAddress(@RequestBody Map<String, Object> payload) {
        Integer accountId = asInteger(payload.get("accountId"));
        if (accountId == null) {
            throw new BadRequestException("Thiếu accountId");
        }
        Account account = accountRepo.findById(accountId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy tài khoản"));

        Address address = new Address();
        address.setAccount(account);
        address.setFullname(asString(payload.get("fullname")));
        address.setPhone(asString(payload.get("phone")));
        address.setAddress(asString(payload.get("address")));
        
        Boolean isDefault = asBoolean(payload.get("isDefault"));
        if (isDefault != null && isDefault) {
            // Unset other default addresses
            List<Address> existing = addressRepo.findByAccount_Id(accountId);
            for (Address a : existing) {
                if (Boolean.TRUE.equals(a.getIsDefault())) {
                    a.setIsDefault(false);
                    addressRepo.save(a);
                }
            }
            address.setIsDefault(true);
        } else {
            // If it's the first address, make it default automatically
            if (addressRepo.findByAccount_Id(accountId).isEmpty()) {
                address.setIsDefault(true);
            } else {
                address.setIsDefault(false);
            }
        }

        Address saved = addressRepo.save(address);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> updateAddress(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Address address = addressRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy địa chỉ"));

        String fullname = asString(payload.get("fullname"));
        if (fullname != null) address.setFullname(fullname);
        
        String phone = asString(payload.get("phone"));
        if (phone != null) address.setPhone(phone);
        
        String addrStr = asString(payload.get("address"));
        if (addrStr != null) address.setAddress(addrStr);
        
        Boolean isDefault = asBoolean(payload.get("isDefault"));
        if (isDefault != null && isDefault && !Boolean.TRUE.equals(address.getIsDefault())) {
            // Unset others
            List<Address> existing = addressRepo.findByAccount_Id(address.getAccount().getId());
            for (Address a : existing) {
                if (Boolean.TRUE.equals(a.getIsDefault()) && !a.getId().equals(id)) {
                    a.setIsDefault(false);
                    addressRepo.save(a);
                }
            }
            address.setIsDefault(true);
        }

        Address saved = addressRepo.save(address);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteAddress(@PathVariable Long id) {
        Address address = addressRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy địa chỉ"));
        
        boolean wasDefault = Boolean.TRUE.equals(address.getIsDefault());
        Integer accountId = address.getAccount().getId();
        
        addressRepo.delete(address);
        
        // If we deleted the default address, make another one default if it exists
        if (wasDefault) {
            List<Address> remaining = addressRepo.findByAccount_Id(accountId);
            if (!remaining.isEmpty()) {
                Address first = remaining.get(0);
                first.setIsDefault(true);
                addressRepo.save(first);
            }
        }
        
        return ResponseEntity.ok(Map.of("success", true));
    }

    private Integer asInteger(Object v) {
        return v == null ? null : Integer.valueOf(v.toString());
    }

    private String asString(Object v) {
        return v == null ? null : v.toString();
    }

    private Boolean asBoolean(Object v) {
        if (v == null) return null;
        if (v instanceof Boolean) return (Boolean) v;
        return Boolean.valueOf(v.toString());
    }
}
