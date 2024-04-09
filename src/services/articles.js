import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.REACT_APP_API_URL

export const articles = createApi({
  reducerPath: 'articles',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers,{getState})=>{
      const token = getState().auth.token
      if (token){
        headers.set('authorization', `Bearer ${token}`)
      }
    }
  }),
  tagTypes: ["Articles", "Authors"],
  endpoints: build => ({
    getArticle: build.query({
      query: ({article, locale}) => `/articles/${article}?locale=${locale}`,
      providesTags: result => [{type: "Articles", id: result.id}],
    }),
    getCategoryArticles: build.query({
      query: ({page, category, locale})=> `/category/${category}/articles?page=${page}&locale=${locale}`,
      providesTags: result => [
          ...result.data.map(({id})=>({ type: "Articles", id })),
        { type: "Articles", id: "PARTIAL-LIST" }
      ]
    }),
    addCategoryArticle: build.mutation({
      query: ({category, body, locale}) => ({
        url: `/category/${category}/article?locale=${locale}`,
        method: "POST",
        body
      }),
      invalidatesTags: response => [
        { type: "Articles", id: response.data.id },
        { type: "Articles", id: "PARTIAL-LIST" }
      ]
    }),
    updateArticle: build.mutation({
      query: ({article, locale, body}) => ({
        url: `/articles/${article}?locale=${locale}`,
        method: "PATCH",
        body
      }),
      invalidatesTags: result => [
        {type: "Articles", id: result.data.id},
        { type: "Articles", id: "PARTIAL-LIST" }
      ]
    }),

    getAuthors: build.query({
      query: ({page, locale})=>`/authors?page=${page}&locale=${locale}`,
      providesTags: result => [
          ...result.data.map(({id})=>({ type: "Authors", id })),
        { type: "Authors", id: "PARTIAL-LIST" }
      ]
    }),
    getAuthor: build.query({
      query: ({author, locale}) => `/authors/${author}?locale=${locale}`,
      providesTags: result => []
    }),
    addAuthor: build.mutation({
      query: ({body, locale}) => ({
        url: `/authors?locale=${locale}`,
        method: "POST",
        body
      }),
      invalidatesTags: result => [
        {type: "Authors", id:result.data.id},
        { type: "Authors", id: "PARTIAL-LIST" }
      ]
    }),
    updateAuthor: build.mutation({
      query: ({author, locale, body}) => ({
        url: `/authors/${author}?locale=${locale}`,
        method: "PATCH",
        body
      }),
      invalidatesTags: result => [
        {type: "Authors", id: result.data.id},
        {type: "Authors", id: "PARTIAL-LIST" }
      ]
    }),
    deleteAuthor: build.mutation({
      query: author => ({
        url: `/authors/${author}`,
        method: "DELETE"
      }),
      invalidatesTags: (r,e,id) => [
        {type: "Authors", id},
        {type: "Authors", id: "PARTIAL-LIST" }
      ]
    })



  })
})

export const {
  useGetArticleQuery,
  useGetCategoryArticlesQuery,
  useAddCategoryArticleMutation,
  useUpdateArticleMutation,

  useGetAuthorsQuery,
  useGetAuthorQuery,
  useAddAuthorMutation,
  useUpdateAuthorMutation,
  useDeleteAuthorMutation
} = articles