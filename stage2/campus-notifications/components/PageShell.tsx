"use client";

import Link from "next/link";
import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from "@mui/material";

type PageShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export default function PageShell({ title, subtitle, children }: PageShellProps) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
      <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ py: 1, gap: 2, flexWrap: "wrap" }}>
            <Typography variant="h6" component={Link} href="/" sx={{ textDecoration: "none", color: "inherit", fontWeight: 700 }}>
              Campus Notifications
            </Typography>
            <Stack direction="row" spacing={1} sx={{ ml: "auto", flexWrap: "wrap" }}>
              <Button component={Link} href="/all" variant="outlined" size="small">
                All Notifications
              </Button>
              <Button component={Link} href="/priority" variant="outlined" size="small">
                Priority Notifications
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
        {children}
      </Container>
    </Box>
  );
}
