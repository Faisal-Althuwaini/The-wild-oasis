import React, { useState, useEffect } from "react";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Textarea from "../../ui/Textarea";
import Button from "../../ui/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactSelect from "react-select";
import { Controller, useForm } from "react-hook-form";
import { useCreateBooking } from "./useCreateBooking";
import styled from "styled-components";
import Checkbox from "../../ui/Checkbox";
import { useGuests } from "../guests/useGuests";
import { useCabins } from "../cabins/useCabins";
import { useSettings } from "../settings/useSettings";
import styles from "../../styles/ReactSelectStyles";
import { formatCurrency, subtractDates } from "../../utils/helpers";
import { useCabin } from "../cabins/useCabin";

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CreateBookingForm({ onCloseModal }) {
  const { isCreating, createBooking } = useCreateBooking();
  const { guests } = useGuests();
  const { cabins } = useCabins();
  const {
    settings: {
      minBookingLength,
      maxBookingLength,
      maxGuestsPerBooking,
      breakfastPrice,
    } = {},
  } = useSettings();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState,
    control,
    watch,
  } = useForm();

  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const numGuests = watch("numGuests");

  // Setting initial binary values to false
  const hasBreakfast = watch("hasBreakfast", false);
  const isPaid = watch("isPaid", false);

  const cabinId = watch("cabinId");
  const { cabin, isLoadingCabin } = useCabin(cabinId);

  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const numNights = subtractDates(
      endDate?.toISOString(),
      startDate?.toISOString()
    );

    const extrasPrice = hasBreakfast
      ? numNights * breakfastPrice * numGuests
      : 0;
    const cabinPrice = (cabin?.regularPrice - cabin?.discount) * numNights || 0;
    setTotalPrice(cabinPrice + extrasPrice);
  }, [startDate, endDate, hasBreakfast, breakfastPrice, numGuests, cabin]);

  const { errors } = formState;

  console.log(startDate);

  function onSubmit(data) {
    const numNights = subtractDates(
      data.endDate?.toISOString(),
      data.startDate?.toISOString()
    );
    const cabinPrice = (cabin?.regularPrice - cabin?.discount) * numNights || 0;
    const extrasPrice = data.hasBreakfast
      ? numNights * breakfastPrice * data.numGuests
      : 0;

    createBooking(
      {
        ...data,
        numNights,
        cabinPrice,
        extrasPrice,
        totalPrice: cabinPrice + extrasPrice,
        status: "unconfirmed",
      },
      { onSuccess: () => onCloseModal?.() }
    );
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      type={onCloseModal ? "modal" : "regular"}
    >
      {/* 1. Guest Selection */}
      <FormRow label="Guest name" id="guestId" error={errors?.guestId?.message}>
        <Controller
          name="guestId"
          rules={{ required: "Guest name is required" }}
          control={control}
          render={({ field: { onChange } }) => (
            <ReactSelect
              onChange={(option) => onChange(option.value)}
              inputId="guestId"
              options={guests?.map((g) => {
                return {
                  value: g.id,
                  label: g.fullName,
                };
              })}
              noOptionsMessage={() =>
                "No guests found! Please create a new one."
              }
              placeholder="Select a guest..."
              styles={styles}
              blurInputOnSelect
              openMenuOnFocus
              menuShouldScrollIntoView={false}
            ></ReactSelect>
          )}
        />
      </FormRow>

      {/* 2. Cabin Selection */}
      <FormRow label="Cabin name" id="cabinId" error={errors?.cabinId?.message}>
        <Controller
          control={control}
          name="cabinId"
          rules={{ required: "Cabin name is required" }}
          render={({ field: { onChange } }) => (
            <ReactSelect
              onChange={(option) => onChange(option.value)}
              inputId="cabinId"
              options={cabins?.map((cabin) => {
                return {
                  value: cabin.id,
                  label: `${cabin.name}, ${formatCurrency(
                    cabin.regularPrice - cabin.discount
                  )}, ${cabin.maxCapacity}`,
                };
              })}
              noOptionsMessage={() =>
                "No cabins found! Please create a new one."
              }
              placeholder={"Name, price, capacity"}
              openMenuOnFocus
              styles={styles}
              blurInputOnSelect
              menuShouldScrollIntoView={false}
            />
          )}
        />
      </FormRow>

      {/* 3. Dates */}
      <FormRow label="Start date" error={errors?.startDate?.message}>
        <div style={{ position: "relative", width: "100%" }}>
          <Controller
            control={control}
            name="startDate"
            rules={{ required: "Start date is required" }}
            render={({ field }) => (
              <DatePicker
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                dateFormat="dd/MM/yyyy"
                popperPlacement="bottom-start"
                popperModifiers={[
                  {
                    name: "preventOverflow",
                    options: { boundary: "viewport" },
                  },
                ]}
                style={{ width: "100%" }}
              />
            )}
          />
        </div>
      </FormRow>

      <FormRow label="End date" error={errors?.endDate?.message}>
        <div style={{ position: "relative", width: "100%" }}>
          <Controller
            control={control}
            name="endDate"
            rules={{ required: "End date is required" }}
            render={({ field }) => (
              <DatePicker
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                dateFormat="dd/MM/yyyy"
                popperPlacement="bottom-start"
                popperModifiers={[
                  {
                    name: "preventOverflow",
                    options: { boundary: "viewport" },
                  },
                ]}
                style={{ width: "100%" }}
              />
            )}
          />
        </div>
      </FormRow>

      {/* 4. Number of Guests */}
      <FormRow label="Number of guests" error={errors?.numGuests?.message}>
        <Input
          type="number"
          id="numGuests"
          defaultValue={1}
          disabled={isCreating}
          {...register("numGuests", {
            required: "Number of guests is required",
            min: 1,
            max: maxGuestsPerBooking,
          })}
        />
      </FormRow>

      {/* 5. Breakfast Option */}
      <FormRow label="Has breakfast?" error={errors?.hasBreakfast?.message}>
        <Controller
          name="hasBreakfast"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <Checkbox
              id="breakfast"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            />
          )}
        />
      </FormRow>

      {/* 6. Payment Status */}
      <FormRow label="Is it paid?" error={errors?.isPaid?.message}>
        <Controller
          name="isPaid"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <Checkbox
              id="isPaid"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            />
          )}
        />
      </FormRow>

      {/* 7. Total Price */}
      <FormRow label="Total price" error={errors?.totalPrice?.message}>
        <Input
          type="text"
          id="totalPrice"
          value={totalPrice ? formatCurrency(Math.abs(totalPrice)) : ""}
          readOnly
        />
      </FormRow>

      {/* 8. Observations */}
      <FormRow label="Observations" error={errors?.observations?.message}>
        <Textarea
          id="observations"
          disabled={isCreating}
          defaultValue=""
          {...register("observations")}
        />
      </FormRow>

      <FormRow>
        <Button
          variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button disabled={isCreating}>Create new booking</Button>
      </FormRow>
    </Form>
  );
}

export default CreateBookingForm;
