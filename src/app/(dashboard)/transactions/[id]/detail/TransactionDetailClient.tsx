"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { checkPaymentStatus, getUserOrders } from "@/app/actions/checkout";

export default function TransactionDetailClient({ orderCode, user }: { orderCode: string, user: { name?: string, email?: string, role?: string } }) {
  const [order, setOrder] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [midtransData, setMidtransData] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [orderStatus, setOrderStatus] = useState<string>("loading");
  const [timeLeft, setTimeLeft] = useState<{h: string, m: string, s: string} | null>(null);

  useEffect(() => {
    const decodedCode = decodeURIComponent(orderCode);

    // 1. Try to load from sessionStorage cache FIRST (instant)
    if (typeof window !== "undefined") {
      const cached = sessionStorage.getItem("order_cache_" + decodedCode);
      if (cached) {
        try {
          const o = JSON.parse(cached);
          setOrder(o);
          setOrderStatus(o.status);
          setLoading(false);
          // Clean cache after reading
          sessionStorage.removeItem("order_cache_" + decodedCode);
          return; // Skip API fetch entirely
        } catch {
          // If cache parse fails, fall through to API fetch
        }
      }
    }

    // 2. Fallback: fetch from API (when navigating directly via URL)
    const fetchOrder = async () => {
      try {
        const res = await getUserOrders();
        if (res.success) {
          const o = (res.data as any[]).find((x: any) => x.order_code === decodedCode || x.order_code === orderCode || (x.id && x.id.toString() === orderCode)); // eslint-disable-line @typescript-eslint/no-explicit-any
          console.log("ALL ORDERS:", res.data); console.log("LOOKING FOR:", orderCode); if (o) {
            setOrder(o);
            setOrderStatus(o.status);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderCode]);

  const fetchStatus = async (currentOrder: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (!currentOrder) return;
    setChecking(true);
    try {
      const data = await checkPaymentStatus(currentOrder.order_code);
      if (data && data.status) {
        setOrderStatus(data.status);
        setOrder((prev: any) => ({ ...prev, status: data.status }));
      }
      if (data && data.midtrans_data) {
        setMidtransData(data.midtrans_data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (order && (order.status === 'pending' || order.status === 'draft')) {
      fetchStatus(order);
    }
  }, [order?.order_code, order?.status]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (order && (orderStatus === 'pending' || orderStatus === 'draft')) {
      const safeCreatedStr = order.created_at.includes('Z') ? order.created_at : order.created_at.replace(' ', 'T') + 'Z';
      const createdTime = new Date(safeCreatedStr).getTime();
      const expireTime = createdTime + 60 * 60 * 1000; // 1 hour

      interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = expireTime - now;

        if (distance < 0) {
          clearInterval(interval);
          setTimeLeft(null);
          if (orderStatus === 'pending' || orderStatus === 'draft') {
              setOrderStatus('expired');
            }
        } else {
          const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const s = Math.floor((distance % (1000 * 60)) / 1000);
          setTimeLeft({
            h: h.toString().padStart(2, '0'),
            m: m.toString().padStart(2, '0'),
            s: s.toString().padStart(2, '0')
          });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [order, orderStatus]);

  const handlePay = () => {
    if (!order?.snap_token) {
      toast.error("Token pembayaran tidak ditemukan. Silakan pesan ulang kursus.");
      return;
    }
    window.location.href = "https://app.sandbox.midtrans.com/snap/v2/vtweb/" + order.snap_token;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Tersalin ke clipboard!");
  };

  const formatRupiah = (amount: number | string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(amount));
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const safeDateStr = dateStr.includes('Z') ? dateStr : dateStr.replace(' ', 'T') + 'Z';
    const date = new Date(safeDateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB";
  };

  const renderPaymentInfo = () => {
    if (checking) {
      return (
        <div className="p-4 bg-light rounded-3 border">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="skeleton-box" style={{ height: "24px", width: "200px" }}></div>
          </div>
          <div className="skeleton-line mb-4" style={{ height: "16px", width: "80%" }}></div>
          <div className="mb-4 bg-white p-3 border rounded">
            <div className="skeleton-line mb-2" style={{ height: "14px", width: "120px" }}></div>
            <div className="d-flex justify-content-between align-items-center">
              <div className="skeleton-box" style={{ height: "28px", width: "250px" }}></div>
              <div className="skeleton-box" style={{ height: "32px", width: "80px", borderRadius: "4px" }}></div>
            </div>
          </div>
          <div className="skeleton-box w-100" style={{ height: "45px", borderRadius: "50rem" }}></div>
        </div>
      );
    }
    if (!midtransData) {
      return (
        <div className="p-4 text-center bg-light rounded-3 border">
          <p className="text-muted mb-4">Silakan pilih metode pembayaran yang Anda inginkan melalui sistem Midtrans.</p>
          <button onClick={handlePay} className="btn btn-pill-indigo px-4 py-2 fw-medium">
            <i className="fas fa-credit-card me-2"></i> Pilih Metode Pembayaran
          </button>
        </div>
      );
    }

    const type = midtransData.payment_type;
    if (type === "bank_transfer" || type === "echannel") {
      let va = null;
      if (type === "bank_transfer" && midtransData.va_numbers) va = midtransData.va_numbers[0];
      
      if (va) {
        return (
          <div className="p-4 bg-light rounded-3 border">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0 fw-bold"><i className="fas fa-university text-primary me-2"></i> Transfer Bank {va.bank.toUpperCase()}</h6>
            </div>
            <p className="text-muted small mb-4">
              Lakukan transfer dari rekening {va.bank.toUpperCase()} ke nomor Virtual Account di bawah ini.
            </p>
            <div className="mb-4 bg-white p-3 border rounded">
              <p className="text-muted small mb-1">Nomor Virtual Account</p>
              <div className="d-flex justify-content-between align-items-center">
                <span className="fs-5 fw-bold font-monospace text-primary">{va.va_number}</span>
                <button 
                  onClick={() => copyToClipboard(va.va_number)}
                  className="btn btn-sm btn-outline-primary fw-medium"
                >
                  <i className="fas fa-copy me-1"></i> Salin
                </button>
              </div>
            </div>
            <button onClick={() => fetchStatus(order)} disabled={checking} className="btn btn-pill-indigo w-100 fw-bold px-4 py-3">
              {checking ? "Mengecek..." : "SAYA SUDAH BAYAR (CEK STATUS)"}
            </button>
          </div>
        );
      }
    }

    return (
      <div className="p-4 text-center bg-light rounded-3 border">
        <h6 className="mb-3 fw-bold text-capitalize"><i className="fas fa-credit-card text-primary me-2"></i> Metode Pembayaran Dipilih</h6>
        <p className="text-muted small mb-4">Selesaikan pembayaran di halaman Midtrans atau cek status pembayaran Anda.</p>
        <button onClick={handlePay} className="btn btn-outline-dark px-4 py-3 rounded-pill fw-medium mb-3 me-2">
          Lanjutkan Pembayaran
        </button>
        <button onClick={() => fetchStatus(order)} disabled={checking} className="btn btn-pill-indigo px-4 py-3 fw-bold mb-3">
          {checking ? "Mengecek..." : "SAYA SUDAH BAYAR"}
        </button>
      </div>
    );
  };

  return (
    <div className="transaction-detail-page">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes shimmer {
            0% { background-position: -468px 0; }
            100% { background-position: 468px 0; }
          }
          .skeleton-box, .skeleton-line {
            animation: shimmer 1s linear infinite forwards;
            background: #f6f7f8;
            background: linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%);
            background-size: 800px 104px;
            border-radius: 4px;
          }
        `}} />
      <Toaster position="top-center" />
      
      {/* === HEADER & BREADCRUMB === */}
      <div className="mb-5 pb-3 border-bottom" style={{ borderColor: "#f1f5f9" }}>
          <div className="d-flex align-items-center gap-2 mb-3" style={{ fontSize: "0.85rem", fontWeight: "500", color: "#64748b" }}>
            <Link href="/beranda" className="text-decoration-none text-muted d-flex align-items-center gap-1 hover-primary transition-colors">
              <i className="fas fa-home"></i> Dashboard
            </Link>
            <span style={{ color: "#cbd5e1" }}>/</span>
            <Link href="/transactions" className="text-decoration-none text-muted hover-primary transition-colors">
              Riwayat Transaksi
            </Link>
            <span style={{ color: "#cbd5e1" }}>/</span>
            <span className="text-primary fw-semibold">Detail Transaksi</span>
          </div>
          
          <div className="d-flex flex-column flex-md-row md-align-items-center justify-content-between gap-4">
            <div>
              <h1 className="fw-bold mb-2" style={{ fontSize: "1.75rem", color: "#0f172a", letterSpacing: "-0.02em" }}>
                Detail Pembayaran & Invoice
              </h1>
              <p className="text-muted mb-0" style={{ fontSize: "0.95rem", color: "#64748b" }}>
                Rincian lengkap transaksi dan instruksi pembayaran pesanan Anda.
              </p>
            </div>
            <Link href="/transactions" className="btn btn-pill-outline d-inline-flex align-items-center gap-2 align-self-start shadow-sm transition-all" style={{ padding: "0.6rem 1.25rem", fontWeight: "600" }}>
              <i className="fas fa-arrow-left" style={{ color: "#4f46e5" }}></i>
              Kembali ke Riwayat
            </Link>
          </div>
        </div>

      {loading ? (
        <div className="card border-0 rounded-4 overflow-hidden mb-5 skeleton-card">
          <div className="card-body p-4 p-md-5">
            {/* Header skeleton */}
            <div className="d-flex justify-content-between align-items-start border-bottom pb-4 mb-4">
              <div className="d-flex align-items-center gap-3">
                <div className="skeleton-box rounded-3" style={{width: 48, height: 48}}></div>
                <div>
                  <div className="skeleton-line mb-2" style={{width: 120, height: 18}}></div>
                  <div className="skeleton-line mb-1" style={{width: 200, height: 13}}></div>
                  <div className="skeleton-line" style={{width: 160, height: 11}}></div>
                </div>
              </div>
              <div className="text-end">
                <div className="skeleton-line mb-2 ms-auto" style={{width: 80, height: 13}}></div>
                <div className="skeleton-line mb-2 ms-auto" style={{width: 180, height: 16}}></div>
                <div className="skeleton-line ms-auto" style={{width: 130, height: 26, borderRadius: 99}}></div>
              </div>
            </div>
            {/* Info grid skeleton */}
            <div className="row g-4 mb-4 pb-4 border-bottom">
              <div className="col-6">
                <div className="skeleton-line mb-2" style={{width: 110, height: 11}}></div>
                <div className="skeleton-line mb-1" style={{width: 140, height: 16}}></div>
                <div className="skeleton-line mb-1" style={{width: 190, height: 13}}></div>
                <div className="skeleton-line" style={{width: 80, height: 12}}></div>
              </div>
              <div className="col-6 d-flex flex-column align-items-end">
                <div className="skeleton-line mb-2" style={{width: 130, height: 11}}></div>
                <div className="skeleton-line mb-1" style={{width: 220, height: 13}}></div>
                <div className="skeleton-line mb-1" style={{width: 160, height: 13}}></div>
                <div className="skeleton-line" style={{width: 200, height: 13}}></div>
              </div>
            </div>
            {/* Table skeleton */}
            <div className="mb-4">
              <div className="d-flex justify-content-between border-bottom pb-2 mb-3">
                <div className="skeleton-line" style={{width: 120, height: 12}}></div>
                <div className="skeleton-line" style={{width: 60, height: 12}}></div>
                <div className="skeleton-line" style={{width: 60, height: 12}}></div>
              </div>
              <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
                <div>
                  <div className="skeleton-line mb-1" style={{width: 200, height: 16}}></div>
                  <div className="skeleton-line" style={{width: 140, height: 12}}></div>
                </div>
                <div className="skeleton-line mx-3" style={{width: 100, height: 22, borderRadius: 99}}></div>
                <div className="skeleton-line" style={{width: 80, height: 16}}></div>
              </div>
            </div>
            {/* Total skeleton */}
            <div className="d-flex justify-content-end">
              <div style={{width: 320}}>
                <div className="d-flex justify-content-between mb-2">
                  <div className="skeleton-line" style={{width: 70, height: 13}}></div>
                  <div className="skeleton-line" style={{width: 90, height: 13}}></div>
                </div>
                <div className="d-flex justify-content-between mt-3 pt-3 border-top">
                  <div className="skeleton-line" style={{width: 100, height: 20}}></div>
                  <div className="skeleton-line" style={{width: 110, height: 22}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : !order ? (
        <div className="card shadow-sm border-0 rounded-4 mb-5">
          <div className="card-body p-5 text-center text-danger">
            <i className="fas fa-exclamation-triangle fs-1 mb-3"></i>
            <h5 className="fw-bold">Pesanan Tidak Ditemukan</h5>
            <p>Kode pesanan {orderCode} tidak valid atau Anda tidak memiliki akses ke pesanan ini.</p>
          </div>
        </div>
      ) : (
        <>
      {(orderStatus === 'pending' || orderStatus === 'draft') && timeLeft && (
        <div className="alert alert-warning border-warning border-opacity-50 shadow-sm d-flex flex-column flex-md-row align-items-center justify-content-between mb-4 p-4 rounded-4" style={{ backgroundColor: "#fffbeb" }}>
          <div className="d-flex align-items-center gap-3 mb-3 mb-md-0">
            <div className="bg-warning bg-opacity-25 text-warning rounded-circle d-flex align-items-center justify-content-center" style={{ width: "48px", height: "48px" }}>
              <i className="fas fa-hourglass-half fs-4"></i>
            </div>
            <div>
              <h6 className="fw-bold text-dark mb-1">{orderStatus === 'draft' ? "Pilih Metode Pembayaran Anda" : "Selesaikan Pembayaran Anda"}</h6>
              <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>{orderStatus === 'draft' ? "Silakan selesaikan proses pemilihan metode pembayaran di halaman Midtrans." : "Batas waktu pembayaran akan segera berakhir. Segera lakukan pelunasan."}</p>
            </div>
          </div>
          <div className="d-flex gap-2 text-center">
            <div className="bg-white border rounded px-3 py-2 shadow-sm min-w-[60px]">
              <div className="fw-bold fs-4 text-dark">{timeLeft.h}</div>
              <div className="text-muted" style={{ fontSize: "0.7rem", fontWeight: "600", textTransform: "uppercase" }}>Jam</div>
            </div>
            <div className="fs-4 fw-bold text-muted align-self-center">:</div>
            <div className="bg-white border rounded px-3 py-2 shadow-sm min-w-[60px]">
              <div className="fw-bold fs-4 text-dark">{timeLeft.m}</div>
              <div className="text-muted" style={{ fontSize: "0.7rem", fontWeight: "600", textTransform: "uppercase" }}>Menit</div>
            </div>
            <div className="fs-4 fw-bold text-muted align-self-center">:</div>
            <div className="bg-white border rounded px-3 py-2 shadow-sm min-w-[60px]">
              <div className="fw-bold fs-4 text-danger">{timeLeft.s}</div>
              <div className="text-muted" style={{ fontSize: "0.7rem", fontWeight: "600", textTransform: "uppercase" }}>Detik</div>
            </div>
          </div>
        </div>
      )}

      {/* === INVOICE CARD === */}
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-5">
        <div className="card-body p-4 p-md-5">
          {/* Header Row */}
          <div className="d-flex flex-column flex-md-row justify-content-between border-bottom pb-4 mb-4" style={{ borderColor: "#f1f5f9" }}>
            <div className="d-flex align-items-center gap-3 mb-4 mb-md-0">
              <div className="bg-primary text-white d-flex align-items-center justify-content-center rounded-3" style={{ width: "48px", height: "48px" }}>
                <i className="fas fa-graduation-cap fs-4"></i>
              </div>
              <div>
                <h4 className="fw-bold mb-0 text-dark">EduNusa</h4>
                <div className="text-muted" style={{ fontSize: "0.85rem" }}>PT EduNusa Digital Nusantara</div>
                <div className="text-muted" style={{ fontSize: "0.8rem" }}>Email: billing@edunusa.id</div>
              </div>
            </div>
            <div className="text-md-end">
              <h5 className="fw-bold text-muted mb-1" style={{ letterSpacing: "2px" }}>TAGIHAN</h5>
              <div className="fw-bold font-monospace text-dark mb-2" style={{ fontSize: "0.95rem" }}>
                #{order.order_code}
              </div>
              <div>
                {orderStatus === 'paid' ? (
                    <span className="badge bg-success-subtle text-success border border-success px-3 py-1 rounded-pill" style={{ fontSize: "0.8rem", fontWeight: "700" }}>
                      <i className="fas fa-check-circle me-1"></i> LUNAS
                    </span>
                  ) : orderStatus === 'pending' ? (
                    <span className="badge bg-warning-subtle text-warning border border-warning px-3 py-1 rounded-pill" style={{ fontSize: "0.8rem", fontWeight: "700" }}>
                      <i className="fas fa-clock me-1"></i> MENUNGGU PEMBAYARAN
                    </span>
                  ) : orderStatus === 'draft' ? (
                    <span className="badge bg-secondary-subtle text-secondary border border-secondary px-3 py-1 rounded-pill" style={{ fontSize: "0.8rem", fontWeight: "700" }}>
                      <i className="fas fa-edit me-1"></i> DRAFT (MEMILIH METODE)
                    </span>
                  ) : (
                    <span className="badge bg-danger-subtle text-danger border border-danger px-3 py-1 rounded-pill" style={{ fontSize: "0.8rem", fontWeight: "700" }}>
                      <i className="fas fa-times-circle me-1"></i> DIBATALKAN / GAGAL
                    </span>
                  )}
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
                Tanggal Transaksi: <strong className="text-dark">{formatDate(order.created_at)}</strong>
              </div>
              <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                Tanggal Lunas: <strong className="text-dark">{orderStatus === 'paid' ? formatDate(order.payment_date || order.updated_at) : '-'}</strong>
              </div>
              {orderStatus === 'expired' && (
                <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                  Tanggal Kedaluwarsa: <strong className="text-danger">{formatDate(new Date(new Date(order.created_at.includes('Z') ? order.created_at : order.created_at.replace(' ', 'T') + 'Z').getTime() + 60*60*1000).toISOString())}</strong>
                </div>
              )}
              <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                Metode Pembayaran: <strong className="text-dark text-capitalize">
                  {order.payment_method ? order.payment_method.replace("_", " ") : "Belum Dipilih"}
                </strong>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="table-responsive mb-4">
            <table className="table table-borderless w-full">
              <thead>
                <tr className="border-bottom" style={{ borderColor: "#e2e8f0" }}>
                  <th className="text-muted py-2 text-left" style={{ fontSize: "0.8rem", fontWeight: "700" }}>ITEM & KURIKULUM</th>
                  <th className="text-muted py-2 text-center" style={{ fontSize: "0.8rem", fontWeight: "700" }}>AKSES</th>
                  <th className="text-muted py-2 text-end" style={{ fontSize: "0.8rem", fontWeight: "700" }}>HARGA</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-bottom" style={{ borderColor: "#f1f5f9" }}>
                  <td className="py-3">
                    <div className="fw-bold text-dark" style={{ fontSize: "0.95rem" }}>
                      {order.course_title || "Materi Kursus Komprehensif"}
                    </div>
                    <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                      Instruktur: {order.instructor_name || "EduNusa Instructor Team"}
                    </div>
                  </td>
                  <td className="py-3 text-center align-middle">
                    <span className="badge bg-light text-dark border px-2 py-1" style={{ fontSize: "0.75rem" }}>
                      Seumur Hidup (Lifetime)
                    </span>
                  </td>
                  <td className="py-3 text-end align-middle fw-semibold text-dark" style={{ fontSize: "0.95rem" }}>
                    {formatRupiah(order.amount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Calculation Summary */}
          <div className="d-flex justify-content-end mb-4">
            <div style={{ width: "320px" }}>
              <div className="d-flex justify-content-between text-muted mb-2" style={{ fontSize: "0.85rem" }}>
                <span>Subtotal</span>
                <span className="text-dark fw-medium">{formatRupiah(order.amount)}</span>
              </div>
              {parseFloat(order.discount || "0") > 0 && (
                <div className="d-flex justify-content-between text-success mb-2" style={{ fontSize: "0.85rem" }}>
                  <span>Potongan Diskon</span>
                  <span>- {formatRupiah(order.discount)}</span>
                </div>
              )}
              <div className="d-flex justify-content-between py-3 border-top border-bottom my-3" style={{ borderColor: "#e2e8f0" }}>
                <span className="fw-bold text-dark" style={{ fontSize: "1.1rem" }}>Total Tagihan</span>
                <span className="fw-bold text-primary" style={{ fontSize: "1.2rem" }}>{formatRupiah(order.total)}</span>
              </div>
            </div>
          </div>

          {/* PAYMENT INSTRUCTION BLOCK (Injected here for pending orders) */}
          {(orderStatus === 'pending' || orderStatus === 'draft') && (
            <div className="mb-4">
              <div className="text-muted text-uppercase mb-2" style={{ fontSize: "0.75rem", fontWeight: "700" }}>
                INSTRUKSI PEMBAYARAN:
              </div>
              {renderPaymentInfo()}
            </div>
          )}

          {/* Security Stamp & Terms */}
          <div className="p-3 bg-light rounded-3 text-muted mb-4" style={{ fontSize: "0.8rem", lineHeight: "1.6" }}>
            <div className="fw-bold text-dark mb-1">
              <i className="fas fa-shield-alt text-success me-1"></i> Catatan & Garansi Pembelian:
            </div>
            Invoice ini merupakan bukti sah transaksi digital yang diproses secara otomatis oleh sistem EduNusa. {orderStatus === 'paid' ? "Akses materi telah dibuka secara penuh pada akun terdaftar seumur hidup (Lifetime Access)." : "Segera selesaikan pembayaran agar materi kursus Anda dapat diakses."} Simpan dokumen ini untuk keperluan administrasi atau reimbursement.
          </div>

          {/* Footer Sign */}
          <div className="d-flex align-items-center justify-content-between pt-3 text-muted border-top" style={{ fontSize: "0.75rem", borderColor: "#f1f5f9" }}>
            <div>Dokumen ini dicetak secara digital dan sah tanpa tanda tangan basah.</div>
            <div>&copy; 2026 EduNusa. All Rights Reserved.</div>
          </div>
        </div>
        
      </div>
      </>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes skeleton-shimmer {
          0% { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        .skeleton-line, .skeleton-box {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 600px 100%;
          animation: skeleton-shimmer 1.4s infinite linear;
          border-radius: 6px;
          display: block;
        }
        .skeleton-card {
          box-shadow: 0 1px 12px rgba(0,0,0,0.06) !important;
        }
        .min-w-[60px] { min-width: 60px; }
        .btn-pill-indigo {
          background-color: #4f46e5;
          color: white;
          border-radius: 50rem;
          border: none;
          transition: all 0.2s;
        }
        .btn-pill-indigo:hover {
          background-color: #4338ca;
          color: white;
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
        .font-monospace {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        }
      `}} />
    </div>
  );
}





