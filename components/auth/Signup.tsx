"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Input,
  Card,
  CardBody,
  CardHeader,
  Progress,
} from "@nextui-org/react";
import { Eye, EyeOff, Sun, Moon, Linkedin, Mail, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegistrationData } from "@/types/types";
import { registerUserThunk, resetState } from "@/lib/features/authSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const schema = z
  .object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function Signup() {
  const [isVisible, setIsVisible] = useState(false);
  const [strength, setStrength] = useState(0);
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, success } = useSelector(
    (state: RootState) => state.auth
  ) as {
    loading: boolean;
    error: string | null;
    success: boolean;
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegistrationData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    setStrength(Math.min((watch("password")?.length / 12) * 100, 100));
  }, [watch("password")]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetState());
    }
    if (success) {
      toast.success("Signup successful");
      dispatch(resetState());

      router.push("/");
    }
  }, [error, success, dispatch]);

  const onSubmit = (data: RegistrationData) => {
    dispatch(registerUserThunk(data));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 transition-colors duration-500 ${
        isDarkMode ? "dark" : ""
      }`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="backdrop-blur-md bg-white/30 dark:bg-gray-800/30 shadow-xl">
          <CardHeader className="flex justify-between items-center pb-0">
            <motion.h1
              className="text-2xl font-bold text-gray-800 dark:text-white"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              AddisCareer
            </motion.h1>
            <Button
              isIconOnly
              variant="light"
              aria-label="Toggle dark mode"
              onClick={toggleDarkMode}
              className="text-gray-800 dark:text-white"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isDarkMode ? "dark" : "light"}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDarkMode ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </motion.div>
              </AnimatePresence>
            </Button>
          </CardHeader>
          <CardBody className="px-6 py-4">
            <h2 className="text-center text-xl font-semibold mb-6 text-gray-800 dark:text-white">Create Account</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <Input
                  type="text"
                  label="First Name"
                  placeholder="Enter your first name"
                  {...register("first_name")}
                  classNames={{
                    base: "w-full",
                    mainWrapper: "h-full",
                    input: "text-small pt-4",
                    inputWrapper: "h-12 font-normal bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg hover:bg-white/90 dark:hover:bg-gray-800/90 ring-1 ring-gray-200 dark:ring-gray-800",
                    label: "text-black/50 dark:text-white/90 font-medium text-small after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-blue-500 after:to-purple-500 after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-300",
                  }}
                />
                {errors.first_name?.message && (
                  <p className="text-red-500 text-[12px]">
                    {String(errors.first_name.message)}
                  </p>
                )}
              </motion.div>
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <Input
                  type="text"
                  label="Last Name"
                  placeholder="Enter your last name"
                  {...register("last_name")}
                  classNames={{
                    base: "w-full",
                    mainWrapper: "h-full",
                    input: "text-small pt-4",
                    inputWrapper: "h-12 font-normal bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg hover:bg-white/90 dark:hover:bg-gray-800/90 ring-1 ring-gray-200 dark:ring-gray-800",
                    label: "text-black/50 dark:text-white/90 font-medium text-small after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-blue-500 after:to-purple-500 after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-300",
                  }}
                />
                {errors.last_name && (
                  <p className="text-red-500 text-[12px]">
                    {String(errors.last_name.message)}
                  </p>
                )}
              </motion.div>
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <Input
                  type="email"
                  label="Email"
                  placeholder="Enter your email"
                  {...register("email")}
                  classNames={{
                    base: "w-full",
                    mainWrapper: "h-full",
                    input: "text-small pt-4",
                    inputWrapper: "h-12 font-normal bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg hover:bg-white/90 dark:hover:bg-gray-800/90 ring-1 ring-gray-200 dark:ring-gray-800",
                    label: "text-black/50 dark:text-white/90 font-medium text-small after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-blue-500 after:to-purple-500 after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-300",
                  }}
                />
                {errors.email && (
                  <p className="text-red-500 text-[12px]">
                    {String(errors.email.message)}
                  </p>
                )}
              </motion.div>
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                <Input
                  label="Password"
                  placeholder="Enter your password"
                  {...register("password")}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? (
                        <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <Eye className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  type={isVisible ? "text" : "password"}
                  classNames={{
                    base: "w-full",
                    mainWrapper: "h-full",
                    input: "text-small pt-4",
                    inputWrapper: "h-12 font-normal bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg hover:bg-white/90 dark:hover:bg-gray-800/90 ring-1 ring-gray-200 dark:ring-gray-800",
                    label: "text-black/50 dark:text-white/90 font-medium text-small after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-blue-500 after:to-purple-500 after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-300",
                  }}
                />
                {errors.password && (
                  <p className="text-red-500 text-[12px]">
                    {String(errors.password.message)}
                  </p>
                )}
              </motion.div>
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-2"
              >
                <Input
                  label="Confirm Password"
                  placeholder="Re-enter your password"
                  {...register("confirmPassword")}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? (
                        <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <Eye className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  type={isVisible ? "text" : "password"}
                  classNames={{
                    base: "w-full",
                    mainWrapper: "h-full",
                    input: "text-small pt-4",
                    inputWrapper: "h-12 font-normal bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg hover:bg-white/90 dark:hover:bg-gray-800/90 ring-1 ring-gray-200 dark:ring-gray-800",
                    label: "text-black/50 dark:text-white/90 font-medium text-small after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-blue-500 after:to-purple-500 after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-300",
                  }}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-[12px]">
                    {String(errors.confirmPassword.message)}
                  </p>
                )}
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="space-y-2"
              >
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Password strength
                </p>
                <Progress
                  value={strength}
                  className="max-w-md"
                  color={
                    strength > 80
                      ? "success"
                      : strength > 50
                      ? "warning"
                      : "danger"
                  }
                />
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="space-y-4"
              >
                <Button
                  color="primary"
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                  startContent={<Cpu className="h-5 w-5" />}
                  isDisabled={loading}
                  size="lg"
                >
                  {loading ? "Creating Account..." : "Sign Up"}
                </Button>
                <p className="text-center text-gray-700 dark:text-gray-300 pt-2">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-blue-500 dark:text-blue-400 hover:underline font-medium"
                  >
                    Sign in
                  </Link>
                </p>
              </motion.div>
            </form>
          </CardBody>
        </Card>
      </motion.div>
      <ToastContainer />
    </div>
  );
}
