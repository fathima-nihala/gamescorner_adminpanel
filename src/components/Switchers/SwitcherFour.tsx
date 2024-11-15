import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { enqueueSnackbar } from 'notistack';
import { togglePublish } from '../../slices/productSlice';

interface SwitcherFourProps {
  id: string;
}

const SwitcherFour: React.FC<SwitcherFourProps> = ({ id }) => {

  const dispatch = useDispatch<AppDispatch>();
  const { products } = useSelector((state: RootState) => state.product);

  const currentProduct = products.find(product => product._id === id);
  const [enabled, setEnabled] = useState<boolean>(currentProduct?.publish || false);

  useEffect(() => {
    if (currentProduct?.publish !== undefined) {
      setEnabled(currentProduct.publish);
    }
  }, [currentProduct?.publish]);


  const handleTogglePublish = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPublishStatus = event.target.checked;
    
    try {
      setEnabled(newPublishStatus);
      await dispatch(togglePublish({ id, publish: newPublishStatus })).unwrap();
      enqueueSnackbar("Publish status updated successfully!", { 
        variant: 'success', 
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    } catch (error) {
      setEnabled(!newPublishStatus);
      enqueueSnackbar("Publish to update featured status", { 
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    }
  };

  return (
    // <div>
    //   <label
    //     htmlFor="toggle4"
    //     className="flex cursor-pointer select-none items-center"
    //   >
    //     <div className="relative">
    //       <input
    //         type="checkbox"
    //         id="toggle4"
    //         className="sr-only"
    //         onChange={() => {
    //           setEnabled(!enabled);
    //         }}
    //       />
    //       <div className="block h-8 w-14 rounded-full bg-black"></div>
    //       <div
    //         className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${enabled && '!right-1 !translate-x-full'
    //           }`}
    //       ></div>
    //     </div>
    //   </label>
    // </div>
    <div>
    <label htmlFor={`toggle-publish-${id}`} className="flex cursor-pointer select-none items-center">
      <div className="relative">
        <input
          type="checkbox"
          id={`toggle-publish-${id}`}
          className="sr-only"
          checked={enabled}
          onChange={handleTogglePublish}
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

export default SwitcherFour;
