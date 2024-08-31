import React, { useState } from 'react';
import { CreateCreationSheet } from "@/components/dialog/CreateCreationSheet";

const SomeComponentUsingDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Creation Sheet</button>
      <CreateCreationSheet open={open} onOpenChange={setOpen} />
    </div>
  );
};

export default SomeComponentUsingDialog;
