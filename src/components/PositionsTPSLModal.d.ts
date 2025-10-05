interface ModalData {
    time: string;
    coin: string;
    position: string | number;
    entryPrice: string;
    markPrice: string;
    takeProfit: string;
    expectedProfit: string;
}
declare const PositionsTPSLModal: ({ data, inputTPSLPrice, onChangeInputTPSLPrice, inputTPSLPercent, onChangeInputTPSLPercent, onClose, onConfirm }: {
    data: ModalData;
    inputTPSLPrice: string;
    onChangeInputTPSLPrice: (val: string) => void;
    inputTPSLPercent: string;
    onChangeInputTPSLPercent: (val: string) => void;
    onClose: () => void;
    onConfirm?: () => void;
}) => import("react/jsx-runtime").JSX.Element;
export default PositionsTPSLModal;
