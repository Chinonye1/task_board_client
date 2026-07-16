import { useDraggable } from "@dnd-kit/core";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
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

const STATUS_BG: Record<string, string> = {
  todo: "#ffffff",
  "in-progress": "#fff8e1",
  done: "#eafaf0",
};

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

  return (
    <Card
      ref={setNodeRef}
      variant="outlined"
      {...listeners}
      {...attributes}
      sx={{
        cursor: "grab",
        bgcolor: STATUS_BG[task.status] ?? "#ffffff",
        borderLeft: "4px solid",
        borderLeftColor: PRIORITY_BORDER[task.priority] ?? "#cbd5e1",
        opacity: isDragging ? 0.4 : 1,
        boxShadow: isDragging ? 6 : 0,
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: 3 },
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
          <Box sx={{ flexShrink: 0, mt: -0.5, mr: -0.5 }}>
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

        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            label={task.priority}
            size="small"
            color={
              PRIORITY_COLORS[task.priority as keyof typeof PRIORITY_COLORS] ??
              "default"
            }
            sx={{ textTransform: "capitalize" }}
          />
          {task.dueDate && (
            <Typography variant="caption" color="text.secondary">
              Due {new Date(task.dueDate).toLocaleDateString()}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
