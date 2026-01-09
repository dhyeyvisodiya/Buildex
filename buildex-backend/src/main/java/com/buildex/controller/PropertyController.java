package com.buildex.controller;

import com.buildex.entity.Property;
import com.buildex.service.PropertyService;
import com.buildex.service.impl.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
public class PropertyController {
    
    private final PropertyService propertyService;
    private final FileStorageService fileStorageService;
    
    @PostMapping("/builder/{builderId}")
    public ResponseEntity<Property> createProperty(@PathVariable Long builderId, @RequestBody Property property) {
        Property createdProperty = propertyService.createProperty(builderId, property);
        return new ResponseEntity<>(createdProperty, HttpStatus.CREATED);
    }
    
    @PostMapping("/upload-images")
    public ResponseEntity<String[]> uploadPropertyImages(@RequestParam("files") MultipartFile[] files) {
        try {
            String[] fileUrls = fileStorageService.storeMultipleFiles(files);
            return ResponseEntity.ok(fileUrls);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping
    public ResponseEntity<List<Property>> getAllProperties() {
        List<Property> properties = propertyService.getAllProperties();
        return ResponseEntity.ok(properties);
    }
    
    @GetMapping("/{propertyId}")
    public ResponseEntity<Property> getPropertyById(@PathVariable Long propertyId) {
        Optional<Property> property = propertyService.getPropertyById(propertyId);
        return property.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/builder/{builderId}")
    public ResponseEntity<List<Property>> getPropertiesByBuilderId(@PathVariable Long builderId) {
        List<Property> properties = propertyService.getPropertiesByBuilderId(builderId);
        return ResponseEntity.ok(properties);
    }
    
    @PutMapping("/{propertyId}")
    public ResponseEntity<Property> updateProperty(@PathVariable Long propertyId, @RequestBody Property updatedProperty) {
        Optional<Property> propertyOpt = propertyService.updateProperty(propertyId, updatedProperty);
        return propertyOpt.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
    }
    
    @PatchMapping("/{propertyId}/availability")
    public ResponseEntity<Property> updateAvailabilityStatus(@PathVariable Long propertyId, 
                                                            @RequestParam Property.AvailabilityStatus status) {
        Optional<Property> propertyOpt = propertyService.updateAvailabilityStatus(propertyId, status);
        return propertyOpt.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{propertyId}")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long propertyId) {
        propertyService.deleteProperty(propertyId);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Property>> searchProperties(
            @RequestParam(required = false) Property.Purpose purpose,
            @RequestParam(required = false) Property.PropertyType propertyType,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String area,
            @RequestParam(required = false) Property.AvailabilityStatus availabilityStatus) {
        List<Property> properties = propertyService.searchProperties(purpose, propertyType, city, area, availabilityStatus);
        return ResponseEntity.ok(properties);
    }
}