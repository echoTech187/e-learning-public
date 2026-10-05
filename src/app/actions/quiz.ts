"use server";

import { cookies } from 'next/headers';

const API_URL = 'http://e-learning-docker-api-1';

export async function getQuizSession(quizId: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const res = await fetch(`${API_URL}/api/v1/quizzes/${quizId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
    });

    if (!res.ok) {
        throw new Error('Gagal mengambil sesi kuis');
    }
    const result = await res.json();
    return result.data;
}

export async function startQuizAttempt(quizId: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const res = await fetch(`${API_URL}/api/v1/quizzes/${quizId}/start`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({}),
        cache: 'no-store'
    });

    if (!res.ok) {
        throw new Error('Gagal memulai kuis');
    }
    const result = await res.json();
    return result.data;
}

export async function submitQuizAttempt(quizId: string, attemptId: string, answers: { question_id: string, answer: string }[]) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const res = await fetch(`${API_URL}/api/v1/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ attempt_id: attemptId, answers }),
        cache: 'no-store'
    });

    if (!res.ok) {
        throw new Error('Gagal mengumpulkan kuis');
    }
    const result = await res.json();
    return result.data;
}

export async function getQuizResult(quizId: string, attemptId: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const res = await fetch(`${API_URL}/api/v1/quizzes/${quizId}/result/${attemptId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
    });

    if (!res.ok) {
        throw new Error('Gagal mengambil hasil kuis');
    }
    const result = await res.json();
    return result.data;
}
