import supabase from "./supabase";
import { countryNameToCode } from "../utils/countryNameToCode";
export async function getGuests() {
  let { data: guests, error } = await supabase.from("guests").select("*");
  if (error) {
    console.error(error);
    throw new Error("Guests could not be loaded");
  }

  return guests;
}

export async function createGuest(newGuest) {
  const { nationality } = newGuest;

  const code = countryNameToCode[nationality];
  console.log(nationality);
  if (!code) {
    throw new Error(`Unknown country name: ${newGuest.nationality}`);
  }

  const flagUrl = code ? `https://flagcdn.com/${code}.svg` : "";

  console.log({ ...newGuest, countryFlag: flagUrl });
  const { data, error } = await supabase
    .from("guests")
    .insert([{ ...newGuest, countryFlag: flagUrl }])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Guest could not be created");
  }

  return data;
}

export async function deleteGuest(id) {
  const { data, error } = await supabase
    .from("guests")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error("Guest could not be deleted");

  return data;
}
