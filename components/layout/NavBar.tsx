"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Link,
  Input,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  Button,
} from "@nextui-org/react";
import { FaSearch, FaStackOverflow, FaBookmark } from "react-icons/fa";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchJobs } from "@/lib/features/jobSlice";
import { signOut, useSession } from "next-auth/react";
import Filter from "../feed/Filter";
import { CiFilter } from "react-icons/ci";
import { getProfileAsync } from "@/lib/features/createProfile";
import { Root } from "postcss";
import { useRouter } from "next/navigation";

const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const NavBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();
  const userProfile = useSelector((state: RootState) => state.profile.userProfile);
  const router = useRouter();

  // Fetch profile only when session token changes
  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      if (session?.user?.accessToken && isMounted && !userProfile) {
        await dispatch(getProfileAsync(session.user.accessToken));
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [session?.user?.accessToken, userProfile]);

  // Memoize the debounced search function
  const debouncedSearch = useMemo(
    () => debounce((term: string) => {
      dispatch(
        fetchJobs({
          nextUrl: "",
          job_title: term,
          work_arrangement: "",
          job_type: "",
        })
      );
    }, 1000),
    [dispatch]
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  }, [debouncedSearch]);

  return (
    <Navbar
      maxWidth={"full"}
      className="fixed bg-white p-[0.4rem] md:pl-[5rem] md:pr-[5rem] z-20 shadow-md"
    >
      <NavbarContent
        justify="start"
        className="p-0 w-full flex items-center justify-between"
      >
        <NavbarBrand className="p-0 m-0">
          <h1
            className="hidden sm:block font-bold text-[2rem] cursor-pointer text-primary hover:text-primary-dark transition-colors"
            onClick={() => (window.location.href = "/careers")}
          >
            AddisCareer
          </h1>
          <div className="block sm:hidden">
            <Button
              isIconOnly
              variant="light"
              startContent={<CiFilter size={24} className="text-gray-600" />}
              onClick={() => setShowFilter(!showFilter)}
              className="hover:bg-gray-100 rounded-full"
            />
          </div>
        </NavbarBrand>

        <div className="flex items-center gap-4 mr-4">
          <Input
            value={searchTerm}
            onChange={handleChange}
            classNames={{
              base: "max-w-full sm:max-w-[24rem] h-12",
              mainWrapper: "h-full",
              input: "text-base px-4",
              inputWrapper:
                "h-full font-normal text-default-700 bg-white dark:bg-gray-700 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition-all",
            }}
            placeholder="Search for jobs..."
            size="md"
            startContent={<FaSearch size={20} className="text-gray-500" />}
            type="search"
          />
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform hover:scale-110 w-10 h-10 shadow-md"
                color="secondary"
                size="sm"
                radius="full"
                src={userProfile?.profile_image_uri}
                fallback={
                  <div className="w-full h-full flex items-center justify-center bg-secondary text-white text-tiny">
                    {session?.user?.email ? session.user.email[0].toUpperCase() : "U"}
                  </div>
                }
                classNames={{
                  base: "border-2",
                  img: "object-cover rounded-full",
                }}
              />
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="Profile Actions" 
              variant="flat"
              className="w-[240px]"
              itemClasses={{
                base: [
                  "rounded-md",
                  "text-sm",
                  "transition-opacity",
                  "data-[hover=true]:bg-default-100",
                  "dark:data-[hover=true]:bg-default-50",
                  "hover:shadow-lg",
                ],
              }}
              classNames={{
                base: "py-1 px-1 border border-default-200 bg-white dark:bg-gray-800 shadow-md",
              }}
            >
              <DropdownItem
                key="profile-header"
                className="h-14 gap-2 opacity-100 cursor-pointer"
                textValue="Profile Header"
                onClick={() => window.location.href = "/careers/profile"}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-default-700">
                    {session?.user?.email || "User"}
                  </span>
                  <span className="text-xs text-default-500">
                    {session?.user?.email || ""}
                  </span>
                </div>
              </DropdownItem>
              <DropdownItem 
                key="profile"
                description="Manage your profile settings"
                className="py-2"
                onClick={() => router.push("/careers/profile")}
                startContent={
                  <div className="w-7 h-7 flex items-center justify-center rounded-full bg-secondary/10 text-secondary">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                }
              >
                Profile Settings
              </DropdownItem>
              <DropdownItem
                key="bookmarks"
                description="View your saved jobs"
                className="py-2"
                onClick={() => router.push("/careers/bookmarks")}
                startContent={
                  <div className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                    <FaBookmark className="w-4 h-4" />
                  </div>
                }
              >
                Bookmarks
              </DropdownItem>
              <DropdownItem
                key="logout"
                className="text-danger py-2"
                color="danger"
                description="Sign out from your account"
                onClick={() => signOut()}
                startContent={
                  <div className="w-7 h-7 flex items-center justify-center rounded-full bg-danger/10 text-danger">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                }
              />
            </DropdownMenu>
          </Dropdown>
        </div> 
      </NavbarContent>
      {showFilter && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md z-10">
          <Filter />
        </div>
      )}
    </Navbar>
  );
};

export default NavBar;