import { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Title from "../components/title";
import Round from "../components/round";
import TeamName from "../components/team-name.js";
import Final from "../components/final";
import "tailwindcss/tailwind.css";
import cookieCutter from "cookie-cutter";

let timerInterval = null;

export default function Game(props) {
  const { i18n, t } = useTranslation();
  const [game, setGame] = useState({});
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState("");
  const ws = useRef(null);
  let refreshCounter = 0;
  let pongInterval;

  useEffect(() => {
    fetch("/api/ws").finally(() => {
      ws.current = new WebSocket(`wss://${window.location.host}/api/ws`);
      ws.current.onopen = function() {
        console.log("game connected to server");
        let session = cookieCutter.get("session");
        console.debug(session);
        if (session != null) {
          console.debug("found user session", session);
          ws.current.send(
            JSON.stringify({ action: "game_window", session: session })
          );
          pongInterval = setInterval(() => {
            console.debug("sending pong in game window");
            let [room, id] = session.split(":");
            ws.current.send(
              JSON.stringify({ action: "pong", id: id, room: room })
            );
          }, 5000);
        }
      };

      ws.current.onmessage = function(evt) {
        var received_msg = evt.data;
        let json = JSON.parse(received_msg);
        console.debug(json);
        if (json.action === "data") {
          if (json.data.title_text === "Change Me") {
            json.data.title_text = t("Change Me");
          }
          if (json.data.teams[0].name === "Team 1") {
            json.data.teams[0].name = `${t("team")} ${t("number", {
              count: 1,
            })}`;
          }
          if (json.data.teams[1].name === "Team 2") {
            json.data.teams[1].name = `${t("team")} ${t("number", {
              count: 2,
            })}`;
          }
          setGame(json.data);
        } else if (json.action === "mistake") {
          var audio = new Audio("wrong.mp3");
          audio.play();
        } else if (json.action === "quit") {
          setGame({});
          // window.close();
        } else if (json.action === "reveal") {
          var audio = new Audio("good-answer.mp3");
          audio.play();
        } else if (json.action === "final_reveal") {
          var audio = new Audio("fm-answer-reveal.mp3");
          audio.play();
        } else if (json.action === "final_submit") {
          var audio = new Audio("good-answer.mp3");
          audio.play();
        } else if (json.action === "final_wrong") {
          var audio = new Audio("try-again.mp3");
          audio.play();
        } else if (json.action === "set_timer") {
          setTimer(json.data);
        } else if (json.action === "stop_timer") {
          clearInterval(timerInterval);
        } else if (json.action === "start_timer") {
          let limit = json.data;
          timerInterval = setInterval(() => {
            if (limit > 0) {
              limit = limit - 1;
              setTimer(limit);
            } else {
              var audio = new Audio("try-again.mp3");
              audio.play();
              clearInterval(timerInterval);
              setTimer(json.data);
            }
          }, 1000);
        } else if (json.action === "change_lang") {
          console.debug("Language Change", json.data);
          i18n.changeLanguage(json.data);
        } else {
          console.error("didn't expect", json);
        }
      };

      setInterval(() => {
        if (ws.current.readyState !== 1) {
          setError(
            `lost connection to server refreshing in ${10 - refreshCounter}`
          );
          refreshCounter++;
          if (refreshCounter >= 10) {
            console.debug("game reload()");
            location.reload();
          }
        } else {
          setError("");
        }
      }, 1000);
    });
  }, []);

  if (game.teams != null) {
    let gameSession;
    if (game.title) {
      gameSession = <Title game={game} />;
    } else if (game.is_final_round) {
      gameSession = (
        <div class="flex w-full bg-gray-700 justify-center min-h-screen">
          <div class="lg:w-5/6 sm:w-11/12 sm:px-8 flex flex-col space-y-6 pt-5 justify-center">
            <Final game={game} timer={timer} />
          </div>
        </div>
      );
    } else {
      gameSession = (
        <div class="flex flex-col p-10 bg-gray-700 min-h-screen">
          <Round game={game} />
          {/* <div class="flex flex-row justify-around">
            <TeamName game={game} team={0} />
            <TeamName game={game} team={1} />
          </div> */}
        </div>
      );
    }

    return (
      <>
        {gameSession}
        {error !== "" ? <p class="text-2xl text-red-700">{error}</p> : null}
      </>
    );
  } else {
    return (
      <div class="flex flex-col justify-center items-center min-h-screen">
        <p>{t("No game session. retry from the admin window")}</p>
      </div>
    );
  }
}
