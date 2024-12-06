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
          className={`
            absolute z-0
            ${[
              "left-[-30px] max-w-[150px] rotate-[-20deg] -top-[80px]", // mobile styles with 10 degrees rotation
              "sm:-left-[100px] sm:max-w-[200px] sm:rotate-[-40deg] sm:-top-20", // desktop styles
            ].join(" ")}
          `}
        />
        <div className="relative aspect-video w-full">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>
      <h2 className="lobster-regular text-center text-4xl sm:text-6xl text-white mx-auto mt-8 sm:mt-12 px-4 [text-shadow:_2px_2px_0_rgb(0_0_0_/_40%)]">
        The world&apos;s first Santa powered by{" "}
        <span className="font-arial font-bold text-6xl">AI</span>
      </h2>
    </div>
  );
};
