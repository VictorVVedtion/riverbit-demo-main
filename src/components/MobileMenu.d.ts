import React from "react";
interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    balance?: string;
    points?: string;
    language: string;
    setLanguage: (val: string) => void;
}
declare const MobileMenu: React.FC<MobileMenuProps>;
export default MobileMenu;
