package com.buildex.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "properties")
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 5000) // Large text field for detailed description
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "property_type")
    private PropertyType propertyType;

    @Enumerated(EnumType.STRING)
    @Column(name = "purpose")
    private Purpose purpose; // BUY or RENT

    @Column(name = "price") // For buy
    private BigDecimal price;

    @Column(name = "rent_amount") // For rent
    private BigDecimal rentAmount;

    @Column(name = "deposit_amount")
    private BigDecimal depositAmount;

    @Column(name = "area_sqft")
    private Integer areaSqft;

    @ElementCollection
    @CollectionTable(name = "property_amenities", joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "amenity")
    @org.hibernate.annotations.BatchSize(size = 50)
    private List<String> amenities;

    @Column(name = "possession_year")
    private Integer possessionYear;

    @Enumerated(EnumType.STRING)
    @Column(name = "construction_status")
    private ConstructionStatus constructionStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "availability_status")
    private AvailabilityStatus availabilityStatus = AvailabilityStatus.AVAILABLE;

    @Column(name = "city", nullable = false)
    private String city;

    @Column(name = "area", nullable = false)
    private String area;

    @Column(name = "google_map_link")
    private String googleMapLink;

    @Column(name = "brochure_url")
    private String brochureUrl;

    @Column(name = "virtual_tour_link")
    private String virtualTourLink;

    @ElementCollection
    @CollectionTable(name = "property_images", joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "image_url")
    @org.hibernate.annotations.BatchSize(size = 50)
    private List<String> imageUrls;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "builder_id", nullable = false)
    private Builder builder;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public enum PropertyType {
        RESIDENTIAL, COMMERCIAL
    }

    public enum Purpose {
        BUY, RENT
    }

    public enum ConstructionStatus {
        UNDER_CONSTRUCTION, READY
    }

    public enum AvailabilityStatus {
        AVAILABLE, BOOKED, SOLD
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public PropertyType getPropertyType() {
        return propertyType;
    }

    public void setPropertyType(PropertyType propertyType) {
        this.propertyType = propertyType;
    }

    public Purpose getPurpose() {
        return purpose;
    }

    public void setPurpose(Purpose purpose) {
        this.purpose = purpose;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getRentAmount() {
        return rentAmount;
    }

    public void setRentAmount(BigDecimal rentAmount) {
        this.rentAmount = rentAmount;
    }

    public BigDecimal getDepositAmount() {
        return depositAmount;
    }

    public void setDepositAmount(BigDecimal depositAmount) {
        this.depositAmount = depositAmount;
    }

    public Integer getAreaSqft() {
        return areaSqft;
    }

    public void setAreaSqft(Integer areaSqft) {
        this.areaSqft = areaSqft;
    }

    public List<String> getAmenities() {
        return amenities;
    }

    public void setAmenities(List<String> amenities) {
        this.amenities = amenities;
    }

    public Integer getPossessionYear() {
        return possessionYear;
    }

    public void setPossessionYear(Integer possessionYear) {
        this.possessionYear = possessionYear;
    }

    public ConstructionStatus getConstructionStatus() {
        return constructionStatus;
    }

    public void setConstructionStatus(ConstructionStatus constructionStatus) {
        this.constructionStatus = constructionStatus;
    }

    public AvailabilityStatus getAvailabilityStatus() {
        return availabilityStatus;
    }

    public void setAvailabilityStatus(AvailabilityStatus availabilityStatus) {
        this.availabilityStatus = availabilityStatus;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getGoogleMapLink() {
        return googleMapLink;
    }

    public void setGoogleMapLink(String googleMapLink) {
        this.googleMapLink = googleMapLink;
    }

    public String getBrochureUrl() {
        return brochureUrl;
    }

    public void setBrochureUrl(String brochureUrl) {
        this.brochureUrl = brochureUrl;
    }

    public String getVirtualTourLink() {
        return virtualTourLink;
    }

    public void setVirtualTourLink(String virtualTourLink) {
        this.virtualTourLink = virtualTourLink;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public Builder getBuilder() {
        return builder;
    }

    public void setBuilder(Builder builder) {
        this.builder = builder;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}