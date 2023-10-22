import React, { useRef } from "react";
import { Dialog, Button } from "@mui/material";
import SignaturePad from "react-signature-canvas";

function Signature({ open, onClose, onSave }) {
  const sigCanvas = useRef({});

  /* a function that uses the canvas ref to clear the canvas 
  via a method given by react-signature-canvas */
  const clear = () => sigCanvas.current.clear();

  /* a function that uses the canvas ref to trim the canvas 
  from white spaces via a method given by react-signature-canvas
  then saves it in our state */
  const save = () => {
    onSave(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <>
        <SignaturePad
          ref={sigCanvas}
          canvasProps={{
            className: "signatureCanvas",
          }}
        />
        {/* Button to trigger save canvas image */}
        <Button onClick={save}>Save</Button>
        <Button onClick={clear}>Clear</Button>
        <Button onClick={onClose}>Close</Button>
      </>
    </Dialog>
  );
}

export default Signature;
