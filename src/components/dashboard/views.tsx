"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { Play } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { DashCard, DashKicker, DashTitle, StatCard } from "@/components/dashboard/ui";
import { EmptyState, ErrorState, Field, Media, Skeleton } from "@/components/ui/primitives";
import { useLang } from "@/lib/i18n";
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

export function OverviewView() {
  const { t, arabic } = useLang();
  const resource = useResource(getDashboard);
  return (
    <Gate {...resource}>
      {(data) => (
        <div>
          <DashTitle className={arabic ? "font-arabic" : undefined}>
            {t.dash.welcome}, {data.user.first_name}.
          </DashTitle>
          <p className={`mt-2 text-neutral-500 ${arabic ? "font-arabic" : ""}`}>
            {data.program ? `${data.program.title} · ${t.dash.week} ${data.program.current_week}` : t.dash.platform}
          </p>
          {!data.program ? (
            <div className="mt-8">
              <EmptyState title="No active program" body="When a program is assigned, it will show up here with the week and the next session." href="/programs" action="Browse programs" />
            </div>
          ) : (
            <>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  label={t.dash.week}
                  value={`${data.program.current_week} / ${data.program.duration_weeks}`}
                  hint={t.dash.ofBlock}
                />
                <StatCard label={t.dash.blockProgress} value={`${data.program.progress_percent}%`} hint={data.program.title} />
                <StatCard
                  label={t.dash.weight}
                  value={data.progress_summary.weight ?? "—"}
                  hint={data.progress_summary.change != null ? `${data.progress_summary.change} kg` : "kg"}
                />
                <StatCard
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
                        <h2 className={`mt-3 font-display text-[32px] tracking-tight ${arabic ? "font-arabic" : ""}`}>
                          {data.next_workout.workout.title}
                        </h2>
                        <p className="mt-2 text-sm text-white/75">
                          {data.next_workout.day_label} · {formatDate(data.next_workout.date)} · {data.next_workout.workout.duration_minutes} min
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
                    <DashKicker className={arabic ? "font-arabic" : undefined}>{t.dash.coachNote}</DashKicker>
                    <p className={`mt-3 text-sm leading-6 text-neutral-600 ${arabic ? "font-arabic" : ""}`}>
                      {data.coach_note || "Your coach note will appear here."}
                    </p>
                  </DashCard>
                  <DashCard>
                    <DashKicker className={arabic ? "font-arabic" : undefined}>{t.dash.checkIn}</DashKicker>
                    <p className="mt-3 font-display text-2xl tracking-tight">{formatDate(data.upcoming_checkin)}</p>
                  </DashCard>
                </div>
              </div>
              <DashCard className="mt-4">
                <DashKicker className={arabic ? "font-arabic" : undefined}>{t.dash.thisWeek}</DashKicker>
                <ul className="mt-4 divide-y divide-[#eef0f3]">
                  {data.week_schedule.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="text-[13px] text-neutral-400">{item.day_label}</p>
                        <p className="truncate font-medium">{item.workout?.title || t.dash.restDay}</p>
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
                        {item.status}
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
  const resource = useResource(getMyProgram);
  return (
    <Gate {...resource}>
      {(data) =>
        !data.program ? (
          <EmptyState title="No program assigned" body="Purchase a program and it will be attached to this account after payment is confirmed." href="/programs" action="View programs" />
        ) : (
          <div>
            <DashTitle>{data.program.title}</DashTitle>
            <dl className="mt-8 grid gap-4 sm:grid-cols-4">
              <DashCard><dt className="text-xs text-neutral-400">Start</dt><dd className="mt-2 font-medium">{formatDate(data.program.start_date)}</dd></DashCard>
              <DashCard><dt className="text-xs text-neutral-400">Duration</dt><dd className="mt-2 font-medium">{data.program.duration_weeks} weeks</dd></DashCard>
              <DashCard><dt className="text-xs text-neutral-400">Current week</dt><dd className="mt-2 font-medium">{data.program.current_week}</dd></DashCard>
              <DashCard><dt className="text-xs text-neutral-400">Goal</dt><dd className="mt-2 font-medium">{data.program.goal}</dd></DashCard>
            </dl>
            <p className="mt-8 max-w-2xl text-lg leading-8">{data.description}</p>
            <h2 className="mt-10 font-display text-2xl tracking-tight">Coach instructions</h2>
            <p className="mt-3 max-w-2xl text-neutral-600">{data.program.coach_instructions}</p>
            <h2 className="mt-10 font-display text-2xl tracking-tight">This week</h2>
            <DashCard className="mt-4 p-0 md:p-0">
              {data.schedule.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b border-[#eef0f3] px-5 py-4 last:border-0">
                  <div>
                    <p className="text-sm text-muted">{item.day_label} · {formatDate(item.date)}</p>
                    <p className="font-medium">{item.workout?.title || "Rest day"}</p>
                  </div>
                  <p className="text-xs uppercase tracking-[0.14em]">{item.status}</p>
                </div>
              ))}
            </DashCard>
            <h2 className="mt-10 font-display text-2xl tracking-tight">Nutrition support</h2>
            <p className="mt-3 max-w-2xl">{data.nutrition_overview || "Nutrition is not part of this program."}</p>
          </div>
        )
      }
    </Gate>
  );
}

export function TrainingView() {
  const resource = useResource(getMyProgram);
  return (
    <Gate {...resource}>
      {(data) => (
        <div>
          <DashTitle>This week</DashTitle>
          <div className="mt-8 space-y-3">
            {data.schedule.length === 0 ? <EmptyState title="No sessions yet" body="Your schedule appears when a program is active." /> : null}
            {data.schedule.map((item) => (
              <article key={item.id} className="grid gap-3 rounded-[24px] bg-white p-5 shadow-[0_10px_32px_-20px_rgba(15,23,42,0.28)] md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-muted">{item.day_label} · {formatDate(item.date)} · {item.status}</p>
                  <h2 className="mt-1 font-display text-3xl">{item.workout?.title || "Rest day"}</h2>
                  {item.workout ? (
                    <p className="mt-1 text-sm text-neutral-700">{item.workout.duration_minutes} min · {item.workout.exercise_count} exercises · {item.workout.focus}</p>
                  ) : null}
                </div>
                {item.workout ? (
                  <Link href={`/dashboard/training/${item.workout.id}?slot=${item.id}`} className="text-xs uppercase tracking-[0.16em]">
                    View workout
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
  const load = useCallback(() => getWorkout(id), [id]);
  const resource = useResource(load);
  const [done, setDone] = useState(false);
  return (
    <Gate {...resource}>
      {(workout) =>
        !workout ? (
          <EmptyState title="Session not found" body="That workout is not in the library." href="/dashboard/training" action="Back to training" />
        ) : (
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted">{workout.focus} · {workout.duration_minutes} min</p>
            <DashTitle>{workout.title}</DashTitle>
            <p className="mt-4 max-w-2xl text-neutral-800">{workout.description}</p>
            <h2 className="mt-10 font-display text-3xl">Warm-up</h2>
            <p className="mt-3 max-w-2xl">{workout.warmup}</p>
            <h2 className="mt-10 font-display text-3xl">Exercises</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-line text-xs uppercase tracking-[0.14em] text-muted">
                  <tr>
                    <th className="py-3">Exercise</th>
                    <th>Sets</th>
                    <th>Reps</th>
                    <th>Rest</th>
                    <th>Tempo</th>
                  </tr>
                </thead>
                <tbody>
                  {workout.exercises.map((row) => (
                    <tr key={row.id} className="border-b border-line">
                      <td className="py-4">
                        <Link href={`/dashboard/exercises/${row.exercise.slug}`} className="font-medium">{row.exercise.name}</Link>
                        {row.notes ? <p className="text-neutral-600">{row.notes}</p> : null}
                      </td>
                      <td>{row.sets}</td>
                      <td>{row.reps}</td>
                      <td>{row.rest_seconds}s</td>
                      <td>{row.tempo || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h2 className="mt-10 font-display text-3xl">Coach notes</h2>
            <p className="mt-3 max-w-2xl">{workout.coach_notes}</p>
            {slot ? (
              <button
                type="button"
                className="mt-8 border border-black px-5 py-3 text-xs uppercase tracking-[0.16em]"
                onClick={async () => {
                  await completeWorkout(Number(slot));
                  setDone(true);
                }}
              >
                {done ? "Marked complete" : "Mark complete"}
              </button>
            ) : null}
          </div>
        )
      }
    </Gate>
  );
}

export function ExerciseLibrary() {
  const resource = useResource(getExercises);
  const [group, setGroup] = useState("All");
  return (
    <Gate {...resource}>
      {(items) => {
        const groups = ["All", ...Array.from(new Set(items.map((item) => item.muscle_group)))];
        const visible = group === "All" ? items : items.filter((item) => item.muscle_group === group);
        return (
          <div>
            <DashTitle>Exercise library</DashTitle>
            <div className="mt-6 flex gap-2 overflow-x-auto">
              {groups.map((item) => (
                <button key={item} type="button" onClick={() => setGroup(item)} className={`shrink-0 border px-3 py-2 text-xs uppercase tracking-[0.14em] ${group === item ? "border-black bg-black text-white" : "border-line"}`}>
                  {item}
                </button>
              ))}
            </div>
            {visible.length === 0 ? <div className="mt-8"><EmptyState title="No exercises" body="Nothing in this muscle group yet." /></div> : null}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((item) => (
                <Link key={item.slug} href={`/dashboard/exercises/${item.slug}`} className="group">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[24px]">
                    <Media src={item.thumbnail} alt={item.image_alt} className="transition-transform duration-700 group-hover:scale-105" />
                    <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white">
                      <Play className="h-4 w-4" />
                    </span>
                  </div>
                  <h2 className="mt-3 font-display text-2xl">{item.name}</h2>
                  <p className="text-sm text-muted">{item.muscle_group} · {item.difficulty_label}</p>
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
  const load = useCallback(() => getExercise(slug), [slug]);
  const resource = useResource(load);
  return (
    <Gate {...resource}>
      {(exercise) =>
        !exercise ? (
          <EmptyState title="Exercise not found" body="It may have been renamed." href="/dashboard/exercises" action="Back to library" />
        ) : (
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] lg:col-span-5">
              <Media src={exercise.thumbnail} alt={exercise.image_alt} />
              <div className="absolute inset-x-0 bottom-0 bg-black/70 p-4 text-sm text-white">
                {exercise.video_url ? "Video reference" : "Video will be added by your coach. The written cues are ready."}
              </div>
            </div>
            <div className="lg:col-span-7">
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted">{exercise.muscle_group} · {exercise.difficulty_label}</p>
              <DashTitle>{exercise.name}</DashTitle>
              <p className="mt-4 text-lg">{exercise.description}</p>
              <h2 className="mt-8 font-display text-2xl">Instructions</h2>
              <p className="mt-2 leading-7">{exercise.instructions}</p>
              <h2 className="mt-8 font-display text-2xl">Technique tips</h2>
              <p className="mt-2 leading-7">{exercise.tips}</p>
            </div>
          </div>
        )
      }
    </Gate>
  );
}

export function NutritionView() {
  const resource = useResource(getNutrition);
  return (
    <Gate {...resource}>
      {(data) =>
        !data.plan ? (
          <EmptyState title="No nutrition plan" body="Nutrition appears here when your program includes it." />
        ) : (
          <div>
            <DashTitle>{data.plan.title}</DashTitle>
            <p className="mt-4 max-w-2xl text-lg leading-8">{data.plan.overview}</p>
            <dl className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                ["Calories", data.plan.calories],
                ["Protein", data.plan.protein_g ? `${data.plan.protein_g}g` : "—"],
                ["Carbs", data.plan.carbs_g ? `${data.plan.carbs_g}g` : "—"],
                ["Fats", data.plan.fats_g ? `${data.plan.fats_g}g` : "—"],
              ].map(([label, value]) => (
                <div key={String(label)} className="rounded-[24px] bg-white p-4 shadow-[0_10px_32px_-20px_rgba(15,23,42,0.28)]">
                  <dt className="text-xs uppercase tracking-[0.14em] text-muted">{label}</dt>
                  <dd className="mt-2 font-display text-4xl">{value ?? "—"}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {data.plan.days.map((day) => (
                <section key={day.id}>
                  <h2 className="font-display text-3xl">{day.name}</h2>
                  <ul className="mt-3 divide-y divide-line border-y border-line">
                    {day.meals.map((meal) => (
                      <li key={meal.id} className="py-3">
                        <p className="text-sm font-medium">{meal.name}</p>
                        <p className="text-sm text-neutral-700">{meal.suggestion}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
            <h2 className="mt-10 font-display text-3xl">Coach notes</h2>
            <p className="mt-3 max-w-2xl">{data.plan.coach_notes}</p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-neutral-700">
              {data.plan.notes.map((note) => (
                <li key={note.id}>{note.body}</li>
              ))}
            </ul>
          </div>
        )
      }
    </Gate>
  );
}

export function ProgressView() {
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
          .map((row) => ({ label: formatDate(row.date), weight: Number(row.weight) }));
        return (
          <div>
            <DashTitle>Progress</DashTitle>
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
                <EmptyState title="No weigh-ins yet" body="Add a weight and the chart will draw itself." />
              )}
            </DashCard>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="border-b border-line text-xs uppercase tracking-[0.14em] text-muted">
                  <tr>
                    {["Date", "Weight", "Waist", "Chest", "Arms", "Legs"].map((heading) => (
                      <th key={heading} className="py-3">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-b border-line">
                      <td className="py-3">{formatDate(row.date)}</td>
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
              <Field label="Date" name="date" type="date" required />
              <Field label="Weight (kg)" name="weight" type="number" step="0.1" />
              <Field label="Note" name="notes" />
              <div className="self-end">
                <button type="submit" className="h-12 w-full bg-black text-xs uppercase tracking-[0.16em] text-white">Add entry</button>
              </div>
            </form>
            {error ? <p className="mt-3 text-sm text-primary" role="alert">{error}</p> : null}
            <h2 className="mt-12 font-display text-3xl">Progress photos</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {photos.length === 0 ? <p className="text-sm text-neutral-700">No photos yet. Add one from this device.</p> : null}
              {photos.map((photo) => (
                <figure key={photo.id}>
                  {photo.url ? (
                    // Blob previews from the file picker are not optimized by Next Image.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photo.url} alt={photo.caption || "Progress photo"} className="aspect-[3/4] w-full object-cover" />
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
                Photo
                <input name="photo" type="file" accept="image/*" className="mt-2 block" />
              </label>
              <Field label="Caption" name="caption" />
              <button type="submit" className="h-12 bg-black px-5 text-xs uppercase tracking-[0.16em] text-white">Upload</button>
            </form>
          </div>
        );
      }}
    </Gate>
  );
}

export function AccountView() {
  const resource = useResource(getAccount);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  return (
    <Gate {...resource}>
      {(account) => (
        <div className="max-w-2xl">
          <DashTitle>Account</DashTitle>
          <p className="mt-3 text-neutral-700">{account.email}</p>
          <p className="mt-1 text-sm">Current program: {account.current_program || "None"}</p>
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
                setNotice("Profile saved.");
                setError("");
              } catch (err) {
                setError(errorMessage(err));
              }
            }}
          >
            <Field label="First name" name="first_name" defaultValue={account.first_name} />
            <Field label="Last name" name="last_name" defaultValue={account.last_name} />
            <Field label="Phone" name="phone" defaultValue={account.phone} />
            <Field label="Country" name="country" defaultValue={account.country} />
            <Field label="Goal" name="goal" defaultValue={account.goal} />
            <button type="submit" className="h-12 bg-black text-xs uppercase tracking-[0.16em] text-white">Save profile</button>
          </form>
          <form
            className="mt-10 grid gap-4 border-t border-line pt-8"
            onSubmit={async (event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              try {
                const result = await changePassword(String(form.get("current")), String(form.get("next")));
                setNotice(result.detail);
                setError("");
              } catch (err) {
                setError(errorMessage(err));
              }
            }}
          >
            <h2 className="font-display text-3xl">Password</h2>
            <Field label="Current password" name="current" type="password" />
            <Field label="New password" name="next" type="password" minLength={8} />
            <button type="submit" className="h-12 border border-black text-xs uppercase tracking-[0.16em]">Update password</button>
          </form>
          {notice ? <p className="mt-4 text-sm" role="status">{notice}</p> : null}
          {error ? <p className="mt-4 text-sm text-primary" role="alert">{error}</p> : null}
          <h2 className="mt-10 font-display text-3xl">Purchased programs</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {(account.purchases || []).length === 0 ? <li className="py-4 text-sm text-neutral-700">No purchases yet.</li> : null}
            {(account.purchases || []).map((purchase) => (
              <li key={purchase.order_number} className="flex justify-between py-4 text-sm">
                <span>{purchase.title} · {purchase.order_number}</span>
                <span className="uppercase tracking-[0.12em] text-muted">{purchase.status}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted">Billing charges appear here once a payment provider is connected.</p>
        </div>
      )}
    </Gate>
  );
}
