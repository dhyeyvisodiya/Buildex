package com.buildex.service;

import com.buildex.entity.Enquiry;
import com.buildex.repository.EnquiryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EnquiryService {
    
    private final EnquiryRepository enquiryRepository;
    
    public Enquiry createEnquiry(Enquiry enquiry) {
        return enquiryRepository.save(enquiry);
    }
    
    public List<Enquiry> getEnquiriesByPropertyId(Long propertyId) {
        return enquiryRepository.findByPropertyId(propertyId);
    }
    
    public List<Enquiry> getEnquiriesByBuilderId(Long builderId) {
        return enquiryRepository.findByBuilderId(builderId);
    }
    
    public Optional<Enquiry> getEnquiryById(Long id) {
        return enquiryRepository.findById(id);
    }
    
    public List<Enquiry> getAllEnquiries() {
        return enquiryRepository.findAll();
    }
}