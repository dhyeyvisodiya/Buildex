package com.buildex.repository;

import com.buildex.entity.Builder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BuilderRepository extends JpaRepository<Builder, Long> {
    Optional<Builder> findByEmail(String email);
}