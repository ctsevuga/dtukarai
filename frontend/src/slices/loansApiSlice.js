import { apiSlice } from './apiSlice';
import { LOANS_URL } from '../constants';

export const loansApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // Create a new loan (Admin)
    createLoan: builder.mutation({
      query: (data) => ({
        url: `${LOANS_URL}`,
        method: 'POST',
        body: data,
      }),
    }),

    // Get all loans (Admin)
    getAllLoans: builder.query({
      query: () => ({
        url: LOANS_URL,
      }),
      providesTags: ['Loans'],
      keepUnusedDataFor: 5,
    }),

    createLoanInProgress: builder.mutation({
      query: (loanData) => ({
        url: `${LOANS_URL}/in-progress`,
        method: "POST",
        body: loanData,
      }),
      invalidatesTags: ["Loans"],
    }),

    // Get loan by ID (Admin + Agent)
    getLoanById: builder.query({
      query: (loanId) => ({
        url: `${LOANS_URL}/${loanId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    // Get loans assigned to an agent
    getLoansByAgent: builder.query({
      query: (agentId) => ({
        url: `${LOANS_URL}/agent/${agentId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    // Add payment to a loan (Agent)
    addPaymentToLoan: builder.mutation({
      query: ({ loanId, amountPaid }) => ({
        url: `${LOANS_URL}/${loanId}/pay`,
        method: 'POST',
        body: { amountPaid },
      }),
    }),

    // Update loan status manually (Admin)
    updateLoanStatus: builder.mutation({
      query: ({ loanId, status }) => ({
        url: `${LOANS_URL}/${loanId}/status`,
        method: 'PUT',
        body: { status },
      }),
    }),

    // Delete a loan (Admin)
    deleteLoan: builder.mutation({
      query: (loanId) => ({
        url: `${LOANS_URL}/${loanId}`,
        method: 'DELETE',
      }),
    }),

  }),
});

export const {
  useCreateLoanMutation,
  useGetAllLoansQuery,
  useGetLoanByIdQuery,
  useGetLoansByAgentQuery,
  useAddPaymentToLoanMutation,
  useUpdateLoanStatusMutation,
  useCreateLoanInProgressMutation,
  useDeleteLoanMutation,
} = loansApiSlice;
