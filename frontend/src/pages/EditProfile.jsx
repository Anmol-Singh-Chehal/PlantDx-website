import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { UserRound, Trash2, Eye, EyeOff, ArrowLeft, Save, ShieldCheck, FileImage } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "@/features/auth/authSlice.js";
import { useEditProfileMutation } from "@/services/api.js";
import { useNavigate } from "react-router-dom";

const editProfileSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters").max(50, "Full name must not exceed 50 characters"),
  password: z.string().min(1, "Current password is required"),
  profileImage: z.any().optional(),
});

export default function EditProfile() {
  const { theme } = useTheme();
  const profileInputRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [editProfile, { isLoading }] = useEditProfileMutation();
  const [profileImage, setProfileImage] = useState(
    user?.profile_photo || null
  );
  const [selectedFile, setSelectedFile] = useState(null);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullName: "",
      password: "",
      profileImage: null,
    },
  });

  const handleProfileImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      e.target.value = "";
      return;
    }

    if (profileImage?.startsWith("blob:")) {
      URL.revokeObjectURL(profileImage);
    }

    const imageUrl = URL.createObjectURL(file);

    setSelectedFile(file);
    setProfileImage(imageUrl);

    setValue("profileImage", file, {
      shouldValidate: true,
    });
  };

  const removeProfileImage = () => {
    if (profileImage?.startsWith("blob:")) {
      URL.revokeObjectURL(profileImage);
    }

    setProfileImage(null);
    setSelectedFile(null);

    setValue("profileImage", null);

    if (profileInputRef.current) {
      profileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data) => {
    try {
      const result = await editProfile({
        profile_photo: selectedFile,
        full_name: data.fullName,
        current_password: data.password,
      }).unwrap();

      console.log("Profile updated:", result);

      dispatch(updateUser(result.user));
      alert("Profile updated successfully!");
      navigate("/profile");

    } catch (error) {
      console.error("Profile update failed:", error);

      alert(
        error?.data?.detail ||
        "Failed to update profile. Please try again."
      );
    }
  };

  useEffect(() => {
    return () => {
      if (profileImage) {
        URL.revokeObjectURL(profileImage);
      }
    };
  }, [profileImage]);

  return (
    <main className="min-h-screen bg-paper-1 flex items-center justify-center sm:px-4 lg:px-8 xl:px-12 py-8 mt-15">

      <div className="w-full max-w-4xl">

        <div className="mb-6">
          <NavLink to="/profile" className="inline-flex items-center gap-2 text-sm text-secondary hover:text-muted font-secondary transition cursor-pointer">
            <ArrowLeft className="size-4" />
            Back to profile
          </NavLink>
        </div>

        <div className="rounded-3xl border border-muted/20 bg-paper-1 shadow-[0_15px_60px_color-mix(in_srgb,var(--muted)_10%,transparent)] overflow-hidden">

          <div className="relative sm:px-4 md:px-8 py-6 lg:p-12 border-b border-muted/15 overflow-hidden">

            <div className="absolute -right-20 -top-24 size-56 rounded-full bg-muted/10 blur-3xl"></div>

            <div>
              <p className="text-xs uppercase text-muted font-secondary font-semibold">
                Account settings
              </p>

              <h1 className="mt-1 text-3xl sm:text-2xl font-primary font-bold text-primary">
                Edit profile
              </h1>

              <p className="mt-1 text-xs sm:text-sm text-secondary font-secondary">
                Update your profile information securely.
              </p>
            </div>

          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="sm:px-4 md:px-8 py-6 lg:p-12">

            <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-8 lg:gap-10">

              <div className="flex flex-col items-center">

                <label className="text-sm font-semibold text-primary font-primary mb-3">
                  Profile photo
                </label>

                <input ref={profileInputRef} type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={handleProfileImage} className="hidden" />

                <div className="relative">

                  <button type="button" onClick={() => profileInputRef.current?.click()} className="size-32 sm:size-36 rounded-full overflow-hidden border-2 border-muted bg-paper-2/20 flex items-center justify-center cursor-pointer hover:bg-muted/10 transition-all duration-300">

                    {profileImage ? (
                      <img src={profileImage} alt="Profile preview" className="w-full h-full object-cover" />
                    ) : (
                      <UserRound className="size-16 text-secondary" />
                    )}

                  </button>

                  {profileImage && (
                    <button type="button" onClick={removeProfileImage} className="absolute top-0 right-0 size-7 rounded-full bg-red-500 text-white flex items-center justify-center cursor-pointer hover:bg-red-600 transition">
                      <Trash2 className="size-3.5" />
                    </button>
                  )}

                </div>

                <div className="mt-4 flex items-center gap-2 rounded-full bg-muted/10 px-3 py-1.5 shrink-0 whitespace-nowrap">
                  <FileImage className="size-4 text-muted shrink-0" />

                  <span className="font-secondary text-xs text-secondary whitespace-nowrap">
                    PNG · JPG · JPEG · WEBP
                  </span>
                </div>

                <button type="button" onClick={() => profileInputRef.current?.click()} className="mt-3 px-3 py-1.5 rounded-full border border-muted/25 text-xs text-muted font-secondary font-medium hover:bg-muted/10 transition cursor-pointer">
                  Change photo
                </button>

                <p className="mt-2 text-center text-[11px] text-secondary font-secondary">
                  Maximum size: 5 MB
                </p>

              </div>

              <div className="space-y-5">

                <div className="flex flex-col gap-2">

                  <label htmlFor="fullName" className="text-sm font-semibold text-primary font-primary">
                    Full name
                  </label>

                  <div className="relative">

                    <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-secondary" />

                    <Input id="fullName" type="text" placeholder="Enter your full name" {...register("fullName")} className="w-full h-12 rounded-xl border border-muted/25 bg-paper-2/20 pl-10 pr-4 text-sm text-primary placeholder:text-secondary/60 outline-none transition focus:border-muted focus:ring-2 focus:ring-muted/15 font-secondary" />

                  </div>

                  {errors.fullName && (
                    <p className="text-xs text-red-500 font-secondary">
                      {errors.fullName.message}
                    </p>
                  )}

                </div>

                <div className="pt-3">

                  <div className="mb-4">

                    <div className="flex items-center gap-2">

                      <ShieldCheck className="size-4 text-muted" />

                      <h3 className="text-base font-primary font-semibold text-primary">
                        Verify your identity
                      </h3>

                    </div>

                    <p className="mt-1 text-xs sm:text-sm text-secondary font-secondary">
                      Enter your current password to confirm these profile changes.
                    </p>

                  </div>

                  <div className="flex flex-col gap-2">

                    <label htmlFor="password" className="text-sm font-semibold text-primary font-primary">
                      Current password
                    </label>

                    <div className="relative">

                      <Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your current password" {...register("password")} className="w-full h-12 rounded-xl border border-muted/25 bg-paper-2/20 px-4 pr-11 text-sm text-primary placeholder:text-secondary/60 outline-none transition focus:border-muted focus:ring-2 focus:ring-muted/15 font-secondary" />

                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-muted cursor-pointer">

                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}

                      </button>

                    </div>

                    {errors.password && (
                      <p className="text-xs text-red-500 font-secondary">
                        {errors.password.message}
                      </p>
                    )}

                  </div>

                </div>

              </div>

            </div>

            <div className="mt-8 pt-6 border-t border-muted/15 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">

              <NavLink to="/profile" className="h-11 px-5 rounded-xl border border-muted/25 bg-paper-2/10 text-secondary flex items-center justify-center font-primary font-semibold text-sm hover:bg-muted/10 hover:text-primary transition cursor-pointer">
                Cancel
              </NavLink>

              <button type="submit" disabled={isSubmitting} className={`h-11 px-6 rounded-xl bg-muted ${theme === "light" ? "text-white" : "text-paper-1"} flex items-center justify-center gap-2 font-primary font-semibold text-sm cursor-pointer transition-all duration-300 hover:brightness-105 hover:-translate-y-0.5 active:translate-y-0 shadow-[0_8px_25px_color-mix(in_srgb,var(--muted)_25%,transparent)] disabled:opacity-60 disabled:cursor-not-allowed`}>
                <Save className="size-4" />
                {isSubmitting ? "Saving..." : "Save changes"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </main>
  );
}