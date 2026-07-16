import { useDroppable } from "@dnd-kit/core";
import type { ReactNode } from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

const STATUS_META: Record<string, { label: string; color: string }> = {
  todo: { label: "To Do", color: "#64748b" },
  "in-progress": { label: "In Progress", color: "#f59e0b" },
  done: { label: "Done", color: "#10b981" },
};

export default function DroppableColumn({
  status,
  count,
  children,
}: {
  status: string;
  count: number;
  children: ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const meta = STATUS_META[status] ?? { label: status, color: "#64748b" };

  return (
    <Paper
      ref={setNodeRef}
      elevation={0}
      sx={{
        flex: 1,
        p: 1.5,
        bgcolor: isOver ? "action.hover" : "#eef1f5",
        border: "1px solid",
        borderColor: isOver ? "primary.main" : "divider",
        transition: "background-color 0.2s, border-color 0.2s",
        minHeight: 140,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor: meta.color,
          }}
        />
        <Typography variant="subtitle2" sx={{ fontWeight: 700, flexGrow: 1 }}>
          {meta.label}
        </Typography>
        <Chip
          label={count}
          size="small"
          sx={{ height: 20, minWidth: 28, fontWeight: 600 }}
        />
      </Box>
      <Stack spacing={1}>{children}</Stack>
    </Paper>
  );
}
