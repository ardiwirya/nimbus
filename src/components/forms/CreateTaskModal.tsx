import { Modal } from "../common/Modal";
import { TaskForm } from "./TaskForm";
import { useUIStore } from "../../store/useUIStore";

export function CreateTaskModal() {
  const { createTaskModalOpen, closeCreateTaskModal } = useUIStore();

  return (
    <Modal open={createTaskModalOpen} onClose={closeCreateTaskModal} title="Create task" size="md">
      <TaskForm onDone={closeCreateTaskModal} />
    </Modal>
  );
}
