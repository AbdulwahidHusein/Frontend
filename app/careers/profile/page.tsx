"use client";
import { MultiValue } from "react-select";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import React, { useEffect, useState } from "react";
import {
  NextUIProvider,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Radio,
  RadioGroup,
  Button,
  Progress,
  Card,
  CardBody,
  Textarea,
  Avatar,
  Tabs,
  Tab,
  Chip,
  Divider,
} from "@nextui-org/react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import {
  FaGlobe,
  FaPhone,
  FaCity,
  FaImage,
  FaBriefcase,
  FaFileAlt,
  FaUser,
  FaGraduationCap,
  FaCode,
  FaCog,
  FaGithub,
  FaLinkedin,
  FaMapMarkerAlt,
  FaEnvelope,
  FaFileUpload,
  FaTimes,
} from "react-icons/fa";
import { AppDispatch, RootState } from "@/lib/store";
import {
  createProfileAsync,
  getProfileAsync,
} from "@/lib/features/createProfile";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { UserProfile } from "@/types/types";

interface TechOption {
  value: string;
  label: string;
}

interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

const commonInputClasses = {
  base: "w-full",
  mainWrapper: "h-full",
  input: "text-base bg-white dark:bg-gray-800 pt-0",
  label: "text-sm font-medium text-gray-700 dark:text-gray-300",
  inputWrapper: "h-11 font-normal bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 rounded-lg transition-colors data-[focus=true]:!border-blue-500 data-[focus=true]:ring-2 data-[focus=true]:ring-blue-500/20 !outline-none",
};

const commonTextareaClasses = {
  base: "w-full",
  label: "text-sm font-medium text-gray-700 dark:text-gray-300",
  input: "text-base resize-y min-h-[100px] bg-white dark:bg-gray-800 pt-0",
  inputWrapper: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 rounded-lg transition-colors data-[focus=true]:!border-blue-500 data-[focus=true]:ring-2 data-[focus=true]:ring-blue-500/20 !outline-none",
};

export default function ProfilePage(): React.ReactElement {
  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();
  const { loading, success, error } = useSelector((state: RootState) => state.profile);
  const userProfile = useSelector((state: RootState) => state.profile.userProfile) as UserProfile;
  
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState<FormData>(new FormData());
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [resumeFile, setResumeFile] = useState<string>("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [formState, setFormState] = useState({
    first_name: '',
    last_name: '',
    title: '',
    location: '',
    phone_number: '',
    email: '',
    bio: ''
  });
  const [selectedWorkArrangement, setSelectedWorkArrangement] = useState<string[]>(
    userProfile?.prefered_work_arrangement ? [userProfile.prefered_work_arrangement] : []
  );
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>(
    userProfile?.preferred_job_types || []
  );
  const [isExpanded, setIsExpanded] = useState(false);
  
  useEffect(() => {
    if (session?.user?.accessToken) {
      dispatch(getProfileAsync(session.user.accessToken));
    }
  }, [session, dispatch]);

  useEffect(() => {
    if (userProfile) {
      setExperiences(userProfile.experiences || []);
      setEducation(userProfile.education || []);
      setSelectedSkills(userProfile.prefered_tech_stacks || []);
      setSelectedWorkArrangement(userProfile.prefered_work_arrangement ? [userProfile.prefered_work_arrangement] : []);
      setSelectedJobTypes(userProfile.preferred_job_types || []);
      
      // Update form state with profile data, properly handling nested user data
      setFormState({
        first_name: userProfile.user?.first_name || '',
        last_name: userProfile.user?.last_name || '',
        title: userProfile.title || '',
        location: userProfile.location || '',
        phone_number: userProfile.phone_number || '',  // Note: backend uses phone_number
        email: userProfile.user?.email || '',
        bio: userProfile.bio || ''
      });
      
      // Initialize form data with existing profile data
      const initialFormData = new FormData();
      
      // Handle nested user data
      if (userProfile.user) {
        initialFormData.set('first_name', userProfile.user.first_name || '');
        initialFormData.set('last_name', userProfile.user.last_name || '');
        initialFormData.set('email', userProfile.user.email || '');
      }
      
      // Handle other profile fields
      Object.entries(userProfile).forEach(([key, value]) => {
        if (key !== 'user' && value !== null && value !== undefined) {
          if (Array.isArray(value) || typeof value === 'object') {
            initialFormData.set(key, JSON.stringify(value));
          } else {
            initialFormData.set(key, value.toString());
          }
        }
      });
      
      setFormData(initialFormData);

      // Set preview image if profile image exists
      if (userProfile.profile_image_uri) {
        setPreviewImage(userProfile.profile_image_uri);
      }
      
      // Set resume file name if resume exists
      if (userProfile.resume_uri) {
        const resumeName = userProfile.resume_uri.split('/').pop();
        setResumeFile(resumeName || '');
      }
    }
  }, [userProfile]);

  const handleInputChange = (field: string, value: string | string[] | Experience[] | Education[]) => {
    // Update form state for text inputs
    if (typeof value === 'string' && field in formState) {
      setFormState(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Update form data
    const updatedFormData = new FormData();
    formData.forEach((value, key) => {
      if (key !== field) {
        updatedFormData.append(key, value);
      }
    });
    
    if (Array.isArray(value)) {
      updatedFormData.set(field, JSON.stringify(value));
    } else {
      updatedFormData.set(field, value);
    }
    setFormData(updatedFormData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile_image' | 'resume') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'profile_image') {
          setPreviewImage(reader.result as string);
        } else {
          setResumeFile(file.name);
        }
      };
      reader.readAsDataURL(file);
      
    const updatedFormData = new FormData();
    formData.forEach((value, key) => {
      updatedFormData.append(key, value);
    });
      updatedFormData.set(type, file);
    setFormData(updatedFormData);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.accessToken) {
      toast.error("Please login to update your profile");
      return;
    }

    try {
      const result = await dispatch(createProfileAsync({
        formData,
        token: session.user.accessToken,
        isCreate: !userProfile || userProfile.profile_does_not_exist
      })).unwrap();
      
      toast.success("Profile updated successfully!");
      
      // Update local state with the returned data, properly handling nested user data
      if (result) {
        setFormState({
          first_name: result.user?.first_name || '',
          last_name: result.user?.last_name || '',
          title: result.title || '',
          location: result.location || '',
          phone_number: result.phone_number || '',  // Note: backend uses phone_number
          email: result.user?.email || '',
          bio: result.bio || ''
        });
      }
      
      // Fetch updated profile data
      await dispatch(getProfileAsync(session.user.accessToken));
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const techOptions: TechOption[] = [
    // Frontend
    { value: "react", label: "React" },
    { value: "vue", label: "Vue.js" },
    { value: "angular", label: "Angular" },
    { value: "nextjs", label: "Next.js" },
    { value: "nuxtjs", label: "Nuxt.js" },
    { value: "svelte", label: "Svelte" },
    { value: "gatsby", label: "Gatsby" },
    { value: "typescript", label: "TypeScript" },
    { value: "javascript", label: "JavaScript" },
    { value: "html5", label: "HTML5" },
    { value: "css3", label: "CSS3" },
    { value: "sass", label: "SASS/SCSS" },
    { value: "tailwind", label: "Tailwind CSS" },
    { value: "bootstrap", label: "Bootstrap" },
    { value: "materialui", label: "Material-UI" },
    { value: "styledcomponents", label: "Styled Components" },
    { value: "webpack", label: "Webpack" },
    { value: "vite", label: "Vite" },
    { value: "pwa", label: "Progressive Web Apps" },
    { value: "webgl", label: "WebGL" },

    // Backend
    { value: "nodejs", label: "Node.js" },
    { value: "express", label: "Express.js" },
    { value: "nestjs", label: "NestJS" },
    { value: "python", label: "Python" },
    { value: "django", label: "Django" },
    { value: "flask", label: "Flask" },
    { value: "fastapi", label: "FastAPI" },
    { value: "java", label: "Java" },
    { value: "spring", label: "Spring Boot" },
    { value: "csharp", label: "C#" },
    { value: "dotnet", label: ".NET Core" },
    { value: "php", label: "PHP" },
    { value: "laravel", label: "Laravel" },
    { value: "symfony", label: "Symfony" },
    { value: "ruby", label: "Ruby" },
    { value: "rails", label: "Ruby on Rails" },
    { value: "golang", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "elixir", label: "Elixir" },
    { value: "phoenix", label: "Phoenix Framework" },

    // Database
    { value: "postgresql", label: "PostgreSQL" },
    { value: "mysql", label: "MySQL" },
    { value: "mongodb", label: "MongoDB" },
    { value: "redis", label: "Redis" },
    { value: "elasticsearch", label: "Elasticsearch" },
    { value: "cassandra", label: "Cassandra" },
    { value: "graphql", label: "GraphQL" },
    { value: "prisma", label: "Prisma" },
    { value: "sequelize", label: "Sequelize" },
    { value: "typeorm", label: "TypeORM" },

    // DevOps & Cloud
    { value: "docker", label: "Docker" },
    { value: "kubernetes", label: "Kubernetes" },
    { value: "aws", label: "AWS" },
    { value: "azure", label: "Azure" },
    { value: "gcp", label: "Google Cloud" },
    { value: "terraform", label: "Terraform" },
    { value: "jenkins", label: "Jenkins" },
    { value: "gitlab", label: "GitLab CI/CD" },
    { value: "github_actions", label: "GitHub Actions" },
    { value: "ansible", label: "Ansible" },
    { value: "nginx", label: "NGINX" },
    { value: "linux", label: "Linux" },

    // Testing
    { value: "jest", label: "Jest" },
    { value: "cypress", label: "Cypress" },
    { value: "selenium", label: "Selenium" },
    { value: "puppeteer", label: "Puppeteer" },
    { value: "mocha", label: "Mocha" },
    { value: "chai", label: "Chai" },
    { value: "junit", label: "JUnit" },
    { value: "pytest", label: "PyTest" },

    // Mobile Development
    { value: "react_native", label: "React Native" },
    { value: "flutter", label: "Flutter" },
    { value: "swift", label: "Swift" },
    { value: "kotlin", label: "Kotlin" },
    { value: "xamarin", label: "Xamarin" },

    // State Management
    { value: "redux", label: "Redux" },
    { value: "mobx", label: "MobX" },
    { value: "recoil", label: "Recoil" },
    { value: "zustand", label: "Zustand" },
    { value: "context_api", label: "Context API" },

    // API & Integration
    { value: "rest_api", label: "REST API" },
    { value: "soap", label: "SOAP" },
    { value: "websocket", label: "WebSocket" },
    { value: "grpc", label: "gRPC" },
    { value: "oauth", label: "OAuth" },
    { value: "jwt", label: "JWT" },

    // Tools & Platforms
    { value: "git", label: "Git" },
    { value: "jira", label: "Jira" },
    { value: "figma", label: "Figma" },
    { value: "adobe_xd", label: "Adobe XD" },
    { value: "postman", label: "Postman" },
    { value: "swagger", label: "Swagger" },

    // AI & ML
    { value: "tensorflow", label: "TensorFlow" },
    { value: "pytorch", label: "PyTorch" },
    { value: "scikit_learn", label: "Scikit-learn" },
    { value: "opencv", label: "OpenCV" },
    { value: "pandas", label: "Pandas" },
    { value: "numpy", label: "NumPy" },

    // Security
    { value: "owasp", label: "OWASP" },
    { value: "penetration_testing", label: "Penetration Testing" },
    { value: "encryption", label: "Encryption" },
    { value: "authentication", label: "Authentication" },
    { value: "authorization", label: "Authorization" },
  ];

  return (
    <NextUIProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 pb-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          {/* Profile Header */}
          <Card className="w-full mb-6 shadow-lg">
            <CardBody className="flex flex-col md:flex-row items-center gap-6 p-4 md:p-6">
              <div className="relative group">
                <Avatar
                  src={previewImage || userProfile?.profile_image_uri || "/default-avatar.png"}
                  className="w-24 h-24 md:w-32 md:h-32 text-large"
                />
                <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
                  <FaFileUpload className="text-white text-2xl" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'profile_image')}
                  />
                </label>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-xl md:text-2xl font-bold mb-2">
                  {userProfile?.user?.first_name} {userProfile?.user?.last_name}
                </h1>
                <div className="mb-4">
                  <div className="relative max-w-2xl mx-auto md:mx-0">
                    <div className={`relative ${!isExpanded ? 'max-h-24 md:max-h-28' : ''} overflow-hidden`}>
                      <p className="text-gray-600 text-sm md:text-base bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg backdrop-blur-sm">
                        {userProfile?.summary_from_resume || "Your professional summary will appear here after uploading your resume"}
                      </p>
                      {!isExpanded && userProfile?.summary_from_resume && (
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-gray-800"></div>
                      )}
                    </div>
                    {userProfile?.summary_from_resume && (
                      <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-2 text-blue-500 hover:text-blue-600 text-sm font-medium focus:outline-none transition-colors duration-200"
                      >
                        {isExpanded ? 'Show Less' : 'Read More'}
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {userProfile?.github_url && (
                    <a href={userProfile.github_url} target="_blank" rel="noopener noreferrer">
                      <Button isIconOnly variant="light" aria-label="GitHub">
                        <FaGithub className="text-xl" />
                      </Button>
                    </a>
                  )}
                  {userProfile?.linkedin_url && (
                    <a href={userProfile.linkedin_url} target="_blank" rel="noopener noreferrer">
                      <Button isIconOnly variant="light" aria-label="LinkedIn">
                        <FaLinkedin className="text-xl" />
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Profile Tabs */}
          <Card className="w-full shadow-lg">
            <Tabs
              aria-label="Profile sections"
              selectedKey={activeTab}
              onSelectionChange={(key) => setActiveTab(key as string)}
              className="p-0"
              classNames={{
                base: "w-full",
                tabList: "gap-2 md:gap-6 w-full relative rounded-none p-0 border-b border-divider overflow-x-auto flex-nowrap",
                cursor: "w-full bg-gradient-to-r from-blue-500 to-purple-500",
                tab: "max-w-fit px-2 md:px-4 h-12 flex-shrink-0",
                tabContent: "group-data-[selected=true]:text-blue-500 text-xs md:text-sm whitespace-nowrap",
                panel: "p-2 md:p-6"
              }}
            >
              <Tab
                key="personal"
                title={
                  <div className="flex items-center space-x-1 md:space-x-2">
                    <FaUser className="text-sm md:text-base" />
                    <span>Personal</span>
                  </div>
                }
              >
                <CardBody className="py-6">
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        First Name
                      </label>
                      <Input
                        placeholder="Enter your first name"
                        value={formState.first_name}
                        onChange={(e) => handleInputChange("first_name", e.target.value)}
                        classNames={commonInputClasses}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Last Name
                      </label>
                      <Input
                        placeholder="Enter your last name"
                        value={formState.last_name}
                        onChange={(e) => handleInputChange("last_name", e.target.value)}
                        classNames={commonInputClasses}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Resume
                      </label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileChange(e, 'resume')}
                          classNames={commonInputClasses}
                        />
                        {resumeFile && (
                          <span className="text-sm text-gray-600">{resumeFile}</span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Location
                      </label>
                      <Input
                        placeholder="City, Country"
                        value={formState.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        startContent={<FaMapMarkerAlt className="text-gray-400" />}
                        classNames={commonInputClasses}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone
                      </label>
                      <Input
                        placeholder="Your phone number"
                        value={formState.phone_number}
                        onChange={(e) => handleInputChange("phone_number", e.target.value)}
                        startContent={<FaPhone className="text-gray-400" />}
                        classNames={commonInputClasses}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email
                      </label>
                      <Input
                        placeholder="Your email address"
                        value={formState.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        startContent={<FaEnvelope className="text-gray-400" />}
                        classNames={commonInputClasses}
                      />
                    </div>
                    <div className="col-span-full space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Bio
                      </label>
                      <Textarea
                        placeholder="Tell us about yourself"
                        value={formState.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        classNames={commonTextareaClasses}
                      />
                    </div>
                    <div className="col-span-full">
                      <Button
                        type="submit"
                        color="primary"
                        className="w-full md:w-auto"
                        isLoading={loading}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </CardBody>
              </Tab>

              <Tab
                key="experience"
                title={
                  <div className="flex items-center space-x-1 md:space-x-2">
                    <FaBriefcase className="text-sm md:text-base" />
                    <span>Experience</span>
                  </div>
                }
              >
                <CardBody className="py-6">
                  <div className="space-y-6">
                    {experiences.map((exp, index) => (
                      <Card key={index} className="p-4 bg-white dark:bg-gray-800 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-semibold">Experience {index + 1}</h3>
                          <Button
                            isIconOnly
                            color="danger"
                            variant="light"
                            onClick={() => {
                              const newExperiences = [...experiences];
                              newExperiences.splice(index, 1);
                              setExperiences(newExperiences);
                              handleInputChange("experiences", newExperiences);
                            }}
                          >
                            <FaTimes />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            placeholder="Company name"
                            value={exp.company}
                            onChange={(e) => {
                              const newExperiences = [...experiences];
                              newExperiences[index].company = e.target.value;
                              setExperiences(newExperiences);
                              handleInputChange("experiences", newExperiences);
                            }}
                            classNames={commonInputClasses}
                          />
                          <Input
                            placeholder="Job title"
                            value={exp.position}
                            onChange={(e) => {
                              const newExperiences = [...experiences];
                              newExperiences[index].position = e.target.value;
                              setExperiences(newExperiences);
                              handleInputChange("experiences", newExperiences);
                            }}
                            classNames={commonInputClasses}
                          />
                          <Input
                            type="date"
                            value={exp.startDate}
                            onChange={(e) => {
                              const newExperiences = [...experiences];
                              newExperiences[index].startDate = e.target.value;
                              setExperiences(newExperiences);
                              handleInputChange("experiences", newExperiences);
                            }}
                            classNames={commonInputClasses}
                          />
                          <Input
                            type="date"
                            value={exp.endDate}
                            onChange={(e) => {
                              const newExperiences = [...experiences];
                              newExperiences[index].endDate = e.target.value;
                              setExperiences(newExperiences);
                              handleInputChange("experiences", newExperiences);
                            }}
                            classNames={commonInputClasses}
                          />
                          <div className="col-span-full">
                            <Textarea
                              placeholder="Describe your responsibilities and achievements"
                              value={exp.description}
                              onChange={(e) => {
                                const newExperiences = [...experiences];
                                newExperiences[index].description = e.target.value;
                                setExperiences(newExperiences);
                                handleInputChange("experiences", newExperiences);
                              }}
                              classNames={commonTextareaClasses}
                            />
                          </div>
                        </div>
                      </Card>
                    ))}

                    <Button
                      color="primary"
                      variant="flat"
                      className="w-full"
                      onClick={() => {
                        const newExperiences = [
                          ...experiences,
                          {
                            company: "",
                            position: "",
                            startDate: "",
                            endDate: "",
                            description: "",
                          },
                        ];
                        setExperiences(newExperiences);
                        handleInputChange("experiences", newExperiences);
                      }}
                    >
                      Add Experience
                    </Button>

                    {experiences.length === 0 && (
                      <div className="text-center py-8">
                        <FaBriefcase className="mx-auto text-4xl text-gray-400 mb-3" />
                        <p className="text-gray-500">No experience added yet</p>
                        <p className="text-sm text-gray-400">
                          Click the button above to add your work experience
                        </p>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Tab>

              <Tab
                key="education"
                title={
                  <div className="flex items-center space-x-1 md:space-x-2">
                    <FaGraduationCap className="text-sm md:text-base" />
                    <span>Education</span>
                  </div>
                }
              >
                <CardBody className="py-6">
                  <div className="space-y-6">
                    {education.map((edu, index) => (
                      <Card key={index} className="p-4 bg-white dark:bg-gray-800 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-semibold">Education {index + 1}</h3>
                          <Button
                            isIconOnly
                            color="danger"
                            variant="light"
                            onClick={() => {
                              const newEducation = [...education];
                              newEducation.splice(index, 1);
                              setEducation(newEducation);
                              handleInputChange("education", newEducation);
                            }}
                          >
                            <FaTimes />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            placeholder="School name"
                            value={edu.school}
                            onChange={(e) => {
                              const newEducation = [...education];
                              newEducation[index].school = e.target.value;
                              setEducation(newEducation);
                              handleInputChange("education", newEducation);
                            }}
                            classNames={commonInputClasses}
                          />
                          <Input
                            placeholder="e.g. Bachelor's, Master's"
                            value={edu.degree}
                            onChange={(e) => {
                              const newEducation = [...education];
                              newEducation[index].degree = e.target.value;
                              setEducation(newEducation);
                              handleInputChange("education", newEducation);
                            }}
                            classNames={commonInputClasses}
                          />
                          <Input
                            placeholder="e.g. Computer Science"
                            value={edu.field}
                            onChange={(e) => {
                              const newEducation = [...education];
                              newEducation[index].field = e.target.value;
                              setEducation(newEducation);
                              handleInputChange("education", newEducation);
                            }}
                            classNames={commonInputClasses}
                          />
                          <Input
                            type="date"
                            value={edu.startDate}
                            onChange={(e) => {
                              const newEducation = [...education];
                              newEducation[index].startDate = e.target.value;
                              setEducation(newEducation);
                              handleInputChange("education", newEducation);
                            }}
                            classNames={commonInputClasses}
                          />
                          <Input
                            type="date"
                            value={edu.endDate}
                            onChange={(e) => {
                              const newEducation = [...education];
                              newEducation[index].endDate = e.target.value;
                              setEducation(newEducation);
                              handleInputChange("education", newEducation);
                            }}
                            classNames={commonInputClasses}
                          />
                        </div>
                      </Card>
                    ))}

                    <Button
                      color="primary"
                      variant="flat"
                      className="w-full"
                      onClick={() => {
                        const newEducation = [
                          ...education,
                          {
                            school: "",
                            degree: "",
                            field: "",
                            startDate: "",
                            endDate: "",
                          },
                        ];
                        setEducation(newEducation);
                        handleInputChange("education", newEducation);
                      }}
                    >
                      Add Education
                    </Button>

                    {education.length === 0 && (
                      <div className="text-center py-8">
                        <FaGraduationCap className="mx-auto text-4xl text-gray-400 mb-3" />
                        <p className="text-gray-500">No education added yet</p>
                        <p className="text-sm text-gray-400">
                          Click the button above to add your education
                        </p>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Tab>

              <Tab
                key="skills"
                title={
                  <div className="flex items-center space-x-1 md:space-x-2">
                    <FaCode className="text-sm md:text-base" />
                    <span>Skills</span>
                  </div>
                }
              >
                <CardBody className="py-6">
                  <div className="space-y-6">
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Professional Title
                        </label>
                        <Input
                          placeholder="e.g. Senior Software Engineer"
                          value={formState.title}
                          onChange={(e) => handleInputChange("title", e.target.value)}
                          classNames={commonInputClasses}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          This title will appear at the top of your profile
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Technical Skills
                      </label>
                      <Select
                        isMulti
                        name="tech_skills"
                        options={techOptions}
                        value={selectedSkills.map(skill => ({ value: skill, label: skill }))}
                        onChange={(newValue: MultiValue<TechOption>) => {
                          const skills = newValue.map(option => option.value);
                          setSelectedSkills(skills);
                          handleInputChange("prefered_tech_stacks", skills);
                        }}
                        className="mb-4"
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            backgroundColor: 'white',
                            borderColor: state.isFocused ? '#3b82f6' : '#e5e7eb',
                            borderWidth: '2px',
                            borderRadius: '0.5rem',
                            minHeight: '2.75rem',
                            boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.4)' : 'none',
                            '&:hover': {
                              borderColor: '#3b82f6'
                            },
                            outline: 'none',
                            '&:focus': {
                              outline: 'none',
                              boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.4)'
                            }
                          }),
                          menu: (baseStyles) => ({
                            ...baseStyles,
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            zIndex: 1000
                          }),
                          menuList: (baseStyles) => ({
                            ...baseStyles,
                            padding: '0.5rem'
                          }),
                          option: (baseStyles, { isFocused, isSelected }) => ({
                            ...baseStyles,
                            backgroundColor: isSelected 
                              ? '#3b82f6' 
                              : isFocused 
                                ? '#dbeafe' 
                                : 'white',
                            color: isSelected ? 'white' : '#374151',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.25rem',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: '#dbeafe',
                              color: '#374151'
                            }
                          }),
                          multiValue: (baseStyles) => ({
                            ...baseStyles,
                            backgroundColor: '#e5e7eb',
                            borderRadius: '0.25rem',
                            padding: '0.125rem'
                          }),
                          multiValueLabel: (baseStyles) => ({
                            ...baseStyles,
                            color: '#374151',
                            fontSize: '0.875rem',
                            padding: '0.125rem 0.25rem'
                          }),
                          multiValueRemove: (baseStyles) => ({
                            ...baseStyles,
                            color: '#374151',
                            '&:hover': {
                              backgroundColor: '#d1d5db',
                              color: '#1f2937'
                            }
                          }),
                          placeholder: (baseStyles) => ({
                            ...baseStyles,
                            color: '#9ca3af'
                          }),
                          input: (baseStyles) => ({
                            ...baseStyles,
                            color: '#374151',
                            outline: 'none',
                            '&:focus': {
                              outline: 'none'
                            }
                          })
                        }}
                        placeholder="Select your technical skills"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Preferred Work Arrangements
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {["Remote", "Hybrid", "On-site"].map((arrangement) => {
                          const isSelected = selectedWorkArrangement.includes(arrangement.toLowerCase());
                          return (
                            <Chip
                              key={arrangement}
                              variant={isSelected ? "solid" : "bordered"}
                              classNames={{
                                base: `cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                                  isSelected 
                                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-none" 
                                    : "hover:border-blue-500 hover:text-blue-500"
                                }`,
                                content: "font-semibold",
                              }}
                              onClick={() => {
                                const arrangementLower = arrangement.toLowerCase();
                                const newArrangements = isSelected
                                  ? selectedWorkArrangement.filter(arr => arr !== arrangementLower)
                                  : [...selectedWorkArrangement, arrangementLower];
                                setSelectedWorkArrangement(newArrangements);
                                const updatedFormData = new FormData();
                                formData.forEach((value, key) => {
                                  updatedFormData.append(key, value);
                                });
                                updatedFormData.set("prefered_work_arrangement", JSON.stringify(newArrangements));
                                setFormData(updatedFormData);
                              }}
                            >
                              {arrangement}
                            </Chip>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Preferred Job Types
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {["Full-time", "Part-time", "Contract", "Internship"].map((jobType) => {
                          const isSelected = selectedJobTypes.includes(jobType.toLowerCase());
                          return (
                            <Chip
                              key={jobType}
                              variant={isSelected ? "solid" : "bordered"}
                              classNames={{
                                base: `cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                                  isSelected 
                                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-none" 
                                    : "hover:border-blue-500 hover:text-blue-500"
                                }`,
                                content: "font-semibold",
                              }}
                              onClick={() => {
                                const jobTypeLower = jobType.toLowerCase();
                                const newTypes = isSelected
                                  ? selectedJobTypes.filter(type => type !== jobTypeLower)
                                  : [...selectedJobTypes, jobTypeLower];
                                setSelectedJobTypes(newTypes);
                                const updatedFormData = new FormData();
                                formData.forEach((value, key) => {
                                  updatedFormData.append(key, value);
                                });
                                updatedFormData.set("preferred_job_types", JSON.stringify(newTypes));
                                setFormData(updatedFormData);
                              }}
                            >
                              {jobType}
                            </Chip>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        color="primary"
                        className="w-full md:w-auto"
                        isLoading={loading}
                        onClick={handleSubmit}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Tab>
            </Tabs>
          </Card>

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <Button
              color="primary"
              size="lg"
              onClick={handleSubmit}
              isLoading={loading}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold"
            >
              Save Changes
            </Button>
          </div>
        </motion.div>
        <ToastContainer />
      </div>
    </NextUIProvider>
  );
}
