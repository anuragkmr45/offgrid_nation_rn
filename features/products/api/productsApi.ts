// src/features/products/api/productsApi.ts

import { baseQueryWithLogoutOn401 } from '@/core/api/baseQueryWithLogoutOn401';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
    Category,
    ChangeStatusRequest,
    Product,
    RatingResponse,
    RatingsMap,
    SearchParams
} from '../types';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: baseQueryWithLogoutOn401,
  tagTypes: ['Product', 'Products', 'MyProducts', 'Category', 'Categories', 'Ratings'],
  endpoints: (build) => ({
    addProduct: build.mutation<Product, FormData>({
      query: (formData) => ({
        url: '/products',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Products', 'MyProducts'],
    }),

    getProduct: build.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    listProducts: build.query<{ items: Product[]; nextCursor?: string }, {
      latitude: number;
      longitude: number;
      limit?: number;
      cursor?: string;
      sort?: string;
      category?: string;
    }>({
      query: ({ latitude, longitude, limit = 20, cursor, sort = 'relevance', category }) => ({
        url: '/products',
        params: { latitude, longitude, limit, cursor, sort, category },
      }),
      providesTags: ['Products'],
    }),

    listMyProducts: build.query<Product[], {
      status?: 'sold' | 'unsold';
      category?: string;
      date?: string;
      dateFrom?: string;
      dateTo?: string;
      sort?: 'new' | 'old';
      page?: number;
      limit?: number;
    }>({
      query: (params) => ({
        url: '/products/me/my-products',
        params,
      }),
      providesTags: ['MyProducts'],
    }),

    changeStatus: build.mutation<Product, { productId: string; body: ChangeStatusRequest }>({
      query: ({ productId, body }) => ({
        url: `/products/${productId}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Product', id: productId },
        'MyProducts',
      ],
    }),

    editProduct: build.mutation<Product, { productId: string; formData: FormData }>({
      query: ({ productId, formData }) => ({
        url: `/products/${productId}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: (r, e, { productId }) => [
        { type: 'Product', id: productId },
        'Products',
        'MyProducts',
      ],
    }),

    deleteProduct: build.mutation<void, string>({
      query: (productId) => ({
        url: `/products/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (r, e, id) => [
        { type: 'Product', id },
        'Products',
        'MyProducts',
      ],
    }),

    listByUsername: build.query<Product[], { username: string; status?: string; category?: string; page?: number; limit?: number }>({
      query: ({ username, ...params }) => ({
        url: `/products/user/${username}`,
        params,
      }),
      providesTags: (result) =>
        result
          ? result.map(({ _id }) => ({ type: 'Product' as const, id: _id }))
          : ['Products'],
    }),

    addRating: build.mutation<RatingResponse, { productId: string; star: number }>({
      query: ({ productId, star }) => ({
        url: `/ratings/${productId}`,
        method: 'POST',
        body: { star },
      }),
      invalidatesTags: (r, e, { productId }) => [
        { type: 'Ratings', id: productId },
        { type: 'Product', id: productId },
      ],
    }),

    getRatings: build.query<RatingsMap, string>({
      query: (productId) => `/ratings/${productId}`,
      providesTags: (r, e, id) => [{ type: 'Ratings', id }],
    }),

    listCategories: build.query<Category[], void>({
      query: () => '/categories',
      providesTags: ['Categories'],
    }),

    getCategory: build.query<Category, string>({
      query: (id) => `/categories/${id}`,
      providesTags: (r, e, id) => [{ type: 'Category', id }],
    }),

    searchProducts: build.query<Product[], SearchParams>({
      query: ({ q, page = 1, limit = 20, ...rest }) => ({
        url: '/products/product/search',
        params: { q, page, limit, ...rest },
      }),
      providesTags: ['Products'],
    }),
  }),
});

export const {
  useAddProductMutation,
  useGetProductQuery,
  useListProductsQuery,
  useListMyProductsQuery,
  useChangeStatusMutation,
  useEditProductMutation,
  useDeleteProductMutation,
  useListByUsernameQuery,
  useAddRatingMutation,
  useGetRatingsQuery,
  useListCategoriesQuery,
  useGetCategoryQuery,
  useSearchProductsQuery,
} = productsApi;
