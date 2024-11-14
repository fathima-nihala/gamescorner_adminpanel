import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { IoMdCloudUpload } from 'react-icons/io';


interface DropzoneImageProps {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    image?: string | null;
    id: string;
}

const DropzoneImage: React.FC<DropzoneImageProps> = ({ onChange, image, id }) => {
    return (
        <div>
            <label
                htmlFor={id}
                className="p-1 border-2 border-gray-300 border-dashed rounded-lg "
                style={{ fontSize: "1.2rem", display: "flex", flexDirection: "column", alignItems: "center" }}
            >
                <Box margin="auto">
                    <IoMdCloudUpload size={35} style={{ margin: "auto" }} />
                    <Text className='text-[15px]'>Drop your file here, or <span className="browse">browse</span></Text>
                    <Text className="text-[12px] text-gray-600">PNG, JPG, and GIF files are allowed</Text>
                </Box>
                <input
                    id={id}
                    type="file"
                    className="file-input"
                    accept=".png, .jpg, .gif"
                    style={{ display: "none" }}
                    aria-label="Upload file"
                    onChange={onChange}
                />
            </label>
            {image && (
                <img src={image} alt="preview" className="w-[100%]  mt-6" />
            )}
        </div>
    );
};

export default DropzoneImage;
