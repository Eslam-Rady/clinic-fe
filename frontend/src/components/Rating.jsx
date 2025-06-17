import React, { useState } from 'react';

const RatingComponent = ({ appointmentId, onSubmit }) => {
  const [selectedRating, setSelectedRating] = useState(null);

  const handleClick = (rating) => {
    setSelectedRating(rating);
    onSubmit(appointmentId, rating);
  };

  return (
    <div className="flex gap-2 mt-1">
      {[1, 2, 3, 4, 5].map((num) => (
        <button
          disabled={selectedRating !== null}
          key={num}
          onClick={() => handleClick(num)}
          className={`w-8 h-8 text-sm border rounded 
            ${selectedRating === num ? 'bg-blue-500 text-white' : 'bg-white text-black hover:bg-blue-100'}`}
        >
          {num}
        </button>
      ))}
    </div>
  );
};

export default RatingComponent;