import React, { useState, useMemo } from "react";
import { useGetYesterdaysPaymentsQuery } from "../../slices/paymentsApiSlice";
import { useGetCollectingAgentsQuery } from "../../slices/usersApiSlice";
import { FaRupeeSign, FaUserTie, FaHistory } from "react-icons/fa";
import { MdPayments } from "react-icons/md";

const YesterdaysPayments = () => {
  const [selectedAgent, setSelectedAgent] = useState("");

  const { data: payments = [], isLoading } = useGetYesterdaysPaymentsQuery();
  const { data: agents = [] } = useGetCollectingAgentsQuery();

  const filteredPayments = useMemo(() => {
    if (!selectedAgent) return payments;
    return payments.filter((p) => p.agent?._id === selectedAgent);
  }, [payments, selectedAgent]);

  const totalAmount = useMemo(() => {
    return filteredPayments.reduce((sum, p) => sum + (p.amountPaid || 0), 0);
  }, [filteredPayments]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* TITLE */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FaHistory className="text-purple-600" />
        Yesterday's Payments
      </h1>

      {/* TOTAL AMOUNT CARD */}
      <div className="relative p-1 rounded-2xl mb-6 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 animate-pulse">
        <div className="bg-gray-900 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center shadow-lg">
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-wide">
              Total Amount Collected
            </h2>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 flex items-center justify-center sm:justify-start gap-2">
              <FaRupeeSign /> {Number(totalAmount || 0).toLocaleString("en-IN")}
            </h2>
            <p className="text-sm opacity-80 mt-1 text-gray-200 italic">
              Yesterday’s total collection
            </p>
          </div>
          <MdPayments className="text-5xl sm:text-6xl opacity-90 text-green-300 mt-4 sm:mt-0" />
        </div>
      </div>

      {/* AGENT FILTER */}
      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">
          Filter by Agent
        </label>
        <div className="flex items-center gap-3">
          <FaUserTie className="text-gray-600 text-xl" />
          <select
            className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
          >
            <option value="">All Agents</option>
            {agents?.map((agent) => (
              <option key={agent._id} value={agent._id}>
                {agent.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* LOADING */}
      {isLoading && (
        <p className="text-gray-600 text-center">Loading yesterday’s payments...</p>
      )}

      {/* EMPTY STATE */}
      {!isLoading && filteredPayments.length === 0 && (
        <p className="text-gray-500 text-center mt-10">
          No payments found for yesterday.
        </p>
      )}

      {/* PAYMENT LIST */}
      <div className="space-y-4">
        {filteredPayments.map((payment) => (
          <div
            key={payment._id}
            className="p-4 bg-white shadow-md rounded-lg border-l-4 border-purple-500 flex flex-col sm:flex-row justify-between sm:items-center gap-2"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {payment.borrower?.name} ({payment.borrower?.phone})
              </h3>
              <p className="text-gray-600 flex items-center gap-1 mt-1">
                <span className="font-bold text-indigo-600 flex items-center gap-1">
                  <FaRupeeSign /> {payment.amountPaid}
                </span>
              </p>
              <p className="text-gray-600 mt-1">
                Agent: <span className="font-medium">{payment.agent?.name}</span>
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Time: {new Date(payment.paymentDate).toLocaleTimeString("en-IN")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YesterdaysPayments;
