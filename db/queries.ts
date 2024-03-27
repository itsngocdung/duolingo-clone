import { cache } from "react";
import db from "@/db/drizzle";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { courses, userProgress } from "./schema";
import CoursesPage from "@/app/(main)/courses/page";

//lấy người dùng từ database
export const getUserProgress = cache(async () => {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }
  //tìm và lấy kết quả trả về là thông tin người dùng trong database trong điều kiện có khóa học tồn tại
  //điều kiệu select sẽ là id của người dùng và id tiến tình mà người dùng đang đăng nhập
  const data = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
    with: {
      activeCourse: true,
    },
  });

  return data;
});
//tìm tất cả các khóa học tồn tại trong database
export const getCourses = cache(async () => {
  const data = await db.query.courses.findMany();
  return data;
});
// lấy khóa học dựa theo id có được với điệu kiệu id của khóa học bằng với khóa học id mà người dùng vừa chọn
export const getCourseById = cache(async (courseId: number) => {
  const data = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
  });

  return data;
});
