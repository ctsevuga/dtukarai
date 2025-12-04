// src/slices/borrowersApiSlice.js

import { apiSlice } from './apiSlice';
import { BORROWERS_URL } from '../constants';

export const borrowersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // Create new borrower (Admin)
    createBorrower: builder.mutation({
      query: (data) => ({
        url: BORROWERS_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Borrowers'],
    }),

    // Get all borrowers (Admin + Agent)
    getAllBorrowers: builder.query({
      query: () => ({
        url: BORROWERS_URL,
      }),
      providesTags: ['Borrowers'],
      keepUnusedDataFor: 5,
    }),

    // Get borrower by ID (Admin + Agent)
    getBorrowerById: builder.query({
      query: (borrowerId) => ({
        url: `${BORROWERS_URL}/${borrowerId}`,
      }),
      providesTags: ['Borrowers'],
      keepUnusedDataFor: 5,
    }),

    // Search borrower by phone (Admin + Agent)
    searchBorrowerByPhone: builder.query({
      query: (phone) => ({
        url: `${BORROWERS_URL}/search/${phone}`,
      }),
      providesTags: ['Borrowers'],
      keepUnusedDataFor: 5,
    }),

    // Update borrower (Admin)
    updateBorrower: builder.mutation({
      query: ({ borrowerId, data }) => ({
        url: `${BORROWERS_URL}/${borrowerId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Borrowers'],
    }),

    // Deactivate borrower (Admin)
    deactivateBorrower: builder.mutation({
      query: (borrowerId) => ({
        url: `${BORROWERS_URL}/${borrowerId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Borrowers'],
    }),

  }),
});

export const {
  useCreateBorrowerMutation,
  useGetAllBorrowersQuery,
  useGetBorrowerByIdQuery,
  useSearchBorrowerByPhoneQuery,
  useUpdateBorrowerMutation,
  useDeactivateBorrowerMutation,
} = borrowersApiSlice;
