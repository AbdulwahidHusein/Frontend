"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
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
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function Login() {
  const [isVisible, setIsVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [strength, setStrength] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" }); // State for errors\
  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  useEffect(() => {
    setStrength(Math.min((password.length / 12) * 100, 100));
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ email: "", password: "" }); // Reset errors

    try {
      await validationSchema.validate(
        { email, password },
        { abortEarly: false }
      );

      setIsLoading(true);
      
      // Add timeout to prevent infinite loading
      const loginPromise = signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Login request timed out")), 10000);
      });

      type SignInResponse = {
        error?: string;
        ok?: boolean;
        status?: number;
      };

      const result = await Promise.race([loginPromise, timeoutPromise])
        .catch(error => {
          console.error("Login error:", error);
          return { error: error.message || "An unexpected error occurred" };
        })
        .finally(() => {
          setIsLoading(false);
        }) as SignInResponse;

      if (result?.error) {
        toast.error("Login failed: " + (result.error === "Login request timed out" 
          ? "Cannot connect to the server. Please check your connection and try again." 
          : result.error));
      } else {
        toast.success("Login successful");
        // Add a small delay to ensure the session is set before redirecting
        setTimeout(() => {
          router.push("/careers");
          router.refresh(); // Force a refresh to ensure the new session is picked up
        }, 1000);
      }
    } catch (err: any) {
      setIsLoading(false);
      if (err.inner) {
        const newErrors: Record<string, string> = {};
        err.inner.forEach((validationError: yup.ValidationError) => {
          newErrors[validationError.path!] = validationError.message;
        });
        setErrors({
          email: newErrors.email || "",
          password: newErrors.password || "",
        });
      } else {
        toast.error("An unexpected error occurred");
      }
    }
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
      <ToastContainer />

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
            <h2 className="text-center text-xl font-semibold mb-6 text-gray-800 dark:text-white">Welcome Back!</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <Input
                  type="email"
                  label="Email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  classNames={{
                    base: "w-full",
                    mainWrapper: "h-full",
                    input: "text-small pt-4",
                    inputWrapper: "h-12 font-normal bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg hover:bg-white/90 dark:hover:bg-gray-800/90 ring-1 ring-gray-200 dark:ring-gray-800",
                    label: "text-black/50 dark:text-white/90 font-medium text-small after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-blue-500 after:to-purple-500 after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-300",
                  }}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </motion.div>
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <Input
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                )}
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
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
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <Button
                  color="primary"
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                  startContent={<Cpu className="h-5 w-5" />}
                  isDisabled={isLoading}
                  size="lg"
                >
                  {isLoading ? "Logging in..." : "Sign In"}
                </Button>
                <p className="text-center text-gray-700 dark:text-gray-300 pt-2">
                  Don&apos;t have an account?{" "}
                  <a
                    href="/signup"
                    className="text-blue-500 dark:text-blue-400 hover:underline font-medium"
                  >
                    Sign up
                  </a>
                </p>
              </motion.div>
            </form>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
