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
        if (!product.images || product.images.length === 0) {
            setImageError(true);
            setImageLoaded(true);
            return;
        }

        const imageUrl = product.images[0].imageUrl;

        const img = new Image();
        img.src = imageUrl;
        
        img.onload = () => {
            console.log("Image loaded successfully:", imageUrl);
            setImageSrc(imageUrl);
            setImageLoaded(true);
        };
        img.onerror = () => {
            setImageError(true);
            setImageLoaded(true);
        };
    }, [product.images]);


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
