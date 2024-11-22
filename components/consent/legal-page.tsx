"use client";
import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { Checkbox } from "@/components/ui/checkbox";

interface LegalVersion {
  version: string;
  lastUpdated: string;
  content: string;
}

interface LegalPageProps {
  currentVersion: LegalVersion;
  type: "terms" | "privacy";
}

export default function LegalPage({ currentVersion, type }: LegalPageProps) {
  const { userId } = useAuth();
  const [localConsent, setLocalConsent] = useState(false);

  useEffect(() => {
    if (userId) {
      checkConsentStatus();
    }
  }, [userId, type, currentVersion.version]);

  async function checkConsentStatus() {
    try {
      const response = await fetch(
        `/api/consent/check?version=${currentVersion.version}&type=${type}`
      );
      const data = await response.json();
      if (data.consent) {
        setLocalConsent(true);
      }
    } catch (error) {
      console.error("Error checking consent status:", error);
    }
  }

  const handleConsent = async () => {
    try {
      const response = await fetch("/api/consent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          version: currentVersion.version,
        }),
      });

      if (response.ok) {
        setLocalConsent(true);
      }
    } catch (error) {
      console.error("Error saving consent:", error);
    }
  };

  const getTitle = (type: "privacy" | "terms") =>
    type === "terms" ? "Terms and Conditions" : "Privacy Policy";

  return (
    <PageWrapper showFooter={true}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{getTitle(type)}</h1>
          {userId && (
            <div className="text-sm">
              {localConsent ? (
                <div className="text-green-500">
                  ✓ Accepted on {format(new Date(), "MMM d, yyyy")}
                </div>
              ) : (
                <div className="rounded-md border border-yellow-500 text-white px-2 py-1">
                  ⚠ Not yet accepted
                </div>
              )}
            </div>
          )}
        </div>
        <p className="text-sm text-gray-400">
          Version: {currentVersion.version}
        </p>
        <p className="text-sm text-gray-400 mb-8">
          Last Updated: {currentVersion.lastUpdated}
        </p>
        <div className="whitespace-pre-wrap prose prose-invert">
          {currentVersion.content}
        </div>

        {userId && !localConsent && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await handleConsent();
            }}
            className="mt-8 flex flex-col items-center"
          >
            <div className="flex items-center space-x-2">
              <Checkbox id="consent" required />
              <label
                htmlFor="consent"
                className="text-sm text-gray-200 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I accept the{" "}
                {type === "terms" ? "terms and conditions" : "privacy policy"}
              </label>
            </div>
            <button
              type="submit"
              className="mt-4 px-4 py-2 text-white rounded-md bg-green-500 hover:bg-green-600"
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </PageWrapper>
  );
}
