"use client";

import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Card, CardBody, Chip, Button } from "@nextui-org/react";
import { RootState, AppDispatch } from "@/lib/store";
import { fetchBookmarks, removeBookmark } from "@/lib/features/bookmarkSlice";
import { useSession } from "next-auth/react";
import { FaBookmark, FaTimes } from "react-icons/fa";
import Sidebar from "@/components/layout/Sidebar";
import NavBar from "@/components/layout/NavBar";

const BookmarksPage = () => {
  const [selectedJob, setSelectedJob] = React.useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { data: session } = useSession();
  const dispatch = useDispatch<AppDispatch>();
  
  const bookmarkState = useSelector((state: RootState) => state.bookmarks);
  const { bookmarks = [], loading = false } = bookmarkState || {};

  useEffect(() => {
    if (session?.user?.accessToken) {
      dispatch(fetchBookmarks(session.user.accessToken));
    }
  }, [session?.user?.accessToken, dispatch]);

  const handleRemoveBookmark = useCallback(async (e: React.MouseEvent, bookmarkId: number) => {
    e.stopPropagation();
    if (session?.user?.accessToken) {
      await dispatch(removeBookmark({ jobId: bookmarkId, token: session.user.accessToken }));
    }
  }, [session?.user?.accessToken, dispatch]);

  const openSidebar = useCallback((job: any) => {
    if (job?.job_details) {
      setSelectedJob(job.job_details);
      setSidebarOpen(true);
    }
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
    setSelectedJob(null);
  }, []);

  return (
    <>
      <NavBar />
      <div className="relative min-h-screen p-6">
        <Sidebar isOpen={sidebarOpen} job={selectedJob} onClose={closeSidebar} />
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6">Bookmarked Jobs</h1>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          ) : bookmarks.length === 0 ? (
            <Card className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 p-6 text-center">
              <CardBody>
                <FaBookmark className="mx-auto text-5xl text-yellow-400 mb-4" />
                <h3 className="text-xl font-semibold text-yellow-700 dark:text-yellow-300 mb-2">
                  No Bookmarked Jobs
                </h3>
                <p className="text-yellow-600 dark:text-yellow-400">
                  Jobs you bookmark will appear here. Start exploring jobs to add to your bookmarks!
                </p>
              </CardBody>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((bookmark) => (
                <Card 
                  key={bookmark.id} 
                  className="w-full h-52 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  isPressable
                  onPress={() => openSidebar(bookmark)}
                >
                  <CardBody className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-primary">
                          {bookmark.job_details.job_title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {bookmark.job_details.company_name}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {bookmark.job_details.tech_stack?.map((tech, index) => (
                            <Chip key={index} size="md" variant="flat" color="primary">
                              {tech}
                            </Chip>
                          ))}
                        </div>
                      </div>
                      <Button
                        isIconOnly
                        color="danger"
                        variant="light"
                        onClick={(e) => handleRemoveBookmark(e, bookmark.id)}
                      >
                        <FaTimes className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BookmarksPage;