package com.finalproject2.repository;

import com.finalproject2.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByAccount_Id(Integer accountId);
    List<Address> findByAccount_IdAndIsDefaultTrue(Integer accountId);
}
