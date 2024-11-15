import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import {  fetchUsers, regUser } from '../slices/userSlice';
import { useSnackbar } from 'notistack';
import CloseIcon from '@mui/icons-material/Close';

interface AddStaffProps {
    open: boolean;
    handleClose: () => void;
    initialData?: { _id?: string; name: string; email: string; password: string };
}

const AddStaff: React.FC<AddStaffProps> = ({ open, handleClose, initialData }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { enqueueSnackbar } = useSnackbar();

    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        email: initialData?.email || '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await dispatch(regUser(formData)).unwrap();
            enqueueSnackbar('Staff member added successfully', {
                variant: 'success', anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
            dispatch(fetchUsers());
            handleClose();
        } catch (error: any) {
            enqueueSnackbar(error, {
                variant: 'error', anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-black  rounded-lg shadow-lg p-6 md:w-[440px] w-[320px]">
                <div className='flex justify-between'>
                    <h2 className="text-lg font-semibold mb-4">Add New Staff</h2>
                    <CloseIcon className='text-black dark:text-white cursor-pointer' onClick={handleClose} />
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md bg-white dark:bg-form-input"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md bg-white dark:bg-form-input"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md bg-white dark:bg-form-input"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 bg-gray-300 rounded-md border border-blue-500 text-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-500 text-white rounded-md"
                        >
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStaff;
