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
    getCategoryArticles: build.query({
      query: ({page, category, locale})=> `/category/${category}/articles?page=${page}?locale=${locale}`,
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
      })
    })
  })
})

export const {
  useGetCategoryArticlesQuery,
  useAddCategoryArticleMutation,
} = articles