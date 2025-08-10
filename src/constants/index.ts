export type Task = {
  id: string,
  name: string,
  startDate: any,
  endDate: any,
  category: "To Do" | "In Progress" | "Review" | "Completed";
}

export type DragState = {
  isDragging: boolean;
  dragType: "create" | "move" | "resize-left" | "resize-right" | null;
  startDate: Date | null;
  endDate: Date | null;
  taskId: string | null;
  originalTask: Task | null;
}

export type Filters = {
  categories: Set<string>;
  timeRange: "1week" | "2weeks" | "3weeks" | "all";
  search: string;
}

export const categoryOptions = [{
  label: "To Do",
  value: "To Do"
}, {
  label: "In Progress",
  value: "In Progress"
}, {
  label: "Review",
  value: "Review"
}, {
  label: "Completed",
  value: "Completed"
}]

export const categoryColors = {
  "To Do": "bg-blue-500",
  "In Progress": "bg-yellow-500",
  Review: "bg-purple-500",
  Completed: "bg-green-500",
};