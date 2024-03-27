"use server";

import db from "@/db/drizzle";
import { getCourseById, getUserProgress } from "@/db/queries";
import { userProgress } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs";
import { error } from "console";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

//lấy thông tin id người dùng vào người dùng từ clerk js
export const upsertUserProgress = async (courseId: number) => {
  const { userId } = await auth();
  const user = await currentUser();
  //nếu người dùng hay id người dùng không tồn tại thông báo không xác thực
  if (!userId || !user) {
    throw new Error("Unauthorized");
  }
  //course id lấy từ querry đã tạo từ trước
  const course = await getCourseById(courseId);

  //nếu ccourse không tồn tại thông báo ra không tìm thấy course
  if (!course) {
    throw new Error("Course not found");
  }

  // nếu course không có bài giảng nào thông báo course rỗng
  // if(!course.units.length || !course.units[0].lesson.length){
  //     throw new Error ("Course empty")
  // }

  const existingUserProgress = await getUserProgress();

  //nếu người dùng đã tồn tại đồng nghĩa với người dùng đã sử dụng khóa học từ trước
  //hàm sẽ thay đổi nếu người dùng chuyển sang khóa khác sẽ update khóa hiện tại của người dùng đang học sang khóa mới
  if (existingUserProgress) {
    await db.update(userProgress).set({
      activeCourseId: courseId,
      userName: user.firstName || "User",
      userImageSrc: user.imageUrl || "/mascot.svg",
    });
    revalidatePath("/courses");
    revalidatePath("/learn");
    redirect("/learn");
  }

  //nếu người dùng chưa từng học khóa nào tiến hành thêm khóa học người dùng vừa chọn thành activeCourse của người dùng đó
  await db.insert(userProgress).values({
    userId,
    activeCourseId: courseId,
    userName: user.firstName || "User",
    userImageSrc: user.imageUrl || "/mascot.svg",
  });
  revalidatePath("/courses");
  revalidatePath("/learn");
  redirect("/learn");
};
