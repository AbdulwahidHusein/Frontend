import { Card, CardBody } from "@nextui-org/react";

const AddTwo = () => {
  return (
    <Card className="relative overflow-hidden rounded-lg shadow-lg transform  transition-transform duration-300 ease-in-out bg-black">
      <CardBody className="relative h-64 flex items-center justify-center">
        {/* Placeholder Image */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black opacity-70"></div>

        {/* Play Button */}
        <div className="absolute z-10 flex flex-col items-center justify-center text-white">
          <div className="bg-white rounded-full p-3 animate-pulse">
            <svg
              className="w-10 h-10 text-purple-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M6.5 3.5A1.5 1.5 0 015 5v10a1.5 1.5 0 002.366 1.22l8.634-5a1.5 1.5 0 000-2.44l-8.634-5A1.5 1.5 0 016.5 3.5z" />
            </svg>
          </div>
          <p className="mt-4 font-bold text-xl">Watch Our Story</p>
          <p className="text-sm text-gray-300">
            Discover what we offer in a minute
          </p>
        </div>
      </CardBody>
    </Card>
  );
};
export default AddTwo;
