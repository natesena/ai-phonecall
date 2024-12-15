import LegalPage from "@/components/consent/legal-page";
import { privacyv0 } from "./_versions/v0_privacy";

export default function PrivacyPolicy() {
  return (
    <LegalPage
      currentVersion={{
        ...privacyv0,
      }}
      type="privacy"
    />
  );
}
