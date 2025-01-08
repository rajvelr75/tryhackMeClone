import { useState } from 'react';
import 'font-awesome/css/font-awesome.min.css';

const ThumbsButtons = () => {
  const [isGreen, setIsGreen] = useState(false);
  const [isRed, setIsRed] = useState(false);

  const handleGreenClick = () => {
    if (isRed) {
      setIsRed(false); 
    }
    setIsGreen(!isGreen); 
  };

  const handleRedClick = () => {
    if (isGreen) {
      setIsGreen(false); 
    }
    setIsRed(!isRed); 
  };

  return (
    <div className="flex space-x-4">
      <button
        className={`btn p-2 text-lg focus:outline-none ${isGreen ? 'text-green-500' : 'text-gray-600'}`}
        onClick={handleGreenClick}
      >
        <i className="fa fa-thumbs-up" aria-hidden="true"></i>
      </button>

      <button
        className={`btn p-2 text-lg focus:outline-none ${isRed ? 'text-red-500' : 'text-gray-600'}`}
        onClick={handleRedClick}
      >
        <i className="fa fa-thumbs-down" aria-hidden="true"></i>
      </button>
    </div>
  );
};

export default ThumbsButtons;
