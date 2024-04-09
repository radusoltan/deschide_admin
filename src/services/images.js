import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.REACT_APP_API_URL

export const images = createApi({
  reducerPath: 'images',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers,{getState})=>{
      const token = getState().auth.token
      if (token){
        headers.set('authorization', `Bearer ${token}`)
      }
    }
  }),
  tagTypes: ["Images", "Thumbnails"],
  endpoints: build => ({
    getImagesByArticle: build.query({
      query: article => `/article/${article}/images`,
      providesTags: result => [
          ...result.data.map(({id})=>({ type: "Image", id })),
        { type: "Images", id: "LIST" }
      ]
    }),
    uploadArticleImages: build.mutation({
      query: ({article, body}) => ({
        url: `/article/${article}/images`,
        method: 'POST',
        body
      }),

    })
  })
})

export const {
  useGetImagesByArticleQuery,
  useUploadArticleImagesMutation
} = images