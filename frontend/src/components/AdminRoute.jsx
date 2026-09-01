import React from "react";
import { useSelector } from "react-redux";
import PageNotFound from "./PageNotFound";

export default function AdminRoute({ children }) {
  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const isAdmin =
    isAuthenticated &&
    user?.email?.toLowerCase() ===
      "devanmolsinghchehal@gmail.com";

  if (!isAdmin) {
    return <PageNotFound />;
  }

  return children;
}