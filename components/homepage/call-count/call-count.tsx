import { formatNumber } from "@/lib/utils"; // Assuming formatNumber is in utils
import prisma from "@/lib/prisma"; // Assuming this is your Prisma client import

async function CallCount() {
  async function getCallCount() {
    try {
      const count = await prisma.call.count();
      return count;
    } catch (error) {
      console.error("Failed to get call count:", error);
      return 1000000; // Fallback number
    }
  }

  const count = await getCallCount();

  return (
    <p className="lobster-regular text-center text-5xl text-white mx-auto relative z-10 my-[1rem] sm:my-[7rem] px-4 mb-16">
      {formatNumber(count)} calls and counting!
    </p>
  );
}

export default CallCount;
