import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
const accordionItems = [
  {
    value: "item-1",
    icon: "fluent:apps-list-detail-32-regular",
    title: "Product Details",
    links: [
      { href: "/admin/product/list", text: "All Products" },
      { href: "/admin/product/add", text: "Add Product" },
    ],
  },
  {
    value: "item-2",
    icon: "icomoon-free:lab",
    title: "Lab Manual",
    links: [
      { href: "/admin/labmanual/list", text: "All Lab Manual" },
      { href: "/admin/labmanual/add", text: "Add Lab Manual" },
    ],
  },
  {
    value: "item-3",
    icon: "material-symbols:map-search-outline",
    title: "Flag",
    links: [
      { href: "/admin/flag/list", text: "All Flag" },
      { href: "/admin/flag/add", text: "Add Flag" },
    ],
  },
  {
    value: "item-4",
    icon: "tdesign:video-filled",
    title: "Course Videos",
    links: [
      { href: "/admin/coursevideos/list", text: "All Course Videos" },
      { href: "/admin/coursevideos/add", text: "Add Course Videos" },
    ],
  },
  {
    value: "item-5",
    icon: "mingcute:drive-fill",
    title: "Course Material",
    links: [
      { href: "/admin/coursematerial/list", text: "All Course Material" },
      { href: "/admin/coursematerial/add", text: "Add Course Material" },
    ],
  },
  {
    value: "item-6",
    icon: "wpf:faq",
    title: "Faqs",
    links: [
      { href: "/admin/faqs/list", text: "All Faqs" },
      { href: "/admin/faqs/add", text: "Add Faqs" },
    ],
  },
  {
    value: "item-7",
    icon: "lsicon:order-outline",
    title: "All Orders",
    links: [
      { href: "/admin/alluserspurchases/list", text: "All Orders" },
    
    ],
  },
  
];
const AdminSidebar = () => {
  return (
    <aside className="w-64 h-screen  overflow-scroll bg-customDark text-white  space-y-6 scrollbar-hide">
      <nav>
        <div className="bg-customDark  py-3">
          <Link href="#">
            <Image
              width={200}
              height={100}
              src="/logos1.jpg"
              alt="Logo"
              className="h-[60px]  ml-3"
            />
          </Link>{" "}
        </div>
        <ul className="space-y-2 p-3 mb-20 font-semibold">
          <Accordion type="single" collapsible>
            {accordionItems.map(({ value, icon, title, links }) => (
              <AccordionItem key={value} value={value} className="border-0">
                <AccordionTrigger>
                  <div className="flex font-semibold items-center gap-2 p-2 rounded-3xl transition-all duration-300 ease-in-out">
                    <Icon className="text-customgreen" icon={icon} width="28" />
                    {title}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-2 ">
                  <ul className="px-3">
                    {links.map(({ href, text }, index) => (
                      <li
                        key={href}
                        className="text-gray-200 text-xs ml-4 mb-3  hover:underline cursor-pointer"
                      >
                        <Link href={href}>{text}</Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        
          <li>
            <Link
              href="/admin/exam"
              className="flex group  items-center gap-2 p-2  rounded-xl hover:bg-customgreen transition-all duration-300 ease-in-out"
            >
              <Icon
                className="text-customgreen group-hover:text-white"
                icon="healthicons:i-exam-multiple-choice-outline"
                width="28"
              />
              Exam
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
