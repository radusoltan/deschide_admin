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
  tagTypes: ["Articles"],
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
    })
  })
})

export const {
  useGetArticleQuery,
  useGetCategoryArticlesQuery,
  useAddCategoryArticleMutation,
  useUpdateArticleMutation,
} = articles