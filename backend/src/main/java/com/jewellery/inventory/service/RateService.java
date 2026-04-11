package com.jewellery.inventory.service;

import com.jewellery.inventory.dto.RateDTO;
import com.jewellery.inventory.entity.Rate;
import com.jewellery.inventory.repository.RateRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class RateService {

    @Autowired
    private RateRepository rateRepository;

    public RateDTO createRate(RateDTO dto) {
        Rate rate = new Rate();
        rate.setGoldRate(dto.getGoldRate());
        rate.setSilverRate(dto.getSilverRate());
        rate.setDate(dto.getDate() != null ? dto.getDate() : LocalDate.now());

        Rate savedRate = rateRepository.save(rate);
        log.info("Rate created for date: {}", savedRate.getDate());
        return toDTO(savedRate);
    }

    public RateDTO updateRate(Long id, RateDTO dto) {
        Optional<Rate> rateOpt = rateRepository.findById(id);
        if (rateOpt.isEmpty()) {
            throw new RuntimeException("Rate not found");
        }

        Rate rate = rateOpt.get();
        rate.setGoldRate(dto.getGoldRate());
        rate.setSilverRate(dto.getSilverRate());

        Rate updatedRate = rateRepository.save(rate);
        log.info("Rate updated: {}", id);
        return toDTO(updatedRate);
    }

    public RateDTO getRate(Long id) {
        Optional<Rate> rateOpt = rateRepository.findById(id);
        if (rateOpt.isEmpty()) {
            throw new RuntimeException("Rate not found");
        }
        return toDTO(rateOpt.get());
    }

    public RateDTO getRateByDate(LocalDate date) {
        Optional<Rate> rateOpt = rateRepository.findByDate(date);
        if (rateOpt.isEmpty()) {
            throw new RuntimeException("Rate not found for date: " + date);
        }
        return toDTO(rateOpt.get());
    }

    public RateDTO getLatestRate() {
        Optional<Rate> rateOpt = rateRepository.findFirstByOrderByDateDesc();
        if (rateOpt.isEmpty()) {
            throw new RuntimeException("No rate found");
        }
        return toDTO(rateOpt.get());
    }

    public List<RateDTO> getAllRates() {
        return rateRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private RateDTO toDTO(Rate rate) {
        RateDTO dto = new RateDTO();
        dto.setId(rate.getId());
        dto.setGoldRate(rate.getGoldRate());
        dto.setSilverRate(rate.getSilverRate());
        dto.setDate(rate.getDate());
        return dto;
    }
}
