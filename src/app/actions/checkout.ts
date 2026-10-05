"use server";

import { cookies } from "next/headers";

export async function createCheckoutSession(courseId: string | number, couponCode?: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const userStr = cookieStore.get("user")?.value;
    
    if (!token || !userStr) {
        return { success: false, message: "Unauthorized" };
    }
    
    let userId = null;
    try {
        const user = JSON.parse(userStr);
        userId = user.id;
    } catch (e) {
        return { success: false, message: "Invalid user session" };
    }
    
    try {
        const res = await fetch("http://e-learning-docker-api-1/api/v1/checkout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ course_id: courseId, user_id: userId, coupon_code: couponCode })
        });
        
        const data = await res.json();
        
        if (!res.ok) {
            return { success: false, message: data.messages?.error || data.message || JSON.stringify(data) };
        }
        
        return { success: true, data: data.data };
    } catch (error: any) {
        return { success: false, message: error.message || "Server error" };
    }
}


export async function checkPaymentStatus(orderCode: string) {
    try {
        const url = "http://e-learning-docker-api-1/api/v1/checkout/status/" + orderCode;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error('Fetch not OK:', response.status, errText);
            return { success: false, status: 'pending' };
        }

        const data = await response.json();
        console.log('Fetch OK:', data);
        return { success: true, status: data.status, midtrans_data: data.midtrans_data };
    } catch (error: any) {
        console.error('Fetch caught error:', error.message);
        return { success: false, status: 'pending' };
    }
}

export async function getUserOrders() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
        return { success: false, message: "Unauthorized", data: [] };
    }
    
    try {
        const response = await fetch("http://e-learning-docker-api-1/api/v1/transactions/user", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            },
            cache: "no-store"
        });
        
        if (!response.ok) {
            return { success: false, message: "Gagal memuat riwayat transaksi", data: [] };
        }
        
        const resData = await response.json();
        return { success: true, data: resData.data || [] };
    } catch (error: any) {
        console.error("getUserOrders error:", error.message);
        return { success: false, message: error.message || "Server error", data: [] };
    }
}

export async function autoExpireOrders(): Promise<{ success: boolean; expired_count?: number; message?: string }> {
    try {
        const response = await fetch("http://e-learning-docker-api-1/api/v1/transactions/auto-expire", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        const data = await response.json();
        return { success: true, expired_count: data.expired_count ?? 0, message: data.message };
    } catch (error: any) {
        console.error("[autoExpireOrders] Error:", error.message);
        return { success: false, message: error.message };
    }
}
