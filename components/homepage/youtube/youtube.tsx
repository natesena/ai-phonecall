import Image from "next/image";
import { Band } from "../band";

export const YouTubeSection = () => {
  return (
    <div className="relative w-full px-4 my-[5rem] sm:my-[7rem]">
      <div className="relative w-full max-w-[560px] mx-auto">
        <div className="band-container absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-screen overflow-x-hidden">
          <Band />
        </div>
        <Image
          src="/images/homepage/As-Seen-On-TV-Logo.png"
          alt="Santa on phone"
          width={200}
          height={200}
          className="absolute -top-20 left-0 sm:-left-[100px] z-0 max-w-[150px] sm:max-w-[200px] sm:rotate-[-40deg]"
        />
        <div className="relative aspect-video w-full">
          <iframe
            className="relative z-10 w-full h-full"
            src="https://www.youtube.com/embed/41KB61r7p0w?si=aOAL7e4LxkbDrR0S"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};
