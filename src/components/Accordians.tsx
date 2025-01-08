import { useState, useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Answer from "./Answer";
import Button from "@/components/ui/button";
import { toast } from "sonner";
import { db } from "@/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

const TASKS = [
  {
    title: "Task 1 : Introduction",
    content: (
      <>
        <h4 className="text-base w-11/12 ml-8 mt-5">
        Welcome to the first part of the "Linux Fundamentals" room series. You're most likely using a Windows or Mac machine, both are different in visual design and how they operate. Just like Windows, iOS and MacOS, Linux is just another operating system and one of the most popular in the world powering smart cars, android devices, supercomputers, home appliances, enterprise servers, and more.
        </h4>
        <h4 className="text-base w-11/12 ml-8 mt-5">We'll be covering some of the history behind Linux and then eventually starting your journey of being a Linux-wizard! This room will have you:</h4>
        <ul className="text-base w-11/12 ml-20 mt-5 list-disc">
          <li>Running your very first commands in an interactive Linux machine in your browser</li>
          <li>Teaching you some essential commands used to interact with the file system          </li>
          <li>Demonstrate how you can search for files and introduce shell operators          </li>
        </ul>
      </>
    ),
    question: "Let's get started!",
    placeholder: "No Answer required",
    correctAnswer: null, 
    readonly:true
  },
  {
    title: "Task 2 : A Bit of Background on Linux",
    content: (
      <>
        <h1 className="text-2xl font-semibold ml-8 mt-5">
          Where is Linux Used?
        </h1>
        <h4 className="text-base w-11/12 ml-8 mt-5">It's fair to say that Linux is a lot more intimidating to approach than Operating System's (OSs) such as Windows. Both variants have their own advantages and disadvantages. For example, Linux is considerably much more lightweight and you'd be surprised to know that there's a good chance you've used Linux in some form or another every day! Linux powers things such as:</h4>
        <ul className="text-base w-11/12 ml-20 mt-5 list-disc">
          <li>Websites that you visit</li>
          <li>Car entertainment/control panels          </li>
          <li>Point of Sale (PoS) systems such as checkout tills and registers in shops          </li>
          Critical infrastructures such as traffic light controllers or industrial sensors
        </ul>
        <h1 className="text-2xl font-semibold ml-8 mt-5">Flavours of Linux</h1>
        <h4 className="text-base w-11/12 ml-8 mt-5">The name "Linux" is actually an umbrella term for multiple OS's that are based on UNIX (another operating system). Thanks to Linux being open-source, variants of Linux come in all shapes and sizes - suited best for what the system is being used for.</h4>
        <h4 className="text-base w-11/12 ml-8 mt-5">For example, Ubuntu & Debian are some of the more commonplace distributions of Linux because it is so extensible. I.e. you can run Ubuntu as a server (such as websites & web applications) or as a fully-fledged desktop. For this series, we're going to be using Ubuntu.</h4>
        <h4 className="text-base w-5/12 ml-14 mt-5 border-l-8 h-10 border-l-yellow-300 bg-gray-100 flex items-center italic">Ubuntu Server can run on systems with only 512MB of RAM</h4>
        <h4 className="text-base w-11/12 ml-8 mt-5">Similar to how you have different versions Windows (7, 8 and 10), there are many different versions/distributions of Linux.</h4>
      </>
    ),
    question: "I've deployed my first Linux machine!",
    placeholder: "Answer format ****",
    correctAnswer: 1991, 
    readonly:false
  },
  {
    title: "Task 3 : Interacting With Your First Linux Machine (In-Browser)",
    content: (
      <>
        <h4 className="text-base w-11/12 ml-8 mt-5">
        This room has a Ubuntu Linux machine that you can interact with all within your browser whilst following along with this room's material. 
        </h4>
        <h4 className="text-base w-11/12 ml-8 mt-5">However, to get started, simply press the green Start Machine button below.</h4>
        <Button className="w-36 h-8 mt-5 ml-8 border-green-500 bg-green-500 rounded-md hover:bg-green-400"><h4 className="relative bottom-1">Run Machine</h4></Button>
        <h4 className="text-base w-11/12 ml-8 mt-5">Once deployed, a card will appear at the top of the room:</h4>
        <div className="flex justify-center">
          <img src="src\assets\deploy-card.png" alt="Deploy Card" className="mt-4 w-10/12"/>
        </div>
        <h4 className="text-base w-11/12 ml-8 mt-5">This contains all of the information for the machine deployed in the room including the IP address and expiry timer - along with buttons to manage the machine. Remember to "Terminate" a machine once you are done with the room. More information on this can be found in the tutorial room.</h4>
        <h4 className="text-base w-11/12 ml-8 mt-5">For now, press "Start Machine" where you will be able to interact with your own Linux machine within your browser whilst following along with this room: </h4>
        <div className="flex justify-center">
          <img src="src\assets\split-screen.png" alt="Split Screen" className="w-10/12 mt-6 "/>
        </div>
      </>
    ),
    question: "What was the year the first Linux operating system was released?",
    placeholder: "No Answer required",
    correctAnswer: null, 
    readonly:true
  },
];

const Accordians = ({ userId }: { userId: string | undefined }) => {
  const [unlockedAccordions, setUnlockedAccordions] = useState([true, false, false]);
  const [score, setScore] = useState(0);
  const [answeredTasks, setAnsweredTasks] = useState<number[]>([]); 
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null); 

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchProgress = async () => {
      try {
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setUnlockedAccordions(data?.unlockedAccordions || [true, false, false]);
          setScore(data?.score || 0);
          setAnsweredTasks(data?.answeredTasks || []); 
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

    try {
      const userDocRef = doc(db, "users", userId); 
      await setDoc(
        userDocRef,
        {
          unlockedAccordions: updatedAccordions,
          score: updatedScore,
          answeredTasks: updatedAnsweredTasks, 
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

    if (answeredTasks.includes(accordionIndex)) {
      toast.error("You have already answered this question.");
      return;
    }

    if (isCorrect) {
      toast.success("Correct Answer! Submitted Successfully");

      const updatedAnsweredTasks = [...answeredTasks, accordionIndex];
      const updatedScore = score + 10;

      setAnsweredTasks(updatedAnsweredTasks);
      setScore(updatedScore);

      setUnlockedAccordions((prev) => {
        const updated = [...prev];
        if (accordionIndex + 1 < updated.length) updated[accordionIndex + 1] = true;
        saveProgress(updated, updatedScore, updatedAnsweredTasks); 
        return updated;
      });
    } else {
      toast.error("Oops..Wrong One! Try Again");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      {TASKS.map((task, index) => (
        <Accordion
          type="single"
          collapsible
          className="w-12/12 ml-6 sm:mr-5 mt-8 mb-6"
          key={index}
        >
          <AccordionItem value={`item-${index}`}>
            <AccordionTrigger
              className={`bg-gray-800 text-white rounded-md text-xl ${
                !unlockedAccordions[index] ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {task.title}
            </AccordionTrigger>
            <AccordionContent>
              {task.content}
              <div className="ml-8 mt-5">
                {userId ? (
                  <Answer
                    question={task.question}
                    holder={task.placeholder}
                    type="text"
                    readOnly={task.readonly}
                    onSubmit={(inputValue) => handleSubmit(inputValue, index)}
                  />
                ) : (
                  <p className="text-gray-400">Log in to submit your answer.</p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </>
  );
};

export default Accordians;