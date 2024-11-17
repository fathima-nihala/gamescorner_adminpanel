import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchAllUsers } from "../../slices/userSlice";
import { useEffect } from "react";
import defaultUserImage from '../../images/user/user.png';


const Team = () => {

  const dispatch = useDispatch<AppDispatch>();
  const { adminusers } = useSelector((state: RootState) => state.userState);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        TEAM
      </h4>

      <div className="flex flex-col">
        {/* Header */}
        <div className="grid grid-cols-4 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-4">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              #
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase flex justify-start xsm:text-base">
              image
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              name
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              role
            </h5>
          </div>
        </div>

        {/* Table Body */}
        {adminusers.map((brand, key) => (
          <div
            key={key}
            className="grid grid-cols-4 items-center hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-meta-4 hover:bg-gray-3"
          >
            <div className="p-2.5 xl:p-5">
              {key + 1}
            </div>
            <div className="flex  p-2.5 xl:p-5">
              <img
                src={brand?.profile ? brand.profile : defaultUserImage} 
                alt={brand.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <p className="text-black dark:text-white">
                {brand.name}
              </p>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <p className="text-black dark:text-white">
                {brand?.role}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Team;
