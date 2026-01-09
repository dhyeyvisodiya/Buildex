package com.buildex.service;

import com.buildex.entity.Builder;
import com.buildex.repository.BuilderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BuilderService {
    
    private final BuilderRepository builderRepository;
    
    public Builder createBuilder(Builder builder) {
        return builderRepository.save(builder);
    }
    
    public Optional<Builder> getBuilderById(Long id) {
        return builderRepository.findById(id);
    }
    
    public List<Builder> getAllBuilders() {
        return builderRepository.findAll();
    }
    
    public Optional<Builder> updateBuilder(Long id, Builder updatedBuilder) {
        if (builderRepository.existsById(id)) {
            updatedBuilder.setId(id);
            return Optional.of(builderRepository.save(updatedBuilder));
        }
        return Optional.empty();
    }
    
    public Optional<Builder> changeVerificationStatus(Long id, Builder.VerificationStatus status) {
        Optional<Builder> builderOpt = builderRepository.findById(id);
        if (builderOpt.isPresent()) {
            Builder builder = builderOpt.get();
            builder.setVerificationStatus(status);
            return Optional.of(builderRepository.save(builder));
        }
        return Optional.empty();
    }
    
    public boolean existsById(Long id) {
        return builderRepository.existsById(id);
    }
}