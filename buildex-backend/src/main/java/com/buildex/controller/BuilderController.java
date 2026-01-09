package com.buildex.controller;

import com.buildex.entity.Builder;
import com.buildex.service.BuilderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/builders")
@RequiredArgsConstructor
public class BuilderController {
    
    private final BuilderService builderService;
    
    @PostMapping
    public ResponseEntity<Builder> registerBuilder(@RequestBody Builder builder) {
        Builder createdBuilder = builderService.createBuilder(builder);
        return new ResponseEntity<>(createdBuilder, HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Builder> getBuilderById(@PathVariable Long id) {
        Optional<Builder> builder = builderService.getBuilderById(id);
        return builder.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping
    public ResponseEntity<List<Builder>> getAllBuilders() {
        List<Builder> builders = builderService.getAllBuilders();
        return ResponseEntity.ok(builders);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Builder> updateBuilder(@PathVariable Long id, @RequestBody Builder updatedBuilder) {
        Optional<Builder> builderOpt = builderService.updateBuilder(id, updatedBuilder);
        return builderOpt.map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build());
    }
    
    @PatchMapping("/{id}/verify")
    public ResponseEntity<Builder> changeVerificationStatus(@PathVariable Long id, 
                                                           @RequestParam Builder.VerificationStatus status) {
        Optional<Builder> builderOpt = builderService.changeVerificationStatus(id, status);
        return builderOpt.map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build());
    }
}