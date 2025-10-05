import React from "react";
interface PercentSliderProps {
    value: number;
    maxAmount: number;
    onChangeAmount: (amount: string) => void;
}
declare const PercentSlider: React.FC<PercentSliderProps>;
export default PercentSlider;
