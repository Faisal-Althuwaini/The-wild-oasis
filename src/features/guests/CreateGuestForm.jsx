import React from "react";
import { Controller, useForm } from "react-hook-form";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import { useCreateGuest } from "./useCreateGuest";
import Select from "../../ui/Select";
import { nationalityOptions } from "../../utils/countryNameToCode";

function CreateGuestForm({ onCloseModal }) {
  const { register, handleSubmit, formState, reset, control } = useForm();
  const { createGuest, isCreating } = useCreateGuest();
  const { errors } = formState;
  function onSubmit(data) {
    createGuest(
      { ...data },
      {
        onSuccess: () => {
          reset();
          onCloseModal();
        },
      }
    );
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Full name" error={errors?.fullName?.message}>
        <Input
          type="text"
          id="fullName"
          {...register("fullName", { required: "This field is required" })}
          disabled={isCreating}
        />
      </FormRow>

      <FormRow label="Email" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isCreating}
          {...register("email", {
            required: "This field is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please provide a valid email address",
            },
          })}
        />
      </FormRow>

      <FormRow label="National ID" error={errors?.nationalID?.message}>
        <Input
          type="text"
          id="nationalID"
          disabled={isCreating}
          {...register("nationalID", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Nationality" error={errors?.nationality?.message}>
        <Controller
          name="nationality"
          control={control}
          defaultValue=""
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <Select
              options={nationalityOptions}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button>Create new guest</Button>
      </FormRow>
    </Form>
  );
}

export default CreateGuestForm;
