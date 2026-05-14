import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, CameraOff, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getHandLandmarker, HAND_CONNECTIONS } from "@/lib/vision/handLandmarker";
import {
  classifyFrame, GestureStabilizer, GESTURES,
  type GestureId, type Landmark,
  type MotionFrame,
} from "@/lib/vision/gestures";
import { t, type Lang } from "@/lib/i18n";

interface Props {
  lang: Lang;
  onGesture: (id: GestureId) => void;
}

export function VisionHub({ lang, onGesture }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const stabilizerRef = useRef(new GestureStabilizer());
  const motionBufRef = useRef<MotionFrame[]>([]);
  const lastVideoTimeRef = useRef(-1);
  const fpsBufRef = useRef<number[]>([]);
  const onGestureRef = useRef(onGesture);
  onGestureRef.current = onGesture;

  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [permError, setPermError] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [currentGesture, setCurrentGesture] = useState<GestureId | null>(null);
  const [fps, setFps] = useState(0);
  const [handVisible, setHandVisible] = useState(false);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const v = videoRef.current;
    if (v?.srcObject) {
      (v.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      v.srcObject = null;
    }
    setActive(false);
    setHandVisible(false);
    setConfidence(0);
    setCurrentGesture(null);
    stabilizerRef.current.reset();
    motionBufRef.current = [];
  }, []);

  const start = useCallback(async () => {
    setLoading(true);
    setPermError(null);
    try {
      const lm = await getHandLandmarker();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: "user" },
        audio: false,
      });
      const v = videoRef.current!;
      v.srcObject = stream;
      await v.play();
      setActive(true);
      setLoading(false);

      const tick = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || video.readyState < 2) {
          rafRef.current = requestAnimationFrame(tick);
          return;
        }
        const w = video.videoWidth, h = video.videoHeight;
        if (canvas.width !== w) { canvas.width = w; canvas.height = h; }
        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0, 0, w, h);

        const ts = performance.now();
        if (video.currentTime !== lastVideoTimeRef.current) {
          lastVideoTimeRef.current = video.currentTime;
          const result = lm.detectForVideo(video, ts);

          // FPS
          const buf = fpsBufRef.current;
          buf.push(ts);
          while (buf.length && buf[0] < ts - 1000) buf.shift();
          if (buf.length % 6 === 0) setFps(buf.length);

          const handsLm: Landmark[][] = (result.landmarks || []) as Landmark[][];
          const handed = (result.handedness || []).map(h => h[0]?.categoryName as "Left" | "Right");

          setHandVisible(handsLm.length > 0);

          // motion buffer for first hand
          if (handsLm[0]) {
            motionBufRef.current.push({
              t: ts,
              wristX: handsLm[0][0].x,
              palmOpen: true, // refined inside classify
            });
            if (motionBufRef.current.length > 40) motionBufRef.current.shift();
          } else {
            motionBufRef.current = [];
          }

          const cls = classifyFrame(handsLm, handed, motionBufRef.current);
          setConfidence(cls.confidence);
          setCurrentGesture(cls.id);

          const emitted = stabilizerRef.current.push(cls);
          if (emitted) onGestureRef.current(emitted);

          // Draw landmarks
          drawHands(ctx, handsLm, w, h);
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch (e: any) {
      setLoading(false);
      setPermError(e?.message || "Camera unavailable");
    }
  }, []);

  useEffect(() => () => stop(), [stop]);

  const currentLabel = currentGesture ? GESTURES.find(g => g.id === currentGesture) : null;

  return (
    <div className="glass relative overflow-hidden rounded-2xl p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative size-3">
            <span className={`absolute inset-0 rounded-full ${active ? "bg-success animate-pulse" : "bg-muted-foreground/40"}`} />
            {active && <span className="absolute inset-0 rounded-full bg-success animate-ping" />}
          </div>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            {t("visionHub", lang)}
          </h2>
          {active && (
            <span className="rounded-full bg-card px-2 py-0.5 text-xs text-muted-foreground">
              {fps} {t("fps", lang)}
            </span>
          )}
        </div>
        {active ? (
          <Button onClick={stop} variant="outline" size="sm" className="gap-2">
            <CameraOff className="size-4" /> {t("stopCamera", lang)}
          </Button>
        ) : (
          <Button onClick={start} disabled={loading} size="sm" className="gap-2 glow-cyan">
            <Camera className="size-4" />
            {loading ? t("detecting", lang) : t("startCamera", lang)}
          </Button>
        )}
      </div>

      <div className={`relative aspect-video w-full overflow-hidden rounded-xl bg-background/60 ${handVisible ? "animate-pulse-ring" : ""}`}>
        <video
          ref={videoRef}
          playsInline
          muted
          className="absolute inset-0 size-full -scale-x-100 object-cover"
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 size-full -scale-x-100"
        />
        {/* scan overlay */}
        {active && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="scan-line absolute left-0 right-0 h-24 bg-gradient-to-b from-transparent via-cyan-glow/15 to-transparent" />
          </div>
        )}
        {/* corners */}
        <div className="pointer-events-none absolute inset-3">
          {["top-0 left-0 border-t-2 border-l-2","top-0 right-0 border-t-2 border-r-2","bottom-0 left-0 border-b-2 border-l-2","bottom-0 right-0 border-b-2 border-r-2"].map((c,i)=>(
            <span key={i} className={`absolute size-6 border-cyan-glow/70 ${c}`} />
          ))}
        </div>

        {!active && !permError && (
          <div className="absolute inset-0 grid-pattern flex items-center justify-center text-center">
            <div className="space-y-3">
              <Camera className="mx-auto size-12 text-cyan-glow/70" />
              <p className="text-sm text-muted-foreground">{t("noHand", lang)}</p>
            </div>
          </div>
        )}

        {permError && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 p-6 backdrop-blur">
            <div className="max-w-md space-y-3 text-center">
              <AlertTriangle className="mx-auto size-10 text-destructive" />
              <h3 className="font-display text-lg font-semibold">{t("cameraNeeded", lang)}</h3>
              <p className="text-sm text-muted-foreground">{t("cameraDesc", lang)}</p>
              <Button onClick={start} size="sm">{t("startCamera", lang)}</Button>
            </div>
          </div>
        )}

        {/* current gesture HUD */}
        <AnimatePresence>
          {active && currentLabel && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl glass px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{currentLabel.icon}</span>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    {t("detecting", lang)}
                  </div>
                  <div className="font-display text-lg font-semibold text-glow">
                    {lang === "ar" ? currentLabel.ar : currentLabel.en}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  {t("confidence", lang)}
                </div>
                <div className="font-mono text-base text-cyan-glow">
                  {(confidence * 100).toFixed(0)}%
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* confidence bar */}
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-card">
        <motion.div
          animate={{ width: `${Math.round(confidence * 100)}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
          className="h-full bg-gradient-to-r from-secondary to-cyan-glow"
        />
      </div>
    </div>
  );
}

function drawHands(
  ctx: CanvasRenderingContext2D,
  handsLm: Landmark[][],
  w: number, h: number,
) {
  for (const hand of handsLm) {
    // connections
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(34, 211, 238, 0.85)";
    ctx.shadowColor = "rgba(34, 211, 238, 0.9)";
    ctx.shadowBlur = 10;
    for (const [a, b] of HAND_CONNECTIONS) {
      ctx.beginPath();
      ctx.moveTo(hand[a].x * w, hand[a].y * h);
      ctx.lineTo(hand[b].x * w, hand[b].y * h);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
    // joints
    for (let i = 0; i < hand.length; i++) {
      const isTip = [4,8,12,16,20].includes(i);
      ctx.fillStyle = isTip ? "rgba(255,255,255,0.95)" : "rgba(56,189,248,0.95)";
      ctx.beginPath();
      ctx.arc(hand[i].x * w, hand[i].y * h, isTip ? 6 : 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
