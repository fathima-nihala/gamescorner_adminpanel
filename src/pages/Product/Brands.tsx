import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { Brand, fetchBrands, deleteBrand } from '../../slices/brandSlice';
import Delete from "@mui/icons-material/Delete";
import { IconButton } from '@mui/material';
import ConfirmationModal from '../../shared/ConfirmationModal';
import { AppDispatch, RootState } from '../../redux/store';
import { useSnackbar } from 'notistack';


const Brands: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const brands = useSelector((state: RootState) => state.brands.brands);
  const status = useSelector((state: RootState) => state.brands.status);

  const [delOpen, setDelOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Brand | null>(null);
  const { enqueueSnackbar } = useSnackbar();


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
          variant: 'success', anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          }
        });
      } catch (error: any) {
        enqueueSnackbar('Failed to delete the brand.', { variant: 'error' });
      }
    }
    delHandleClose();
  };

  return (
    <>
      <Breadcrumb pageName="Brand" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="py-6 px-4 md:px-6 xl:px-7.5"></div>

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
        {brands.map((brand, index) => (
          <div
            className="grid grid-cols-4 border-t border-stroke py-4.5 px-4 lg:px-8 dark:border-strokedark"
            key={brand._id}
          >
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-black dark:text-white">
                {index + 1}
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
      </div>
    </>
  );
};

export default Brands;