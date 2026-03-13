import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useRef } from "react";

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevSongRef = useRef<string | null>(null);

  const { currentSong, isPlaying, playNext} = usePlayerStore();

  //Song progress saving
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const saveProgress = () => {
      localStorage.setItem("lastTime", String(audio.currentTime));
    };

    audio.addEventListener("timeupdate", saveProgress);

    return () => audio.removeEventListener("timeupdate", saveProgress);
  }, []);

  //handle play/pause logic
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // handle song ends
  useEffect(() => {
    const audio = audioRef.current;

    const handleEnded = () => {
      playNext();
    };

    audio?.addEventListener("ended", handleEnded);

    return () => audio?.removeEventListener("ended", handleEnded);
  }, [playNext]);

  //handle song changes
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    const audio = audioRef.current;

    //check if this is actually a new song
    const isSongChange = prevSongRef.current !== currentSong?.audioUrl;
    if (isSongChange) {
      audio.src = currentSong.audioUrl;

      localStorage.setItem("lastSong", JSON.stringify(currentSong));

      audio.load();
      audio.currentTime = 0;

      if (isPlaying) {
        audio.play().catch(() => {});
      }

      prevSongRef.current = currentSong.audioUrl;
    }
  }, [currentSong, isPlaying]);

  //On initial load, check if there's a last played song and time
  useEffect(() => {
    const lastSong = localStorage.getItem("lastSong");
    const lastTime = localStorage.getItem("lastTime");

    if (lastSong && audioRef.current) {
      const song = JSON.parse(lastSong);

      audioRef.current.src = song.audioUrl;

      if (lastTime) {
        audioRef.current.currentTime = Number(lastTime);
      }
    }
  }, []);

  return <audio ref={audioRef} />;
};

export default AudioPlayer;
