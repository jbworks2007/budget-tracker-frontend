"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { FcPositiveDynamic } from "react-icons/fc";
import { CiUser } from "react-icons/ci";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const token = Cookies.get("authToken");
  const userCookie = Cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie) : null;
  console.log("🚀 ~ user:", user);

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setOpen(!open);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const handleLogout = () => {
    Object.keys(Cookies.get()).forEach((cookieName) => {
      Cookies.remove(cookieName);
    });
    router.push("/");
  };

  useEffect(() => {
    if (!user || !token) {
      console.log("logout trigger");
      router.push("/");
    }
  }, []);

  return (
    <div className="bg-[url('/bg.svg')] bg-cover bg-center w-full md:p-8">
      <div className="w-full min-h-full bg-white p-4 md:p-8 rounded-2xl shadow-lg">
        {/* user bar */}
        <div className="user-bar min-w-full">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="com-logo">
                <div className="flex items-center">
                  <FcPositiveDynamic size={60} />
                  <div className="text-xl">
                    <div>BUDGET</div>
                    <div>TRACKER</div>
                  </div>
                </div>
              </div>
              <div className="border-r border-gray-400 h-12 mx-5"></div>
              <div className="my-auto hidden md:block">
                <div className="text-2xl font-medium tracking-wide">{`Hello ${
                  user && user.name ? user.name : "User"
                }`}</div>
                <div className="text-sm tracking-wider text-gray-700">
                  Track your monthly budget. Achieve your goal!
                </div>
              </div>
            </div>
            <div className="my-auto">
              <div className="relative inline-block text-left" ref={menuRef}>
                <button
                  onClick={toggleMenu}
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                >
                  {user && user.image ? (
                    <Image
                      src={user.image}
                      alt="Avatar"
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex justify-center items-center">
                      <CiUser size={30} />
                    </div>
                  )}
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1">
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Profile
                      </a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Settings
                      </a>
                      <a
                        href="#"
                        onClick={handleLogout}
                        className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* main contents */}
        <div className="">{children}</div>
      </div>
    </div>
  );
}
