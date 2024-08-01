"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const TaskPage = () => {
  const tasks = useQuery(api.tasks.getTasks);
  const deleteTask = useMutation(api.tasks.deleteTask);

  return (
    <div className="p-10 flex flex-col gap-4">
      <h1 className="text-3xl">All Text here is in real time</h1>
      {tasks?.map((task) => (
        <div className="flex gap-2 items-center" key={task._id}>
          <span>{task.text}</span>
          <button 
            className="px-1 py-2 bg-slate-800"
            onClick={async() => await deleteTask({taskId: task._id})}
          >
            {"Delete Task"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default TaskPage;
