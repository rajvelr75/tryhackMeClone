import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"

  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { TiArrowSortedDown } from "react-icons/ti";
import ThumbsButtons from "./ui/ThumbsButtons";

  

const TopContent = () => {
  return (
    <>
    <div className="bg-metallic-gold">
    <Breadcrumb>
        <BreadcrumbList>
            <BreadcrumbItem className="mt-4 ml-4">
                <BreadcrumbLink href="/" >Learn</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="mt-5"/>
            <BreadcrumbItem>
                <BreadcrumbLink href="/components" className="mt-5">Sample VAPT</BreadcrumbLink>
            </BreadcrumbItem>
        </BreadcrumbList>
    </Breadcrumb>
        <div className="flex sm:flex-row flex-col items-center">
            <img src="src/assets/linux.png" alt="linux" className="w-32 mt-14 mb-5 sm:mb-16 sm:ml-4"/>
            <div className="ml-4">
                <h1 className="text-4xl text-center sm:text-left mb-4 sm:mb-12">Linux Fundamentals Part 1</h1>
                <h6 className="text-center sm:text-left relative sm:bottom-8   ">Embark on the journey of learning the fundamentals of Linux. Learn to run some of the first essential commands on an interactive terminal.</h6>
            </div>
        </div>
        <div className="flex flex-row items-center sm:items-start justify-center sm:justify-start">
            <DropdownMenu>
            <DropdownMenuTrigger className="flex flex-row border border-black relative sm:bottom-12 sm:left-40 w-16 h-8 pl-1">Help<TiArrowSortedDown className="relative top-2 left-1"/>  </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>Video Solutions</DropdownMenuItem>
                    <DropdownMenuItem>Write Ups</DropdownMenuItem>
                    <DropdownMenuItem>Knowledge Base</DropdownMenuItem>
                    <DropdownMenuItem>Ask Community</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <div className="sm:ml-48 relative sm:bottom-14 pl-4 sm:pl-0">
                <ThumbsButtons/>
            </div>
        </div>
    </div>
    </>
  )
}

export default TopContent