import Link from "next/link";

type TextLinkProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
};

export default function TextLink({ children, href, onClick }: TextLinkProps) {
  const className =
    "text-sm text-[#B8933E] border-b border-transparent cursor-pointer transition-all duration-300 hover:text-[#9C6B4A] hover:border-[#9C6B4A]";

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
}