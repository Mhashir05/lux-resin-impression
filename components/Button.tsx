type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "outline";
  onClick?: () => void;
};

export default function Button({
  children,
  variant = "primary",
  onClick,
}: ButtonProps) {
  const base =
    "text-sm px-6 py-3 rounded-full cursor-pointer transition-all duration-300";

  const styles =
    variant === "primary"
      ? "bg-[#1D1D1F] text-white hover:bg-[#B8933E]"
      : "border border-gray-300 text-[#1D1D1F] hover:bg-[#B8933E] hover:border-[#B8933E] hover:text-white";

  return (
    <button onClick={onClick} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}