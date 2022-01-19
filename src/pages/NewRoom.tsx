import { Link, useHistory } from "react-router-dom";

import IllustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import "../styles/auth.scss";
import { Button } from "../components/Button";
import React, { useEffect, useState } from "react";
import { auth, database } from "../services/firebase";
import { useAuth } from "../hooks/useAuth";

export const NewRoom = () => {
  const { user, setUser } = useAuth();
  const [newRoom, setNewRoom] = useState("");
  const history = useHistory();

  const handleCreateRoom = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newRoom.trim() === "") {
      return;
    }
    // reference for a register in the database. Here, we are creating a block called rooms, to which we are pushing an object.
    const roomRef = database.ref("rooms");
    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    });

    history.push(`/rooms/${firebaseRoom.key}`);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((oldUser) => {
      if (oldUser) {
        const { displayName, photoURL, uid } = oldUser;
        if (!displayName || !photoURL) {
          throw new Error("Missing information from Google Account!");
        }
        setUser({
          id: uid,
          photoURL,
          displayName,
        });
      }
    });

    // Everytime we set up an event listener in an useEffect, we must shut it off in the return
    return () => {
      unsubscribe();
    };
  }, [user, setUser]);

  return (
    <div id="page-auth">
      <aside>
        <img src={IllustrationImg} alt="Ilustração de perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao vivo!</strong>
        <p>Tire as dúvidas da sua audiência em tempo real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Logo Letmeask" />
          <h1>{user?.displayName}</h1>
          <form onSubmit={handleCreateRoom}>
            <h2>Criar uma nova sala</h2>
            <input
              type="text"
              value={newRoom}
              onChange={(event) => setNewRoom(event.target.value)}
              placeholder="Digite o código da sala"
            />
            <Button type="submit">Criar sala</Button>
          </form>
          <p>
            Quer entrar numa sala que já existe?{" "}
            <Link to="/">clique aqui!</Link>
          </p>
        </div>
      </main>
    </div>
  );
};
