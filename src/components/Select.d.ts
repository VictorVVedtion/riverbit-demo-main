import React from "react";
interface SelectProps {
    value: string;
    onChange: (val: string) => void;
    options: {
        label: string;
        value: string;
    }[];
    placeholder?: string;
    minWidth?: string;
}
declare const Select: React.FC<SelectProps>;
export default Select;
