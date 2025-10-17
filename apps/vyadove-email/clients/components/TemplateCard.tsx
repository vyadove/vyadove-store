import React from "react";
import { TemplateCardProps } from "../types";

/**
 * Individual template card with thumbnail and hover effects
 */
export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onSelect }) => (
    <div
        onClick={onSelect}
        style={{
            cursor: "pointer",
            borderRadius: "8px",
            overflow: "hidden",
            border: "2px solid transparent",
            transition: "all 0.2s ease",
            backgroundColor: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.border = "2px solid #1890ff";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.border = "2px solid transparent";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
        }}
    >
        <div
            style={{
                width: "100%",
                aspectRatio: "3/4",
                overflow: "hidden",
                backgroundColor: "#f5f5f5",
            }}
        >
            <img
                src={template.thumbnail}
                alt={template.name}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                }}
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVtYWlsPC90ZXh0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTUlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5UZW1wbGF0ZTwvdGV4dD4KPC9zdmc+";
                }}
            />
        </div>
        <div
            style={{
                padding: "8px 12px",
                textAlign: "center",
                borderTop: "1px solid #f0f0f0",
            }}
        >
            <div
                style={{
                    fontSize: "12px",
                    fontWeight: "500",
                    color: "#333",
                }}
            >
                {template.name}
            </div>
        </div>
    </div>
);