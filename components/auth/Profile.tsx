"use client";

import { Profile as ProfileData } from "@/types/types";
import React, { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import {
  FiEdit2,
  FiMapPin,
  FiPhone,
  FiBriefcase,
  FiFileText,
  FiGlobe,
  FiPlus,
} from "react-icons/fi";
import { useSession } from "next-auth/react";

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  value: string;
  onEdit: () => void;
}

const Profile: React.FC = () => {
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editField, setEditField] = useState<keyof ProfileData | "">("");
  const [editValue, setEditValue] = useState<string | string[]>([]);

  const handleEdit = (field: keyof ProfileData, value: string | string[]) => {
    setEditField(field);
    setEditValue(Array.isArray(value) ? [...value] : value);
    onOpen();
  };

  const handleAddInput = () => {
    if (Array.isArray(editValue)) {
      setEditValue([...editValue, ""]);
    }
  };

  const handleInputChange = (index: number, newValue: string) => {
    if (Array.isArray(editValue)) {
      const updatedValues = [...editValue];
      updatedValues[index] = newValue;
      setEditValue(updatedValues);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditValue(e.target.files[0].name);
    }
  };

  const handleSave = () => {
    onClose();
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Avatar
              src={(session?.user.profile as ProfileData)?.profile_image_uri}
              className="w-20 h-20"
            />
            <div>
              <h1 className="text-2xl font-bold">
                {(session?.user.profile as ProfileData)?.user.first_name ||
                  "First Name"}{" "}
                {(session?.user.profile as ProfileData)?.user.last_name ||
                  "Last Name"}
              </h1>
              <p className="text-gray-500">{session?.user?.email}</p>
            </div>
          </div>
          <Button
            color="primary"
            variant="light"
            startContent={<FiEdit2 />}
            onPress={() => {
              if (session && session.user) {
                handleEdit("user", [
                  (session?.user.profile as ProfileData)?.user.first_name || "",
                  (session?.user.profile as ProfileData)?.user.last_name || "",
                  (session?.user.profile as ProfileData)?.profile_image_uri ||
                    "",
                ]);
              }
            }}
          >
            Edit Profile
          </Button>
        </CardHeader>
        <Divider />

        <CardBody className="space-y-6">
          {/* Static Fields */}
          <Section
            title="Work Arrangement"
            icon={<FiMapPin />}
            value={
              (session?.user.profile as ProfileData)
                ?.prefered_work_arrangement || ""
            }
            onEdit={() =>
              handleEdit(
                "prefered_work_arrangement",
                (session?.user.profile as ProfileData)
                  ?.prefered_work_arrangement || ""
              )
            }
          />
          <Section
            title="Resume"
            icon={<FiFileText />}
            value={(session?.user.profile as ProfileData)?.resume_uri || ""}
            onEdit={() =>
              handleEdit(
                "resume_uri",
                (session?.user.profile as ProfileData)?.resume_uri || ""
              )
            }
          />
          {/* Dynamic Fields */}
          <Section
            title="Preferred Tech Stacks"
            icon={<FiBriefcase />}
            value={
              (session?.user.profile as ProfileData)?.prefered_tech_stacks.join(
                ", "
              ) || ""
            }
            onEdit={() =>
              handleEdit(
                "prefered_tech_stacks",
                (session?.user.profile as ProfileData)?.prefered_tech_stacks ||
                  []
              )
            }
          />
          <Section
            title="Preferred Job Types"
            icon={<FiBriefcase />}
            value={
              (session?.user.profile as ProfileData)?.preferred_job_types.join(
                ", "
              ) || ""
            }
            onEdit={() =>
              handleEdit(
                "preferred_job_types",
                (session?.user.profile as ProfileData)?.preferred_job_types ||
                  []
              )
            }
          />
          <Section
            title="Summary"
            icon={<FiFileText />}
            value={
              (session?.user.profile as ProfileData)?.summary_from_resume || ""
            }
            onEdit={() =>
              handleEdit(
                "summary_from_resume",
                (session?.user.profile as ProfileData)?.summary_from_resume ||
                  ""
              )
            }
          />
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Edit {editField}</ModalHeader>
          <ModalBody>
            {editField === "prefered_work_arrangement" ? (
              <select
                value={editValue as string}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="hybrid">Hybrid</option>
                <option value="remote">Remote</option>
                <option value="onSite">On Site</option>
              </select>
            ) : editField === "resume_uri" ? (
              <Input type="file" onChange={handleFileChange} />
            ) : editField === "user" ? (
              <>
                <Input
                  value={(editValue as string[])[0]}
                  onChange={(e) =>
                    setEditValue([
                      e.target.value,
                      (editValue as string[])[1],
                      (editValue as string[])[2],
                    ])
                  }
                  placeholder="First Name"
                />
                <Input
                  value={(editValue as string[])[1]}
                  onChange={(e) =>
                    setEditValue([
                      (editValue as string[])[0],
                      e.target.value,
                      (editValue as string[])[2],
                    ])
                  }
                  placeholder="Last Name"
                />
                <Input type="file" onChange={handleFileChange} />
              </>
            ) : Array.isArray(editValue) ? (
              editValue.map((item, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <Input
                    value={item}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                  />
                  <Button isIconOnly variant="light" onPress={handleAddInput}>
                    <FiPlus />
                  </Button>
                </div>
              ))
            ) : (
              <Textarea
                value={editValue as string}
                onChange={(e) => setEditValue(e.target.value)}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleSave}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

const Section: React.FC<SectionProps> = ({ title, icon, value, onEdit }) => {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start space-x-2">
        <div className="mt-1">{icon}</div>
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-gray-600 whitespace-pre-wrap">{value}</p>
        </div>
      </div>
      <Button isIconOnly variant="light" onPress={onEdit}>
        <FiEdit2 />
      </Button>
    </div>
  );
};

export default Profile;
