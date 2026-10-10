import type { Metadata } from "next";

import { ForgotForm } from "@/components/forms/auth-forms";
import { ForgotHeading } from "@/components/pages/auth-headings";

export const metadata: Metadata = { title: "Forgot password" };

export default function ForgotPage() {
  return (
    <>
      <ForgotHeading />
      <div className="mt-8">
        <ForgotForm />
      </div>
    </>
  );
}
