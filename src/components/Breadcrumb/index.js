import * as React from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { useRouter } from "next/router";

const Breadcrumb = ({ items }) => {
  const router = useRouter();

  function handleClick(event) {
    event.preventDefault();
    if (event.target.pathname !== undefined) {
      router.push(`${event.target.pathname}${event.target.search || ""}`);
    }
  }

  return (
    <div role="presentation" onClick={handleClick}>
      <Breadcrumbs aria-label="breadcrumb">
        {items.map((item, index) => {
          if (item.isActive) {
            return (
              <Typography color="text.primary" key={index} fontSize={14}>
                {item.label}
              </Typography>
            );
          }
          return (
            <Link
              underline="hover"
              color="inherit"
              href={item.link}
              key={index}
              fontSize={14}
            >
              {item.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </div>
  );
};

export default Breadcrumb;
