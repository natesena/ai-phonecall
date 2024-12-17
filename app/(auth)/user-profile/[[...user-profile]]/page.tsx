"use client"
import PageWrapper from "@/components/wrapper/page-wrapper";
import config from "@/config";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import Image from "next/image";
const UserProfilePage = () => {
    const router = useRouter()
    const {user} = useUser();

    if (!config?.auth?.enabled) {
        router.back()
    }
    return (
        <PageWrapper >
<section className=" mx-auto">
      <div className="overflow-hidden">
        <div className="h-[30rem] overflow-hidden">
          <Image
          width={1000}
          height={1000}
            src="/images/user-profile/banner.jpg"
            alt="dark"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>
        </PageWrapper>
    )
}


export default UserProfilePage;