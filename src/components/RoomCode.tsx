import copyImg from "../assets/images/copy.svg";
import "../styles/room-code.scss";

type RoomCodeProps = {
  code: string;
};

export const RoomCode = (props: RoomCodeProps) => {
  const handleCopyCodeToClipboard = () => {
    navigator.clipboard.writeText(props.code);
  };

  return (
    <button onClick={handleCopyCodeToClipboard} className="room-code">
      <div>
        <img src={copyImg} alt="Copy room code" />
      </div>
      <span>{`Sala #${props.code}`}</span>
    </button>
  );
};
