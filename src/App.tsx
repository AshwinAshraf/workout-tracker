import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import UserSelect from './UserSelect'
import RufiTracker from './RufiTracker'

// ─── SUPABASE CONFIG ───────────────────────────────────────────────
const supabase = createClient(
  'https://swfgpzoincmzgpjbmude.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3Zmdwem9pbmNtemdwamJtdWRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMzU3OTcsImV4cCI6MjA5MjgxMTc5N30.cSg-HyozCKKbtTg09SmCBcJHYhIGmcPhhh0XcPIzjzs'
)

// YouTube search URLs for each exercise - opens correct demo video search
// We embed these as clickable links since iframe embedding requires API key
// Instead we show a styled "Watch Demo" button that opens YouTube search
const YOUTUBE_SEARCH = {
  "Barbell Bench Press":         "barbell+bench+press+form+tutorial",
  "Incline Dumbbell Press":      "incline+dumbbell+press+form+tutorial",
  "Cable Lateral Raises":        "cable+lateral+raise+form+tutorial",
  "Overhead Press (Smith)":      "smith+machine+overhead+press+tutorial",
  "Tricep Rope Pushdowns":       "tricep+rope+pushdown+form+tutorial",
  "Barbell Bent-Over Row":       "barbell+bent+over+row+form+tutorial",
  "Lat Pulldown (Wide Grip)":    "wide+grip+lat+pulldown+form+tutorial",
  "Seated Cable Row":            "seated+cable+row+form+tutorial",
  "Face Pulls":                  "face+pull+form+tutorial",
  "Dumbbell Bicep Curl":         "dumbbell+bicep+curl+form+tutorial",
  "Overhead Barbell Press":      "overhead+barbell+press+form+tutorial",
  "Incline Barbell Press":       "incline+barbell+press+form+tutorial",
  "Dumbbell Lateral Raises":     "dumbbell+lateral+raise+form+tutorial",
  "Cable Chest Fly":             "cable+chest+fly+form+tutorial",
  "EZ Bar Skull Crusher":        "ez+bar+skull+crusher+form+tutorial",
  "Weighted Pull-Ups":           "weighted+pull+ups+form+tutorial",
  "Single-Arm DB Row":           "single+arm+dumbbell+row+form+tutorial",
  "Cable Straight-Arm Pulldown": "cable+straight+arm+pulldown+tutorial",
  "Reverse Pec Deck Fly":        "reverse+pec+deck+fly+form+tutorial",
  "Hammer Curl":                 "hammer+curl+form+tutorial",
  "Box Squat (to bench)":        "box+squat+form+tutorial",
  "Goblet Squat (DB)":           "goblet+squat+form+tutorial",
  "Leg Press":                   "leg+press+form+tutorial",
  "Lying Leg Curl":              "lying+leg+curl+form+tutorial",
  "Standing Calf Raises":        "standing+calf+raises+form+tutorial",
  "Romanian Deadlift":           "romanian+deadlift+form+tutorial",
  "Step-Up (DB)":                "dumbbell+step+up+form+tutorial",
  "Hip Thrust (Barbell)":        "barbell+hip+thrust+form+tutorial",
  "Plank":                       "plank+form+tutorial",
  "Jump Rope":                   "jump+rope+workout+technique+beginner",
  "🌅 WARMUP (do first)":        "dynamic+warmup+routine+gym",
};

// Muscle diagram colors per exercise
const MUSCLE_INFO = {
  "Barbell Bench Press":         { primary: "Chest", secondary: "Triceps, Front Delts", color: "#FF6B35" },
  "Incline Dumbbell Press":      { primary: "Upper Chest", secondary: "Triceps, Front Delts", color: "#FF6B35" },
  "Cable Lateral Raises":        { primary: "Side Delts", secondary: "Traps", color: "#FF8E53" },
  "Overhead Press (Smith)":      { primary: "Front Delts", secondary: "Triceps, Traps", color: "#FF8E53" },
  "Tricep Rope Pushdowns":       { primary: "Triceps", secondary: "Forearms", color: "#FF6B35" },
  "Barbell Bent-Over Row":       { primary: "Lats, Mid Back", secondary: "Biceps, Rear Delts", color: "#4ECDC4" },
  "Lat Pulldown (Wide Grip)":    { primary: "Lats", secondary: "Biceps, Mid Back", color: "#4ECDC4" },
  "Seated Cable Row":            { primary: "Mid Back", secondary: "Lats, Biceps", color: "#4ECDC4" },
  "Face Pulls":                  { primary: "Rear Delts", secondary: "Rotator Cuff, Traps", color: "#26C6DA" },
  "Dumbbell Bicep Curl":         { primary: "Biceps", secondary: "Forearms", color: "#4ECDC4" },
  "Overhead Barbell Press":      { primary: "Front Delts", secondary: "Triceps, Traps", color: "#FF8E53" },
  "Incline Barbell Press":       { primary: "Upper Chest", secondary: "Triceps, Front Delts", color: "#FF6B35" },
  "Dumbbell Lateral Raises":     { primary: "Side Delts", secondary: "Traps", color: "#FF8E53" },
  "Cable Chest Fly":             { primary: "Chest", secondary: "Front Delts", color: "#FF6B35" },
  "EZ Bar Skull Crusher":        { primary: "Triceps", secondary: "Forearms", color: "#FF6B35" },
  "Weighted Pull-Ups":           { primary: "Lats", secondary: "Biceps, Mid Back", color: "#4ECDC4" },
  "Single-Arm DB Row":           { primary: "Lats, Mid Back", secondary: "Biceps, Rear Delts", color: "#4ECDC4" },
  "Cable Straight-Arm Pulldown": { primary: "Lats", secondary: "Triceps Long Head", color: "#26C6DA" },
  "Reverse Pec Deck Fly":        { primary: "Rear Delts", secondary: "Mid Traps, Rhomboids", color: "#26C6DA" },
  "Hammer Curl":                 { primary: "Brachialis", secondary: "Biceps, Forearms", color: "#4ECDC4" },
  "Box Squat (to bench)":        { primary: "Quads", secondary: "Glutes, Hamstrings", color: "#45B7D1" },
  "Goblet Squat (DB)":           { primary: "Quads", secondary: "Glutes, Core", color: "#45B7D1" },
  "Leg Press":                   { primary: "Quads", secondary: "Glutes, Hamstrings", color: "#45B7D1" },
  "Lying Leg Curl":              { primary: "Hamstrings", secondary: "Glutes, Calves", color: "#45B7D1" },
  "Standing Calf Raises":        { primary: "Calves", secondary: "Soleus", color: "#45B7D1" },
  "Romanian Deadlift":           { primary: "Hamstrings", secondary: "Glutes, Lower Back", color: "#7C4DFF" },
  "Step-Up (DB)":                { primary: "Quads", secondary: "Glutes, Hamstrings", color: "#7C4DFF" },
  "Hip Thrust (Barbell)":        { primary: "Glutes", secondary: "Hamstrings, Core", color: "#7C4DFF" },
  "Plank":                       { primary: "Core", secondary: "Shoulders, Glutes", color: "#7C4DFF" },
  "Jump Rope":                   { primary: "Calves, Cardio", secondary: "Shoulders, Core, Coordination", color: "#7C4DFF" },
  "🌅 WARMUP (do first)":        { primary: "Full Body", secondary: "Joints, Tendons, Core Temp", color: "#F59E0B" },
};

const PLAN = {
  weeks: [
    {
      week: 1,
      theme: "Foundation & Form",
      focus: "Learn the movements. Controlled tempo, mind-muscle connection. Don't rush — nail your form this week.",
      days: [
        {
          day: 1, label: "Monday", split: "Push A", focus: "Chest Focus",
          duration: "~55 min",
          exercises: [
            { name: "🌅 WARMUP (do first)", sets: 1, reps: "8 min", rest: "—", tempo: "Dynamic", notes: "5 min treadmill walk (brisk) → Arm circles ×10 each direction, Band pull-aparts ×15, Chest openers ×10, Shoulder rotations ×10 each, Wrist circles ×10. Gets chest, shoulders & triceps ready." },
            { name: "Barbell Bench Press",     sets: 4, reps: "8",      rest: "90s", tempo: "3-1-1", notes: "Full ROM, control the descent. Choose a weight you can do cleanly for all 4 sets." },
            { name: "Incline Dumbbell Press",  sets: 3, reps: "10",     rest: "75s", tempo: "2-1-2", notes: "45° incline, elbows at 70°. Feel the upper chest stretch." },
            { name: "Overhead Press (Smith)",  sets: 4, reps: "10",     rest: "75s", tempo: "2-1-1", notes: "Bar to chin level, brace core. This is compound so gets 4 sets." },
            { name: "Cable Lateral Raises",    sets: 3, reps: "15",     rest: "60s", tempo: "2-0-2", notes: "Lead with elbows, slight lean forward. Go lighter than you think." },
            { name: "Tricep Rope Pushdowns",   sets: 3, reps: "12",     rest: "60s", tempo: "2-0-2", notes: "Elbows pinned to sides. Full extension at bottom." },
          ]
        },
        {
          day: 2, label: "Tuesday", split: "Pull A", focus: "Back Focus",
          duration: "~55 min",
          exercises: [
            { name: "🌅 WARMUP (do first)", sets: 1, reps: "8 min", rest: "—", tempo: "Dynamic", notes: "5 min rowing machine (easy) → Band shoulder dislocations ×10, Cat-cow ×10, Scapular retractions ×15, Hip hinge bodyweight ×10, Dead hang from pull-up bar 20s ×2. Gets back, biceps & rear delts ready." },
            { name: "Barbell Bent-Over Row",   sets: 4, reps: "8",      rest: "90s", tempo: "3-1-1", notes: "Hinge at hips, bar to lower chest. Keep back flat." },
            { name: "Lat Pulldown (Wide Grip)",sets: 4, reps: "10",     rest: "75s", tempo: "2-1-2", notes: "Full stretch at top, squeeze lats at bottom. Don't lean back excessively." },
            { name: "Seated Cable Row",        sets: 3, reps: "12",     rest: "75s", tempo: "2-1-2", notes: "Elbows back past torso. Pause 1s at the end of each rep." },
            { name: "Face Pulls",              sets: 3, reps: "15",     rest: "60s", tempo: "2-0-2", notes: "Rope to forehead, external rotation at the top. Shoulder health essential." },
            { name: "Dumbbell Bicep Curl",     sets: 3, reps: "12",     rest: "60s", tempo: "2-0-2", notes: "Supinate at top, no swing. Slow and controlled." },
          ]
        },
        {
          day: 3, label: "Wednesday", split: "Legs A", focus: "Quad Focus",
          duration: "~60 min",
          exercises: [
            { name: "🌅 WARMUP (do first)", sets: 1, reps: "5 min", rest: "—", tempo: "Dynamic", notes: "5 min stationary bike (easy) → Leg swings forward/back ×10 each, Leg swings side/side ×10 each, Hip circles ×10 each direction, Bodyweight squat ×15 slow. Then go straight into knee prehab block." },
            { name: "🦵 KNEE PREHAB (do first)", sets: 1, reps: "8 min", rest: "—", tempo: "Activation", notes: "Glute bridges ×20, Clamshells with band ×15 each, Terminal knee extensions ×15 ×3, Wall ankle stretch 30s ×3 each side" },
            { name: "Box Squat (to bench)",    sets: 4, reps: "10",     rest: "90s", tempo: "3-1-1", notes: "Sit BACK onto box, weight in heels. No forward knee travel. Knee-safe squat substitute." },
            { name: "Leg Press",               sets: 4, reps: "12",     rest: "90s", tempo: "2-1-2", notes: "Feet high on platform — reduces knee stress. Controlled descent." },
            { name: "Lying Leg Curl",          sets: 3, reps: "12",     rest: "60s", tempo: "2-1-2", notes: "Full curl, hold 1s at top. Don't let hips rise." },
            { name: "Standing Calf Raises",    sets: 3, reps: "15",     rest: "45s", tempo: "2-1-2", notes: "Full stretch at bottom, pause at top. Don't bounce." },
            { name: "🦵 KNEE REHAB (finish with)", sets: 1, reps: "8 min", rest: "—", tempo: "Static", notes: "Slow step-downs ×10 each ×3, Kneeling hip flexor stretch 45s ×2 each side, VMO squeeze ×20 ×3" },
          ]
        },
        {
          day: 4, label: "Thursday", split: "Push B", focus: "Shoulder Focus",
          duration: "~55 min",
          exercises: [
            { name: "🌅 WARMUP (do first)", sets: 1, reps: "8 min", rest: "—", tempo: "Dynamic", notes: "5 min treadmill walk (brisk) → Arm circles ×10 each direction, Band pull-aparts ×15, Overhead reach ×10, Shoulder rotations ×10 each, Push-up ×10 slow. Gets shoulders, chest & triceps ready." },
            { name: "Overhead Barbell Press",  sets: 4, reps: "8",      rest: "90s", tempo: "3-1-1", notes: "Standing, brace core hard, no lower back arch." },
            { name: "Incline Barbell Press",   sets: 4, reps: "10",     rest: "75s", tempo: "2-1-2", notes: "30° incline. Upper chest focus. Control the negative." },
            { name: "Dumbbell Lateral Raises", sets: 3, reps: "15",     rest: "60s", tempo: "2-0-2", notes: "Slight forward lean, thumbs slightly down. No momentum." },
            { name: "Cable Chest Fly",         sets: 3, reps: "12",     rest: "60s", tempo: "2-0-2", notes: "Arms slightly bent, squeeze hard at centre." },
            { name: "EZ Bar Skull Crusher",    sets: 3, reps: "10",     rest: "75s", tempo: "2-1-1", notes: "Bar to forehead, elbows fixed. Go slow on the way down." },
          ]
        },
        {
          day: 5, label: "Friday", split: "Pull B", focus: "Bicep & Rear Delt",
          duration: "~55 min",
          exercises: [
            { name: "🌅 WARMUP (do first)", sets: 1, reps: "8 min", rest: "—", tempo: "Dynamic", notes: "5 min rowing machine (easy) → Dead hang 20s ×2, Band shoulder dislocations ×10, Scapular retractions ×15, Cat-cow ×10, Bodyweight row ×10. Gets back, biceps & rear delts ready." },
            { name: "Weighted Pull-Ups",       sets: 4, reps: "6–8",    rest: "120s", tempo: "3-1-1", notes: "Full hang at bottom, chin over bar. Bodyweight is fine if needed." },
            { name: "Single-Arm DB Row",       sets: 4, reps: "10 each",rest: "75s", tempo: "2-1-2", notes: "Brace on bench, full elbow extension at bottom." },
            { name: "Reverse Pec Deck Fly",    sets: 3, reps: "15",     rest: "60s", tempo: "2-0-2", notes: "Rear delts, arms nearly parallel to floor. Don't go too heavy." },
            { name: "Cable Straight-Arm Pulldown", sets: 3, reps: "12", rest: "60s", tempo: "2-0-2", notes: "Lat engagement, slight forward lean. Arms stay straight." },
            { name: "Hammer Curl",             sets: 3, reps: "12",     rest: "60s", tempo: "2-0-2", notes: "Neutral grip, alternate arms. No swing." },
          ]
        },
        {
          day: 6, label: "Saturday", split: "Legs B + Core + Cardio", focus: "Posterior, Core & Conditioning",
          duration: "~60 min",
          exercises: [
            { name: "🌅 WARMUP (do first)", sets: 1, reps: "5 min", rest: "—", tempo: "Dynamic", notes: "5 min stationary bike (easy) → Leg swings forward/back ×10 each, Hip circles ×10 each direction, Glute bridge ×15, Good morning bodyweight ×10. Then go straight into knee prehab block." },
            { name: "🦵 KNEE PREHAB (do first)", sets: 1, reps: "8 min", rest: "—", tempo: "Activation", notes: "Glute bridges ×20, Clamshells ×15 each, Terminal knee extensions ×15 ×3" },
            { name: "Romanian Deadlift",       sets: 4, reps: "8",      rest: "90s", tempo: "3-1-1", notes: "Bar close to legs, feel hamstring stretch. Slight knee bend only." },
            { name: "Step-Up (DB)",            sets: 4, reps: "10 each",rest: "75s", tempo: "2-1-1", notes: "Drive through heel. Right knee tracks over toes — monitor carefully." },
            { name: "Hip Thrust (Barbell)",    sets: 3, reps: "12",     rest: "75s", tempo: "2-1-2", notes: "Squeeze glutes hard at top. Great for knee stability too." },
            { name: "Plank",                   sets: 3, reps: "45s",    rest: "45s", tempo: "Isometric", notes: "Neutral spine, squeeze everything. Don't let hips sag." },
            { name: "Jump Rope",               sets: 5, reps: "2 min",  rest: "60s", tempo: "Steady", notes: "W1: Basic bounce, find your rhythm. 5 rounds × 2 min = 10 min cardio. Rest 60s between rounds." },
            { name: "🦵 KNEE REHAB + Mobility", sets: 1, reps: "8 min", rest: "—", tempo: "Dynamic", notes: "Step-downs ×10 each ×3, hip flexor stretch 45s each, pigeon pose, thoracic rotation." },
          ]
        },
      ]
    },
    {
      week: 2,
      theme: "Progressive Overload",
      focus: "Add 2.5–5kg to compounds, push for 1–2 extra reps on accessories vs Week 1. Same sets, more weight.",
      days: [
        {
          day: 1, label: "Monday", split: "Push A", focus: "Chest Focus",
          duration: "~55 min",
          exercises: [
            { name: "🌅 WARMUP (do first)", sets: 1, reps: "8 min", rest: "—", tempo: "Dynamic", notes: "5 min treadmill walk (brisk) → Arm circles ×10 each direction, Band pull-aparts ×15, Chest openers ×10, Shoulder rotations ×10 each, Wrist circles ×10. Gets chest, shoulders & triceps ready." },
            { name: "Barbell Bench Press",     sets: 4, reps: "8",      rest: "90s", tempo: "3-1-1", notes: "Add 2.5kg vs W1. If you got all 8 reps cleanly last week, go heavier." },
            { name: "Incline Dumbbell Press",  sets: 3, reps: "10",     rest: "75s", tempo: "2-1-2", notes: "Try next DB size up or squeeze out 11–12 reps at same weight." },
            { name: "Overhead Press (Smith)",  sets: 4, reps: "10",     rest: "75s", tempo: "2-1-1", notes: "Add 2.5kg. Push for clean lockout." },
            { name: "Cable Lateral Raises",    sets: 3, reps: "15",     rest: "60s", tempo: "2-0-2", notes: "Increase cable stack by one notch if W1 felt comfortable." },
            { name: "Tricep Rope Pushdowns",   sets: 3, reps: "12",     rest: "60s", tempo: "2-0-2", notes: "Add 2.5kg or push for 13–14 reps at same weight." },
          ]
        },
        {
          day: 2, label: "Tuesday", split: "Pull A", focus: "Back Focus",
          duration: "~55 min",
          exercises: [
            { name: "🌅 WARMUP (do first)", sets: 1, reps: "8 min", rest: "—", tempo: "Dynamic", notes: "5 min rowing machine (easy) → Band shoulder dislocations ×10, Cat-cow ×10, Scapular retractions ×15, Hip hinge bodyweight ×10, Dead hang from pull-up bar 20s ×2. Gets back, biceps & rear delts ready." },
            { name: "Barbell Bent-Over Row",   sets: 4, reps: "8",      rest: "90s", tempo: "3-1-1", notes: "Add 2.5–5kg vs W1. Back still flat, no momentum." },
            { name: "Lat Pulldown (Wide Grip)",sets: 4, reps: "10",     rest: "75s", tempo: "2-1-2", notes: "Add a plate or push for 11–12 reps." },
            { name: "Seated Cable Row",        sets: 3, reps: "12",     rest: "75s", tempo: "2-1-2", notes: "Increase weight slightly. Keep strict form." },
            { name: "Face Pulls",              sets: 3, reps: "15",     rest: "60s", tempo: "2-0-2", notes: "One notch heavier on cable. Don't sacrifice form." },
            { name: "Dumbbell Bicep Curl",     sets: 3, reps: "12",     rest: "60s", tempo: "2-0-2", notes: "Next DB up or push for 13–14 reps." },
          ]
        },
        {
          day: 3, label: "Wednesday", split: "Legs A", focus: "Quad Focus",
          duration: "~60 min",
          exercises: [
            { name: "🌅 WARMUP (do first)", sets: 1, reps: "5 min", rest: "—", tempo: "Dynamic", notes: "5 min stationary bike (easy) → Leg swings forward/back ×10 each, Leg swings side/side ×10 each, Hip circles ×10 each direction, Bodyweight squat ×15 slow. Then go straight into knee prehab block." },
            { name: "🦵 KNEE PREHAB (do first)", sets: 1, reps: "8 min", rest: "—", tempo: "Activation", notes: "Glute bridges ×20, Clamshells ×15 each, Terminal knee extensions ×15 ×3, Wall ankle stretch 30s ×3 each side" },
            { name: "Box Squat (to bench)",    sets: 4, reps: "10",     rest: "90s", tempo: "3-1-1", notes: "Add weight vs W1. How does the knee feel? Note it in your log." },
            { name: "Leg Press",               sets: 4, reps: "12",     rest: "90s", tempo: "2-1-2", notes: "Load up another plate. Feet high, controlled descent." },
            { name: "Lying Leg Curl",          sets: 3, reps: "12",     rest: "60s", tempo: "2-1-2", notes: "Add weight if W1 felt easy." },
            { name: "Standing Calf Raises",    sets: 3, reps: "15",     rest: "45s", tempo: "2-1-2", notes: "Add 5kg or push for 17–18 reps." },
            { name: "🦵 KNEE REHAB (finish with)", sets: 1, reps: "8 min", rest: "—", tempo: "Static", notes: "Slow step-downs ×10 each ×3, Kneeling hip flexor stretch 45s ×2 each side, VMO squeeze ×20 ×3" },
          ]
        },
        {
          day: 4, label: "Thursday", split: "Push B", focus: "Shoulder Focus",
          duration: "~55 min",
          exercises: [
            { name: "🌅 WARMUP (do first)", sets: 1, reps: "8 min", rest: "—", tempo: "Dynamic", notes: "5 min treadmill walk (brisk) → Arm circles ×10 each direction, Band pull-aparts ×15, Overhead reach ×10, Shoulder rotations ×10 each, Push-up ×10 slow. Gets shoulders, chest & triceps ready." },
            { name: "Overhead Barbell Press",  sets: 4, reps: "8",      rest: "90s", tempo: "3-1-1", notes: "Add 2.5kg vs W1. Strict form — no leg drive." },
            { name: "Incline Barbell Press",   sets: 4, reps: "10",     rest: "75s", tempo: "2-1-2", notes: "Add 2.5kg. Push for all 10 clean reps." },
            { name: "Dumbbell Lateral Raises", sets: 3, reps: "15",     rest: "60s", tempo: "2-0-2", notes: "Go slightly heavier or push for 16–17 reps." },
            { name: "Cable Chest Fly",         sets: 3, reps: "12",     rest: "60s", tempo: "2-0-2", notes: "Add weight or push for more reps." },
            { name: "EZ Bar Skull Crusher",    sets: 3, reps: "10",     rest: "75s", tempo: "2-1-1", notes: "Add 2.5kg per side if W1 felt manageable." },
          ]
        },
        {
          day: 5, label: "Friday", split: "Pull B", focus: "Bicep & Rear Delt",
          duration: "~55 min",
          exercises: [
            { name: "🌅 WARMUP (do first)", sets: 1, reps: "8 min", rest: "—", tempo: "Dynamic", notes: "5 min rowing machine (easy) → Dead hang 20s ×2, Band shoulder dislocations ×10, Scapular retractions ×15, Cat-cow ×10, Bodyweight row ×10. Gets back, biceps & rear delts ready." },
            { name: "Weighted Pull-Ups",       sets: 4, reps: "6–8",    rest: "120s", tempo: "3-1-1", notes: "Add 2.5kg to belt if bodyweight felt easy. Push for 8 clean reps." },
            { name: "Single-Arm DB Row",       sets: 4, reps: "10 each",rest: "75s", tempo: "2-1-2", notes: "Heavier DB or push for 11–12 reps." },
            { name: "Reverse Pec Deck Fly",    sets: 3, reps: "15",     rest: "60s", tempo: "2-0-2", notes: "Slightly heavier. Keep it strict." },
            { name: "Cable Straight-Arm Pulldown", sets: 3, reps: "12", rest: "60s", tempo: "2-0-2", notes: "Add weight or push for more reps." },
            { name: "Hammer Curl",             sets: 3, reps: "12",     rest: "60s", tempo: "2-0-2", notes: "Next DB up or push for 13–14 reps." },
          ]
        },
        {
          day: 6, label: "Saturday", split: "Legs B + Core + Cardio", focus: "Posterior, Core & Conditioning",
          duration: "~60 min",
          exercises: [
            { name: "🌅 WARMUP (do first)", sets: 1, reps: "5 min", rest: "—", tempo: "Dynamic", notes: "5 min stationary bike (easy) → Leg swings forward/back ×10 each, Hip circles ×10 each direction, Glute bridge ×15, Good morning bodyweight ×10. Then go straight into knee prehab block." },
            { name: "🦵 KNEE PREHAB (do first)", sets: 1, reps: "8 min", rest: "—", tempo: "Activation", notes: "Glute bridges ×20, Clamshells ×15 each, Terminal knee extensions ×15 ×3" },
            { name: "Romanian Deadlift",       sets: 4, reps: "8",      rest: "90s", tempo: "3-1-1", notes: "Add 5kg vs W1. Feel the hamstring stretch, controlled descent." },
            { name: "Step-Up (DB)",            sets: 4, reps: "10 each",rest: "75s", tempo: "2-1-1", notes: "Heavier DBs or more reps. Right knee check — any pain? Log it." },
            { name: "Hip Thrust (Barbell)",    sets: 3, reps: "12",     rest: "75s", tempo: "2-1-2", notes: "Add 10kg to bar. Drive hard at the top." },
            { name: "Plank",                   sets: 3, reps: "55s",    rest: "45s", tempo: "Isometric", notes: "+10s vs W1. Squeeze core and glutes." },
            { name: "Jump Rope",               sets: 5, reps: "2 min",  rest: "60s", tempo: "Steady", notes: "W2: Try to increase pace vs W1. Add alternate foot steps if comfortable. 10 min total cardio." },
            { name: "🦵 KNEE REHAB + Mobility", sets: 1, reps: "8 min", rest: "—", tempo: "Dynamic", notes: "Step-downs ×10 each ×3, hip flexor stretch 45s each, pigeon pose." },
          ]
        },
      ]
    },
    {
      week: 3,
      theme: "Intensity Peak",
      focus: "Heaviest week. Push compounds to RPE 8–9. Drop reps to 6 on main lifts, load up the weight. This is the hard week.",
      days: [
        {
          day: 1, label: "Monday", split: "Push A", focus: "Chest Focus",
          duration: "~55 min",
          exercises: [
            { name: "🌅 WARMUP (do first)", sets: 1, reps: "8 min", rest: "—", tempo: "Dynamic", notes: "5 min treadmill walk (brisk) → Arm circles ×10 each direction, Band pull-aparts ×15, Chest openers ×10, Shoulder rotations ×10 each, Wrist circles ×10. Gets chest, shoulders & triceps ready." },
            { name: "Barbell Bench Press",     sets: 4, reps: "6",      rest: "90s", tempo: "3-1-1", notes: "Drop to 6 reps, add weight significantly vs W2. RPE 8–9. This should feel heavy." },
            { name: "Incline Dumbbell Press",  sets: 3, reps: "8",      rest: "75s", tempo: "2-1-2", notes: "Heavier DBs, drop reps to 8. Controlled all the way." },
            { name: "Overhead Press (Smith)",  sets: 4, reps: "8",      rest: "75s", tempo: "2-1-1", notes: "Drop to 8 reps, heavier. Heaviest OHP of the month." },
            { name: "Cable Lateral Raises",    sets: 3, reps: "12",     rest: "60s", tempo: "2-0-2", notes: "Heavier cable, drop to 12 reps. Strict form." },
            { name: "Tricep Rope Pushdowns",   sets: 3, reps: "10",     rest: "60s", tempo: "2-0-2", notes: "Heaviest yet, drop to 10 reps." },
          ]
        },
        {
          day: 2, label: "Tuesday", split: "Pull A", focus: "Back Focus",
          duration: "~55 min",
          exercises: [
            { name: "🌅 WARMUP (do first)", sets: 1, reps: "8 min", rest: "—", tempo: "Dynamic", notes: "5 min rowing machine (easy) → Band shoulder dislocations ×10, Cat-cow ×10, Scapular retractions ×15, Hip hinge bodyweight ×10, Dead hang from pull-up bar 20s ×2. Gets back, biceps & rear delts ready." },
            { name: "Barbell Bent-Over Row",   sets: 4, reps: "6",      rest: "90s", tempo: "3-1-1", notes: "Heaviest row of the month. 6 strong, controlled reps. RPE 8–9." },
            { name: "Lat Pulldown (Wide Grip)",sets: 4, reps: "8",      rest: "75s", tempo: "2-1-2", notes: "Heavier, fewer reps. Full stretch each rep." },
            { name: "Seated Cable Row",        sets: 3, reps: "10",     rest: "75s", tempo: "2-1-2", notes: "Heavier, drop to 10. Pause at the end of each rep." },
            { name: "Face Pulls",              sets: 3, reps: "15",     rest: "60s", tempo: "2-0-2", notes: "Keep same weight — this is a health exercise, not a strength one." },
            { name: "Dumbbell Bicep Curl",     sets: 3, reps: "10",     rest: "60s", tempo: "2-0-2", notes: "Heavier DBs, drop to 10 reps. No swing." },
          ]
        },
        {
          day: 3, label: "Wednesday", split: "Legs A", focus: "Quad Focus",
          duration: "~60 min",
          exercises: [
            { name: "🌅 WARMUP (do first)", sets: 1, reps: "5 min", rest: "—", tempo: "Dynamic", notes: "5 min stationary bike (easy) → Leg swings forward/back ×10 each, Leg swings side/side ×10 each, Hip circles ×10 each direction, Bodyweight squat ×15 slow. Then go straight into knee prehab block." },
            { name: "🦵 KNEE PREHAB (do first)", sets: 1, reps: "8 min", rest: "—", tempo: "Activation", notes: "Glute bridges ×25, Clamshells ×20 each, Terminal knee extensions ×15 ×3, Wall ankle stretch 40s ×3 each side" },
            { name: "Box Squat (to bench)",    sets: 4, reps: "8",      rest: "90s", tempo: "3-1-1", notes: "Drop to 8 reps, heavier load. Peak box squat intensity. Knee check — if pain-free try lower box." },
            { name: "Leg Press",               sets: 4, reps: "10",     rest: "90s", tempo: "2-1-2", notes: "Load up. Drop to 10 reps. Heaviest leg press of the month." },
            { name: "Lying Leg Curl",          sets: 3, reps: "10",     rest: "60s", tempo: "2-1-2", notes: "Heavier, drop to 10. Hold 1s at top." },
            { name: "Standing Calf Raises",    sets: 3, reps: "12",     rest: "45s", tempo: "2-1-2", notes: "Heavier weight, drop to 12. Full stretch." },
            { name: "🦵 KNEE REHAB (finish with)", sets: 1, reps: "10 min", rest: "—", tempo: "Static", notes: "Slow step-downs ×10 each ×3, Hip flexor stretch 45s ×3 each, VMO squeeze ×20 ×3. Extra attention — legs will be sore!" },
          ]
        },
        {
          day: 4, label: "Thursday", split: "Push B", focus: "Shoulder Focus",
          duration: "~55 min",
          exercises: [
            { name: "🌅 WARMUP (do first)", sets: 1, reps: "8 min", rest: "—", tempo: "Dynamic", notes: "5 min treadmill walk (brisk) → Arm circles ×10 each direction, Band pull-aparts ×15, Overhead reach ×10, Shoulder rotations ×10 each, Push-up ×10 slow. Gets shoulders, chest & triceps ready." },
            { name: "Overhead Barbell Press",  sets: 4, reps: "6",      rest: "90s", tempo: "3-1-1", notes: "Heaviest OHP of the month. 6 heavy reps. RPE 8–9." },
            { name: "Incline Barbell Press",   sets: 4, reps: "8",      rest: "75s", tempo: "2-1-2", notes: "Heavier, drop to 8. Slow negative." },
            { name: "Dumbbell Lateral Raises", sets: 3, reps: "12",     rest: "60s", tempo: "2-0-2", notes: "Heavier DBs, drop to 12 reps." },
            { name: "Cable Chest Fly",         sets: 3, reps: "10",     rest: "60s", tempo: "2-0-2", notes: "Heavier, drop to 10. Squeeze hard." },
            { name: "EZ Bar Skull Crusher",    sets: 3, reps: "8",      rest: "75s", tempo: "2-1-1", notes: "Heaviest skull crusher of the month. Slow descent." },
          ]
        },
        {
          day: 5, label: "Friday", split: "Pull B", focus: "Bicep & Rear Delt",
          duration: "~55 min",
          exercises: [
            { name: "🌅 WARMUP (do first)", sets: 1, reps: "8 min", rest: "—", tempo: "Dynamic", notes: "5 min rowing machine (easy) → Dead hang 20s ×2, Band shoulder dislocations ×10, Scapular retractions ×15, Cat-cow ×10, Bodyweight row ×10. Gets back, biceps & rear delts ready." },
            { name: "Weighted Pull-Ups",       sets: 4, reps: "6",      rest: "120s", tempo: "3-1-1", notes: "Heaviest pull-ups of the month. Add more weight to belt. 6 strong reps." },
            { name: "Single-Arm DB Row",       sets: 4, reps: "8 each", rest: "75s", tempo: "2-1-2", notes: "Heavier DB, drop to 8. Full ROM." },
            { name: "Reverse Pec Deck Fly",    sets: 3, reps: "12",     rest: "60s", tempo: "2-0-2", notes: "Heavier, drop to 12. Strict." },
            { name: "Cable Straight-Arm Pulldown", sets: 3, reps: "10", rest: "60s", tempo: "2-0-2", notes: "Heavier, drop to 10." },
            { name: "Hammer Curl",             sets: 3, reps: "10",     rest: "60s", tempo: "2-0-2", notes: "Heaviest yet, drop to 10. No momentum." },
          ]
        },
        {
          day: 6, label: "Saturday", split: "Legs B + Core + Cardio", focus: "Posterior, Core & Conditioning",
          duration: "~60 min",
          exercises: [
            { name: "🌅 WARMUP (do first)", sets: 1, reps: "5 min", rest: "—", tempo: "Dynamic", notes: "5 min stationary bike (easy) → Leg swings forward/back ×10 each, Hip circles ×10 each direction, Glute bridge ×15, Good morning bodyweight ×10. Then go straight into knee prehab block." },
            { name: "🦵 KNEE PREHAB (do first)", sets: 1, reps: "8 min", rest: "—", tempo: "Activation", notes: "Glute bridges ×25, Clamshells ×20 each, Terminal knee extensions ×15 ×3" },
            { name: "Romanian Deadlift",       sets: 4, reps: "6",      rest: "90s", tempo: "3-1-1", notes: "Heaviest RDL of the month. 6 strong reps. Hamstrings on fire." },
            { name: "Step-Up (DB)",            sets: 4, reps: "8 each", rest: "75s", tempo: "2-1-1", notes: "Heavier DBs. 8 reps each leg. Right knee — stop if any pain." },
            { name: "Hip Thrust (Barbell)",    sets: 3, reps: "10",     rest: "75s", tempo: "2-1-2", notes: "Heaviest hip thrust of the month. Drive hard at the top." },
            { name: "Plank",                   sets: 3, reps: "60s",    rest: "45s", tempo: "Isometric", notes: "60s hold. Squeeze everything. This should feel hard." },
            { name: "Jump Rope",               sets: 6, reps: "2 min",  rest: "60s", tempo: "Moderate-High", notes: "W3: Push intensity. Try double-unders or high knees if confident. 6 rounds × 2 min = 12 min cardio." },
            { name: "🦵 KNEE REHAB + Mobility", sets: 1, reps: "10 min", rest: "—", tempo: "Dynamic", notes: "You earned this. Step-downs ×10 each ×3, hip flexor deep stretch, pigeon pose." },
          ]
        },
      ]
    },
    {
      week: 4,
      theme: "Deload & Consolidate",
      focus: "Cut weight by ~20%, same reps. Let your body recover and consolidate the strength gains. Don't skip this week!",
      days: [
        {
          day: 1, label: "Monday", split: "Push A", focus: "Chest Focus",
          duration: "~45 min",
          exercises: [
            { name: "🌅 WARMUP (do first)", sets: 1, reps: "8 min", rest: "—", tempo: "Dynamic", notes: "5 min treadmill walk (brisk) → Arm circles ×10 each direction, Band pull-aparts ×15, Chest openers ×10, Shoulder rotations ×10 each, Wrist circles ×10. Gets chest, shoulders & triceps ready." },
            { name: "Barbell Bench Press",     sets: 3, reps: "8",      rest: "90s", tempo: "3-1-1", notes: "W3 weight minus ~20%. Should feel lighter — enjoy it. 3 sets only." },
            { name: "Incline Dumbbell Press",  sets: 3, reps: "10",     rest: "75s", tempo: "2-1-2", notes: "Moderate weight. Not max effort." },
            { name: "Overhead Press (Smith)",  sets: 3, reps: "10",     rest: "75s", tempo: "2-1-1", notes: "Deload. Focus on perfect form at lighter weight." },
            { name: "Cable Lateral Raises",    sets: 3, reps: "15",     rest: "60s", tempo: "2-0-2", notes: "Light, squeeze the side delts. Quality over load." },
            { name: "Tricep Rope Pushdowns",   sets: 3, reps: "12",     rest: "60s", tempo: "2-0-2", notes: "Moderate. Keep the triceps active." },
          ]
        },
        {
          day: 2, label: "Tuesday", split: "Pull A", focus: "Back Focus",
          duration: "~45 min",
          exercises: [
            { name: "🌅 WARMUP (do first)", sets: 1, reps: "8 min", rest: "—", tempo: "Dynamic", notes: "5 min rowing machine (easy) → Band shoulder dislocations ×10, Cat-cow ×10, Scapular retractions ×15, Hip hinge bodyweight ×10, Dead hang from pull-up bar 20s ×2. Gets back, biceps & rear delts ready." },
            { name: "Barbell Bent-Over Row",   sets: 3, reps: "8",      rest: "90s", tempo: "3-1-1", notes: "Deload weight. 3 sets. Feel how much stronger you are vs W1." },
            { name: "Lat Pulldown (Wide Grip)",sets: 3, reps: "10",     rest: "75s", tempo: "2-1-2", notes: "Moderate. Full stretch at top." },
            { name: "Seated Cable Row",        sets: 3, reps: "12",     rest: "75s", tempo: "2-1-2", notes: "Light and controlled." },
            { name: "Face Pulls",              sets: 3, reps: "15",     rest: "60s", tempo: "2-0-2", notes: "Keep these in every week — shoulder health." },
            { name: "Dumbbell Bicep Curl",     sets: 3, reps: "12",     rest: "60s", tempo: "2-0-2", notes: "Light pump. No ego." },
          ]
        },
        {
          day: 3, label: "Wednesday", split: "Legs A", focus: "Quad Focus",
          duration: "~55 min",
          exercises: [
            { name: "🌅 WARMUP (do first)", sets: 1, reps: "5 min", rest: "—", tempo: "Dynamic", notes: "5 min stationary bike (easy) → Leg swings forward/back ×10 each, Leg swings side/side ×10 each, Hip circles ×10 each direction, Bodyweight squat ×15 slow. Then go straight into knee prehab block." },
            { name: "🦵 KNEE PREHAB (do first)", sets: 1, reps: "8 min", rest: "—", tempo: "Activation", notes: "Glute bridges ×20, Clamshells ×15 each, Terminal knee extensions ×15 ×3, Wall ankle stretch 30s ×3 each side" },
            { name: "Box Squat (to bench)",    sets: 3, reps: "10",     rest: "90s", tempo: "3-1-1", notes: "Deload. Lighter weight. How does the knee feel vs W1? This is your progress check." },
            { name: "Leg Press",               sets: 3, reps: "12",     rest: "90s", tempo: "2-1-2", notes: "Moderate. Not max effort." },
            { name: "Lying Leg Curl",          sets: 3, reps: "12",     rest: "60s", tempo: "2-1-2", notes: "Light and controlled." },
            { name: "Standing Calf Raises",    sets: 3, reps: "15",     rest: "45s", tempo: "2-1-2", notes: "Moderate. Keep calves active." },
            { name: "🦵 KNEE REHAB (finish with)", sets: 1, reps: "10 min", rest: "—", tempo: "Static", notes: "PRIORITY this week. Step-downs ×10 each ×3, Hip flexor stretch 45s ×3 each, VMO squeeze ×20 ×3. Set foundation for Month 2." },
          ]
        },
        {
          day: 4, label: "Thursday", split: "Push B", focus: "Shoulder Focus",
          duration: "~45 min",
          exercises: [
            { name: "🌅 WARMUP (do first)", sets: 1, reps: "8 min", rest: "—", tempo: "Dynamic", notes: "5 min treadmill walk (brisk) → Arm circles ×10 each direction, Band pull-aparts ×15, Overhead reach ×10, Shoulder rotations ×10 each, Push-up ×10 slow. Gets shoulders, chest & triceps ready." },
            { name: "Overhead Barbell Press",  sets: 3, reps: "8",      rest: "90s", tempo: "3-1-1", notes: "Deload. Lighter. Should feel noticeably easier than W3." },
            { name: "Incline Barbell Press",   sets: 3, reps: "10",     rest: "75s", tempo: "2-1-2", notes: "Moderate. 3 sets." },
            { name: "Dumbbell Lateral Raises", sets: 3, reps: "15",     rest: "60s", tempo: "2-0-2", notes: "Light, high rep. Quality squeeze." },
            { name: "Cable Chest Fly",         sets: 3, reps: "12",     rest: "60s", tempo: "2-0-2", notes: "Moderate." },
            { name: "EZ Bar Skull Crusher",    sets: 3, reps: "10",     rest: "75s", tempo: "2-1-1", notes: "Don't skip — keep triceps active. Light though." },
          ]
        },
        {
          day: 5, label: "Friday", split: "Pull B", focus: "Bicep & Rear Delt",
          duration: "~45 min",
          exercises: [
            { name: "🌅 WARMUP (do first)", sets: 1, reps: "8 min", rest: "—", tempo: "Dynamic", notes: "5 min rowing machine (easy) → Dead hang 20s ×2, Band shoulder dislocations ×10, Scapular retractions ×15, Cat-cow ×10, Bodyweight row ×10. Gets back, biceps & rear delts ready." },
            { name: "Weighted Pull-Ups",       sets: 3, reps: "6–8",    rest: "120s", tempo: "3-1-1", notes: "Bodyweight or minimal added weight. Enjoy the strength you've built." },
            { name: "Single-Arm DB Row",       sets: 3, reps: "10 each",rest: "75s", tempo: "2-1-2", notes: "Moderate DB. 3 sets." },
            { name: "Reverse Pec Deck Fly",    sets: 3, reps: "15",     rest: "60s", tempo: "2-0-2", notes: "Light. Shoulder health — never skip face pulls or rear delts." },
            { name: "Cable Straight-Arm Pulldown", sets: 3, reps: "12", rest: "60s", tempo: "2-0-2", notes: "Moderate." },
            { name: "Hammer Curl",             sets: 3, reps: "12",     rest: "60s", tempo: "2-0-2", notes: "Light pump." },
          ]
        },
        {
          day: 6, label: "Saturday", split: "Legs B + Core + Cardio", focus: "Posterior, Core & Conditioning",
          duration: "~55 min",
          exercises: [
            { name: "🌅 WARMUP (do first)", sets: 1, reps: "5 min", rest: "—", tempo: "Dynamic", notes: "5 min stationary bike (easy) → Leg swings forward/back ×10 each, Hip circles ×10 each direction, Glute bridge ×15, Good morning bodyweight ×10. Then go straight into knee prehab block." },
            { name: "🦵 KNEE PREHAB (do first)", sets: 1, reps: "8 min", rest: "—", tempo: "Activation", notes: "Glute bridges ×20, Clamshells ×15 each, Terminal knee extensions ×15 ×3" },
            { name: "Romanian Deadlift",       sets: 3, reps: "8",      rest: "90s", tempo: "3-1-1", notes: "Deload. Lighter weight, 3 sets. Feel the hamstring stretch." },
            { name: "Step-Up (DB)",            sets: 3, reps: "10 each",rest: "75s", tempo: "2-1-1", notes: "Lighter DBs. Focus on right knee tracking. Deload — not max effort." },
            { name: "Hip Thrust (Barbell)",    sets: 3, reps: "12",     rest: "75s", tempo: "2-1-2", notes: "Moderate load. Good glute squeeze." },
            { name: "Plank",                   sets: 3, reps: "45s",    rest: "45s", tempo: "Isometric", notes: "Back to 45s — notice how much easier it feels vs W1." },
            { name: "Jump Rope",               sets: 4, reps: "2 min",  rest: "60s", tempo: "Easy", notes: "W4: Easy pace. 4 rounds only. This is recovery cardio — don't push. 8 min total." },
            { name: "🦵 KNEE REHAB + Mobility", sets: 1, reps: "10 min", rest: "—", tempo: "Dynamic", notes: "PRIORITY. Full mobility flow — pigeon pose, hip flexor, thoracic rotation. Set up Month 2." },
          ]
        },
      ]
    }
  ]
};

const STORAGE_KEY = "ashwin_workout_logs";
const COMPLETED_KEY = "ashwin_completed_sets";

const splitColors = {
  "Push A": { bg: "#FF6B35", light: "#FF6B3520" },
  "Pull A": { bg: "#4ECDC4", light: "#4ECDC420" },
  "Legs A": { bg: "#45B7D1", light: "#45B7D120" },
  "Push B": { bg: "#FF8E53", light: "#FF8E5320" },
  "Pull B": { bg: "#26C6DA", light: "#26C6DA20" },
  "Legs B + Core + Cardio": { bg: "#7C4DFF", light: "#7C4DFF20" },
};

const weekColors = ["#FF6B35", "#4ECDC4", "#FF3366", "#7C4DFF"];

export default function WorkoutTracker() {
  const [activeWeek, setActiveWeek] = useState(0);
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [logs, setLogs] = useState<Record<string, any>>({});
  const [view, setView] = useState("plan");
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>({});
  const [expandedEx, setExpandedEx] = useState({});
  const [storageReady, setStorageReady] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [showBackup, setShowBackup] = useState(false);
  const [currentUser, setCurrentUser] = useState<'ashwin' | 'rufi' | null>(() => {
    const saved = localStorage.getItem('workout_user')
    return (saved as 'ashwin' | 'rufi') || null
  })
  
  const handleSelectUser = (user: 'ashwin' | 'rufi') => {
    localStorage.setItem('workout_user', user)
    setCurrentUser(user)
  }
  
  const handleSwitchUser = () => {
    localStorage.removeItem('workout_user')
    setCurrentUser(null)
  }

  const toggleEx = (key) => {
    setExpandedEx(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Load from artifact persistent storage on mount
  useEffect(() => {
    const load = async () => {
      try {
        const { data: logsData } = await supabase
          .from('workout_logs')
          .select('*')
          .eq('user_id', 'ashwin')
        if (logsData?.length) {
          const rebuilt: any = {}
          logsData.forEach((row: any) => {
            const key = `w${row.week_idx}_d${row.day_idx}_e${row.exercise_idx}`
            if (!rebuilt[key]) rebuilt[key] = {}
            rebuilt[key][String(row.set_idx)] = { weight: row.weight, reps: row.reps, note: row.note }
          })
          setLogs(rebuilt)
        }
      } catch (e) { console.error('Failed to load logs:', e) }
      try {
        const { data: completedData } = await supabase
          .from('completed_sets')
          .select('*')
          .eq('user_id', 'ashwin')
        if (completedData?.length) {
          const rebuilt: any = {}
          completedData.forEach((row: any) => { rebuilt[row.set_key] = row.completed })
          setCompletedSets(rebuilt)
        }
      } catch (e) { console.error('Failed to load completed:', e) }
      setStorageReady(true)
    }
    load()
  }, [])

const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveLogs = async (newLogs: any) => {
    setLogs(newLogs)
    setSaveStatus('saving')
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const rows = Object.entries(newLogs).flatMap(([key, sets]: any) => {
          const match = key.match(/w(\d+)_d(\d+)_e(\d+)/)
          if (!match) return []
          const [, w, d, e] = match
          return Object.entries(sets).map(([si, val]: any) => ({
            user_id: 'ashwin',
            week_idx: parseInt(w),
            day_idx: parseInt(d),
            exercise_idx: parseInt(e),
            set_idx: parseInt(si),
            weight: val.weight || null,
            reps: val.reps || null,
            note: val.note || null,
          }))
        })
        console.log('Rows to save:', JSON.stringify(rows))
        const { error } = await supabase.from('workout_logs').upsert(rows, {
          onConflict: 'user_id,week_idx,day_idx,exercise_idx,set_idx'
        })
        if (error) throw error
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus(null), 2000)
      } catch (e) {
        console.error('Save failed:', e)
        setSaveStatus('error')
        setTimeout(() => setSaveStatus(null), 3000)
      }
    }, 800)
  }

  const saveCompleted = async (newCompleted: any) => {
    setCompletedSets(newCompleted)
    try {
      const rows = Object.entries(newCompleted).map(([key, val]) => ({
        user_id: 'ashwin', set_key: key, completed: val
      }))
      await supabase.from('completed_sets').upsert(rows, {
        onConflict: 'user_id,set_key'
      })
    } catch (e) { console.error('Save completed failed:', e) }
  }

  const logKey = (weekIdx, dayIdx, exIdx) => `w${weekIdx}_d${dayIdx}_e${exIdx}`;

  const updateLog = (weekIdx, dayIdx, exIdx, setIdx, field, value) => {
    const key = logKey(weekIdx, dayIdx, exIdx);
    const newLogs = { ...logs };
    if (!newLogs[key]) newLogs[key] = {};
    if (!newLogs[key][setIdx]) newLogs[key][setIdx] = {};
    newLogs[key][setIdx][field] = value;
    saveLogs(newLogs);
  };

  const getLog = (weekIdx, dayIdx, exIdx, setIdx, field) => {
    const key = logKey(weekIdx, dayIdx, exIdx);
    return logs[key]?.[setIdx]?.[field] || "";
  };

  const toggleSetComplete = (weekIdx, dayIdx, exIdx, setIdx) => {
    const k = `${weekIdx}_${dayIdx}_${exIdx}_${setIdx}`;
    const newCompleted = { ...completedSets, [k]: !completedSets[k] };
    saveCompleted(newCompleted);
  };

  const isSetComplete = (weekIdx, dayIdx, exIdx, setIdx) =>
    !!completedSets[`${weekIdx}_${dayIdx}_${exIdx}_${setIdx}`];

  const getDayProgress = (weekIdx, dayIdx) => {
    const day = PLAN.weeks[weekIdx].days[dayIdx];
    let total = 0, done = 0;
    day.exercises.forEach((ex, ei) => {
      for (let s = 0; s < ex.sets; s++) {
        total++;
        if (isSetComplete(weekIdx, dayIdx, ei, s)) done++;
      }
    });
    return total > 0 ? Math.round((done / total) * 100) : 0;
  };

  const week = PLAN.weeks[activeWeek];
  const accentColor = weekColors[activeWeek];

  if (currentUser === null) return <UserSelect onSelect={handleSelectUser} />
  if (currentUser === 'rufi') return <RufiTracker onSwitchUser={handleSwitchUser} />

  // Loading screen while storage initialises
  if (!storageReady) {
    return (
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        background: "#0A0A0F", minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: 16,
      }}>
        <div style={{ fontSize: 32 }}>🏋️</div>
        <div style={{ color: "#666", fontSize: 13 }}>Loading your workout data...</div>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      background: "#0A0A0F",
      minHeight: "100vh",
      color: "#E8E8F0",
      maxWidth: 480,
      margin: "0 auto",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Bebas+Neue&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, #0A0A0F 0%, #1A1A2E 100%)`,
        padding: "24px 20px 20px",
        borderBottom: `1px solid ${accentColor}30`,
        position: "sticky", top: 0, zIndex: 100,
        backdropFilter: "blur(20px)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 3, color: accentColor, fontWeight: 600, textTransform: "uppercase", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
              Ashwin's Plan
              {saveStatus === "saving" && <span style={{ fontSize: 9, color: "#666", letterSpacing: 1 }}>● SAVING...</span>}
              {saveStatus === "saved" && <span style={{ fontSize: 9, color: "#4ECDC4", letterSpacing: 1 }}>✓ SAVED</span>}
              {saveStatus === "error" && <span style={{ fontSize: 9, color: "#FF3366", letterSpacing: 1 }}>✗ SAVE FAILED</span>}
            </div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 28, letterSpacing: 1, lineHeight: 1 }}>
              4-WEEK PPL PROGRAM
            </div>
            <button onClick={handleSwitchUser} style={{
              background: 'none', border: '1px solid #2A2A3E',
              borderRadius: 8, padding: '4px 12px',
              color: '#666', fontSize: 11, cursor: 'pointer',
              marginTop: 8, fontFamily: "'DM Sans', sans-serif",
            }}>
              👤 Switch User
            </button>
          </div>
          <div style={{
            background: `${accentColor}20`,
            border: `1px solid ${accentColor}50`,
            borderRadius: 12,
            padding: "8px 14px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: accentColor, fontFamily: "'Bebas Neue'" }}>
              {activeWeek + 1}/4
            </div>
            <div style={{ fontSize: 9, color: "#888", letterSpacing: 1, textTransform: "uppercase" }}>Week</div>
          </div>
        </div>

        {/* Week selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {PLAN.weeks.map((w, i) => (
            <button key={i} onClick={() => { setActiveWeek(i); setActiveDay(null); setView("plan"); }}
              style={{
                flex: 1, padding: "8px 4px", borderRadius: 10,
                background: activeWeek === i ? weekColors[i] : "#1A1A2E",
                border: `1px solid ${activeWeek === i ? weekColors[i] : "#2A2A3E"}`,
                color: activeWeek === i ? "#fff" : "#666",
                fontSize: 11, fontWeight: 600, cursor: "pointer",
                transition: "all 0.2s",
              }}>
              W{i + 1}
            </button>
          ))}
        </div>

        {/* Nav */}
        <div style={{ display: "flex", gap: 8 }}>
          {[["plan", "📋 Plan"], ["log", "✏️ Log"], ["progress", "📊 Progress"]].map(([v, label]) => (
            <button key={v} onClick={() => setView(v)}
              style={{
                flex: 1, padding: "8px 4px", borderRadius: 10,
                background: view === v ? `${accentColor}25` : "transparent",
                border: `1px solid ${view === v ? accentColor : "#2A2A3E"}`,
                color: view === v ? accentColor : "#666",
                fontSize: 11, fontWeight: 600, cursor: "pointer",
              }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 16px 100px" }}>

        {/* PLAN VIEW */}
        {view === "plan" && (
          <div>
            {/* Week info */}
            <div style={{
              background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}05)`,
              border: `1px solid ${accentColor}30`,
              borderRadius: 16, padding: 16, marginBottom: 20,
            }}>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: 22, color: accentColor, letterSpacing: 1 }}>
                WEEK {activeWeek + 1}: {week.theme.toUpperCase()}
              </div>
              <div style={{ fontSize: 13, color: "#AAA", lineHeight: 1.5, marginTop: 6 }}>
                {week.focus}
              </div>
            </div>

            {/* Knee alert banner */}
            <div style={{
              background: "#FF336615",
              border: "1px solid #FF336640",
              borderRadius: 12, padding: "10px 14px", marginBottom: 16,
              display: "flex", alignItems: "flex-start", gap: 10,
            }}>
              <span style={{ fontSize: 18 }}>🦵</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#FF3366", marginBottom: 2 }}>Right Knee Protocol Active</div>
                <div style={{ fontSize: 11, color: "#999", lineHeight: 1.5 }}>Barbell squats & split squats replaced with knee-safe alternatives. Prehab & rehab blocks added to every leg day. See a physio if pain doesn't improve in 2–3 weeks.</div>
              </div>
            </div>

            {/* Days */}
            {week.days.map((day, di) => {
              const color = splitColors[day.split] || { bg: accentColor, light: `${accentColor}20` };
              const prog = getDayProgress(activeWeek, di);
              return (
                <div key={di}
                  onClick={() => { setActiveDay(activeDay === di ? null : di); setView("log"); }}
                  style={{
                    background: "#13131F",
                    border: `1px solid ${activeDay === di ? color.bg : "#2A2A3E"}`,
                    borderRadius: 14, marginBottom: 10, overflow: "hidden",
                    cursor: "pointer", transition: "all 0.2s",
                  }}>
                  <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: color.light,
                        border: `1px solid ${color.bg}40`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 700, color: color.bg, letterSpacing: 0.5,
                      }}>
                        {day.label.slice(0, 3).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{day.split}</div>
                        <div style={{ fontSize: 11, color: "#666", marginTop: 1 }}>{day.focus} · {day.exercises.length} exercises · {day.duration || "~55 min"}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      {prog > 0 && (
                        <div style={{ fontSize: 13, fontWeight: 700, color: prog === 100 ? "#4ECDC4" : accentColor }}>
                          {prog}%
                        </div>
                      )}
                      <div style={{ fontSize: 18, color: "#444" }}>{activeDay === di ? "↑" : "↓"}</div>
                    </div>
                  </div>
                  {prog > 0 && (
                    <div style={{ height: 2, background: "#2A2A3E", margin: "0 16px 12px" }}>
                      <div style={{ height: "100%", width: `${prog}%`, background: prog === 100 ? "#4ECDC4" : accentColor, borderRadius: 2, transition: "width 0.3s" }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* LOG VIEW */}
        {view === "log" && (
          <div>
            {activeDay === null ? (
              <div>
                <div style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>Select a day to log your workout:</div>
                {week.days.map((day, di) => {
                  const color = splitColors[day.split] || { bg: accentColor, light: `${accentColor}20` };
                  const prog = getDayProgress(activeWeek, di);
                  return (
                    <button key={di} onClick={() => setActiveDay(di)}
                      style={{
                        width: "100%", background: "#13131F",
                        border: `1px solid #2A2A3E`, borderRadius: 12,
                        padding: "14px 16px", marginBottom: 10, cursor: "pointer",
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        color: "#E8E8F0",
                      }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: color.bg }} />
                        <div style={{ textAlign: "left" }}>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{day.label} — {day.split}</div>
                          <div style={{ fontSize: 11, color: "#666" }}>{day.focus}</div>
                        </div>
                      </div>
                      {prog > 0 ? (
                        <span style={{ fontSize: 12, color: prog === 100 ? "#4ECDC4" : accentColor, fontWeight: 700 }}>{prog}% done</span>
                      ) : (
                        <span style={{ fontSize: 18, color: "#444" }}>→</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div>
                <button onClick={() => setActiveDay(null)} style={{
                  background: "none", border: "none", color: accentColor, fontSize: 13,
                  cursor: "pointer", marginBottom: 16, display: "flex", alignItems: "center", gap: 4,
                }}>
                  ← Back to days
                </button>

                {(() => {
                  const day = week.days[activeDay];
                  const color = splitColors[day.split] || { bg: accentColor, light: `${accentColor}20` };
                  const prog = getDayProgress(activeWeek, activeDay);
                  return (
                    <div>
                      <div style={{
                        background: `${color.light}`, border: `1px solid ${color.bg}40`,
                        borderRadius: 14, padding: 16, marginBottom: 20,
                      }}>
                        <div style={{ fontFamily: "'Bebas Neue'", fontSize: 20, color: color.bg, letterSpacing: 1 }}>
                          {day.label.toUpperCase()} — {day.split.toUpperCase()}
                        </div>
                        <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>{day.focus}</div>
                        {prog > 0 && (
                          <div style={{ marginTop: 10 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#666", marginBottom: 4 }}>
                              <span>Session Progress</span><span style={{ color: color.bg, fontWeight: 700 }}>{prog}%</span>
                            </div>
                            <div style={{ height: 4, background: "#0A0A0F30", borderRadius: 2 }}>
                              <div style={{ height: "100%", width: `${prog}%`, background: color.bg, borderRadius: 2, transition: "width 0.3s" }} />
                            </div>
                          </div>
                        )}
                      </div>

                      {day.exercises.map((ex, ei) => {
                        const exKey = `${activeWeek}_${activeDay}_${ei}`;
                        const isOpen = !!expandedEx[exKey];
                        const isKnee = ex.name.startsWith("🦵");
                        return (
                        <div key={ei} style={{
                          background: "#13131F", border: `1px solid ${isKnee ? "#FF336630" : "#2A2A3E"}`,
                          borderRadius: 14, marginBottom: 12, overflow: "hidden",
                        }}>
                          {/* Header — always visible, tap to expand */}
                          <div
                            onClick={() => toggleEx(exKey)}
                            style={{ padding: "14px 16px 10px", cursor: "pointer", userSelect: "none" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                              <div style={{ fontWeight: 600, fontSize: 14, flex: 1, paddingRight: 8 }}>{ex.name}</div>
                              <span style={{ fontSize: 16, color: "#444", flexShrink: 0 }}>{isOpen ? "▲" : "▼"}</span>
                            </div>
                            <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                              {[`${ex.sets} sets`, `${ex.reps} reps`, `Rest ${ex.rest}`, `Tempo ${ex.tempo}`].map(tag => (
                                <span key={tag} style={{
                                  fontSize: 10, background: isKnee ? "#FF336615" : `${color.bg}15`,
                                  color: isKnee ? "#FF3366" : color.bg, padding: "2px 8px", borderRadius: 20, fontWeight: 600,
                                }}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Expanded content */}
                          {isOpen && (
                            <div style={{ borderTop: "1px solid #2A2A3E20" }}>
                              {/* Exercise Info Card */}
                              {!isKnee && (() => {
                                const info = MUSCLE_INFO[ex.name];
                                const ytQuery = YOUTUBE_SEARCH[ex.name];
                                const ytUrl = ytQuery ? `https://www.youtube.com/results?search_query=${ytQuery}` : null;
                                return (
                                  <div style={{ background: "#0D0D18", padding: "14px 16px", borderBottom: "1px solid #2A2A3E20" }}>
                                    {info && (
                                      <div style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "stretch" }}>
                                        {/* Muscle visual block */}
                                        <div style={{
                                          flex: 1, background: `${info.color}12`, border: `1px solid ${info.color}30`,
                                          borderRadius: 10, padding: "10px 12px",
                                        }}>
                                          <div style={{ fontSize: 9, color: "#555", textTransform: "uppercase", letterSpacing: 1, fontWeight: 700, marginBottom: 6 }}>Primary</div>
                                          <div style={{ fontSize: 13, fontWeight: 700, color: info.color }}>{info.primary}</div>
                                        </div>
                                        <div style={{
                                          flex: 1, background: "#1A1A2E", border: "1px solid #2A2A3E",
                                          borderRadius: 10, padding: "10px 12px",
                                        }}>
                                          <div style={{ fontSize: 9, color: "#555", textTransform: "uppercase", letterSpacing: 1, fontWeight: 700, marginBottom: 6 }}>Secondary</div>
                                          <div style={{ fontSize: 12, fontWeight: 600, color: "#888" }}>{info.secondary}</div>
                                        </div>
                                      </div>
                                    )}
                                    {ytUrl && (
                                      <a href={ytUrl} target="_blank" rel="noopener noreferrer"
                                        style={{
                                          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                          background: "#FF000015", border: "1px solid #FF000040",
                                          borderRadius: 10, padding: "10px 16px",
                                          color: "#FF4444", textDecoration: "none", fontSize: 12, fontWeight: 700,
                                        }}>
                                        <span style={{ fontSize: 16 }}>▶</span> Watch Demo on YouTube
                                      </a>
                                    )}
                                  </div>
                                );
                              })()}

                              {/* Notes */}
                              <div style={{ padding: "10px 16px 6px", fontSize: 11, color: "#666", fontStyle: "italic" }}>
                                💡 {ex.notes}
                              </div>

                              {/* Log inputs */}
                              <div style={{ padding: "0 16px 12px" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "28px 1fr 1fr 1fr 28px", gap: 6, marginBottom: 6 }}>
                                  {["", "Weight (kg)", "Reps Done", "Notes", ""].map((h, i) => (
                                    <div key={i} style={{ fontSize: 9, color: "#555", textAlign: "center", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</div>
                                  ))}
                                </div>
                                {Array.from({ length: ex.sets }).map((_, si) => {
                                  const done = isSetComplete(activeWeek, activeDay, ei, si);
                                  return (
                                    <div key={si} style={{
                                      display: "grid", gridTemplateColumns: "28px 1fr 1fr 1fr 28px",
                                      gap: 6, marginBottom: 6, alignItems: "center",
                                      opacity: done ? 0.6 : 1,
                                    }}>
                                      <div style={{ fontSize: 11, color: "#555", textAlign: "center", fontWeight: 600 }}>
                                        {si + 1}
                                      </div>
                                      <input
                                        type="number" placeholder="kg"
                                        value={getLog(activeWeek, activeDay, ei, si, "weight")}
                                        onChange={e => updateLog(activeWeek, activeDay, ei, si, "weight", e.target.value)}
                                        style={{
                                          background: "#0A0A0F", border: `1px solid ${done ? "#2A2A3E" : "#3A3A4E"}`,
                                          borderRadius: 8, padding: "6px 8px", color: "#E8E8F0",
                                          fontSize: 13, textAlign: "center", width: "100%",
                                        }}
                                      />
                                      <input
                                        type="number" placeholder="reps"
                                        value={getLog(activeWeek, activeDay, ei, si, "reps")}
                                        onChange={e => updateLog(activeWeek, activeDay, ei, si, "reps", e.target.value)}
                                        style={{
                                          background: "#0A0A0F", border: `1px solid ${done ? "#2A2A3E" : "#3A3A4E"}`,
                                          borderRadius: 8, padding: "6px 8px", color: "#E8E8F0",
                                          fontSize: 13, textAlign: "center", width: "100%",
                                        }}
                                      />
                                      <input
                                        type="text" placeholder="note"
                                        value={getLog(activeWeek, activeDay, ei, si, "note")}
                                        onChange={e => updateLog(activeWeek, activeDay, ei, si, "note", e.target.value)}
                                        style={{
                                          background: "#0A0A0F", border: `1px solid ${done ? "#2A2A3E" : "#3A3A4E"}`,
                                          borderRadius: 8, padding: "6px 8px", color: "#E8E8F0",
                                          fontSize: 12, width: "100%",
                                        }}
                                      />
                                      <button onClick={() => toggleSetComplete(activeWeek, activeDay, ei, si)}
                                        style={{
                                          width: 26, height: 26, borderRadius: 8,
                                          background: done ? "#4ECDC4" : "#2A2A3E",
                                          border: "none", cursor: "pointer",
                                          display: "flex", alignItems: "center", justifyContent: "center",
                                          fontSize: 12,
                                        }}>
                                        {done ? "✓" : "○"}
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* PROGRESS VIEW */}
        {view === "progress" && (
          <div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 24, letterSpacing: 1, marginBottom: 4 }}>PROGRESS OVERVIEW</div>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 20 }}>Track your logged data across all weeks</div>

            {PLAN.weeks.map((w, wi) => {
              let totalSets = 0, loggedSets = 0;
              w.days.forEach((day, di) => {
                day.exercises.forEach((ex, ei) => {
                  for (let s = 0; s < ex.sets; s++) {
                    totalSets++;
                    if (isSetComplete(wi, di, ei, s)) loggedSets++;
                  }
                });
              });
              const pct = totalSets > 0 ? Math.round((loggedSets / totalSets) * 100) : 0;
              const wc = weekColors[wi];
              return (
                <div key={wi} style={{
                  background: "#13131F", border: `1px solid #2A2A3E`,
                  borderRadius: 14, padding: 16, marginBottom: 12,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontFamily: "'Bebas Neue'", fontSize: 18, color: wc, letterSpacing: 1 }}>
                        WEEK {wi + 1}: {w.theme.toUpperCase()}
                      </div>
                      <div style={{ fontSize: 11, color: "#666" }}>{loggedSets} / {totalSets} sets completed</div>
                    </div>
                    <div style={{
                      fontSize: 24, fontWeight: 700, color: pct === 100 ? "#4ECDC4" : wc,
                      fontFamily: "'Bebas Neue'", letterSpacing: 1,
                    }}>
                      {pct}%
                    </div>
                  </div>
                  <div style={{ height: 6, background: "#2A2A3E", borderRadius: 3 }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#4ECDC4" : wc, borderRadius: 3, transition: "width 0.5s" }} />
                  </div>

                  {/* Show key lifts logged */}
                  {wi === activeWeek && (
                    <div style={{ marginTop: 14 }}>
                      <div style={{ fontSize: 11, color: "#666", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                        Key Lift Logs (Week {wi + 1})
                      </div>
                      {[
                       { label: "Bench Press", di: 0, ei: 1 },
                       { label: "Box Squat", di: 2, ei: 2 },
                       { label: "OHP", di: 3, ei: 1 },
                       { label: "Pull-Ups", di: 4, ei: 1 },
                       { label: "RDL", di: 5, ei: 2 },
                      ].map(({ label, di, ei }) => {
                        const sets = PLAN.weeks[wi].days[di]?.exercises[ei]?.sets || 0;
                        const entries = Array.from({ length: sets }, (_, si) => ({
                          w: getLog(wi, di, ei, si, "weight"),
                          r: getLog(wi, di, ei, si, "reps"),
                        })).filter(e => e.w || e.r);
                        return (
                          <div key={label} style={{ marginBottom: 8, padding: "8px 10px", background: "#0A0A0F", borderRadius: 8 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontSize: 12, fontWeight: 600 }}>{label}</span>
                              {entries.length === 0 ? (
                                <span style={{ fontSize: 11, color: "#444" }}>Not logged yet</span>
                              ) : (
                                <div style={{ display: "flex", gap: 6 }}>
                                  {entries.map((e, i) => (
                                    <span key={i} style={{ fontSize: 10, background: `${wc}20`, color: wc, padding: "2px 6px", borderRadius: 6 }}>
                                      {e.w ? `${e.w}kg` : "—"} × {e.r || "—"}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            <div style={{
              background: "#13131F", border: "1px solid #2A2A3E",
              borderRadius: 14, padding: 16, marginTop: 4,
            }}>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: 16, color: "#666", marginBottom: 12 }}>YOUR STARTING STATS</div>
              {[
                { label: "Weight", value: "83.0 kg" },
                { label: "Body Fat", value: "24%" },
                { label: "Muscle %", value: "43%" },
                { label: "BMI", value: "27.0" },
                { label: "Metabolic Age", value: "37 yrs" },
                { label: "BMR", value: "1,728 kcal" },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #2A2A3E30" }}>
                  <span style={{ fontSize: 12, color: "#888" }}>{label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: accentColor }}>{value}</span>
                </div>
              ))}
              <div style={{ fontSize: 11, color: "#555", marginTop: 10, fontStyle: "italic" }}>
                🎯 Target: ~76–78 kg · 15–18% body fat · Timeline: 4–6 months
              </div>
            </div>

            {/* Backup & Restore */}
            <div style={{
              background: "#13131F", border: "1px solid #2A2A3E",
              borderRadius: 14, padding: 16, marginTop: 12,
            }}>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: 16, color: "#666", marginBottom: 4 }}>BACKUP & RESTORE</div>
              <div style={{ fontSize: 11, color: "#555", marginBottom: 14 }}>
                Export your logs as a JSON backup. If data is ever lost, share the file with Claude to restore everything.
              </div>

              {/* Backup display */}
              {(() => {
                const backup = JSON.stringify({ exportedAt: new Date().toISOString(), version: "1.0", logs, completedSets });
                return (
                  <>
                    <button
                      onClick={() => setShowBackup(!showBackup)}
                      style={{
                        width: "100%", padding: "12px 16px", borderRadius: 10, marginBottom: 10,
                        background: `${accentColor}20`, border: `1px solid ${accentColor}50`,
                        color: accentColor, fontSize: 13, fontWeight: 700, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      }}>
                      💾 {showBackup ? "Hide Backup" : "Show Backup Data"}
                    </button>
                    {showBackup && (
                      <div style={{ marginBottom: 10 }}>
                        <div style={{ fontSize: 11, color: "#666", marginBottom: 6 }}>
                          Copy all the text below and paste it to Claude — I'll save it as a file for you.
                        </div>
                        <textarea
                          readOnly
                          value={backup}
                          onFocus={e => e.target.select()}
                          style={{
                            width: "100%", height: 120, background: "#0A0A0F",
                            border: "1px solid #2A2A3E", borderRadius: 8,
                            color: "#4ECDC4", fontSize: 10, padding: 8,
                            resize: "none", fontFamily: "monospace",
                          }}
                        />
                      </div>
                    )}
                  </>
                );
              })()}

              {/* Import button */}
              <label style={{
                width: "100%", padding: "12px 16px", borderRadius: 10,
                background: "#1A1A2E", border: "1px solid #2A2A3E",
                color: "#666", fontSize: 13, fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}>
                ⬆ Restore from JSON
                <input type="file" accept=".json" style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = async (ev) => {
                      try {
                        const backup = JSON.parse(ev.target.result);
                        if (backup.logs) await saveLogs(backup.logs);
                        if (backup.completedSets) await saveCompleted(backup.completedSets);
                        alert("✅ Restore successful! Your logs have been reloaded.");
                      } catch {
                        alert("❌ Failed to restore. Make sure you're using a valid backup file.");
                      }
                    };
                    reader.readAsText(file);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}