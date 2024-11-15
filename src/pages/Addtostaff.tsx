import { Link } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { fetchUsers } from '../slices/userSlice';

const StaffList = () => {

  const dispatch = useDispatch<AppDispatch>();

  useEffect(()=>{
    dispatch(fetchUsers())
  },[])

  const { users } = useSelector((state: RootState) => state.userState);

  return (
    <>
      <Breadcrumb pageName="All Staff" />
    <div className="p-4 sm:p-6 min-h-screen">
      <div className=" bg-white dark:bg-form-input p-4 rounded-lg shadow">
        <div className="flex justify-end items-center mb-4">
          <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
            Add New Staff
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-form-input rounded-lg shadow">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="flex justify-center">Options</th>
              </tr>
            </thead>
            <tbody>
              {users.map((staff, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{staff.name}</td>
                  <td className="px-4 py-2">{staff.email}</td>
                  <td className="flex items-center justify-center space-x-2 py-2">
                    <Link
                      to={`/dashboard/edit-staff/${staff._id}`}
                      className="p-2 bg-blue-100 rounded-full cursor-pointer hover:bg-blue-200"
                    >
                      <Edit className="w-4 h-4 text-blue-500" />
                    </Link>
                    <div className="p-2 bg-red-100 rounded-full cursor-pointer hover:bg-red-200">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
};

export default StaffList;
