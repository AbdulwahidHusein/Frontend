import React from "react";
import { Card, CardBody, Button } from "@nextui-org/react";

const AddOne = () => {
  return (
    <Card className="py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg shadow-lg">
      <CardBody className="flex flex-col items-center justify-center py-10 space-y-4">
        <h4 className="font-bold text-2xl text-center">
          Reach Your Audience Here!
        </h4>
        <p className="text-center text-sm max-w-xs">
          Promote your brand, products, or services to thousands of engaged
          viewers.
        </p>
        <Button color="primary" className="bg-white text-purple-500 font-bold">
          Contact Us
        </Button>
      </CardBody>
    </Card>
  );
};

export default AddOne;
