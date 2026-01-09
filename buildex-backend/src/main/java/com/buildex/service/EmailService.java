package com.buildex.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendSimpleEmail(String toEmail, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    public void sendOtpEmail(String toEmail, String otp) {
        String subject = "Your Buildex Verification Code";
        String body = "Hello,\n\n" +
                "Your verification code for Buildex is: " + otp + "\n\n" +
                "This code is valid for 10 minutes.\n\n" +
                "Best Regards,\n" +
                "The Buildex Team";
        sendSimpleEmail(toEmail, subject, body);
    }
}
