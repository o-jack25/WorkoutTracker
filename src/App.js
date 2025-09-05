import { useState, useEffect } from "react";
import "./App.css";

function App() {
  // Step navigation: 1 = selection, 2 = tracker
  const [step, setStep] = useState(1);

  // Selected workouts
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);

  // Tracker exercises
  const [exercises, setExercises] = useState(() => {
    const saved = localStorage.getItem("exercises");
    return saved ? JSON.parse(saved) : [];
  });

  // Tracker form state
  const [form, setForm] = useState({
    name: "",
    sets: "",
    reps: "",
    weight: [] // array of weights per set
  });

  // Save exercises to localStorage
  useEffect(() => {
    localStorage.setItem("exercises", JSON.stringify(exercises));
  }, [exercises]);

  // Toggle workout selection
  const toggleWorkout = (workout) => {
    if (selectedWorkouts.includes(workout)) {
      setSelectedWorkouts(selectedWorkouts.filter((w) => w !== workout));
    } else {
      setSelectedWorkouts([...selectedWorkouts, workout]);
    }
  };

  // Form input change for name, sets, reps
  const handleChange = (e) => {
    const { name, value } = e.target;

    // If changing sets, reset weight array to match new number of sets
    if (name === "sets") {
      const setsNumber = parseInt(value) || 0;
      setForm({
        ...form,
        sets: setsNumber,
        weight: Array(setsNumber).fill("")
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Add exercise
  const handleAddExercise = (e) => {
    e.preventDefault();
    if (!form.name || !form.sets || !form.reps) return;

    // Ensure weight is always an array
    const safeWeight = Array.isArray(form.weight)
      ? form.weight
      : form.weight
      ? [form.weight]
      : [];

    setExercises([...exercises, { ...form, weight: safeWeight }]);

    // Reset form
    setForm({ name: "", sets: "", reps: "", weight: [] });
  };

  // Delete exercise
  const handleDeleteExercise = (index) => {
    const updated = exercises.filter((_, i) => i !== index);
    setExercises(updated);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      {/* Step 1: Workout selection */}
      {step === 1 && (
        <div style={{ textAlign: "center" }}>
          <h1>Which workout are you doing today?</h1>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginTop: "20px",
              justifyContent: "center"
            }}
          >
            {["Legs", "Back", "Biceps", "Shoulders", "Full-body", "Cardio"].map(
              (workout) => (
                <button
                  key={workout}
                  onClick={() => toggleWorkout(workout)}
                  style={{
                    padding: "10px 15px",
                    borderRadius: "5px",
                    border: selectedWorkouts.includes(workout)
                      ? "2px solid #007bff"
                      : "1px solid #ccc",
                    backgroundColor: selectedWorkouts.includes(workout)
                      ? "#e0f0ff"
                      : "#fff",
                    cursor: "pointer"
                  }}
                >
                  {workout}
                </button>
              )
            )}
          </div>

          <button
            onClick={() => setStep(2)}
            style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
            disabled={selectedWorkouts.length === 0}
          >
            Next
          </button>
        </div>
      )}

      {/* Step 2: Tracker page */}
      {step === 2 && (
        <div>
          {/* Back button */}
          <button
            onClick={() => setStep(1)}
            style={{
              marginBottom: "20px",
              padding: "8px 15px",
              cursor: "pointer",
              borderRadius: "5px",
              border: "1px solid #ccc",
              backgroundColor: "#f0f0f0"
            }}
          >
            ← Back
          </button>

          <h1>🏋️ Workout Tracker</h1>
          <p>Selected Workouts: {selectedWorkouts.join(", ")}</p>

          <form onSubmit={handleAddExercise} style={{ marginBottom: "20px" }}>
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

            {/* Dynamic per-set weight inputs */}
            {form.sets > 0 &&
              Array.from({ length: form.sets }).map((_, i) => (
                <div className="form-row" key={i}>
                  <label>Set {i + 1} Weight:</label>
                  <input
                    type="number"
                    value={form.weight[i] || ""}
                    onChange={(e) => {
                      const newWeights = [...form.weight];
                      newWeights[i] = e.target.value;
                      setForm({ ...form, weight: newWeights });
                    }}
                    placeholder="Weight (lbs)"
                  />
                </div>
              ))}

            <button type="submit">Add Exercise</button>
          </form>

          <h2>Today's Workout</h2>
          <div className="exercise-grid">
            <div className="grid-header">
              <div>Exercise</div>
              <div>Sets</div>
              <div>Reps</div>
              <div>Weight</div>
              <div>Action</div>
            </div>

            {exercises.map((ex, index) => (
              <div className="grid-row" key={index}>
                <div>{ex.name}</div>
                <div>{ex.sets}</div>
                <div>{ex.reps}</div>
                <div>
                  {Array.isArray(ex.weight) && ex.weight.length > 0
                    ? ex.weight.join(" lbs, ") + " lbs"
                    : typeof ex.weight === "number"
                    ? ex.weight + " lbs"
                    : "-"}
                </div>
                <div>
                  <button onClick={() => handleDeleteExercise(index)}>Delete</button>
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
