import { getLesson, getUserProgress } from "@/db/queries";
import { redirect } from "next/navigation";
import Quiz from "./quiz";

const LessonPage = async () => {
  // lấy ra các dữ liệu về bài học (lesson) và quá trình ngươi dùng học tới đâu
  const lessonData = getLesson();
  const userProgressData = getUserProgress();
  // khoai báo biến lesson, userprogress để dễ gọi
  const [lesson, userProgress] = await Promise.all([
    lessonData,
    userProgressData,
  ]);
  //   nếu bài học (lesson) hoặc quá trình học của người dùng rỗng sẽ chuyển về trang learn
  if (!lesson || !userProgress) {
    redirect("/learn");
  }
  // tính toán số % mà khóa học đã được hoàn thành
  const initialPercentage =
    (lesson.challenges.filter((challenge) => challenge.completed).length /
      lesson.challenges.length) *
    100;
  return (
    <div>
      <Quiz
        initialLessonId={lesson.id}
        initialLessonChallenges={lesson.challenges}
        initialHearts={userProgress.hearts}
        initialPercentage={initialPercentage}
        userSubscription={null}
      />
    </div>
  );
};

export default LessonPage;
