import { categoryColors, Filters } from "../../constants";

export const FilterComponent = (props: any) => {
  const { filters, setFilters } = props;
  return (
    <div className="ml-2">
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
        {(["To Do", "In Progress", "Review", "Completed"] as const).map(
          (category) => (
            <label
              key={category}
              className="flex items-center gap-2 mb-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.categories.has(category)}
                onChange={(e) => {
                  const newCategories = new Set(filters.categories);
                  if (e.target.checked) {
                    newCategories.add(category);
                  } else {
                    newCategories.delete(category);
                  }
                  setFilters((prev: any) => ({
                    ...prev,
                    categories: newCategories,
                  }));
                }}
                className="rounded text-blue-600"
              />
              <div
                className={`w-3 h-3 rounded ${categoryColors[category]}`}
              ></div>
              <span className="text-sm text-gray-600">{category}</span>
            </label>
          )
        )}
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Time Range</h3>
        {[
          { value: "all", label: "All tasks" },
          { value: "1week", label: "Within 1 week" },
          { value: "2weeks", label: "Within 2 weeks" },
          { value: "3weeks", label: "Within 3 weeks" },
        ].map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 mb-2 cursor-pointer"
          >
            <input
              type="radio"
              name="timeRange"
              value={option.value}
              checked={filters.timeRange === option.value}
              onChange={(e) => {
                setFilters((prev: any) => ({
                  ...prev,
                  timeRange: e.target.value as Filters["timeRange"],
                }));
              }}
              className="text-blue-600"
            />
            <span className="text-sm text-gray-600">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
