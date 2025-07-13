import { ImageOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RatingDisplay from "./RatingDisplay";

export default function ProductCard({ product, onAddToCart }) {
    const navigate = useNavigate();
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);

    useEffect(() => {
        const img = new Image();
        img.src = `/images/products/${product.id}.jpg`;
        img.onload = () => {
            setImageSrc(img.src);
            setImageLoaded(true);
        };
        img.onerror = () => {
            setImageError(true);
            setImageLoaded(true);
        };
    }, [product.id]);

    return (
        <li className="product-card" onClick={() => navigate(`/products/${product.id}`)}>
            {!imageLoaded ? (
                <div className="image-fallback">
                    <div className="image-loading"></div>
                </div>
            ) : imageError ? (
                <div className="image-fallback">
                    <ImageOff className="icon" />
                </div>
            ) : (
                <img
                    src={imageSrc}
                    alt={product.name}
                    className="product-image"
                />
            )}

            <div className="card-content">
                <p className="name">{product.name}</p>
                <RatingDisplay productId={product.id} />
                <p className="price">${product.price.toFixed(2)}</p>
                <p className="stock">In stock: {product.quantity}</p>
            </div>

            <button
                className="btn"
                onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                }}
            >
                Add to Cart
            </button>
        </li>
    );
}
