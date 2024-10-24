
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttributeValues } from '../../slices/attributeSlice';
import { AppDispatch, RootState } from '../../redux/store';

interface MultiSelectProps {
  attributeId: string;
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ 
  attributeId, 
  selectedValues,
  onChange 
}) => {
  const [show, setShow] = useState(false);
  const dropdownRef = useRef<any>(null);
  const trigger = useRef<any>(null);
  
  const dispatch = useDispatch<AppDispatch>();
  const { attributeValues } = useSelector((state: RootState) => state.attribute);

  useEffect(() => {
    if (attributeId) {
      dispatch(fetchAttributeValues(attributeId));
    }
  }, [dispatch, attributeId]);

  const toggleOption = (valueId: string) => {
    const newSelected = selectedValues.includes(valueId)
      ? selectedValues.filter(id => id !== valueId)
      : [...selectedValues, valueId];
    onChange(newSelected);
  };

  const removeValue = (valueId: string) => {
    const newSelected = selectedValues.filter(id => id !== valueId);
    onChange(newSelected);
  };

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (
        !show ||
        dropdownRef.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setShow(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  return (
    <div className="relative">
      <div className="flex flex-col items-center">
        <div className="relative inline-block w-full">
          <div className="relative flex flex-col items-center">
            <div ref={trigger} onClick={() => setShow(!show)} className="w-full">
              <div className="mb-2 flex rounded border border-stroke py-2 pl-3 pr-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                <div className="flex flex-auto flex-wrap gap-3">
                  {selectedValues.length > 0 && attributeValues?.value ? (
                    attributeValues.value
                      .filter(item => selectedValues.includes(item._id))
                      .map(item => (
                        <div
                          key={item._id}
                          className="my-1.5 flex items-center justify-center rounded border-[.5px] border-stroke bg-gray px-2.5 py-1.5 text-sm font-medium dark:border-strokedark dark:bg-white/30"
                        >
                          <div className="max-w-full flex-initial">{item.value}</div>
                          <div className="flex flex-auto flex-row-reverse">
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                removeValue(item._id);
                              }}
                              className="cursor-pointer pl-2 hover:text-danger"
                            >
                              <svg
                                className="fill-current"
                                role="button"
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M9.35355 3.35355C9.54882 3.15829 9.54882 2.84171 9.35355 2.64645C9.15829 2.45118 8.84171 2.45118 8.64645 2.64645L6 5.29289L3.35355 2.64645C3.15829 2.45118 2.84171 2.45118 2.64645 2.64645C2.45118 2.84171 2.45118 3.15829 2.64645 3.35355L5.29289 6L2.64645 8.64645C2.45118 8.84171 2.45118 9.15829 2.64645 9.35355C2.84171 9.54882 3.15829 9.54882 3.35355 9.35355L6 6.70711L8.64645 9.35355C8.84171 9.54882 9.15829 9.54882 9.35355 9.35355C9.54882 9.15829 9.54882 8.84171 9.35355 8.64645L6.70711 6L9.35355 3.35355Z"
                                  fill="currentColor"
                                ></path>
                              </svg>
                            </div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="flex-1">
                      <input
                        placeholder="Select values"
                        className="h-full w-full appearance-none bg-transparent p-1 px-2 outline-none"
                        readOnly
                      />
                    </div>
                  )}
                </div>
                <div className="flex w-8 items-center py-1 pl-1 pr-1">
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="h-6 w-6 cursor-pointer outline-none focus:outline-none"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.8">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                          fill="#637381"
                        ></path>
                      </g>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            {show && attributeValues?.value && (
              <div className="absolute left-0 right-0 top-full  w-full">
                <div
                  className="max-h-60 overflow-y-auto rounded-md border border-stroke bg-white shadow-lg dark:border-strokedark dark:bg-boxdark"
                  ref={dropdownRef}
                >
                  <ul className="flex flex-col py-2">
                    {attributeValues.value.map((item) => (
                      <li
                        key={item._id}
                        className={`relative cursor-pointer px-4 py-2 text-sm hover:bg-gray dark:hover:bg-meta-4 ${
                          selectedValues.includes(item._id)
                            ? 'bg-gray dark:bg-meta-4'
                            : ''
                        }`}
                        onClick={() => toggleOption(item._id)}
                      >
                        <div className="flex items-center">
                          <span className="flex-grow">{item.value}</span>
                          {selectedValues.includes(item._id) && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-primary"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;