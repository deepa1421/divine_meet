import { FC } from "react";

interface VideoPlayerProps {
  title?: string;
  backgroundImage?: string;
}

const VideoPlayer: FC<VideoPlayerProps> = ({
  title = "Live Satsang",
  backgroundImage = "/images/hanuman-divine.png"
}) => {

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-center px-4 py-3 border-b border-border bg-card/90 backdrop-blur-sm z-10">
        <h2 className="font-display text-sm font-semibold text-gradient-saffron">
          {title}
        </h2>
      </div>

      {/* Background */}
      <div className="flex-1 relative">

        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${backgroundImage}')` }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background/90" />

        {/* Divine Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--saffron)/0.15)_0%,_transparent_70%)]" />

      </div>
    </div>
  );
};

export default VideoPlayer;