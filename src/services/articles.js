import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {locale} from "moment";
import {logout} from "../features/authSlice";

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
  tagTypes: ["Articles", "Authors", "Lists"],
  endpoints: build => ({
    getArticle: build.query({
      query: ({article, locale}) => `/articles/${article}?locale=${locale}`,
      providesTags: result => [
          {type: "Articles", id: result.id},
        {type: "Articles", id: "PARTIAL-LIST"}
      ],
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

    getLists: build.query({
      query: ({locale, page}) => `/lists?locale=${locale}&page=${page}`,
      providesTags: result => [
          ...result.data.map(list=>({ type: "Lists", id: list.id })),
        { type: "Lists", id: "PARTIAL-LIST" }
      ]
    }),
    getList: build.query({
      query: list => `/lists/${list}`,
      providesTags: result => [{type: "Lists", id: result.data.id}],
    }),
    addList: build.mutation({
      query: (values) => ({
        url: `/lists`,
        method: "POST",
        body: values
      }),
      invalidatesTags: result => [
        {type: "Lists", id: result.data.id},
        {type: "Lists", id: "PARTIAL-LIST" }
      ],
    }),
    deleteList: build.mutation({
      query: list => ({
        url: `/lists/${list}`,
        method: "DELETE"
      }),
      invalidatesTags: (r,e,id) => [
          {type: "Lists", id: id},
          {type: "Lists", id: "PARTIAL-LIST" }
      ]
    }),
    addArticlesToList: build.mutation({
      query: ({list,ids}) => ({
        url: `/lists/${list}/add-articles`,
        method: "POST",
        body: {ids}
      }),
      invalidatesTags: result => [
        {type: "Lists", id: result.data.id},
        { type: "Lists", id: "PARTIAL-LIST" }
      ]
    }),
    addArticleToList: build.mutation({
      query: ({list,article}) => ({
        url: `/lists/${list}/add-article`,
        method: "POST",
        body: {article}
      }),
      invalidatesTags: result => [
        {type: "Lists", id: result.data.id},
        { type: "Lists", id: "PARTIAL-LIST" }
      ]
    }),
    deleteArticleFromList: build.mutation({
      query: ({list, article}) => ({
        url: `/lists/${list}/delete-article`,
        method: "POST",
        body: {article}
      }),
      invalidatesTags: result => [
        {type: "Lists", id: result.data.id},
        { type: "Lists", id: "PARTIAL-LIST" },
        { type: "Articles", id: "PARTIAL-LIST" }
      ],
    })
  })
})

export const {
  useGetArticleQuery,
  useGetArticlesQuery,
  useGetCategoryArticlesQuery,
  useAddCategoryArticleMutation,
  useUpdateArticleMutation,
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

  useGetListsQuery,
  useGetListQuery,
  useAddListMutation,
  useDeleteListMutation,
  useAddArticlesToListMutation,
  useAddArticleToListMutation,
  useDeleteArticleFromListMutation,
} = articles