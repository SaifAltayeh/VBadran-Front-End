"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { Play } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { DashCard, DashKicker, DashTitle, StatCard } from "@/components/dashboard/ui";
import { EmptyState, ErrorState, Field, Media, Skeleton } from "@/components/ui/primitives";
import { useLang } from "@/lib/i18n";
import { loc } from "@/lib/i18n/portal-ar";
import {
  addProgress,
  changePassword,
  completeWorkout,
  errorMessage,
  getAccount,
  getDashboard,
  getExercise,
  getExercises,
  getMyProgram,
  getNutrition,
  getProgress,
  getWorkout,
  updateAccount,
  uploadProgressPhoto,
} from "@/lib/api";
import { useResource } from "@/lib/hooks/use-resource";
import { formatDate } from "@/lib/utils";
import type { ProgressEntry } from "@/types";

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
  const { t, arabic } = useLang();
  return {
    t,
    arabic,
    font: arabic ? "font-arabic" : undefined,
    loc: (value?: string | number | null) => loc(arabic, value),
    date: (iso: string) => formatDate(iso, arabic ? "ar" : "en"),
  };
}

export function OverviewView() {
  const { t, arabic, font, loc: tr, date } = usePortal();
  const resource = useResource(getDashboard);
  return (
    <Gate {...resource}>
      {(data) => (
        <div className={font}>
          <DashTitle arabic={arabic}>
            {t.dash.welcome}
            {arabic ? "، " : ", "}
            {data.user.first_name}.
          </DashTitle>
          <p className={`mt-2 text-neutral-500 ${font}`}>
            {data.program ? `${tr(data.program.title)} · ${t.dash.week} ${data.program.current_week}` : t.dash.platform}
          </p>
          {!data.program ? (
            <div className="mt-8">
              <EmptyState title={t.dash.noProgram} body={t.dash.noProgramBody} href="/programs" action={t.dash.browsePrograms} />
            </div>
          ) : (
            <>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  arabic={arabic}
                  label={t.dash.week}
                  value={`${data.program.current_week} / ${data.program.duration_weeks}`}
                  hint={t.dash.ofBlock}
                />
                <StatCard arabic={arabic} label={t.dash.blockProgress} value={`${data.program.progress_percent}%`} hint={tr(data.program.title)} />
                <StatCard
                  arabic={arabic}
                  label={t.dash.weight}
                  value={data.progress_summary.weight ?? "—"}
                  hint={data.progress_summary.change != null ? `${data.progress_summary.change} ${t.dash.kg}` : t.dash.kg}
                />
                <StatCard
                  arabic={arabic}
                  label={t.dash.consistency}
                  value={`${data.progress_summary.consistency}%`}
                  hint={`${data.progress_summary.workouts_completed} ${t.dash.sessionsDone}`}
                />
              </div>
              <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                <DashCard className="flex min-h-[220px] flex-col justify-between bg-primary text-white">
                  <div>
                    <p className={`text-white/70 ${arabic ? "font-arabic" : "text-[12px]"}`}>{t.dash.nextSession}</p>
                    {data.next_workout?.workout ? (
                      <>
                        <h2 className={`mt-3 text-[32px] tracking-tight ${arabic ? "font-arabic font-extrabold" : "font-display"}`}>
                          {tr(data.next_workout.workout.title)}
                        </h2>
                        <p className="mt-2 text-sm text-white/75">
                          {tr(data.next_workout.day_label)} · {date(data.next_workout.date)} · {data.next_workout.workout.duration_minutes} {t.dash.min}
                        </p>
                      </>
                    ) : (
                      <p className="mt-3 text-white/80">{t.dash.noSession}</p>
                    )}
                  </div>
                  {data.next_workout?.workout ? (
                    <Link
                      href={`/dashboard/training/${data.next_workout.workout.id}?slot=${data.next_workout.id}`}
                      className="mt-6 inline-flex h-11 w-fit items-center rounded-full bg-white px-5 text-sm font-medium text-primary"
                    >
                      {t.dash.openSession}
                    </Link>
                  ) : null}
                </DashCard>
                <div className="grid gap-4">
                  <DashCard>
                    <DashKicker className={font}>{t.dash.coachNote}</DashKicker>
                    <p className={`mt-3 text-sm leading-6 text-neutral-600 ${font}`}>{tr(data.coach_note) || t.dash.coachNoteEmpty}</p>
                  </DashCard>
                  <DashCard>
                    <DashKicker className={font}>{t.dash.checkIn}</DashKicker>
                    <p className={`mt-3 text-2xl tracking-tight ${arabic ? "font-arabic font-extrabold" : "font-display"}`}>
                      {date(data.upcoming_checkin)}
                    </p>
                  </DashCard>
                </div>
              </div>
              <DashCard className="mt-4">
                <DashKicker className={font}>{t.dash.thisWeek}</DashKicker>
                <ul className="mt-4 divide-y divide-[#eef0f3]">
                  {data.week_schedule.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="text-[13px] text-neutral-400">{tr(item.day_label)}</p>
                        <p className="truncate font-medium">{tr(item.workout?.title) || t.dash.restDay}</p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] ${
                          item.status === "completed"
                            ? "bg-[#e8f5e9] text-[#1b7a36]"
                            : item.status === "rest"
                              ? "bg-[#f4f5f7] text-neutral-400"
                              : "bg-[#eef1fb] text-primary"
                        }`}
                      >
                        {tr(item.status)}
                      </span>
                    </li>
                  ))}
                </ul>
              </DashCard>
            </>
          )}
        </div>
      )}
    </Gate>
  );
}

export function ProgramView() {
  const { t, arabic, font, loc: tr, date } = usePortal();
  const resource = useResource(getMyProgram);
  return (
    <Gate {...resource}>
      {(data) =>
        !data.program ? (
          <EmptyState title={t.dash.noProgramAssigned} body={t.dash.noProgramAssignedBody} href="/programs" action={t.viewPrograms} />
        ) : (
          <div className={font}>
            <DashTitle arabic={arabic}>{tr(data.program.title)}</DashTitle>
            <dl className="mt-8 grid gap-4 sm:grid-cols-4">
              <DashCard>
                <dt className="text-xs text-neutral-400">{t.dash.start}</dt>
                <dd className="mt-2 font-medium">{date(data.program.start_date)}</dd>
              </DashCard>
              <DashCard>
                <dt className="text-xs text-neutral-400">{t.dash.duration}</dt>
                <dd className="mt-2 font-medium">
                  {data.program.duration_weeks} {t.dash.weeksUnit}
                </dd>
              </DashCard>
              <DashCard>
                <dt className="text-xs text-neutral-400">{t.dash.currentWeek}</dt>
                <dd className="mt-2 font-medium">{data.program.current_week}</dd>
              </DashCard>
              <DashCard>
                <dt className="text-xs text-neutral-400">{t.dash.goal}</dt>
                <dd className="mt-2 font-medium">{tr(data.program.goal)}</dd>
              </DashCard>
            </dl>
            <p className="mt-8 max-w-2xl text-lg leading-8">{tr(data.description)}</p>
            <h2 className={`mt-10 text-2xl tracking-tight ${arabic ? "font-extrabold" : "font-display"}`}>{t.dash.coachInstructions}</h2>
            <p className="mt-3 max-w-2xl text-neutral-600">{tr(data.program.coach_instructions)}</p>
            <h2 className={`mt-10 text-2xl tracking-tight ${arabic ? "font-extrabold" : "font-display"}`}>{t.dash.thisWeek}</h2>
            <DashCard className="mt-4 p-0 md:p-0">
              {data.schedule.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b border-[#eef0f3] px-5 py-4 last:border-0">
                  <div>
                    <p className="text-sm text-muted">
                      {tr(item.day_label)} · {date(item.date)}
                    </p>
                    <p className="font-medium">{tr(item.workout?.title) || t.dash.restDay}</p>
                  </div>
                  <p className="text-xs">{tr(item.status)}</p>
                </div>
              ))}
            </DashCard>
            <h2 className={`mt-10 text-2xl tracking-tight ${arabic ? "font-extrabold" : "font-display"}`}>{t.dash.nutritionSupport}</h2>
            <p className="mt-3 max-w-2xl">{tr(data.nutrition_overview) || t.dash.nutritionMissing}</p>
          </div>
        )
      }
    </Gate>
  );
}

export function TrainingView() {
  const { t, arabic, font, loc: tr, date } = usePortal();
  const resource = useResource(getMyProgram);
  return (
    <Gate {...resource}>
      {(data) => (
        <div className={font}>
          <DashTitle arabic={arabic}>{t.dash.thisWeek}</DashTitle>
          <div className="mt-8 space-y-3">
            {data.schedule.length === 0 ? <EmptyState title={t.dash.noSessions} body={t.dash.noSessionsBody} /> : null}
            {data.schedule.map((item) => (
              <article key={item.id} className="grid gap-3 rounded-[24px] bg-white p-5 shadow-[0_10px_32px_-20px_rgba(15,23,42,0.28)] md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="text-sm text-muted">
                    {tr(item.day_label)} · {date(item.date)} · {tr(item.status)}
                  </p>
                  <h2 className={`mt-1 text-3xl tracking-normal ${arabic ? "font-arabic font-extrabold" : "font-display"}`}>
                    {tr(item.workout?.title) || t.dash.restDay}
                  </h2>
                  {item.workout ? (
                    <p className="mt-1 text-sm text-neutral-700">
                      <span className="inline-block">
                        {item.workout.duration_minutes} {t.dash.min}
                      </span>
                      {" · "}
                      <span className="inline-block">
                        {item.workout.exercise_count} {t.dash.exercisesCount}
                      </span>
                      {" · "}
                      {tr(item.workout.focus)}
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
  const { t, arabic, font, loc: tr } = usePortal();
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
              {tr(workout.focus)} · {workout.duration_minutes} {t.dash.min}
            </p>
            <DashTitle arabic={arabic}>{tr(workout.title)}</DashTitle>
            <p className="mt-4 max-w-2xl text-neutral-800">{tr(workout.description)}</p>
            <h2 className={`mt-10 text-3xl ${arabic ? "font-extrabold" : "font-display"}`}>{t.dash.warmup}</h2>
            <p className="mt-3 max-w-2xl">{tr(workout.warmup)}</p>
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
                          {tr(row.exercise.name)}
                        </Link>
                        {row.notes ? <p className="text-neutral-600">{tr(row.notes)}</p> : null}
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
            <p className="mt-3 max-w-2xl">{tr(workout.coach_notes)}</p>
            {slot ? (
              <button
                type="button"
                className="mt-8 border border-black px-5 py-3 text-sm"
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
  const { t, arabic, font, loc: tr } = usePortal();
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
                  className={`shrink-0 border px-3 py-2 text-sm ${group === item ? "border-black bg-black text-white" : "border-line"}`}
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
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[24px]">
                    <Media src={item.thumbnail} alt={item.image_alt} className="transition-transform duration-700 group-hover:scale-105" />
                    <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white">
                      <Play className="h-4 w-4" />
                    </span>
                  </div>
                  <h2 className={`mt-3 text-2xl ${arabic ? "font-extrabold" : "font-display"}`}>{tr(item.name)}</h2>
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
  const { t, arabic, font, loc: tr } = usePortal();
  const load = useCallback(() => getExercise(slug), [slug]);
  const resource = useResource(load);
  return (
    <Gate {...resource}>
      {(exercise) =>
        !exercise ? (
          <EmptyState title={t.dash.exerciseMissing} body={t.dash.exerciseMissingBody} href="/dashboard/exercises" action={t.dash.backLibrary} />
        ) : (
          <div className={`grid gap-8 lg:grid-cols-12 ${font}`}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] lg:col-span-5">
              <Media src={exercise.thumbnail} alt={exercise.image_alt} />
              <div className="absolute inset-x-0 bottom-0 bg-black/70 p-4 text-sm text-white">
                {exercise.video_url ? t.dash.videoRef : t.dash.videoSoon}
              </div>
            </div>
            <div className="lg:col-span-7">
              <p className="text-[11px] text-muted">
                {tr(exercise.muscle_group)} · {tr(exercise.difficulty_label)}
              </p>
              <DashTitle arabic={arabic}>{tr(exercise.name)}</DashTitle>
              <p className="mt-4 text-lg">{tr(exercise.description)}</p>
              <h2 className={`mt-8 text-2xl ${arabic ? "font-extrabold" : "font-display"}`}>{t.dash.instructions}</h2>
              <p className="mt-2 leading-7">{tr(exercise.instructions)}</p>
              <h2 className={`mt-8 text-2xl ${arabic ? "font-extrabold" : "font-display"}`}>{t.dash.techniqueTips}</h2>
              <p className="mt-2 leading-7">{tr(exercise.tips)}</p>
            </div>
          </div>
        )
      }
    </Gate>
  );
}

export function NutritionView() {
  const { t, arabic, font, loc: tr } = usePortal();
  const resource = useResource(getNutrition);
  return (
    <Gate {...resource}>
      {(data) =>
        !data.plan ? (
          <EmptyState title={t.dash.noNutrition} body={t.dash.noNutritionBody} />
        ) : (
          <div className={font}>
            <DashTitle arabic={arabic}>{tr(data.plan.title)}</DashTitle>
            <p className="mt-4 max-w-2xl text-lg leading-8">{tr(data.plan.overview)}</p>
            <dl className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                [t.dash.calories, data.plan.calories],
                [t.dash.protein, data.plan.protein_g ? `${data.plan.protein_g}g` : "—"],
                [t.dash.carbs, data.plan.carbs_g ? `${data.plan.carbs_g}g` : "—"],
                [t.dash.fats, data.plan.fats_g ? `${data.plan.fats_g}g` : "—"],
              ].map(([label, value]) => (
                <div key={String(label)} className="rounded-[24px] bg-white p-4 shadow-[0_10px_32px_-20px_rgba(15,23,42,0.28)]">
                  <dt className="text-xs text-muted">{label}</dt>
                  <dd className={`mt-2 text-4xl ${arabic ? "font-extrabold" : "font-display"}`}>{value ?? "—"}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {data.plan.days.map((day) => (
                <section key={day.id}>
                  <h2 className={`text-3xl ${arabic ? "font-extrabold" : "font-display"}`}>{tr(day.name)}</h2>
                  <ul className="mt-3 divide-y divide-line border-y border-line">
                    {day.meals.map((meal) => (
                      <li key={meal.id} className="py-3">
                        <p className="text-sm font-medium">{tr(meal.name)}</p>
                        <p className="text-sm text-neutral-700">{tr(meal.suggestion)}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
            <h2 className={`mt-10 text-3xl ${arabic ? "font-extrabold" : "font-display"}`}>{t.dash.coachNote}</h2>
            <p className="mt-3 max-w-2xl">{tr(data.plan.coach_notes)}</p>
            <ul className="mt-4 list-disc space-y-2 ps-5 text-sm text-neutral-700">
              {data.plan.notes.map((note) => (
                <li key={note.id}>{tr(note.body)}</li>
              ))}
            </ul>
          </div>
        )
      }
    </Gate>
  );
}

export function ProgressView() {
  const { t, arabic, font, date } = usePortal();
  const resource = useResource(getProgress);
  const [entries, setEntries] = useState<ProgressEntry[] | null>(null);
  const [photos, setPhotos] = useState<{ id: number; url: string | null; caption: string }[]>([]);
  const [error, setError] = useState("");

  return (
    <Gate {...resource}>
      {(loaded) => {
        const rows = entries ?? loaded;
        const chart = rows
          .filter((row) => row.weight !== null && row.weight !== "")
          .map((row) => ({ label: date(row.date), weight: Number(row.weight) }));
        return (
          <div className={font}>
            <DashTitle arabic={arabic}>{t.dash.progress}</DashTitle>
            <DashCard className="mt-8 h-72">
              {chart.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chart}>
                    <CartesianGrid stroke="#efefef" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis domain={["dataMin - 1", "dataMax + 1"]} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={40} />
                    <Tooltip />
                    <Line type="monotone" dataKey="weight" stroke="#2443B2" strokeWidth={2} dot={{ r: 3, fill: "#2443B2" }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState title={t.dash.noWeighIns} body={t.dash.noWeighInsBody} />
              )}
            </DashCard>
            <div className="mt-8 overflow-x-auto">
              <table className={`w-full min-w-[680px] text-sm ${arabic ? "text-right" : "text-left"}`}>
                <thead className="border-b border-line text-xs text-muted">
                  <tr>
                    {[t.dash.date, t.dash.weight, t.dash.waist, t.dash.chest, t.dash.arms, t.dash.legs].map(
                      (heading) => (
                        <th key={heading} className="py-3">
                          {heading}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-b border-line">
                      <td className="py-3">{date(row.date)}</td>
                      <td>{row.weight ?? "—"}</td>
                      <td>{row.waist ?? "—"}</td>
                      <td>{row.chest ?? "—"}</td>
                      <td>{row.arms ?? "—"}</td>
                      <td>{row.legs ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <form
              className="mt-8 grid gap-4 rounded-[24px] bg-white p-5 shadow-[0_10px_32px_-20px_rgba(15,23,42,0.28)] md:grid-cols-4"
              onSubmit={async (event) => {
                event.preventDefault();
                const form = new FormData(event.currentTarget);
                try {
                  const created = await addProgress({
                    date: String(form.get("date")),
                    weight: String(form.get("weight") || ""),
                    notes: String(form.get("notes") || ""),
                  });
                  setEntries([created, ...rows]);
                  setError("");
                  event.currentTarget.reset();
                } catch (err) {
                  setError(errorMessage(err));
                }
              }}
            >
              <Field label={t.dash.date} name="date" type="date" required labelClassName={font} />
              <Field label={t.dash.weightKg} name="weight" type="number" step="0.1" labelClassName={font} />
              <Field label={t.dash.note} name="notes" labelClassName={font} />
              <div className="self-end">
                <button type="submit" className="h-12 w-full bg-black text-sm text-white">
                  {t.dash.addEntry}
                </button>
              </div>
            </form>
            {error ? (
              <p className="mt-3 text-sm text-primary" role="alert">
                {error}
              </p>
            ) : null}
            <h2 className={`mt-12 text-3xl ${arabic ? "font-extrabold" : "font-display"}`}>{t.dash.progressPhotos}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {photos.length === 0 ? <p className="text-sm text-neutral-700">{t.dash.noPhotos}</p> : null}
              {photos.map((photo) => (
                <figure key={photo.id}>
                  {photo.url ? (
                    // Blob previews from the file picker are not optimized by Next Image.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photo.url} alt={photo.caption || t.dash.progressPhotos} className="aspect-[3/4] w-full object-cover" />
                  ) : null}
                  <figcaption className="mt-2 text-sm">{photo.caption}</figcaption>
                </figure>
              ))}
            </div>
            <form
              className="mt-4 flex flex-wrap items-end gap-3"
              onSubmit={async (event) => {
                event.preventDefault();
                const form = new FormData(event.currentTarget);
                const file = form.get("photo");
                if (!(file instanceof File) || !file.size) return;
                const saved = await uploadProgressPhoto(file, String(form.get("caption") || ""));
                setPhotos((current) => [saved, ...current]);
              }}
            >
              <label className="text-sm">
                {t.dash.photo}
                <input name="photo" type="file" accept="image/*" className="mt-2 block" />
              </label>
              <Field label={t.dash.caption} name="caption" labelClassName={font} />
              <button type="submit" className="h-12 bg-black px-5 text-sm text-white">
                {t.dash.upload}
              </button>
            </form>
          </div>
        );
      }}
    </Gate>
  );
}

export function AccountView() {
  const { t, arabic, font, loc: tr } = usePortal();
  const resource = useResource(getAccount);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  return (
    <Gate {...resource}>
      {(account) => (
        <div className={`max-w-2xl ${font}`}>
          <DashTitle arabic={arabic}>{t.dash.account}</DashTitle>
          <p className="mt-3 text-neutral-700">{account.email}</p>
          <p className="mt-1 text-sm">
            {t.dash.currentProgram}: {tr(account.current_program) || t.dash.none}
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
            <Field label={t.dash.goal} name="goal" defaultValue={account.goal} labelClassName={font} />
            <button type="submit" className="h-12 bg-black text-sm text-white">
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
            <button type="submit" className="h-12 border border-black text-sm">
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
            {(account.purchases || []).length === 0 ? <li className="py-4 text-sm text-neutral-700">{t.dash.noPurchases}</li> : null}
            {(account.purchases || []).map((purchase) => (
              <li key={purchase.order_number} className="flex justify-between py-4 text-sm">
                <span>
                  {tr(purchase.title)} · {purchase.order_number}
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
