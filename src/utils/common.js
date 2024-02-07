import dayjs from "dayjs";

export const getClientLabel = (client) => {
  return `${client.firstName} ${client.lastName} ${
    client.dateOfBirth
      ? `(DOB: ${dayjs(client.dateOfBirth).format("DD/MM/YYYY")})`
      : ""
  }`;
};

export const getStaffLabel = (staff) => {
  return `${staff.firstName} ${staff.lastName}`;
};
