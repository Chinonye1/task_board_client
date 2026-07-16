import { useState, useEffect, type SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import type { Project } from "../types";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  function notify(message: string, severity: "success" | "error" = "success") {
    setToast({ open: true, message, severity });
  }

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await api.get("/projects");
        setProjects(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const newProject = await api.post("/projects", {
        name,
        description: description || null,
      });
      setProjects([newProject, ...projects]);
      setName("");
      setDescription("");
      notify("Project created");
    } catch (err) {
      notify((err as Error).message, "error");
    }
  }

  async function confirmDeleteProject() {
    if (!deleteProjectId) return;

    setProjects(projects.filter((p) => p.id !== deleteProjectId));

    try {
      await api.delete(`/projects/${deleteProjectId}`);
      notify("Project deleted");
    } catch (err) {
      notify((err as Error).message, "error");
    } finally {
      setDeleteProjectId(null);
    }
  }

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Projects
      </Typography>

      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={0}
        variant="outlined"
        sx={{ p: 2, mb: 3 }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <TextField
            label="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="small"
            required
          />
          <TextField
            label="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            size="small"
            sx={{ flexGrow: 1 }}
          />
          <Button type="submit" variant="contained">
            Add Project
          </Button>
        </Stack>
      </Paper>

      {projects.length === 0 ? (
        <Typography color="text.secondary">
          No projects yet — create your first one above.
        </Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr",
            },
          }}
        >
          {projects.map((project) => (
            <Card
              key={project.id}
              sx={{
                position: "relative",
                transition: "box-shadow 0.2s",
                "&:hover": { boxShadow: 4 },
              }}
            >
              <CardActionArea
                component={Link}
                to={`/projects/${project.id}`}
                sx={{ height: "100%" }}
              >
                <CardContent sx={{ pr: 5 }}>
                  <Typography variant="h6" gutterBottom>
                    {project.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {project.description || "No description"}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <IconButton
                size="small"
                onClick={() => setDeleteProjectId(project.id)}
                sx={{ position: "absolute", top: 8, right: 8 }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Card>
          ))}
        </Box>
      )}

      <Dialog
        open={deleteProjectId !== null}
        onClose={() => setDeleteProjectId(null)}
      >
        <DialogTitle>Delete project?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently delete the project and all of its tasks. This
            can't be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteProjectId(null)}>Cancel</Button>
          <Button color="error" onClick={confirmDeleteProject}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          onClose={() => setToast({ ...toast, open: false })}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
