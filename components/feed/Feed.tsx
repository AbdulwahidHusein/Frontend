"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BiDislike } from "react-icons/bi";
import { FaBookmark, FaRegBookmark, FaStackOverflow } from "react-icons/fa";
import { RootState, AppDispatch } from "../../lib/store";
import { fetchJobs } from "../../lib/features/jobSlice";
import { addBookmark, removeBookmark, fetchBookmarks, BookmarkState } from "@/lib/features/bookmarkSlice";
import Sidebar from "../layout/Sidebar";
import { Card, CardBody, Chip, Button, Skeleton } from "@nextui-org/react";
import { ENDPOINTS } from "@/lib/config";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Feed = () => {
  const router = useRouter();
  const [likedJobs, setLikedJobs] = useState(new Set<number>());
  const [dislikedJobs, setDislikedJobs] = useState(new Set<number>());
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false); // Local fetching state
  const { data: session } = useSession();

  const dispatch = useDispatch<AppDispatch>();
  const { jobs, loading, error } = useSelector(
    (state: RootState) => state.jobs
  );
  const bookmarks = useSelector((state: RootState) => state?.bookmarks?.bookmarks ?? []);
  
  const [bookmarkingJobs, setBookmarkingJobs] = useState(new Set<number>());
  
  useEffect(() => {
    if (session?.user?.accessToken) {
      dispatch(fetchBookmarks(session.user.accessToken));
    }
  }, [session?.user?.accessToken]); // Only depend on the token, not dispatch

  // Add initial jobs fetch
  useEffect(() => {
    dispatch(fetchJobs({
      nextUrl: "",
      job_title: "",
      work_arrangement: "",
      job_type: "",
    }));
  }, []); // Empty dependency array for initial fetch only

  const isBookmarked = (jobId: number) => {
    return bookmarks.some(bookmark => bookmark.job_details.id === jobId);
  };

  const handleLike = async (id: number) => {
    console.log('handleLike called with id:', id);
    
    if (!session?.user?.accessToken) {
      console.log('No session or token found');
      return;
    }

    setBookmarkingJobs(prev => new Set([...prev, id]));
    try {
      console.log('Attempting to bookmark job:', id);
      if (isBookmarked(id)) {
        console.log('Job is already bookmarked, removing...');
        await dispatch(removeBookmark({ jobId: id, token: session.user.accessToken })).unwrap();
      } else {
        console.log('Adding new bookmark...');
        await dispatch(addBookmark({ 
          jobId: id, 
          token: session.user.accessToken 
        })).unwrap();
      }
      // Refresh bookmarks list
      await dispatch(fetchBookmarks(session.user.accessToken));
    } catch (error) {
      console.error('Error handling bookmark:', error);
    } finally {
      setBookmarkingJobs(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleDislike = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const updatedDislikes = new Set(dislikedJobs);
    if (updatedDislikes.has(id)) {
      updatedDislikes.delete(id);
    } else {
      updatedDislikes.add(id);
      if (likedJobs.has(id)) {
        likedJobs.delete(id);
        setLikedJobs(new Set(likedJobs));
      }
    }
    setDislikedJobs(updatedDislikes);
  };

  const openSidebar = (job: any) => {
    setSelectedJob(job);
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    setSelectedJob(null);
  };

  const handlePagination = async (pagination: string) => {
    setIsFetching(true); // Set fetching state
    if (pagination === "next" && jobs.next) {
      await dispatch(
        fetchJobs({
          nextUrl: jobs.next,
          job_title: "",
          work_arrangement: "",
          job_type: "",
        })
      );
    } else if (pagination === "prev" && jobs.previous) {
      await dispatch(
        fetchJobs({
          nextUrl: jobs.previous,
          job_title: "",
          work_arrangement: "",
          job_type: "",
        })
      );
    }
    setIsFetching(false); // Reset fetching state
  };

  return (
    <div className="w-full p-5 pt-10 h-full flex flex-col gap-3">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Jobs Feed</h1>
        <div className="flex gap-2">
          <Button
            color="secondary"
            variant="flat"
            onClick={() => {
              if (session?.user?.accessToken) {
                dispatch(fetchJobs({
                  nextUrl: ENDPOINTS.BEST_MATCHES,
                  job_title: "",
                  work_arrangement: "",
                  job_type: "",
                  token: session.user.accessToken
                }));
              }
            }}
            startContent={<FaStackOverflow className="w-4 h-4" />}
          >
            Best Matches
          </Button>
          <Button
            color="primary"
            variant="flat"
            onClick={() => router.push("/careers/bookmarks")}
            startContent={<FaBookmark className="w-4 h-4" />}
          >
            My Bookmarks
          </Button>
        </div>
      </div>
      <Sidebar isOpen={sidebarOpen} job={selectedJob} onClose={closeSidebar} />
      <div className="w-full h-full p-4 space-y-6 overflow-auto hide-scrollbar">
        {isFetching || loading || !jobs?.results ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="w-full hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardBody className="p-5">
                    <div className="flex justify-between items-center mb-3">
                      <div className="h-7 w-2/3 rounded-lg animate-shimmer"></div>
                      <div className="flex space-x-3">
                        <div className="w-6 h-6 rounded-full animate-shimmer"></div>
                        <div className="w-6 h-6 rounded-full animate-shimmer"></div>
                      </div>
                    </div>
                    <div className="h-4 w-1/3 mb-3 rounded-lg animate-shimmer"></div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-5 w-16 rounded-full animate-shimmer"></div>
                      ))}
                    </div>
                    <div className="h-[60px] w-full rounded-lg animate-shimmer"></div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : error ? (
          <Card className="bg-red-100 dark:bg-red-900">
            <CardBody>
              <p className="text-red-500 dark:text-red-300 text-center">
                {error}
              </p>
            </CardBody>
          </Card>
        ) : jobs.results.length === 0 ? (
          <Card className="bg-yellow-100 dark:bg-yellow-900">
            <CardBody>
              <p className="text-yellow-700 dark:text-yellow-300 text-center">
                No jobs available at the moment.
              </p>
            </CardBody>
          </Card>
        ) : (
          <AnimatePresence>
            {jobs.results.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className="w-full hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                  onClick={() => openSidebar(job)}
                >
                  <CardBody className="p-5" onClick={() => openSidebar(job)}>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xl font-semibold text-primary">
                        {job.job_title}
                      </h3>
                      <div className="flex space-x-3">
                        <Button
                          isIconOnly
                          variant="light"
                          onClick={(e) => handleDislike(e, job.id)}
                          className={
                            dislikedJobs.has(job.id)
                              ? "text-red-500"
                              : "text-gray-400 hover:text-red-500"
                          }
                        >
                          <BiDislike className="w-6 h-6" />
                        </Button>
                        <Button
                          isIconOnly
                          variant="light"
                          onPress={() => {
                            console.log('Heart button clicked');
                            handleLike(job.id);
                          }}
                          isLoading={bookmarkingJobs.has(job.id)}
                          className={
                            isBookmarked(job.id)
                              ? "text-red-500"
                              : "text-gray-400 hover:text-red-500"
                          }
                        >
                          {isBookmarked(job.id) ? (
                            <AiFillHeart className="w-6 h-6" />
                          ) : (
                            <AiOutlineHeart className="w-6 h-6" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      {job.company_name}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.tech_stack?.map((tag, index) => (
                        <Chip
                          key={index}
                          size="sm"
                          variant="flat"
                          color="primary"
                        >
                          {tag}
                        </Chip>
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                      {job.company_description}
                    </p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div className="flex justify-center mt-6 space-x-4">
          <Button
            onClick={() => handlePagination("prev")}
            disabled={!jobs.previous || isFetching}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
          >
            Previous
          </Button>
          <Button
            onClick={() => handlePagination("next")}
            disabled={!jobs.next || isFetching}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Feed;
