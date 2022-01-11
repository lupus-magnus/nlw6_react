import { Link } from "react-router-dom";

import IllustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import "../styles/auth.scss";
import { Button } from "../components/Button";
import { useEffect } from "react";
import { auth } from "../services/firebase";
import { useAuth } from "../hooks/useAuth";

export const NewRoom = () => {
  const { user, setUser } = useAuth(); // useContext(AuthContext);

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
          <form>
            <h2>Criar uma nova sala</h2>
            <input type="text" placeholder="Digite o código da sala" />
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
