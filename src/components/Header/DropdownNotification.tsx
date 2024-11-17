import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ClickOutside from '../ClickOutside';
import { Trash } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { clearAllNotifications, deleteNotification, fetchNotifications, markAsRead } from '../../slices/notificationSlice';

const DropdownNotification = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch])

  const { notifications, loading, count } = useSelector((state: RootState) => state.notify);

  const handleClearAll = () => {
    dispatch(clearAllNotifications()).then(() => {
      setDropdownOpen(false);
    });
  };
  const handleDelete = (id: string) => {
    dispatch(deleteNotification(id));
  };

  const handleNotificationClick = (id: string) => {
    dispatch(markAsRead(id));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <li>
        <Link
          onClick={() => {
            setDropdownOpen(!dropdownOpen);
          }}
          to="#"
          className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
        >
          <span
            className={`absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-meta-1 ${dropdownOpen === false ? 'hidden' : 'inline'
              }`}
          >
            <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
          </span>

          <svg
            className="fill-current duration-300 ease-in-out"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.1999 14.9343L15.6374 14.0624C15.5249 13.8937 15.4687 13.7249 15.4687 13.528V7.67803C15.4687 6.01865 14.7655 4.47178 13.4718 3.31865C12.4312 2.39053 11.0812 1.7999 9.64678 1.6874V1.1249C9.64678 0.787402 9.36553 0.478027 8.9999 0.478027C8.6624 0.478027 8.35303 0.759277 8.35303 1.1249V1.65928C8.29678 1.65928 8.24053 1.65928 8.18428 1.6874C4.92178 2.05303 2.4749 4.66865 2.4749 7.79053V13.528C2.44678 13.8093 2.39053 13.9499 2.33428 14.0343L1.7999 14.9343C1.63115 15.2155 1.63115 15.553 1.7999 15.8343C1.96865 16.0874 2.2499 16.2562 2.55928 16.2562H8.38115V16.8749C8.38115 17.2124 8.6624 17.5218 9.02803 17.5218C9.36553 17.5218 9.6749 17.2405 9.6749 16.8749V16.2562H15.4687C15.778 16.2562 16.0593 16.0874 16.228 15.8343C16.3968 15.553 16.3968 15.2155 16.1999 14.9343ZM3.23428 14.9905L3.43115 14.653C3.5999 14.3718 3.68428 14.0343 3.74053 13.6405V7.79053C3.74053 5.31553 5.70928 3.23428 8.3249 2.95303C9.92803 2.78428 11.503 3.2624 12.6562 4.2749C13.6687 5.1749 14.2312 6.38428 14.2312 7.67803V13.528C14.2312 13.9499 14.3437 14.3437 14.5968 14.7374L14.7655 14.9905H3.23428Z"
              fill=""
            />
          </svg>
        </Link>

        {dropdownOpen && notifications && (
          <div
            className={`absolute -right-27 mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80`}
          >
            <div className="px-4.5 py-3 flex justify-between">
              <h5 className="text-sm font-medium text-bodydark2">
                Notification ({count})
              </h5>
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-sm italic text-red-500 hover:text-graydark cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <ul className="flex h-auto flex-col overflow-y-auto max-h-[480px]">
                {notifications.length === 0 ? (
                  <li className="px-4.5 py-3 text-sm text-gray-500 text-center">
                    No notifications
                  </li>
                ) : (
                  notifications.map((notification) => (
                    <li
                      key={notification._id}
                      className="border-b border-stroke dark:border-strokedark"
                      onClick={() => handleNotificationClick(notification._id)}
                    >
                      <div className={`flex flex-col gap-2.5 px-4.5 py-3 hover:bg-gray-2 dark:hover:bg-meta-4 cursor-pointer ${notification.read ? 'opacity-70' : ''
                        }`}>
                        <p className="text-sm">
                          <span className="text-black dark:text-white font-semibold">
                            {notification.title}
                          </span>
                          <br />
                          {notification.message}
                        </p>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-gray-500">
                            {formatDate(notification.createdAt)}
                          </p>
                          <Trash
                            className="w-4 h-4 text-red-600 hover:text-red-300 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation(); 
                              handleDelete(notification._id);
                            }}
                          />

                          {!notification.read && (
                            <span className="w-2 h-2 bg-meta-1 rounded-full"></span>
                          )}
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            )}

          </div>
        )}
      </li>
    </ClickOutside>
  );
};

export default DropdownNotification;
