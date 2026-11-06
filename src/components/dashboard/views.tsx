"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { Play } from "lucide-react";

import { DashCard, DashKicker, DashTitle, StatCard } from "@/components/dashboard/ui";
import { EmptyState, ErrorState, Field, Media, SelectField, Skeleton } from "@/components/ui/primitives";
import { FITNESS_GOALS, goalLabel } from "@/lib/goals";
import { useLang } from "@/lib/i18n";
import { loc } from "@/lib/i18n/portal-ar";
import {
  changePassword,
  completeWorkout,
  errorMessage,
  getAccount,
  getDashboard,
  getExercise,
  getExercises,
  getMyProgram,
  getWorkout,
  updateAccount,
} from "@/lib/api";
import { useResource } from "@/lib/hooks/use-resource";
import { localized } from "@/lib/locale";
import { formatDate } from "@/lib/utils";
import { embedUrl, isDirectVideo, mediaUrl } from "@/lib/video";

function VideoPlayer({ url, title, poster }: { url: string; title: string; poster?: string }) {
  const { arabic } = useLang();
  const src = mediaUrl(url);
  const embed = embedUrl(src);
  if (embed) {
    return (
      <iframe
        src={embed}
        title={title}
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }
  if (isDirectVideo(src)) {
    return (
      <video
        src={src}
        poster={poster || undefined}
        controls
        className="absolute inset-0 h-full w-full bg-black object-contain"
      />
    );
  }
  return (
    <a href={url} target="_blank" rel="noreferrer" className="absolute inset-0 flex items-center justify-center bg-black/80 text-sm text-white">
      {arabic ? "فتح الفيديو" : "Open video"}
    </a>
  );
}

function Gate<T>({
  status,
  data,
  children,
}: {
  status: "loading" | "ready" | "error";
  data: T | null;
  children: (data: T) => React.ReactNode;
}) {
  if (status === "loading") {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }
  if (status === "error" || !data) return <ErrorState />;
  return <>{children(data)}</>;
}

function usePortal() {
  const { t, arabic, lang } = useLang();
  return {
    t,
    arabic,
    lang,
    font: arabic ? "font-arabic" : undefined,
    loc: (value?: string | number | null) => loc(arabic, value),
    text: (en?: string | null, ar?: string | null) => localized(lang, en, ar),
    date: (iso: string, withYear = false) => formatDate(iso, arabic ? "ar" : "en", withYear),
  };
}

export function OverviewView() {
  const { t, arabic, lang, font, loc: tr, text, date } = usePortal();
  const resource = useResource(getDashboard);
  return (
    <Gate {...resource}>
      {(data) => {
        const packageName = text(data.package?.name, data.package?.name_ar);
        const gymName = text(data.gym?.name, data.gym?.name_ar);
        const planTitle = text(data.assigned_plan?.workout?.title, data.assigned_plan?.workout?.title_ar);
        return (
          <div className={font}>
            <DashTitle arabic={arabic}>
              {t.dash.welcome}
              {arabic ? "، " : ", "}
              {data.user.first_name}.
            </DashTitle>
            <p className={`mt-2 text-subtitle ${font}`}>{packageName || t.dash.platform}</p>
            {!data.membership && !data.package ? (
              <div className="mt-8">
                <EmptyState title={t.dash.noProgram} body={t.dash.noProgramBody} href="/programs" action={t.dash.browsePrograms} />
              </div>
            ) : (
              <>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard arabic={arabic} label={arabic ? "الباقة" : "Package"} value={packageName || "—"} />
                  <StatCard arabic={arabic} label={arabic ? "الصالة" : "Gym"} value={gymName || "—"} />
                  <StatCard arabic={arabic} label={t.dash.goal} value={goalLabel(data.goal || data.user.goal, lang) || "—"} />
                  <StatCard
                    arabic={arabic}
                    label={arabic ? "الخطة" : "Plan"}
                    value={planTitle || (arabic ? "بانتظار التعيين" : "Pending")}
                  />
                </div>
                <div className="mt-4 grid gap-4 xl:grid-cols-2">
                  <DashCard className="flex min-h-[200px] flex-col justify-between bg-primary text-on-primary">
                    <div>
                      <p className={`text-on-primary/70 ${arabic ? "font-arabic" : "text-[12px]"}`}>
                        {arabic ? "خطة التمرين" : "Assigned workout plan"}
                      </p>
                      {planTitle ? (
                        <>
                          <h2 className={`mt-3 text-[32px] tracking-tight ${arabic ? "font-arabic font-extrabold" : "font-display"}`}>
                            {planTitle}
                          </h2>
                          {data.assigned_plan?.notes ? (
                            <p className="mt-2 text-sm text-on-primary/75">{tr(data.assigned_plan.notes)}</p>
                          ) : null}
                        </>
                      ) : (
                        <p className="mt-3 text-on-primary/80">{t.dash.planPendingBody}</p>
                      )}
                    </div>
                    <Link
                      href="/dashboard/program"
                      className="mt-6 inline-flex h-11 w-fit items-center rounded-full bg-on-primary px-5 text-sm font-medium text-primary"
                    >
                      {arabic ? "عرض الخطة" : "Open plan"}
                    </Link>
                  </DashCard>
                  <DashCard>
                    <DashKicker className={font}>{arabic ? "تفاصيل العضوية" : "Membership"}</DashKicker>
                    <p className="mt-3 text-sm leading-6 text-subtitle">
                      {data.membership
                        ? `${tr(data.membership.status)} · ${date(data.membership.start_date, true)} → ${date(data.membership.end_date, true)}`
                        : arabic
                          ? "لا توجد عضوية نشطة بعد تأكيد الدفع."
                          : "No active membership until payment is confirmed."}
                    </p>
                    <Link href="/dashboard/exercises" className="mt-6 inline-flex text-sm text-primary">
                      {t.dash.exerciseLibrary}
                    </Link>
                  </DashCard>
                </div>
              </>
            )}
          </div>
        );
      }}
    </Gate>
  );
}

export function ProgramView() {
  const { t, arabic, lang, font, text } = usePortal();
  const resource = useResource(getMyProgram);
  return (
    <Gate {...resource}>
      {(data) => {
        const workout = data.workout || data.plan?.workout;
        const packageName = text(data.package?.name, data.package?.name_ar);
        if (data.plan_pending || !workout) {
          return (
            <EmptyState
              title={t.dash.planPending}
              body={t.dash.planPendingBody}
              href="/dashboard"
              action={arabic ? "العودة للنظرة العامة" : "Back to overview"}
            />
          );
        }
        return (
          <div className={font}>
            <DashTitle arabic={arabic}>{text(workout.title, workout.title_ar)}</DashTitle>
            <p className="mt-2 text-subtitle">{packageName}</p>
            <dl className="mt-8 grid gap-4 sm:grid-cols-3">
              <DashCard>
                <dt className="text-xs text-subtitle">{arabic ? "الصالة" : "Gym"}</dt>
                <dd className="mt-2 font-medium">{text(data.gym?.name, data.gym?.name_ar) || "—"}</dd>
              </DashCard>
              <DashCard>
                <dt className="text-xs text-subtitle">{t.dash.goal}</dt>
                <dd className="mt-2 font-medium">{goalLabel(data.goal, lang) || "—"}</dd>
              </DashCard>
              <DashCard>
                <dt className="text-xs text-subtitle">{t.dash.duration}</dt>
                <dd className="mt-2 font-medium">
                  {workout.duration_minutes} {t.dash.min}
                </dd>
              </DashCard>
            </dl>
            {workout.description || workout.description_ar ? (
              <p className="mt-8 max-w-2xl whitespace-pre-wrap text-lg leading-8">
                {text(workout.description, workout.description_ar)}
              </p>
            ) : null}
            {workout.warmup ? (
              <>
                <h2 className={`mt-10 text-2xl tracking-tight ${arabic ? "font-extrabold" : "font-display"}`}>{t.dash.warmup}</h2>
                <p className="mt-3 max-w-2xl text-subtitle">{text(workout.warmup, workout.warmup_ar)}</p>
              </>
            ) : null}
            <h2 className={`mt-10 text-2xl tracking-tight ${arabic ? "font-extrabold" : "font-display"}`}>{t.dash.exercises}</h2>
            <DashCard className="mt-4 p-0 md:p-0">
              {(workout.exercises || []).map((item) => (
                <Link
                  key={item.id}
                  href={`/dashboard/exercises/${item.exercise.slug}`}
                  className="flex items-center justify-between border-b border-line px-5 py-4 last:border-0"
                >
                  <div>
                    <p className="font-medium">{text(item.exercise.name, item.exercise.name_ar)}</p>
                    <p className="text-sm text-muted">
                      {item.sets} × {item.reps}
                    </p>
                  </div>
                  <p className="text-xs text-primary">{t.dash.viewWorkout}</p>
                </Link>
              ))}
            </DashCard>
          </div>
        );
      }}
    </Gate>
  );
}

export function TrainingView() {
  const { t, arabic, font, loc: tr, text, date } = usePortal();
  const resource = useResource(getMyProgram);
  return (
    <Gate {...resource}>
      {(data) => (
        <div className={font}>
          <DashTitle arabic={arabic}>{t.dash.thisWeek}</DashTitle>
          <div className="mt-8 space-y-3">
            {data.schedule.length === 0 ? <EmptyState title={t.dash.noSessions} body={t.dash.noSessionsBody} /> : null}
            {data.schedule.map((item) => (
              <article key={item.id} className="grid gap-3 rounded-[24px] bg-card p-5 shadow-[0_10px_32px_-20px_rgba(15,30,46,0.55)] md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="text-sm text-muted">
                    {tr(item.day_label)} · {date(item.date)} · {tr(item.status)}
                  </p>
                  <h2 className={`mt-1 text-3xl tracking-normal ${arabic ? "font-arabic font-extrabold" : "font-display"}`}>
                    {text(item.workout?.title, item.workout?.title_ar) || t.dash.restDay}
                  </h2>
                  {item.workout ? (
                    <p className="mt-1 text-sm text-subtitle">
                      <span className="inline-block">
                        {item.workout.duration_minutes} {t.dash.min}
                      </span>
                      {" · "}
                      <span className="inline-block">
                        {item.workout.exercise_count} {t.dash.exercisesCount}
                      </span>
                      {" · "}
                      {text(item.workout.focus, item.workout.focus_ar)}
                    </p>
                  ) : null}
                </div>
                {item.workout ? (
                  <Link href={`/dashboard/training/${item.workout.id}?slot=${item.id}`} className="text-sm font-medium tracking-normal">
                    {t.dash.viewWorkout}
                  </Link>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      )}
    </Gate>
  );
}

export function WorkoutView({ id, slot }: { id: number; slot?: string }) {
  const { t, arabic, font, text } = usePortal();
  const load = useCallback(() => getWorkout(id), [id]);
  const resource = useResource(load);
  const [done, setDone] = useState(false);
  return (
    <Gate {...resource}>
      {(workout) =>
        !workout ? (
          <EmptyState title={t.dash.sessionMissing} body={t.dash.sessionMissingBody} href="/dashboard/training" action={t.dash.backTraining} />
        ) : (
          <div className={font}>
            <p className="text-[11px] text-muted">
              {text(workout.focus, workout.focus_ar)} · {workout.duration_minutes} {t.dash.min}
            </p>
            <DashTitle arabic={arabic}>{text(workout.title, workout.title_ar)}</DashTitle>
            <p className="mt-4 max-w-2xl whitespace-pre-wrap text-title">{text(workout.description, workout.description_ar)}</p>
            <h2 className={`mt-10 text-3xl ${arabic ? "font-extrabold" : "font-display"}`}>{t.dash.warmup}</h2>
            <p className="mt-3 max-w-2xl">{text(workout.warmup, workout.warmup_ar)}</p>
            <h2 className={`mt-10 text-3xl ${arabic ? "font-extrabold" : "font-display"}`}>{t.dash.exercises}</h2>
            <div className="mt-4 overflow-x-auto">
              <table className={`w-full min-w-[640px] text-sm ${arabic ? "text-right" : "text-left"}`}>
                <thead className="border-b border-line text-xs text-muted">
                  <tr>
                    <th className="py-3">{t.dash.exerciseCol}</th>
                    <th>{t.dash.sets}</th>
                    <th>{t.dash.reps}</th>
                    <th>{t.dash.rest}</th>
                    <th>{t.dash.tempo}</th>
                  </tr>
                </thead>
                <tbody>
                  {workout.exercises.map((row) => (
                    <tr key={row.id} className="border-b border-line">
                      <td className="py-4">
                        <Link href={`/dashboard/exercises/${row.exercise.slug}`} className="font-medium">
                          {text(row.exercise.name, row.exercise.name_ar)}
                        </Link>
                        {row.notes ? <p className="text-subtitle">{text(row.notes, row.notes_ar)}</p> : null}
                      </td>
                      <td>{row.sets}</td>
                      <td>{row.reps}</td>
                      <td>
                        {row.rest_seconds}
                        {arabic ? " ث" : "s"}
                      </td>
                      <td>{row.tempo || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h2 className={`mt-10 text-3xl ${arabic ? "font-extrabold" : "font-display"}`}>{t.dash.coachNote}</h2>
            <p className="mt-3 max-w-2xl">{text(workout.coach_notes, workout.coach_notes_ar)}</p>
            {slot ? (
              <button
                type="button"
                className="mt-8 rounded-full border border-primary px-5 py-3 text-sm text-title"
                onClick={async () => {
                  await completeWorkout(Number(slot));
                  setDone(true);
                }}
              >
                {done ? t.dash.markedComplete : t.dash.markComplete}
              </button>
            ) : null}
          </div>
        )
      }
    </Gate>
  );
}

export function ExerciseLibrary() {
  const { t, arabic, font, loc: tr, text } = usePortal();
  const resource = useResource(getExercises);
  const [group, setGroup] = useState("All");
  return (
    <Gate {...resource}>
      {(items) => {
        const groups = ["All", ...Array.from(new Set(items.map((item) => item.muscle_group)))];
        const visible = group === "All" ? items : items.filter((item) => item.muscle_group === group);
        return (
          <div className={font}>
            <DashTitle arabic={arabic}>{t.dash.exerciseLibrary}</DashTitle>
            <div className="mt-6 flex gap-2 overflow-x-auto">
              {groups.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setGroup(item)}
                  className={`shrink-0 rounded-full border px-3 py-2 text-sm ${group === item ? "border-primary bg-primary text-on-primary" : "border-line text-subtitle"}`}
                >
                  {item === "All" ? t.dash.all : tr(item)}
                </button>
              ))}
            </div>
            {visible.length === 0 ? (
              <div className="mt-8">
                <EmptyState title={t.dash.noExercises} body={t.dash.noExercisesBody} />
              </div>
            ) : null}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((item) => (
                <Link key={item.slug} href={`/dashboard/exercises/${item.slug}`} className="group">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-[24px] bg-black">
                    {item.thumbnail ? (
                      <Media src={item.thumbnail} alt={item.image_alt} className="object-contain transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#1b2836] to-black" />
                    )}
                    <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary">
                      <Play className="h-4 w-4" />
                    </span>
                  </div>
                  <h2 className={`mt-3 text-2xl ${arabic ? "font-extrabold" : "font-display"}`}>{text(item.name, item.name_ar)}</h2>
                  <p className="text-sm text-muted">
                    {tr(item.muscle_group)} · {tr(item.difficulty_label)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        );
      }}
    </Gate>
  );
}

export function ExerciseDetail({ slug }: { slug: string }) {
  const { t, arabic, font, loc: tr, text } = usePortal();
  const load = useCallback(() => getExercise(slug), [slug]);
  const resource = useResource(load);
  return (
    <Gate {...resource}>
      {(exercise) =>
        !exercise ? (
          <EmptyState title={t.dash.exerciseMissing} body={t.dash.exerciseMissingBody} href="/dashboard/exercises" action={t.dash.backLibrary} />
        ) : (
          <div className={`grid gap-8 lg:grid-cols-12 ${font}`}>
            <div className="lg:col-span-5">
              {exercise.video_url ? (
                <div className="relative aspect-[2/3] overflow-hidden rounded-[28px] bg-black">
                  <VideoPlayer
                    url={exercise.video_url}
                    title={text(exercise.name, exercise.name_ar)}
                    poster={exercise.thumbnail}
                  />
                </div>
              ) : (
                <div className="relative aspect-[4/5] overflow-hidden rounded-[28px]">
                  <Media src={exercise.thumbnail} alt={exercise.image_alt} />
                  <div className="absolute inset-x-0 bottom-0 bg-black/70 p-4 text-sm text-white">{t.dash.videoSoon}</div>
                </div>
              )}
            </div>
            <div className="lg:col-span-7">
              <p className="text-[11px] text-muted">
                {tr(exercise.muscle_group)} · {tr(exercise.difficulty_label)}
              </p>
              <DashTitle arabic={arabic}>{text(exercise.name, exercise.name_ar)}</DashTitle>
              <p className="mt-4 text-lg">{text(exercise.description, exercise.description_ar)}</p>
              <h2 className={`mt-8 text-2xl ${arabic ? "font-extrabold" : "font-display"}`}>{t.dash.instructions}</h2>
              <p className="mt-2 leading-7">{text(exercise.instructions, exercise.instructions_ar)}</p>
              <h2 className={`mt-8 text-2xl ${arabic ? "font-extrabold" : "font-display"}`}>{t.dash.techniqueTips}</h2>
              <p className="mt-2 leading-7">{text(exercise.tips, exercise.tips_ar)}</p>
            </div>
          </div>
        )
      }
    </Gate>
  );
}

export function AccountView() {
  const { t, arabic, lang, font, loc: tr, text } = usePortal();
  const resource = useResource(getAccount);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  return (
    <Gate {...resource}>
      {(account) => (
        <div className={`max-w-2xl ${font}`}>
          <DashTitle arabic={arabic}>{t.dash.account}</DashTitle>
          <p className="mt-3 text-subtitle">{account.email}</p>
          <p className="mt-1 text-sm">
            {t.dash.currentProgram}: {text(account.current_program, account.current_program_ar) || t.dash.none}
          </p>
          <form
            className="mt-8 grid gap-4"
            onSubmit={async (event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              try {
                await updateAccount({
                  first_name: String(form.get("first_name")),
                  last_name: String(form.get("last_name")),
                  phone: String(form.get("phone")),
                  country: String(form.get("country")),
                  goal: String(form.get("goal")),
                });
                setNotice(t.dash.profileSaved);
                setError("");
              } catch (err) {
                setError(errorMessage(err));
              }
            }}
          >
            <Field label={t.dash.firstName} name="first_name" defaultValue={account.first_name} labelClassName={font} />
            <Field label={t.dash.lastName} name="last_name" defaultValue={account.last_name} labelClassName={font} />
            <Field label={t.dash.phone} name="phone" defaultValue={account.phone} labelClassName={font} />
            <Field label={t.country} name="country" defaultValue={account.country} labelClassName={font} />
            <SelectField label={t.dash.goal} name="goal" defaultValue={account.goal} labelClassName={font}>
              <option value="">{arabic ? "اختر الهدف" : "Choose a goal"}</option>
              {FITNESS_GOALS.map((goal) => (
                <option key={goal.value} value={goal.value}>
                  {lang === "ar" ? goal.ar : goal.en}
                </option>
              ))}
              {account.goal && !FITNESS_GOALS.some((goal) => goal.value === account.goal) ? (
                <option value={account.goal}>{goalLabel(account.goal, lang)}</option>
              ) : null}
            </SelectField>
            <button type="submit" className="h-12 rounded-full bg-primary text-sm text-on-primary">
              {t.dash.saveProfile}
            </button>
          </form>
          <form
            className="mt-10 grid gap-4 border-t border-line pt-8"
            onSubmit={async (event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              try {
                await changePassword(String(form.get("current")), String(form.get("next")));
                setNotice(t.dash.profileSaved);
                setError("");
              } catch (err) {
                setError(errorMessage(err));
              }
            }}
          >
            <h2 className="text-3xl font-extrabold">{t.dash.password}</h2>
            <Field label={t.dash.currentPassword} name="current" type="password" labelClassName={font} />
            <Field label={t.dash.newPassword} name="next" type="password" minLength={8} labelClassName={font} />
            <button type="submit" className="h-12 rounded-full border border-primary text-sm text-title">
              {t.dash.updatePassword}
            </button>
          </form>
          {notice ? (
            <p className="mt-4 text-sm" role="status">
              {notice}
            </p>
          ) : null}
          {error ? (
            <p className="mt-4 text-sm text-primary" role="alert">
              {error}
            </p>
          ) : null}
          <h2 className="mt-10 text-3xl font-extrabold">{t.dash.purchases}</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {(account.purchases || []).length === 0 ? <li className="py-4 text-sm text-subtitle">{t.dash.noPurchases}</li> : null}
            {(account.purchases || []).map((purchase) => (
              <li key={purchase.order_number} className="flex justify-between py-4 text-sm">
                <span>
                  {text(purchase.title, purchase.title_ar)} · {purchase.order_number}
                </span>
                <span className="text-muted">{tr(purchase.status)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted">{t.dash.billingNote}</p>
        </div>
      )}
    </Gate>
  );
}
