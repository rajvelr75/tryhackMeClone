import { useEffect, useState } from "react";
import { auth, db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const Profile = () => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    photoURL: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const user = auth.currentUser;

        // Fetch additional user data from Firestore
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setUserDetails({
            name: userDoc.data()?.name || "",
            email: user.email || "",
            photoURL: user.photoURL || "https://via.placeholder.com/150", // Default photo if none is set
          });
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className=" p-4 bg-black text-white min-h-screen flex justify-center items-center">
      <div className="bg-black text-white p-6 rounded-lg shadow-xl w-full">
        <h1 className="text-3xl font-bold mb-48 text-center text-gold">Profile</h1>
        <div className="flex items-center justify-center space-x-6">
          <img
            src={userDetails.photoURL}
            alt="Profile"
            className="h-64 w-64 rounded-full border-4 border-gold relative bottom-24 right-40"
          />
          <div className=" text-left relative bottom-24">
            <h2 className="text-3xl font-semibold mb-2">Name: {userDetails.name}</h2>
            <p className="text-xl text-gray-400 mt-8">Email: {userDetails.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
