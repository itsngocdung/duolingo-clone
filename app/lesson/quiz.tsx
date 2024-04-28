"use client";

import { challenges, challengesOptions } from "@/db/schema";
import { useState } from "react";
import Header from "./header";
import QuestionBubble from "./question-bubble";
import Challenge from "./challenge";

type Props = {
  initialLessonId: number;
  initialHearts: number;
  initialPercentage: number;
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean;
    challengesOptions: (typeof challengesOptions.$inferSelect)[];
  })[];
  userSubscription: any;
};

const Quiz = ({
  initialHearts,
  initialLessonChallenges,
  initialLessonId,
  initialPercentage,
  userSubscription,
}: Props) => {
  //lấy số tim
  const [hearts, setHearts] = useState(initialHearts);
  //lấy quá trình học
  const [percentage, setPercentage] = useState(initialPercentage);
  //lấy ra các thông tin về thử thách
  const [challenges] = useState(initialLessonChallenges);
  const [acitveIndex, setActiveIndex] = useState(() => {
    //trả về dữ liệu đầu tiên của challenge với điều kiện là Challenge chưa được hoàn thành,,,,,,,,,,,,,,,,,,,,,,
    const uncompletedIndex = challenges.findIndex(
      (challenge) => !challenge.completed
    );
    //nếu uncompleted bằng -1 tức không có dữ liệu thỏa mãn trả về 0 => load active đầu tiên nếu không thì load ra bài tập đầu tiên được thỏa mãn đkien
    return uncompletedIndex === -1 ? 0 : uncompletedIndex;
  });
  //lấy ra challenge với ID là activeIndex
  const challenge = challenges[acitveIndex];
  const options = challenge?.challengesOptions ?? [];

  const title =
    challenge.type === "ASSIST"
      ? "Select the correct meaning"
      : challenge.question;
  return (
    <div>
      <>
        <Header
          hearts={hearts}
          percentage={percentage}
          hasActiveSubscription={!!userSubscription?.isActive}
        />
        <div className="flex-1 ">
          <div className="h-full flex items-center justify-center">
            <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12 text-center">
              <div className="text-lg lg:text-3xl text-center font-bold text-neutral-700">
                {title}
              </div>
              <div>
                {challenge.type === "ASSIST" && (
                  <QuestionBubble question={challenge.question} />
                )}
                <Challenge
                  options={options}
                  onSelect={() => {}}
                  status="none"
                  selectedOption={undefined}
                  disabled={false}
                  type={challenge.type}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default Quiz;
