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
          {/* <Typography
            sx={{
              fontSize: "13px",
              color: "#6366F1",
              marginTop: "5px",
              fontWeight: "bold",
            }}
          >
            20/10/2023
          </Typography> */}
        </Stack>
        <Button onClick={handleView}>View</Button>
      </Box>
    </Card>
  );
};

export default Form;
