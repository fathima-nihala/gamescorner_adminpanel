import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { fetchUsers, editStaff } from '../slices/userSlice';
import { useSnackbar } from 'notistack';

const EditStaff = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { enqueueSnackbar } = useSnackbar();

  // Define the state for staff with fallback default values
  const [staff, setStaff] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user' as 'user' | 'admin',
  });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const { users } = useSelector((state: RootState) => state.userState);
  const filterUsers = users.find((usr) => usr._id === id);

  useEffect(() => {
    if (filterUsers) {
      setStaff({
        name: filterUsers.name || '',  
        email: filterUsers.email || '',  
        phone: filterUsers.phone || '',  
        role: (filterUsers.role as 'user' | 'admin') || 'user',  
      });
    }
  }, [filterUsers]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setStaff((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleCancel = () => {
    if (filterUsers) {
      setStaff({
        name: filterUsers.name || '',  
        email: filterUsers.email || '',  
        phone: filterUsers.phone || '', 
        role: (filterUsers.role as 'user' | 'admin') || 'user',  
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validate form
    if (!staff.name || !staff.email ) {
      enqueueSnackbar('Please fill in all required fields.', { variant: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('name', staff.name);
    formData.append('email', staff.email);
    formData.append('phone', staff.phone);
    formData.append('role', staff.role);

    try {
      await dispatch(editStaff({ id, formData })).unwrap();
      enqueueSnackbar('Profile updated successfully!', {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'right'},
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update profile. Please try again.';
      enqueueSnackbar(errorMessage, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
    }
  };

  return (
    <>
      <Breadcrumb pageName="Edit Staff" />

      <div className="p-4 sm:p-6 min-h-screen">
        <div className="bg-white dark:bg-form-input p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">{staff.name}</h2>
          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={staff.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1 bg-white dark:bg-form-input"
              />
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={staff.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1 bg-white dark:bg-form-input"
              />
            </div>

            {/* Phone Field */}
            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="text"
                id="phone"
                value={staff.phone}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1 bg-white dark:bg-form-input"
              />
            </div>

            {/* Role Field */}
            <div className="mb-4">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                id="role"
                value={staff.role}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1 bg-white dark:bg-form-input"
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="my-10 flex justify-end space-x-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save Edit
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white bg-red-600 hover:bg-gray-600 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditStaff;
