import { useEffect, useState } from "react";
import { db } from "@/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const Dashboard = () => {
  const [users, setUsers] = useState<any[]>([]); 

  useEffect(() => {
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
        
        {/* Table Structure */}
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left border-b">Name</th>
              <th className="px-4 py-2 text-left border-b">Email</th>
              <th className="px-4 py-2 text-left border-b">Questions Completed</th>
              <th className="px-4 py-2 text-left border-b">Score</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{user.name || "0"}</td>
                  <td className="px-4 py-2 border-b">{user.email || "0"}</td>
                  <td className="px-4 py-2 border-b">{user.score/10 || "0"}</td>
                  <td className="px-4 py-2 border-b">{user.score|| "0"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-4 py-2 text-center border-b">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
