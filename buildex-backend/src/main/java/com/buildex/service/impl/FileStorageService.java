package com.buildex.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {
    
    private final String UPLOAD_DIR = "uploads/";
    
    public FileStorageService() {
        // Create upload directory if it doesn't exist
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }
    }
    
    public String storeFile(MultipartFile file) throws IOException {
        // Generate a unique filename
        String originalFileName = file.getOriginalFilename();
        String extension = originalFileName != null ? originalFileName.substring(originalFileName.lastIndexOf(".")) : "";
        String uniqueFileName = UUID.randomUUID().toString() + extension;
        
        // Create the file path
        Path filePath = Paths.get(UPLOAD_DIR).resolve(uniqueFileName);
        
        // Copy file to target location
        Files.copy(file.getInputStream(), filePath);
        
        return "/uploads/" + uniqueFileName;
    }
    
    public String[] storeMultipleFiles(MultipartFile[] files) throws IOException {
        String[] fileUrls = new String[files.length];
        for (int i = 0; i < files.length; i++) {
            fileUrls[i] = storeFile(files[i]);
        }
        return fileUrls;
    }
}