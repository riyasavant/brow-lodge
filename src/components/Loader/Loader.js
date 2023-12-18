import CircularProgress from "@mui/material/CircularProgress";

const Loader = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress size={60} />
    </div>
  );
};

export default Loader;
