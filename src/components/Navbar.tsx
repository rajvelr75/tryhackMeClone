import { useEffect, useState } from "react";
import { Disclosure, DisclosureButton, Menu, MenuButton, MenuItem } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { FaSearch } from "react-icons/fa";
import { auth, db, storage } from "@/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Add state for checking admin
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
    profilePhoto: File | null;
  }>({
    name: "",
    email: "",
    password: "",
    profilePhoto: null,
  });
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Track user state across sessions
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserPhoto(user.photoURL || null);

        // Fetch user role (for example, check if the user is an admin)
        const fetchUserRole = async () => {
          const userRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData && userData.email === "rajvelr755@gmail.com") {
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
            }
          }
        };
        fetchUserRole();
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false); // Reset admin status when logged out
        setUserPhoto(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const [navigation, setNavigation] = useState([
    { name: "Home", href: "/", current: true },
    { name: "About", href: "/about", current: false },
    { name: "Contact", href: "/contact", current: false },
  ]);
  
  // Update the navigation links based on the user role (admin)
  useEffect(() => {
    if (isAdmin) {
      setNavigation((prevNav) => [
        ...prevNav,
        { name: "Dashboard", href: "/dashboard", current: false },
      ]);
    } else {
      setNavigation((prevNav) =>
        prevNav.filter((item) => item.name !== "Dashboard")
      );
    }
  }, [isAdmin]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, files } = e.target;
    if (id === "profilePhoto" && files) {
      setFormData((prev) => ({ ...prev, profilePhoto: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, password, profilePhoto } = formData;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let photoURL = null;
      if (profilePhoto) {
        const photoRef = ref(storage, `profilePhotos/${user.uid}`);
        await uploadBytes(photoRef, profilePhoto);
        photoURL = await getDownloadURL(photoRef);
      }

      await updateProfile(user, {
        displayName: name,
        photoURL,
      });

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        photoURL,
        role: "user",
        score:0
      });

      alert("Registration successful!");
      setShowModal(false);
      setIsRegistering(false); // Redirect to login form after registration
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error registering user:", error.message);
        alert("Error registering user: " + error.message);
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();  // Prevent page refresh
    const { email, password } = formData;
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      setUserPhoto(user.photoURL);
      setIsLoggedIn(true);
      setShowModal(false);
      navigate("/");  // Redirect to homepage or profile
  
      // Admin check
      if (user.email === "rajvelr755@gmail.com") {
        navigate("/dashboard");  // Redirect to Dashboard
      }
    } catch (error) {
      const e = error as Error;
      console.error("Error: ", e.message);
    }
  };
  

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setUserPhoto(null);
      setIsAdmin(false); // Reset admin status on logout
      setShowLogoutConfirm(false); // Close logout confirmation modal
      alert("Logged out successfully!");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error logging out:", error.message);
      }
    }
  };

  const navigate = useNavigate();

  return (
    <>
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </DisclosureButton>
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex shrink-0 items-center">
                    <img className="h-8 w-auto" src="src/assets/astrazeneca.png" alt="Your Company" />
                  </div>
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white",
                            "rounded-md px-3 py-2 text-sm font-medium"
                          )}
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <FaSearch color="gold" size={20} className="mr-6" />
                  {!isLoggedIn ? (
                    <Button onClick={() => setShowModal(true)}>Log in</Button>
                  ) : (
                    <Menu as="div" className="relative ml-3">
                      <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <img
                          className="h-8 w-8 rounded-full"
                          src={userPhoto || "https://via.placeholder.com/40"}
                          alt="Profile"
                        />
                      </MenuButton>
                      <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          <MenuItem>
                            <button
                              onClick={() => navigate("/profile")}
                              className="text-gray-700 block px-4 py-2 text-sm"
                            >
                              Profile
                            </button>
                          </MenuItem>
                          <MenuItem>
                            <button
                              onClick={() => setShowLogoutConfirm(true)}
                              className="text-red-600 block px-4 py-2 text-sm"
                            >
                              Logout
                            </button>
                          </MenuItem>
                        </div>
                      </Menu.Items>
                    </Menu>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </Disclosure>
      
      {/* Modal for Login/Register */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">{isRegistering ? "Register" : "Log in"}</h2>
            <form onSubmit={isRegistering ? handleRegister : handleLogin}>
              {isRegistering && (
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
              )}
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              {isRegistering && (
                <div className="mb-4">
                  <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-700">
                    Profile Photo
                  </label>
                  <input
                    type="file"
                    id="profilePhoto"
                    onChange={handleInputChange}
                    className="mt-1 block w-full text-sm text-gray-500"
                  />
                </div>
              )}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-sm font-medium text-indigo-600 hover:underline"
                >
                  {isRegistering ? "Already have an account? Log in" : "Don't have an account? Register"}
                </button>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">Confirm Logout</h2>
            <div className="flex justify-between">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
