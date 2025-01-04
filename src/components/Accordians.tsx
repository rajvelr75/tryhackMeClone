import { useState, useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Answer from "./Answer";
import Button from "@/components/ui/button";
import { IoPlay } from "react-icons/io5";
import { toast } from "sonner";
import { db } from "@/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

const TASKS = [
  {
    title: "Task 1 : Introduction",
    content: (
      <>
        <h4 className="text-base w-11/12 ml-8 mt-5">
          Welcome to the first part of the "Linux Fundamentals" room series...
        </h4>
        {/* Additional content */}
      </>
    ),
    question: "Let's get started!",
    placeholder: "No Answer required",
    correctAnswer: null, // No specific answer required
  },
  {
    title: "Task 2 : A Bit of Background on Linux",
    content: (
      <>
        <h1 className="text-2xl font-semibold ml-8 mt-5">
          Where is Linux Used?
        </h1>
        {/* Additional content */}
      </>
    ),
    question: "Research: What year was the first release of a Linux operating system?",
    placeholder: "Answer format: ****",
    correctAnswer: 1991, // Correct answer for this task
  },
  {
    title: "Task 3 : Interacting With Your First Linux Machine (In-Browser)",
    content: (
      <>
        <h4 className="text-base w-11/12 ml-8 mt-5">
          This room has a Ubuntu Linux machine that you can interact with...
        </h4>
        {/* Additional content */}
      </>
    ),
    question: "What was the year the first Linux operating system was released?",
    placeholder: "Answer format: ****",
    correctAnswer: 1991, // Correct answer for this task
  },
];

const Accordians = ({ userId }: { userId: string | undefined }) => {
  const [unlockedAccordions, setUnlockedAccordions] = useState([true, false, false]);
  const [score, setScore] = useState(0);
  const [answeredTasks, setAnsweredTasks] = useState<number[]>([]); // To track which tasks have been answered
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // To handle potential errors

  useEffect(() => {
    const fetchProgress = async () => {
      if (!userId) {
        setError("UserId  is undefined or null.");
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUnlockedAccordions(data?.unlockedAccordions || [true, false, false]);
          setScore(data?.score || 0);
          setAnsweredTasks(data?.answeredTasks || []); // Load answered tasks

          // Debugging log to check current user and score
          console.log("Current User ID:", userId);
          console.log("Current Score from Firebase:", data?.score);
        } else {
          setError("User not found in the database.");
        }
      } catch (error) {
        console.error("Error fetching user progress:", error);
        setError("Error fetching user progress.");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [userId]);

  const saveProgress = async (updatedAccordions: boolean[], updatedScore: number, updatedAnsweredTasks: number[]) => {
    if (!userId) return;

    // Debugging: Log the values being passed to save
    console.log("Saving progress to Firebase for User ID:", userId);
    console.log("Updated Accordions:", updatedAccordions);
    console.log("Updated Score:", updatedScore);
    console.log("Updated Answered Tasks:", updatedAnsweredTasks);

    try {
      const userDocRef = doc(db, "users", userId); // Use the user's ID to get the correct document reference
      await setDoc(
        userDocRef,
        {
          unlockedAccordions: updatedAccordions,
          score: updatedScore,
          answeredTasks: updatedAnsweredTasks, // Save answered tasks
        },
        { merge: true }
      );
      console.log("Progress saved successfully to Firebase!");
    } catch (error) {
      console.error("Error saving progress to Firebase:", error);
      toast.error("There was an error saving your progress.");
    }
  };

  const handleSubmit = (inputValue: string | number, accordionIndex: number) => {
    if (!userId) {
      toast.error("You must be logged in to submit answers.");
      return;
    }

    const task = TASKS[accordionIndex];
    const isCorrect = task.correctAnswer === null || Number(inputValue) === task.correctAnswer;

    // Prevent answering tasks that have already been answered correctly
    if (answeredTasks.includes(accordionIndex)) {
      toast.error("You have already answered this question.");
      return;
    }

    if (isCorrect) {
      toast.success("Correct Answer! Submitted Successfully");

      // Update answered tasks and score
      const updatedAnsweredTasks = [...answeredTasks, accordionIndex];
      const updatedScore = score + 10;

      setAnsweredTasks(updatedAnsweredTasks);
      setScore(updatedScore);

      // Unlock the next accordion
      setUnlockedAccordions((prev) => {
        const updated = [...prev];
        if (accordionIndex + 1 < updated.length) updated[accordionIndex + 1] = true;
        saveProgress(updated, updatedScore, updatedAnsweredTasks); // Save the progress
        return updated;
      });
    } else {
      toast.error("Oops..Wrong One! Try Again");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      {TASKS.map((task, index) => (
        <Accordion
          type="single"
          collapsible
          className="w-12/12 ml-6 sm:mr-5 mt-12 mb-6"
          key={index}
        >
          <AccordionItem value={`item-${index}`}>
            <AccordionTrigger
              className={`bg-gray-800 text-white rounded-md text-xl ${
                !unlockedAccordions[index] || !userId ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={!unlockedAccordions[index] || !userId}
            >
              {task.title}
            </AccordionTrigger>
            {unlockedAccordions[index] && userId && (
              <AccordionContent>
                {task.content}
                <div className="ml-8 mt-5">
                  <Answer
                    question={task.question}
                    holder={task.placeholder}
                    type="text"
                    onSubmit={(inputValue) => handleSubmit(inputValue, index)}
                  />
                </div>
              </AccordionContent>
            )}
            {!userId && (
              <div className="ml-8 mt-5 text-red-500">
                You must be logged in to interact with this content.
              </div>
            )}
          </AccordionItem>
        </Accordion>
      ))}
    </>
  );
};

export default Accordians;
