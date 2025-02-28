"use client";

import React, { useEffect, useRef } from "react";
import { Job } from "../../types/types";
import { Button, Chip, Divider, ScrollShadow } from "@nextui-org/react";
import {
  FaTimes,
  FaMapMarkerAlt,
  FaBriefcase,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaLink,
} from "react-icons/fa";
import { MdWork } from "react-icons/md";
import { BsBuilding } from "react-icons/bs";

interface SidebarProps {
  isOpen: boolean;
  job: Job;
  onClose: () => void;
}

export default function Sidebar({ isOpen, job, onClose }: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  return (
    <div
      ref={sidebarRef}
      className={`fixed inset-y-0 left-0 z-50 w-full sm:max-w-[100vw] md:max-w-[600px] lg:max-w-[800px] bg-background shadow-2xl transition-transform duration-300 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } flex flex-col h-screen`}
    >
      {/* Header Section - Fixed */}
      <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-background">
        <h2 className="text-xl sm:text-2xl font-bold line-clamp-1">{job?.job_title}</h2>
        <Button
          isIconOnly
          variant="light"
          onClick={onClose}
          aria-label="Close sidebar"
          className="min-w-unit-10 w-10 h-10"
        >
          <FaTimes className="text-xl" />
        </Button>
      </div>

      {/* Content Section - Scrollable */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="p-4 sm:p-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center">
              <BsBuilding className="mr-2 text-primary flex-shrink-0" />
              <span className="font-semibold line-clamp-1">{job?.company_name}</span>
            </div>
            {job?.location && (
              <div className="flex items-center">
                <FaMapMarkerAlt className="mr-2 text-primary flex-shrink-0" />
                <span className="line-clamp-1">{job?.location}</span>
              </div>
            )}
            <div className="flex items-center">
              <MdWork className="mr-2 text-primary flex-shrink-0" />
              <span className="line-clamp-1">{job?.work_arrangement}</span>
            </div>
            <div className="flex items-center">
              <FaBriefcase className="mr-2 text-primary flex-shrink-0" />
              <span className="line-clamp-1">{job?.job_type}</span>
            </div>
            <div className="flex items-center">
              <FaMoneyBillWave className="mr-2 text-primary flex-shrink-0" />
              <span className="line-clamp-1">{job?.salary_range}</span>
            </div>
          </div>

          <Divider className="my-4 sm:my-6" />

          <section className="space-y-2">
            <h3 className="text-xl font-semibold">Company Description</h3>
            <p className="text-foreground-600 leading-relaxed">{job?.company_description}</p>
          </section>

          {job?.responsibilities && (
            <>
              <Divider className="my-6" />
              <section className="space-y-3">
                <h3 className="text-xl font-semibold">Responsibilities</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {job?.responsibilities?.map((resp, index) => (
                    <li key={index} className="text-foreground-600">
                      {resp}
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}

          {job?.requirements && (
            <>
              <Divider className="my-6" />
              <section className="space-y-3">
                <h3 className="text-xl font-semibold">Requirements</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {job?.requirements?.map((req, index) => (
                    <li key={index} className="text-foreground-600">
                      {req}
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}

          {job?.preferred_qualifications && (
            <>
              <Divider className="my-6" />
              <section className="space-y-3">
                <h3 className="text-xl font-semibold">Preferred Qualifications</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {job?.preferred_qualifications?.map((qual, index) => (
                    <li key={index} className="text-foreground-600">
                      {qual}
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}

          {job?.benefits && (
            <>
              <Divider className="my-6" />
              <section className="space-y-3">
                <h3 className="text-xl font-semibold">Benefits</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {job?.benefits?.map((benefit, index) => (
                    <li key={index} className="text-foreground-600">
                      {benefit}
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}

          {job?.tech_stack && (
            <>
              <Divider className="my-6" />
              <section className="space-y-3">
                <h3 className="text-xl font-semibold">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {job?.tech_stack?.map((tech, index) => (
                    <Chip key={index} color="primary" variant="flat">
                      {tech}
                    </Chip>
                  ))}
                </div>
              </section>
            </>
          )}

          {job?.areas_of_focus && (
            <>
              <Divider className="my-6" />
              <section className="space-y-3">
                <h3 className="text-xl font-semibold">Areas of Focus</h3>
                <div className="flex flex-wrap gap-2">
                  {job?.areas_of_focus?.map((area, index) => (
                    <Chip key={index} color="secondary" variant="flat">
                      {area}
                    </Chip>
                  ))}
                </div>
              </section>
            </>
          )}

          <Divider className="my-6" />
          
          <section className="space-y-3">
            <h3 className="text-xl font-semibold">Important Dates</h3>
            <div className="space-y-2">
              {job?.posted_date && (
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2 text-primary" />
                  <span>Posted: {job?.posted_date}</span>
                </div>
              )}
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2 text-primary" />
                <span>Closing: {job?.closing_date}</span>
              </div>
            </div>
          </section>

          <Divider className="my-6" />
          
          <section className="space-y-3">
            <h3 className="text-xl font-semibold">How to Apply</h3>
            <div className="flex items-center">
              <FaLink className="mr-2 text-primary" />
              <a
                href={job?.application_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline break-all"
              >
                {job?.application_link}
              </a>
            </div>
          </section>
        </div>
      </div>

      {/* Footer Section - Fixed */}
      <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-background">
        <a
          href={job?.application_link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full block"
        >
          <Button 
            color="primary" 
            className="w-full" 
            size="lg"
          >
            Apply Now
          </Button>
        </a>
      </div>
    </div>
  );
}
