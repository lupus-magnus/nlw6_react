import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";
import "../styles/room.scss";

type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
  }
>;

type Question = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
};

type RoomParams = {
  id: string;
};

export const Room = () => {
  const { id: roomId } = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    // Search for questions data
    roomRef.on("value", (room) => {
      const firebaseQuestions = (room.val().questions ??
        {}) as FirebaseQuestions;
      // Object.entries: {name: matt, idade: 26} => [["name", "matt"], ["idade", 26]]
      const parsedQuestions = Object.entries(firebaseQuestions).map(
        ([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            isHighlighted: value.isHighlighted,
            isAnswered: value.isAnswered,
          };
        }
      );
      console.log(parsedQuestions);
      setQuestions(parsedQuestions);
      setTitle(room.val().title);
    });
  }, [roomId]);

  const handleSendQuestion = async (e: FormEvent) => {
    e.preventDefault();
    if (newQuestion.trim() === "") {
      return;
    }
    if (!user) {
      alert("You must be logged in...");
      return;
    }
    const question = {
      content: newQuestion,
      author: {
        name: user.displayName,
        avatar: user.photoURL,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    await database.ref(`rooms/${roomId}/questions`).push(question);
  };

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="logo" />
          <RoomCode code={roomId} />
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

        <form onSubmit={handleSendQuestion}>
          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="O que você quer perguntar?"
          />
          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.photoURL} alt="user avatar" />
                <span>{user.displayName}</span>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta, <button>faça login!</button>
              </span>
            )}
            <Button type="submit" disabled={!user}>
              Enviar pergunta
            </Button>
          </div>
        </form>
        {JSON.stringify(questions)}
      </main>
    </div>
  );
};
