import { Modal } from "../common/Modal";
import { ProjectForm } from "./ProjectForm";
import { useUIStore } from "../../store/useUIStore";

export function CreateProjectModal() {
  const { createProjectModalOpen, closeCreateProjectModal } = useUIStore();

  return (
    <Modal open={createProjectModalOpen} onClose={closeCreateProjectModal} title="Create project" size="md">
      <ProjectForm onDone={closeCreateProjectModal} />
    </Modal>
  );
}
