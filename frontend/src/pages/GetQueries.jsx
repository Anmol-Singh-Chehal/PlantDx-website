import React, { useMemo, useState } from "react";
import {
  Search,
  MessageSquareText,
  Clock3,
  CheckCircle2,
  Inbox,
  Mail,
  User,
  CalendarDays,
  ChevronDown,
  X,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useGetQueriesQuery } from "@/services/api.js";

export default function GetQueries() {
  const { theme } = useTheme();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetQueriesQuery();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedQuery, setSelectedQuery] = useState(null);

  const queries = data?.queries || [];

  const filteredQueries = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return queries.filter((query) => {
      const matchesStatus =
        statusFilter === "all" ||
        query.status?.toLowerCase() === statusFilter.toLowerCase();

      if (!matchesStatus) return false;

      if (!searchValue) return true;

      return (
        query.name?.toLowerCase().includes(searchValue) ||
        query.email?.toLowerCase().includes(searchValue) ||
        query.subject?.toLowerCase().includes(searchValue) ||
        query.message?.toLowerCase().includes(searchValue)
      );
    });
  }, [queries, search, statusFilter]);

  const pendingCount = queries.filter(
    (query) => query.status?.toLowerCase() === "pending"
  ).length;

  const resolvedCount = queries.filter(
    (query) => query.status?.toLowerCase() === "resolved"
  ).length;

  const formatDate = (date) => {
    if (!date) return "Unknown date";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Unknown date";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return {
          wrapper:
            "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
          dot: "bg-emerald-500",
        };

      case "pending":
      default:
        return {
          wrapper: "bg-amber-500/10 border-amber-500/20 text-amber-500",
          dot: "bg-amber-500",
        };
    }
  };

  return (
    <main
      className="
        min-h-screen
        bg-paper-1
        px-3
        pt-20
        pb-10
        sm:px-5
        sm:pt-22.5
        sm:pb-12
        md:px-8
        lg:px-12
        lg:pt-25
        lg:pb-16
      "
    >
      <div className="mx-auto max-w-7xl">
        {/* ============================================================
            HEADER
        ============================================================ */}
        <motion.section
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="mb-8"
        >
          <div className="flex flex-col gap-3">
            <div
              className="
                inline-flex
                w-fit
                items-center
                gap-2
                rounded-full
                border
                border-muted/15
                bg-muted/5
                px-3
                py-1.5
                font-secondary
                text-xs
                font-medium
                text-secondary
              "
            >
              <MessageSquareText className="size-3.5" />
              CONTACT MANAGEMENT
            </div>

            <h1
              className="
                font-primary
                text-3xl
                font-semibold
                tracking-tight
                text-primary
                sm:text-4xl
                lg:text-5xl
              "
            >
              Contact Us Queries
            </h1>

            <p
              className="
                max-w-2xl
                font-secondary
                text-sm
                leading-relaxed
                text-secondary
                sm:text-base
              "
            >
              View and manage all messages submitted through the Contact Us
              form.
            </p>
          </div>
        </motion.section>

        {/* ============================================================
            STAT CARDS
        ============================================================ */}
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={<Inbox className="size-5" />}
            label="Total Queries"
            value={queries.length}
          />

          <StatCard
            icon={<Clock3 className="size-5" />}
            label="Pending"
            value={pendingCount}
          />

          <StatCard
            icon={<CheckCircle2 className="size-5" />}
            label="Resolved"
            value={resolvedCount}
          />
        </section>

        {/* ============================================================
            SEARCH + FILTER
        ============================================================ */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.1,
          }}
          className="
            mb-6
            rounded-2xl
            border
            border-muted/20
            bg-paper-1
            p-4
            shadow-[0_8px_30px_color-mix(in_srgb,var(--color-muted)_5%,transparent)]
            sm:p-5
          "
        >
          <div className="flex flex-col gap-3 md:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                className="
                  pointer-events-none
                  absolute
                  left-3.5
                  top-1/2
                  size-4
                  -translate-y-1/2
                  text-secondary/60
                "
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, subject or message..."
                className="
                  w-full
                  rounded-xl
                  border
                  border-muted/20
                  bg-muted/5
                  py-3
                  pl-10
                  pr-4
                  font-secondary
                  text-sm
                  text-primary
                  outline-none
                  transition
                  placeholder:text-secondary/50
                  focus:border-muted/40
                  focus:bg-muted/10
                "
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-secondary/60
                    transition
                    hover:text-primary
                  "
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            {/* Status filter */}
            <div className="w-full md:w-48">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger
                  className="
                    flex
                    h-full
                    w-full
                    rounded-xl
                    border-muted/20
                    bg-muted/5
                    px-4
                    font-secondary
                    text-sm
                    text-primary
                    shadow-none
                    transition
                    hover:bg-muted/10
                    focus:border-muted/40
                    focus:ring-0
                    focus:ring-offset-0
                    
                  "
                >
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>

                <SelectContent
                  className="
                    rounded-xl
                    border-muted/20
                    bg-paper-1
                    font-secondary
                  "
                >
                  <SelectItem
                    value="all"
                    className="
                      cursor-pointer
                      rounded-lg
                      text-sm
                      text-primary
                    "
                  >
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-muted" />
                      All queries
                    </div>
                  </SelectItem>

                  <SelectItem
                    value="pending"
                    className="
                      cursor-pointer
                      rounded-lg
                      text-sm
                      text-primary
                    "
                  >
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-amber-500" />
                      Pending
                    </div>
                  </SelectItem>

                  <SelectItem
                    value="resolved"
                    className="
                      cursor-pointer
                      rounded-lg
                      text-sm
                      text-primary
                    "
                  >
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-emerald-500" />
                      Resolved
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Refresh */}
            <button
              type="button"
              onClick={refetch}
              disabled={isLoading}
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-muted/20
                bg-muted/5
                px-4
                py-3
                font-secondary
                text-sm
                font-medium
                text-primary
                transition
                hover:bg-muted/10
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <RefreshCw
                className={`size-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          <div className="mt-3 font-secondary text-xs text-secondary/70">
            Showing {filteredQueries.length} of {queries.length} queries
          </div>
        </motion.section>

        {/* ============================================================
            LOADING
        ============================================================ */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="
                  animate-pulse
                  rounded-2xl
                  border
                  border-muted/10
                  bg-muted/5
                  p-5
                "
              >
                <div className="mb-4 h-4 w-32 rounded bg-muted/15" />
                <div className="mb-2 h-5 w-2/3 rounded bg-muted/15" />
                <div className="h-4 w-full rounded bg-muted/10" />
              </div>
            ))}
          </div>
        )}

        {/* ============================================================
            ERROR
        ============================================================ */}
        {isError && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="
              rounded-2xl
              border
              border-red-500/20
              bg-red-500/5
              p-6
              text-center
            "
          >
            <div
              className="
                mx-auto
                mb-3
                flex
                size-11
                items-center
                justify-center
                rounded-xl
                bg-red-500/10
                text-red-500
              "
            >
              <AlertCircle className="size-5" />
            </div>

            <h3 className="font-primary text-base font-semibold text-primary">
              Failed to load queries
            </h3>

            <p className="mt-1 font-secondary text-sm text-secondary">
              {error?.data?.detail ||
                error?.data?.message ||
                "Something went wrong while loading contact queries."}
            </p>

            <button
              type="button"
              onClick={refetch}
              className="
                mt-4
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-muted
                px-4
                py-2.5
                font-primary
                text-sm
                font-semibold
                text-paper-1
              "
            >
              <RefreshCw className="size-4" />
              Try Again
            </button>
          </motion.div>
        )}

        {/* ============================================================
            EMPTY
        ============================================================ */}
        {!isLoading &&
          !isError &&
          filteredQueries.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="
                rounded-2xl
                border
                border-muted/20
                bg-paper-1
                px-6
                py-16
                text-center
              "
            >
              <div
                className="
                  mx-auto
                  mb-4
                  flex
                  size-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-muted/10
                  text-muted
                "
              >
                <MessageSquareText className="size-6" />
              </div>

              <h3 className="font-primary text-lg font-semibold text-primary">
                {queries.length === 0
                  ? "No queries yet"
                  : "No matching queries"}
              </h3>

              <p className="mx-auto mt-2 max-w-md font-secondary text-sm text-secondary">
                {queries.length === 0
                  ? "Contact Us submissions will appear here once users send a message."
                  : "Try changing your search or status filter."}
              </p>
            </motion.div>
          )}

        {/* ============================================================
            QUERY LIST
        ============================================================ */}
        {!isLoading && !isError && filteredQueries.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-3"
          >
            {filteredQueries.map((query, index) => {
              const status = getStatusStyle(query.status);

              return (
                <motion.button
                  key={query.id || query._id}
                  type="button"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: Math.min(index * 0.04, 0.25),
                  }}
                  onClick={() => setSelectedQuery(query)}
                  className="
                    group
                    w-full
                    rounded-2xl
                    border
                    border-muted/20
                    bg-paper-1
                    p-4
                    text-left
                    transition-all
                    duration-300
                    hover:border-muted/35
                    hover:bg-muted/5
                    hover:shadow-[0_8px_30px_color-mix(in_srgb,var(--color-muted)_7%,transparent)]
                    sm:p-5
                  "
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                    {/* User */}
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <div
                        className="
                          flex
                          size-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-muted/10
                          text-muted
                        "
                      >
                        <User className="size-4" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3
                            className="
                              truncate
                              font-primary
                              text-sm
                              font-semibold
                              text-primary
                              sm:text-base
                            "
                          >
                            {query.name}
                          </h3>

                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-1.5
                              rounded-full
                              border
                              px-2
                              py-0.5
                              font-secondary
                              text-[10px]
                              font-medium
                              uppercase
                              tracking-wide
                              ${status.wrapper}
                            `}
                          >
                            <span
                              className={`size-1.5 rounded-full ${status.dot}`}
                            />
                            {query.status || "pending"}
                          </span>
                        </div>

                        <div className="mt-1 flex items-center gap-1.5">
                          <Mail className="size-3.5 shrink-0 text-secondary/60" />

                          <span
                            className="
                              truncate
                              font-secondary
                              text-xs
                              text-secondary
                              sm:text-sm
                            "
                          >
                            {query.email}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="min-w-0 lg:w-[38%]">
                      <p className="font-secondary text-[11px] uppercase tracking-wider text-secondary/60">
                        Subject
                      </p>

                      <p
                        className="
                          mt-1
                          truncate
                          font-primary
                          text-sm
                          font-medium
                          text-primary
                        "
                      >
                        {query.subject}
                      </p>

                      <p
                        className="
                          mt-1
                          line-clamp-1
                          font-secondary
                          text-xs
                          text-secondary
                        "
                      >
                        {query.message}
                      </p>
                    </div>

                    {/* Date */}
                    <div
                      className="
                        flex
                        shrink-0
                        items-center
                        gap-2
                        lg:w-44
                        lg:justify-end
                      "
                    >
                      <CalendarDays className="size-4 text-secondary/60" />

                      <span className="font-secondary text-xs text-secondary">
                        {formatDate(query.created_at)}
                      </span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.section>
        )}

        {/* ============================================================
            QUERY DETAILS MODAL
        ============================================================ */}
        <AnimatePresence>
          {selectedQuery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/50
                px-4
                backdrop-blur-sm
              "
              onClick={() => setSelectedQuery(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 15 }}
                transition={{ duration: 0.25 }}
                onClick={(e) => e.stopPropagation()}
                className="
                  max-h-[85vh]
                  w-full
                  max-w-2xl
                  overflow-y-auto
                  rounded-2xl
                  border
                  border-muted/20
                  bg-paper-1
                  shadow-2xl
                "
              >
                {/* Modal header */}
                <div
                  className="
                    flex
                    items-start
                    justify-between
                    gap-4
                    border-b
                    border-muted/15
                    p-5
                    sm:p-6
                  "
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div
                        className="
                          flex
                          size-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-muted/10
                          text-muted
                        "
                      >
                        <MessageSquareText className="size-4" />
                      </div>

                      <h2
                        className="
                          font-primary
                          text-lg
                          font-semibold
                          text-primary
                        "
                      >
                        Query Details
                      </h2>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedQuery(null)}
                    className="
                      flex
                      size-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      text-secondary
                      transition
                      hover:bg-muted/10
                      hover:text-primary
                    "
                  >
                    <X className="size-5" />
                  </button>
                </div>

                {/* Modal content */}
                <div className="space-y-5 p-5 sm:p-6">
                  {/* Name + email */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <DetailItem
                      icon={<User className="size-4" />}
                      label="Name"
                      value={selectedQuery.name}
                    />

                    <DetailItem
                      icon={<Mail className="size-4" />}
                      label="Email"
                      value={selectedQuery.email}
                    />
                  </div>

                  {/* Subject */}
                  <DetailItem
                    icon={<MessageSquareText className="size-4" />}
                    label="Subject"
                    value={selectedQuery.subject}
                  />

                  {/* Date */}
                  <DetailItem
                    icon={<CalendarDays className="size-4" />}
                    label="Submitted"
                    value={formatDate(selectedQuery.created_at)}
                  />

                  {/* Status */}
                  <div>
                    <p
                      className="
                        mb-2
                        font-secondary
                        text-xs
                        font-medium
                        text-secondary
                      "
                    >
                      Status
                    </p>

                    <span
                      className={`
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        border
                        px-3
                        py-1.5
                        font-secondary
                        text-xs
                        font-medium
                        capitalize
                        ${getStatusStyle(selectedQuery.status).wrapper}
                      `}
                    >
                      <span
                        className={`
                          size-1.5
                          rounded-full
                          ${getStatusStyle(selectedQuery.status).dot}
                        `}
                      />

                      {selectedQuery.status || "pending"}
                    </span>
                  </div>

                  {/* Message */}
                  <div>
                    <p
                      className="
                        mb-2
                        font-secondary
                        text-xs
                        font-medium
                        text-secondary
                      "
                    >
                      Message
                    </p>

                    <div
                      className="
                        rounded-xl
                        border
                        border-muted/15
                        bg-muted/5
                        p-4
                        font-secondary
                        text-sm
                        leading-7
                        text-primary
                      "
                    >
                      {selectedQuery.message}
                    </div>
                  </div>

                  {/* Query ID */}
                  {(selectedQuery.id || selectedQuery._id) && (
                    <div>
                      <p
                        className="
                          mb-1
                          font-secondary
                          text-[11px]
                          uppercase
                          tracking-wider
                          text-secondary/60
                        "
                      >
                        Query ID
                      </p>

                      <p
                        className="
                          break-all
                          font-mono
                          text-xs
                          text-secondary
                        "
                      >
                        {selectedQuery.id || selectedQuery._id}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

/* ================================================================
   STAT CARD
================================================================ */

function StatCard({ icon, label, value }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="
        rounded-2xl
        border
        border-muted/20
        bg-paper-1
        p-5
        shadow-[0_8px_30px_color-mix(in_srgb,var(--color-muted)_5%,transparent)]
      "
    >
      <div className="flex items-center justify-between">
        <div
          className="
            flex
            size-10
            items-center
            justify-center
            rounded-xl
            bg-muted/10
            text-muted
          "
        >
          {icon}
        </div>

        <span className="font-primary text-2xl font-semibold text-primary">
          {value}
        </span>
      </div>

      <p className="mt-4 font-secondary text-xs text-secondary">
        {label}
      </p>
    </motion.div>
  );
}

/* ================================================================
   DETAIL ITEM
================================================================ */

function DetailItem({ icon, label, value }) {
  return (
    <div>
      <p
        className="
          mb-2
          flex
          items-center
          gap-1.5
          font-secondary
          text-xs
          font-medium
          text-secondary
        "
      >
        {icon}
        {label}
      </p>

      <p
        className="
          break-words
          rounded-xl
          border
          border-muted/15
          bg-muted/5
          px-4
          py-3
          font-secondary
          text-sm
          text-primary
        "
      >
        {value || "—"}
      </p>
    </div>
  );
}