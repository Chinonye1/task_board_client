import { useState, useEffect, type SyntheticEvent } from "react";
import { useParams } from "react-router-dom";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { api } from "../lib/api";
import type { Project } from "../types";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import DroppableColumn from "../components/DroppableColumn";
import DraggableTask from "../components/DraggableTask";

const STATUSES = ["todo", "in-progress", "done"];

export default function BoardPage() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);

  useEffect(() => {
    async function loadProject() {
      try {
        const data = await api.get(`/projects/${id}`);
        setProject(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [id]);

  async function handleAddTask(e: SyntheticEvent) {
    e.preventDefault();
    if (!title.trim() || !project) return;

    try {
      const newTask = await api.post("/tasks", {
        title,
        projectId: project.id,
      });
      setProject({ ...project, tasks: [...(project.tasks ?? []), newTask] });
      setTitle("");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || !project) return;

    const taskId = String(active.id);
    const newStatus = String(over.id);

    const task = project.tasks?.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    const updatedTasks = project.tasks?.map((t) =>
      t.id === taskId ? { ...t, status: newStatus } : t
    );
    setProject({ ...project, tasks: updatedTasks });

    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function confirmDelete() {
    if (!project || !deleteTaskId) return;

    const updatedTasks = project.tasks?.filter((t) => t.id !== deleteTaskId);
    setProject({ ...project, tasks: updatedTasks });

    try {
      await api.delete(`/tasks/${deleteTaskId}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setDeleteTaskId(null);
    }
  }


  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!project) return <Alert severity="warning">Project not found</Alert>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {project.name}
      </Typography>

      <Stack
        component="form"
        direction="row"
        spacing={1}
        onSubmit={handleAddTask}
        sx={{ mb: 3 }}
      >
        <TextField
          label="New task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          size="small"
        />
        <Button type="submit" variant="contained">
          Add Task
        </Button>
      </Stack>

      <DndContext onDragEnd={handleDragEnd}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
          {STATUSES.map((status) => (
            <DroppableColumn key={status} status={status}>
              {project.tasks
                ?.filter((task) => task.status === status)
                .map((task) => (
                  <DraggableTask
                    key={task.id}
                    task={task}
                    onDelete={setDeleteTaskId}
                  />
                ))}
            </DroppableColumn>
          ))}
        </Box>
      </DndContext>

      <Dialog open={deleteTaskId !== null} onClose={() => setDeleteTaskId(null)}>
        <DialogTitle>Delete task?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This can't be undone. The task will be permanently removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTaskId(null)}>Cancel</Button>
          <Button color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
