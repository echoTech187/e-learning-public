import { NextResponse } from "next/server";

/**
 * GET /api/auto-expire
 * Internal cron-style route handler.
 * Calls the backend autoExpire service to mark pending orders > 1 hour as expired.
 * This can be triggered:
 *   - By a periodic client-side scheduler (setInterval on long-lived pages).
 *   - By external cron services (e.g., cron-job.org, Vercel Cron, etc.) on production.
 */
export async function GET() {
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

        return NextResponse.json(
            {
                success: true,
                message: data.message ?? "Auto-expire executed",
                expired_count: data.expired_count ?? 0,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("[auto-expire] Error:", error.message);
        return NextResponse.json(
            { success: false, message: "Failed to reach internal service" },
            { status: 500 }
        );
    }
}
