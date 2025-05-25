import styled from "styled-components";
import { format, isToday } from "date-fns";

import Tag from "../../ui/Tag";
import Table from "../../ui/Table";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";

import { formatCurrency } from "../../utils/helpers";
import { formatDistanceFromNow } from "../../utils/helpers";
import Menus from "../../ui/Menus";
import {
  HiArrowDownOnSquare,
  HiArrowUpOnSquare,
  HiEye,
  HiTrash,
} from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { useCheckout } from "../check-in-out/useCheckout";
// import { useDeleteBooking } from "./useDeleteBooking";

const FullName = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
`;
const Img = styled.img`
  display: block;
  width: 2rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

function GuestRow({
  guest: { id: guestId, fullName, email, nationalID, nationality, countryFlag },
}) {
  return (
    <Modal>
      <Table.Row>
        <FullName>{fullName}</FullName>

        <span>{email}</span>
        <span>{nationalID}</span>

        <span>{nationality}</span>
        <Center>
          <Img src={countryFlag} />
        </Center>
      </Table.Row>
    </Modal>
  );
}

export default GuestRow;
