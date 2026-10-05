"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { LessonProgressRepository } from "@/core/Repositories/LessonProgressRepository";
import { MarkLessonCompleteUseCase } from "@/core/UseCases/MarkLessonCompleteUseCase";

export async function markLessonCompleteAction(lessonId: string, watchTime: number = 0) {
  try {
    const repo = new LessonProgressRepository();
    const useCase = new MarkLessonCompleteUseCase(repo);
    const success = await useCase.execute(lessonId, watchTime);
    
    if (success) {
      // Revalidate cache agar dashboard murid terupdate
      revalidatePath("/courses");
      revalidatePath("/class-room", "layout");
      return { success: true };
    }
    return { success: false, message: "Gagal menyimpan progres" };
  } catch (error: any) {
    console.error("[markLessonCompleteAction] error:", error);
    return { success: false, message: error.message };
  }
}
