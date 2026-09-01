import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000",

    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  tagTypes: ["User", "Prediction", "History"],

  endpoints: (builder) => ({

    // ============================================================
    // AUTH
    // ============================================================

    signup: builder.mutation({
      query: ({
        profile_photo,
        full_name,
        email,
        password,
        accepts_terms,
      }) => {
        const formData = new FormData();

        if (profile_photo) {
          formData.append("profile_photo", profile_photo);
        }

        formData.append("full_name", full_name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("accepts_terms", accepts_terms);

        return {
          url: "/auth/sign-up",
          method: "POST",
          body: formData,
        };
      },
    }),

    login: builder.mutation({
      query: ({ email, password }) => {
        const formData = new FormData();

        formData.append("email", email);
        formData.append("password", password);

        return {
          url: "/auth/log-in",
          method: "POST",
          body: formData,
        };
      },
    }),

    editProfile: builder.mutation({
      query: ({
        profile_photo,
        full_name,
        current_password,
      }) => {
        const formData = new FormData();

        formData.append("full_name", full_name);
        formData.append("current_password", current_password);

        if (profile_photo instanceof File) {
          formData.append("profile_photo", profile_photo);
        }

        return {
          url: "/auth/edit-profile",
          method: "PUT",
          body: formData,
        };
      },

      invalidatesTags: ["User"],
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/sign-out",
        method: "POST",
      }),
    }),

    forgotPassword: builder.mutation({
      query: ({ email }) => {
        const formData = new FormData();

        formData.append("email", email);

        return {
          url: "/auth/forgot-password",
          method: "POST",
          body: formData,
        };
      },
    }),

    verifyCode: builder.mutation({
      query: ({ email, code }) => {
        const formData = new FormData();

        formData.append("email", email);
        formData.append("code", code);

        return {
          url: "/auth/verify-code",
          method: "POST",
          body: formData,
        };
      },
    }),

    updatePassword: builder.mutation({
      query: ({
        email,
        reset_token,
        new_password,
        confirm_password,
      }) => {
        const formData = new FormData();

        formData.append("email", email);
        formData.append("reset_token", reset_token);
        formData.append("new_password", new_password);
        formData.append("confirm_password", confirm_password);

        return {
          url: "/auth/update-password",
          method: "POST",
          body: formData,
        };
      },
    }),

    contactUs: builder.mutation({
      query: ({ name, subject, message }) => {
        const formData = new FormData();

        formData.append("name", name);
        formData.append("subject", subject);
        formData.append("message", message);

        return {
          url: "/auth/contact-us",
          method: "POST",
          body: formData,
        };
      },
    }),

    getPredictionHistory: builder.query({
      query: () => ({
        url: "/auth/prediction-history",
        method: "GET",
      }),
      providesTags: ["History"],
    }),

    getQueries: builder.query({
      query: () => ({
        url: "/auth/get-queries",
        method: "GET",
      }),
      providesTags: ["Queries"],
    }),

    // ============================================================
    // DETECTION
    // ============================================================

    mangoLeafClassification: builder.mutation({
      query: (images) => {
        const formData = new FormData();

        images.forEach((image) => {
          formData.append("images", image);
        });

        return {
          url: "/detection/mango",
          method: "POST",
          body: formData,
        };
      },

      invalidatesTags: ["Prediction", "History"],
    }),

    cherryLeafClassification: builder.mutation({
      query: (images) => {
        const formData = new FormData();

        images.forEach((image) => {
          formData.append("images", image);
        });

        return {
          url: "/detection/cherry",
          method: "POST",
          body: formData,
        };
      },

      invalidatesTags: ["Prediction", "History"],
    }),

    grapeLeafClassification: builder.mutation({
      query: (images) => {
        const formData = new FormData();

        images.forEach((image) => {
          formData.append("images", image);
        });

        return {
          url: "/detection/grape",
          method: "POST",
          body: formData,
        };
      },

      invalidatesTags: ["Prediction", "History"],
    }),

    appleLeafClassification: builder.mutation({
      query: (images) => {
        const formData = new FormData();

        images.forEach((image) => {
          formData.append("images", image);
        });

        return {
          url: "/detection/apple",
          method: "POST",
          body: formData,
        };
      },

      invalidatesTags: ["Prediction", "History"],
    }),
  }),
});

export const {
  // Auth
  useSignupMutation,
  useLoginMutation,
  useEditProfileMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useVerifyCodeMutation,
  useUpdatePasswordMutation,
  useContactUsMutation,
  useGetPredictionHistoryQuery,
  useGetQueriesQuery,

  // Detection
  useMangoLeafClassificationMutation,
  useCherryLeafClassificationMutation,
  useGrapeLeafClassificationMutation,
  useAppleLeafClassificationMutation,
} = api;