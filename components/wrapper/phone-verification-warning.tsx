'use client'
import Link from "next/link";
import { useUser } from "@/hooks/use-user";
const PhoneVerificationWarning = () => {
    const { user } = useUser();
    if (user?.isPhoneVerified) {
        return null;
    }
    return (
        <div className="flex items-center gap-2 w-screen bg-white text-red-500 text-center py-2 px-[1rem]">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-alert-circle"
            >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p className="text-sm">
                Please verify your phone number before using the app.
            </p>
            <Link href="/verify-phoneno" className="text-sm font-semibold underline">
                Verify Now
            </Link>
        </div>
    );
};

export default PhoneVerificationWarning;