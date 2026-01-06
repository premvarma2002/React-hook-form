import { supabase } from "../lib/supabase";
import type { StudentFormData } from "../schemas/student.schema";

export const createStudent = async (
  userId: string,
  values: StudentFormData
) => {
  const { error } = await supabase.from("students").insert({
    user_id: userId,
    first_name: values.firstName,
    last_name: values.lastName,
    email: values.email,
    mobile: values.mobile,
    dob: values.dob,
    gender: values.gender,
    course: values.course,
    address: values.address,
  });

  if (error) throw error;
};
