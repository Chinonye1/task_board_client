import { useState, useEffect, type SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import type { Project } from "../types";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");

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
      const newProject = await api.post("/projects", { name });
      setProjects([newProject, ...projects]);
      setName("");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Projects
      </Typography>

      <Stack
        component="form"
        direction="row"
        spacing={1}
        onSubmit={handleSubmit}
        sx={{ mb: 3 }}
      >
        <TextField
          label="New project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          size="small"
        />
        <Button type="submit" variant="contained">
          Add
        </Button>
      </Stack>

      <Stack spacing={2}>
        {projects.map((project) => (
          <Card key={project.id}>
            <CardActionArea component={Link} to={`/projects/${project.id}`}>
              <CardContent>
                <Typography variant="h6">{project.name}</Typography>
                {project.description && (
                  <Typography variant="body2" color="text.secondary">
                    {project.description}
                  </Typography>
                )}
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
