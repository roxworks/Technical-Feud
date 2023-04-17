import "tailwindcss/tailwind.css";
import { useTranslation } from "react-i18next";
import QuestionBoard from "./question-board.js";
import "../i18n/i18n";

function RoundPointTally(props) {
  const { t } = useTranslation();
  // start at font size 72 and get smaller as point values increase
  let size = 72 - `${props.points}`.length * 8;
  return (
    <div
      class={props.isScore ? "h-16 rounded bg-red-200 p-1 px-2" : "h-24 rounded-2xl border-4 border-red-200 p-2 text-red-200"}
    >
      {/* text within svg can resize the text based on container*/}
      <svg
        viewBox="-50 -50 100 100"
        height="100%"
        width="100%"
        preserveAspectRatio="xMidYMid meet"
      >
        <text
          fontWeight={props.fontWeight}
          fontSize={size}
          pointerEvents="auto"
          fill={props.isScore ? "rgb(16, 16, 16)" : "rgb(250, 208, 211)"}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {t("number", { count: props.points })}
        </text>
      </svg>
    </div>
  );
}

export default function Round(props) {
  const { t } = useTranslation();
  let current_round = props.game.round;
  let round = props.game.rounds[current_round];
  return (
    <div class="w-auto flex flex-grow flex-col space-y-1 items-center rounded-3xl p-2">
      <div class="flex flex-row justify-center">
        {round.multiply > 1 ? (
          <div>
            <p class="text-2xl text-start">
              x{t("number", { count: round.multiply })}
            </p>
          </div>
        ) : null}
      </div>

      <div class="flex flex-row justify-center">
        <p class="uppercase text-red-200 text-3xl font-bold">{round.question}</p>
      </div>

      <div class="w-full py-2 flex-grow">
        <QuestionBoard round={round} />
      </div>
      

      <div class="flex flex-row justify-around w-3/5 items-center space-x-2 h-28">
        <RoundPointTally points={props.game.teams[0].points} isScore={true} />
        <RoundPointTally
          points={props.game.point_tracker[props.game.round]}
          fontWeight="bold"
        />
        <RoundPointTally points={props.game.teams[1].points} isScore={true} />
      </div>
    </div>
  );
}
