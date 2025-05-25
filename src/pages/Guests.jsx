import React from "react";
import Row from "../ui/Row";
import Heading from "../ui/Heading";
import GuestTable from "../features/guests/GuestTable";
import AddGuest from "../features/guests/AddGuest";

function Guests() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All guests</Heading>
        <AddGuest />
      </Row>
      <Row>
        <GuestTable />
      </Row>
    </>
  );
}

export default Guests;
