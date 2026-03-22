import { useState, useEffect, useCallback } from "react";

type Task = {
  completed: boolean;
  id: string;
  title: string;
};

type TimerMode = "work" | "break" | "longBreak";

const TIMER_CONFIG = {
  work: 25 * 60,
  break: 5 * 60,
  longBreak: 15 * 60,
};

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

const modeLabel = {
  work: "Focus",
  break: "Short Break",
  longBreak: "Long Break",
};

const modeColors = {
  work: "text-red-400",
  break: "text-green-400",
  longBreak: "text-blue-400",
};

function Timer({ onComplete }: { onComplete: () => void }) {
  const [mode, setMode] = useState<TimerMode>("work");
  const [timeLeft, setTimeLeft] = useState(TIMER_CONFIG.work);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);

  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(TIMER_CONFIG[newMode]);
    setIsRunning(false);
  }, []);

  const handleComplete = useCallback(() => {
    onComplete();
    if (mode === "work") {
      const newSessions = sessions + 1;
      setSessions(newSessions);
      if (newSessions % 4 === 0) {
        switchMode("longBreak");
      } else {
        switchMode("break");
      }
    } else {
      switchMode("work");
    }
  }, [mode, sessions, switchMode, onComplete]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, handleComplete]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(TIMER_CONFIG[mode]);
  };

  return (
    <div className="flex flex-col items-center py-8">
      <div className="flex gap-2 mb-6">
        {(["work", "break", "longBreak"] as TimerMode[]).map((m) => (
          <button
            key={m}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              mode === m
                ? "bg-white/20 text-white"
                : "text-white/50 hover:text-white/70"
            }`}
            onClick={() => switchMode(m)}
          >
            {modeLabel[m]}
          </button>
        ))}
      </div>

      <div
        className={`text-8xl font-light tabular-nums mb-6 ${modeColors[mode]}`}
      >
        {formatTime(timeLeft)}
      </div>

      <div className="flex gap-3">
        <button
          className="px-8 py-3 bg-white text-slate-900 rounded-full font-medium hover:bg-gray-100 transition-colors"
          onClick={toggleTimer}
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          className="px-6 py-3 border border-white/30 rounded-full font-medium hover:bg-white/10 transition-colors"
          onClick={resetTimer}
        >
          Reset
        </button>
      </div>

      <p className="text-white/40 text-sm mt-4">Session {sessions + 1}</p>
    </div>
  );
}

function Tasks() {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  function onSaveTask() {
    if (!input.trim()) return;
    setTasks([
      ...tasks,
      { completed: false, id: crypto.randomUUID(), title: input },
    ]);
    setInput("");
  }

  function completeTask({ id }: Task) {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  function deleteTask({ id }: Task) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  return (
    <div className="max-w-md mx-auto px-4">
      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40"
          placeholder="Add a task..."
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSaveTask()}
        />
        <button
          className="px-5 py-3 bg-white text-slate-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          onClick={onSaveTask}
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            className={`flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors ${
              task.completed ? "opacity-50" : ""
            }`}
            key={task.id}
          >
            <span
              className={`flex-1 ${
                task.completed ? "line-through text-white/50" : ""
              }`}
              onClick={() => completeTask(task)}
            >
              {task.title}
            </span>
            <button
              className="text-white/30 hover:text-red-400 px-2"
              onClick={() => deleteTask(task)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      {tasks.length === 0 && (
        <p className="text-white/30 text-center py-8">No tasks yet</p>
      )}
    </div>
  );
}

export default function Pomodoro() {
  const [key, setKey] = useState(0);

  return (
    <div className="bg-slate-900 min-h-screen w-full text-white">
      <Timer onComplete={() => setKey((k) => k + 1)} key={key} />

      <div className="border-t border-white/10 mt-4">
        <h2 className="text-center text-xl font-light py-6 text-white/70">
          Tasks
        </h2>
        <Tasks />
      </div>
    </div>
  );
}
