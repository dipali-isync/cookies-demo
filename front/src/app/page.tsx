"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { LoginUser } from "@/store/actions/authenticationAction";
import { IUserState } from "@/store/types/authentication";
import { useAppDispatch } from "@/store/hooks";
import { setLoading } from "@/store/reducers/authenticationSlice";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const LoginSchema = Yup.object({
    vEmail: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    vPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: { vEmail: "", vPassword: "" },
    validationSchema: LoginSchema,
    onSubmit: async (values: IUserState) => {
      dispatch(setLoading(true));
      const result = await dispatch(LoginUser(values));

      if (LoginUser.fulfilled.match(result)) {
        alert("Success");
        dispatch(setLoading(false));
        router.push("/dashboard");
      } else {
        alert("Failed");
        dispatch(setLoading(false));
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-center text-gray-800">
          Sign in to your account
        </h1>

        <form onSubmit={formik.handleSubmit} className="mt-6 space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="vEmail"
              value={formik.values.vEmail}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                         text-gray-900 placeholder-gray-400
                         focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="you@example.com"
            />
            {formik.touched.vEmail && formik.errors.vEmail && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors.vEmail}
              </p>
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

          {/* Button */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-medium
                       hover:bg-blue-700 disabled:opacity-60"
          >
            {formik.isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
