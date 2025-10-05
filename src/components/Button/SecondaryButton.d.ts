import React from "react";
interface SecondaryButtonProps {
    onClick?: () => void;
    children: React.ReactNode;
    size?: "small" | "medium" | "large";
    icon?: React.ReactNode;
}
export declare const SecondaryButton: React.FC<SecondaryButtonProps>;
export {};
