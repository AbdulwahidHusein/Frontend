import React from "react";
import Filter from "@/components/feed/Filter";
import Ads from "@/components/feed/Ads";
import Feed from "@/components/feed/Feed";

const page = () => {
  return (
    <div className="flex items-center justify-center h-[100lvh] pt-[4.8rem] overflow-clip bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full md:w-[30%] p-2 md:p-6 md:py-10 h-[100%] hidden sm:block ">
        <Filter />
      </div>
      <Feed />
      <Ads />
    </div>
  );
};

export default page;
