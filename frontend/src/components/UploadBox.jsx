import React, { useRef, useEffect } from "react";
import {
  UploadCloud,
  ImagePlus,
  X,
  FileImage,
} from "lucide-react";
import { useTheme } from "next-themes";

export default function UploadBox({ images, setImages }) {
  const {theme, setTheme} = useTheme();
  const inputRef = useRef(null);

  const handleFiles = (selectedFiles) => {
    if (!selectedFiles?.length) return;

    const remainingSlots = 5 - images.length;

    if (remainingSlots <= 0) return;

    const newImages = Array.from(selectedFiles)
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, remainingSlots)
      .map((file) => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
      }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (id) => {
    setImages((prev) => {
      const imageToRemove = prev.find((image) => image.id === id);

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }

      return prev.filter((image) => image.id !== id);
    });
  };

  // Cleanup previews when component unmounts
  useEffect(() => {
    return () => {
      images.forEach((image) => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, []);

  return (
    <div className="w-full flex flex-col gap-5">

      {/* Upload Area */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="
          group
          relative
          min-h-70
          sm:min-h-80

          flex
          flex-col
          items-center
          justify-center

          text-center
          cursor-pointer

          rounded-2xl

          border-2
          border-dashed
          border-muted/25

          bg-paper-1

          transition-all
          duration-300

          hover:border-muted/50
          hover:bg-muted/5
        "
      >

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);

            // Allows selecting the same file again
            e.target.value = "";
          }}
        />

        {/* Upload Icon */}
        <div
          className="
            size-16
            rounded-2xl

            bg-muted/10

            flex
            items-center
            justify-center

            mb-5

            transition-all
            duration-300

            group-hover:bg-muted/20
            group-hover:scale-105
          "
        >
          <UploadCloud className="size-8 text-muted" />
        </div>

        {/* Heading */}
        <h3
          className="
            font-primary
            text-xl
            sm:text-2xl
            font-semibold
            text-primary
          "
        >
          {images.length > 0
            ? "Add more leaf images"
            : "Upload your leaf images"}
        </h3>

        {/* Description */}
        <p
          className="
            mt-2
            font-secondary
            text-sm
            text-secondary
          "
        >
          Drag & drop images here or click to browse
        </p>

        {/* Browse Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
          className={`
            mt-5

            flex
            items-center
            gap-2

            rounded-full

            bg-muted
            ${theme==="light"? "text-white": "text-paper-1"}

            px-4
            py-2

            font-primary
            text-sm
            font-medium

            transition-all
            duration-200

            hover:scale-105
            hover:shadow-md

            cursor-pointer
          `}
        >
          <ImagePlus className="size-4" />

          {images.length > 0 ? "Add Images" : "Browse Images"}
        </button>

        {/* Formats */}
        <div
          className="
            mt-4
            flex
            items-center
            gap-2

            rounded-full
            bg-muted/10

            px-3
            py-1.5
          "
        >
          <FileImage className="size-4 text-muted" />

          <span className="font-secondary text-xs text-secondary">
            Maximum 5 images · PNG · JPG · JPEG · WEBP
          </span>
        </div>

      </div>


      {/* Selected Images */}
      {images.length > 0 && (
        <div className="flex flex-col gap-4">

          {/* Header */}
          <div className="flex items-center justify-between">

            <div>
              <h3
                className="
                  font-primary
                  text-lg
                  font-semibold
                  text-primary
                "
              >
                Selected Images
              </h3>

              <p
                className="
                  font-secondary
                  text-sm
                  text-secondary
                "
              >
                {images.length} image{images.length !== 1 ? "s" : ""} selected
              </p>
            </div>

            {/* Clear All */}
            <button
              type="button"
              onClick={() => {
                images.forEach((image) => {
                  URL.revokeObjectURL(image.preview);
                });

                setImages([]);
              }}
              className="
                text-sm
                font-secondary
                font-medium

                text-muted

                hover:text-red-500

                cursor-pointer

                transition-colors
              "
            >
              Remove all
            </button>

          </div>


          {/* Image Grid */}
          <div
            className="
              grid
              grid-cols-2
              sm:grid-cols-3
              lg:grid-cols-4
              gap-3
              sm:gap-4
            "
          >

            {images.map((image, index) => (
              <div
                key={image.id}
                className="
                  group
                  relative
                  overflow-hidden

                  aspect-square

                  rounded-xl

                  border
                  border-muted/20

                  bg-paper-1

                  shadow-sm
                "
              >

                {/* Image */}
                <img
                  src={image.preview}
                  alt={`Leaf image ${index + 1}`}
                  className="
                    w-full
                    h-full
                    object-cover

                    transition-transform
                    duration-300

                    group-hover:scale-105
                  "
                />


                {/* Number */}
                <div
                  className="
                    absolute
                    left-2
                    bottom-2

                    size-7

                    flex
                    items-center
                    justify-center

                    rounded-full

                    bg-[#172321]
                    backdrop-blur-sm

                    border
                    border-muted/20

                    text-xs
                    font-primary
                    font-semibold
                    text-white
                    
                  "
                >
                  {index + 1}
                </div>


                {/* Remove Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(image.id);
                  }}
                  className="
                    absolute
                    top-2
                    right-2

                    size-8

                    flex
                    items-center
                    justify-center

                    rounded-full

                    bg-[#172321]
                    backdrop-blur-sm

                    border
                    border-muted/20

                    text-white

                    shadow-md

                    transition-all
                    duration-200

                    hover:bg-red-500
                    hover:text-white
                    hover:border-red-500
                    hover:scale-105

                    cursor-pointer
                  "
                >
                  <X className="size-4" />
                </button>

              </div>
            ))}

          </div>

        </div>
      )}

    </div>
  );
}