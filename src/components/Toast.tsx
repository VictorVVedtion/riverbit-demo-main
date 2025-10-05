import { useEffect } from "react";

type ToastProps = {
  title: string;
  message?: string;
  subMessage?: string;
  type?: "success" | "loading" | "error";
  onClose: () => void;
};

export default function Toast({
  title,
  message,
  subMessage,
  type = "success",
  onClose,
}: ToastProps) {
  // 自動消失
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const borderColor =
    type === "success"
      ? "border-green-600"
      : type === "loading"
      ? "border-blue-600"
      : "border-red-600";

  return (
    <div
      className={`fixed bottom-4 right-4 w-80 flex flex-col items-start py-4 rounded-lg border-l-4 border-solid ${borderColor} shadow-lg bg-black`}
    >
      <span className="text-white text-base font-bold ml-5">{title}</span>
      {message && (
        <span className="text-[#8B949E] text-sm ml-5">{message}</span>
      )}
      {subMessage && (
        <span className="text-[#8B949E] text-sm ml-5">{subMessage}</span>
      )}
    </div>
  );
}
