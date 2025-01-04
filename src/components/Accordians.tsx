import { useState, useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Answer from "./Answer";
import { Button } from "@/components/ui/button";
import { IoPlay } from "react-icons/io5";
import { toast } from "sonner";
import { db } from "@/firebaseConfig"; 
import { doc, getDoc, setDoc } from "firebase/firestore";

const Accordians = ({ userId }: { userId: string | undefined }) => {
  const [unlockedAccordions, setUnlockedAccordions] = useState([true, false, false]);
  const [score, setScore] = useState(0);

  // Fetch progress from Firebase on component mount
  useEffect(() => {
    const fetchProgress = async () => {
      if (!userId) {
        console.error("UserId is undefined or null.");
        return; // If userId is missing, don't fetch any data.
      }

      try {
        // Ensure userId is a valid string
        const userDoc = await getDoc(doc(db, "users", userId)); // userId is guaranteed to be defined here

        if (userDoc.exists()) {
          const data = userDoc.data();
          console.log("Fetched user data:", data); // Debugging log
          
          // Safely check and set the unlockedAccordions and score
          setUnlockedAccordions(data?.unlockedAccordions || [true, false, false]);
          setScore(data?.score || 0);
        } else {
          console.log("No user data found.");
          setUnlockedAccordions([true, false, false]);
          setScore(0);
        }
      } catch (error) {
        console.error("Error fetching user progress:", error);
      }
    };
  
    fetchProgress();
  }, [userId]);  

  const saveProgress = async (updatedAccordions: boolean[], updatedScore: number) => {
    if (!userId) {
      console.error("Cannot save progress, userId is undefined.");
      return;
    }
    console.log("Saving progress: ", updatedAccordions, updatedScore); // Log progress before saving
    try {
      const userDocRef = doc(db, "users", userId);  // userId is now guaranteed to be a string
      await setDoc(
        userDocRef,
        {
          unlockedAccordions: updatedAccordions,
          score: updatedScore,
        },
        { merge: true }
      );
      console.log("Progress saved successfully!");
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };  

  const successfullSubmit = () => {
    toast.success("Submitted Successfully!");
  };

  const correctSubmit = () => {
    toast.success("Correct Answer! Submitted Successfully");
  };

  const wrongSubmit = () => {
    toast.error("Oops..Wrong One! Try Again");
  };

  const unlockNextAccordion = (accordionIndex: number) => {
    setUnlockedAccordions((prev) => {
      const updated = [...prev];
      if (accordionIndex + 1 < updated.length) {
        updated[accordionIndex + 1] = true; 
      }
      const newScore = score + 10; // Add 10 points for correct answer
      setScore(newScore);

      // Save updated state to Firebase
      saveProgress(updated, newScore);

      return updated;
    });
  };

  const handleSubmit = (inputValue: string | number, accordionIndex: number) => {
    if (!userId) {
      toast.error("You must be logged in to submit answers.");
      return; // Prevent submission if the user is not authenticated
    }
  
    const cleanedInput = typeof inputValue === "string" ? inputValue.trim() : inputValue;
    const parsedInput = Number(cleanedInput);  
    
    if (accordionIndex === 0) {
      successfullSubmit();
      unlockNextAccordion(accordionIndex);
    } else if (accordionIndex === 1 && parsedInput === 1991) {
      correctSubmit();
      unlockNextAccordion(accordionIndex);
    } else {
      wrongSubmit();
    }
  };
  

  return (
    <>
      <Accordion type="single" collapsible className="w-12/12 ml-6 sm:mr-5 mt-12 mb-6">
        <AccordionItem value="item-1">
          <AccordionTrigger className={`bg-gray-800 text-white rounded-md text-xl ${!unlockedAccordions[0] ? "cursor-not-allowed opacity-50" : ""}`} disabled={!unlockedAccordions[0]}>
            Task 1 : Introduction
          </AccordionTrigger>
          {unlockedAccordions[0] && (
            <AccordionContent>
              <h4 className="text-base w-11/12 ml-8 mt-5">
                Welcome to the first part of the "Linux Fundamentals" room series.
                You're most likely using a Windows or Mac machine, both are
                different in visual design and how they operate. Just like Windows,
                iOS and MacOS, Linux is just another operating system and one of
                the most popular in the world powering smart cars, android devices,
                supercomputers, home appliances, enterprise servers, and more.
              </h4>
              <h4 className="text-base ml-8 mt-5">
                We'll be covering some of the history behind Linux and then
                eventually starting your journey of being a Linux-wizard! This room
                will have you:
              </h4>
              <ul className="list-disc pl-5 text-base ml-16 mt-5">
                <li>
                  Running your very first commands in an interactive Linux machine
                  in your browser
                </li>
                <li>Teaching you some essential commands used to interact with the file system</li>
                <li>Demonstrate how you can search for files and introduce shell operator</li>
              </ul>
              <div className="ml-8 mt-5">
                <Answer
                  question="Let's get started!"
                  holder="No Answer required"
                  onSubmit={() => handleSubmit("", 0)} 
                  className="text-gray-900"
                  readOnly={true} 
                  type="text"
                />
              </div>
            </AccordionContent>
          )}
        </AccordionItem>
      </Accordion>

      <Accordion type="single" collapsible className="w-12/12 ml-6 sm:mr-5 mb-6">
        <AccordionItem value="item-2">
          <AccordionTrigger className={`bg-gray-800 text-white rounded-md text-xl ${!unlockedAccordions[1] ? "cursor-not-allowed opacity-50" : ""}`} disabled={!unlockedAccordions[1]}>
            Task 2 : A Bit of Background on Linux
          </AccordionTrigger>
          {unlockedAccordions[1] && (
            <AccordionContent>
              <h1 className="text-2xl font-semibold ml-8 mt-5">
                Where is Linux Used?
              </h1>
              <h4 className="text-base ml-8 mt-5">
                The name "Linux" is actually an umbrella term for multiple OS's
                that are based on UNIX (another operating system). Thanks to Linux
                being open-source, variants of Linux come in all shapes and sizes
                - suited best for what the system is being used for.
              </h4>
              <h4 className="text-base ml-8 mt-5">
                For example, Ubuntu & Debian are some of the more commonplace
                distributions of Linux because it is so extensible. I.e. you can
                run Ubuntu as a server (such as websites & web applications) or as
                a fully-fledged desktop. For this series, we're going to be using
                Ubuntu.
              </h4>
              <h4 className="text-lg ml-12 bg-gray-100 w-6/12 italic mt-6 border-l-8 border-yellow-400">
                Ubuntu Server can run on systems with only 512MB of RAM
              </h4>
              <h4 className="text-base ml-8 mt-5">
                Similar to how you have different versions Windows (7, 8 and 10),
                there are many different versions/distributions of Linux.
              </h4>
              <div className="ml-8 mt-5">
              {userId ? (
                <Answer
                  question="Research: What year was the first release of a Linux operating system?"
                  holder="Answer format: ****"
                  type="text"
                  onSubmit={(inputValue) => handleSubmit(inputValue, 1)} 
                />
              ) : (
                <p className="text-red-500">You must be logged in to submit an answer.</p>
              )}

              </div>
            </AccordionContent>
          )}
        </AccordionItem>
      </Accordion>

      <Accordion type="single" collapsible className="w-12/12 ml-6 sm:mr-5 mb-6">
        <AccordionItem value="item-3">
          <AccordionTrigger className={`bg-gray-800 text-white rounded-md text-xl ${!unlockedAccordions[2] ? "cursor-not-allowed opacity-50" : ""}`} disabled={!unlockedAccordions[2]}>
            Task 3 : Interacting With Your First Linux Machine (In-Browser)
          </AccordionTrigger>
          {unlockedAccordions[2] && (
            <AccordionContent>
              <h4 className="text-base w-11/12 ml-8 mt-5">
                This room has a Ubuntu Linux machine that you can interact with
                all within your browser whilst following along with this room's
                material.
              </h4>
              <h4 className="text-base ml-8 mt-5">
                However, to get started, simply press the green Start Machine
                button below.
              </h4>
              <Button className="h-9 mt-5 ml-10 w-48 bg-green-500 text-gray-950 border-none">
                <IoPlay className="mt-1" />{" "}
                <h4 className="relative bottom-5">Start Machine</h4>
              </Button>
              <h4 className="text-base w-11/12 ml-8 mt-5">
                Once deployed, a card will appear at the top of the room:
              </h4>
              <img
                src="src/assets/deploy-card.png"
                className="sm:w-11/12 w-10/12 ml-12 sm:ml-14 sm:mt-8"
              />
              <h4 className="text-base ml-8 mt-5">
                This contains all of the information for the machine deployed in
                the room including the IP address and expiry timer - along with
                buttons to manage the machine. Remember to "Terminate" a machine
                once you are done with the room. More information on this can be
                found in the tutorial room.
              </h4>
              <h4 className="text-base ml-8 mt-5">
                Once you're ready to start the machine, submit your answer
                below!
              </h4>
              <div className="ml-8 mt-5">
                <Answer
                  question="What was the year the first Linux operating system was released?"
                  holder="No Answer Required"
                  type="text"
                  onSubmit={(inputValue) => handleSubmit(inputValue, 2)} 
                />
              </div>
            </AccordionContent>
          )}
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default Accordians;
