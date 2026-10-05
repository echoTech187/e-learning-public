"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ClassroomData, Lesson } from "@/core/Entities/Classroom";
import { ClassroomRepository } from "@/core/Repositories/ClassroomRepository";

interface Props {
  classroom: ClassroomData;
  enrollmentId: string;
  courseSlug: string;
  token: string;
}

function LessonTypeIcon({ type }: { type: Lesson["type"] }) {
  const icons: Record<Lesson["type"], string> = {
    video: "fa-play-circle", youtube: "fa-brands fa-youtube",
    pdf: "fa-file-pdf", article: "fa-newspaper",
    quiz: "fa-circle-question", live: "fa-tower-broadcast",
  };
  const colors: Record<Lesson["type"], string> = {
    video: "#6366f1", youtube: "#ef4444", pdf: "#f59e0b",
    article: "#10b981", quiz: "#8b5cf6", live: "#ec4899",
  };
  return (
    <i
      className={`fas ${icons[type]}`}
      style={{ color: colors[type], fontSize: "0.85rem", width: "16px", textAlign: "center" }}
    />
  );
}

export default function ClassroomPlayer({ classroom, enrollmentId, courseSlug, token }: Props) {
  const router = useRouter();
  const repo = new ClassroomRepository(token);

  const [data, setData] = useState<ClassroomData>(classroom);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const watchTimeRef = useRef<number>(0);
  const watchTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let firstLesson: Lesson | null = null;
    let firstUncompleted: Lesson | null = null;
    for (const section of data.sections) {
      for (const lesson of section.lessons) {
        if (!firstLesson) firstLesson = lesson;
        if (!lesson.is_completed && !firstUncompleted) firstUncompleted = lesson;
      }
    }
    setActiveLesson(firstUncompleted || firstLesson);
    if (data.sections.length > 0) setOpenSections(new Set([data.sections[0].id]));
  }, []);

  useEffect(() => {
    watchTimeRef.current = 0;
    if (watchTimerRef.current) clearInterval(watchTimerRef.current);
    if (activeLesson) {
      watchTimerRef.current = setInterval(() => { watchTimeRef.current += 30; }, 30000);
    }
    return () => { if (watchTimerRef.current) clearInterval(watchTimerRef.current); };
  }, [activeLesson?.id]);

  const handleSelectLesson = (lesson: Lesson) => {
    if (lesson.type === "quiz") {
      router.push(`/class-room/${courseSlug}/quiz/${lesson.id}`);
      return;
    }
    setActiveLesson(lesson);
  };

  const handleMarkComplete = useCallback(async () => {
    if (!activeLesson || completing) return;
    setCompleting(true);
    const tid = toast.loading("Menandai selesai...");
    try {
      await repo.markLessonComplete(activeLesson.id, watchTimeRef.current);
      setData((prev) => {
        const sections = prev.sections.map((sec) => ({
          ...sec,
          lessons: sec.lessons.map((l) => l.id === activeLesson.id ? { ...l, is_completed: true } : l),
        }));
        const total = sections.reduce((a, s) => a + s.lessons.length, 0);
        const done = sections.reduce((a, s) => a + s.lessons.filter((l) => l.is_completed).length, 0);
        return { ...prev, sections, progress_summary: { total_lessons: total, completed_lessons: done, percent: total > 0 ? Math.round((done / total) * 100) : 0 } };
      });
      toast.success("Materi selesai! 🎉", { id: tid });
      const allLessons = data.sections.flatMap((s) => s.lessons);
      const idx = allLessons.findIndex((l) => l.id === activeLesson.id);
      if (idx >= 0 && idx < allLessons.length - 1) setTimeout(() => setActiveLesson(allLessons[idx + 1]), 800);
    } catch { toast.error("Gagal menyimpan progress", { id: tid }); }
    finally { setCompleting(false); }
  }, [activeLesson, completing]);

  const toggleSection = (id: string) =>
    setOpenSections((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const allLessons = data.sections.flatMap((s) => s.lessons);
  const isCompleted = allLessons.find((l) => l.id === activeLesson?.id)?.is_completed ?? false;
  const progress = data.progress_summary;

  function renderContent() {
    if (!activeLesson) return (
      <div className="d-flex align-items-center justify-content-center text-center text-muted" style={{ minHeight: "50vh" }}>
        <div><i className="fas fa-play-circle mb-3" style={{ fontSize: "3.5rem", color: "#6366f1" }} /><p className="fw-semibold mt-3">Pilih materi dari silabus</p></div>
      </div>
    );

    if (activeLesson.type === "youtube" && activeLesson.content) {
      const m = activeLesson.content.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      const vid = m?.[1] || activeLesson.content;
      return <div className="ratio ratio-16x9"><iframe src={`https://www.youtube.com/embed/${vid}?autoplay=1&rel=0`} title="YouTube" allow="autoplay; encrypted-media" allowFullScreen /></div>;
    }
    if (activeLesson.type === "video" && activeLesson.content) return (
      <div className="ratio ratio-16x9"><video src={activeLesson.content} controls autoPlay style={{ background: "#000", width: "100%", height: "100%", objectFit: "contain" }} /></div>
    );
    if (activeLesson.type === "pdf" && activeLesson.content) return (
      <div style={{ height: "70vh" }}><iframe src={activeLesson.content} className="w-100 h-100 border-0" title="PDF" /></div>
    );
    if (activeLesson.type === "article" && activeLesson.content) return (
      <div className="p-4 p-md-5" style={{ background: "#fff", minHeight: "50vh", lineHeight: 1.9, fontFamily: "Georgia, serif", fontSize: "1.05rem" }}
        dangerouslySetInnerHTML={{ __html: activeLesson.content }} />
    );
    if (activeLesson.type === "live") return (
      <div className="d-flex align-items-center justify-content-center text-center" style={{ minHeight: "45vh", background: "linear-gradient(135deg, #1e1b4b, #4c1d95)", borderRadius: "12px" }}>
        <div className="text-white p-4">
          <div className="badge bg-danger mb-3 px-3 py-2 fs-6"><i className="fas fa-circle me-2" style={{ fontSize: "0.5rem" }} />LIVE</div>
          <h4 className="fw-bold mb-2">{activeLesson.title}</h4>
          {activeLesson.content && <a href={activeLesson.content} target="_blank" rel="noreferrer" className="btn btn-light btn-sm mt-3 fw-semibold px-4"><i className="fas fa-external-link-alt me-2" />Bergabung ke Live Session</a>}
        </div>
      </div>
    );
    return <div className="text-center text-muted py-5"><i className="fas fa-file mb-2" style={{ fontSize: "2.5rem" }} /><p>Konten tidak tersedia</p></div>;
  }

  return (
    <>
      {/* ── Top Bar ── */}
      <div className="d-flex align-items-center gap-3 px-3 px-md-4 py-2 border-bottom" style={{ background: "#fff", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <Link href="/murid" className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 36, height: 36, background: "#f1f5f9", border: "none" }}>
          <i className="fas fa-arrow-left text-dark" style={{ fontSize: "0.8rem" }} />
        </Link>
        <div className="flex-grow-1 overflow-hidden">
          <div className="fw-bold text-dark text-truncate" style={{ fontSize: "0.95rem" }}>{data.course.title}</div>
          <div className="d-flex align-items-center gap-2 mt-1">
            <div className="progress flex-grow-1" style={{ height: "4px", borderRadius: "99px", background: "#e2e8f0" }}>
              <div className="progress-bar" style={{ width: `${progress.percent}%`, background: "linear-gradient(90deg,#6366f1,#8b5cf6)", borderRadius: "99px", transition: "width 0.5s ease" }} />
            </div>
            <span className="text-muted fw-semibold" style={{ fontSize: "0.72rem", whiteSpace: "nowrap" }}>{progress.completed_lessons}/{progress.total_lessons}</span>
          </div>
        </div>
        <button className="btn btn-sm d-flex align-items-center gap-2 fw-semibold flex-shrink-0" style={{ background: "#f1f5f9", border: "none", borderRadius: "10px", fontSize: "0.8rem", padding: "6px 14px" }} onClick={() => setSidebarOpen(!sidebarOpen)}>
          <i className={`fas ${sidebarOpen ? "fa-times" : "fa-list"}`} />
          <span className="d-none d-sm-inline">{sidebarOpen ? "Tutup" : "Silabus"}</span>
        </button>
      </div>

      {/* ── Body ── */}
      <div className="d-flex" style={{ minHeight: "calc(100vh - 57px)" }}>
        {/* ── Content Area ── */}
        <div className="flex-grow-1" style={{ minWidth: 0, background: "#0f172a" }}>
          <div style={{ background: "#0f172a" }}>{renderContent()}</div>

          {/* Lesson info bar */}
          {activeLesson && (
            <div className="p-3 p-md-4" style={{ background: "#f8fafc" }}>
              <div className="d-flex align-items-start justify-content-between flex-wrap gap-3">
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <LessonTypeIcon type={activeLesson.type} />
                    <span className="text-muted text-capitalize fw-medium" style={{ fontSize: "0.75rem" }}>
                      {activeLesson.type}{activeLesson.duration ? ` · ${activeLesson.duration} menit` : ""}
                    </span>
                  </div>
                  <h5 className="fw-bold text-dark mb-1" style={{ fontSize: "1.1rem" }}>{activeLesson.title}</h5>
                  {activeLesson.description && <p className="text-muted mb-0" style={{ fontSize: "0.88rem" }}>{activeLesson.description}</p>}
                </div>
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <div className="d-flex align-items-center gap-2 px-4 py-2 rounded-3 fw-semibold" style={{ background: "#dcfce7", color: "#16a34a", fontSize: "0.88rem" }}>
                      <i className="fas fa-check-circle" /><span>Selesai</span>
                    </div>
                  ) : (
                    <button
                      className="btn fw-semibold px-4 py-2 rounded-3"
                      style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", border: "none", fontSize: "0.88rem" }}
                      onClick={handleMarkComplete} disabled={completing}
                    >
                      {completing ? <><span className="spinner-border spinner-border-sm me-2" />Menyimpan...</> : <><i className="fas fa-check me-2" />Tandai Selesai</>}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        {sidebarOpen && (
          <div className="border-start overflow-auto" style={{ width: "320px", minWidth: "320px", background: "#fff", height: "calc(100vh - 57px)", position: "sticky", top: "57px" }}>
            <div className="p-3 border-bottom">
              <div className="fw-bold text-dark mb-2" style={{ fontSize: "0.88rem" }}>Silabus Kursus</div>
              <div className="d-flex align-items-center gap-2">
                <div className="progress flex-grow-1" style={{ height: "5px", borderRadius: "99px", background: "#e2e8f0" }}>
                  <div className="progress-bar" style={{ width: `${progress.percent}%`, background: "linear-gradient(90deg,#6366f1,#8b5cf6)", borderRadius: "99px" }} />
                </div>
                <span className="text-muted fw-bold" style={{ fontSize: "0.72rem", whiteSpace: "nowrap" }}>{Math.round(progress.percent)}%</span>
              </div>
              <div className="text-muted mt-1" style={{ fontSize: "0.72rem" }}>{progress.completed_lessons} dari {progress.total_lessons} materi selesai</div>
            </div>

            {data.sections.map((sec) => {
              const isOpen = openSections.has(sec.id);
              const done = sec.lessons.filter((l) => l.is_completed).length;
              return (
                <div key={sec.id} className="border-bottom">
                  <button className="w-100 text-start p-3 d-flex align-items-center gap-3 border-0" style={{ background: isOpen ? "#faf8ff" : "#fff", cursor: "pointer" }} onClick={() => toggleSection(sec.id)}>
                    <div className="flex-grow-1">
                      <div className="fw-semibold text-dark" style={{ fontSize: "0.85rem" }}>{sec.title}</div>
                      <div className="text-muted" style={{ fontSize: "0.7rem" }}>{done}/{sec.lessons.length} selesai</div>
                    </div>
                    <i className={`fas ${isOpen ? "fa-chevron-up" : "fa-chevron-down"} text-muted flex-shrink-0`} style={{ fontSize: "0.72rem" }} />
                  </button>

                  {isOpen && sec.lessons.map((lesson) => {
                    const isAct = activeLesson?.id === lesson.id;
                    return (
                      <button
                        key={lesson.id}
                        className="w-100 text-start border-0 d-flex align-items-center gap-3 px-3 py-2"
                        style={{ background: isAct ? "#ede9fe" : "transparent", cursor: "pointer", borderLeft: isAct ? "3px solid #6366f1" : "3px solid transparent" }}
                        onClick={() => handleSelectLesson(lesson)}
                      >
                        <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style={{ width: "22px", height: "22px", background: lesson.is_completed ? "#dcfce7" : isAct ? "#ede9fe" : "#f1f5f9", border: `1.5px solid ${lesson.is_completed ? "#16a34a" : isAct ? "#6366f1" : "#e2e8f0"}` }}>
                          {lesson.is_completed ? <i className="fas fa-check" style={{ fontSize: "0.6rem", color: "#16a34a" }} /> : <LessonTypeIcon type={lesson.type} />}
                        </div>
                        <div className="flex-grow-1 overflow-hidden">
                          <div className="text-truncate fw-medium" style={{ fontSize: "0.8rem", color: isAct ? "#4f46e5" : "#334155" }}>{lesson.title}</div>
                          <div className="text-muted" style={{ fontSize: "0.68rem" }}>
                            {lesson.duration ? `${lesson.duration} mnt` : lesson.type}
                            {lesson.is_free && <span className="ms-2 badge rounded-pill" style={{ background: "#dcfce7", color: "#16a34a", fontSize: "0.55rem" }}>Gratis</span>}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })}

            {progress.percent >= 100 && (
              <div className="m-3 p-3 rounded-3 text-center" style={{ background: "linear-gradient(135deg,#f0fdf4,#dcfce7)", border: "1px solid #86efac" }}>
                <i className="fas fa-award mb-2" style={{ fontSize: "1.8rem", color: "#16a34a" }} />
                <div className="fw-bold text-success mb-1">Kursus Selesai!</div>
                <Link href="/murid/sertifikat" className="btn btn-sm fw-semibold mt-1" style={{ background: "#16a34a", color: "#fff", borderRadius: "8px", fontSize: "0.75rem" }}>Ambil Sertifikat</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}