package com.jewellery.inventory.service;

import com.jewellery.inventory.dto.CustomerDTO;
import com.jewellery.inventory.entity.Customer;
import com.jewellery.inventory.repository.CustomerRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    public CustomerDTO createCustomer(CustomerDTO dto) {
        Customer customer = new Customer();
        customer.setName(dto.getName());
        customer.setPhone(dto.getPhone());
        customer.setEmail(dto.getEmail());
        customer.setAddress(dto.getAddress());
        customer.setCity(dto.getCity());
        customer.setState(dto.getState());
        customer.setPincode(dto.getPincode());

        Customer savedCustomer = customerRepository.save(customer);
        log.info("Customer created: {}", savedCustomer.getId());
        return toDTO(savedCustomer);
    }

    public CustomerDTO updateCustomer(Long id, CustomerDTO dto) {
        Optional<Customer> customerOpt = customerRepository.findById(id);
        if (customerOpt.isEmpty()) {
            throw new RuntimeException("Customer not found");
        }

        Customer customer = customerOpt.get();
        customer.setName(dto.getName());
        customer.setPhone(dto.getPhone());
        customer.setEmail(dto.getEmail());
        customer.setAddress(dto.getAddress());
        customer.setCity(dto.getCity());
        customer.setState(dto.getState());
        customer.setPincode(dto.getPincode());

        Customer updatedCustomer = customerRepository.save(customer);
        log.info("Customer updated: {}", id);
        return toDTO(updatedCustomer);
    }

    public CustomerDTO getCustomer(Long id) {
        Optional<Customer> customerOpt = customerRepository.findById(id);
        if (customerOpt.isEmpty()) {
            throw new RuntimeException("Customer not found");
        }
        return toDTO(customerOpt.get());
    }

    public List<CustomerDTO> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<CustomerDTO> searchCustomers(String name) {
        return customerRepository.findByNameContainingIgnoreCase(name).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public void deleteCustomer(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new RuntimeException("Customer not found");
        }
        customerRepository.deleteById(id);
        log.info("Customer deleted: {}", id);
    }

    private CustomerDTO toDTO(Customer customer) {
        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setName(customer.getName());
        dto.setPhone(customer.getPhone());
        dto.setEmail(customer.getEmail());
        dto.setAddress(customer.getAddress());
        dto.setCity(customer.getCity());
        dto.setState(customer.getState());
        dto.setPincode(customer.getPincode());
        return dto;
    }
}
