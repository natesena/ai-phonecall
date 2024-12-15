import LegalPage from "@/components/consent/legal-page";
import { termsv0 } from "./_versions/v0_terms";

export default function TermsAndConditions() {
  return (
    <LegalPage
      currentVersion={{
        ...termsv0,
      }}
      type="terms"
    />
  );
}
