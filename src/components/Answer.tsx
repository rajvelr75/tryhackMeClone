import React from "react";
import Input from "@/components/ui/input"; 
import { Button } from "@/components/ui/button";

interface AnswerProps {
  question: string;
  holder: string;
  onSubmit: (inputValue: string) => void;
  className?: string;
  readOnly?: boolean;
  type: string;
}

const Answer: React.FC<AnswerProps> = ({ question, holder, readOnly, type, onSubmit }) => {
  const [inputValue, setInputValue] = React.useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleButtonClick = () => {
    if (onSubmit) {
      onSubmit(inputValue); // Pass the input value
    }
  };

  return (
    <div>
      <h4 className="mt-4">{question}</h4>
      <div className="flex flex-row">
        <Input
          type={type}
          placeholder={holder}
          readOnly={readOnly}
          value={inputValue}
          onChange={handleInputChange}
          className="custom-class"
        />
        <Button className="h-9 mt-5 ml-5 w-56 text-gray-950" onClick={handleButtonClick}>
          Submit Answer
        </Button>
      </div>
    </div>
  );
};

export default Answer;