
interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    localErrors?: boolean;
    helperText?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({ localErrors, helperText, ...rest }) => {
    return (
        <div className="relative">
            <input
                className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${localErrors ? 'border-red-500' : ''}`}
                {...rest} 
            />
            {localErrors && helperText && (
                <p className="text-red-500 text-xs mt-1">{helperText}</p>
            )}
        </div>
    );
};

export default CustomInput;
