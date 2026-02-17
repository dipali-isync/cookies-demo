"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { GetUser, LogoutsUser } from "@/store/actions/authenticationAction";
import { setLoading } from "@/store/reducers/authenticationSlice";

export default function DashboardPage() {
  const router = useRouter();
  const loading = useAppSelector((state) => state.authentication.loading);
  const userRes = useAppSelector((state) => state.authentication.userRes);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  React.useEffect(() => {
    dispatch(GetUser());
  }, [dispatch]);

  const logout = async () => {
    dispatch(setLoading(true));
    const result = await dispatch(LogoutsUser());

    if (LogoutsUser.fulfilled.match(result)) {
      alert("Success");
      dispatch(setLoading(false));
      router.push("/");
    } else {
      alert("Failed");
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="flex items-center justify-between bg-white px-6 py-4 shadow">
        <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>

        <button
          onClick={() => setOpen(true)}
          className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition"
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <p className="text-gray-600">
          {userRes?.data?.vFullName
            ? `Welcome ${userRes?.data?.vFullName} to your dashboard`
            : ""}
        </p>
      </main>

      {/* Confirmation Dialog */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !loading && setOpen(false)}
          />

          {/* Modal */}
          <div className="relative z-10 w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800">
              Confirm Logout
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to log out?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                disabled={loading}
                className="rounded-lg border px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={logout}
                disabled={loading}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
              >
                {loading ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
