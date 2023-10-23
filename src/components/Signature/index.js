import React, { useRef, useState } from "react";
import { Dialog, Button, SvgIcon, IconButton, Snackbar } from "@mui/material";
import SignaturePad from "react-signature-canvas";
import CloseIcon from "@heroicons/react/24/solid/XMarkIcon";

function Signature({ open, onClose, onSave }) {
  const [showError, setShowError] = useState(false);
  const sigCanvas = useRef({});

  /* a function that uses the canvas ref to clear the canvas 
  via a method given by react-signature-canvas */
  const clear = () => sigCanvas.current.clear();

  /* a function that uses the canvas ref to trim the canvas 
  from white spaces via a method given by react-signature-canvas
  then saves it in our state */
  const save = () => {
    if (!sigCanvas.current.isEmpty()) {
      onSave(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"));
      onClose();
    } else {
      setShowError(true);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <>
          <div
            style={{
              display: "flex",
              margin: "10px",
              justifyContent: "flex-end",
            }}
          >
            <IconButton onClick={onClose}>
              <SvgIcon fontSize="medium">
                <CloseIcon />
              </SvgIcon>
            </IconButton>
          </div>
          <SignaturePad
            ref={sigCanvas}
            canvasProps={{
              className: "signatureCanvas",
            }}
          />
          <div
            style={{
              display: "flex",
              margin: "10px",
              justifyContent: "flex-end",
            }}
          >
            <Button onClick={clear}>Clear</Button>
            <Button onClick={save} variant="contained">
              Save
            </Button>
          </div>
        </>
      </Dialog>
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
        message="Signature cannot be empty!"
      />
    </>
  );
}

export default Signature;
