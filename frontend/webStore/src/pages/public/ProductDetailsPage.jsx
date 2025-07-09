import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById, getRatings, addRating } from "../../api/api";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [newRating, setNewRating] = useState({ score: 0, comment: "" });

  useEffect(() => {
    getProductById(id).then(setProduct);
    getRatings(id).then(setRatings);
  }, [id]);

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    const res = await addRating(id, newRating);
    setRatings([...ratings, res]);
    setNewRating({ score: 0, comment: "" });
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>${product.price}</p>

      <h3>Ratings</h3>
      <ul>
        {ratings.map((r, i) => (
          <li key={i}>
            ⭐ {r.score} - {r.comment}
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmitRating}>
        <input
          type="number"
          min="1"
          max="5"
          value={newRating.score}
          onChange={(e) => setNewRating({ ...newRating, score: parseInt(e.target.value) })}
        />
        <input
          placeholder="Comment"
          value={newRating.comment}
          onChange={(e) => setNewRating({ ...newRating, comment: e.target.value })}
        />
        <button type="submit">Add Rating</button>
      </form>
    </div>
  );
}
