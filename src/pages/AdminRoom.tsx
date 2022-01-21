// import { FormEvent, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";
// import { useAuth } from "../hooks/useAuth";
import deleteImg from "../assets/images/delete.svg";
import { useRoom } from "../hooks/useRoom";
// import { database } from "../services/firebase";
import "../styles/room.scss";
import { database } from "../services/firebase";

type RoomParams = {
  id: string;
};

export const AdminRoom = () => {
  const { id: roomId } = useParams<RoomParams>();
  const { title, questions } = useRoom(roomId);
  // const { user } = useAuth();
  const history = useHistory();

  const handleDeleteQuestion = async (questionId: string) => {
    if (window.confirm("Tem certeza que deseja excluir essa pergunta?")) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  };

  const handleEndRoom = async () => {
    if (window.confirm("Tem certeza que deseja excluir essa sala?")) {
      await database.ref(`rooms/${roomId}`).update({
        endedAt: new Date(),
      });
      history.push("/");
    }
  };

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="logo" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>
      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && (
            <span>
              {questions.length} pergunta{questions.length > 1 && "s"}
            </span>
          )}
        </div>
        <div className="question-list">
          {questions.map(({ author, content, id }) => (
            <Question key={id} author={author} content={content}>
              <button type="button" onClick={() => handleDeleteQuestion(id)}>
                <img src={deleteImg} alt="delete question" />
              </button>
            </Question>
          ))}
        </div>
      </main>
    </div>
  );
};
