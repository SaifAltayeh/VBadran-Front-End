import { cn } from "@/lib/utils";

export function DashCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-[24px] bg-card p-5 shadow-[0_10px_32px_-20px_rgba(15,30,46,0.55)] md:p-6", className)}>
      {children}
    </div>
  );
}

export function DashKicker({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-[12px] text-subtitle", className)}>{children}</p>;
}

export function DashTitle({
  children,
  className,
  arabic = false,
}: {
  children: React.ReactNode;
  className?: string;
  arabic?: boolean;
}) {
  return (
    <h1
      className={cn(
        "text-[28px] text-title md:text-[32px]",
        arabic ? "font-arabic font-extrabold tracking-normal" : "font-display tracking-tight",
        className,
      )}
    >
      {children}
    </h1>
  );
}

export function StatCard({
  label,
  value,
  hint,
  arabic = false,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  arabic?: boolean;
}) {
  return (
    <DashCard>
      <DashKicker className={arabic ? "font-arabic" : undefined}>{label}</DashKicker>
      <p className={`mt-3 text-[28px] leading-none tracking-tight md:text-[32px] ${arabic ? "font-arabic font-extrabold" : "font-display"}`}>
        {value}
      </p>
      {hint ? <p className={`mt-2 text-[13px] text-subtitle ${arabic ? "font-arabic" : ""}`}>{hint}</p> : null}
    </DashCard>
  );
}
