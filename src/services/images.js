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
  tagTypes: ["Images", "Thumbnails", "Renditions"],
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
      query: (page) => `/renditions?page=${page}`,
      providesTags: result => [
          ...result.data.map(rendition=>({ type: "Renditions", id: rendition.id })),
        {type: "Renditions", id: "PARTIAL-LIST" },
      ]
    }),
    getRendition: build.query({
      query: rendition => `/renditions/${rendition}`,
      providesTags: result => [
        {type: "Rendition", id: result.data.id},
        { type: "Renditions", id: "PARTIAL-LIST" },
      ]
    }),
    addRendition: build.mutation({
      query: body => ({
        url: '/renditions',
        method: "POST",
        body
      }),
      invalidatesTags: result => [
        {type: "Renditions", id: result.data.id},
        {type: "Renditions", id: "PARTIAL-LIST" },
      ],
    }),
    updateRendition: build.mutation({
      query: ({rendition, body}) => ({
        url: `/renditions/${rendition}`,
        method: "PATCH",
        body
      }),
      invalidatesTags: result => [
          {type: "Renditions", id: result.data.id},
          {type: "Renditions", id: "PARTIAL-LIST" },
      ]
    }),
    deleteRendition: build.mutation({
      query: rendition => ({
        url: `/renditions/${rendition}`,
        method: "DELETE"
      }),
      invalidatesTags: (result, error, id) => [
        {type: "Renditions", id},
        {type: "Renditions", id: "PARTIAL-LIST"},
      ]
    }),
    getAllRenditions: build.query({
      query: ()=> '/renditions',
      providesTags: result => [
        ...result.data.map(rendition=>({ type: "Rendition", id: rendition.id })),
        {type: "Renditions", id: "LIST"},
      ]
    }),


    updateImage: build.mutation({
      query: ({image, body}) => ({
        url: `/images/${image}`,
        method: "PATCH",
        body
      })
    }),




    getImageThumbnails: build.query({
      query: image => `/image/${image}/thumbnails`,
      providesTags: result => [
        ...result.data.map(thumbnail => ({type: "Thumbnail", id: thumbnail.id })),
        {type: "Thumbnails", id: "LIST" },
      ]
    }),
    cropImage: build.mutation({
      query: ({image,rendition,crop, thumbnail}) => ({
        url: `/image/${image}/crop`,
        method: 'POST',
        body: {rendition, crop, thumbnail}
      }),
      invalidatesTags: result => [
          [{ type: "Images", id: result.image_id}],
          [{type: "Thumbnails",id: result.id}],
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

  useUpdateImageMutation,

  useGetRenditionsQuery,
  useGetAllRenditionsQuery,
  useGetRenditionQuery,
  useAddRenditionMutation,
  useUpdateRenditionMutation,
  useDeleteRenditionMutation,

  useGetImageThumbnailsQuery,
  useCropImageMutation
} = images