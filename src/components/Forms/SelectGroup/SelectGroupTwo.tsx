import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { getCountries } from '../../../slices/countrSlice';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

interface Country {
  _id: string;
  country: string;
  currency_code: string;
}

interface MultipleCountrySelectProps {
  selectedCountries: string[];
  onChange: (countries: string[]) => void;
  className?: string;
}

const SelectGroupTwo: React.FC<MultipleCountrySelectProps> = ({
  selectedCountries,
  onChange,
  className = ''
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { list: countries } = useSelector((state: RootState) => state.country);

  useEffect(() => {
    dispatch(getCountries());
  }, [dispatch]);

  const handleCountryChange = (event: any) => {
    const selectedOptions = event.target.value;
    onChange(selectedOptions);
  };

  return (
    <FormControl fullWidth className={`w-full ${className}`}>
      <InputLabel>
        <Box display="flex" alignItems="center">
          <Box mr={1} display="flex" alignItems="center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.8">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.0007 2.50065C5.85852 2.50065 2.50065 5.85852 2.50065 10.0007C2.50065 14.1428 5.85852 17.5007 10.0007 17.5007C14.1428 17.5007 17.5007 14.1428 17.5007 10.0007C17.5007 5.85852 14.1428 2.50065 10.0007 2.50065ZM0.833984 10.0007C0.833984 4.93804 4.93804 0.833984 10.0007 0.833984C15.0633 0.833984 19.1673 4.93804 19.1673 10.0007C19.1673 15.0633 15.0633 19.1673 10.0007 19.1673C4.93804 19.1673 0.833984 15.0633 0.833984 10.0007Z"
                  fill="#637381"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.833984 9.99935C0.833984 9.53911 1.20708 9.16602 1.66732 9.16602H18.334C18.7942 9.16602 19.1673 9.53911 19.1673 9.99935C19.1673 10.4596 18.7942 10.8327 18.334 10.8327H1.66732C1.20708 10.8327 0.833984 10.4596 0.833984 9.99935Z"
                  fill="#637381"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.50084 10.0008C7.55796 12.5632 8.4392 15.0301 10.0006 17.0418C11.5621 15.0301 12.4433 12.5632 12.5005 10.0008C12.4433 7.43845 11.5621 4.97153 10.0007 2.95982C8.4392 4.97153 7.55796 7.43845 7.50084 10.0008ZM10.0007 1.66749L9.38536 1.10547C7.16473 3.53658 5.90275 6.69153 5.83417 9.98346C5.83392 9.99503 5.83392 10.0066 5.83417 10.0182C5.90275 13.3101 7.16473 16.4651 9.38536 18.8962C9.54325 19.069 9.76655 19.1675 10.0007 19.1675C10.2348 19.1675 10.4581 19.069 10.6159 18.8962C12.8366 16.4651 14.0986 13.3101 14.1671 10.0182C14.1674 10.0066 14.1674 9.99503 14.1671 9.98346C14.0986 6.69153 12.8366 3.53658 10.6159 1.10547L10.0007 1.66749Z"
                  fill="#637381"
                ></path>
              </g>
            </svg>
          </Box>
          <span>Select Countries</span>
        </Box>
      </InputLabel>
      <Select
        label=" 🌏︎ Select Countries"
        value={selectedCountries}
        onChange={handleCountryChange}
        multiple
        renderValue={(selected) => (
          (selected as string[]).map(id => {
            const selectedCountry = countries.find((country: Country) => country._id === id);
            return selectedCountry ? selectedCountry.country : '';
          }).join(', ')
        )}
      >
        {countries.map((country: Country) => (
          <MenuItem key={country._id} value={country._id}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                component="span"
                sx={{
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 1,
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g opacity="0.8">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M10.0007 2.50065C5.85852 2.50065 2.50065 5.85852 2.50065 10.0007C2.50065 14.1428 5.85852 17.5007 10.0007 17.5007C14.1428 17.5007 17.5007 14.1428 17.5007 10.0007C17.5007 5.85852 14.1428 2.50065 10.0007 2.50065ZM0.833984 10.0007C0.833984 4.93804 4.93804 0.833984 10.0007 0.833984C15.0633 0.833984 19.1673 4.93804 19.1673 10.0007C19.1673 15.0633 15.0633 19.1673 10.0007 19.1673C4.93804 19.1673 0.833984 15.0633 0.833984 10.0007Z"
                      fill="#637381"
                    />
                  </g>
                </svg>
              </Box>
              {country.country}
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectGroupTwo;