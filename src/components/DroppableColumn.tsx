import { useDroppable } from "@dnd-kit/core";
import type { ReactNode } from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function DroppableColumn({
  status,
  children,
}: {
  status: string;
  children: ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <Paper
      ref={setNodeRef}
      sx={{
        flex: 1,
        p: 2,
        bgcolor: isOver ? "action.hover" : undefined,
        transition: "background-color 0.2s",
      }}
    >
      <Typography variant="h6" sx={{ textTransform: "capitalize", mb: 1 }}>
        {status}
      </Typography>
      <Stack spacing={1}>{children}</Stack>
    </Paper>
  );
}
