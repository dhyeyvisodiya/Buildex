package com.buildex.service;

import com.buildex.entity.Property;
import com.buildex.exception.ResourceNotFoundException;
import com.buildex.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PropertyService {
    
    private final PropertyRepository propertyRepository;
    private final BuilderService builderService;
    
    public Property createProperty(Long builderId, Property property) {
        if (builderService.existsById(builderId)) {
            property.setBuilder(builderService.getBuilderById(builderId).get());
            return propertyRepository.save(property);
        }
        throw new ResourceNotFoundException("Builder not found with id: " + builderId);
    }
    
    public Optional<Property> getPropertyById(Long id) {
        return propertyRepository.findById(id);
    }
    
    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }
    
    public List<Property> getPropertiesByBuilderId(Long builderId) {
        return propertyRepository.findByBuilderId(builderId);
    }
    
    public Optional<Property> updateProperty(Long id, Property updatedProperty) {
        if (propertyRepository.existsById(id)) {
            updatedProperty.setId(id);
            return Optional.of(propertyRepository.save(updatedProperty));
        }
        return Optional.empty();
    }
    
    public Optional<Property> updateAvailabilityStatus(Long id, Property.AvailabilityStatus status) {
        Optional<Property> propertyOpt = propertyRepository.findById(id);
        if (propertyOpt.isPresent()) {
            Property property = propertyOpt.get();
            property.setAvailabilityStatus(status);
            return Optional.of(propertyRepository.save(property));
        }
        return Optional.empty();
    }
    
    public void deleteProperty(Long id) {
        propertyRepository.deleteById(id);
    }
    
    public List<Property> searchProperties(Property.Purpose purpose, 
                                          Property.PropertyType propertyType,
                                          String city, 
                                          String area,
                                          Property.AvailabilityStatus availabilityStatus) {
        return propertyRepository.findByFilters(purpose, propertyType, city, area, availabilityStatus);
    }
}