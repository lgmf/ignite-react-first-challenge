import { FormEvent, useEffect, useRef, useState } from 'react'

import '../styles/tasklist.scss'

import { FiTrash, FiCheckSquare } from 'react-icons/fi'

interface Task {
  id: number;
  title: string;
  isComplete: boolean;
}

type TaskMap = { [id: number]: Task };

export function TaskList() {
  const [taskMap, setTaskMap] = useState<TaskMap>({});
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const taskTitleInputRef = useRef<HTMLInputElement>(null);

  function createTask(title: string, isComplete = false): Task {
    if (!title) {
      throw new Error('título é obrigatório');
    }

    return {
      id: tasks.length + 1,
      title,
      isComplete
    };
  }

  function handleCreateNewTask(event: FormEvent) {
    event.preventDefault();

    try {
      const task = createTask(newTaskTitle);
      setNewTaskTitle('');
      setTaskMap((prev) => ({
        ...prev,
        [task.id]: task
      }))
      taskTitleInputRef?.current?.focus();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  function handleToggleTaskCompletion(id: number) {
    setTaskMap((prev) => {
      const taskToUpdate = prev[id];
      return {
        ...prev,
        [id]: {
          ...taskToUpdate,
          isComplete: !taskToUpdate.isComplete,
        }
      }
    })
  }

  function handleRemoveTask(id: number) {
    setTaskMap((prev) => {
      delete prev[id];
      return { ...prev };
    })
  }

  useEffect(() => {
    setTasks(Object.values(taskMap));
  }, [taskMap])

  return (
    <section className="task-list container">
      <header>
        <h2>Minhas tasks</h2>

        <form className="input-group" onSubmit={handleCreateNewTask}>
          <input
            ref={taskTitleInputRef}
            type="text"
            placeholder="Adicionar novo todo"
            onChange={(e) => setNewTaskTitle(e.target.value)}
            value={newTaskTitle}
            required
            autoFocus
          />

          <button type="submit" data-testid="add-task-button">
            <FiCheckSquare size={16} color="#fff" />
          </button>
        </form>
      </header>

      <main>
        <ul>
          {tasks.map(task => (
            <li key={task.id}>
              <div className={task.isComplete ? 'completed' : ''} data-testid="task" >
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    readOnly
                    checked={task.isComplete}
                    onClick={() => handleToggleTaskCompletion(task.id)}
                  />
                  <span className="checkmark"></span>
                </label>
                <p>{task.title}</p>
              </div>

              <button type="button" data-testid="remove-task-button" onClick={() => handleRemoveTask(task.id)}>
                <FiTrash size={16} />
              </button>
            </li>
          ))}

        </ul>
      </main>
    </section>
  )
}