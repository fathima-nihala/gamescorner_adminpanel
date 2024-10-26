import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { getAllColors } from '../../slices/colorSlice';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { useEffect } from 'react';

interface Color {
    _id: string;
    name: string;
    color_code: string;
}

interface MultipleColorSelectProps {
    selectedColors: string[];
    onChange: (colors: string[]) => void;
    className?: string;
}

const MultipleColorSelect: React.FC<MultipleColorSelectProps> = ({
    selectedColors,
    onChange,
    className = ''
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const { colors } = useSelector((state: RootState) => state.color);

    useEffect(() => {
        dispatch(getAllColors());
    }, [dispatch]);

    const handleColorChange = (event: any) => {
        const selectedOptions = event.target.value;
        onChange(selectedOptions);
    };

    return (
        <FormControl fullWidth className={`w-full dark:bg-form-input bg-white text-graydark dark:text-white ${className}`}>
            <InputLabel className='block text-gray-700 dark:text-white mb-2'>Color</InputLabel>
            <Select
                className="border border-gray-300 rounded-md border-stroke bg-transparent outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-gray-700 dark:text-white"
                label="Color"
                name="color"
                value={selectedColors}
                onChange={handleColorChange}
                multiple
                renderValue={(selected) => (
                    (selected as string[]).map(id => {
                        const selectedColor = colors.find((co: Color) => co._id === id);
                        return selectedColor ? selectedColor.name : '';
                    }).join(', ')
                )}
            >
                {colors && colors.map((co: Color) => (
                    <MenuItem key={co._id} value={co._id}
                    className="dark:bg-form-input bg-white text-graydark dark:text-white dark:hover:bg-slate-500 dark:focus:bg-black"

                    sx={{
                        '&.Mui-selected': {
                            backgroundColor: 'rgb(75 85 99) !important', 
                            color: 'white !important',
                            '&:hover': {
                                backgroundColor: 'rgb(55 65 81) !important', 
                            },
                        },
                        '&.Mui-selected.Mui-focusVisible': {
                            backgroundColor: 'rgb(75 85 99) !important',
                        }
                    }}

                    >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box
                                sx={{
                                    width: 20,
                                    height: 20,
                                    backgroundColor: co.color_code,
                                    marginRight: 1,
                                    borderRadius: '50%',
                                }}
                            />
                            {co.name}
                        </Box>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default MultipleColorSelect;


