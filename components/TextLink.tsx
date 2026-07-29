type TextLinkProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function TextLink({ children, onClick }: TextLinkProps) {
  return (
    <button
      onClick={onClick}
      className="text-sm text-[#B8933E] border-b border-transparent cursor-pointer transition-all duration-300 hover:text-[#9C6B4A] hover:border-[#9C6B4A]"
    >
      {children}
    </button>
  );
}