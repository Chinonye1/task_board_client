import { useState, useEffect, type SyntheticEvent } from "react";
import { api } from "../lib/api";
import type { Project } from "../types";

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
  if (loading) return <p>Loading projects…</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Projects</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New project name"
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>{project.name}</li>
        ))}
      </ul>
    </div>
  );
}
