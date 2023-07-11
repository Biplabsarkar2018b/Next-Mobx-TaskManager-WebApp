import React from "react";
import { useSwipeable } from "react-swipeable";

const IN_PROGRESS = "In Progress";
const DONE = "Completed";
const TODO = "ToDo";

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  status: string;
  onEdit: () => void;
  onDelete: () => void;
  onDoing: () => void;
  onDone: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  id,
  title,
  description,
  status,
  onEdit,
  onDelete,
  onDoing,
  onDone,
}) => {
  const handlers = useSwipeable({
    onSwipedRight: () => onDelete(),
    onSwipedLeft: () => onDone(),
  });
  return (
    <div
      {...handlers}
      className="md:mx-[30%] bg-yellow-200 flex justify-between shadow-md rounded-lg p-4 mb-4"
    >
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-gray-600 mt-2">{description}</p>
        <div className="mt-4">
          <span className="text-sm font-medium text-gray-500">Status:</span>
          <span className="ml-1 text-sm font-semibold capitalize">
            {status}
          </span>
        </div>
      </div>
      {/* Buttons */}
      <div>
        <div className="flex justify-end mt-4">
          <button
            disabled={status == IN_PROGRESS || status == DONE}
            className={`${
              status != IN_PROGRESS && status != DONE
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-400"
            } text-white py-1 px-3 rounded mr-2`}
            onClick={onDoing}
          >
            Doing
          </button>
          <button
            disabled={status == DONE}
            className={`${
              status != DONE ? "bg-red-500 hover:bg-red-600" : "bg-gray-600"
            }text-white py-1 px-3 rounded`}
            onClick={onDone}
          >
            Done
          </button>
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded mr-2"
            onClick={onEdit}
          >
            Edit
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
