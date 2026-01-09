package com.buildex.service;

import com.buildex.entity.RentRequest;
import com.buildex.repository.RentRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RentRequestService {
    
    private final RentRequestRepository rentRequestRepository;
    
    public RentRequest createRentRequest(RentRequest rentRequest) {
        return rentRequestRepository.save(rentRequest);
    }
    
    public List<RentRequest> getRentRequestsByBuilderId(Long builderId) {
        return rentRequestRepository.findByBuilderId(builderId);
    }
    
    public Optional<RentRequest> updateRentRequestStatus(Long id, RentRequest.Status status) {
        Optional<RentRequest> rentRequestOpt = rentRequestRepository.findById(id);
        if (rentRequestOpt.isPresent()) {
            RentRequest rentRequest = rentRequestOpt.get();
            rentRequest.setStatus(status);
            return Optional.of(rentRequestRepository.save(rentRequest));
        }
        return Optional.empty();
    }
    
    public Optional<RentRequest> getRentRequestById(Long id) {
        return rentRequestRepository.findById(id);
    }
    
    public List<RentRequest> getAllRentRequests() {
        return rentRequestRepository.findAll();
    }
}