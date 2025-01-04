import { useEffect, useState } from "react";
import { db } from "@/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [users, setUsers] = useState<any[]>([]); // State to store users
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch users from Firestore
    const fetchUsers = async () => {
      const usersRef = collection(db, "users");
      const userSnapshot = await getDocs(usersRef);
      const userList = userSnapshot.docs.map((doc) => doc.data());
      setUsers(userList);
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="bg-white p-4 rounded-md shadow-md">
        <h3 className="text-xl font-medium mb-4">Authenticated Users</h3>
        <ul>
          {users.length > 0 ? (
            users.map((user, index) => (
              <li key={index} className="p-2 border-b">
                <div>{user.name}</div>
                <div>{user.email}</div>
              </li>
            ))
          ) : (
            <div>No users found.</div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
