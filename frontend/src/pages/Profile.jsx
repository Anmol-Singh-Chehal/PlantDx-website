import React from "react";
import {
  UserRound,
  Mail,
  CalendarDays,
  Pencil,
  KeyRound,
  ScanLine,
  FileDown,
  Brain,
  Activity,
  LoaderCircle,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { useGetPredictionHistoryQuery } from "@/services/api";
import { useLogoutMutation } from "@/services/api";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { logout } from "@/features/auth/authSlice";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import FadeIn from "@/components/FadeIn";

export default function Profile() {
  const { theme } = useTheme();

  const {
    data,
    isLoading,
    isError,
  } = useGetPredictionHistoryQuery();

  const predictionHistory = data?.history || [];

  const [logoutMutation] = useLogoutMutation();

  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const navigate = useNavigate();

  const totalImagesAnalyzed = predictionHistory.reduce(
    (total, scan) =>
      total +
      (scan?.total_images ??
        scan?.images?.length ??
        0),
    0
  );

  const [generatingReport, setGeneratingReport] =
    React.useState(null);

  const handleSignOut = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      console.error("Sign out API failed:", error);
    } finally {
      dispatch(logout());
      navigate("/");
    }
  };

  const getCloudinaryPdfUrl = (url) => {
    if (!url) return "";

    try {
      if (
        url.includes("res.cloudinary.com") &&
        url.includes("/upload/")
      ) {
        return url.replace(
          "/upload/",
          "/upload/f_jpg,q_auto/"
        );
      }

      return url;
    } catch (error) {
      console.error(
        "Failed to prepare Cloudinary URL:",
        error
      );

      return url;
    }
  };

  // ============================================================
  // FETCH IMAGE FROM CLOUDINARY
  // ============================================================

  const fetchImageAsDataUrl = async (imageUrl) => {
    if (!imageUrl) {
      throw new Error("Image URL is missing.");
    }

    const pdfImageUrl =
      getCloudinaryPdfUrl(imageUrl);

    const response = await fetch(pdfImageUrl);

    if (!response.ok) {
      throw new Error(
        `Unable to fetch image. Status: ${response.status}`
      );
    }

    const blob = await response.blob();

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        resolve({
          dataUrl: reader.result,
          mimeType: blob.type,
        });
      };

      reader.onerror = reject;

      reader.readAsDataURL(blob);
    });
  };

  // ============================================================
  // ADD IMAGE TO PDF WITH PROPER ASPECT RATIO
  // ============================================================

  const addImageToPdf = async (
    pdf,
    imageUrl,
    x,
    y,
    maxWidth,
    maxHeight
  ) => {
    const imageData =
      await fetchImageAsDataUrl(imageUrl);

    const img = new Image();

    img.src = imageData.dataUrl;

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    const imageWidth =
      img.naturalWidth || img.width;

    const imageHeight =
      img.naturalHeight || img.height;

    if (!imageWidth || !imageHeight) {
      throw new Error(
        "Unable to determine image dimensions."
      );
    }

    const imageRatio =
      imageWidth / imageHeight;

    let finalWidth = maxWidth;

    let finalHeight =
      finalWidth / imageRatio;

    if (finalHeight > maxHeight) {
      finalHeight = maxHeight;

      finalWidth =
        finalHeight * imageRatio;
    }

    const finalX =
      x + (maxWidth - finalWidth) / 2;

    const mimeType =
      imageData.mimeType?.toLowerCase();

    const format =
      mimeType?.includes("jpeg") ||
      mimeType?.includes("jpg")
        ? "JPEG"
        : "PNG";

    pdf.addImage(
      imageData.dataUrl,
      format,
      finalX,
      y,
      finalWidth,
      finalHeight
    );

    return finalHeight;
  };

  // ============================================================
  // GENERATE REPORT FOR ONLY ONE IMAGE
  // ============================================================

  const generatePredictionReport = async (
    scan,
    image,
    imageIndex
  ) => {
    const reportId =
      `${scan?.id || "scan"}-${
        image?.image?.public_id ||
        imageIndex
      }`;

    try {
      setGeneratingReport(reportId);

      // ========================================================
      // BASIC DATA
      // ========================================================

      const diseaseType = String(
        scan?.disease_type ||
          "Leaf Scan"
      ).replaceAll("_", " ");

      const prediction =
        image?.prediction || {};

      const classConfidence =
        prediction?.class_confidence || {};

      const imageUrl =
        image?.image?.url || "";

      const filename =
        image?.filename ||
        `Image ${imageIndex + 1}`;

      const predictedClass = String(
        prediction?.predicted_class ||
          "Unknown"
      ).replaceAll("_", " ");

      const confidence = Number(
        prediction?.confidence ?? 0
      );

      const createdAt = scan?.created_at
        ? new Date(
            scan.created_at
          ).toLocaleString()
        : "N/A";

      // ========================================================
      // CREATE PDF
      // ========================================================

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth =
        pdf.internal.pageSize.getWidth();

      const pageHeight =
        pdf.internal.pageSize.getHeight();

      const margin = 16;

      // ========================================================
      // HEADER
      // ========================================================

      pdf.setFont(
        "helvetica",
        "bold"
      );

      pdf.setFontSize(22);

      pdf.text(
        "PlantDx",
        margin,
        20
      );

      pdf.setFontSize(10);

      pdf.setFont(
        "helvetica",
        "normal"
      );

      pdf.text(
        "Leaf Classification Prediction Report",
        margin,
        27
      );

      pdf.setDrawColor(
        180,
        180,
        180
      );

      pdf.line(
        margin,
        32,
        pageWidth - margin,
        32
      );

      // ========================================================
      // REPORT INFORMATION
      // ========================================================

      pdf.setFont(
        "helvetica",
        "bold"
      );

      pdf.setFontSize(14);

      pdf.text(
        "Report Information",
        margin,
        43
      );

      autoTable(pdf, {
        startY: 48,

        theme: "grid",

        margin: {
          left: margin,
          right: margin,
        },

        styles: {
          font: "helvetica",
          fontSize: 9,
          cellPadding: 3,
          textColor: [40, 40, 40],
        },

        headStyles: {
          fontStyle: "bold",
        },

        columnStyles: {
          0: {
            cellWidth: 45,
            fontStyle: "bold",
          },

          1: {
            cellWidth: "auto",
          },
        },

        head: [
          ["Field", "Details"],
        ],

        body: [
          [
            "User",
            "Anmol Singh",
          ],

          [
            "Detection Type",
            diseaseType,
          ],

          [
            "Detection Model",
            scan?.model || "N/A",
          ],

          [
            "Image",
            filename,
          ],

          [
            "Total Images",
            "1",
          ],

          [
            "Prediction Date",
            createdAt,
          ],

          [
            "Scan ID",
            scan?.id || "N/A",
          ],
        ],
      });

      // ========================================================
      // IMAGE PREDICTION SECTION
      // ========================================================

      let currentY =
        pdf.lastAutoTable?.finalY
          ? pdf.lastAutoTable.finalY + 12
          : 90;

      pdf.setFont(
        "helvetica",
        "bold"
      );

      pdf.setFontSize(14);

      pdf.text(
        "Prediction Result",
        margin,
        currentY
      );

      currentY += 8;

      // ========================================================
      // IMAGE
      // ========================================================

      pdf.setFont(
        "helvetica",
        "bold"
      );

      pdf.setFontSize(11);

      pdf.text(
        filename,
        margin,
        currentY
      );

      currentY += 5;

      const imageBoxWidth =
        pageWidth - margin * 2;

      const imageBoxHeight = 80;

      pdf.setDrawColor(
        210,
        210,
        210
      );

      pdf.rect(
        margin,
        currentY,
        imageBoxWidth,
        imageBoxHeight
      );

      try {
        if (imageUrl) {
          await addImageToPdf(
            pdf,
            imageUrl,
            margin + 3,
            currentY + 3,
            imageBoxWidth - 6,
            imageBoxHeight - 6
          );
        } else {
          pdf.setFont(
            "helvetica",
            "normal"
          );

          pdf.setFontSize(9);

          pdf.text(
            "Image unavailable",
            pageWidth / 2,
            currentY +
              imageBoxHeight / 2,
            {
              align: "center",
            }
          );
        }
      } catch (imageError) {
        console.error(
          "Failed to embed image:",
          imageError
        );

        pdf.setFont(
          "helvetica",
          "normal"
        );

        pdf.setFontSize(9);

        pdf.text(
          "Unable to load image into report.",
          pageWidth / 2,
          currentY +
            imageBoxHeight / 2,
          {
            align: "center",
          }
        );
      }

      currentY +=
        imageBoxHeight + 10;

      // ========================================================
      // MAIN PREDICTION TABLE
      // ========================================================

      autoTable(pdf, {
        startY: currentY,

        theme: "grid",

        margin: {
          left: margin,
          right: margin,
        },

        styles: {
          font: "helvetica",
          fontSize: 9,
          cellPadding: 3,
        },

        head: [
          [
            "Predicted Class",
            "Confidence",
          ],
        ],

        body: [
          [
            predictedClass,
            `${confidence.toFixed(2)}%`,
          ],
        ],
      });

      currentY =
        pdf.lastAutoTable.finalY + 8;

      // ========================================================
      // CLASS CONFIDENCE
      // ========================================================

      if (
        Object.keys(classConfidence)
          .length > 0
      ) {
        const confidenceRows =
          Object.entries(
            classConfidence
          ).map(
            ([className, classValue]) => [
              String(className).replaceAll(
                "_",
                " "
              ),

              `${Number(
                classValue ?? 0
              ).toFixed(2)}%`,
            ]
          );

        if (
          currentY >
          pageHeight - 70
        ) {
          pdf.addPage();

          currentY = 20;
        }

        pdf.setFont(
          "helvetica",
          "bold"
        );

        pdf.setFontSize(11);

        pdf.text(
          "Class Confidence Scores",
          margin,
          currentY
        );

        currentY += 5;

        autoTable(pdf, {
          startY: currentY,

          theme: "striped",

          margin: {
            left: margin,
            right: margin,
          },

          styles: {
            font: "helvetica",
            fontSize: 8.5,
            cellPadding: 2.5,
          },

          head: [
            [
              "Class",
              "Confidence",
            ],
          ],

          body: confidenceRows,
        });

        currentY =
          pdf.lastAutoTable.finalY + 10;
      }

      // ========================================================
      // IMPORTANT NOTICE
      // ========================================================

      if (
        currentY >
        pageHeight - 45
      ) {
        pdf.addPage();

        currentY = 20;
      }

      pdf.setFont(
        "helvetica",
        "bold"
      );

      pdf.setFontSize(10);

      pdf.text(
        "Important Notice",
        margin,
        currentY
      );

      currentY += 6;

      pdf.setFont(
        "helvetica",
        "normal"
      );

      pdf.setFontSize(8);

      const disclaimer =
        "This report contains predictions generated by the PlantDx system. The results are intended for informational and research purposes only and should not be considered a substitute for professional plant disease diagnosis.";

      const disclaimerLines =
        pdf.splitTextToSize(
          disclaimer,
          pageWidth - margin * 2
        );

      pdf.text(
        disclaimerLines,
        margin,
        currentY
      );

      // ========================================================
      // FOOTER
      // ========================================================

      const totalPages =
        pdf.internal.getNumberOfPages();

      for (
        let page = 1;
        page <= totalPages;
        page++
      ) {
        pdf.setPage(page);

        pdf.setFont(
          "helvetica",
          "normal"
        );

        pdf.setFontSize(8);

        pdf.setTextColor(
          120,
          120,
          120
        );

        pdf.text(
          "PlantDx • Prediction Report",
          margin,
          pageHeight - 10
        );

        pdf.text(
          `Page ${page} of ${totalPages}`,
          pageWidth - margin,
          pageHeight - 10,
          {
            align: "right",
          }
        );
      }

      // ========================================================
      // DOWNLOAD
      // ========================================================

      const safeDiseaseName =
        diseaseType
          .replace(/\s+/g, "-")
          .replace(
            /[^a-zA-Z0-9-]/g,
            ""
          );

      const safeFilename =
        filename
          .replace(/\.[^/.]+$/, "")
          .replace(
            /[^a-zA-Z0-9-_]/g,
            "-"
          );

      const datePart =
        scan?.created_at
          ? new Date(
              scan.created_at
            )
              .toISOString()
              .split("T")[0]
          : "report";

      pdf.save(
        `LeafScan-AI-${safeDiseaseName}-${safeFilename}-${datePart}.pdf`
      );
    } catch (error) {
      console.error(
        "Failed to generate prediction report:",
        error
      );

      alert(
        "Unable to generate the prediction report. Please try again."
      );
    } finally {
      setGeneratingReport(null);
    }
  };

  return (
    <main className="min-h-screen bg-paper-1 sm:px-4 lg:px-8 xl:px-12 py-8 mt-15">
      <div className="mx-auto max-w-6xl">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <FadeIn>
          <div className="mb-8">
            <p className="flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wide text-muted font-secondary font-semibold">
              Account
            </p>

            <h1 className="mt-3 text-3xl sm:text-2xl font-primary font-bold text-primary">
              Your profile
            </h1>

            <p className="mt-2 text-sm sm:text-base text-secondary font-secondary">
              Manage your personal information and view your leaf classification prediction history.
            </p>
          </div>
        </FadeIn>

        {/* =====================================================
            TOP SECTION
        ====================================================== */}

        <FadeIn delay={0.1}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* ===================================================
                PROFILE CARD
            ==================================================== */}

            <section className="rounded-3xl border border-muted/20 bg-paper-2/20 sm:px-4 md:px-8 py-6 lg:p-12">
              <div className="flex flex-col items-center text-center">

                {/* Profile Avatar */}

                <div className="size-28 sm:size-32 rounded-full border-2 border-muted/30 bg-paper-1 flex items-center justify-center overflow-hidden">
                  {user?.profile_photo ? (
                    <img
                      src={user.profile_photo}
                      alt={
                        user?.name ||
                        "Profile"
                      }
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserRound className="size-14 sm:size-16 text-muted" />
                  )}
                </div>

                {/* Name */}

                <h2 className="mt-5 text-xl sm:text-2xl font-primary font-bold text-primary">
                  {user?.name ||
                    user?.full_name ||
                    "User"}
                </h2>

                {/* Role */}

                <p className="mt-1 text-sm text-secondary font-secondary">
                  PlantDx User
                </p>
              </div>

              {/* Last Scan */}

              <div className="mt-6 pt-6 border-t border-muted/15">
                <p className="text-xs uppercase tracking-wide text-secondary font-secondary">
                  Last scan
                </p>

                <div className="mt-2 flex items-center gap-2 text-primary font-primary">
                  <ScanLine className="size-4 text-muted" />

                  {predictionHistory?.length >
                    0 &&
                  predictionHistory[0]
                    ?.created_at
                    ? new Date(
                        predictionHistory[0]
                          .created_at
                      ).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }
                      )
                    : "No scans yet"}
                </div>
              </div>

              {/* Sign Out */}

              <button
                onClick={handleSignOut}
                type="button"
                className="mt-6 w-full bg-red-400 border border-red-400 px-4 py-2.5 rounded-xl cursor-pointer font-primary font-medium text-white hover:bg-red-500 transition-all duration-400 ease-out hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted/50"
              >
                Sign Out
              </button>
            </section>

            {/* ===================================================
                PERSONAL INFORMATION
            ==================================================== */}

            <section className="rounded-3xl border border-muted/20 bg-paper-2/20 sm:px-4 md:px-8 py-6 lg:p-12 lg:col-span-2">

              {/* Section Header */}

              <div>
                <h2 className="text-xl sm:text-2xl font-primary font-semibold text-primary">
                  Personal information
                </h2>

                <p className="mt-1 text-sm text-secondary font-secondary">
                  Manage your account details and view your leaf classification activity.
                </p>
              </div>

              {/* INFORMATION CARDS */}

              <div className="mt-7 grid sm:grid-cols-1 md:grid-cols-2 gap-4">

                {/* FULL NAME */}

                <div className="rounded-2xl border border-muted/15 bg-paper-1/40 p-5">
                  <div className="flex items-center gap-4">
                    <div className="size-11 rounded-xl bg-muted/10 flex items-center justify-center shrink-0">
                      <UserRound className="size-5 text-muted" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-secondary font-secondary">
                        Full name
                      </p>

                      <p className="mt-1 text-sm sm:text-base font-semibold text-primary font-primary truncate">
                        {user?.name ||
                          user?.full_name ||
                          "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* EMAIL */}

                <div className="rounded-2xl border border-muted/15 bg-paper-1/40 p-5">
                  <div className="flex items-center gap-4">
                    <div className="size-11 rounded-xl bg-muted/10 flex items-center justify-center shrink-0">
                      <Mail className="size-5 text-muted" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-secondary font-secondary">
                        Email address
                      </p>

                      <p className="mt-1 text-sm sm:text-base font-semibold text-primary font-primary truncate">
                        {user?.email ||
                          "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* TOTAL SCANS */}

                <div className="rounded-2xl border border-muted/15 bg-paper-1/40 p-5">
                  <div className="flex items-center gap-4">
                    <div className="size-11 rounded-xl bg-muted/10 flex items-center justify-center shrink-0">
                      <ScanLine className="size-5 text-muted" />
                    </div>

                    <div>
                      <p className="text-xs text-secondary font-secondary">
                        Total scans
                      </p>

                      <p className="mt-1 text-xl font-bold text-primary font-primary">
                        {predictionHistory.length}
                      </p>
                    </div>
                  </div>
                </div>

                {/* IMAGES ANALYZED */}

                <div className="rounded-2xl border border-muted/15 bg-paper-1/40 p-5">
                  <div className="flex items-center gap-4">
                    <div className="size-11 rounded-xl bg-muted/10 flex items-center justify-center shrink-0">
                      <Brain className="size-5 text-muted" />
                    </div>

                    <div>
                      <p className="text-xs text-secondary font-secondary">
                        Images analyzed
                      </p>

                      <p className="mt-1 text-xl font-bold text-primary font-primary">
                        {totalImagesAnalyzed}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACCOUNT SECURITY */}

              <div className="mt-8 pt-6 border-t border-muted/15">
                <h3 className="text-base sm:text-lg font-primary font-semibold text-primary">
                  Account security
                </h3>

                <p className="mt-1 text-sm text-secondary font-secondary">
                  Manage your profile and account security settings.
                </p>

                {/* Security Buttons */}

                <div className="mt-5 flex flex-col sm:flex-row gap-3 items-center justify-center">

                  {/* Edit Profile */}

                  <NavLink
                    to="/edit-profile"
                    className={`font-medium bg-muted ${
                      theme === "light"
                        ? "text-white"
                        : "text-paper-1"
                    } flex lg:gap-2 items-center lg:px-4 lg:py-2 lg:text-lg rounded-md cursor-pointer ring-2 ring-muted sm:text-sm sm:px-2 sm:py-2 sm:gap-1 font-primary transition-all duration-400 ease-out hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted/50`}
                  >
                    <Pencil className="sm:size-4" />
                    <h3>
                      Edit Profile
                    </h3>
                  </NavLink>

                  {/* Reset Password */}

                  <NavLink
                    to="/forgot-password"
                    className={`font-medium text-muted flex lg:gap-2 transition-all duration-400 ease-out hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted/50 items-center lg:px-4 lg:py-2 lg:text-lg rounded-md ring-2 hover:bg-muted ${
                      theme === "light"
                        ? "hover:text-white"
                        : "hover:text-paper-1"
                    } hover:ring-2 hover:ring-muted bg-muted/10 ring-muted/40 cursor-pointer sm:text-sm sm:px-2 sm:py-2 sm:gap-1 font-primary`}
                  >
                    <KeyRound className="sm:size-4" />
                    Reset Password
                  </NavLink>
                </div>
              </div>
            </section>
          </div>
        </FadeIn>

        {/* =====================================================
            PREDICTION HISTORY
        ====================================================== */}

        <FadeIn delay={0.2}>
          <section className="mt-5 rounded-3xl border border-muted/20 bg-paper-2/20 sm:px-4 md:px-8 py-6 lg:p-12">

            {/* Header */}

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Brain className="size-4 sm:size-5 lg:size-6 text-muted shrink-0" />

                <h2 className="text-lg lg:text-2xl font-primary font-semibold text-primary">
                  Prediction history
                </h2>
              </div>

              <p className="mt-1 text-xs sm:text-sm lg:text-base text-secondary font-secondary">
                Review your previous leaf classification predictions and confidence scores.
              </p>
            </div>

            {/* Loading */}

            {isLoading && (
              <div className="mt-6 rounded-2xl border border-muted/15 bg-paper-1/50 p-8 text-center">
                <p className="text-sm text-secondary font-secondary">
                  Loading prediction history...
                </p>
              </div>
            )}

            {/* Error */}

            {isError && (
              <div className="mt-6 rounded-2xl border border-muted/15 bg-paper-1/50 p-8 text-center">
                <p className="text-sm text-secondary font-secondary">
                  Failed to load prediction history.
                </p>
              </div>
            )}

            {/* Empty */}

            {!isLoading &&
              !isError &&
              predictionHistory.length ===
                0 && (
                <div className="mt-6 rounded-2xl border border-muted/15 bg-paper-1/50 p-8 text-center">
                  <ScanLine className="mx-auto size-10 text-muted" />

                  <p className="mt-3 text-base font-semibold text-primary font-primary">
                    No predictions yet
                  </p>

                  <p className="mt-1 text-sm text-secondary font-secondary">
                    Your leaf classification predictions will appear here.
                  </p>
                </div>
              )}

            {/* Results */}

            {!isLoading &&
              !isError &&
              predictionHistory.length > 0 && (
                <section className="mt-5 grid gap-6">
                  {predictionHistory.map(
                    (
                      scan,
                      scanIndex
                    ) => {
                      const images =
                        Array.isArray(
                          scan?.images
                        )
                          ? scan.images
                          : [];

                      const totalImages =
                        scan?.total_images ??
                        images.length;

                      const diseaseType =
                        String(
                          scan?.disease_type ||
                            "Leaf Scan"
                        ).replaceAll(
                          "_",
                          " "
                        );

                      return (
                        <article
                          key={
                            scan?.id ||
                            `scan-${scanIndex}`
                          }
                          className="bg-paper-2 border border-muted/20 rounded-2xl overflow-hidden shadow-sm"
                        >
                          {/* SCAN HEADER */}

                          <div className="px-5 py-5 md:px-7 md:py-6 border-b border-muted/20">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                              <div>
                                <p className="text-secondary font-secondary text-xs uppercase tracking-wider mb-1">
                                  Scan
                                </p>

                                <h2 className="text-primary text-xl md:text-2xl font-semibold capitalize">
                                  {diseaseType}
                                </h2>

                                <p className="mt-1 text-sm text-secondary font-secondary">
                                  {totalImages}{" "}
                                  {totalImages ===
                                  1
                                    ? "image"
                                    : "images"}{" "}
                                  analyzed
                                </p>

                                {scan?.model && (
                                  <p className="mt-2 text-xs sm:text-sm text-secondary font-secondary">
                                    Model:{" "}
                                    <span className="text-primary font-semibold">
                                      {scan.model}
                                    </span>
                                  </p>
                                )}
                              </div>

                              <div className="text-left sm:text-right">
                                <p className="text-secondary font-secondary text-xs uppercase tracking-wider mb-1">
                                  Prediction date
                                </p>

                                <p className="text-primary font-secondary text-sm sm:text-base">
                                  {scan?.created_at
                                    ? new Date(
                                        scan.created_at
                                      ).toLocaleDateString(
                                        "en-US",
                                        {
                                          month:
                                            "long",
                                          day:
                                            "numeric",
                                          year:
                                            "numeric",
                                        }
                                      )
                                    : "N/A"}
                                </p>

                                <p className="mt-1 text-secondary font-secondary text-xs sm:text-sm">
                                  {scan?.created_at
                                    ? new Date(
                                        scan.created_at
                                      ).toLocaleTimeString(
                                        "en-US",
                                        {
                                          hour:
                                            "2-digit",
                                          minute:
                                            "2-digit",
                                          hour12:
                                            true,
                                        }
                                      )
                                    : ""}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* IMAGES */}

                          <div className="p-5 md:p-7 grid gap-6">
                            {images.map(
                              (
                                image,
                                imageIndex
                              ) => {
                                const prediction =
                                  image?.prediction ||
                                  {};

                                const classConfidence =
                                  prediction?.class_confidence ||
                                  {};

                                const imageUrl =
                                  image?.image
                                    ?.url ||
                                  "";

                                const filename =
                                  image?.filename ||
                                  `Image ${
                                    imageIndex +
                                    1
                                  }`;

                                const predictedClass =
                                  String(
                                    prediction?.predicted_class ||
                                      "Unknown"
                                  ).replaceAll(
                                    "_",
                                    " "
                                  );

                                const confidence =
                                  Number(
                                    prediction?.confidence ??
                                      0
                                  );

                                const reportId =
                                  `${scan?.id || "scan"}-${
                                    image?.image
                                      ?.public_id ||
                                    imageIndex
                                  }`;

                                return (
                                  <div
                                    key={
                                      image
                                        ?.image
                                        ?.public_id ||
                                      `${scan?.id}-image-${imageIndex}`
                                    }
                                    className="rounded-2xl border border-muted/15 bg-paper-1/40 overflow-hidden"
                                  >
                                    {/* IMAGE + MAIN RESULT */}

                                    <div className="grid lg:grid-cols-[42%_58%]">

                                      {/* Image */}

                                      <div className="h-[260px] sm:h-[300px] lg:h-[330px] bg-black/5 flex items-center justify-center p-3">
                                        {imageUrl ? (
                                          <img
                                            src={
                                              imageUrl
                                            }
                                            alt={
                                              filename
                                            }
                                            className="w-full h-full object-contain rounded-lg"
                                            loading="lazy"
                                          />
                                        ) : (
                                          <div className="text-secondary text-sm text-center">
                                            Image unavailable
                                          </div>
                                        )}
                                      </div>

                                      {/* Main Result */}

                                      <div className="p-5 md:p-7 flex flex-col justify-center gap-5">

                                        {/* Filename */}

                                        <div>
                                          <p className="text-secondary font-secondary text-xs uppercase tracking-wider mb-1">
                                            Image
                                          </p>

                                          <p className="text-primary font-secondary text-base break-all">
                                            {filename}
                                          </p>
                                        </div>

                                        {/* Prediction */}

                                        <div>
                                          <p className="text-secondary font-secondary text-xs uppercase tracking-wider mb-1">
                                            Predicted Class
                                          </p>

                                          <h2 className="text-primary text-2xl md:text-3xl font-semibold capitalize">
                                            {
                                              predictedClass
                                            }
                                          </h2>
                                        </div>

                                        {/* Confidence */}

                                        <div className="flex items-center gap-3">
                                          <Activity
                                            size={27}
                                            className="text-muted shrink-0"
                                          />

                                          <div>
                                            <p className="text-secondary text-xs font-secondary">
                                              Prediction Confidence
                                            </p>

                                            <p className="text-primary text-2xl font-semibold">
                                              {confidence.toFixed(
                                                2
                                              )}
                                              %
                                            </p>
                                          </div>
                                        </div>

                                        {/* Model */}

                                        <div>
                                          <p className="text-secondary font-secondary text-xs uppercase tracking-wider mb-1">
                                            Detection Model
                                          </p>

                                          <p className="text-primary font-secondary text-sm sm:text-base break-words">
                                            {scan?.model ||
                                              "N/A"}
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* CLASS CONFIDENCE */}

                                    {Object.keys(
                                      classConfidence
                                    ).length >
                                      0 && (
                                      <div className="px-5 py-5 md:px-7 md:py-6 border-t border-muted/20">
                                        <h3 className="text-primary text-lg font-semibold mb-5">
                                          Class Confidence Scores
                                        </h3>

                                        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
                                          {Object.entries(
                                            classConfidence
                                          ).map(
                                            ([
                                              className,
                                              classValue,
                                            ]) => {
                                              const numericConfidence =
                                                Number(
                                                  classValue ??
                                                    0
                                                );

                                              const progress =
                                                Math.min(
                                                  Math.max(
                                                    numericConfidence,
                                                    0
                                                  ),
                                                  100
                                                );

                                              return (
                                                <div
                                                  key={
                                                    className
                                                  }
                                                >
                                                  <div className="flex justify-between items-center mb-1.5">
                                                    <span className="text-primary font-medium font-secondary text-sm capitalize">
                                                      {String(
                                                        className
                                                      ).replaceAll(
                                                        "_",
                                                        " "
                                                      )}
                                                    </span>

                                                    <span className="text-secondary font-secondary text-sm">
                                                      {numericConfidence.toFixed(
                                                        2
                                                      )}
                                                      %
                                                    </span>
                                                  </div>

                                                  <div className="w-full h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                                    <div
                                                      className="h-full bg-muted rounded-full transition-all duration-500"
                                                      style={{
                                                        width: `${progress}%`,
                                                      }}
                                                    />
                                                  </div>
                                                </div>
                                              );
                                            }
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* IMAGE INFORMATION */}

                                    <div className="px-5 pb-5 md:px-7 md:pb-6">
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">

                                        {/* Scan ID */}

                                        <div className="rounded-xl bg-paper-2/30 px-3 py-2.5 sm:p-3 lg:p-3.5 border border-muted/10">
                                          <p className="text-[9px] sm:text-[10px] lg:text-xs text-secondary font-secondary">
                                            Scan ID
                                          </p>

                                          <p className="mt-0.5 text-[11px] sm:text-xs lg:text-sm font-semibold text-primary font-primary break-all">
                                            {scan?.id ||
                                              "N/A"}
                                          </p>
                                        </div>

                                        {/* Detection Model */}

                                        <div className="rounded-xl bg-paper-2/30 px-3 py-2.5 sm:p-3 lg:p-3.5 border border-muted/10">
                                          <p className="text-[9px] sm:text-[10px] lg:text-xs text-secondary font-secondary">
                                            Detection model
                                          </p>

                                          <p className="mt-0.5 text-[11px] sm:text-xs lg:text-sm font-semibold text-primary font-primary break-words">
                                            {scan?.model ||
                                              "N/A"}
                                          </p>
                                        </div>

                                        {/* Disease Type */}

                                        <div className="rounded-xl bg-paper-2/30 px-3 py-2.5 sm:p-3 lg:p-3.5 border border-muted/10">
                                          <p className="text-[9px] sm:text-[10px] lg:text-xs text-secondary font-secondary">
                                            Detection type
                                          </p>

                                          <p className="mt-0.5 text-[11px] sm:text-xs lg:text-sm font-semibold text-primary font-primary capitalize">
                                            {String(
                                              scan?.disease_type ||
                                                "N/A"
                                            ).replaceAll(
                                              "_",
                                              " "
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* INDIVIDUAL IMAGE REPORT BUTTON */}

                                    <div className="px-5 pb-5 md:px-7 md:pb-6">
                                      <button
                                        type="button"
                                        disabled={
                                          generatingReport ===
                                          reportId
                                        }
                                        onClick={() =>
                                          generatePredictionReport(
                                            scan,
                                            image,
                                            imageIndex
                                          )
                                        }
                                        className={`w-full h-9 sm:h-10 lg:h-11 rounded-xl border border-muted/25 bg-muted/5 text-muted flex items-center justify-center gap-2 font-primary text-[11px] sm:text-xs lg:text-sm font-semibold transition-all duration-300 hover:bg-muted disabled:opacity-60 disabled:cursor-not-allowed ${
                                          theme ===
                                          "light"
                                            ? "hover:text-white"
                                            : "hover:text-paper-1"
                                        }`}
                                      >
                                        {generatingReport ===
                                        reportId ? (
                                          <>
                                            <LoaderCircle className="size-3.5 sm:size-4 lg:size-4.5 animate-spin" />
                                            Generating Report...
                                          </>
                                        ) : (
                                          <>
                                            <FileDown className="size-3.5 sm:size-4 lg:size-4.5" />
                                            Download This Image Report
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </article>
                      );
                    }
                  )}
                </section>
              )}
          </section>
        </FadeIn>
      </div>
    </main>
  );
}