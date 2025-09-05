import React, { useState, useEffect } from "react";
import "./App.css";
import { auth, db } from "./firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { 
  collection, addDoc, query, where, getDocs, Timestamp 
} from "firebase/firestore";

function App() {
  const [page, setPage] = useState("auth"); // auth, selectWorkout, tracker, history
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [user, setUser] = useState(null);
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const [form, setForm] = useState({ name: "", sets: "", reps: "", weight: "" });
  const [exercises, setExercises] = useState([]);
  const [history, setHistory] = useState([]);

  const workouts = ["Legs", "Back", "Biceps", "Shoulders", "Full-Body", "Cardio"];

  // --- Auth Handlers ---
  const handleAuthChange = (e) => setAuthForm({ ...authForm, [e.target.name]: e.target.value });

  const signup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, authForm.email, authForm.password);
      setUser(userCredential.user);
      setPage("selectWorkout");
    } catch (err) {
      alert(err.message);
    }
  };

  const login = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, authForm.email, authForm.password);
      setUser(userCredential.user);
      setPage("selectWorkout");
    } catch (err) {
      alert(err.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setPage("auth");
    setSelectedWorkouts([]);
    setExercises([]);
  };

  // --- Workout Selection ---
  const toggleWorkout = (name) => {
    setSelectedWorkouts((prev) =>
      prev.includes(name) ? prev.filter((w) => w !== name) : [...prev, name]
    );
  };

  const nextToTracker = () => setPage("tracker");

  // --- Tracker ---
  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddExercise = () => {
    if (!form.name || !form.sets || !form.reps) return;
    const weightArray = form.weight ? form.weight.split(",").map(w => Number(w.trim())) : [];
    setExercises([...exercises, { ...form, weight: weightArray }]);
    setForm({ name: "", sets: "", reps: "", weight: "" });
  };

  const handleDeleteExercise = (index) => setExercises(exercises.filter((_, i) => i !== index));

  const saveWorkout = async () => {
    if (!user) return;
    await addDoc(collection(db, "workouts"), {
      userId: user.uid,
      date: Timestamp.now(),
      workouts: selectedWorkouts,
      exercises
    });
    alert("Workout saved!");
    setSelectedWorkouts([]);
    setExercises([]);
    setPage("history");
  };

  // --- History ---
  const fetchHistory = async () => {
    if (!user) return;
    const q = query(collection(db, "workouts"), where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setHistory(data);
  };

  useEffect(() => {
    if (page === "history") fetchHistory();
  }, [page]);

  // --- Render Pages ---
  return (
    <div className="container">

      {page === "auth" && (
        <section className="auth-section">
          <h1>Workout Tracker</h1>
          <input name="email" type="email" placeholder="Email" value={authForm.email} onChange={handleAuthChange} />
          <input name="password" type="password" placeholder="Password" value={authForm.password} onChange={handleAuthChange} />
          <div className="button-row">
            <button onClick={signup}>Sign Up</button>
            <button onClick={login}>Login</button>
          </div>
        </section>
      )}

      {page === "selectWorkout" && (
        <section className="select-workout">
          <h2>Which workout are you doing today?</h2>
          <div className="workout-options">
            {workouts.map((w) => (
              <label key={w}>
                <input type="checkbox" checked={selectedWorkouts.includes(w)} onChange={() => toggleWorkout(w)} />
                {w}
              </label>
            ))}
          </div>
          <div className="button-row">
            <button onClick={nextToTracker}>Next</button>
            <button onClick={logout}>Logout</button>
          </div>
        </section>
      )}

      {page === "tracker" && (
        <section className="tracker-section">
          <h2>Workout Tracker</h2>
          <div className="form-row">
            <input name="name" placeholder="Exercise" value={form.name} onChange={handleFormChange} />
            <input name="sets" type="number" placeholder="Sets" value={form.sets} onChange={handleFormChange} />
            <input name="reps" type="number" placeholder="Reps" value={form.reps} onChange={handleFormChange} />
            <input name="weight" placeholder="Weights (comma separated)" value={form.weight} onChange={handleFormChange} />
            <button onClick={handleAddExercise}>Add Exercise</button>
          </div>

          <h3>Today's Exercises</h3>
          <div className="exercise-list">
            {exercises.map((ex, idx) => (
              <div className="exercise-row" key={idx}>
                <span>{ex.name}</span>
                <span>{ex.sets} sets × {ex.reps} reps</span>
                <span>Weights: {ex.weight.join(", ")}</span>
                <button onClick={() => handleDeleteExercise(idx)}>Delete</button>
              </div>
            ))}
          </div>

          <div className="button-row">
            <button onClick={saveWorkout}>Save Workout</button>
            <button onClick={() => setPage("selectWorkout")}>Back</button>
          </div>
        </section>
      )}

      {page === "history" && (
        <section className="history-section">
          <h2>Workout History</h2>
          {history.length === 0 ? (
            <p>No workouts yet</p>
          ) : (
            history.map((w) => (
              <div className="history-card" key={w.id}>
                <h4>{w.date.toDate().toLocaleString()}</h4>
                <p>Workouts: {w.workouts.join(", ")}</p>
                {w.exercises.map((ex, i) => (
                  <p key={i}>{ex.name} — {ex.sets} sets × {ex.reps} reps — Weights: {ex.weight.join(", ")}</p>
                ))}
              </div>
            ))
          )}
          <div className="button-row">
            <button onClick={() => setPage("selectWorkout")}>Back</button>
            <button onClick={logout}>Logout</button>
          </div>
        </section>
      )}

    </div>
  );
}

export default App;
