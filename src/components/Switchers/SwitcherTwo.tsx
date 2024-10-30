
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { enqueueSnackbar } from 'notistack';
import { toggleFeatured } from '../../slices/productSlice';

interface SwitcherTwoProps {
  id: string;
}

const SwitcherTwo: React.FC<SwitcherTwoProps> = ({ id }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { products } = useSelector((state: RootState) => state.product);
  
  const currentProduct = products.find(product => product._id === id);
  const [enabled, setEnabled] = useState<boolean>(currentProduct?.featured || false);

  useEffect(() => {
    if (currentProduct?.featured !== undefined) {
      setEnabled(currentProduct.featured);
    }
  }, [currentProduct?.featured]);

  const handleToggleFeatured = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFeaturedStatus = event.target.checked;
    
    try {
      setEnabled(newFeaturedStatus);
      await dispatch(toggleFeatured({ id, featured: newFeaturedStatus })).unwrap();
      enqueueSnackbar("Featured status updated successfully!", { 
        variant: 'success', 
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    } catch (error) {
      setEnabled(!newFeaturedStatus);
      enqueueSnackbar("Failed to update featured status", { 
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    }
  };

  return (
    <div>
      <label htmlFor={`toggle-featured-${id}`} className="flex cursor-pointer select-none items-center">
        <div className="relative">
          <input
            type="checkbox"
            id={`toggle-featured-${id}`}
            className="sr-only"
            checked={enabled}
            onChange={handleToggleFeatured}
          />
          <div className="block h-7 w-12 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
          <div
            className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white transition ${
              enabled ? '!right-1 !translate-x-full !bg-primary dark:!bg-white' : ''
            }`}
          ></div>
        </div>
      </label>
    </div>
  );
};

export default SwitcherTwo;