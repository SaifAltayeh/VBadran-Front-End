import { CheckoutChrome } from "@/components/layout/checkout-chrome";

export const metadata = { robots: { index: false, follow: false } };

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <CheckoutChrome>{children}</CheckoutChrome>;
}
