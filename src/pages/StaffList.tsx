import { Link } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { deleteUser, fetchUsers, User } from '../slices/userSlice';
import { useSnackbar } from 'notistack';
import AddStaff from './AddStaff';
import ConfirmationModal from '../shared/ConfirmationModal';


const StaffList = () => {

  const dispatch = useDispatch<AppDispatch>();
  const [addstaff, setAddStaff] = useState<boolean>(false);
  const [selectedStaff, setSelectedStaff] = useState<User | null>(null);
  const [delOpen, setDelOpen] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  const { users } = useSelector((state: RootState) => state.userState);

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  const delHandleClose = () => {
    setDelOpen(false);
  };

  const handleDeleteClick = (item: User) => {
    setSelectedStaff(item);
    setDelOpen(true);
  };

  const onDelete = async () => {
    if (selectedStaff) {
      try {
        await dispatch(deleteUser(selectedStaff._id)).unwrap();
        enqueueSnackbar('staff deleted successfully!', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
      } catch (error: any) {
        enqueueSnackbar('Failed to delete the staff.', {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
      }
    }
    delHandleClose();
  };

  return (
    <>
      <Breadcrumb pageName="All Staff" />
      <div className="p-4 sm:p-6 min-h-screen">
        <div className=" bg-white dark:bg-form-input p-4 rounded-lg shadow">
          <div className="flex justify-end items-center mb-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onClick={() => setAddStaff(true)}
            >
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
                        <Trash2 className="w-4 h-4 text-red-500" onClick={() => handleDeleteClick(staff)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmationModal
        delOpen={delOpen}
        delHandleClose={delHandleClose}
        onDelete={onDelete}
      />
      {/* AddStaff Modal */}
      <AddStaff open={addstaff} handleClose={() => setAddStaff(false)} />
    </>
  );
};

export default StaffList;
