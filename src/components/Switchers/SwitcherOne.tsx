import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { toggleTodaysDeal } from '../../slices/productSlice';
import { enqueueSnackbar } from 'notistack';

interface SwitcherOneProps {
  id: string;
}

interface Product {
  _id: string;
  todaysDeal: boolean; 
}

const SwitcherOne: React.FC<SwitcherOneProps> = ({ id }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { products } = useSelector<RootState, { products: Product[];loading: boolean;error: string | null;}>((state) => state.product);
  
  const currentProduct = products.find(product => product._id === id);
  const [enabled, setEnabled] = useState<boolean>(currentProduct?.todaysDeal || false);
  
  useEffect(() => {
    if (currentProduct?.todaysDeal !== undefined) {
      setEnabled(currentProduct.todaysDeal);
    }
  }, [currentProduct?.todaysDeal]);

  const handleToggleTodaysDeal = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTodaysDealStatus = event.target.checked;
    
    try {
      setEnabled(newTodaysDealStatus);
      await dispatch(toggleTodaysDeal({ id, todaysDeal: newTodaysDealStatus })).unwrap();
      enqueueSnackbar("Today's Deal status updated successfully!", { 
        variant: 'success', 
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    } catch (error) {
      setEnabled(!newTodaysDealStatus);
      enqueueSnackbar("Failed to update Today's Deal status", { 
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    }
  };

  return (
    <div>
      <label htmlFor={`toggle-${id}`} className="flex cursor-pointer select-none items-center">
        <div className="relative">
          <input
            type="checkbox"
            id={`toggle-${id}`}
            className="sr-only"
            checked={enabled}
            onChange={handleToggleTodaysDeal}
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

export default SwitcherOne;