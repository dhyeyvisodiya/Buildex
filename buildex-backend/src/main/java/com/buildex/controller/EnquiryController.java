package com.buildex.controller;

import com.buildex.entity.Enquiry;
import com.buildex.service.EnquiryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/enquiries")
@RequiredArgsConstructor
public class EnquiryController {
    
    private final EnquiryService enquiryService;
    
    @PostMapping
    public ResponseEntity<Enquiry> createEnquiry(@RequestBody Enquiry enquiry) {
        Enquiry createdEnquiry = enquiryService.createEnquiry(enquiry);
        return new ResponseEntity<>(createdEnquiry, HttpStatus.CREATED);
    }
    
    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<Enquiry>> getEnquiriesByPropertyId(@PathVariable Long propertyId) {
        List<Enquiry> enquiries = enquiryService.getEnquiriesByPropertyId(propertyId);
        return ResponseEntity.ok(enquiries);
    }
    
    @GetMapping("/builder/{builderId}")
    public ResponseEntity<List<Enquiry>> getEnquiriesByBuilderId(@PathVariable Long builderId) {
        List<Enquiry> enquiries = enquiryService.getEnquiriesByBuilderId(builderId);
        return ResponseEntity.ok(enquiries);
    }
}