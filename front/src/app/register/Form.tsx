"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { RegisterUser } from "@/store/actions/authenticationAction";
import { IUserState } from "@/store/types/authentication";
import { useAppDispatch } from "@/store/hooks";
import { setLoading } from "@/store/reducers/authenticationSlice";
import Link from "next/link";
function Form() {
  const dispatch = useAppDispatch();

  const RegisterSchema = Yup.object({
    vFullName: Yup.string().required("Full name is required"),
    vEmail: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    vPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: { vFullName: "", vEmail: "", vPassword: "" },
    validationSchema: RegisterSchema,
    onSubmit: async (values: IUserState) => {
      dispatch(setLoading(true));
      const result = await dispatch(RegisterUser(values));

      if (RegisterUser.fulfilled.match(result)) {
        alert("Registration successful");
        dispatch(setLoading(false));
      } else {
        alert("Registration failed");
        dispatch(setLoading(false));
      }
    },
  });
  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
      <h1 className="text-2xl font-semibold text-center text-gray-800">
        Create your account
      </h1>

      <form onSubmit={formik.handleSubmit} className="mt-6 space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full name
          </label>
          <input
            // type="text"
            name="vFullName"
            value={formik.values.vFullName || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                         text-gray-900 placeholder-gray-400
                         focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Dipali Shah"
          />
          {formik.touched.vFullName && formik.errors.vFullName && (
            <p className="mt-1 text-sm text-red-600">
              {formik.errors.vFullName}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="vEmail"
            value={formik.values.vEmail || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                         text-gray-900 placeholder-gray-400
                         focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="you@example.com"
          />
          {formik.touched.vEmail && formik.errors.vEmail && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.vEmail}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="vPassword"
            value={formik.values.vPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                         text-gray-900 placeholder-gray-400
                         focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="••••••••"
          />
          {formik.touched.vPassword && formik.errors.vPassword && (
            <p className="mt-1 text-sm text-red-600">
              {formik.errors.vPassword}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-medium
                       hover:bg-blue-700 disabled:opacity-60"
        >
          {formik.isSubmitting ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?&amp;
        <Link href="/" className="text-blue-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default Form;
