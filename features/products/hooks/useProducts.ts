// src/features/products/hooks/useProducts.ts

import {
    useAddProductMutation,
    useChangeStatusMutation,
    useDeleteProductMutation,
    useEditProductMutation,
    useGetProductQuery,
    useListByUsernameQuery,
    useListMyProductsQuery,
    useListProductsQuery,
    useSearchProductsQuery,
} from '../api/productsApi';

export const useProducts = (params: Parameters<typeof useListProductsQuery>[0]) => {
  const { data, isLoading, refetch, error } = useListProductsQuery(params);
  return { products: data?.items ?? [], nextCursor: data?.nextCursor, isLoading, error, refetch };
};

export const useProductDetails = (id: string) =>
  useGetProductQuery(id);

export const useCreateProduct = () =>
  useAddProductMutation();

export const useUpdateProduct = () =>
  useEditProductMutation();

export const useRemoveProduct = () =>
  useDeleteProductMutation();

export const useToggleProductStatus = () =>
  useChangeStatusMutation();

export const useMyProducts = (params: Parameters<typeof useListMyProductsQuery>[0]) => {
  const { data, isLoading, error, refetch } = useListMyProductsQuery(params);
  return { myProducts: data, isLoading, error, refetch };
};

export const useUserProducts = (params: Parameters<typeof useListByUsernameQuery>[0]) =>
  useListByUsernameQuery(params);

export const useProductSearch = (params: Parameters<typeof useSearchProductsQuery>[0]) => {
  const { data, isLoading, error, refetch } = useSearchProductsQuery(params);
  return { results: data, isLoading, error, refetch };
};
