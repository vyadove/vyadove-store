import React, { useState } from "react";
import { ComponentConfig } from "@measured/puck";
import styles from "./styles.module.css";

export type ProductImage = {
    src: string;
    alt: string;
};

export type ProductDetailsProps = {
    name: string;
    manufacturer: string;
    vendor: string;
    availability: string;
    rating: number;
    reviewsCount: number;
    price: string;
    originalPrice?: string;
    discount?: number;
    priceExcludingTax: string;
    images: ProductImage[];
    description: string;
    showManufacturer: boolean;
    showVendor: boolean;
    showAvailability: boolean;
    showRating: boolean;
    addToCartText: string;
    buyNowText: string;
    wishlistText: string;
    compareText: string;
};

export const ProductDetails: ComponentConfig<ProductDetailsProps> = {
    label: "Product Details",
    fields: {
        name: {
            type: "text",
            label: "Product Name",
            contentEditable: true,
        },
        manufacturer: {
            type: "text",
            label: "Manufacturer",
        },
        vendor: {
            type: "text",
            label: "Vendor",
        },
        availability: {
            type: "text",
            label: "Availability",
        },
        rating: {
            type: "number",
            label: "Rating (1-5)",
            min: 1,
            max: 5,
        },
        reviewsCount: {
            type: "number",
            label: "Reviews Count",
        },
        price: {
            type: "text",
            label: "Price",
        },
        originalPrice: {
            type: "text",
            label: "Original Price (for discounts)",
        },
        discount: {
            type: "number",
            label: "Discount Percentage",
        },
        priceExcludingTax: {
            type: "text",
            label: "Price Excluding Tax",
        },
        images: {
            type: "array",
            label: "Product Images",
            arrayFields: {
                src: {
                    type: "text",
                    label: "Image URL",
                },
                alt: {
                    type: "text",
                    label: "Alt Text",
                },
            },
        },
        description: {
            type: "textarea",
            label: "Product Description",
        },
        showManufacturer: {
            type: "radio",
            label: "Show Manufacturer",
            options: [
                { label: "Yes", value: true },
                { label: "No", value: false },
            ],
        },
        showVendor: {
            type: "radio",
            label: "Show Vendor",
            options: [
                { label: "Yes", value: true },
                { label: "No", value: false },
            ],
        },
        showAvailability: {
            type: "radio",
            label: "Show Availability",
            options: [
                { label: "Yes", value: true },
                { label: "No", value: false },
            ],
        },
        showRating: {
            type: "radio",
            label: "Show Rating",
            options: [
                { label: "Yes", value: true },
                { label: "No", value: false },
            ],
        },
        addToCartText: {
            type: "text",
            label: "Add to Cart Button Text",
        },
        buyNowText: {
            type: "text",
            label: "Buy Now Button Text",
        },
        wishlistText: {
            type: "text",
            label: "Wishlist Button Text",
        },
        compareText: {
            type: "text",
            label: "Compare Button Text",
        },
    },
    defaultProps: {
        name: "One Shoulder Glitter Midi Dress",
        manufacturer: "Mango",
        vendor: "Fashion Store",
        availability: "In stock",
        rating: 4,
        reviewsCount: 12,
        price: "$49.00",
        originalPrice: "$65.00",
        discount: 30,
        priceExcludingTax: "$41.00",
        images: [
            {
                src: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
                alt: "Product main image",
            },
            {
                src: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
                alt: "Product image 2",
            },
            {
                src: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
                alt: "Product image 3",
            },
        ],
        description:
            "Elegant one shoulder glitter midi dress perfect for special occasions. Made with high-quality materials and attention to detail.",
        showManufacturer: true,
        showVendor: true,
        showAvailability: true,
        showRating: true,
        addToCartText: "Add to cart",
        buyNowText: "Buy now",
        wishlistText: "Add to Wish List",
        compareText: "Compare product",
    },
    render: ({
        name,
        manufacturer,
        vendor,
        availability,
        rating,
        reviewsCount,
        price,
        originalPrice,
        discount,
        priceExcludingTax,
        images,
        description,
        showManufacturer,
        showVendor,
        showAvailability,
        showRating,
        addToCartText,
        buyNowText,
        wishlistText,
        compareText,
        puck,
    }) => {
        const [activeImageIndex, setActiveImageIndex] = useState(0);
        const [quantity, setQuantity] = useState(1);

        const renderStars = (rating: number) => {
            return Array.from({ length: 5 }, (_, index) => (
                <span
                    key={index}
                    className={`${styles.star} ${index < rating ? styles.starFilled : styles.starEmpty}`}
                >
                    ★
                </span>
            ));
        };

        return (
            <div className={styles.productDetails}>
                <div className={styles.container}>
                    <div className={styles.row}>
                        {/* Product Images */}
                        <div className={styles.colMd6}>
                            <div className={styles.productGallery}>
                                <div className={styles.mainImage}>
                                    {images && images.length > 0 && (
                                        <img
                                            src={images[activeImageIndex]?.src}
                                            alt={images[activeImageIndex]?.alt}
                                            className={styles.productImage}
                                        />
                                    )}
                                </div>

                                {images && images.length > 1 && (
                                    <div className={styles.thumbnails}>
                                        {images.map((image, index) => (
                                            <button
                                                key={index}
                                                className={`${styles.thumbnail} ${index === activeImageIndex ? styles.active : ""}`}
                                                onClick={() =>
                                                    setActiveImageIndex(index)
                                                }
                                                disabled={puck?.isEditing}
                                            >
                                                <img
                                                    src={image.src}
                                                    alt={image.alt}
                                                    className={
                                                        styles.thumbnailImage
                                                    }
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className={styles.colMd6}>
                            <div className={styles.productInfo}>
                                <h1 className={styles.productName}>{name}</h1>

                                {showManufacturer && manufacturer && (
                                    <div className={styles.infoRow}>
                                        <span className={styles.label}>
                                            Manufacturer:
                                        </span>
                                        <span className={styles.value}>
                                            {manufacturer}
                                        </span>
                                    </div>
                                )}

                                {showVendor && vendor && (
                                    <div className={styles.infoRow}>
                                        <span className={styles.label}>
                                            Vendor:
                                        </span>
                                        <span className={styles.value}>
                                            {vendor}
                                        </span>
                                    </div>
                                )}

                                {showAvailability && availability && (
                                    <div className={styles.infoRow}>
                                        <span className={styles.label}>
                                            Availability:
                                        </span>
                                        <span className={styles.value}>
                                            {availability}
                                        </span>
                                    </div>
                                )}

                                {showRating && rating > 0 && (
                                    <div className={styles.ratingRow}>
                                        <div className={styles.stars}>
                                            {renderStars(rating)}
                                        </div>
                                        {reviewsCount > 0 && (
                                            <span
                                                className={styles.reviewsLink}
                                            >
                                                ({reviewsCount} reviews)
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div className={styles.priceSection}>
                                    <div className={styles.priceRow}>
                                        <span className={styles.currentPrice}>
                                            {price}
                                        </span>
                                        {originalPrice && discount && (
                                            <>
                                                <span
                                                    className={
                                                        styles.originalPrice
                                                    }
                                                >
                                                    {originalPrice}
                                                </span>
                                                <span
                                                    className={styles.discount}
                                                >
                                                    {discount}% Off
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    {priceExcludingTax && (
                                        <div className={styles.priceExcluding}>
                                            Excluding taxes: {priceExcludingTax}
                                        </div>
                                    )}
                                </div>

                                <div className={styles.actionsSection}>
                                    <div className={styles.quantitySection}>
                                        <div
                                            className={styles.quantityControls}
                                        >
                                            <button
                                                className={styles.quantityBtn}
                                                onClick={() =>
                                                    setQuantity(
                                                        Math.max(
                                                            1,
                                                            quantity - 1
                                                        )
                                                    )
                                                }
                                                disabled={puck?.isEditing}
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                value={quantity}
                                                onChange={(e) =>
                                                    setQuantity(
                                                        parseInt(
                                                            e.target.value
                                                        ) || 1
                                                    )
                                                }
                                                className={styles.quantityInput}
                                                min="1"
                                                disabled={puck?.isEditing}
                                            />
                                            <button
                                                className={styles.quantityBtn}
                                                onClick={() =>
                                                    setQuantity(quantity + 1)
                                                }
                                                disabled={puck?.isEditing}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            className={`${styles.btn} ${styles.btnPrimary}`}
                                            disabled={puck?.isEditing}
                                        >
                                            🛒 {addToCartText}
                                        </button>

                                        <button
                                            className={`${styles.btn} ${styles.btnSecondary}`}
                                            disabled={puck?.isEditing}
                                        >
                                            {buyNowText} →
                                        </button>
                                    </div>

                                    <div className={styles.secondaryActions}>
                                        <button
                                            className={styles.actionBtn}
                                            disabled={puck?.isEditing}
                                        >
                                            ♡ {wishlistText}
                                        </button>
                                        <button
                                            className={styles.actionBtn}
                                            disabled={puck?.isEditing}
                                        >
                                            ⚖ {compareText}
                                        </button>
                                    </div>
                                </div>

                                {description && (
                                    <div className={styles.description}>
                                        <h4>Description</h4>
                                        <p>{description}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
};
