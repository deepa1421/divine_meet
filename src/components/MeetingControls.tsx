import { useState } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users, MoreVertical } from "lucide-react";

export default function MeetingControls() {
  const [micOn, setMicOn] = useState(false);
  const [camOn, setCamOn] = useState(false);

  return (
    <div className="flex items-center justify-center gap-3 py-3 px-4 bg-card border-t border-border">
      <button
        onClick={() => setMicOn(!micOn)}
        className={`p-3 rounded-full transition-colors ${
          micOn ? "bg-secondary text-secondary-foreground" : "bg-destructive text-destructive-foreground"
        }`}
      >
        {micOn ? <Mic size={20} /> : <MicOff size={20} />}
      </button>

      <button
        onClick={() => setCamOn(!camOn)}
        className={`p-3 rounded-full transition-colors ${
          camOn ? "bg-secondary text-secondary-foreground" : "bg-destructive text-destructive-foreground"
        }`}
      >
        {camOn ? <Video size={20} /> : <VideoOff size={20} />}
      </button>

      <button className="p-3 rounded-full bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity">
        <PhoneOff size={20} />
      </button>

      <button className="p-3 rounded-full bg-secondary text-secondary-foreground">
        <Users size={20} />
      </button>

      <button className="p-3 rounded-full bg-secondary text-secondary-foreground">
        <MoreVertical size={20} />
      </button>
    </div>
  );
}
