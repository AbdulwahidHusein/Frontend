import { Card, CardBody, Button } from "@nextui-org/react";
import AddOne from "./Ads/AddOne";
import AddTwo from "./Ads/AddTwo";

const Ads = () => {
  return (
    <div className=" w-[30%] p-5 pt-10 h-[100%] flex flex-col gap-3 max-lg:hidden">
      <AddOne />
      <AddTwo />
    </div>
  );
};
export default Ads;
