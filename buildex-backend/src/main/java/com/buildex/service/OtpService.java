package com.buildex.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
public class OtpService {

    private final Map<String, String> otpStorage = new ConcurrentHashMap<>();
    private final ScheduledExecutorService cleanupExecutor = Executors.newSingleThreadScheduledExecutor();
    private static final long OTP_VALID_DURATION_MS = 10 * 60 * 1000; // 10 minutes

    public String generateOtp(String email) {
        SecureRandom random = new SecureRandom();
        int otpValue = 100000 + random.nextInt(900000);
        String otp = String.valueOf(otpValue);

        otpStorage.put(email, otp);

        // Schedule cleanup
        cleanupExecutor.schedule(() -> otpStorage.remove(email, otp), OTP_VALID_DURATION_MS, TimeUnit.MILLISECONDS);

        return otp;
    }

    public boolean validateOtp(String email, String otp) {
        String storedOtp = otpStorage.get(email);
        if (storedOtp != null && storedOtp.equals(otp)) {
            otpStorage.remove(email); // One-time use
            return true;
        }
        return false;
    }
}
