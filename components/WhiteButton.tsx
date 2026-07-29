type WhiteButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function WhiteButton({ children, onClick }: WhiteButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-white text-[#201A18] text-sm px-4 py-2 rounded-full cursor-pointer transition-all duration-300 hover:text-[#C99E8F] hover:-translate-y-1"
    >
      {children}
    </button>
  );
}