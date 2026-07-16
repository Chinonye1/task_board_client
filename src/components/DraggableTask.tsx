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
        opacity: isDragging ? 0.4 : 1,
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
      }}
    >
      <CardContent sx={{ "&:last-child": { pb: 2 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <Typography sx={{ flexGrow: 1 }}>{task.title}</Typography>
          <Box sx={{ flexShrink: 0 }}>
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
