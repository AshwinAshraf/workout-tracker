import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://swfgpzoincmzgpjbmude.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3Zmdwem9pbmNtemdwamJtdWRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMzU3OTcsImV4cCI6MjA5MjgxMTc5N30.cSg-HyozCKKbtTg09SmCBcJHYhIGmcPhhh0XcPIzjzs'
)

const USER_ID = 'rufi'

// ─── COLOUR PALETTE ───────────────────────────────────────────────
const C = {
  bg: "#FDF6F0",
  card: "#FFFFFF",
  primary: "#E8547A",       // warm rose
  secondary: "#F4A261",     // peach-orange
  accent: "#2D6A4F",        // forest green
  dark: "#1A1A2E",
  mid: "#6B7280",
  light: "#F3EDE7",
  border: "#EDE0D8",
  success: "#2D6A4F",
  warn: "#F4A261",
};

// ─── FONT INJECTION ───────────────────────────────────────────────
const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.bg}; font-family: 'DM Sans', sans-serif; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${C.light}; }
  ::-webkit-scrollbar-thumb { background: ${C.primary}; border-radius: 2px; }

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50%       { transform: scale(1.05); }
  }
  .fade-in { animation: fadeSlideUp 0.45s ease both; }
  .card-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(232,84,122,0.15); transition: all 0.25s; }
`;

// ─── 4-WEEK PROGRAM ───────────────────────────────────────────────
// Focus: fat loss, stamina, energy. Sessions ≤ 55 min.
// Week 1-2: Foundation. Week 3-4: Progression.
const PROGRAM = [
  // ── WEEK 1 ──
  {
    week: 1, day: 1, label: "Full Body Strength A",
    focus: "Compound Lifts · Moderate Pace",
    warmup: "5 min brisk walk / step-ups",
    exercises: [
      { name: "Goblet Squat", sets: 3, reps: "12", note: "Light-medium DB, sit deep" },
      { name: "DB Romanian Deadlift", sets: 3, reps: "12", note: "Hinge at hips, soft knees" },
      { name: "DB Shoulder Press", sets: 3, reps: "10", note: "Seated or standing" },
      { name: "Seated Cable Row", sets: 3, reps: "12", note: "Squeeze shoulder blades" },
      { name: "Hip Thrust (bodyweight)", sets: 3, reps: "15", note: "Pause 1 sec at top" },
      { name: "Plank Hold", sets: 3, reps: "30s", note: "Core tight, breathe" },
    ],
    cardio: "15 min treadmill incline walk (4–5 km/h, 6–8% grade)",
    duration: "50 min",
  },
  {
    week: 1, day: 2, label: "HIIT Cardio + Core",
    focus: "Fat Burn · Heart Rate Spike",
    warmup: "3 min light jog",
    exercises: [
      { name: "Jump Rope (or high knees)", sets: 5, reps: "40s on / 20s off", note: "Stay light on feet" },
      { name: "Box Step-Ups", sets: 3, reps: "12 each leg", note: "Controlled descent" },
      { name: "Battle Rope Slams", sets: 4, reps: "30s", note: "Drive from hips" },
      { name: "Mountain Climbers", sets: 3, reps: "40s", note: "Core engaged throughout" },
      { name: "Dead Bug", sets: 3, reps: "10 each side", note: "Lower back flat on floor" },
      { name: "Russian Twists", sets: 3, reps: "20 total", note: "Feet lifted if possible" },
    ],
    cardio: "10 min cool-down walk + stretch",
    duration: "45 min",
  },
  {
    week: 1, day: 3, label: "REST / Active Recovery",
    focus: "Low Impact Movement",
    warmup: "",
    exercises: [
      { name: "30 min leisure walk", sets: 1, reps: "—", note: "Zone 1 — conversational pace" },
      { name: "Full body stretching", sets: 1, reps: "15 min", note: "Hip flexors, hamstrings, shoulders" },
    ],
    cardio: "",
    duration: "45 min total",
  },
  {
    week: 1, day: 4, label: "Lower Body Sculpt",
    focus: "Glutes · Legs · Stamina",
    warmup: "5 min dynamic warm-up (leg swings, lunges)",
    exercises: [
      { name: "Sumo Squat", sets: 4, reps: "12", note: "Wide stance, toes out" },
      { name: "Walking Lunges", sets: 3, reps: "10 each leg", note: "Keep torso upright" },
      { name: "Cable Kickback", sets: 3, reps: "15 each", note: "Slow controlled extension" },
      { name: "Leg Press (light-med)", sets: 3, reps: "15", note: "Full range, don't lock out" },
      { name: "Inner Thigh Machine", sets: 3, reps: "15", note: "Controlled squeeze" },
      { name: "Standing Calf Raises", sets: 3, reps: "20", note: "Pause at top" },
    ],
    cardio: "12 min cycle (steady pace, 70–75% max HR)",
    duration: "55 min",
  },
  {
    week: 1, day: 5, label: "Upper Body Tone",
    focus: "Arms · Shoulders · Back",
    warmup: "5 min rowing machine (easy)",
    exercises: [
      { name: "Lat Pulldown", sets: 3, reps: "12", note: "Wide grip, lean back slightly" },
      { name: "DB Bicep Curl", sets: 3, reps: "12", note: "Supinate at top" },
      { name: "Tricep Rope Pushdown", sets: 3, reps: "12", note: "Elbows pinned to sides" },
      { name: "Lateral Raise", sets: 3, reps: "15", note: "Light DB, no swinging" },
      { name: "Face Pull", sets: 3, reps: "15", note: "Great for posture" },
      { name: "DB Chest Press", sets: 3, reps: "12", note: "Neutral or pronated grip" },
    ],
    cardio: "10 min cross-trainer (steady)",
    duration: "50 min",
  },
  {
    week: 1, day: 6, label: "Stamina Circuit",
    focus: "Full Body · Cardio Endurance",
    warmup: "3 min jog / skip",
    exercises: [
      { name: "Dumbbell Thrusters", sets: 4, reps: "12", note: "Squat to press in one motion" },
      { name: "KB (or DB) Swings", sets: 4, reps: "15", note: "Hip drive, not a squat" },
      { name: "TRX / Assisted Pull-Up", sets: 3, reps: "8", note: "Full range of motion" },
      { name: "Burpee (no jump)", sets: 3, reps: "10", note: "Step out instead of jumping" },
      { name: "Bear Crawl", sets: 3, reps: "20m", note: "Slow and controlled" },
      { name: "Hollow Body Hold", sets: 3, reps: "30s", note: "Press lower back flat" },
    ],
    cardio: "10 min cool-down walk",
    duration: "50 min",
  },
  { week: 1, day: 7, label: "Full REST", focus: "Recovery & Nutrition Focus", warmup: "", exercises: [{ name: "Rest completely", sets: 1, reps: "—", note: "Hydrate well, eat protein at every meal" }], cardio: "", duration: "—" },

  // ── WEEK 2 ──
  {
    week: 2, day: 1, label: "Full Body Strength A+",
    focus: "Compound Lifts · Increase Weight 5%",
    warmup: "5 min incline walk",
    exercises: [
      { name: "Goblet Squat", sets: 4, reps: "12", note: "Increase weight from Week 1" },
      { name: "DB Romanian Deadlift", sets: 4, reps: "10", note: "Heavier, same form" },
      { name: "DB Shoulder Press", sets: 3, reps: "12", note: "Add a rep or weight" },
      { name: "Seated Cable Row", sets: 4, reps: "12", note: "Add slight resistance" },
      { name: "Hip Thrust (with DB)", sets: 3, reps: "15", note: "Hold DB on hips" },
      { name: "Plank + Shoulder Tap", sets: 3, reps: "30s", note: "Alternate taps, hips stable" },
    ],
    cardio: "18 min incline treadmill walk",
    duration: "55 min",
  },
  {
    week: 2, day: 2, label: "HIIT Cardio + Core",
    focus: "Fat Burn · Increase Intervals",
    warmup: "3 min light jog",
    exercises: [
      { name: "Jump Rope / High Knees", sets: 6, reps: "40s on / 20s off", note: "One extra round vs W1" },
      { name: "Box Step-Ups", sets: 3, reps: "14 each leg", note: "Add a rep" },
      { name: "Battle Rope Alternating", sets: 4, reps: "40s", note: "Alternating waves" },
      { name: "Spiderman Plank", sets: 3, reps: "40s", note: "Knee to elbow each side" },
      { name: "Leg Raise", sets: 3, reps: "12", note: "Slow lower, don't arch back" },
      { name: "V-Sit Hold", sets: 3, reps: "20s", note: "Extend if comfortable" },
    ],
    cardio: "10 min cool-down + stretch",
    duration: "50 min",
  },
  {
    week: 2, day: 3, label: "REST / Active Recovery",
    focus: "Low Impact Movement",
    warmup: "",
    exercises: [
      { name: "30 min walk (hilly route)", sets: 1, reps: "—", note: "Add incline for challenge" },
      { name: "Yoga / deep stretch", sets: 1, reps: "15 min", note: "YouTube beginner yoga OK" },
    ],
    cardio: "",
    duration: "45 min total",
  },
  {
    week: 2, day: 4, label: "Lower Body Sculpt B",
    focus: "Glutes · Hamstrings · Stability",
    warmup: "5 min dynamic",
    exercises: [
      { name: "Bulgarian Split Squat", sets: 3, reps: "10 each", note: "Rear foot on bench" },
      { name: "Stiff-Leg Deadlift", sets: 3, reps: "12", note: "Feel hamstring stretch" },
      { name: "Abductor Machine", sets: 3, reps: "20", note: "Squeeze at end range" },
      { name: "Lying Leg Curl", sets: 3, reps: "12", note: "Controlled throughout" },
      { name: "Glute Bridge (loaded)", sets: 4, reps: "15", note: "Plate on hips" },
      { name: "Seated Calf Raise", sets: 3, reps: "20", note: "Full range" },
    ],
    cardio: "15 min cycle (moderate resistance)",
    duration: "55 min",
  },
  {
    week: 2, day: 5, label: "Upper Body Tone B",
    focus: "Back · Chest · Arms",
    warmup: "5 min rowing (moderate)",
    exercises: [
      { name: "Close-Grip Lat Pulldown", sets: 3, reps: "12", note: "Neutral grip, squeeze lats" },
      { name: "Hammer Curl", sets: 3, reps: "12", note: "Neutral wrist throughout" },
      { name: "Overhead Tricep Extension", sets: 3, reps: "12", note: "DB behind head" },
      { name: "Cable Chest Fly", sets: 3, reps: "15", note: "Slight bend in elbow" },
      { name: "Rear Delt Fly (bent over)", sets: 3, reps: "15", note: "Squeeze back deltoids" },
      { name: "Arnold Press", sets: 3, reps: "10", note: "Rotate wrists as you press" },
    ],
    cardio: "10 min cross-trainer",
    duration: "50 min",
  },
  {
    week: 2, day: 6, label: "Stamina Circuit B",
    focus: "Full Body · Push Your Pace",
    warmup: "3 min jog",
    exercises: [
      { name: "DB Thrusters", sets: 4, reps: "14", note: "Slightly heavier than W1" },
      { name: "KB Swings", sets: 4, reps: "18", note: "More power" },
      { name: "Push-Up (full or kneeling)", sets: 3, reps: "12", note: "Full chest range" },
      { name: "Lateral Band Walk", sets: 3, reps: "15 each way", note: "Resistance band at ankles" },
      { name: "Plank to Downward Dog", sets: 3, reps: "12", note: "Flow movement" },
      { name: "Bicycle Crunch", sets: 3, reps: "20 total", note: "Slow and deliberate" },
    ],
    cardio: "10 min cool-down",
    duration: "50 min",
  },
  { week: 2, day: 7, label: "Full REST", focus: "Recovery & Sleep Priority", warmup: "", exercises: [{ name: "Rest, sleep 7–8h", sets: 1, reps: "—", note: "Sleep is when fat burns and muscle builds" }], cardio: "", duration: "—" },

  // ── WEEK 3 ──
  {
    week: 3, day: 1, label: "Strength + Metabolic A",
    focus: "Heavier Compound · Less Rest",
    warmup: "5 min incline walk",
    exercises: [
      { name: "Barbell (or DB) Back Squat", sets: 4, reps: "10", note: "Heavier than previous weeks" },
      { name: "DB RDL", sets: 4, reps: "10", note: "Increase load" },
      { name: "DB Shoulder Press", sets: 4, reps: "10", note: "Rest 45s between sets" },
      { name: "Single-Arm DB Row", sets: 3, reps: "12 each", note: "Use bench for support" },
      { name: "Hip Thrust (Barbell light)", sets: 4, reps: "12", note: "Progress from DBs" },
      { name: "Pallof Press", sets: 3, reps: "10 each", note: "Anti-rotation core" },
    ],
    cardio: "20 min incline walk",
    duration: "55 min",
  },
  {
    week: 3, day: 2, label: "HIIT + Power Circuit",
    focus: "Calorie Torch · Peak Effort",
    warmup: "3 min jog",
    exercises: [
      { name: "Tabata Intervals (any cardio)", sets: 8, reps: "20s all-out / 10s rest", note: "4 min total, brutal" },
      { name: "Box Step-Up (weighted)", sets: 3, reps: "12 each", note: "Hold DBs" },
      { name: "Slam Ball", sets: 4, reps: "15", note: "Explosive overhead slam" },
      { name: "Lateral Shuffle", sets: 4, reps: "20m", note: "Low athletic stance" },
      { name: "Hanging Knee Raise", sets: 3, reps: "12", note: "From pull-up bar" },
      { name: "Plank with Hip Dips", sets: 3, reps: "16 total", note: "Slow rotation" },
    ],
    cardio: "8 min cool-down",
    duration: "48 min",
  },
  {
    week: 3, day: 3, label: "REST / Active Recovery",
    focus: "Mobility & Breathing",
    warmup: "",
    exercises: [
      { name: "Swim or cycle (easy)", sets: 1, reps: "30 min", note: "Or leisure walk" },
      { name: "Diaphragmatic breathing", sets: 1, reps: "10 min", note: "Reduces cortisol, aids fat loss" },
    ],
    cardio: "",
    duration: "40 min total",
  },
  {
    week: 3, day: 4, label: "Lower Body Power",
    focus: "Strength + Endurance Combo",
    warmup: "5 min dynamic",
    exercises: [
      { name: "Hack Squat / Leg Press (heavy)", sets: 4, reps: "10", note: "Challenge yourself" },
      { name: "Romanian Deadlift (barbell light)", sets: 3, reps: "10", note: "Heavier version" },
      { name: "Reverse Lunge (weighted)", sets: 3, reps: "10 each", note: "Step back, knee to floor" },
      { name: "Cable Pull-Through", sets: 3, reps: "15", note: "Hip extension focus" },
      { name: "Nordic Curl or Leg Curl", sets: 3, reps: "10", note: "Eccentric phase slow" },
      { name: "Wall Sit", sets: 3, reps: "45s", note: "Quads burning is the goal" },
    ],
    cardio: "15 min bike sprint intervals (30s fast / 90s easy)",
    duration: "55 min",
  },
  {
    week: 3, day: 5, label: "Upper Body Power",
    focus: "Functional Strength · Posture",
    warmup: "5 min row",
    exercises: [
      { name: "Assisted Pull-Up", sets: 4, reps: "8", note: "Less assistance than W1" },
      { name: "DB Bench Press", sets: 4, reps: "10", note: "Controlled descent" },
      { name: "Barbell / DB Upright Row", sets: 3, reps: "12", note: "Elbows flare wide" },
      { name: "Cable Bicep Curl", sets: 3, reps: "12", note: "Constant tension" },
      { name: "Tricep Dip (assisted)", sets: 3, reps: "10", note: "Or bench dip" },
      { name: "Face Pull (heavier)", sets: 3, reps: "15", note: "Protect rotator cuff" },
    ],
    cardio: "10 min cross-trainer (increase resistance)",
    duration: "52 min",
  },
  {
    week: 3, day: 6, label: "Endurance Circuit",
    focus: "60% Strength · 40% Cardio",
    warmup: "3 min jog",
    exercises: [
      { name: "DB Complex (Curl → Press → Squat)", sets: 4, reps: "8 of each", note: "No rest between moves" },
      { name: "KB / DB Swings", sets: 5, reps: "15", note: "Power through hips" },
      { name: "TRX Row or Inverted Row", sets: 3, reps: "10", note: "Body weight pulling" },
      { name: "Lateral Lunge", sets: 3, reps: "10 each", note: "Keep toes forward" },
      { name: "Flutter Kicks", sets: 3, reps: "40s", note: "Lower abs + hip flexors" },
      { name: "Superman Hold", sets: 3, reps: "30s", note: "Lower back & glutes" },
    ],
    cardio: "10 min cool-down walk + full stretch",
    duration: "52 min",
  },
  { week: 3, day: 7, label: "Full REST", focus: "Reward Yourself", warmup: "", exercises: [{ name: "Rest — you've earned it!", sets: 1, reps: "—", note: "Week 4 is the peak week. Prepare mentally." }], cardio: "", duration: "—" },

  // ── WEEK 4 ──
  {
    week: 4, day: 1, label: "Peak Strength A",
    focus: "Heaviest Week · Best Form",
    warmup: "5 min incline walk",
    exercises: [
      { name: "Goblet / Back Squat", sets: 4, reps: "8", note: "Heaviest so far" },
      { name: "DB RDL", sets: 4, reps: "8", note: "Focus on eccentric" },
      { name: "DB Shoulder Press", sets: 4, reps: "8", note: "Controlled, no momentum" },
      { name: "Cable Row (heavy)", sets: 4, reps: "10", note: "Full retraction" },
      { name: "Hip Thrust (heavy)", sets: 4, reps: "10", note: "Drive through heels" },
      { name: "Plank Reach + Row", sets: 3, reps: "10 each", note: "DB in one hand, row it" },
    ],
    cardio: "20 min incline walk (final push!)",
    duration: "55 min",
  },
  {
    week: 4, day: 2, label: "Max HIIT",
    focus: "All-Out Fat Burn",
    warmup: "3 min jog",
    exercises: [
      { name: "Tabata × 2 rounds", sets: 16, reps: "20s on / 10s off", note: "8 min total. Push limits." },
      { name: "Box Jump (or step)", sets: 3, reps: "10", note: "Land softly" },
      { name: "Battle Rope All Styles", sets: 5, reps: "30s", note: "Mix waves, slams, alternating" },
      { name: "Burpee (full)", sets: 3, reps: "10", note: "With jump at top" },
      { name: "Core Finisher: 3 exercises", sets: 3, reps: "30s each", note: "Plank / Leg Raise / Crunch" },
    ],
    cardio: "5 min cool-down",
    duration: "50 min",
  },
  {
    week: 4, day: 3, label: "Active Recovery",
    focus: "Flush the Legs · Stay Fresh",
    warmup: "",
    exercises: [
      { name: "Light swim or 30 min walk", sets: 1, reps: "—", note: "Keep heart rate low" },
      { name: "Full stretch routine", sets: 1, reps: "15 min", note: "Every major muscle group" },
    ],
    cardio: "",
    duration: "45 min",
  },
  {
    week: 4, day: 4, label: "Lower Body Peak",
    focus: "Glutes & Legs at Full Capacity",
    warmup: "5 min dynamic",
    exercises: [
      { name: "Barbell Hip Thrust", sets: 5, reps: "10", note: "Heaviest of the program" },
      { name: "Hack Squat / Leg Press", sets: 4, reps: "10", note: "Max effort last 2 sets" },
      { name: "Walking Lunge (weighted)", sets: 4, reps: "12 each", note: "Heavier DBs" },
      { name: "Seated Leg Curl", sets: 3, reps: "12", note: "Slow, controlled" },
      { name: "Abductor + Adductor", sets: 3, reps: "20 each", note: "Back-to-back superset" },
      { name: "Calf Press (leg press machine)", sets: 4, reps: "20", note: "Full range" },
    ],
    cardio: "15 min sprint bike intervals",
    duration: "55 min",
  },
  {
    week: 4, day: 5, label: "Upper Body Peak",
    focus: "Pull Power · Press Strength",
    warmup: "5 min row (hard pace)",
    exercises: [
      { name: "Pull-Up (assisted, less help)", sets: 4, reps: "8", note: "Beat Week 3" },
      { name: "DB Bench Press", sets: 4, reps: "8", note: "Heaviest of program" },
      { name: "Cable Lateral Raise", sets: 3, reps: "15", note: "Constant tension" },
      { name: "Superset: Curl + Pushdown", sets: 3, reps: "12 each", note: "No rest between" },
      { name: "Rear Delt Fly (heavier)", sets: 3, reps: "12", note: "Posture matters here" },
      { name: "Arnold Press", sets: 3, reps: "10", note: "Final shoulder burn" },
    ],
    cardio: "10 min cross-trainer max effort",
    duration: "52 min",
  },
  {
    week: 4, day: 6, label: "Final Challenge Circuit",
    focus: "Everything You've Got",
    warmup: "3 min jog",
    exercises: [
      { name: "DB Thrusters", sets: 5, reps: "12", note: "Heaviest used in program" },
      { name: "KB Swings", sets: 5, reps: "20", note: "Explosive, powerful" },
      { name: "Box Jump / Step", sets: 3, reps: "10", note: "Celebrate your progress!" },
      { name: "TRX / Inverted Row", sets: 4, reps: "10", note: "Show how far you've come" },
      { name: "Bear Crawl", sets: 3, reps: "25m", note: "You're stronger than Week 1" },
      { name: "Ab Circuit Finisher", sets: 3, reps: "45s each", note: "Plank / Hollow / V-sit" },
    ],
    cardio: "10 min cool-down + full body stretch",
    duration: "55 min",
  },
  { week: 4, day: 7, label: "CELEBRATION REST 🎉", focus: "You Did It!", warmup: "", exercises: [{ name: "Complete rest", sets: 1, reps: "—", note: "Book your next FitQuest assessment and compare results!" }], cardio: "", duration: "—" },
];

// ─── STORAGE HELPERS ──────────────────────────────────────────────
const STORAGE_KEY = "rufitha_tracker_v1";
function loadData() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}
function saveData(d) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); }
  catch {}
}

// ─── COMPONENTS ───────────────────────────────────────────────────
function Tag({ children, color = C.primary }) {
  return (
    <span style={{ background: color + "22", color, fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, letterSpacing: 0.5 }}>
      {children}
    </span>
  );
}

function StatCard({ icon, label, value, sub, color = C.primary }) {
  return (
    <div className="card-hover fade-in" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "18px 16px", textAlign: "center", flex: 1 }}>
      <div style={{ fontSize: 26, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color, fontFamily: "'Playfair Display', serif" }}>{value}</div>
      <div style={{ fontSize: 11, color: C.mid, fontWeight: 500, marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color: C.mid, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────
interface Props { onSwitchUser: () => void }
export default function RufiTracker({ onSwitchUser }: Props) {
  const [tab, setTab] = useState("program");
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedDayIdx, setSelectedDayIdx] = useState(null);
  const [logs, setLogs] = useState(loadData);
  const [setInputs, setSetInputs] = useState({}); // { "sKey|exName|setIdx": { kg: "", reps: "" } }
  const [weightLog, setWeightLog] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("rufitha_weight_log"));
      return Array.isArray(stored) ? stored : [];
    } catch { return []; }
  });
  const [weightInput, setWeightInput] = useState("");

  useEffect(() => { saveData(logs); }, [logs]);
  useEffect(() => {
    try { localStorage.setItem("rufitha_weight_log", JSON.stringify(weightLog)); }
    catch {}
  }, [weightLog]);

  const weekDays = PROGRAM.filter(d => d.week === selectedWeek);

  function toggleExercise(sessionKey, exName) {
    setLogs(prev => {
      const session = prev[sessionKey] || {};
      return { ...prev, [sessionKey]: { ...session, [exName]: !session[exName] } };
    });
  }

  function getSetKey(sKey, exName, setIdx) { return `${sKey}|${exName}|${setIdx}`; }

  function getSetData(sKey, exName, setIdx) {
    return (logs[`set_${sKey}_${exName}_${setIdx}`]) || { kg: "", reps: "" };
  }

  function saveSetData(sKey, exName, setIdx, field, value) {
    const key = `set_${sKey}_${exName}_${setIdx}`;
    setLogs(prev => ({
      ...prev,
      [key]: { ...(prev[key] || { kg: "", reps: "" }), [field]: value }
    }));
  }

  function isExerciseDone(sKey, exName, totalSets) {
    for (let i = 0; i < totalSets; i++) {
      const d = logs[`set_${sKey}_${exName}_${i}`];
      if (!d || (!d.kg && !d.reps)) return false;
    }
    return true;
  }

  function markSessionDone(sessionKey) {
    setLogs(prev => ({ ...prev, [sessionKey + "_done"]: true }));
  }

  function getSessionKey(week, day) { return `w${week}_d${day}`; }

  function totalDone() {
    return PROGRAM.filter(p => logs[getSessionKey(p.week, p.day) + "_done"]).length;
  }

  function exportBackup() {
    const blob = new Blob([JSON.stringify({ logs, weightLog }, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `rufitha-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click();
  }

  const selectedDay = selectedDayIdx !== null ? weekDays[selectedDayIdx] : null;

  // ── SESSION DETAIL VIEW ───────────────────────────────────────
  if (selectedDay) {
    const sKey = getSessionKey(selectedDay.week, selectedDay.day);
    const sessionLog = logs[sKey] || {};
    const isDone = !!logs[sKey + "_done"];
    const isRest = selectedDay.label.toLowerCase().includes("rest");

    return (
      <div style={{ minHeight: "100vh", background: C.bg, padding: "0 0 80px 0" }}>
        <style>{FONTS}</style>
        {/* Header */}
        <div style={{ background: C.primary, padding: "20px 20px 28px", position: "relative" }}>
          <button onClick={() => setSelectedDayIdx(null)} style={{ background: "rgba(255,255,255,0.25)", border: "none", borderRadius: 20, padding: "6px 14px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 12 }}>
            ← Back
          </button>
          <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
            <Tag color="#fff">Week {selectedDay.week}</Tag>
            <Tag color="#fff">Day {selectedDay.day}</Tag>
            {isDone && <Tag color="#fff">✅ Done</Tag>}
          </div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: "#fff", fontWeight: 900, lineHeight: 1.2, marginBottom: 4 }}>
            {selectedDay.label}
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>{selectedDay.focus}</div>
          <div style={{ marginTop: 8, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>⏱ {selectedDay.duration}</div>
        </div>

        <div style={{ padding: "20px 16px" }}>
          {/* Warm-Up */}
          {selectedDay.warmup && (
            <div className="fade-in" style={{ background: C.secondary + "22", border: `1px solid ${C.secondary}55`, borderRadius: 12, padding: 14, marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.secondary, marginBottom: 4 }}>🔥 WARM-UP</div>
              <div style={{ fontSize: 14, color: C.dark }}>{selectedDay.warmup}</div>
            </div>
          )}

          {/* Progress bar */}
          {!isRest && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.mid }}>EXERCISES LOGGED</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.primary }}>
                  {selectedDay.exercises.filter(e => isExerciseDone(sKey, e.name, e.sets)).length}/{selectedDay.exercises.length}
                </span>
              </div>
              <div style={{ background: C.border, borderRadius: 8, height: 8 }}>
                <div style={{ background: `linear-gradient(90deg, ${C.primary}, ${C.secondary})`, height: 8, borderRadius: 8, width: `${(selectedDay.exercises.filter(e => isExerciseDone(sKey, e.name, e.sets)).length / selectedDay.exercises.length) * 100}%`, transition: "width 0.4s" }} />
              </div>
            </div>
          )}

          {/* Exercises */}
          {selectedDay.exercises.map((ex, i) => {
            const isRest2 = ex.sets === 1 && ex.reps === "—";
            const allLogged = !isRest2 && isExerciseDone(sKey, ex.name, ex.sets);
            const ytQuery = encodeURIComponent(`${ex.name} exercise proper form tutorial`);
            const ytUrl = `https://www.youtube.com/results?search_query=${ytQuery}`;
            return (
              <div key={i} className="fade-in" style={{ background: allLogged ? C.accent + "12" : C.card, border: `1.5px solid ${allLogged ? C.accent : C.border}`, borderRadius: 14, padding: 16, marginBottom: 12, transition: "all 0.25s" }}>
                {/* Exercise header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: allLogged ? C.accent : C.dark }}>{ex.name}</span>
                      {allLogged && <span style={{ fontSize: 14 }}>✅</span>}
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                      {ex.sets > 1 && <Tag color={C.primary}>{ex.sets} sets</Tag>}
                      <Tag color={C.secondary}>{ex.reps}</Tag>
                    </div>
                    <div style={{ fontSize: 12, color: C.mid, fontStyle: "italic" }}>💡 {ex.note}</div>
                  </div>
                </div>

                {/* Per-set logging rows */}
                {!isRest2 && (
                  <a
                    href={ytUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: 8, background: "#FF000012", border: "1px solid #FF000033", borderRadius: 8, padding: "8px 12px", marginBottom: 12, textDecoration: "none" }}
                  >
                    <div style={{ width: 24, height: 24, background: "#FF0000", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ color: "#fff", fontSize: 10, fontWeight: 900, marginLeft: 2 }}>▶</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#CC0000" }}>Watch demo on YouTube</span>
                  </a>
                )}
                {/* Set logging */}
                {!isRest2 && (
                  <div style={{ marginTop: 10 }}>
                    {/* Column headers */}
                    <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr", gap: 6, marginBottom: 6, paddingLeft: 2 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: C.mid, textTransform: "uppercase" }}>Set</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: C.mid, textTransform: "uppercase", textAlign: "center" }}>kg</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: C.mid, textTransform: "uppercase", textAlign: "center" }}>Reps</span>
                    </div>
                    {Array.from({ length: ex.sets }, (_, si) => {
                      const d = logs[`set_${sKey}_${ex.name}_${si}`] || { kg: "", reps: "" };
                      const setDone = d.kg !== "" || d.reps !== "";
                      return (
                        <div key={si} style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr", gap: 6, marginBottom: 6, alignItems: "center" }}>
                          <div style={{ width: 28, height: 28, background: setDone ? C.accent : C.light, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: setDone ? "#fff" : C.mid }}>
                            {si + 1}
                          </div>
                          <input
                            type="number"
                            placeholder="kg"
                            value={d.kg}
                            onChange={e => saveSetData(sKey, ex.name, si, "kg", e.target.value)}
                            style={{ border: `1.5px solid ${setDone ? C.accent + "88" : C.border}`, borderRadius: 8, padding: "8px 10px", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", background: setDone ? C.accent + "0D" : C.light, color: C.dark, textAlign: "center", width: "100%" }}
                          />
                          <input
                            type="number"
                            placeholder={ex.reps}
                            value={d.reps}
                            onChange={e => saveSetData(sKey, ex.name, si, "reps", e.target.value)}
                            style={{ border: `1.5px solid ${setDone ? C.accent + "88" : C.border}`, borderRadius: 8, padding: "8px 10px", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", background: setDone ? C.accent + "0D" : C.light, color: C.dark, textAlign: "center", width: "100%" }}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Cardio */}
          {selectedDay.cardio && (
            <div className="fade-in" style={{ background: C.primary + "15", border: `1px solid ${C.primary}44`, borderRadius: 12, padding: 14, marginTop: 4, marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.primary, marginBottom: 4 }}>🏃‍♀️ CARDIO</div>
              <div style={{ fontSize: 14, color: C.dark }}>{selectedDay.cardio}</div>
            </div>
          )}

          {/* Mark Done */}
          {!isRest && (
            <button onClick={() => markSessionDone(sKey)} style={{ width: "100%", background: isDone ? C.accent : `linear-gradient(135deg, ${C.primary}, ${C.secondary})`, border: "none", borderRadius: 16, padding: "18px 0", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 16, cursor: "pointer", letterSpacing: 0.5, marginTop: 4, animation: isDone ? "none" : "pulse 2s infinite" }}>
              {isDone ? "✅ Session Complete!" : "Mark Session Done 🎯"}
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── MAIN TABS ─────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: C.bg, paddingBottom: 24 }}>
      <style>{FONTS}</style>

      {/* Hero Header */}
      <div style={{ background: `linear-gradient(145deg, ${C.primary} 0%, ${C.secondary} 100%)`, padding: "28px 20px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, background: "rgba(255,255,255,0.08)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: -20, left: -10, width: 80, height: 80, background: "rgba(255,255,255,0.08)", borderRadius: "50%" }} />
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 2, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", marginBottom: 6 }}>
          4-Week Fat Loss Program
        </div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 900, color: "#fff", lineHeight: 1.15, marginBottom: 8 }}>
          Let's Go, Rufitha! 💪
        </div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.9)" }}>
          Weight loss · Fat burn · Stamina · Energy
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
          <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "#fff" }}>
            🎯 {totalDone()}/28 sessions
          </div>
          <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "#fff" }}>
            BMI 22.5 · 61.2kg
          </div>
          <a
            href="https://www.youtube.com/results?search_query=how+to+use+gym+tracker+app"
            target="_blank"
            rel="noopener noreferrer"
            style={{ background: "#FF0000", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 700, color: "#fff", textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}
          >
            ▶ Watch Demo
          </a>
        </div>
      </div>

      <div style={{ display: "flex", background: C.card, borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 100 }}>
        {[
          { id: "program", label: "📋 Program" },
          { id: "stats",   label: "📊 Stats"   },
          { id: "report",  label: "📈 Report"  },
        ].map(({ id, label }) => (
          <button key={id} onClick={() => setTab(id)} style={{ flex: 1, background: "none", border: "none", borderBottom: `3px solid ${tab === id ? C.primary : "transparent"}`, padding: "14px 0", color: tab === id ? C.primary : C.mid, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer", textTransform: "capitalize", letterSpacing: 0.3, transition: "all 0.2s" }}>
            {label}
          </button>
        ))}
      </div>

      {/* ── PROGRAM TAB ── */}
      {tab === "program" && (
        <div style={{ padding: "20px 16px" }}>
          {/* Week selector */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
            {[1, 2, 3, 4].map(w => {
              const wDone = PROGRAM.filter(d => d.week === w && logs[getSessionKey(d.week, d.day) + "_done"]).length;
              const wTotal = PROGRAM.filter(d => d.week === w).length;
              return (
                <button key={w} onClick={() => setSelectedWeek(w)} style={{ flexShrink: 0, background: selectedWeek === w ? C.primary : C.card, border: `1.5px solid ${selectedWeek === w ? C.primary : C.border}`, borderRadius: 14, padding: "12px 20px", cursor: "pointer", textAlign: "center", minWidth: 90 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: selectedWeek === w ? "#fff" : C.mid }}>WEEK {w}</div>
                  <div style={{ fontSize: 11, color: selectedWeek === w ? "rgba(255,255,255,0.8)" : C.mid, marginTop: 2 }}>{wDone}/{wTotal} done</div>
                  {wDone === wTotal && <div style={{ fontSize: 14, marginTop: 2 }}>🏅</div>}
                </button>
              );
            })}
          </div>

          {/* Week theme */}
          <div style={{ background: C.light, borderRadius: 12, padding: "12px 16px", marginBottom: 18, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.mid, marginBottom: 2 }}>WEEK {selectedWeek} FOCUS</div>
            <div style={{ fontSize: 13, color: C.dark }}>
              {selectedWeek === 1 && "🌱 Foundation — learn the movements, establish habits"}
              {selectedWeek === 2 && "📈 Build — add weight/reps, push a little harder"}
              {selectedWeek === 3 && "🔥 Intensity — shorter rest, heavier loads, more sweat"}
              {selectedWeek === 4 && "🏆 Peak — your absolute best. Celebrate it all."}
            </div>
          </div>

          {/* Day cards */}
          {weekDays.map((day, i) => {
            const sKey = getSessionKey(day.week, day.day);
            const isDone = !!logs[sKey + "_done"];
            const isRest = day.label.toLowerCase().includes("rest");
            return (
              <div key={i} className="card-hover fade-in" onClick={() => setSelectedDayIdx(i)} style={{ background: isDone ? C.accent + "12" : C.card, border: `1.5px solid ${isDone ? C.accent : C.border}`, borderRadius: 16, padding: 18, marginBottom: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 48, height: 48, background: isRest ? C.light : isDone ? C.accent : C.primary, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                  {isRest ? "😴" : isDone ? "✅" : ["💪", "🔥", "🏋️", "🦵", "💪", "⚡"][i % 6]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: C.primary }}>DAY {day.day}</span>
                    {isDone && <Tag color={C.accent}>Done</Tag>}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: isDone ? C.accent : C.dark, marginBottom: 2 }}>{day.label}</div>
                  <div style={{ fontSize: 12, color: C.mid }}>{day.focus}</div>
                  <div style={{ fontSize: 11, color: C.mid, marginTop: 2 }}>⏱ {day.duration} · {day.exercises.length} exercises</div>
                </div>
                <div style={{ color: C.mid, fontSize: 18 }}>›</div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── STATS TAB ── */}
      {tab === "stats" && (
        <div style={{ padding: "20px 16px" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: C.dark, fontWeight: 900, marginBottom: 6 }}>Starting Stats</div>
          <div style={{ fontSize: 13, color: C.mid, marginBottom: 16 }}>From your FitQuest assessment</div>

          {/* Storage notice */}
          <div style={{ background: "#FFF8E7", border: "1px solid #F4A26144", borderRadius: 12, padding: "12px 14px", marginBottom: 20, display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>💾</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.dark, marginBottom: 2 }}>About your data</div>
              <div style={{ fontSize: 11, color: C.mid, lineHeight: 1.6 }}>
                Logs are saved to <strong>this browser only</strong> (localStorage). They persist across sessions on the same device but <strong>won't sync to other devices</strong>. Use <em>Export Backup</em> below to save a file and restore it anywhere.
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <StatCard icon="⚖️" label="Weight" value="61.2kg" sub="Healthy range" color={C.accent} />
            <StatCard icon="🔢" label="BMI" value="22.5" sub="Normal" color={C.accent} />
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <StatCard icon="🧈" label="Body Fat" value="31%" sub="↓ Target: 22–26%" color={C.primary} />
            <StatCard icon="💪" label="Muscle" value="35%" sub="↑ Target: 40%+" color={C.secondary} />
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
            <StatCard icon="🧠" label="Metabolic Age" value="36 yrs" sub="Match your real age!" color={C.mid} />
            <StatCard icon="🔥" label="BMR" value="1,285" sub="kcal / day" color={C.mid} />
          </div>

          {/* 4-week goal */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18, marginBottom: 24 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: C.dark, fontWeight: 700, marginBottom: 12 }}>🎯 4-Week Goal</div>
            {[
              { label: "Fat Loss", target: "−2 to 3 kg of fat", how: "Calorie deficit + cardio" },
              { label: "Stamina", target: "30 min cardio without stopping", how: "Weekly progression" },
              { label: "Energy", target: "Feel lighter by Week 2", how: "Sleep + protein + movement" },
              { label: "Muscle", target: "Maintain / slight gain", how: "Resistance training" },
            ].map(g => (
              <div key={g.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.dark }}>{g.label}</div>
                  <div style={{ fontSize: 12, color: C.mid }}>{g.how}</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.primary, textAlign: "right", maxWidth: 130 }}>{g.target}</div>
              </div>
            ))}
          </div>

          {/* Weight log */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: C.dark, fontWeight: 700 }}>📉 Weight Log</div>
              {weightLog.length > 0 && (
                <button onClick={() => { setWeightLog([]); localStorage.removeItem("rufitha_weight_log"); }} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "4px 10px", fontSize: 11, color: C.mid, cursor: "pointer" }}>
                  Clear
                </button>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <input type="number" placeholder="kg today" value={weightInput} onChange={e => setWeightInput(e.target.value)} style={{ flex: 1, border: `1.5px solid ${C.border}`, borderRadius: 10, padding: "10px 12px", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", background: C.light }} />
              <button onClick={() => { if (weightInput) { setWeightLog(prev => [...prev, { date: new Date().toLocaleDateString("en-GB"), kg: parseFloat(weightInput) }]); setWeightInput(""); } }} style={{ background: C.primary, border: "none", borderRadius: 10, padding: "10px 18px", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                Log
              </button>
            </div>
            {weightLog.length === 0 && <div style={{ fontSize: 13, color: C.mid, textAlign: "center", padding: "12px 0" }}>No entries yet — log your first weight!</div>}
            {weightLog.map((entry, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 13, color: C.mid }}>{entry.date}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.primary }}>{entry.kg} kg</span>
              </div>
            ))}
            {weightLog.length > 1 && (() => {
              const diff = (weightLog[weightLog.length - 1].kg - weightLog[0].kg).toFixed(1);
              return (
                <div style={{ marginTop: 12, padding: "10px 14px", background: diff < 0 ? C.accent + "22" : C.primary + "15", borderRadius: 10, fontSize: 13, fontWeight: 600, color: diff < 0 ? C.accent : C.primary }}>
                  {diff < 0 ? `🎉 Lost ${Math.abs(diff)} kg since you started!` : `+${diff} kg from start`}
                </div>
              );
            })()}
          </div>

          {/* Backup */}
          <button onClick={exportBackup} style={{ width: "100%", background: C.light, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: "14px 0", color: C.dark, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
            ⬇️ Export Backup
          </button>
          <button onClick={onSwitchUser} style={{ 
            width: "100%", background: "#FDF6F0", 
            border: "1.5px solid #EDE0D8", borderRadius: 14, 
            padding: "14px 0", color: "#1A1A2E", 
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700, fontSize: 14, cursor: "pointer",
            marginTop: 10
          }}>
            👤 Switch User
          </button>
        </div>
      )}

      {/* ── REPORT TAB ── */}
      {tab === "report" && (() => {
        // ── data crunching ──────────────────────────────────────────
        // Sessions completed per week
        const sessionsPerWeek = [1,2,3,4].map(w => ({
          week: w,
          done: PROGRAM.filter(d => d.week === w && logs[getSessionKey(d.week, d.day) + "_done"]).length,
          total: PROGRAM.filter(d => d.week === w).length,
        }));

        // Total volume (kg × reps) per week from set logs
        const volumePerWeek = [1,2,3,4].map(w => {
          let vol = 0;
          PROGRAM.filter(d => d.week === w).forEach(day => {
            const sk = getSessionKey(day.week, day.day);
            day.exercises.forEach(ex => {
              for (let si = 0; si < ex.sets; si++) {
                const d = logs[`set_${sk}_${ex.name}_${si}`];
                if (d && d.kg && d.reps) vol += parseFloat(d.kg) * parseFloat(d.reps);
              }
            });
          });
          return { week: w, vol: Math.round(vol) };
        });

        // Top 5 exercises by max kg lifted (across all sets/weeks)
        const exMaxKg = {};
        PROGRAM.forEach(day => {
          const sk = getSessionKey(day.week, day.day);
          day.exercises.forEach(ex => {
            for (let si = 0; si < ex.sets; si++) {
              const d = logs[`set_${sk}_${ex.name}_${si}`];
              if (d && d.kg) {
                const kg = parseFloat(d.kg);
                if (!exMaxKg[ex.name] || kg > exMaxKg[ex.name]) exMaxKg[ex.name] = kg;
              }
            }
          });
        });
        const topExercises = Object.entries(exMaxKg)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);

        // Weight trend
        const hasWeight = weightLog.length > 0;
        const weightStart = hasWeight ? weightLog[0].kg : 61.2;
        const weightLatest = hasWeight ? weightLog[weightLog.length - 1].kg : null;
        const weightDiff = weightLatest !== null ? (weightLatest - weightStart).toFixed(1) : null;

        // Total sets logged
        const totalSetsLogged = Object.keys(logs).filter(k => k.startsWith("set_")).length;
        const totalSessionsDone = totalDone();
        const totalVolume = volumePerWeek.reduce((a, v) => a + v.vol, 0);

        // ── SVG helpers ────────────────────────────────────────────
        const maxVol = Math.max(...volumePerWeek.map(v => v.vol), 1);
        const maxEx = topExercises.length ? topExercises[0][1] : 1;

        // Weight line chart
        const WH = 120, WW = 300;
        const wPts = weightLog.length > 1 ? weightLog : null;
        const wMin = wPts ? Math.min(...wPts.map(p => p.kg)) - 1 : 59;
        const wMax = wPts ? Math.max(...wPts.map(p => p.kg)) + 1 : 63;
        const wX = (i) => 20 + (i / (wPts ? wPts.length - 1 : 1)) * (WW - 40);
        const wY = (kg) => WH - 20 - ((kg - wMin) / (wMax - wMin)) * (WH - 30);

        return (
          <div style={{ padding: "20px 16px 32px" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: C.dark, fontWeight: 900, marginBottom: 4 }}>Progress Report</div>
            <div style={{ fontSize: 13, color: C.mid, marginBottom: 20 }}>Built from your logged sessions</div>

            {/* ── Summary pills ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
              {[
                { label: "Sessions", value: `${totalSessionsDone}/28`, icon: "🗓️" },
                { label: "Sets Done", value: totalSetsLogged, icon: "📋" },
                { label: "Total Volume", value: totalVolume > 0 ? `${(totalVolume/1000).toFixed(1)}t` : "—", icon: "🏋️" },
              ].map(s => (
                <div key={s.label} className="fade-in" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 22 }}>{s.icon}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: C.primary, fontFamily: "'Playfair Display', serif", marginTop: 4 }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: C.mid, fontWeight: 600, marginTop: 2, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* ── Sessions per week bar chart ── */}
            <div className="fade-in" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.dark, marginBottom: 16 }}>📅 Sessions Completed by Week</div>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                {sessionsPerWeek.map(({ week, done, total }) => {
                  const pct = done / total;
                  const barH = Math.max(pct * 80, done > 0 ? 6 : 0);
                  return (
                    <div key={week} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: pct === 1 ? C.accent : C.primary }}>{done}/{total}</div>
                      <div style={{ width: "100%", background: C.light, borderRadius: 8, height: 80, display: "flex", alignItems: "flex-end" }}>
                        <div style={{
                          width: "100%", height: `${barH}px`,
                          background: pct === 1
                            ? `linear-gradient(180deg, ${C.accent}, #52b788)`
                            : `linear-gradient(180deg, ${C.primary}, ${C.secondary})`,
                          borderRadius: 8, transition: "height 0.6s ease"
                        }} />
                      </div>
                      <div style={{ fontSize: 11, color: C.mid, fontWeight: 600 }}>Wk {week}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Volume per week bar chart ── */}
            <div className="fade-in" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.dark, marginBottom: 4 }}>⚡ Total Volume Lifted by Week</div>
              <div style={{ fontSize: 11, color: C.mid, marginBottom: 14 }}>kg × reps across all exercises</div>
              {volumePerWeek.every(v => v.vol === 0) ? (
                <div style={{ textAlign: "center", padding: "20px 0", fontSize: 13, color: C.mid }}>Log some sets to see volume data 💪</div>
              ) : (
                <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                  {volumePerWeek.map(({ week, vol }) => {
                    const barH = maxVol > 0 ? Math.max((vol / maxVol) * 80, vol > 0 ? 6 : 0) : 0;
                    return (
                      <div key={week} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: C.secondary }}>{vol > 0 ? `${vol}` : "—"}</div>
                        <div style={{ width: "100%", background: C.light, borderRadius: 8, height: 80, display: "flex", alignItems: "flex-end" }}>
                          <div style={{
                            width: "100%", height: `${barH}px`,
                            background: `linear-gradient(180deg, ${C.secondary}, #e76f51)`,
                            borderRadius: 8, transition: "height 0.6s ease"
                          }} />
                        </div>
                        <div style={{ fontSize: 11, color: C.mid, fontWeight: 600 }}>Wk {week}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Top exercises by max kg ── */}
            <div className="fade-in" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.dark, marginBottom: 4 }}>🏆 Top Lifts — Max kg</div>
              <div style={{ fontSize: 11, color: C.mid, marginBottom: 14 }}>Highest weight recorded per exercise</div>
              {topExercises.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px 0", fontSize: 13, color: C.mid }}>No weights logged yet</div>
              ) : (
                topExercises.map(([name, kg], i) => {
                  const pct = kg / maxEx;
                  return (
                    <div key={name} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: C.dark }}>{name}</span>
                          {i === 0 && <span style={{ fontSize: 12 }}>🥇</span>}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 800, color: C.primary }}>{kg} kg</span>
                      </div>
                      <div style={{ background: C.light, borderRadius: 20, height: 10, overflow: "hidden" }}>
                        <div style={{
                          height: "100%", borderRadius: 20,
                          width: `${pct * 100}%`,
                          background: i === 0
                            ? `linear-gradient(90deg, ${C.primary}, ${C.secondary})`
                            : `linear-gradient(90deg, ${C.primary}99, ${C.secondary}88)`,
                          transition: "width 0.7s ease"
                        }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* ── Weight trend line chart ── */}
            <div className="fade-in" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.dark }}>⚖️ Body Weight Trend</div>
                {weightDiff !== null && (
                  <span style={{ fontSize: 12, fontWeight: 700, color: parseFloat(weightDiff) <= 0 ? C.accent : C.primary }}>
                    {parseFloat(weightDiff) <= 0 ? `↓ ${Math.abs(weightDiff)} kg` : `↑ ${weightDiff} kg`}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 11, color: C.mid, marginBottom: 12 }}>Starting: 61.2 kg · Target: 58–59 kg</div>

              {!wPts || wPts.length < 2 ? (
                <div style={{ textAlign: "center", padding: "20px 0", fontSize: 13, color: C.mid }}>
                  Log at least 2 weights in the Stats tab to see your trend 📉
                </div>
              ) : (
                <svg viewBox={`0 0 ${WW} ${WH}`} style={{ width: "100%", height: "auto", overflow: "visible" }}>
                  {/* Grid lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map(f => {
                    const y = WH - 20 - f * (WH - 30);
                    const kg = (wMin + f * (wMax - wMin)).toFixed(1);
                    return (
                      <g key={f}>
                        <line x1={20} y1={y} x2={WW - 10} y2={y} stroke={C.border} strokeWidth={0.8} strokeDasharray="4 3" />
                        <text x={14} y={y + 3} fontSize={8} fill={C.mid} textAnchor="end">{kg}</text>
                      </g>
                    );
                  })}
                  {/* Target line */}
                  <line x1={20} y1={wY(59)} x2={WW - 10} y2={wY(59)} stroke={C.accent} strokeWidth={1} strokeDasharray="6 3" opacity={0.6} />
                  <text x={WW - 8} y={wY(59) - 3} fontSize={8} fill={C.accent} textAnchor="end">Target</text>
                  {/* Filled area */}
                  <defs>
                    <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.primary} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={C.primary} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <path
                    d={[
                      `M ${wX(0)} ${wY(wPts[0].kg)}`,
                      ...wPts.slice(1).map((p, i) => `L ${wX(i+1)} ${wY(p.kg)}`),
                      `L ${wX(wPts.length - 1)} ${WH - 20}`,
                      `L ${wX(0)} ${WH - 20} Z`
                    ].join(" ")}
                    fill="url(#wGrad)"
                  />
                  {/* Line */}
                  <polyline
                    points={wPts.map((p, i) => `${wX(i)},${wY(p.kg)}`).join(" ")}
                    fill="none" stroke={C.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                  />
                  {/* Dots + labels */}
                  {wPts.map((p, i) => (
                    <g key={i}>
                      <circle cx={wX(i)} cy={wY(p.kg)} r={4} fill="#fff" stroke={C.primary} strokeWidth={2} />
                      <text x={wX(i)} y={wY(p.kg) - 8} fontSize={8} fill={C.dark} textAnchor="middle" fontWeight="700">{p.kg}</text>
                      {i === wPts.length - 1 || i === 0 ? (
                        <text x={wX(i)} y={WH - 8} fontSize={8} fill={C.mid} textAnchor="middle">{p.date.slice(0, 5)}</text>
                      ) : null}
                    </g>
                  ))}
                </svg>
              )}
            </div>

            {/* ── Weekly completion rings ── */}
            <div className="fade-in" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.dark, marginBottom: 16 }}>🎯 Completion Rings</div>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                {sessionsPerWeek.map(({ week, done, total }) => {
                  const pct = done / total;
                  const r = 28, circ = 2 * Math.PI * r;
                  const dash = pct * circ;
                  const full = pct === 1;
                  return (
                    <div key={week} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                      <svg width={72} height={72} viewBox="0 0 72 72">
                        <circle cx={36} cy={36} r={r} fill="none" stroke={C.light} strokeWidth={7} />
                        <circle cx={36} cy={36} r={r} fill="none"
                          stroke={full ? C.accent : C.primary}
                          strokeWidth={7}
                          strokeDasharray={`${dash} ${circ}`}
                          strokeLinecap="round"
                          transform="rotate(-90 36 36)"
                        />
                        <text x={36} y={36} textAnchor="middle" dominantBaseline="middle" fontSize={12} fontWeight="800" fill={full ? C.accent : C.dark}>
                          {Math.round(pct * 100)}%
                        </text>
                      </svg>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.mid }}>Week {week}</div>
                      <div style={{ fontSize: 10, color: C.mid }}>{done}/{total}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Export */}
            <button onClick={exportBackup} style={{ width: "100%", background: C.light, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: "14px 0", color: C.dark, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              ⬇️ Export Backup
            </button>
          </div>
        );
      })()}


    </div>
  );
}