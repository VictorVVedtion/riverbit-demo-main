import React from "react";
interface MobileHeaderProps {
    balance?: string;
    onDeposit?: () => void;
    onMenuToggle: () => void;
}
declare const MobileHeader: React.FC<MobileHeaderProps>;
export default MobileHeader;
