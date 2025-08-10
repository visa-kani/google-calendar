import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
} from "lucide-react";
import { FilterComponent } from "../../pages/google-calender/filter";
import { Modal } from "../../component/modal";
import {
  addDays,
  formatDate,
  getWeeksInMonth,
  isSameDay,
} from "../../utils/common";
import { categoryColors, DragState, Filters, Task } from "../../constants";
import { useFormik } from "formik";
import * as yup from "yup";
import { Form } from "./form";

export default function TaskPlanner() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterModal, setFilterModal] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState({}) as any;
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragType: null,
    startDate: null,
    endDate: null,
    taskId: null,
    originalTask: null,
  });
  const [showModal, setShowModal] = useState({
    value: false,
    type: "",
  });
  const [filters, setFilters] = useState<Filters>({
    categories: new Set(["To Do", "In Progress", "Review", "Completed"]),
    timeRange: "all",
    search: "",
  });

  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getData = localStorage.getItem("tasks");
    if (getData) {
      const parseData = JSON.parse(getData);
      const filteredTasks = parseData.map((t: any) => ({
        ...t,
        startDate: new Date(t.startDate),
        endDate: new Date(t.endDate),
      }));
      setTasks(filteredTasks);
    }
  }, []);

  console.log(tasks);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const weeks = getWeeksInMonth(year, month);

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const filteredTasks = tasks.filter((task) => {
    // Category filter
    if (!filters.categories.has(task.category)) {
      return false;
    }

    // Time range filter
    if (filters.timeRange !== "all") {
      const today = new Date();
      const daysAhead =
        filters.timeRange === "1week"
          ? 7
          : filters.timeRange === "2weeks"
          ? 14
          : 21;
      const maxDate = addDays(today, daysAhead);

      if (task.startDate > maxDate) {
        return false;
      }
    }

    // Search filter (case-insensitive)
    if (filters.search.trim() !== "") {
      if (!task.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
    }

    return true;
  });

  const handleMouseDown = useCallback(
    (date: Date, e: React.MouseEvent) => {
      e.preventDefault();
      const target = e.target as HTMLElement;

      // Check if clicking on a task
      const taskElement = target.closest("[data-task-id]");
      if (taskElement) {
        const taskId = taskElement.getAttribute("data-task-id");
        const task = tasks.find((t) => t.id === taskId);
        if (task) {
          // Check if it's a double click (edit) or single click (drag)
          if (e.detail === 2) {
            // Double click - open edit modal
            setSelectedTask(task);
            console.log(task, "task77");
            setShowModal({ value: true, type: "edit" });
            return;
          }

          const rect = taskElement.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const elementWidth = rect.width;

          let dragType: DragState["dragType"] = "move";

          // Increase the edge detection area for better UX
          if (clickX < 15) {
            dragType = "resize-left";
          } else if (clickX > elementWidth - 15) {
            dragType = "resize-right";
          }

          setDragState({
            isDragging: true,
            dragType,
            startDate: new Date(task.startDate),
            endDate: new Date(task.endDate),
            taskId: task.id,
            originalTask: {
              ...task,
              startDate: new Date(task.startDate),
              endDate: new Date(task.endDate),
            },
          });
        }
      } else {
        // Start creating new task
        setDragState({
          isDragging: true,
          dragType: "create",
          startDate: new Date(date),
          endDate: new Date(date),
          taskId: null,
          originalTask: null,
        });
      }
    },
    [tasks]
  );

  const handleMouseMove = (date: Date) => {
    if (!dragState.isDragging) return;

    if (dragState.dragType === "create" && dragState.startDate) {
      setDragState((prev) => ({
        ...prev,
        endDate: date >= prev.startDate! ? new Date(date) : prev.startDate!,
      }));
      return;
    }

    if (!dragState.originalTask) return;

    if (dragState.dragType === "move") {
      const newStartDate = new Date(date);
      const originalEndDate = new Date(dragState.originalTask.endDate);

      setDragState((prev) => ({
        ...prev,
        startDate:
          newStartDate <= originalEndDate ? newStartDate : originalEndDate,
        endDate: originalEndDate,
      }));
    } else if (dragState.dragType === "resize-left") {
      const newStartDate = new Date(date);
      const originalEndDate = new Date(dragState.originalTask.endDate);

      setDragState((prev) => ({
        ...prev,
        startDate:
          newStartDate <= originalEndDate ? newStartDate : originalEndDate,
        endDate: originalEndDate,
      }));
    } else if (dragState.dragType === "resize-right") {
      const newEndDate = new Date(date);
      const originalStartDate = new Date(dragState.originalTask.startDate);

      setDragState((prev) => ({
        ...prev,
        startDate: originalStartDate,
        endDate:
          newEndDate >= originalStartDate ? newEndDate : originalStartDate,
      }));
    }
  };

  const handleMouseUp = () => {
    if (!dragState.isDragging) return;
    console.log(dragState.startDate, dragState.endDate, "handleMouseUp");
    if (
      dragState.dragType === "create" &&
      dragState.startDate &&
      dragState.endDate
    ) {
      const startDate = new Date(dragState.startDate);
      const endDate = new Date(dragState.endDate);
      formik.setFieldValue("startDate", formatDate(startDate));
      formik.setFieldValue("endDate", formatDate(endDate));
      setShowModal({
        value: true,
        type: "create",
      });
      setSelectedTask({});
    } else if (dragState.taskId && dragState.startDate && dragState.endDate) {
      // Update existing task
      setTasks((prev) =>
        prev.map((task) =>
          task.id === dragState.taskId
            ? {
                ...task,
                startDate: new Date(dragState.startDate!),
                endDate: new Date(dragState.endDate!),
              }
            : task
        )
      );
    }
    setDragState({
      isDragging: false,
      dragType: null,
      startDate: null,
      endDate: null,
      taskId: null,
      originalTask: null,
    });
  };

  const handleDeleteTask = () => {
    console.log(selectedTask, "selectedTask--delete");
    localStorage.setItem(
      "tasks",
      JSON.stringify(tasks.filter((task) => task.id !== selectedTask.id))
    );
    setTasks((prev) => prev.filter((task) => task.id !== selectedTask.id));
    setShowModal({
      value: false,
      type: "",
    });
  };

  const getTaskStackPosition = (task: Task, dayDate: Date) => {
    const allTasksSorted = filteredTasks.slice().sort((a, b) => {
      const startA = new Date(a.startDate).getTime();
      const startB = new Date(b.startDate).getTime();
      const startDiff = startA - startB;
      if (startDiff !== 0) return startDiff;

      const endA = new Date(a.endDate).getTime();
      const endB = new Date(b.endDate).getTime();
      const endDiff = endB - endA;
      if (endDiff !== 0) return endDiff;

      return a.id.localeCompare(b.id);
    });

    const taskLane = allTasksSorted.findIndex((t) => t.id === task.id);

    const startTime = new Date(task.startDate).getTime();
    const endTime = new Date(task.endDate).getTime();
    const currentTime = dayDate.getTime();

    if (currentTime >= startTime && currentTime <= endTime) {
      return taskLane;
    }

    return -1;
  };

  const renderTask = (task: Task, dayDate: Date) => {
    let displayTask = task;
    if (
      dragState.isDragging &&
      dragState.taskId === task.id &&
      dragState.startDate &&
      dragState.endDate
    ) {
      displayTask = {
        ...task,
        startDate: dragState.startDate,
        endDate: dragState.endDate,
      };
    }
    const isFirstDay = isSameDay(displayTask.startDate, dayDate);
    const isLastDay = isSameDay(displayTask.endDate, dayDate);
    const isOnlyDay = isFirstDay && isLastDay;
    if (
      !isFirstDay &&
      !isLastDay &&
      (dayDate < displayTask.startDate || dayDate > displayTask.endDate)
    ) {
      return null;
    }

    const isMiddleDay = !isFirstDay && !isLastDay;
    const stackPosition = getTaskStackPosition(task, dayDate);

    if (stackPosition === -1) return null;

    const topOffset = 36 + stackPosition * 36;

    return (
      <div
        key={task.id}
        data-task-id={task.id}
        className={`
          absolute h-7 ${
            categoryColors[task.category]
          } text-white text-xs px-2 py-1 cursor-pointer z-10
          border border-gray-300 shadow-md rounded-sm
          ${isFirstDay ? "rounded-l-2xl" : ""}
          ${isLastDay ? "rounded-r-2xl" : ""}
          ${isOnlyDay ? "rounded-2xl" : ""}
          hover:opacity-90 hover:shadow-lg transition-all duration-200
          ${
            dragState.isDragging && dragState.taskId === task.id
              ? "opacity-70 shadow-lg"
              : ""
          }
        `}
        style={{
          top: `${topOffset}px`,
          left: isFirstDay ? "2px" : "0px",
          right: isLastDay ? "2px" : "0px",
          minWidth: isOnlyDay ? "60px" : "auto",
          marginBottom: "4px",
        }}
      >
        {isFirstDay && (
          <span className="truncate block font-medium">{task.name}</span>
        )}
        {isMiddleDay && (
          <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center rounded-sm"></div>
        )}
      </div>
    );
  };

  const renderPreviewTask = (dayDate: Date) => {
    if (
      !dragState.isDragging ||
      dragState.dragType !== "create" ||
      !dragState.startDate ||
      !dragState.endDate
    ) {
      return null;
    }

    if (dayDate < dragState.startDate || dayDate > dragState.endDate) {
      return null;
    }

    const isFirstDay = isSameDay(dragState.startDate, dayDate);
    const isLastDay = isSameDay(dragState.endDate, dayDate);
    const isOnlyDay = isFirstDay && isLastDay;

    const overlappingTasks = filteredTasks.filter(
      (t) => dayDate >= t.startDate && dayDate <= t.endDate
    );
    const previewStackPosition = overlappingTasks.length;
    const topOffset = 36 + previewStackPosition * 36;

    return (
      <div
        className={`
          absolute h-7 bg-gray-400 bg-opacity-60 border-2 border-dashed border-gray-600 text-white text-xs px-2 py-1 z-20 shadow-md rounded-sm
          ${isFirstDay ? "rounded-l-md" : ""}
          ${isLastDay ? "rounded-r-md" : ""}
          ${isOnlyDay ? "rounded-md" : ""}
        `}
        style={{
          top: `${topOffset}px`,
          left: isFirstDay ? "2px" : "0px",
          right: isLastDay ? "2px" : "0px",
          marginBottom: "4px",
        }}
      >
        {isFirstDay && <span className="font-medium">New Task</span>}
      </div>
    );
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => handleMouseUp();
    document.addEventListener("mouseup", handleGlobalMouseUp);
    return () => document.removeEventListener("mouseup", handleGlobalMouseUp);
  }, [dragState]);

  const initialValue = {
    id: selectedTask.id || "",
    name: selectedTask.name || "",
    category: selectedTask.category || "To Do",
    startDate: selectedTask.startDate || "",
    endDate: selectedTask.endDate || "",
  };

  const validationSchema = yup.object().shape({
    startDate: yup.date().required("Start date is required"),
    endDate: yup.date().required("End date is required"),
    name: yup.string().required("Name is required"),
    category: yup.string().required("Category is required"),
  });

  const formik = useFormik({
    initialValues: initialValue,
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values: any, { resetForm }: any) => {
      values.startDate = new Date(values.startDate);
      values.endDate = new Date(values.endDate);
      if (showModal.type === "create") {
        values.id = Date.now().toString();
        setTasks((prev: any) => [...prev, values]);
        localStorage.setItem("tasks", JSON.stringify([...tasks, values]));
      } else {
        setTasks((prev) => {
          const updatedTasks = prev.map((task) =>
            task.id == selectedTask.id ? { ...task, ...values } : task
          );
          localStorage.setItem("tasks", JSON.stringify(updatedTasks));
          return updatedTasks;
        });
      }
      resetForm();
      setShowModal({ value: false, type: "" });
    },
  });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Calendar Area */}
      <div className="flex-1">
        <div className="bg-white border-b-2 p-3">
          <div className="flex justify-between">
            <div className="flex items-center">
              <Calendar className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800 min-w-[200px] text-center">
                {currentDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <div className="relative">
                  <Search className="w-5 h-5 top-[7px] left-1.5 text-gray-400 align-middle absolute" />
                  <input
                    type="search"
                    name="search"
                    placeholder="Search tasks..."
                    value={filters.search}
                    onChange={(e) => {
                      setFilters((prev: any) => ({
                        ...prev,
                        search: e.target.value,
                      }));
                    }}
                    className="pl-7 py-1 border-2 border-gray-400 rounded-md text-sm focus:outline-none focus:border-blue-500 h-[35px] w-60"
                  />
                </div>
              </div>
              <div className="border-2 border-gray-400 rounded-md px-1 pt-0 pb-1">
                <Filter
                  onClick={() => setFilterModal(true)}
                  className="w-5 h-5 rounded-lg inline cursor-pointer text-gray-500 align-middle"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="border-2 border-gray-400 rounded-md px-1 pt-0 pb-1">
                  <button
                    onClick={goToPreviousMonth}
                    className="rounded-full hover:bg-gray-100 align-middle"
                    title="Previous month"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="border-2 border-gray-400 rounded-md px-1 pt-0 pb-1">
                  <button
                    onClick={goToNextMonth}
                    className="rounded-full hover:bg-gray-100 align-middle"
                    title="Next month"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
              <button
                onClick={goToToday}
                className="px-3 py-1.5 align-middle text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
              >
                Today
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-lg p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-gray-500">
                Double-click tasks to edit • Drag across days to create tasks •
                Drag tasks to reschedule • Drag edges to resize
              </div>
            </div>

            <div ref={calendarRef} className="select-none">
              {/* Days of week header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-medium text-gray-500 py-2"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>

              {/* Calendar grid */}
              <div
                className="grid grid-rows-6 gap-1"
                style={{ minHeight: "500px" }}
              >
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-cols-7 gap-1">
                    {week.map((date, dayIndex) => {
                      const isCurrentMonth = date.getMonth() === month;
                      const isToday = isSameDay(date, new Date());
                      const dayTasks = filteredTasks.filter(
                        (task) => date >= task.startDate && date <= task.endDate
                      );

                      const totalTasks = filteredTasks.length;
                      const requiredHeight = Math.max(
                        90,
                        36 + totalTasks * 40 + 16
                      );

                      return (
                        <div
                          key={`${weekIndex}-${dayIndex}`}
                          className={`
                          relative border border-gray-200 p-1 cursor-pointer transition-colors overflow-visible
                          ${
                            isCurrentMonth
                              ? "bg-white hover:bg-gray-50"
                              : "bg-gray-100 text-gray-400"
                          }
                          ${isToday ? "bg-blue-50 border-blue-300" : ""}
                        `}
                          style={{
                            minHeight: `${requiredHeight}px`,
                          }}
                          onMouseDown={(e) => handleMouseDown(date, e)}
                          onMouseEnter={() => handleMouseMove(date)}
                        >
                          <div
                            className={`text-sm ${
                              isToday ? "font-bold text-blue-600" : ""
                            }`}
                          >
                            {date.getDate()}
                          </div>
                          {dayTasks.map((task) => renderTask(task, date))}
                          {renderPreviewTask(date)}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={showModal.value}
        onClose={() => {
          setShowModal({
            value: false,
            type: "",
          });
          formik.resetForm();
          setSelectedTask({});
        }}
        title={showModal.type === "edit" ? "Edit Task" : "Create New Task"}
        maxWidth="md"
        type="center"
      >
        <Form
          formik={formik}
          showModal={showModal}
          setShowModal={setShowModal}
          handleDeleteTask={handleDeleteTask}
        />
      </Modal>
      <Modal
        isOpen={filterModal}
        onClose={() => setFilterModal(false)}
        title={
          <div className="inline items-center gap-2 align-middle">
            <Filter className="w-5 h-5 inline text-gray-600 align-middle" />
            <h2 className="text-lg font-semibold text-gray-800 inline align-middle pl-3">
              Filters
            </h2>
          </div>
        }
        maxWidth="sm"
      >
        <FilterComponent
          filters={filters}
          setFilters={setFilters}
        />
      </Modal>
    </div>
  );
}
