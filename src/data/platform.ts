import type {
  Account,
  ChatMessage,
  DashboardData,
  Exercise,
  MessageThread,
  MyProgram,
  NutritionPlan,
  ProgressEntry,
  ScheduleItem,
  Workout,
} from "@/types";

function iso(offset: number) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

function mondayDelta() {
  const day = new Date().getDay();
  return day === 0 ? -6 : 1 - day;
}

const exercise = (
  partial: Pick<Exercise, "id" | "name" | "slug" | "muscle_group" | "thumbnail" | "image_alt"> &
    Partial<Exercise>,
): Exercise => ({
  description: "",
  video_url: "",
  difficulty: "intermediate",
  difficulty_label: "Intermediate",
  instructions: "",
  tips: "",
  ...partial,
});

export const exercises: Exercise[] = [
  exercise({
    id: 1,
    name: "Back Squat",
    slug: "back-squat",
    muscle_group: "Quads",
    thumbnail: "/images/programs/stage-clasp.jpg",
    image_alt: "Athletic portrait used as the squat reference",
    description: "The main lower-body strength lift in the block.",
    instructions: "Set the bar on the shelf of your upper back. Brace, sit between your hips, and stand tall. The knees track over the mid-foot.",
    tips: "If the heels rise, elevate them slightly and shorten the depth until the position is yours.",
  }),
  exercise({
    id: 2,
    name: "Romanian Deadlift",
    slug: "romanian-deadlift",
    muscle_group: "Hamstrings",
    thumbnail: "/images/programs/stage-side.jpg",
    image_alt: "Side stage pose used as the hinge reference",
    description: "A hip hinge for the back of the body.",
    instructions: "Soft knees, push the hips back, and keep the bar close. Stop when the hips can no longer travel back without the spine rounding.",
    tips: "Think of closing a car door with your hips. The bar does not need to crash into the floor.",
  }),
  exercise({
    id: 3,
    name: "Bench Press",
    slug: "bench-press",
    muscle_group: "Chest",
    thumbnail: "/images/programs/stage-front.jpg",
    image_alt: "Front stage pose used as the press reference",
    description: "Horizontal press for the week’s upper-body strength.",
    instructions: "Feet planted, shoulder blades set, bar lowered to the lower chest, then pressed up and slightly back.",
    tips: "Keep the reps smooth. A bounce off the chest is not a rep.",
  }),
  exercise({
    id: 4,
    name: "Bent-Over Row",
    slug: "bent-over-row",
    muscle_group: "Back",
    thumbnail: "/images/programs/stage-pose.jpg",
    image_alt: "Competition pose used as the row reference",
    description: "A heavy row to balance the pressing.",
    instructions: "Hinge until the torso is quiet, pull the bar to the lower ribs, and lower it without losing the brace.",
    tips: "If the lower back takes over, drop the load and support the chest on a bench.",
  }),
  exercise({
    id: 5,
    name: "Walking Lunge",
    slug: "walking-lunge",
    muscle_group: "Legs",
    thumbnail: "/images/about/gym-walk.jpg",
    image_alt: "Badran walking through the gym",
    description: "Single-leg strength that still lets you train hard.",
    instructions: "Step long enough that the back knee travels down, not forward. Stand through the front foot.",
    tips: "Shorter steps if the knee complains. Pain is a stop, not a cue.",
  }),
  exercise({
    id: 6,
    name: "Overhead Press",
    slug: "overhead-press",
    muscle_group: "Shoulders",
    thumbnail: "/images/programs/trophy.jpg",
    image_alt: "Badran holding a medal, used as the press reference",
    description: "Strict press for the shoulders.",
    instructions: "Ribs down, bar from the collarbone to lockout over the mid-foot. Do not lean back to finish the rep.",
    tips: "Use a slight stagger of the feet if your lower back wants to arch.",
  }),
  exercise({
    id: 7,
    name: "Pull-Up",
    slug: "pull-up",
    muscle_group: "Back",
    thumbnail: "/images/programs/stage-back.jpg",
    image_alt: "Back pose on stage used as the pull-up reference",
    description: "Vertical pull. Band or machine if a full rep is not honest yet.",
    instructions: "Hang tall, pull the chest toward the bar, lower under control.",
    tips: "Half reps do not count. Use assistance and own the full range.",
  }),
  exercise({
    id: 8,
    name: "Plank",
    slug: "plank",
    muscle_group: "Core",
    thumbnail: "/images/about/back-gym.jpg",
    image_alt: "Gym portrait used as the trunk reference",
    difficulty: "beginner",
    difficulty_label: "Beginner",
    description: "A brace you can breathe in.",
    instructions: "Elbows under shoulders, ribs down, glutes lightly on. Hold a straight line without holding your breath.",
    tips: "Stop two seconds before the lower back sags. Quality sets beat long ugly ones.",
  }),
];

function item(
  id: number,
  exerciseId: number,
  sets: string,
  reps: string,
  rest: number,
  tempo = "2-0-1-0",
  notes = "",
): Workout["exercises"][number] {
  const found = exercises.find((entry) => entry.id === exerciseId)!;
  return { id, order: id, sets, reps, rest_seconds: rest, tempo, notes, exercise: found };
}

export const workouts: Workout[] = [
  {
    id: 1,
    title: "Lower Strength",
    slug: "lower-strength",
    description: "Squat first. Hinge second. The accessories stay short.",
    duration_minutes: 55,
    focus: "Lower body",
    warmup: "5 minutes easy bike, then 2 light sets of the squat before the work sets.",
    coach_notes: "Leave one rep in reserve on the squat. The lunge should be smooth, not a race.",
    exercises: [
      item(1, 1, "4", "5", 150, "3-1-1-0", "Brace before you descend."),
      item(2, 2, "3", "8", 120),
      item(3, 5, "3", "10 / leg", 75),
      item(4, 8, "3", "30 sec", 45, "", "Breathe."),
    ],
  },
  {
    id: 2,
    title: "Upper Strength",
    slug: "upper-strength",
    description: "Press, row, and a vertical pull.",
    duration_minutes: 50,
    focus: "Upper body",
    warmup: "Band pull-aparts, then two easy sets of the press.",
    coach_notes: "If the shoulder feels sharp on the press, switch to a neutral-grip dumbbell press and tell me.",
    exercises: [
      item(5, 3, "4", "6", 150),
      item(6, 4, "4", "8", 120),
      item(7, 6, "3", "8", 90),
      item(8, 7, "3", "6–8", 90, "", "Use a band if needed."),
    ],
  },
  {
    id: 3,
    title: "Full Body",
    slug: "full-body",
    description: "A shorter session that still moves the main patterns.",
    duration_minutes: 45,
    focus: "Full body",
    warmup: "Two minutes of easy movement, then the first exercise light.",
    coach_notes: "This is not a second leg day. Keep the loads honest and finish on time.",
    exercises: [
      item(9, 1, "3", "5", 120),
      item(10, 3, "3", "8", 90),
      item(11, 4, "3", "10", 75),
      item(12, 8, "2", "30 sec", 30),
    ],
  },
  {
    id: 4,
    title: "Conditioning",
    slug: "conditioning",
    description: "A finish-the-week session. Hard enough to matter, short enough to recover.",
    duration_minutes: 35,
    focus: "Conditioning",
    warmup: "Easy pace for four minutes.",
    coach_notes: "You should be able to speak a short sentence between intervals. If you cannot, slow down.",
    exercises: [
      item(13, 5, "6", "40 m", 60, "", "Walk back is the rest."),
      item(14, 8, "3", "20 sec", 40),
    ],
  },
];

function schedule(): ScheduleItem[] {
  const monday = mondayDelta();
  const plan: Array<{ offset: number; label: string; workout: number | null }> = [
    { offset: monday, label: "Monday", workout: 1 },
    { offset: monday + 1, label: "Tuesday", workout: 2 },
    { offset: monday + 2, label: "Wednesday", workout: null },
    { offset: monday + 3, label: "Thursday", workout: 3 },
    { offset: monday + 4, label: "Friday", workout: 4 },
    { offset: monday + 5, label: "Saturday", workout: null },
    { offset: monday + 6, label: "Sunday", workout: null },
  ];
  const today = iso(0);
  return plan.map((day, index) => {
    const date = iso(day.offset);
    const workout = day.workout ? workouts.find((entry) => entry.id === day.workout)! : null;
    const status = day.workout === null ? "rest" : date < today ? "completed" : "upcoming";
    return {
      id: index + 1,
      day_label: day.label,
      date,
      is_rest: day.workout === null,
      status,
      workout: workout
        ? {
            id: workout.id,
            title: workout.title,
            slug: workout.slug,
            duration_minutes: workout.duration_minutes,
            exercise_count: workout.exercises.length,
            focus: workout.focus,
          }
        : null,
    };
  });
}

export function mockDashboard(): DashboardData {
  const monday = mondayDelta();
  const start = iso(monday - 28);
  const endDate = new Date(`${start}T12:00:00`);
  endDate.setDate(endDate.getDate() + 12 * 7);
  const items = schedule();
  const next = items.find((item) => item.status === "upcoming" && item.workout) ?? null;
  return {
    user: {
      first_name: "Omar",
      last_name: "Hassan",
      email: "client@vbadran.com",
      phone: "+962 79 000 0000",
    },
    program: {
      title: "Body Transformation",
      slug: "body-transformation",
      start_date: start,
      end_date: endDate.toISOString().slice(0, 10),
      duration_weeks: 12,
      current_week: 5,
      goal: "Change body composition without losing strength",
      progress_percent: 42,
      coach_instructions:
        "Train the sessions as written. Send the Friday check-in with weight and a short note. If a joint feels sharp, stop that exercise and message me the same day.",
      nutrition_included: true,
      image: "/images/programs/trophy.jpg",
    },
    next_workout: next,
    week_schedule: items,
    coach_note:
      "Week 5 stays on the same lifts. Add a little load on the squat only if Monday moved well. Keep the meals where they are.",
    progress_summary: {
      weight: 83.1,
      change: -3.3,
      workouts_completed: 16,
      consistency: 88,
      latest_date: iso(monday),
    },
    upcoming_checkin: iso(monday + 4),
  };
}

export function mockProgram(): MyProgram {
  const dashboard = mockDashboard();
  return {
    program: dashboard.program,
    coach_note: dashboard.coach_note,
    schedule: dashboard.week_schedule,
    description:
      "A twelve-week block for body composition and strength. You are in week five. The pattern stays. The loads and the food move from the check-in.",
    training_structure: "Four training days. Monday lower, Tuesday upper, Thursday full body, Friday conditioning. Rest is part of the plan.",
    nutrition_overview: "Training days sit slightly higher in carbohydrates. Protein stays even across the week.",
  };
}

export function mockNutrition(): { plan: NutritionPlan | null } {
  return {
    plan: {
      id: 1,
      title: "Transformation targets",
      overview: "These numbers are a starting point for this block. They move after the check-in, not every morning.",
      calories: 2400,
      protein_g: 180,
      carbs_g: 230,
      fats_g: 70,
      coach_notes: "Hit protein first. Place most of the carbohydrates around training. Weekend meals can be social if the week stayed close.",
      download_label: "Week 5 targets",
      download_url: "",
      days: [
        {
          id: 1,
          name: "Training day",
          meals: [
            { id: 1, name: "Breakfast", suggestion: "Eggs, fruit, and a serving of oats or bread." },
            { id: 2, name: "Lunch", suggestion: "Rice, chicken or fish, and a large portion of vegetables." },
            { id: 3, name: "Around training", suggestion: "Fruit and yogurt, or a simple sandwich if you train after work." },
            { id: 4, name: "Dinner", suggestion: "Potatoes or rice, a palm of protein, olive oil, salad." },
          ],
        },
        {
          id: 2,
          name: "Rest day",
          meals: [
            { id: 5, name: "Breakfast", suggestion: "Same protein, slightly smaller carbohydrate serving." },
            { id: 6, name: "Lunch", suggestion: "A large salad or vegetables with meat or fish and bread on the side." },
            { id: 7, name: "Dinner", suggestion: "The same structure as a training dinner, with one less handful of starch." },
          ],
        },
      ],
      notes: [
        { id: 1, body: "Water through the day. A number is less useful than noticing you forgot." },
        { id: 2, body: "If weight drops faster than we planned, we add food. We do not celebrate it." },
      ],
    },
  };
}

export function mockProgress(): ProgressEntry[] {
  const monday = mondayDelta();
  const weights = [86.4, 85.6, 84.8, 83.9, 83.1];
  return weights.map((weight, index) => ({
    id: index + 1,
    date: iso(monday - 28 + index * 7),
    weight,
    body_fat: null,
    chest: 102 - index * 0.2,
    waist: 92 - index * 0.8,
    arms: 36 + index * 0.1,
    legs: 60,
    notes: index === weights.length - 1 ? "Week 5. Strength is holding." : "",
  }));
}

export function mockMessages(): MessageThread {
  const monday = mondayDelta();
  const messages: ChatMessage[] = [
    {
      id: 1,
      is_coach: true,
      body: "Week 5 is lower body on Monday. Keep the rest as written. If the knee feels sharp on the lunge, stop that exercise and tell me.",
      created_at: new Date(`${iso(monday - 1)}T09:10:00`).toISOString(),
    },
    {
      id: 2,
      is_coach: false,
      body: "Knee was fine. Energy is better when I train in the afternoon.",
      created_at: new Date(`${iso(monday - 1)}T18:40:00`).toISOString(),
    },
    {
      id: 3,
      is_coach: true,
      body: "Good. Hold the calories where they are. Protein stays the priority on training days.",
      created_at: new Date(`${iso(monday)}T08:15:00`).toISOString(),
    },
  ];
  return { coach: { name: "Badran", avatar: "/images/dashboard/coach.jpg" }, messages };
}

export function mockAccount(): Account {
  const dashboard = mockDashboard();
  return {
    id: 1,
    email: dashboard.user.email,
    first_name: dashboard.user.first_name,
    last_name: dashboard.user.last_name,
    phone: dashboard.user.phone,
    country: "Jordan",
    goal: dashboard.program?.goal ?? "",
    fitness_level: "intermediate",
    current_program: dashboard.program?.title ?? null,
    purchases: [
      {
        order_number: "VB260901A1",
        title: "Transform",
        status: "paid",
        amount: "520.00",
        currency: "USD",
        created_at: dashboard.program?.start_date ?? iso(0),
      },
    ],
  };
}

export function findWorkout(id: number) {
  return workouts.find((workout) => workout.id === id) ?? null;
}

export function findExercise(slug: string) {
  return exercises.find((item) => item.slug === slug) ?? null;
}
