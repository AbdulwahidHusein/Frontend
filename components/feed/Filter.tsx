"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { fetchJobs } from "../../lib/features/jobSlice"; // Adjust the import path as needed

const Filter: React.FC = () => {
  const dispatch = useDispatch();
  const [workArrangement, setWorkArrangement] = useState<string>("");
  const [jobType, setJobType] = useState<string>("");

  const handleApplyFilters = () => {
    dispatch(
      fetchJobs({
        nextUrl: "",
        job_title: "",
        work_arrangement: workArrangement,
        job_type: jobType,
      }) as any
    );
  };

  const workArrangementOptions = ["Remote", "Hybrid", "Onsite"];
  const jobTypeOptions = ["Full-time", "Part-time", "Contract", "Intern"];

  return (
    <div className="w-full max-w-xs">
      <Card className="sticky top-20 bg-white dark:bg-gray-900 shadow-xl rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <CardHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Filter Jobs
          </h4>
        </CardHeader>
        <CardBody className="px-6 py-4 space-y-6">
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <label
              htmlFor="work-arrangement"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Work Arrangement
            </label>
            <Select
              id="work-arrangement"
              selectedKeys={workArrangement ? [workArrangement] : []}
              placeholder="Select work arrangement"
              onChange={(e) => setWorkArrangement(e.target.value)}
              classNames={{
                base: "max-w-full",
                trigger: "h-11 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors",
                value: "text-base text-gray-900 dark:text-gray-100 font-medium",
                listbox: "bg-white dark:bg-gray-800",
                popoverContent: "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-xl",
              }}
              listboxProps={{
                itemClasses: {
                  base: [
                    "rounded-md",
                    "text-base",
                    "text-gray-900",
                    "dark:text-gray-100",
                    "transition-colors",
                    "data-[hover=true]:text-blue-600",
                    "data-[hover=true]:bg-blue-50",
                    "dark:data-[hover=true]:bg-blue-900/20",
                    "data-[selected=true]:text-blue-600",
                    "data-[selected=true]:bg-blue-50",
                    "dark:data-[selected=true]:bg-blue-900/20",
                    "data-[selected=true]:font-medium",
                    "py-3",
                    "px-4",
                  ],
                },
              }}
            >
              {workArrangementOptions.map((option) => (
                <SelectItem 
                  key={option} 
                  value={option}
                  className="data-[selected=true]:bg-blue-50 dark:data-[selected=true]:bg-blue-900/20"
                >
                  {option}
                </SelectItem>
              ))}
            </Select>
          </motion.div>

          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <label
              htmlFor="job-type"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Job Type
            </label>
            <Select
              id="job-type"
              selectedKeys={jobType ? [jobType] : []}
              placeholder="Select job type"
              onChange={(e) => setJobType(e.target.value)}
              classNames={{
                base: "max-w-full",
                trigger: "h-11 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors",
                value: "text-base text-gray-900 dark:text-gray-100 font-medium",
                listbox: "bg-white dark:bg-gray-800",
                popoverContent: "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-xl",
              }}
              listboxProps={{
                itemClasses: {
                  base: [
                    "rounded-md",
                    "text-base",
                    "text-gray-900",
                    "dark:text-gray-100",
                    "transition-colors",
                    "data-[hover=true]:text-blue-600",
                    "data-[hover=true]:bg-blue-50",
                    "dark:data-[hover=true]:bg-blue-900/20",
                    "data-[selected=true]:text-blue-600",
                    "data-[selected=true]:bg-blue-50",
                    "dark:data-[selected=true]:bg-blue-900/20",
                    "data-[selected=true]:font-medium",
                    "py-3",
                    "px-4",
                  ],
                },
              }}
            >
              {jobTypeOptions.map((option) => (
                <SelectItem 
                  key={option} 
                  value={option}
                  className="data-[selected=true]:bg-blue-50 dark:data-[selected=true]:bg-blue-900/20"
                >
                  {option}
                </SelectItem>
              ))}
            </Select>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Button
              onClick={handleApplyFilters}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-2.5 rounded-lg
                        hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all
                        focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              Apply Filters
            </Button>
          </motion.div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Filter;
