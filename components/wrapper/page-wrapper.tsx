import RootLayout from "./RootLayout";
import Footer from "./footer";

interface PageWrapperProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export default function PageWrapper({
  children,
  showFooter = false,
}: PageWrapperProps) {
  return (
    <RootLayout>
      {children}
      {showFooter && <Footer />}
    </RootLayout>
  );
}
