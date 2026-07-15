import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import type { Project } from "../types";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

const STATUSES = ["todo", "in-progress", "done"];

export default function BoardPage() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!project) return <Alert severity="warning">Project not found</Alert>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {project.name}
      </Typography>

      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
        {STATUSES.map((status) => (
          <Paper key={status} sx={{ flex: 1, p: 2 }}>
            <Typography
              variant="h6"
              sx={{ textTransform: "capitalize", mb: 1 }}
            >
              {status}
            </Typography>
            <Stack spacing={1}>
              {project.tasks
                ?.filter((task) => task.status === status)
                .map((task) => (
                  <Card key={task.id} variant="outlined">
                    <CardContent>
                      <Typography>{task.title}</Typography>
                    </CardContent>
                  </Card>
                ))}
            </Stack>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
