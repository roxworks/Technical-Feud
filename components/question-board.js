import { useTranslation } from "react-i18next";
import "../i18n/i18n";

export default function QuestionBoard(props) {
  const { t } = useTranslation();
  return (
    <div class="flex flex-row w-full items-center justify-center text-red-200">
      <div
        class="rounded-3xl grid lg:grid-rows-4 lg:grid-flow-col gap-3 bg-transparent flex-grow"
      >
        {props.round.answers.map((x, index) => (
          <div class="rounded-base cursor-pointer bg-transparent border-4 border-red-200 uppercase items-center text-center rounded font-extrabold">
            {x.trig ? (
              // answered question
              <div class="h-full py-2">
                <div class="flex h-full items-center justify-center">
                  <p
                    class="text-2xl px-5 flex-grow"
                    style={{ textShadow: "1px 2px 4px black" }}
                  >
                    {x.ans}
                  </p>
                  <div class="bg-gradient-to-t from-blue-700 to-blue-400 border-l-2 h-full text-center items-center justify-center p-5 flex">
                    <p
                      class="text-4xl "
                      style={{ textShadow: "1px 2px 4px black" }}
                    >
                      {t("number", { count: x.pnt })}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // unanswered question
              <div class="h-full py-2">
                <div
                  class="justify-center items-center inline-block"
                >
                  <p
                    class="self-center text-4xl "
                  >
                    {t("number", { count: index + 1 })}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
