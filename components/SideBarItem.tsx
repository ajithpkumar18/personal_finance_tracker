import { usePathname, useRouter } from "next/navigation";

interface SidebarItemProps {
  activeicon?: string;
  inactiveicon?: string;
  text?: string;
  path: string;
}

const SidebarItem = ({
  text,
  path,
}: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = pathname === path;

  const handleClick = () => {
    router.push(path);
  };

  return (
    <div
      onClick={handleClick}
      className={`flex w-full items-center border-l-2 hover:bg-slate-800 ${isActive
        ? "border-purple-600 text-white bg-gray-600"
        : "text-white-500"
        } px-5 py-2 mb-4 gap-4 active:bg-gray-600 cursor-pointer transition`}
    >
      <span>
        {/* <img
          src={isActive ? activeicon : inactiveicon}
          alt=""
          className="w-5 h-5"
        /> */}
      </span>
      <span className="text-md">{text}</span>
    </div>
  );
};

export default SidebarItem;
