import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';

interface Staff {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'Manager' | 'Employee';
}

const EditStaff = () => {
  const { id } = useParams<{ id: string }>();  // id from the URL
  const [staff, setStaff] = useState<Staff | null>(null);

  const staffMembers: Staff[] = [
    { id: 1, name: 'George M. Winters', email: 'staff@example.com', phone: '662-817-4374', role: 'Manager' },
    { id: 2, name: 'Donna B. Cantrell', email: 'staff2@example.com', phone: '+1 (586) 899-1627', role: 'Employee' },
  ];

  useEffect(() => {
    if (id) {
      const staffToEdit = staffMembers.find((staff) => staff.id === parseInt(id));
      setStaff(staffToEdit || null);
    }
  }, [id]);

  if (!staff) return <div>Loading...</div>;

  return (
    <>
      <Breadcrumb pageName="Edit Staff" />

      <div className="p-4 sm:p-6 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4"> {staff.name}</h2>
        <form>
          {/* Name Field */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              value={staff.name}
              onChange={(e) => setStaff({ ...staff, name: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={staff.email}
              onChange={(e) => setStaff({ ...staff, email: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>

          {/* Phone Field */}
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              id="phone"
              value={staff.phone}
              onChange={(e) => setStaff({ ...staff, phone: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>

          {/* Role Field */}
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
            <select
              id="role"
              value={staff.role}
              onChange={(e) => setStaff({ ...staff, role: e.target.value as 'Manager' | 'Employee' })}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            >
              <option value="Manager">user</option>
              <option value="Employee">admin</option>
            </select>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default EditStaff;
