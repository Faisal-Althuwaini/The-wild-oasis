import React from "react";
import Modal from "../../ui/Modal";
import Button from "../../ui/Button";
import CreateGuestForm from "./CreateGuestForm";

function AddGuest() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="guest-form">
          <Button>Add new guest</Button>
        </Modal.Open>
        <Modal.Window name="guest-form">
          <CreateGuestForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddGuest;
