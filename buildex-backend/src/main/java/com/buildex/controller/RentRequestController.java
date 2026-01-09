package com.buildex.controller;

import com.buildex.entity.RentRequest;
import com.buildex.service.RentRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/rent-requests")
@RequiredArgsConstructor
public class RentRequestController {
    
    private final RentRequestService rentRequestService;
    
    @PostMapping
    public ResponseEntity<RentRequest> createRentRequest(@RequestBody RentRequest rentRequest) {
        RentRequest createdRequest = rentRequestService.createRentRequest(rentRequest);
        return new ResponseEntity<>(createdRequest, HttpStatus.CREATED);
    }
    
    @GetMapping("/builder/{builderId}")
    public ResponseEntity<List<RentRequest>> getRentRequestsByBuilderId(@PathVariable Long builderId) {
        List<RentRequest> rentRequests = rentRequestService.getRentRequestsByBuilderId(builderId);
        return ResponseEntity.ok(rentRequests);
    }
    
    @PatchMapping("/{id}/approve")
    public ResponseEntity<RentRequest> approveRentRequest(@PathVariable Long id) {
        Optional<RentRequest> updatedRequest = rentRequestService.updateRentRequestStatus(id, RentRequest.Status.APPROVED);
        return updatedRequest.map(ResponseEntity::ok)
                            .orElse(ResponseEntity.notFound().build());
    }
    
    @PatchMapping("/{id}/reject")
    public ResponseEntity<RentRequest> rejectRentRequest(@PathVariable Long id) {
        Optional<RentRequest> updatedRequest = rentRequestService.updateRentRequestStatus(id, RentRequest.Status.REJECTED);
        return updatedRequest.map(ResponseEntity::ok)
                            .orElse(ResponseEntity.notFound().build());
    }
}