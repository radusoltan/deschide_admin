import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.REACT_APP_API_URL

export const categories = createApi({
  reducerPath: "categories",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers,{getState})=>{
      const token = getState().auth.token
      if (token){
        headers.set('authorization', `Bearer ${token}`)
      }
    }
  }),

  endpoints: build => ({
    getCategories: build.query({
      query: ({page, locale}) => `/categories?page=${page}&locale=${locale}`,
      providesTags: result => [
        ...result.data.map(({id})=>({ type: "Categories", id })),
        { type: "Categories", id: "PARTIAL-LIST" }
      ]
    }),
    getAllCategories: build.query({
      query: (locale) => `/categories?locale=${locale}&all=true`,
    }),
    getCategory: build.query({
      query: ({category, locale}) => `/categories/${category}?locale=${locale}`,
    }),
    addCategory: build.mutation({
      query: ({body, locale}) => ({
        url: `/categories/?locale=${locale}`,
        method: "POST",
        body
      }),
      invalidatesTags: result => [{type: "Categories", id: result.id}]
    }),
    updateCategory: build.mutation({
      query: ({category, locale, body}) => ({
        url: `/categories/${category}?locale=${locale}`,
        method: "PATCH",
        body
      }),
      invalidatesTags: response => [{ type: "Categories", id: response.data.id }]
    }),
    deleteCategory: build.mutation({
      query: category => ({
        url: `/categories/${category}`,
        method: "DELETE",
      }),
      invalidatesTags: (response, error, id) => [{type: "Categories", id}],
    })
  })
})

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,

    useGetAllCategoriesQuery
} = categories