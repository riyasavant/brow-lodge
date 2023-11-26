import { Card, Button, Stack, Typography, Box } from "@mui/material";
import { useRouter } from "next/router";

const Form = ({ title, redirectLink }) => {
  const router = useRouter();

  const handleView = () => {
    router.push(redirectLink);
  };
  return (
    <Card
      sx={{
        p: 2,
        py: 3,
        borderRadius: "10px",
        cursor: "pointer",
        ":hover": {
          border: "0.5px solid #f5f5f5",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Stack>
          <Typography variant="h8">{title}</Typography>
        </Stack>
        <Button onClick={handleView}>View</Button>
      </Box>
    </Card>
  );
};

export default Form;
