import { Button } from "../../component/button";
import { Input } from "../../component/form-elements/input";
import { Select } from "../../component/form-elements/select";
import { categoryOptions } from "../../constants";
import { formatDate } from "../../utils/common";

interface formProps {
  formik: any;
  showModal: {
    value: boolean;
    type: string;
  };
  setShowModal: any;
  handleDeleteTask: any;
}

export const Form = (props: formProps) => {
  const { formik, showModal, setShowModal, handleDeleteTask } = props;

  return (
    <div>
      <div>
        <Input
          name="name"
          label="Task Name"
          type="text"
          value={formik.values.name}
          onChange={formik.handleChange}
          placeholder="Enter task name..."
          onBlur={formik.handleBlur}
          error={formik.touched.name && formik.errors.name}
        />
      </div>
      <div>
        <Select
          name="category"
          label="Category"
          options={categoryOptions}
          value={formik.values.category}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.category && formik.errors.category}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Input
            name="startDate"
            label="Start Date"
            type="date"
            value={
              showModal.type === "edit"
                ? formatDate(formik.values.startDate)
                : formik.values.startDate
            }
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.startDate && formik.errors.startDate}
          />
        </div>
        <div>
          <Input
            name="endDate"
            label="End Date"
            type="date"
            value={
              showModal.type === "edit"
                ? formatDate(formik.values.endDate)
                : formik.values.endDate
            }
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.endDate && formik.errors.endDate}
          />
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          onClick={formik.handleSubmit}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {showModal.type === "edit" ? "Update" : "Create Task"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            setShowModal({
              value: false,
              type: "",
            })
          }
          className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
        >
          Cancel
        </Button>
        {showModal.type === "edit" && (
          <Button
            type="button"
            variant="danger"
            onClick={() => {
              handleDeleteTask();
            }}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};
