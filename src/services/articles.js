import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {locale} from "moment";
import {logout} from "../features/authSlice";
import i18n from "../i18n";

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
      // providesTags: result => [
      //     {type: "Articles", id: result.id},
      //   {type: "Articles", id: "PARTIAL-LIST"}
      // ],
    }),
    getArticles: build.query({
      query: ({page, locale}) => `/articles?page=${page}&locale=${locale}`,
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
    setArticlePublishTime: build.mutation({
      query: ({article, body}) => ({
        url: `/article/${article}/publish-time`,
        method: 'POST',
        body,
      }),
      invalidatesTags: result => [
          { type: "Articles", id: result.data.id},
        { type: "Articles", id: "PARTIAL-LIST" }
      ]
    }),
    deleteArticlePublishTime: build.mutation({
      query: article => ({
        url: `/article/${article}/delete-event`,
        method: "DELETE"
      }),
      invalidatesTags: result => [
          { type: "Articles", id: result.data.id},
        { type: "Articles", id: "PARTIAL-LIST" }
      ]
    }),
    unlockArticle: build.mutation({
      query: article => ({
        url: `/article/${article}/unlock`,
        method: "POST",
        body: {locale: i18n.language}
      })
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
    }),
    getArticleAuthors: build.query({
      query: (article) => `/article/${article}/authors`,
      providesTags: result => [
        ...result.data.map(author=>({ type: "Authors", id: author.id })),
        { type: "Authors", id: "LIST" }
      ]
    }),
    getAllAuthors: build.query({
      query: (locale)=> `/authors?locale=${locale}`,
      providesTags: result => [
          ...result.data.map(author=>({ type: "Authors", id: author.id })),
        { type: "Authors", id: "LIST" }
      ]
    }),
    searchAuthor: build.mutation({
      query: ({query, locale}) => ({
        url: `/authors/search?locale=${locale}`,
        method: "POST",
        body: {query}
      }),
    }),
    addArticleAuthor: build.mutation({
      query: ({article,body}) => ({
        url: `/article/${article}/add-author`,
        method: "POST",
        body: body
      }),

      invalidatesTags: result => [
        {type: "Authors", id: result.data.id},
          {type: "Authors", id: "LIST" }
      ]
    }),
    selectArticleAuthor: build.mutation({
      query: ({article,body}) => ({
        url: `/article/${article}/select-author`,
        method: "POST",
        body: body
      }),
      invalidatesTags: result => [
          ...result.data.map(author=>({ type: "Authors", id: author.id })),
        { type: "Articles", id: "LIST" }
      ]
    }),
    deleteArticleAuthor: build.mutation({
      query: ({article, author}) => ({
        url: `/article/${article}/delete-author/${author}`,
        method: "DELETE"
      }),
      invalidatesTags: result => [
          ...result.data.map(author=>({ type: "Authors", id: author.id })),
        { type: "Authors", id: "LIST" }
      ]
    }),


  })
})

export const {
  useGetArticleQuery,
  useGetArticlesQuery,
  useGetCategoryArticlesQuery,
  useAddCategoryArticleMutation,
  useUpdateArticleMutation,
  useUnlockArticleMutation,



  useSetArticlePublishTimeMutation,
  useDeleteArticlePublishTimeMutation,

  useGetAuthorsQuery,
  useGetAuthorQuery,
  useAddAuthorMutation,
  useUpdateAuthorMutation,
  useDeleteAuthorMutation,
  useGetArticleAuthorsQuery,
  useAddArticleAuthorMutation,
  useDeleteArticleAuthorMutation,
  useGetAllAuthorsQuery,
  useSearchAuthorMutation,
  useSelectArticleAuthorMutation,


} = articles