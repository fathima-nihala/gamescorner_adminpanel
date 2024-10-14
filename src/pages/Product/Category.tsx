import React, { useEffect, useState, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { IconButton, MenuItem, Menu, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Settings } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import {
  fetchCategories,
  deleteCategory,
  clearSuccessMessage,
  clearErrorMessage,
} from '../../slices/categorySlice';
import { useSnackbar } from 'notistack';

const Category: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading, error, successMessage } = useSelector(
    (state: RootState) => state.category
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null); // Changed to string | null
  const [query, setQuery] = useState<string>('');
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    dispatch(fetchCategories(''));
  }, [dispatch]);

  // Show snackbar for success and error messages
  useEffect(() => {
    if (successMessage) {
      enqueueSnackbar(successMessage, {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      dispatch(clearSuccessMessage());
    }

    if (error) {
      enqueueSnackbar(error, {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      dispatch(clearErrorMessage());
    }
  }, [successMessage, error, dispatch, enqueueSnackbar]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleClick = (event: MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id); // Set selected category ID when clicking the "More" button
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  const handleDelete = () => {
    if (selectedId) {
      dispatch(deleteCategory(selectedId)).then(() => {
        enqueueSnackbar('Category deleted successfully!', { variant: 'success' });
      });
    }
    handleClose();
  };

  const open = Boolean(anchorEl);

  // Filter categories based on the search query
  const filteredCategories = categories.filter((category) =>
    category.parent_category.toLocaleLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-between p-4">
        <div className="mt-2 relative w-full">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-5 text-[#ccc]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search here..."
            className="py-2 px-10 w-1/2 border border-gray-300 rounded-md outline-none"
            value={query}
            onChange={handleSearchChange}
          />
        </div>
        <div className="mt-2">
          <button className="bg-blue-500 text-white py-2 px-8 rounded-md disabled:opacity-50">
            Add
          </button>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-4">
            <CircularProgress />
          </div>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Image
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Icon
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Cover Image
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Parent Category
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category._id}>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark pl-10">
                    <img
                      src={category?.image}
                      alt={`Image of ${category.name}`}
                      className="h-12.5 w-15 rounded-md object-fill"
                    />
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <img
                      src={category?.icon}
                      alt={`Icon of ${category.name}`}
                      className="w-11 h-11 rounded-lg object-cover p-0.5"
                    />
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <img
                      src={category?.cover_image}
                      alt={`Cover of ${category.name}`}
                      className="h-12.5 w-18 rounded-md"
                    />
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <h5 className="font-medium text-black dark:text-white">
                      {category?.parent_category}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <IconButton size="small">
                        <Link to={`/dashboard/category-details/${category._id}`}>
                          <Settings fontSize="small" className="text-black dark:text-white" />
                        </Link>
                      </IconButton>
                      <IconButton
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        onClick={(event) => handleClick(event, category._id)} // Set selected category's ID
                      >
                        <MoreVertIcon className="text-black dark:text-white" />
                      </IconButton>
                      <Menu
                        id="long-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={open && selectedId === category._id} // Only open for the selected category
                        onClose={handleClose}
                        MenuListProps={{
                          'aria-labelledby': 'long-button',
                          className: 'bg-white dark:bg-boxdark',
                        }}
                      >
                        <MenuItem
                          className="text-black dark:text-white bg-white dark:bg-boxdark hover:bg-gray-200 dark:hover:bg-gray-700"
                          onClick={handleDelete}
                        >
                          <DeleteIcon className="mr-2" /> Delete
                        </MenuItem>
                        <MenuItem
                          className="text-black dark:text-white bg-white dark:bg-boxdark hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <EditIcon className="mr-2" /> Edit
                        </MenuItem>
                      </Menu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Category;
