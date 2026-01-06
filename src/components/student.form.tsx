import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentSchema } from "../schemas/student.schema";
import type { StudentFormData } from "../schemas/student.schema";
import { createStudent } from "../services/student.service";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function StudentForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
  });

 const onSubmit = async (values: StudentFormData) => {
  try {
    // 1️⃣ Signup user
    const { error: signUpError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    });

    if (signUpError) {
      throw signUpError;
    }

    // 2️⃣ EXPLICIT LOGIN (THIS IS THE MISSING PIECE)
    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

    if (loginError) {
      throw loginError;
    }

    const sessionUser = loginData.user;

    if (!sessionUser) {
      throw new Error("Session not created");
    }

    // 3️⃣ Insert student (RLS WILL PASS NOW)
    await createStudent(sessionUser.id, values);

    alert("Student registered successfully!");
    navigate("/login");
  } catch (err: unknown) {
    console.error("Signup error:", err);

    if (err instanceof Error) {
      alert(err.message);
    } else {
      alert("Something went wrong");
    }
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-cyan-500 p-6">
      <div className="form-card max-w-4xl w-full p-8">
        <h2 className="form-title mb-8">Create Student</h2>

        <form
          onSubmit={handleSubmit(onSubmit, (errors) =>
            console.log("Validation errors:", errors)
          )}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* First Name */}
          <div>
            <label className="label">First Name</label>
            <input {...register("firstName")} className="input" />
            <p className="error">{errors.firstName?.message}</p>
          </div>

          {/* Last Name */}
          <div>
            <label className="label">Last Name</label>
            <input {...register("lastName")} className="input" />
            <p className="error">{errors.lastName?.message}</p>
          </div>

          {/* Email */}
          <div>
            <label className="label">Email</label>
            <input {...register("email")} className="input" />
            <p className="error">{errors.email?.message}</p>
          </div>

          <div>
            <label className="label">Password</label>
            <input
              type="password"
              {...register("password")}
              className="input"
            />
            <p className="error">{errors.password?.message}</p>
          </div>

          <div>
            <label className="label">Confirm Password</label>
            <input
              type="password"
              {...register("confirmPassword")}
              className="input"
            />
            <p className="error">{errors.confirmPassword?.message}</p>
          </div>

          {/* Mobile */}
          <div>
            <label className="label">Mobile</label>
            <input {...register("mobile")} className="input" />
            <p className="error">{errors.mobile?.message}</p>
          </div>

          {/* DOB */}
          <div>
            <label className="label">Date of Birth</label>
            <input type="date" {...register("dob")} className="input" />
            <p className="error">{errors.dob?.message}</p>
          </div>

          {/* Gender */}
          <div>
            <label className="label">Gender</label>
            <select {...register("gender")} className="input">
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <p className="error">{errors.gender?.message}</p>
          </div>

          {/* Course */}
          <div className="md:col-span-2">
            <label className="label">Course</label>
            <select {...register("course")} className="input">
              <option value="">Select Course</option>
              <option value="react">React</option>
              <option value="node">Node</option>
              <option value="fullstack">Full Stack</option>
            </select>
            <p className="error">{errors.course?.message}</p>
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="label">Address</label>
            <textarea {...register("address")} className="input h-24" />
            <p className="error">{errors.address?.message}</p>
          </div>

          {/* Terms */}
          <div className="md:col-span-2 flex items-center gap-3">
            <input
              type="checkbox"
              {...register("terms")}
              className="accent-indigo-500"
            />
            <span className="text-sm text-slate-400">
              I agree to terms & conditions
            </span>
          </div>
          <p className="error md:col-span-2">{errors.terms?.message}</p>

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
