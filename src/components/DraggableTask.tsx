import { useDraggable } from "@dnd-kit/core";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import type { Task } from "../types";

export default function DraggableTask({ task }: { task: Task }) {
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
      <CardContent>
        <Typography>{task.title}</Typography>
      </CardContent>
    </Card>
  );
}
