function TaskCard({ task, onDelete, onToggle, onEdit }) {
  return (
    <div className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-md p-4 shadow-md hover:shadow-xl transition duration-200">

      {/* Top Row */}
      <div className="flex justify-between items-start">
        
        <div className="flex items-center gap-2">
          {/* Checkbox */}
          <input
            type="checkbox"
            className="cursor-pointer size-4"
            checked={task.status === "completed"}
            onChange={() => onToggle(task.id)}
          />

          <h3 className={`text-lg font-semibold ${
            task.status === "completed"
              ? "line-through text-white/50"
              : "text-white"
          }`}>
            {task.title}
          </h3>

          <div className="pl-2 ml-1 bg-slate-200 rounded-md">
              <button onClick={() => onEdit(task)}>Edit 🖊️</button>
          </div>

        </div>

        <button
          onClick={() => onDelete(task.id)}
          className="bg-red-500 px-3 py-1 text-xs text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
      
      {/* Description */}
      <div className="mt-2 min-h-[20px]">
        <p className="text-sm text-white/70 line-clamp-2">
          {task.description || " "}
        </p>
      </div>
      

      <div className="mt-4 flex justify-between items-center text-xs text-white/60">

        {/* Status */}
        <span className={`px-2 py-1 rounded-md ${
          task.status === "completed"
            ? "bg-green-500/30 text-white"
            : "bg-yellow-500/40 text-white"
        }`}>
          {task.status}
        </span>

        {/* Priority */}
        <span className={`px-2 py-1 rounded-md  ${
          task.priority === "high"
            ? "bg-red-600 text-white"
            : task.priority === "low"
            ? "bg-blue-300 text-white"
            : "bg-gray-300/20 text-white"
        }`}>
          {task.priority}
        </span>

        {/* Deadline */}
        {task.deadline && (
          <span className="text-white">
            {new Date(task.deadline).toLocaleDateString()}
          </span>
        )}

      </div>

    </div>
  );
}

export default TaskCard;