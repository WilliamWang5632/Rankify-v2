import { MdStar, MdStarHalf, MdStarBorder} from "react-icons/md";

export const renderStars = (rating: number) => {
  const validRating  = Math.max(0, Math.min(10, rating));
  const scaledRating = (validRating / 10) * 5;
  const fullStars    = Math.floor(scaledRating);  
  const halfStar     = scaledRating % 1 >= 0.5;
  const emptyStars   = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      <span className="flex items-center text-yellow-200 text-base">
        {/* full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <MdStar key={`full-${i}`} />
        ))}

        {/* single half star, if needed */}
        {halfStar && <MdStarHalf key="half" />}

        {/* empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <MdStarBorder key={`empty-${i}`} />
        ))}
      </span>

      <span className="text-sm text-gray-400 ml-1">
        {validRating.toFixed(1)}/10
      </span>
    </div>
  );
};