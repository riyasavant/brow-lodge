import dayjs from "dayjs";

export const parseClients = (data) => {
  return data?.map((item, index) => ({
    label: getClientLabel(item),
    value: item.id,
    id: index,
  }));
};

export const parseStaff = (data) => {
  return data?.map((item, index) => ({
    label: getStaffLabel(item),
    value: getStaffLabel(item),
    id: index,
  }));
};

export const getClientLabel = (client) => {
  return `${client.firstName} ${client.lastName} ${
    client.dateOfBirth
      ? `(DOB: ${dayjs(client.dateOfBirth).format("DD/MM/YYYY")})`
      : ""
  }`.trim();
};

export const getStaffLabel = (staff) => {
  return `${staff.firstName} ${staff.lastName}`;
};
