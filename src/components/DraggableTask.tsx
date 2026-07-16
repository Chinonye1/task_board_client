import { useDraggable } from "@dnd-kit/core";
import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import type { Task } from "../types";

const PRIORITY_COLORS = {
  low: "success",
  medium: "warning",
  high: "error",
} as const;

const PRIORITY_BORDER: Record<string, string> = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#ef4444",
};

const STATUS_BG_LIGHT: Record<string, string> = {
  todo: "#ffffff",
  "in-progress": "#fff8e1",
  done: "#eafaf0",
};

const STATUS_BG_DARK: Record<string, string> = {
  todo: "#1e293b",
  "in-progress": "#3a2f14",
  done: "#14311f",
};

function getDueMeta(dueDate: string, status: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86_400_000);
  const formatted = due.toLocaleDateString();

  if (status === "done") return { color: "text.secondary", label: formatted };
  if (diffDays < 0) return { color: "error.main", label: `Overdue · ${formatted}` };
  if (diffDays <= 2) return { color: "warning.main", label: `Due soon · ${formatted}` };
  return { color: "text.secondary", label: `Due ${formatted}` };
}

export default function DraggableTask({
  task,
  onDelete,
  onEdit,
}: {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id });

  const theme = useTheme();
  const statusBg =
    theme.palette.mode === "dark" ? STATUS_BG_DARK : STATUS_BG_LIGHT;

  const due = task.dueDate ? getDueMeta(task.dueDate, task.status) : null;

  return (
    <Card
      ref={setNodeRef}
      variant="outlined"
      {...listeners}
      {...attributes}
      sx={{
        cursor: "grab",
        bgcolor: statusBg[task.status] ?? theme.palette.background.paper,
        borderLeft: "4px solid",
        borderLeftColor: PRIORITY_BORDER[task.priority] ?? "#cbd5e1",
        opacity: isDragging ? 0.4 : 1,
        boxShadow: isDragging ? 6 : 0,
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: 3 },
        "&:hover .task-actions, &:focus-within .task-actions": { opacity: 1 },
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
      }}
    >
      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 0.5,
          }}
        >
          <Typography sx={{ flexGrow: 1, fontWeight: 500 }}>
            {task.title}
          </Typography>
          <Box
            className="task-actions"
            sx={{
              flexShrink: 0,
              mt: -0.5,
              mr: -0.5,
              opacity: { xs: 1, md: 0 },
              transition: "opacity 0.15s",
            }}
          >
            <IconButton
              size="small"
              onClick={() => onEdit(task)}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(task.id)}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {task.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {task.description}
          </Typography>
        )}

        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Chip
            label={task.priority}
            size="small"
            color={
              PRIORITY_COLORS[task.priority as keyof typeof PRIORITY_COLORS] ??
              "default"
            }
            sx={{ textTransform: "capitalize" }}
          />
          {due && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: due.color,
              }}
            >
              <CalendarMonthIcon sx={{ fontSize: 16 }} />
              <Typography
                variant="caption"
                sx={{ color: "inherit", fontWeight: 500 }}
              >
                {due.label}
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
