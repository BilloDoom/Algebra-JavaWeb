import { useEffect, useState } from "react";
import { getRatings } from "../api/api";

export default function RatingDisplay({ productId }) {
  const [rating, setRating] = useState(null);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const data = await getRatings(productId);
        const average =
          data.length > 0
            ? data.reduce((acc, r) => acc + r.value, 0) / data.length
            : 0;
        setRating(average.toFixed(1));
      } catch (err) {
        console.error("Failed to fetch rating", err);
        setRating(0);
      }
    };

    fetchRating();
  }, [productId]);

  return (
    <p className="text-sm text-yellow-400 font-medium">
      Rating: {rating ?? 0} / 5
    </p>
  );
}
