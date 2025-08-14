"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

function FaydaAuthComponent() {
  const [fcn, setFcn] = useState("");
  const [otp, setOtp] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [maskedMobile, setMaskedMobile] = useState("");
  const [step, setStep] = useState<"fcn" | "otp" | "success">("fcn");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);

  const parseResponse = async (res: Response) => {
    const ct = res.headers.get("content-type") || "";
    const data = ct.includes("application/json")
      ? await res.json()
      : { error: await res.text() };
    return { ok: res.ok, data };
  };

  const handleInitiateOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/fayda/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fcn }),
      });
      const { ok, data } = await parseResponse(res);
      if (!ok) throw new Error(data.error || "Failed to send OTP");
      setTransactionId(data.transactionId);
      setMaskedMobile(data.maskedMobile);
      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/fayda/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId, otp, fcn }),
      });
      const { ok, data } = await parseResponse(res);
      if (!ok) throw new Error(data.error || "Failed to verify OTP");
      setUser(data.user);
      setStep("success");
    } catch (err: any) {
      setError(err.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFcn("");
    setOtp("");
    setTransactionId("");
    setMaskedMobile("");
    setStep("fcn");
    setError("");
    setUser(null);
  };

  if (step === "success" && user) {
    return (
      <div className="max-w-md mx-auto p-6 bg-green-50 border border-green-200 rounded-lg">
        <h2 className="text-xl text-center font-semibold text-green-800 ">
          Verfication Successful!
        </h2>
        <div className="space-y-2 text-sm">
          <p>
            <strong>Name:</strong> {user?.fullName?.[0]?.value}
          </p>
          <p>
            <strong>UIN:</strong> {user?.uin}
          </p>
          <p>
            <strong>Phone:</strong> {user?.phone}
          </p>
          <p>
            <strong>Date of Birth:</strong> {user?.dateOfBirth}
          </p>
        </div>
        <Link
          href="/home"
          className="w-full inline-flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-800 py-2 px-4 text-sm font-medium hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
        >
          Go to Home
          <ChevronRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg">
      <h2 className="text-xl font-semibold text-black text-center mb-4">
        Verify your account with Fayda
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {step === "fcn" && (
        <form onSubmit={handleInitiateOTP}>
          <div className="mb-4">
            <label
              htmlFor="fcn"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Fayda Card Number
            </label>
            <input
              id="fcn"
              value={fcn}
              onChange={(e) =>
                setFcn(e.target.value.replace(/\D/g, "").slice(0, 16))
              }
              placeholder="Enter 16-digit FCN"
              maxLength={16}
              className="w-full px-3 py-2 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || fcn.length !== 16}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
          <Link
            href="/home"
            className="mt-3 w-full inline-flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-800 py-2 px-4 text-sm font-medium hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
          >
            Verify later
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={handleVerifyOTP}>
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              OTP sent to: {maskedMobile}
            </p>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter OTP Code
            </label>
            <input
              id="otp"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              className="w-full text-black px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setStep("fcn")}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default FaydaAuthComponent;
