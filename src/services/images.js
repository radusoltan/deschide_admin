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
        ...result.data.map((image)=>({ type: "Image", id: image.id })),
        { type: "Images", id: "LIST" },
      ]
    }),
    uploadArticleImages: build.mutation({
      query: ({article, body}) => ({
        url: `/article/${article}/images`,
        method: 'POST',
        body
      }),
      invalidatesTags: result => [
        ...result.data.map(image=>({ type: "Image", id: image.id })),
        { type: "Images", id: "LIST" }
      ]
    }),
    detachArticleImage: build.mutation({
      query: ({article, id}) => ({
        url: `/article/${article}/images`,
        method: "PATCH",
        body: {id}
      }),
      invalidatesTags: result => [
        ...result.data.map(image=>({ type: "Image", id: image.id })),
        { type: "Images", id: "LIST" }
      ]
    }),
    setArticleMainImage: build.mutation({
      query: ({article, image}) => ({
        url: `/article/${article}/image-set-main`,
        method: 'POST',
        body: {image}
      }),
      invalidatesTags: result => [
        [{type: "images", id: result.id}],
        { type: "Images", id: "LIST" },
      ]
    }),
    getRenditions: build.query({
      query: () => 'renditions'
    }),
    getImageThumbnails: build.query({
      query: image => `/image/${image}/thumbnails`,
      providesTags: result => [
        ...result.data.map(thumbnail => ({type: "Thumbnail", id: thumbnail.id })),
        {type: "Thumbnails", id: "LIST" },
      ]
    }),
    cropImage: build.mutation({
      query: ({image,rendition,crop}) => ({
        url: `/image/${image}/crop`,
        method: 'POST',
        body: {rendition, crop}
      }),
      invalidatesTags: result => [
          [{ type: "Images", id: result.image_id}],
        { type: "Images", id: "LIST" }
      ]
    }),

  })
})

export const {
  useGetImagesByArticleQuery,
  useUploadArticleImagesMutation,
  useDetachArticleImageMutation,
  useSetArticleMainImageMutation,
  useGetRenditionsQuery,
  useGetImageThumbnailsQuery,
  useCropImageMutation
} = images