"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { getCourseThumbnail } from "@/core/utils/imageHelper";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/core/store/useCartStore";
import { getCourseBySlug } from "@/actions/courseActions";
import { useTransactionHistoryViewModel } from "@/core/ViewModels/TransactionHistoryViewModel";
import { OrderEntity } from "@/core/Entities/Order";

interface Props {
  initialOrders: OrderEntity[];
  user: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  };
}

export default function TransactionHistoryClient({ initialOrders, user }: Props) {
  const {
    orders,
    isLoading,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    selectedInvoice,
    setSelectedInvoice,
    stats,
    filteredOrders,
    isCoursePaid
  } = useTransactionHistoryViewModel(initialOrders);

  const { addItem, clearCart } = useCartStore();
  const router = useRouter();

  const handleReorder = async (courseSlug?: string) => {
    if (!courseSlug) {
      toast.error("Data kursus tidak valid");
      return;
    }
    
    toast.loading("Mempersiapkan pesanan...", { id: "reorder" });
    try {
      const course = await getCourseBySlug(courseSlug);
      if (course) {
        clearCart();
        addItem({
          id: course.id,
          title: course.title,
          thumbnail: getCourseThumbnail(course.thumbnail),
          instructor_name: course.instructor_name || "Instruktur",
          price: Number(course.price),
          price_formatted: `Rp ${Number(course.price).toLocaleString("id-ID")}`
        });
        toast.success("Mengarahkan ke checkout...", { id: "reorder" });
        router.push("/cart");
      } else {
        toast.error("Kursus tidak ditemukan atau tidak tersedia lagi.", { id: "reorder" });
      }
    } catch (e) {
      toast.error("Terjadi kesalahan saat memuat data kursus.", { id: "reorder" });
    }
  };

  const formatRupiah = (val: string | number) => {
    const num = typeof val === "string" ? parseFloat(val) : val;
    if (isNaN(num)) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    try {
      const safeDateStr = dateStr.includes("Z") ? dateStr : dateStr.replace(" ", "T") + "Z";
      const d = new Date(safeDateStr);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB";
    } catch {
      return dateStr;
    }
  };

  const handleCopyCode = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      toast.success("Kode pesanan berhasil disalin!");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="transaction-history-page">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Inline styles for custom elements and print formatting */}
      <style>{`
        .skeleton-shimmer {
          background: #f6f7f8;
          background-image: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
          background-repeat: no-repeat;
          background-size: 800px 100%;
          animation: shimmer 1.5s infinite linear;
        }
        @keyframes shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }

        .trans-badge-paid {
          background-color: #ecfdf5;
          color: #059669;
          border: 1px solid #a7f3d0;
        }
        .trans-badge-pending {
          background-color: #fffbeb;
          color: #d97706;
          border: 1px solid #fde68a;
        }
        .trans-badge-failed {
          background-color: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }
        .trans-badge-cancelled {
          background-color: #f8fafc;
          color: #64748b;
          border: 1px solid #e2e8f0;
        }
        .trans-badge-expired {
          background-color: #f1f5f9;
          color: #64748b;
          border: 1px solid #cbd5e1;
        }
        .card-order {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          transition: all 0.2s ease;
        }
        .card-order:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05);
        }
        .filter-btn-pill {
          padding: 8px 18px;
          border-radius: 99px;
          font-size: 0.85rem;
          font-weight: 600;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #475569;
          transition: all 0.2s ease;
        }
        .filter-btn-pill.active {
          background: #4f46e5;
          color: #ffffff;
          border-color: #4f46e5;
          box-shadow: 0 2px 8px rgba(79, 70, 229, 0.25);
        }
        .btn-pill-indigo {
          padding: 8px 20px;
          border-radius: 99px;
          font-size: 0.85rem;
          font-weight: 600;
          background: #4f46e5;
          color: #ffffff;
          border: none;
          transition: all 0.2s;
        }
        .btn-pill-indigo:hover {
          background: #4338ca;
          color: #ffffff;
          transform: translateY(-1px);
        }
        .btn-pill-outline {
          padding: 8px 18px;
          border-radius: 99px;
          font-size: 0.85rem;
          font-weight: 600;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          color: #334155;
          transition: all 0.2s;
        }
        .btn-pill-outline:hover {
          background: #f8fafc;
          border-color: #94a3b8;
          color: #0f172a;
        }

        /* Printable Invoice Styles */
        @media print {
          body * {
            visibility: hidden;
          }
          .invoice-modal-content, .invoice-modal-content * {
            visibility: visible;
          }
          .invoice-modal-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* === HEADER & BREADCRUMB === */}
      <div className="mb-4">
        <div className="d-flex align-items-center gap-2 text-muted mb-1" style={{ fontSize: "0.85rem" }}>
          <Link href="/beranda" className="text-decoration-none text-muted">
            <i className="fas fa-home me-1"></i> Dashboard
          </Link>
          <span>/</span>
          <span className="text-dark fw-medium">Riwayat Transaksi</span>
        </div>
        <div className="d-flex flex-column flex-md-row md-align-items-center justify-content-between gap-3">
          <div>
            <h1 className="fw-bold mb-1" style={{ fontSize: "1.65rem", color: "#0f172a" }}>
              Riwayat Pembelian & Tagihan
            </h1>
            <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
              Pantau seluruh status pesanan kursus Anda dan unduh bukti invoice pembayaran resmi.
            </p>
          </div>
          <Link href="/kursus" className="btn btn-pill-outline d-inline-flex align-items-center gap-2 align-self-start">
            <i className="fas fa-compass" style={{ color: "#4f46e5" }}></i>
            Jelajahi Kursus Lainnya
          </Link>
        </div>
      </div>

      {/* === STATS WIDGETS === */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="p-3 bg-white rounded-3 border" style={{ borderColor: "#e2e8f0" }}>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted" style={{ fontSize: "0.8rem", fontWeight: "600" }}>TOTAL TRANSAKSI</span>
              <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "32px", height: "32px", background: "#f1f5f9", color: "#475569" }}>
                <i className="fas fa-receipt" style={{ fontSize: "0.85rem" }}></i>
              </div>
            </div>
            <div className="fw-bold" style={{ fontSize: "1.45rem", color: "#0f172a" }}>{stats.total}</div>
            <div className="text-muted" style={{ fontSize: "0.75rem" }}>Semua riwayat pembelian</div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="p-3 bg-white rounded-3 border" style={{ borderColor: "#e2e8f0" }}>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted" style={{ fontSize: "0.8rem", fontWeight: "600" }}>BERHASIL (LUNAS)</span>
              <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "32px", height: "32px", background: "#ecfdf5", color: "#059669" }}>
                <i className="fas fa-check-circle" style={{ fontSize: "0.85rem" }}></i>
              </div>
            </div>
            <div className="fw-bold text-success" style={{ fontSize: "1.45rem" }}>{stats.paid}</div>
            <div className="text-muted" style={{ fontSize: "0.75rem" }}>Kursus aktif dapat dipelajari</div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="p-3 bg-white rounded-3 border" style={{ borderColor: "#e2e8f0" }}>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted" style={{ fontSize: "0.8rem", fontWeight: "600" }}>MENUNGGU BAYAR</span>
              <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "32px", height: "32px", background: "#fffbeb", color: "#d97706" }}>
                <i className="fas fa-clock" style={{ fontSize: "0.85rem" }}></i>
              </div>
            </div>
            <div className="fw-bold text-warning" style={{ fontSize: "1.45rem" }}>{stats.pending}</div>
            <div className="text-muted" style={{ fontSize: "0.75rem" }}>Perlu diselesaikan</div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="p-3 bg-white rounded-3 border" style={{ borderColor: "#e2e8f0" }}>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted" style={{ fontSize: "0.8rem", fontWeight: "600" }}>TOTAL INVESTASI</span>
              <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "32px", height: "32px", background: "#eef2ff", color: "#4f46e5" }}>
                <i className="fas fa-wallet" style={{ fontSize: "0.85rem" }}></i>
              </div>
            </div>
            <div className="fw-bold" style={{ fontSize: "1.35rem", color: "#4f46e5" }}>
              {formatRupiah(stats.totalSpent)}
            </div>
            <div className="text-muted" style={{ fontSize: "0.75rem" }}>Untuk pengembangan keahlian</div>
          </div>
        </div>
      </div>

      {/* === FILTER & SEARCH TOOLBAR === */}
      <div className="bg-white p-3 rounded-3 border mb-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3" style={{ borderColor: "#e2e8f0" }}>
        {/* Status Tabs */}
        <div className="d-flex align-items-center gap-2 overflow-auto py-1" style={{ scrollbarWidth: "none" }}>
          <button
            onClick={() => setFilterStatus("all")}
            className={`filter-btn-pill ${filterStatus === "all" ? "active" : ""}`}
          >
            Semua ({orders.length})
          </button>
          <button
            onClick={() => setFilterStatus("paid")}
            className={`filter-btn-pill ${filterStatus === "paid" ? "active" : ""}`}
          >
            Berhasil ({stats.paid})
          </button>
          <button
            onClick={() => setFilterStatus("pending")}
            className={`filter-btn-pill ${filterStatus === "pending" ? "active" : ""}`}
          >
            Menunggu Pembayaran ({stats.pending})
          </button>
          <button
            onClick={() => setFilterStatus("other")}
            className={`filter-btn-pill ${filterStatus === "other" ? "active" : ""}`}
          >
            Gagal / Lainnya ({stats.other})
          </button>
        </div>

        {/* Search Input */}
        <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-3 border" style={{ borderColor: "#e2e8f0", minWidth: "260px" }}>
          <i className="fas fa-search text-muted" style={{ fontSize: "0.85rem" }}></i>
          <input
            type="text"
            className="border-0 bg-transparent w-100"
            style={{ fontSize: "0.85rem", outline: "none", color: "#1e293b" }}
            placeholder="Cari no. pesanan atau kursus..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="border-0 bg-transparent text-muted p-0"
              style={{ fontSize: "0.8rem", cursor: "pointer" }}
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
      </div>

      {/* === TRANSACTION LIST === */}
      {isLoading ? (
        <div className="d-flex flex-column gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card-order p-3 p-md-4">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 mb-3 pb-3 border-bottom" style={{ borderColor: "#f1f5f9" }}>
                <div className="d-flex align-items-center gap-2 w-100">
                  <div className="skeleton-shimmer rounded" style={{ height: "14px", width: "40%", maxWidth: "250px" }}></div>
                </div>
                <div className="skeleton-shimmer rounded-pill mt-2 mt-md-0" style={{ height: "24px", width: "100px" }}></div>
              </div>
              <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-3">
                <div className="skeleton-shimmer rounded-3 flex-shrink-0" style={{ width: "120px", height: "80px" }}></div>
                <div className="flex-grow-1 w-100">
                  <div className="skeleton-shimmer rounded mb-2" style={{ height: "18px", width: "70%" }}></div>
                  <div className="skeleton-shimmer rounded" style={{ height: "12px", width: "40%" }}></div>
                </div>
                <div className="text-md-end w-100 mt-3 mt-md-0" style={{ maxWidth: "150px" }}>
                  <div className="skeleton-shimmer rounded mb-2 ms-md-auto" style={{ height: "10px", width: "60%" }}></div>
                  <div className="skeleton-shimmer rounded ms-md-auto" style={{ height: "20px", width: "90%" }}></div>
                </div>
                <div className="mt-3 mt-md-0 w-100" style={{ maxWidth: "160px" }}>
                  <div className="skeleton-shimmer rounded-pill w-100" style={{ height: "38px" }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3 border p-5 text-center my-4" style={{ borderColor: "#e2e8f0" }}>
          <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: "64px", height: "64px", background: "#f8fafc", color: "#94a3b8" }}>
            <i className="fas fa-receipt" style={{ fontSize: "1.75rem" }}></i>
          </div>
          <h3 className="fw-bold mb-1" style={{ fontSize: "1.1rem", color: "#1e293b" }}>
            Belum Ada Transaksi Ditemukan
          </h3>
          <p className="text-muted mx-auto mb-4" style={{ fontSize: "0.85rem", maxWidth: "420px" }}>
            {searchQuery || filterStatus !== "all"
              ? "Tidak ada transaksi yang cocok dengan kriteria filter atau pencarian Anda."
              : "Anda belum pernah melakukan pembelian kursus. Mulai jelajahi ribuan materi belajar berkualitas di EduNusa!"}
          </p>
          <Link href="/kursus" className="btn btn-pill-indigo">
            <i className="fas fa-search me-2"></i> Jelajahi Kursus Sekarang
          </Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filteredOrders.map((order) => {
            const isPaid = order.status === "paid";
            const isPending = order.status === "pending" || order.status === "draft";
            const isFailed = order.status === "failed" || order.status === "cancelled";

            return (
              <div key={order.id} className="card-order p-3 p-md-4">
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 pb-3 mb-3 border-bottom" style={{ borderColor: "#f1f5f9" }}>
                  {/* Left: Code & Date */}
                  <div className="d-flex align-items-center gap-3 flex-wrap">
                    <div className="d-flex align-items-center gap-2">
                      <span className="text-muted" style={{ fontSize: "0.8rem", fontWeight: "600" }}>NO. PESANAN:</span>
                      <span className="fw-bold font-monospace text-dark" style={{ fontSize: "0.85rem" }}>
                        {order.order_code}
                      </span>
                      <button
                        onClick={() => handleCopyCode(order.order_code)}
                        className="btn btn-sm btn-link text-muted p-0 text-decoration-none"
                        title="Salin Kode Pesanan"
                      >
                        <i className="far fa-copy" style={{ fontSize: "0.85rem" }}></i>
                      </button>
                    </div>
                    <span className="text-muted d-none d-md-inline">•</span>
                    <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                      <i className="far fa-calendar-alt me-1"></i>
                      {formatDate(order.created_at)}
                    </div>
                  </div>

                  {/* Right: Status Badge */}
                  <div>
                    {isPaid && (
                      <span className="badge trans-badge-paid px-3 py-2 rounded-pill d-inline-flex align-items-center gap-1" style={{ fontSize: "0.78rem", fontWeight: "600" }}>
                        <i className="fas fa-check-circle"></i> Berhasil (Lunas)
                      </span>
                    )}
                    {isPending && (
                      <span className="badge trans-badge-pending px-3 py-2 rounded-pill d-inline-flex align-items-center gap-1" style={{ fontSize: "0.78rem", fontWeight: "600" }}>
                        <i className="fas fa-clock"></i> Menunggu Pembayaran
                      </span>
                    )}
                    {order.status === "expired" && (
                      <span className="badge trans-badge-expired px-3 py-2 rounded-pill d-inline-flex align-items-center gap-1" style={{ fontSize: "0.78rem", fontWeight: "600" }}>
                        <i className="fas fa-hourglass-end"></i> Kedaluwarsa (&gt;1 Jam)
                      </span>
                    )}
                    {isFailed && (
                      <span className="badge trans-badge-failed px-3 py-2 rounded-pill d-inline-flex align-items-center gap-1" style={{ fontSize: "0.78rem", fontWeight: "600" }}>
                        <i className="fas fa-times-circle"></i> Dibatalkan / Gagal
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Row: Course info, Price, Action */}
                <div className="row align-items-center g-3">
                  {/* Course Details */}
                  <div className="col-12 col-md-6 col-lg-7">
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={getCourseThumbnail(order.course_thumbnail)}
                        alt={order.course_title || "Kursus"}
                        className="rounded-3 border object-fit-cover flex-shrink-0"
                        style={{ width: "72px", height: "54px", borderColor: "#e2e8f0" }}
                      />
                      <div>
                        <h2 className="fw-bold mb-1" style={{ fontSize: "0.95rem", color: "#0f172a" }}>
                          {order.course_title || "Kursus EduNusa"}
                        </h2>
                        <div className="text-muted d-flex align-items-center gap-2" style={{ fontSize: "0.8rem" }}>
                          <span>
                            <i className="fas fa-chalkboard-teacher me-1"></i>
                            {order.instructor_name || "Instruktur EduNusa"}
                          </span>
                          {order.payment_method && (
                            <>
                              <span>•</span>
                              <span className="text-capitalize">
                                <i className="fas fa-credit-card me-1"></i>
                                {order.payment_method.replace("_", " ")}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-6 col-md-3 col-lg-2">
                    <div className="text-muted" style={{ fontSize: "0.75rem", fontWeight: "600" }}>TOTAL TAGIHAN</div>
                    <div className="fw-bold text-dark" style={{ fontSize: "1.05rem" }}>
                      {formatRupiah(order.total)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="col-6 col-md-3 col-lg-3 text-end">
                    {isPaid ? (
                      <div className="d-flex align-items-center justify-content-end gap-2">
                        <button
                          onClick={() => setSelectedInvoice(order)}
                          className="btn btn-pill-outline d-inline-flex align-items-center gap-2"
                        >
                          <i className="fas fa-file-invoice" style={{ color: "#4f46e5" }}></i>
                          Lihat Invoice
                        </button>
                      </div>
                    ) : isPending ? (
                        <Link
                          href={`/transactions/${order.id}/detail`}
                          className="btn btn-pill-indigo d-inline-flex align-items-center gap-2"
                        >
                          <i className="fas fa-external-link-alt"></i>
                          Detail / Pembayaran
                        </Link>
                      ) : (
                        !isCoursePaid(order.course_id) && (
                          <button
                            onClick={() => handleReorder(order.course_slug)}
                            className="btn btn-pill-outline d-inline-flex align-items-center gap-2"
                          >
                            <i className="fas fa-redo-alt" style={{ fontSize: "0.75rem" }}></i>
                            Pesan Ulang
                          </button>
                        )
                      )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* === MODAL INVOICE POPUP RESMI EDUNUSA === */}
      {/* ======================================================== */}
      {selectedInvoice && (
        <div
          className="modal show d-block invoice-modal-container"
          style={{ background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", zIndex: 1050 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedInvoice(null);
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content invoice-modal-content rounded-4 border-0 shadow-lg overflow-hidden">
              
              {/* Modal Top Control Bar (Hidden in Print) */}
              <div className="d-flex align-items-center justify-content-between p-3 bg-light border-bottom no-print">
                <span className="fw-bold text-dark" style={{ fontSize: "0.9rem" }}>
                  <i className="fas fa-file-invoice text-primary me-2"></i> Pratinjau Invoice Resmi
                </span>
                <div className="d-flex align-items-center gap-2">
                  <button onClick={handlePrint} className="btn btn-sm btn-pill-indigo d-flex align-items-center gap-2">
                    <i className="fas fa-print"></i> Cetak / Simpan PDF
                  </button>
                  <button
                    onClick={() => setSelectedInvoice(null)}
                    className="btn btn-sm btn-light rounded-circle p-2"
                    style={{ width: "32px", height: "32px" }}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>

              {/* === INVOICE BODY (Ready for Print) === */}
              <div className="p-4 p-md-5 bg-white" id="invoice-printable-area">
                {/* Invoice Header */}
                <div className="d-flex align-items-start justify-content-between border-bottom pb-4 mb-4">
                  <div>
                    {/* EduNusa Brand Logo */}
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <div className="d-flex align-items-center justify-content-center rounded-2 text-white" style={{ width: "38px", height: "38px", background: "linear-gradient(135deg, #6366f1, #4338ca)" }}>
                        <i className="fas fa-graduation-cap" style={{ fontSize: "1.1rem" }}></i>
                      </div>
                      <span className="fw-bold text-dark" style={{ fontSize: "1.35rem", letterSpacing: "-0.02em" }}>
                        Edu<span style={{ color: "#4f46e5" }}>Nusa</span>
                      </span>
                    </div>
                    <div className="text-muted" style={{ fontSize: "0.8rem", lineHeight: "1.5" }}>
                      PT EduNusa Digital Nusantara<br />
                      Gedung EduNusa Tower Lt. 8, Jakarta Selatan<br />
                      Email: billing@edunusa.id | Web: edunusa.edu.id
                    </div>
                  </div>

                  <div className="text-end">
                    <div className="text-uppercase fw-extrabold" style={{ fontSize: "1.5rem", color: "#0f172a", letterSpacing: "1px" }}>
                      INVOICE
                    </div>
                    <div className="fw-bold font-monospace text-primary" style={{ fontSize: "0.95rem" }}>
                      INV/{selectedInvoice.order_code}
                    </div>
                    <div className="mt-2">
                      <span className="badge trans-badge-paid px-3 py-1 rounded-pill" style={{ fontSize: "0.8rem", fontWeight: "700" }}>
                        <i className="fas fa-check-circle me-1"></i> LUNAS / PAID
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2-Column Info Grid */}
                <div className="row g-4 mb-4 pb-4 border-bottom">
                  <div className="col-6">
                    <div className="text-muted text-uppercase mb-1" style={{ fontSize: "0.75rem", fontWeight: "700" }}>
                      DITERBITKAN KEPADA:
                    </div>
                    <div className="fw-bold text-dark" style={{ fontSize: "0.95rem" }}>
                      {user.name || "Siswa EduNusa"}
                    </div>
                    <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                      {user.email || "user@edunusa.id"}
                    </div>
                    <div className="text-muted text-capitalize" style={{ fontSize: "0.8rem" }}>
                      Akun: {user.role || "student"}
                    </div>
                  </div>

                  <div className="col-6 text-end">
                    <div className="text-muted text-uppercase mb-1" style={{ fontSize: "0.75rem", fontWeight: "700" }}>
                      INFORMASI PEMBAYARAN:
                    </div>
                    <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                      Tanggal Transaksi: <strong className="text-dark">{formatDate(selectedInvoice.created_at)}</strong>
                    </div>
                    <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                      Tanggal Lunas: <strong className="text-dark">{formatDate(selectedInvoice.payment_date || selectedInvoice.updated_at)}</strong>
                    </div>
                    <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                      Metode Pembayaran: <strong className="text-dark text-capitalize">{selectedInvoice.payment_method?.replace("_", " ") || "Midtrans Automatic"}</strong>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="table-responsive mb-4">
                  <table className="table table-borderless">
                    <thead>
                      <tr className="border-bottom" style={{ borderColor: "#e2e8f0" }}>
                        <th className="text-muted py-2" style={{ fontSize: "0.8rem", fontWeight: "700" }}>ITEM & KURIKULUM</th>
                        <th className="text-muted py-2 text-center" style={{ fontSize: "0.8rem", fontWeight: "700" }}>AKSES</th>
                        <th className="text-muted py-2 text-end" style={{ fontSize: "0.8rem", fontWeight: "700" }}>HARGA</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-bottom" style={{ borderColor: "#f1f5f9" }}>
                        <td className="py-3">
                          <div className="fw-bold text-dark" style={{ fontSize: "0.95rem" }}>
                            {selectedInvoice.course_title || "Materi Kursus Komprehensif"}
                          </div>
                          <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                            Instruktur: {selectedInvoice.instructor_name || "EduNusa Instructor Team"}
                          </div>
                        </td>
                        <td className="py-3 text-center align-middle">
                          <span className="badge bg-light text-dark border px-2 py-1" style={{ fontSize: "0.75rem" }}>
                            Seumur Hidup (Lifetime)
                          </span>
                        </td>
                        <td className="py-3 text-end align-middle fw-semibold text-dark" style={{ fontSize: "0.95rem" }}>
                          {formatRupiah(selectedInvoice.amount)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Calculation Summary */}
                <div className="d-flex justify-content-end mb-4">
                  <div style={{ width: "280px" }}>
                    <div className="d-flex justify-content-between text-muted mb-2" style={{ fontSize: "0.85rem" }}>
                      <span>Subtotal</span>
                      <span className="text-dark fw-medium">{formatRupiah(selectedInvoice.amount)}</span>
                    </div>
                    {parseFloat(selectedInvoice.discount || "0") > 0 && (
                      <div className="d-flex justify-content-between text-success mb-2" style={{ fontSize: "0.85rem" }}>
                        <span>Potongan Diskon</span>
                        <span>- {formatRupiah(selectedInvoice.discount)}</span>
                      </div>
                    )}
                    <div className="d-flex justify-content-between py-2 border-top border-bottom my-2" style={{ borderColor: "#e2e8f0" }}>
                      <span className="fw-bold text-dark" style={{ fontSize: "1rem" }}>Total Pembayaran</span>
                      <span className="fw-bold text-primary" style={{ fontSize: "1.1rem" }}>{formatRupiah(selectedInvoice.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Security Stamp & Terms */}
                <div className="p-3 bg-light rounded-3 text-muted mb-4" style={{ fontSize: "0.8rem", lineHeight: "1.6" }}>
                  <div className="fw-bold text-dark mb-1">
                    <i className="fas fa-shield-alt text-success me-1"></i> Catatan & Garansi Pembelian:
                  </div>
                  Invoice ini merupakan bukti sah transaksi digital yang diproses secara otomatis oleh sistem EduNusa. Akses materi telah dibuka secara penuh pada akun terdaftar seumur hidup (Lifetime Access). Simpan dokumen ini untuk keperluan administrasi atau reimbursement.
                </div>

                {/* Footer Sign */}
                <div className="d-flex align-items-center justify-content-between pt-3 text-muted border-top" style={{ fontSize: "0.75rem", borderColor: "#f1f5f9" }}>
                  <div>Dokumen ini dicetak secara digital dan sah tanpa tanda tangan basah.</div>
                  <div>© 2026 EduNusa. All Rights Reserved.</div>
                </div>
              </div>

              {/* Modal Footer Controls (Hidden in Print) */}
              <div className="modal-footer bg-light border-top no-print d-flex justify-content-between">
                <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                  <i className="fas fa-info-circle me-1"></i> Butuh bantuan faktur pajak? Hubungi finance@edunusa.id
                </div>
                <div className="d-flex gap-2">
                  <button onClick={() => setSelectedInvoice(null)} className="btn btn-pill-outline">
                    Tutup
                  </button>
                  <button onClick={handlePrint} className="btn btn-pill-indigo d-flex align-items-center gap-2">
                    <i className="fas fa-print"></i> Cetak Invoice
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}













