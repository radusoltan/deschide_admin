import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {locale} from "moment";


const baseUrl = process.env.REACT_APP_API_URL

export const lists = createApi({
  reducerPath: 'lists',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, {getState}) => {
      const token = getState().auth.token
      if (token){
        headers.set('authorization', `Bearer ${token}`)
      }
    },
  }),
  tagTypes: ["Lists"],
  endpoints: build => ({
    getLists: build.query({
      query: page => `/lists?page=${page}`,
      providesTags: result => [
          ...result.data.map(({id})=>({ type: "Lists", id })),
        {type: "Lists", id: "PARTIAL-LIST" }
      ]
    }),
    getList: build.query({
      query: list => `/lists/${list}`,
      providesTags: result => [{type: "Lists", id: result.data.id }]
    }),
    addList: build.mutation({
      query: body => ({
        url: `/lists`,
        method: "POST",
        body
      }),
      invalidatesTags: result => [
        {type: "Lists", id: result.data.id},
        {type: "Lists", id: "PARTIAL-LIST"}
      ]
    }),
    deleteList: build.mutation({
      query: list => ({
        url: `/lists/${list}`,
        method: "DELETE"
      }),
      invalidatesTags: (result, error, id) => [
          {type: "Lists", id},
          {type: "Lists", id: "PARTIAL-LIST"}
      ]
    }),

    addArticleToList: build.mutation({
      query: ({article, list}) => ({
        url: `/lists/${list}/add-article`,
        method: "POST",
        body: {article},

      }),
      invalidatesTags: result => [
        {type: "Lists", id: result.data.id},
        // {type: "Lists", id: "PARTIAL-LIST"}
      ]
    }),
    deleteArticleFromList: build.mutation({
      query: ({article, list}) => ({
        url: `/lists/${list}/delete-article`,
        method: "POST",
        body: {article},
      }),
      invalidatesTags: result => [
        {type: "Lists", id: result.data.id},
      ]
    })

  })
})

export const {
  useGetListsQuery,
  useGetListQuery,
  useAddListMutation,
  useDeleteListMutation,

  useAddArticleToListMutation,
  useDeleteArticleFromListMutation
} = lists