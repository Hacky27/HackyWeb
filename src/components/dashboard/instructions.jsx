import { Icon } from "@iconify/react";

const InstructionCardList = () => {
  const instructions = [
    "Click on Generate Credentials button to generate login credentials for your lab. Save them locally!",
    "Click on Lab URL to access the lab using web browser.",
    "Download the VPN config and use it with OpenVPN to access the lab using VPN.",
    "In case your student VM is stuck, use the Reboot VM button to reboot it.",
    "You can use web access or VPN to access the lab. One access method at a time.",
  ];

  return (
    <div className="space-y-4 w-[300px]">
      {instructions.map((text, index) => (
        <div
          key={index}
          className="flex gap-2  items-start bg-gray-50 p-4 border-t-2 border-gray-700  shadow-sm hover:shadow-md cursor-pointer"
        >
          <div className="">
            <Icon
              icon="akar-icons:info-fill"
              width="18"
              height="18"
              className="text-gray-500"
            />
          </div>

          <p className="text-gray-800 text-sm">{text}</p>
        </div>
      ))}
    </div>
  );
};

export default InstructionCardList;
