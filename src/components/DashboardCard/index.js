import { Card, CardActions, Button, CardHeader, SvgIcon } from "@mui/material";
import { useRouter } from "next/router";

const DashboardCard = ({ title, subHeader = "", icon, onAdd, onView }) => {
  const router = useRouter();
  return (
    <Card>
      <CardHeader
        title={title}
        subHeader={subHeader}
        avatar={
          <SvgIcon fontSize="small" sx={{ color: "#9da4ae" }}>
            {icon}
          </SvgIcon>
        }
      />
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button size="small" onClick={() => router.push(onAdd)}>
          Add new
        </Button>
        <Button size="small" onClick={() => router.push(onView)}>
          View
        </Button>
      </CardActions>
    </Card>
  );
};

export default DashboardCard;
