import { apiSlice } from './apiSlice';
import { PAYMENTS_URL } from '../constants';

export const paymentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // Add payment (Agent)
    addPayment: builder.mutation({
      query: (data) => ({
        url: PAYMENTS_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Payments', 'Loans'],
    }),

    // Get all payments (Admin)
    getAllPayments: builder.query({
      query: () => ({
        url: PAYMENTS_URL,
      }),
      providesTags: ['Payments'],
      keepUnusedDataFor: 5,
    }),

    // 🔥 Get today's payments (Admin + Agent)
    getTodaysPayments: builder.query({
      query: () => ({
        url: `${PAYMENTS_URL}/today`,
      }),
      providesTags: ['Payments'],
      keepUnusedDataFor: 5,
    }),

    // 🔥 Get yesterday's payments (Admin + Agent)
    getYesterdaysPayments: builder.query({
      query: () => ({
        url: `${PAYMENTS_URL}/yesterday`,
      }),
      providesTags: ['Payments'],
      keepUnusedDataFor: 5,
    }),

    // Get payments by loan (Admin + Agent)
    getPaymentsByLoan: builder.query({
      query: (loanId) => ({
        url: `${PAYMENTS_URL}/loan/${loanId}`,
      }),
      providesTags: ['Payments'],
      keepUnusedDataFor: 5,
    }),

    // Get payments by borrower (Admin + Agent)
    getPaymentsByBorrower: builder.query({
      query: (borrowerId) => ({
        url: `${PAYMENTS_URL}/borrower/${borrowerId}`,
      }),
      providesTags: ['Payments'],
      keepUnusedDataFor: 5,
    }),

    // Payment report
    getPaymentReport: builder.query({
      query: (filters) => {
        const params = new URLSearchParams();

        if (filters?.borrowerId) params.append("borrowerId", filters.borrowerId);
        if (filters?.loanId) params.append("loanId", filters.loanId);
        if (filters?.agentId) params.append("agentId", filters.agentId);
        if (filters?.startDate) params.append("startDate", filters.startDate);
        if (filters?.endDate) params.append("endDate", filters.endDate);

        return {
          url: `${PAYMENTS_URL}/payment-report?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Payments"],
    }),

    // Delete payment (Admin)
    deletePayment: builder.mutation({
      query: (paymentId) => ({
        url: `${PAYMENTS_URL}/${paymentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Payments', 'Loans'],
    }),
  }),
});

export const {
  useAddPaymentMutation,
  useGetAllPaymentsQuery,
  useGetTodaysPaymentsQuery,
  useGetYesterdaysPaymentsQuery,
  useGetPaymentsByLoanQuery,
  useGetPaymentsByBorrowerQuery,
  useDeletePaymentMutation,
  useGetPaymentReportQuery,
} = paymentsApiSlice;
