import React, { useState, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    List,
    MenuItem,
    Menu,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Settings } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';

// Interface for category data
interface CategoryData {
    id: number;
    image: string;
    icon: string;
    parent_category: string;
}

const Category: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [query, setQuery] = useState<string>('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleClick = (event: MouseEvent<HTMLElement>, id: number) => {
        setAnchorEl(event.currentTarget);
        setSelectedId(id);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedId(null);
    };

    const open = Boolean(anchorEl);

    // Dummy data for design purposes
    const datas: CategoryData[] = [
        { id: 1, image: '/path/to/image1.jpg', icon: '/path/to/icon1.jpg', parent_category: 'Electronics' },
        { id: 2, image: '/path/to/image2.jpg', icon: '/path/to/icon2.jpg', parent_category: 'Fashion' },
        { id: 3, image: '/path/to/image3.jpg', icon: '/path/to/icon3.jpg', parent_category: 'Home Appliances' }
    ];

    return (
        <div className="">
            <div className="flex justify-between p-2">
                <div className="mt-8 relative w-full">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-5 text-[#ccc]" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search here..."
                        className="py-2 px-10 w-1/2 border border-gray-300 rounded-md outline-none"
                        value={query}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className='mt-8'>
                    <button className="bg-blue-500 text-white py-2 px-8 rounded-md disabled:opacity-50">
                        Add
                    </button>
                </div>
            </div>

            <TableContainer component={Paper} className="mt-10 text-black dark:text-white bg-white dark:bg-black">
                <Table className='text-black dark:text-white bg-white dark:bg-black'>
                    <TableHead>
                        <TableRow>
                            <TableCell>No</TableCell>
                            <TableCell align="center">Image</TableCell>
                            <TableCell align="center">Icon</TableCell>
                            <TableCell align="center">Parent Category</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {datas.length > 0 ? (
                            datas.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell align="center">
                                        <img
                                            src={row.image}
                                            alt={`Logo ${index + 1}`}
                                            className="w-14 h-14 mx-auto rounded-full object-cover"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <img
                                            src={row.icon}
                                            alt={`Icon ${index + 1}`}
                                            className="w-11 h-11 mx-auto rounded-lg object-cover p-0.5"
                                        />
                                    </TableCell>
                                    <TableCell align="center">{row.parent_category}</TableCell>
                                    <TableCell align="center">
                                        <div className="flex justify-center items-center">
                                            <IconButton size="small">
                                                <Link to={`/dashboard/category-details/${row.id}`}>
                                                    <Settings fontSize="small" className='text-black dark:text-white' />
                                                </Link>
                                            </IconButton>
                                            <List>
                                                <IconButton
                                                    aria-label="more"
                                                    aria-controls="long-menu"
                                                    aria-haspopup="true"
                                                    onClick={(event) => handleClick(event, row.id)}
                                                >
                                                    <MoreVertIcon className="text-black dark:text-white" />
                                                </IconButton>
                                                <Menu
                                                    id="long-menu"
                                                    anchorEl={anchorEl}
                                                    keepMounted
                                                    open={open}
                                                    onClose={handleClose}
                                                >
                                                    <MenuItem className='text-black dark:text-white bg-white dark:bg-black'>
                                                        <EditIcon className="mr-2" /> Edit
                                                    </MenuItem>
                                                    <MenuItem>
                                                        <DeleteIcon className="mr-2" /> Delete
                                                    </MenuItem>
                                                </Menu>
                                            </List>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No categories found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default Category;