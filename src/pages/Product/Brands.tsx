import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { Brand, fetchBrands, deleteBrand } from '../../slices/brandSlice';
import Delete from "@mui/icons-material/Delete";
import { IconButton } from '@mui/material';
import ConfirmationModal from '../../shared/ConfirmationModal';
import { AppDispatch, RootState } from '../../redux/store';
import { useSnackbar } from 'notistack';
import AddBrands from './AddBrand';

const Brands: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const brands = useSelector((state: RootState) => state.brands.brands);
  const status = useSelector((state: RootState) => state.brands.status);

  const [delOpen, setDelOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Brand | null>(null);
  const [addBrandOpen, setAddBrandOpen] = useState<boolean>(false); 
  const { enqueueSnackbar } = useSnackbar();

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const brandsPerPage = 10;

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBrands());
    }
  }, [status, dispatch]);

  const delHandleClose = () => {
    setDelOpen(false);
  };

  const handleDeleteClick = (item: Brand) => {
    setSelectedItem(item);
    setDelOpen(true);
  };

  const onDelete = async () => {
    if (selectedItem) {
      try {
        await dispatch(deleteBrand(selectedItem._id)).unwrap();
        enqueueSnackbar('Brand deleted successfully!', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
      } catch (error: any) {
        enqueueSnackbar('Failed to delete the brand.', { variant: 'error' });
      }
    }
    delHandleClose();
  };

  // Pagination logic
  const indexOfLastBrand = currentPage * brandsPerPage;
  const indexOfFirstBrand = indexOfLastBrand - brandsPerPage;
  const currentBrands = brands.slice(indexOfFirstBrand, indexOfLastBrand);
  const totalPages = Math.ceil(brands.length / brandsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Breadcrumb pageName="Brand" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="py-6 px-4 md:px-6 xl:px-7.5 flex justify-end">
          <button 
            className="bg-blue-500 text-white py-2 px-4 rounded-md disabled:opacity-50" 
            onClick={() => setAddBrandOpen(true)} // Open Add Brand modal
          >
            Add Brand
          </button>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-4 border-t border-stroke py-4.5 px-4 lg:px-8 dark:border-strokedark">
          <div className="col-span-1 flex items-center">
            <p className="font-medium">No</p>
          </div>
          <div className="col-span-1 flex items-center ">
            <p className="font-medium">Brand Image</p>
          </div>
          <div className="col-span-1 flex items-center ">
            <p className="font-medium">Name</p>
          </div>
          <div className="col-span-1 flex items-end justify-end">
            <p className="font-medium">Action</p>
          </div>
        </div>

        {/* Table Content */}
        {currentBrands.map((brand, index) => (
          <div
            className="grid grid-cols-4 border-t border-stroke py-4.5 px-4 lg:px-8 dark:border-strokedark"
            key={brand._id}
          >
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-black dark:text-white">
                {index + 1 + indexOfFirstBrand} {/* Adjust index */}
              </p>
            </div>
            <div className="col-span-1 flex items-center ">
              <div className="h-12.5 w-15 rounded-md">
                <img src={brand?.image} alt={brand.name} />
              </div>
            </div>
            <div className="col-span-1 flex items-center ">
              <p className="text-sm text-black dark:text-white">
                {brand.name}
              </p>
            </div>
            <div className="col-span-1 flex items-end justify-end ">
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDeleteClick(brand)}
              >
                <Delete fontSize="small" />
              </IconButton>
            </div>
          </div>
        ))}

        <ConfirmationModal
          delOpen={delOpen}
          delHandleClose={delHandleClose}
          onDelete={onDelete}
        />

        {/* Pagination Controls */}
        <div className="flex justify-between items-center py-4 px-4">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="bg-blue-500 text-white py-1 px-3 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <p>{`Page ${currentPage} of ${totalPages}`}</p>
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="bg-blue-500 text-white py-1 px-3 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Add Brand Modal */}
      <AddBrands open={addBrandOpen} handleClose={() => setAddBrandOpen(false)} />
    </>
  );
};

export default Brands;
