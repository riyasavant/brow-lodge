export const parseServerErrorMsg = (err) => {
  console.log(err);
  const errMessage = err?.response?.data?.message;
  if (errMessage) {
    return errMessage;
  } else {
    return "Internal Server Error";
  }
};
