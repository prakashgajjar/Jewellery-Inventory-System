package com.jewellery.inventory.repository;

import com.jewellery.inventory.entity.Rate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface RateRepository extends JpaRepository<Rate, Long> {
    Optional<Rate> findByDate(LocalDate date);
    Optional<Rate> findFirstByOrderByDateDesc();
}
