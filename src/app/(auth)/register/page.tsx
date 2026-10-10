import type { Metadata } from "next";

import { RegisterForm } from "@/components/forms/auth-forms";
import { RegisterHeading } from "@/components/pages/auth-headings";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <>
      <RegisterHeading />
      <div className="mt-8">
        <RegisterForm />
      </div>
    </>
  );
}
