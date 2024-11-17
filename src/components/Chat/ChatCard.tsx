import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { useEffect } from 'react';
import { fetchBrands } from '../../slices/brandSlice';

const ChatCard = () => {

  const dispatch = useDispatch<AppDispatch>();
  const brands = useSelector((state: RootState) => state.brands.brands);
  const status = useSelector((state: RootState) => state.brands.status);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBrands());
    }
  }, [status, dispatch]);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h4 className="mb-6 px-7.5 text-xl font-semibold text-black dark:text-white">
        Top Brands
      </h4>

      <div>
        {brands.map((chat, key) => (
          <Link
            to=''
            className="flex items-center gap-5 py-3 px-7.5 hover:bg-gray-3 dark:hover:bg-meta-4"
            key={key}
          >
            <div className="relative h-14 w-14 rounded-full">
              <img src={chat.image} alt="User" />
            </div>
            <div className="flex flex-1 items-center justify-between">
              <div>
                <h5 className="font-medium text-black dark:text-white">
                  {chat.name}
                </h5>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChatCard;
