import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { privacyv0 } from "@/app/privacy/_versions/v0_privacy";
import { termsv0 } from "@/app/terms/_versions/v0_terms";

interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConsent: () => void;
}

export function ConsentModal({
  isOpen,
  onClose,
  onConsent,
}: ConsentModalProps) {
  const [hasAgreed, setHasAgreed] = useState(false);

  const handleConsent = async () => {
    try {
      // Record both consents
      await Promise.all([
        fetch("/api/consent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "terms",
            version: termsv0.version,
          }),
        }),
        fetch("/api/consent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "privacy",
            version: privacyv0.version,
          }),
        }),
      ]);

      onConsent();
    } catch (error) {
      console.error("Error recording consent:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Terms & Privacy Policy</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-gray-600">
            Before proceeding with your purchase, please review and accept our
            terms and privacy policy.
          </p>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="consent"
              checked={hasAgreed}
              onCheckedChange={(checked) => setHasAgreed(checked as boolean)}
            />
            <label
              htmlFor="consent"
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I confirm that I am at least 18 years old and I agree to the{" "}
              <Link
                href="/terms"
                target="_blank"
                className="text-primary hover:underline font-bold"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                target="_blank"
                className="text-primary hover:underline font-bold"
              >
                Privacy Policy
              </Link>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConsent} disabled={!hasAgreed}>
            Continue to Checkout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
