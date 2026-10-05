"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { QuizData, QuizResult, Question } from "@/core/Entities/Classroom";
import { ClassroomRepository } from "@/core/Repositories/ClassroomRepository";

interface Props {
  quizData: QuizData;
  quizId: string;
  enrollmentId: string;
  courseSlug: string;
  token: string;
}

// ── Timer Hook ──────────────────────────────────────
function useTimer(durationSeconds: number, onExpire: () => void) {
  const [remaining, setRemaining] = useState(durationSeconds);
  const expiredRef = useRef(false);

  useEffect(() => {
    if (durationSeconds <= 0) return;
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!expiredRef.current) { expiredRef.current = true; onExpire(); }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [durationSeconds]);

  const formatted = `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`;
  return { remaining, formatted, isWarning: remaining < 60, isCritical: remaining < 30 };
}

type Phase = "start" | "session" | "submitting" | "result";

// ── Start Screen ────────────────────────────────────
function StartScreen({ quizData, onStart, courseSlug, starting }: {
  quizData: QuizData; onStart: () => void; courseSlug: string; starting: boolean;
}) {
  const { quiz, attempt_history, can_attempt, attempts_used } = quizData;
  const lastAttempt = attempt_history[0];
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-4"
      style={{ background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)" }}>
      <div style={{ maxWidth: 560, width: "100%" }}>
        <div className="rounded-4 overflow-hidden shadow-lg"
          style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <div className="p-4 p-md-5 pb-3 pb-md-4">
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: 52, height: 52, background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                <i className="fas fa-circle-question text-white" style={{ fontSize: "1.4rem" }} />
              </div>
              <div>
                <div className="text-white opacity-60 fw-medium"
                  style={{ fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Kuis</div>
                <h4 className="text-white fw-bold mb-0" style={{ fontSize: "1.2rem" }}>{quiz.title}</h4>
              </div>
            </div>
            {quiz.description && (
              <p className="mb-4" style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9rem", lineHeight: 1.7 }}>
                {quiz.description}
              </p>
            )}
            <div className="row g-2 mb-4">
              {[
                { icon: "fa-list-ol", label: "Soal", value: `${quizData.questions.length} soal`, color: "#6366f1" },
                { icon: "fa-clock", label: "Durasi", value: quiz.duration > 0 ? `${quiz.duration} menit` : "Tak terbatas", color: "#8b5cf6" },
                { icon: "fa-star", label: "Nilai Lulus", value: `${quiz.passing_score}%`, color: "#10b981" },
                { icon: "fa-rotate-right", label: "Percobaan", value: `${attempts_used}/${quiz.max_attempts}`, color: "#f59e0b" },
              ].map((stat) => (
                <div key={stat.label} className="col-6">
                  <div className="rounded-3 p-3"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <i className={`fas ${stat.icon}`} style={{ color: stat.color, fontSize: "0.8rem" }} />
                      <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.7rem" }}>{stat.label}</span>
                    </div>
                    <div className="text-white fw-bold" style={{ fontSize: "1rem" }}>{stat.value}</div>
                  </div>
                </div>
              ))}
            </div>
            {lastAttempt && lastAttempt.finished_at && (
              <div className="rounded-3 p-3 mb-4"
                style={{
                  background: lastAttempt.is_passed ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
                  border: `1px solid ${lastAttempt.is_passed ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                }}>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem" }}>Percobaan Terakhir</div>
                    <div className="fw-bold"
                      style={{ color: lastAttempt.is_passed ? "#10b981" : "#ef4444", fontSize: "1.1rem" }}>
                      {lastAttempt.score}% — {lastAttempt.is_passed ? "Lulus ✓" : "Belum Lulus"}
                    </div>
                  </div>
                  <i className={`fas ${lastAttempt.is_passed ? "fa-trophy" : "fa-circle-xmark"}`}
                    style={{ color: lastAttempt.is_passed ? "#f59e0b" : "#ef4444", fontSize: "1.8rem" }} />
                </div>
              </div>
            )}
          </div>
          <div className="p-4 p-md-5 pt-0">
            {can_attempt ? (
              <button onClick={onStart} disabled={starting} className="btn w-100 fw-bold py-3 rounded-3"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", border: "none", fontSize: "1rem" }}>
                {starting
                  ? <><span className="spinner-border spinner-border-sm me-2" />Memulai...</>
                  : <><i className="fas fa-play me-2" />Mulai Kuis</>}
              </button>
            ) : (
              <div className="text-center py-3 rounded-3"
                style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}>
                <div className="text-danger fw-semibold">Batas percobaan telah tercapai</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem" }}>Anda tidak dapat mencoba kuis ini lagi</div>
              </div>
            )}
            <Link href={`/belajar/${courseSlug}`}
              className="btn w-100 mt-3 fw-semibold py-2 rounded-3"
              style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <i className="fas fa-arrow-left me-2" />Kembali ke Materi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Session Screen ──────────────────────────────────
const LETTERS = ["A", "B", "C", "D", "E"];

function SessionScreen({ quiz, questions, answers, onAnswer, onSubmit, submitting, currentIdx, onNavigate }: {
  quiz: QuizData["quiz"]; questions: Question[]; answers: Record<string, string>;
  onAnswer: (qId: string, val: string) => void; onSubmit: () => void; submitting: boolean;
  currentIdx: number; onNavigate: (i: number) => void;
}) {
  const durationSecs = quiz.duration > 0 ? quiz.duration * 60 : 0;
  const { formatted, isWarning, isCritical } = useTimer(durationSecs, onSubmit);
  const question = questions[currentIdx];
  const answered = Object.keys(answers).length;
  const total = questions.length;

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: "#f8fafc" }}>
      {/* Top Bar */}
      <div className="sticky-top border-bottom"
        style={{ background: "#fff", zIndex: 100, boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
        <div className="d-flex align-items-center justify-content-between px-3 px-md-5 py-2 gap-3">
          <div className="flex-grow-1 overflow-hidden">
            <div className="fw-bold text-dark text-truncate" style={{ fontSize: "0.95rem" }}>{quiz.title}</div>
            <div className="d-flex align-items-center gap-2 mt-1">
              <div className="progress flex-grow-1"
                style={{ height: "4px", borderRadius: "99px", background: "#e2e8f0", maxWidth: 200 }}>
                <div className="progress-bar"
                  style={{ width: `${Math.round((answered / total) * 100)}%`, background: "linear-gradient(90deg,#6366f1,#8b5cf6)", borderRadius: "99px" }} />
              </div>
              <span className="text-muted fw-semibold" style={{ fontSize: "0.72rem" }}>{answered}/{total} dijawab</span>
            </div>
          </div>
          {quiz.duration > 0 && (
            <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-bold flex-shrink-0"
              style={{
                background: isCritical ? "#fee2e2" : isWarning ? "#fef3c7" : "#f1f5f9",
                color: isCritical ? "#dc2626" : isWarning ? "#d97706" : "#475569",
                fontSize: "1rem", minWidth: 80, justifyContent: "center",
              }}>
              <i className="fas fa-clock" style={{ fontSize: "0.8rem" }} />{formatted}
            </div>
          )}
          <button className="btn btn-sm fw-semibold rounded-3 flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", border: "none", fontSize: "0.82rem", padding: "7px 16px" }}
            onClick={onSubmit} disabled={submitting}>
            {submitting ? <span className="spinner-border spinner-border-sm" /> : <><i className="fas fa-paper-plane me-1" />Submit</>}
          </button>
        </div>
      </div>

      <div className="flex-grow-1 d-flex">
        {/* Question area */}
        <div className="flex-grow-1 p-3 p-md-5" style={{ minWidth: 0, maxWidth: 760, margin: "0 auto" }}>
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="rounded-3 d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
              style={{ width: 44, height: 44, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", fontSize: "0.9rem" }}>
              {currentIdx + 1}
            </div>
            <div className="text-muted fw-medium" style={{ fontSize: "0.75rem" }}>
              Soal {currentIdx + 1} dari {total} ·{" "}
              {question.type === "multiple_choice" ? "Pilihan Ganda" : question.type === "true_false" ? "Benar/Salah" : "Esai"}
              {question.points > 1 && (
                <span className="ms-2 badge rounded-pill"
                  style={{ background: "#ede9fe", color: "#6d28d9", fontSize: "0.65rem" }}>{question.points} poin</span>
              )}
            </div>
          </div>

          <div className="rounded-4 shadow-sm mb-4" style={{ background: "#fff", border: "1px solid #e2e8f0" }}>
            <div className="p-4 p-md-5">
              {question.image && (
                <div className="mb-4 rounded-3 overflow-hidden" style={{ maxHeight: 280, background: "#f8fafc" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={question.image} alt="Question visual" className="w-100"
                    style={{ objectFit: "contain", maxHeight: 280 }} />
                </div>
              )}
              <div className="fw-semibold text-dark mb-5" style={{ fontSize: "1.05rem", lineHeight: 1.7 }}
                dangerouslySetInnerHTML={{ __html: question.question }} />

              {question.type === "essay" ? (
                <textarea className="form-control rounded-3" rows={6}
                  placeholder="Tulis jawaban Anda di sini..."
                  value={answers[question.id] || ""}
                  onChange={(e) => onAnswer(question.id, e.target.value)}
                  style={{ fontSize: "0.9rem", border: "1.5px solid #e2e8f0", resize: "vertical" }} />
              ) : (
                <div className="d-flex flex-column gap-3">
                  {question.options.map((opt, oi) => {
                    const isSelected = answers[question.id] === opt.id;
                    return (
                      <button key={opt.id}
                        onClick={() => onAnswer(question.id, opt.id)}
                        className="d-flex align-items-center gap-3 text-start p-3 rounded-3 border-0 w-100"
                        style={{
                          background: isSelected ? "linear-gradient(135deg, #ede9fe, #e0e7ff)" : "#f8fafc",
                          border: `2px solid ${isSelected ? "#6366f1" : "#e2e8f0"}`,
                          cursor: "pointer", transition: "all 0.18s ease", outline: "none",
                        }}>
                        <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold"
                          style={{
                            width: 34, height: 34,
                            background: isSelected ? "#6366f1" : "#fff",
                            color: isSelected ? "#fff" : "#64748b",
                            border: `2px solid ${isSelected ? "#6366f1" : "#cbd5e1"}`,
                            fontSize: "0.82rem", transition: "all 0.18s ease",
                          }}>
                          {LETTERS[oi] ?? oi + 1}
                        </div>
                        <span className="fw-medium" style={{ fontSize: "0.9rem", color: isSelected ? "#3730a3" : "#334155" }}>
                          {opt.option_text}
                        </span>
                        {isSelected && <i className="fas fa-check-circle ms-auto flex-shrink-0" style={{ color: "#6366f1", fontSize: "1rem" }} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="d-flex justify-content-between">
            <button className="btn fw-semibold rounded-3"
              style={{ background: "#f1f5f9", color: "#475569", border: "none", padding: "8px 20px", fontSize: "0.88rem" }}
              onClick={() => onNavigate(currentIdx - 1)} disabled={currentIdx === 0}>
              <i className="fas fa-chevron-left me-2" />Sebelumnya
            </button>
            {currentIdx < total - 1 ? (
              <button className="btn fw-semibold rounded-3"
                style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", border: "none", padding: "8px 20px", fontSize: "0.88rem" }}
                onClick={() => onNavigate(currentIdx + 1)}>
                Selanjutnya<i className="fas fa-chevron-right ms-2" />
              </button>
            ) : (
              <button className="btn fw-bold rounded-3"
                style={{ background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff", border: "none", padding: "8px 24px", fontSize: "0.88rem" }}
                onClick={onSubmit} disabled={submitting}>
                <i className="fas fa-paper-plane me-2" />Submit Kuis
              </button>
            )}
          </div>
        </div>

        {/* Sidebar navigator */}
        <div className="d-none d-xl-flex flex-column border-start p-4"
          style={{ width: 200, background: "#fff", overflowY: "auto" }}>
          <div className="fw-bold text-dark mb-3" style={{ fontSize: "0.82rem" }}>Navigasi Soal</div>
          <div className="d-flex flex-wrap gap-2">
            {questions.map((q, i) => {
              const isAns = !!answers[q.id];
              const isCur = i === currentIdx;
              return (
                <button key={q.id} onClick={() => onNavigate(i)}
                  className="rounded-2 d-flex align-items-center justify-content-center fw-semibold border-0"
                  style={{
                    width: 36, height: 36, fontSize: "0.8rem", cursor: "pointer",
                    background: isCur ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : isAns ? "#dcfce7" : "#f1f5f9",
                    color: isCur ? "#fff" : isAns ? "#16a34a" : "#64748b",
                    outline: isCur ? "2px solid #6366f1" : "none",
                  }}>
                  {i + 1}
                </button>
              );
            })}
          </div>
          <div className="mt-4 pt-3 border-top">
            {[{ bg: "#dcfce7", border: "#16a34a", label: `Terjawab (${answered})` }, { bg: "#f1f5f9", border: "#cbd5e1", label: `Belum (${total - answered})` }].map((leg) => (
              <div key={leg.label} className="d-flex align-items-center gap-2 mb-2">
                <div className="rounded-1" style={{ width: 12, height: 12, background: leg.bg, border: `1px solid ${leg.border}` }} />
                <span className="text-muted" style={{ fontSize: "0.72rem" }}>{leg.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Result Screen ───────────────────────────────────
function ResultScreen({ result, courseSlug }: { result: QuizResult; courseSlug: string }) {
  const { quiz, attempt, review } = result;
  const [showReview, setShowReview] = useState(false);
  const isPassed = attempt.is_passed;
  const correctCount = review.filter((r) => r.user_answer?.is_correct).length;

  return (
    <div className="min-vh-100" style={{ background: "#f8fafc" }}>
      {/* Hero */}
      <div className="d-flex align-items-center justify-content-center py-5 px-3"
        style={{ background: isPassed ? "linear-gradient(135deg,#064e3b,#065f46)" : "linear-gradient(135deg,#7f1d1d,#991b1b)", minHeight: 280 }}>
        <div className="text-center text-white">
          <div style={{ fontSize: "4rem" }}>{isPassed ? "🏆" : "😢"}</div>
          <h2 className="fw-bold mb-2 mt-2" style={{ fontSize: "2rem" }}>{isPassed ? "Selamat, Lulus!" : "Belum Lulus"}</h2>
          <p className="opacity-75 mb-4" style={{ fontSize: "1rem" }}>
            {isPassed ? "Kamu berhasil menyelesaikan kuis ini dengan baik!"
              : `Nilai minimum lulus adalah ${quiz.passing_score}%. Jangan menyerah!`}
          </p>
          <div className="d-inline-flex align-items-center gap-4 px-5 py-4 rounded-4"
            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.2)" }}>
            <div className="text-center">
              <div className="fw-black" style={{ fontSize: "3.5rem", lineHeight: 1, color: isPassed ? "#6ee7b7" : "#fca5a5" }}>
                {Math.round(attempt.score)}
              </div>
              <div className="opacity-75" style={{ fontSize: "0.8rem" }}>Nilai Kamu</div>
            </div>
            <div className="opacity-40" style={{ fontSize: "2rem", fontWeight: 300 }}>/</div>
            <div className="text-center">
              <div className="fw-bold" style={{ fontSize: "2rem", lineHeight: 1 }}>100</div>
              <div className="opacity-75" style={{ fontSize: "0.8rem" }}>Nilai Maks</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-3 px-md-5">
        {/* Stats */}
        <div className="row g-3 mb-4" style={{ maxWidth: 720, margin: "-28px auto 0" }}>
          {[
            { icon: "fa-check-circle", label: "Benar", value: correctCount, color: "#10b981", bg: "#f0fdf4" },
            { icon: "fa-times-circle", label: "Salah", value: review.length - correctCount, color: "#ef4444", bg: "#fef2f2" },
            { icon: "fa-star", label: "Poin", value: `${attempt.earned_points}/${attempt.total_points}`, color: "#f59e0b", bg: "#fffbeb" },
            { icon: "fa-bullseye", label: "Passing", value: `${quiz.passing_score}%`, color: "#6366f1", bg: "#eef2ff" },
          ].map((s) => (
            <div key={s.label} className="col-6 col-md-3">
              <div className="rounded-4 shadow-sm text-center p-3"
                style={{ background: s.bg, border: `1px solid ${s.color}25` }}>
                <i className={`fas ${s.icon} mb-2`} style={{ fontSize: "1.4rem", color: s.color }} />
                <div className="fw-bold" style={{ fontSize: "1.3rem", color: s.color }}>{s.value}</div>
                <div className="text-muted" style={{ fontSize: "0.72rem" }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="d-flex flex-column flex-sm-row gap-3 mb-4 mt-4" style={{ maxWidth: 720, margin: "0 auto" }}>
          <Link href={`/belajar/${courseSlug}`}
            className="btn flex-grow-1 fw-bold py-3 rounded-3"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", border: "none" }}>
            <i className="fas fa-arrow-left me-2" />Kembali ke Materi
          </Link>
          <button className="btn flex-grow-1 fw-semibold py-3 rounded-3"
            style={{ background: "#f1f5f9", color: "#475569", border: "none" }}
            onClick={() => setShowReview(!showReview)}>
            <i className={`fas ${showReview ? "fa-eye-slash" : "fa-eye"} me-2`} />
            {showReview ? "Sembunyikan" : "Lihat"} Pembahasan
          </button>
        </div>

        {/* Review */}
        {showReview && (
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <h6 className="fw-bold text-dark mb-3">Pembahasan Soal</h6>
            {review.map((item, idx) => {
              const isCorrect = item.user_answer?.is_correct ?? false;
              const userAnswerId = item.user_answer?.answer;
              return (
                <div key={item.question.id} className="rounded-4 shadow-sm mb-4 overflow-hidden"
                  style={{ background: "#fff", border: `1.5px solid ${isCorrect ? "#86efac" : "#fca5a5"}` }}>
                  <div className="p-4 pb-3" style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <div className="d-flex align-items-start gap-3">
                      <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0 text-white"
                        style={{ width: 32, height: 32, background: isCorrect ? "#10b981" : "#ef4444", fontSize: "0.8rem" }}>
                        {idx + 1}
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-semibold text-dark mb-2" style={{ fontSize: "0.95rem", lineHeight: 1.6 }}
                          dangerouslySetInnerHTML={{ __html: item.question.question }} />
                        <span className="badge rounded-pill fw-semibold"
                          style={{ background: isCorrect ? "#dcfce7" : "#fee2e2", color: isCorrect ? "#16a34a" : "#dc2626", fontSize: "0.7rem" }}>
                          <i className={`fas ${isCorrect ? "fa-check" : "fa-times"} me-1`} />
                          {isCorrect ? "Benar" : "Salah"} · {item.question.points} poin
                        </span>
                      </div>
                    </div>
                  </div>

                  {item.question.type !== "essay" && (
                    <div className="p-4 pt-3">
                      <div className="d-flex flex-column gap-2">
                        {item.options.map((opt, oi) => {
                          const isUserAns = userAnswerId === opt.id;
                          const isCorrectOpt = opt.is_correct;
                          const bg = isCorrectOpt ? "#f0fdf4" : isUserAns ? "#fef2f2" : "#f8fafc";
                          const border = isCorrectOpt ? "#86efac" : isUserAns ? "#fca5a5" : "#e2e8f0";
                          const textColor = isCorrectOpt ? "#16a34a" : isUserAns ? "#dc2626" : "#64748b";
                          return (
                            <div key={opt.id} className="d-flex align-items-center gap-3 p-3 rounded-3"
                              style={{ background: bg, border: `1.5px solid ${border}` }}>
                              <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                                style={{ width: 28, height: 28, background: bg, color: textColor, border: `1.5px solid ${border}`, fontSize: "0.75rem" }}>
                                {LETTERS[oi] ?? oi + 1}
                              </div>
                              <span className="fw-medium flex-grow-1" style={{ fontSize: "0.88rem", color: textColor }}>
                                {opt.option_text}
                              </span>
                              {isCorrectOpt && <i className="fas fa-check-circle flex-shrink-0" style={{ color: "#16a34a" }} />}
                              {isUserAns && !isCorrectOpt && <i className="fas fa-times-circle flex-shrink-0" style={{ color: "#dc2626" }} />}
                            </div>
                          );
                        })}
                      </div>
                      {item.question.explanation && (
                        <div className="mt-3 p-3 rounded-3" style={{ background: "#fffbeb", border: "1px solid #fde68a" }}>
                          <div className="d-flex align-items-start gap-2">
                            <i className="fas fa-lightbulb flex-shrink-0 mt-1" style={{ color: "#f59e0b", fontSize: "0.85rem" }} />
                            <div>
                              <div className="fw-semibold text-dark mb-1" style={{ fontSize: "0.78rem" }}>Penjelasan</div>
                              <div className="text-muted" style={{ fontSize: "0.85rem", lineHeight: 1.6 }}>
                                {item.question.explanation}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {item.question.type === "essay" && item.user_answer && (
                    <div className="p-4 pt-3">
                      <div className="text-muted fw-semibold mb-2" style={{ fontSize: "0.78rem" }}>Jawaban Kamu:</div>
                      <div className="p-3 rounded-3"
                        style={{ background: "#f8fafc", border: "1px solid #e2e8f0", fontSize: "0.88rem", color: "#334155", lineHeight: 1.7 }}>
                        {item.user_answer.answer || <span className="text-muted fst-italic">Tidak dijawab</span>}
                      </div>
                      <div className="mt-2 text-muted" style={{ fontSize: "0.75rem" }}>
                        <i className="fas fa-info-circle me-1" />Soal esai dinilai secara manual oleh mentor
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <div style={{ height: 40 }} />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Orchestrator ────────────────────────────────
export default function QuizSessionClient({ quizData, quizId, courseSlug, token }: Props) {
  const repo = new ClassroomRepository(token);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>("start");
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  const handleStart = useCallback(async () => {
    setStarting(true);
    try {
      const { attempt_id } = await repo.startQuiz(quizId);
      setAttemptId(attempt_id);
      setPhase("session");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal memulai kuis");
    } finally {
      setStarting(false);
    }
  }, [quizId]);

  const handleAnswer = useCallback((questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!attemptId || submitting) return;
    const unanswered = quizData.questions.length - Object.keys(answers).length;
    if (unanswered > 0) {
      const ok = window.confirm(`Masih ada ${unanswered} soal belum dijawab. Lanjutkan submit?`);
      if (!ok) return;
    }
    setSubmitting(true);
    setPhase("submitting");
    const tid = toast.loading("Mengirim jawaban...");
    try {
      const mapped = Object.entries(answers).map(([question_id, answer]) => ({ question_id, answer }));
      await repo.submitQuiz(quizId, attemptId, mapped);
      toast.success("Jawaban berhasil dikirim!", { id: tid });
      const resultData = await repo.getQuizResult(quizId, attemptId);
      setResult(resultData);
      setPhase("result");
    } catch {
      toast.error("Gagal mengirim jawaban. Coba lagi.", { id: tid });
      setPhase("session");
    } finally {
      setSubmitting(false);
    }
  }, [attemptId, answers, quizId, submitting]);

  const handleNavigate = useCallback((idx: number) => {
    if (idx >= 0 && idx < quizData.questions.length) setCurrentIdx(idx);
  }, [quizData.questions.length]);

  if (phase === "start") return <StartScreen quizData={quizData} onStart={handleStart} courseSlug={courseSlug} starting={starting} />;
  if (phase === "submitting") return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center flex-column gap-3 text-center"
      style={{ background: "linear-gradient(135deg,#0f0c29,#302b63,#24243e)" }}>
      <div className="spinner-border text-light" style={{ width: 56, height: 56 }} role="status" />
      <div className="text-white fw-semibold fs-5">Mengirim Jawaban...</div>
      <div className="text-white opacity-60" style={{ fontSize: "0.88rem" }}>Mohon tunggu sebentar</div>
    </div>
  );
  if (phase === "result" && result) return <ResultScreen result={result} courseSlug={courseSlug} />;
  return (
    <SessionScreen
      quiz={quizData.quiz} questions={quizData.questions} answers={answers}
      onAnswer={handleAnswer} onSubmit={handleSubmit} submitting={submitting}
      currentIdx={currentIdx} onNavigate={handleNavigate}
    />
  );
}