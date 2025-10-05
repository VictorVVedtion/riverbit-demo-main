import React from "react";
interface PrimaryButtonProps {
    onClick?: () => void;
    children: React.ReactNode;
    size?: "small" | "medium" | "large";
    icon?: React.ReactNode;
}
declare const PrimaryButton: React.FC<PrimaryButtonProps>;
export default PrimaryButton;
