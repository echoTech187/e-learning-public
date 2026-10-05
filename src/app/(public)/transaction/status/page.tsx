"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, ChevronRight, FileText, ShoppingBag, Loader2, AlertCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { useTransactionStatusViewModel } from "@/core/ViewModels/TransactionStatusViewModel";

export default function TransactionStatusPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderCode = searchParams?.get('order_code');
    const [mounted, setMounted] = useState(false);
    const { status, setStatus, checkStatus, order, user, loading } = useTransactionStatusViewModel(orderCode);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !orderCode || status === 'paid' || status === 'expired') return;

        const interval = setInterval(async () => {
            const result = await checkStatus();
            if (result.success && result.status === 'paid') {
                setStatus('paid');
                clearInterval(interval);
                setTimeout(() => {
                    router.push('/dashboard');
                }, 3000);
            } else if (result.success && result.status === 'expired') {
                setStatus('expired');
                clearInterval(interval);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [mounted, orderCode, status, router]);




    if (!mounted) return null;

    return (
        <main className="min-h-screen pt-32 pb-20 relative overflow-hidden bg-slate-50 font-poppins flex items-center justify-center">
            <Toaster position="top-center" />
            {/* Background Ornaments */}
            <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-primary/10 to-transparent"></div>
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-info rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="bg-white/5 backdrop-blur-xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-3xl p-6 sm:p-10 text-center transform transition-all duration-700">
                    
                    {/* Animated Checkmark / Spinner / Expired Warning */}
                    <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24 mb-6 sm:mb-8">
                        {status === 'paid' ? (
                            <>
                                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
                                <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-tr from-green-400 to-green-500 rounded-full shadow-lg shadow-green-200">
                                    <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-white" strokeWidth={2.5} />
                                </div>
                            </>
                        ) : status === 'expired' ? (
                            <>
                                <div className="absolute inset-0 bg-amber-100 rounded-full opacity-75"></div>
                                <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-tr from-amber-400 to-rose-500 rounded-full shadow-lg shadow-amber-200">
                                    <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" strokeWidth={2.5} />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="absolute inset-0 bg-indigo-100 rounded-full animate-pulse opacity-75"></div>
                                <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-tr from-indigo-400 to-primary rounded-full shadow-lg shadow-indigo-200">
                                    <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-spin" strokeWidth={2.5} />
                                </div>
                            </>
                        )}
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3 tracking-tight">
                        {status === 'paid' ? 'Pembayaran Berhasil!' : status === 'expired' ? 'Transaksi Kedaluwarsa' : 'Transaksi Diproses'}
                    </h1>
                    <p className="text-slate-500 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
                        {status === 'paid' 
                            ? 'Luar biasa! Pembayaran Anda telah kami terima. Anda akan segera dialihkan ke Dashboard Anda...'
                            : status === 'expired'
                            ? 'Batas waktu pembayaran telah berakhir. Pesanan ini sudah kedaluwarsa. Silakan lakukan pemesanan ulang.'
                            : 'Terima kasih! Pesanan Anda telah berhasil dibuat. Silakan selesaikan pembayaran sesuai instruksi di jendela Midtrans.'
                        }
                    </p>

                    <div className="bg-slate-50/70 border border-slate-100 rounded-2xl px-3 pt-3 mb-3 text-left">
                        <div className="flex items-start gap-3 sm:gap-4">
                            <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 shrink-0">
                                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800 text-sm mb-1">Status Real-time</h3>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    {status === 'paid'
                                        ? 'Status transaksi telah diverifikasi secara otomatis oleh sistem.'
                                        : status === 'expired'
                                        ? 'Batas waktu pembayaran telah habis dan token pembayaran ditutup secara otomatis.'
                                        : 'Sistem memantau pembayaran Anda secara otomatis. Halaman ini akan diperbarui segera setelah pembayaran terdeteksi.'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Order Details section injected here */}
                    {loading ? (
                        <div className="mb-8 border border-slate-200 rounded-2xl overflow-hidden text-left bg-white shadow-sm animate-pulse">
                            <div className="bg-slate-50/50 p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                                <div className="space-y-2">
                                    <div className="h-5 w-40 bg-slate-200 rounded"></div>
                                    <div className="h-3 w-32 bg-slate-100 rounded"></div>
                                </div>
                                <div className="h-8 w-24 bg-slate-200 rounded-lg"></div>
                            </div>
                            
                            <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-5 sm:gap-6 border-b border-slate-100">
                                <div className="flex-1 space-y-3">
                                    <div className="h-3 w-24 bg-slate-200 rounded"></div>
                                    <div className="h-4 w-32 bg-slate-200 rounded"></div>
                                    <div className="h-3 w-40 bg-slate-100 rounded"></div>
                                </div>
                                <div className="hidden sm:block w-px bg-slate-100"></div>
                                <div className="flex-1 sm:text-right space-y-3 flex flex-col sm:items-end">
                                    <div className="h-3 w-32 bg-slate-200 rounded"></div>
                                    <div className="h-4 w-28 bg-slate-200 rounded"></div>
                                    <div className="h-3 w-36 bg-slate-100 rounded"></div>
                                </div>
                            </div>
                            
                            <div className="p-4 sm:p-5 border-b border-slate-100">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="h-3 w-20 bg-slate-200 rounded"></div>
                                    <div className="h-3 w-16 bg-slate-200 rounded"></div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="h-4 w-48 bg-slate-200 rounded"></div>
                                    <div className="h-4 w-24 bg-slate-200 rounded"></div>
                                </div>
                            </div>
                            
                            <div className="bg-slate-50/50 p-4 sm:p-5 flex justify-end border-t border-slate-100">
                                <div className="w-full sm:w-2/3 md:w-1/2 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <div className="h-4 w-20 bg-slate-200 rounded"></div>
                                        <div className="h-4 w-24 bg-slate-200 rounded"></div>
                                    </div>
                                    <div className="flex justify-between items-center pt-3 border-t border-slate-200 border-dashed">
                                        <div className="h-4 w-24 bg-slate-200 rounded"></div>
                                        <div className="h-6 w-32 bg-slate-300 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : order && (
                        <div className="mb-8 bg-white border border-slate-200 rounded-2xl shadow-sm text-left overflow-hidden">
                            <div className="p-3 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-slate-800 text-lg">Invoice</h3>
                                        <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-xs font-mono">#{order.order_code}</span>
                                    </div>
                                    <p className="text-[13px] text-slate-500">
                                        Dibuat pada {order.created_at ? new Date(order.created_at.includes('Z') ? order.created_at : order.created_at.replace(' ', 'T') + 'Z').toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '-'}
                                    </p>
                                </div>
                                <div>
                                    {status === 'paid' ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-green-50 text-green-700 border border-green-200/60">
                                            <CheckCircle2 className="w-4 h-4" /> Lunas
                                        </span>
                                    ) : status === 'expired' ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
                                            <AlertCircle className="w-4 h-4" /> Kedaluwarsa
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                                            <Clock className="w-4 h-4" /> Menunggu Pembayaran
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 border-b border-slate-100">
                                <div>
                                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Informasi Siswa</div>
                                    <div className="font-semibold text-slate-800 text-sm mb-1">{user?.name || "Siswa EduNusa"}</div>
                                    <div className="text-[13px] text-slate-500 mb-2">{user?.email || "user@edunusa.id"}</div>
                                    <div className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 capitalize">
                                        Akun: {user?.role || "Student"}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Detail Pembayaran</div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[13px] text-slate-500">Metode</span>
                                            <span className="font-semibold text-slate-800 text-[13px] capitalize">{order.payment_method ? order.payment_method.replace('_', ' ') : '-'}</span>
                                        </div>
                                        {status === 'paid' && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-[13px] text-slate-500">Tanggal Lunas</span>
                                                <span className="font-semibold text-slate-800 text-[13px]">{order.payment_date || order.updated_at ? new Date((order.payment_date || order.updated_at)!.includes('Z') ? (order.payment_date || order.updated_at)! : (order.payment_date || order.updated_at)!.replace(' ', 'T') + 'Z').toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '-'}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-3 pb-4">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-100">
                                            <th className="pb-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Item Kursus</th>
                                            <th className="pb-3 text-right text-[11px] font-bold text-slate-400 uppercase tracking-wider">Harga</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="py-4 align-top pr-4">
                                                <div className="font-semibold text-slate-800 text-sm sm:text-base leading-tight mb-1">{order.course_title}</div>
                                                <div className="inline-flex text-[11px] text-slate-500 font-medium bg-slate-50 px-2 py-0.5 rounded border border-slate-100">Akses Seumur Hidup</div>
                                            </td>
                                            <td className="py-4 align-top text-right font-semibold text-slate-800 text-sm sm:text-base whitespace-nowrap">
                                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(order.amount))}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            
                            <div className="bg-slate-50 p-3 rounded-b-2xl border-t border-slate-100">
                                <div className="w-full sm:w-[65%] md:w-[55%] ml-auto space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[13px] text-slate-500">Subtotal</span>
                                        <span className="font-semibold text-slate-800 text-[13px]">
                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(order.amount))}
                                        </span>
                                    </div>
                                    {parseFloat(order.discount || "0") > 0 && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-[13px] text-emerald-600">Diskon Promo</span>
                                            <span className="font-bold text-emerald-600 text-[13px]">- {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(parseFloat(order.discount))}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center pt-3 mt-3 border-t border-slate-200">
                                        <span className="font-bold text-slate-800 text-sm">TOTAL TAGIHAN</span>
                                        <span className="font-bold text-xl text-primary">
                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(order.total))}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3">
                        {loading ? (
                            <>
                                <div className="flex-1 h-[48px] bg-slate-200 rounded-xl animate-pulse"></div>
                                <div className="flex-1 h-[48px] bg-slate-200 rounded-xl animate-pulse"></div>
                            </>
                        ) : status === 'paid' ? (
                            <>
                                <Link 
                                    href="/dashboard" 
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl shadow-[0_4px_12px_rgba(79,70,229,0.25)] hover:bg-indigo-700 hover:shadow-[0_6px_16px_rgba(79,70,229,0.3)] transition-all duration-300 active:scale-[0.98]"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Mulai Belajar
                                </Link>
                                <Link 
                                    href={`/pending-transaction/${order?.id}`} 
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 font-medium rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 active:scale-[0.98]"
                                >
                                    <FileText className="w-4 h-4" />
                                    Riwayat Transaksi
                                </Link>
                            </>
                        ) : status === 'expired' ? (
                            <>
                                <Link 
                                    href={`/cart?id=${order?.course_id}`} 
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl shadow-[0_4px_12px_rgba(79,70,229,0.25)] hover:bg-indigo-700 hover:shadow-[0_6px_16px_rgba(79,70,229,0.3)] transition-all duration-300 active:scale-[0.98]"
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    Pesan Ulang
                                </Link>
                                <Link 
                                    href={`/pending-transaction/${order?.id}`} 
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 font-medium rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 active:scale-[0.98]"
                                >
                                    <FileText className="w-4 h-4" />
                                    Riwayat Transaksi
                                </Link>
                            </>
                        ) : (
                            <>
                                <button 
                                    onClick={async () => {
                                        if (!orderCode) {
                                            router.push('/transactions');
                                            return;
                                        }
                                        const result = await checkStatus();
                                        if (result.success && result.status === 'paid') {
                                            setStatus('paid');
                                            setTimeout(() => router.push('/dashboard'), 2000);
                                        } else if (result.success && result.status === 'expired') {
                                            setStatus('expired');
                                            toast.error('Batas waktu pembayaran 1 jam telah berakhir.', { duration: 4000 });
                                        } else {
                                            toast.error('Pembayaran belum terdeteksi. Silakan coba beberapa saat lagi.', { duration: 4000 });
                                        }
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl shadow-[0_4px_12px_rgba(79,70,229,0.25)] hover:bg-indigo-700 hover:shadow-[0_6px_16px_rgba(79,70,229,0.3)] transition-all duration-300 active:scale-[0.98]"
                                >
                                    Perbarui Status
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                                
                                <Link 
                                    href="/transactions" 
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 font-medium rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 active:scale-[0.98]"
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    Beranda
                                </Link>
                            </>
                        )}
                    </div>

                </div>
                
                <p className="text-center text-sm text-slate-400 mt-8 font-medium">
                    Butuh bantuan? <a href="#" className="text-primary hover:underline transition-colors">Hubungi Support</a>
                </p>
            </div>
        </main>
    );
}






