"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "twtodos.tasks";

function validateTask(value: string) {
  const task = value.trim();

  if (Array.from(task).length < 3) {
    return "A tarefa precisa ter pelo menos 3 caracteres.";
  }

  if (!/^\p{Lu}/u.test(task)) {
    return "A tarefa deve começar com uma letra maiúscula.";
  }

  return "";
}

export default function Home() {
  const [tasks, setTasks] = useState<string[]>([]);
  const [taskInput, setTaskInput] = useState("");
  const [taskFeedback, setTaskFeedback] = useState("");
  const [storageError, setStorageError] = useState("");
  const [taskStatus, setTaskStatus] = useState("");
  const [appReady, setAppReady] = useState(false);
  const taskInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEY);

      if (savedTasks !== null) {
        const parsedTasks: unknown = JSON.parse(savedTasks);

        if (
          !Array.isArray(parsedTasks) ||
          parsedTasks.some((task) => typeof task !== "string")
        ) {
          throw new TypeError("O formato dos dados salvos é inválido.");
        }

        setTasks(parsedTasks);
      }

      setAppReady(true);
    } catch (error) {
      console.error("Não foi possível carregar as tarefas salvas.", error);
      setStorageError(
        "Não foi possível acessar as tarefas salvas. Verifique o armazenamento do navegador e recarregue a página.",
      );
    }
  }, []);

  function saveTasks(nextTasks: string[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTasks));
    } catch (error) {
      console.error("Não foi possível salvar as tarefas.", error);
      setStorageError(
        "Não foi possível salvar. Verifique o espaço e as permissões de armazenamento do navegador.",
      );
      return false;
    }

    setTasks(nextTasks);
    setStorageError("");
    return true;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!appReady) return;

    const task = taskInput.trim();
    const error = validateTask(task);
    setTaskFeedback(error);

    if (error) {
      taskInputRef.current?.focus();
      return;
    }

    if (saveTasks([...tasks, task])) {
      setTaskInput("");
      setTaskStatus("Tarefa adicionada.");
      taskInputRef.current?.focus();
    }
  }

  function handleTaskAction(action: "up" | "down" | "delete", index: number) {
    if (!appReady || index < 0 || index >= tasks.length) return;

    const nextTasks = [...tasks];

    if (action === "delete") {
      nextTasks.splice(index, 1);
    } else if (action === "up" && index > 0) {
      [nextTasks[index - 1], nextTasks[index]] = [
        nextTasks[index],
        nextTasks[index - 1],
      ];
    } else if (action === "down" && index < nextTasks.length - 1) {
      [nextTasks[index + 1], nextTasks[index]] = [
        nextTasks[index],
        nextTasks[index + 1],
      ];
    } else {
      return;
    }

    if (saveTasks(nextTasks)) {
      setTaskStatus(
        action === "delete"
          ? "Tarefa excluída."
          : "Ordem das tarefas atualizada.",
      );
    }
  }

  const taskCount = tasks.length;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-5 py-10 sm:px-8 sm:py-16">
      <header className="mb-8 sm:mb-10">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <svg
              aria-hidden="true"
              className="size-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="m7 12.5 3.2 3.2L17.5 8"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
              />
              <path
                d="M12 3.5a8.5 8.5 0 1 0 8.5 8.5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2.2"
              />
            </svg>
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            TWTodos - Lista de tarefas
          </span>
        </div>

        <p className="mb-2 text-sm font-semibold tracking-wide text-blue-700">
          UM PASSO DE CADA VEZ x
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Organize suas tarefas
        </h1>
        <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">
          Tire as ideias da cabeça e coloque seus planos em ordem. Sua lista
          fica salva neste navegador.
        </p>
      </header>

      <section
        aria-labelledby="tasks-heading"
        className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-8"
      >
        <h2 id="tasks-heading" className="sr-only">
          Minhas tarefas
        </h2>

        <form className="mb-8" onSubmit={handleSubmit} noValidate>
          <label
            className="mb-2 block text-sm font-semibold text-slate-800"
            htmlFor="task-input"
          >
            Nova tarefa
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              ref={taskInputRef}
              id="task-input"
              aria-describedby={taskFeedback ? "task-feedback" : undefined}
              aria-invalid={Boolean(taskFeedback)}
              autoComplete="off"
              className={`min-w-0 flex-1 rounded-xl border bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-100 ${
                taskFeedback
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
              disabled={!appReady}
              onChange={(event) => {
                setTaskInput(event.target.value);
                if (taskFeedback) setTaskFeedback("");
              }}
              placeholder="Ex.: Estudar React"
              type="text"
              value={taskInput}
            />
            <button
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-md shadow-blue-600/15 transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!appReady}
              type="submit"
            >
              Adicionar tarefa
            </button>
          </div>
          {taskFeedback && (
            <p
              className="mt-2 text-sm text-red-600"
              id="task-feedback"
              role="alert"
            >
              {taskFeedback}
            </p>
          )}
        </form>

        {storageError && (
          <p
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800"
            role="alert"
          >
            {storageError}
          </p>
        )}

        <div className="mb-3 flex items-center justify-between gap-4">
          <h2 className="text-base font-semibold text-slate-900">Sua lista</h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
            {taskCount} {taskCount === 1 ? "tarefa" : "tarefas"}
          </span>
        </div>

        {taskCount > 0 ? (
          <ul className="divide-y divide-slate-100">
            {tasks.map((task, index) => (
              <li
                className="flex items-center justify-between gap-4 py-4 first:pt-3 last:pb-1"
                key={`${task}-${index}`}
              >
                <span className="min-w-0 flex-1 wrap-anywhere text-[0.95rem] leading-6 text-slate-700">
                  {task}
                </span>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    aria-label={`Mover para cima: ${task}`}
                    className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-35"
                    disabled={!appReady || index === 0}
                    onClick={() => handleTaskAction("up", index)}
                    type="button"
                  >
                    <span aria-hidden="true">↑</span>
                  </button>
                  <button
                    aria-label={`Mover para baixo: ${task}`}
                    className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-35"
                    disabled={!appReady || index === taskCount - 1}
                    onClick={() => handleTaskAction("down", index)}
                    type="button"
                  >
                    <span aria-hidden="true">↓</span>
                  </button>
                  <button
                    aria-label={`Excluir tarefa: ${task}`}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:opacity-35"
                    disabled={!appReady}
                    onClick={() => handleTaskAction("delete", index)}
                    type="button"
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-5 py-10 text-center">
            <span
              aria-hidden="true"
              className="mx-auto mb-3 flex size-11 items-center justify-center rounded-full bg-blue-100 text-xl text-blue-700"
            >
              +
            </span>
            <p className="font-medium text-slate-700">
              Nenhuma tarefa por aqui.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Adicione a primeira e comece a organizar seu dia.
            </p>
          </div>
        )}

        <p aria-live="polite" className="sr-only" role="status">
          {taskStatus}
        </p>
      </section>

      <footer className="mt-auto pt-8 text-center text-sm text-slate-500">
        Feito para ajudar você a focar no que importa.
      </footer>
    </main>
  );
}
