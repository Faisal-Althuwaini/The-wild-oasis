import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Spinner from "../../ui/Spinner";
import { useGuests } from "./useGuests";
import GuestRow from "./GuestRow";
import AddGuest from "./AddGuest";

function GuestTable() {
  const { guests, isLoading } = useGuests();

  if (isLoading) return <Spinner />;

  return (
    <Menus>
      <Table columns="2fr 2fr 1.2fr 1.8fr 1fr 2rem">
        <Table.Header>
          <div>Full Name</div>
          <div>Email</div>
          <div>National ID</div>
          <div>Nationality</div>
          <div>Country Flag</div>
        </Table.Header>

        <Table.Body
          data={guests}
          render={(guest) => <GuestRow guest={guest} key={guest.id} />}
        />
      </Table>
    </Menus>
  );
}

export default GuestTable;
