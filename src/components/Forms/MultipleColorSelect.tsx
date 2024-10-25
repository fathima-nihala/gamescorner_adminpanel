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
        <FormControl fullWidth className={`w-full ${className}`}>
            <InputLabel>Color</InputLabel>
            <Select
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
                    <MenuItem key={co._id} value={co._id}>
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
