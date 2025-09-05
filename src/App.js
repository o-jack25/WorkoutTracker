import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  // Step control (1 = workout selection, 2 = tracker)
  const [step, setStep] = useState(1);

  // Selected workouts
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);

  // Tracker form state
  const [form, setForm] = useState({
    name: "",
    sets: "",
    reps: "",
    weight: []
  });

  const [exercises, setExercises] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("exercises");
    if (stored) setExercises(JSON.parse(stored));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("exercises", JSON.stringify(exercises));
  }, [exercises]);

  const workouts = ["Legs", "Back", "Biceps", "Shoulders", "Full-body", "Cardio"];

  const toggleWorkout = (name) => {
    if (selectedWorkouts.includes(name)) {
      setSelectedWorkouts(selectedWorkouts.filter((w) => w !== name));
    } else {
      setSelectedWorkouts([...selectedWorkouts, name]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAddExercise = (e) => {
    e.preventDefault();
    if (!form.name || !form.sets || !form.reps) return;

    // Split weight input by comma or space
    const weightsArray =
      typeof form.weight === "string"
        ? form.weight.split(/[,\s]+/).map((w) => w.trim()).filter(Boolean)
        : form.weight;

    setExercises([...exercises, { ...form, weight: weightsArray }]);
    setForm({ name: "", sets: "", reps: "", weight: [] });
  };

  const handleDeleteExercise = (index) => {
    const newExercises = [...exercises];
    newExercises.splice(index, 1);
    setExercises(newExercises);
  };

  return (
    <div className="App">
      {step === 1 && (
        <div className="selection-page">
          <h1>Which workout are you doing today?</h1>
          <div className="workout-buttons">
            {workouts.map((w) => (
              <button
                key={w}
                onClick={() => toggleWorkout(w)}
                className={selectedWorkouts.includes(w) ? "selected" : ""}
              >
                {w}
              </button>
            ))}
          </div>
          <button
            className="next-button"
            onClick={() => setStep(2)}
            disabled={selectedWorkouts.length === 0}
          >
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="tracker-page">
          <h2>Today's Workout</h2>
          <form onSubmit={handleAddExercise} className="tracker-form">
            <div className="form-row">
              <label>Exercise:</label>
              <input
                type="text"
                name="name"
                placeholder="Exercise"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <label>Sets:</label>
              <input
                type="number"
                name="sets"
                placeholder="Sets"
                value={form.sets}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <label>Reps:</label>
              <input
                type="number"
                name="reps"
                placeholder="Reps"
                value={form.reps}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <label>Weights (lbs, comma or space separated):</label>
              <input
                type="text"
                name="weight"
                placeholder="e.g. 60, 70, 80"
                value={form.weight}
                onChange={handleChange}
              />
            </div>

            <button type="submit">Add Exercise</button>
          </form>

          <div className="exercise-cards">
            {exercises.map((ex, index) => (
              <div className="exercise-card" key={index}>
                <div className="exercise-header">
                  <h3>{ex.name}</h3>
                  <button onClick={() => handleDeleteExercise(index)}>Delete</button>
                </div>
                <div className="exercise-info">
                  <p><strong>Sets:</strong> {ex.sets}</p>
                  <p><strong>Reps:</strong> {ex.reps}</p>
                  <p><strong>Weights:</strong></p>
                  <div className="weights-pills">
                    {Array.isArray(ex.weight) && ex.weight.length > 0
                      ? ex.weight.map((w, i) => (
                          <span key={i}>{w} lbs</span>
                        ))
                      : "-"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
