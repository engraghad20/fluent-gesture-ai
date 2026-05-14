// Robust gesture recognition using engineered geometric features
// from MediaPipe 21-landmark hand model + temporal smoothing.

export type Landmark = { x: number; y: number; z: number };
export type GestureId =
  | "hello" | "yes" | "no" | "stop" | "help" | "appreciate"
  | "understood" | "goodbye" | "look_here" | "customer_service"
  | "emergency" | "thank_you";

export interface GestureDef {
  id: GestureId;
  en: string;
  ar: string;
  speakEn: string;
  speakAr: string;
  icon: string;
}

export const GESTURES: GestureDef[] = [
  { id: "hello", en: "Hello", ar: "مرحبًا", speakEn: "Hello", speakAr: "مرحبًا", icon: "✌️" },
  { id: "yes", en: "Yes, please", ar: "نعم من فضلك", speakEn: "Yes, please.", speakAr: "نعم من فضلك.", icon: "👍" },
  { id: "no", en: "No, thank you", ar: "لا، شكرًا", speakEn: "No, thank you.", speakAr: "لا، شكرًا.", icon: "👎" },
  { id: "stop", en: "Please wait", ar: "من فضلك انتظر", speakEn: "Please wait.", speakAr: "من فضلك انتظر.", icon: "✋" },
  { id: "help", en: "I need help", ar: "أحتاج مساعدة", speakEn: "I need help.", speakAr: "أحتاج إلى مساعدة.", icon: "🤟" },
  { id: "appreciate", en: "I appreciate you", ar: "أقدّرك", speakEn: "I appreciate you.", speakAr: "أنا أقدّرك.", icon: "🫶" },
  { id: "understood", en: "Okay, understood", ar: "حسنًا، مفهوم", speakEn: "Okay, understood.", speakAr: "حسنًا، مفهوم.", icon: "👌" },
  { id: "goodbye", en: "Goodbye", ar: "مع السلامة", speakEn: "Goodbye.", speakAr: "مع السلامة.", icon: "👋" },
  { id: "look_here", en: "Look here", ar: "انظر هنا", speakEn: "Please look here.", speakAr: "من فضلك انظر هنا.", icon: "☝️" },
  { id: "customer_service", en: "Customer service", ar: "خدمة العملاء", speakEn: "Customer service, please.", speakAr: "خدمة العملاء من فضلك.", icon: "🤏" },
  { id: "emergency", en: "Emergency", ar: "طوارئ", speakEn: "This is an emergency.", speakAr: "هذه حالة طوارئ.", icon: "✊" },
  { id: "thank_you", en: "Thank you so much", ar: "شكرًا جزيلًا", speakEn: "Thank you so much.", speakAr: "شكرًا جزيلًا لك.", icon: "👉" },
];

// Landmark indices
const TIPS = { thumb: 4, index: 8, middle: 12, ring: 16, pinky: 20 };
const PIPS = { thumb: 3, index: 6, middle: 10, ring: 14, pinky: 18 };
const MCPS = { thumb: 2, index: 5, middle: 9, ring: 13, pinky: 17 };

const dist = (a: Landmark, b: Landmark) =>
  Math.hypot(a.x - b.x, a.y - b.y);

// Returns 1 if finger is extended, 0 if curled.
// Uses tip-vs-MCP distance normalized by hand size, plus tip-above-PIP rule.
function fingerExtended(lm: Landmark[], finger: keyof typeof TIPS, handSize: number): boolean {
  const tip = lm[TIPS[finger]];
  const pip = lm[PIPS[finger]];
  const mcp = lm[MCPS[finger]];
  const wrist = lm[0];
  if (finger === "thumb") {
    // Thumb: horizontal distance from tip to index MCP, normalized
    return dist(tip, lm[MCPS.index]) / handSize > 0.45 && dist(tip, wrist) > dist(pip, wrist);
  }
  // Tip should be farther from wrist than PIP, AND distance tip-mcp large
  return dist(tip, wrist) > dist(pip, wrist) * 1.05 && dist(tip, mcp) / handSize > 0.55;
}

interface Features {
  ext: [boolean, boolean, boolean, boolean, boolean]; // thumb, index, middle, ring, pinky
  thumbUp: boolean;
  thumbDown: boolean;
  palmFacingCamera: boolean;
  handedness: "Left" | "Right";
  handSize: number;
  // tip clusters
  thumbIndexTouch: boolean; // OK / pinch
  indexMiddleClose: boolean;
  indexY: number; // tip y vs wrist (negative = up)
}

export function extractFeatures(lm: Landmark[], handedness: "Left" | "Right"): Features {
  const wrist = lm[0];
  const middleMcp = lm[9];
  const handSize = dist(wrist, middleMcp) || 0.001;

  const ext: Features["ext"] = [
    fingerExtended(lm, "thumb", handSize),
    fingerExtended(lm, "index", handSize),
    fingerExtended(lm, "middle", handSize),
    fingerExtended(lm, "ring", handSize),
    fingerExtended(lm, "pinky", handSize),
  ];

  const thumbTip = lm[4];
  const indexTip = lm[8];
  const middleTip = lm[12];

  // Thumb up/down: only thumb extended, tip well above/below wrist
  const onlyThumb = ext[0] && !ext[1] && !ext[2] && !ext[3] && !ext[4];
  const thumbUp = onlyThumb && (wrist.y - thumbTip.y) / handSize > 0.6;
  const thumbDown = onlyThumb && (thumbTip.y - wrist.y) / handSize > 0.4;

  // Palm orientation via cross-product of (index_mcp - wrist) x (pinky_mcp - wrist)
  const v1 = { x: lm[5].x - wrist.x, y: lm[5].y - wrist.y, z: lm[5].z - wrist.z };
  const v2 = { x: lm[17].x - wrist.x, y: lm[17].y - wrist.y, z: lm[17].z - wrist.z };
  const normalZ = v1.x * v2.y - v1.y * v2.x;
  // For right hand mirrored webcam, palm facing camera => normalZ sign depends; combine with handedness
  const palmFacingCamera = handedness === "Right" ? normalZ < 0 : normalZ > 0;

  const thumbIndexTouch = dist(thumbTip, indexTip) / handSize < 0.4;
  const indexMiddleClose = dist(indexTip, middleTip) / handSize < 0.5;

  return {
    ext,
    thumbUp,
    thumbDown,
    palmFacingCamera,
    handedness,
    handSize,
    thumbIndexTouch,
    indexMiddleClose,
    indexY: (indexTip.y - wrist.y) / handSize,
  };
}

// Two-hand heart: thumbs+index of both hands form heart shape (tips close).
export function detectHeart(handsLm: Landmark[][]): boolean {
  if (handsLm.length < 2) return false;
  const [a, b] = handsLm;
  const sizeA = dist(a[0], a[9]) || 0.001;
  const tA = a[4], iA = a[8];
  const tB = b[4], iB = b[8];
  // thumbs close + indices close
  return dist(tA, tB) / sizeA < 0.5 && dist(iA, iB) / sizeA < 0.7;
}

// Wave detection requires temporal motion — handled by motion buffer.
export interface MotionFrame {
  t: number;
  wristX: number;
  palmOpen: boolean;
}

export function detectWave(buffer: MotionFrame[]): boolean {
  if (buffer.length < 12) return false;
  const recent = buffer.slice(-20);
  if (!recent.every(f => f.palmOpen)) return false;
  // count direction reversals in wristX
  let reversals = 0;
  let prevDir = 0;
  for (let i = 1; i < recent.length; i++) {
    const d = recent[i].wristX - recent[i - 1].wristX;
    const dir = d > 0.005 ? 1 : d < -0.005 ? -1 : 0;
    if (dir !== 0 && prevDir !== 0 && dir !== prevDir) reversals++;
    if (dir !== 0) prevDir = dir;
  }
  return reversals >= 3;
}

export interface Classification {
  id: GestureId | null;
  confidence: number;
}

// Single-frame classification returning best guess + confidence.
export function classifyFrame(
  handsLm: Landmark[][],
  handedness: ("Left" | "Right")[],
  motionBuffer: MotionFrame[],
): Classification {
  if (handsLm.length === 0) return { id: null, confidence: 0 };

  // Two-hand heart
  if (detectHeart(handsLm)) return { id: "appreciate", confidence: 0.96 };

  const lm = handsLm[0];
  const f = extractFeatures(lm, handedness[0] || "Right");
  const [t, i, m, r, p] = f.ext;
  const extCount = f.ext.filter(Boolean).length;

  // Wave (priority over open palm if motion detected)
  if (extCount >= 4 && f.palmFacingCamera && detectWave(motionBuffer)) {
    return { id: "goodbye", confidence: 0.95 };
  }

  // Open palm — all five extended, palm facing camera, mostly still
  if (extCount === 5 && f.palmFacingCamera) {
    return { id: "stop", confidence: 0.95 };
  }

  // Thumb up / down
  if (f.thumbUp) return { id: "yes", confidence: 0.96 };
  if (f.thumbDown) return { id: "no", confidence: 0.95 };

  // Fist — no fingers extended
  if (extCount === 0) return { id: "emergency", confidence: 0.94 };

  // Peace — index + middle extended, ring/pinky curled, thumb curled or in
  if (i && m && !r && !p && !t) return { id: "hello", confidence: 0.96 };

  // Help — index + pinky extended, middle + ring curled (rock sign), thumb curled
  if (i && p && !m && !r && !t) return { id: "help", confidence: 0.95 };

  // Thank you so much — index + middle extended pointing forward (double point variant)
  // Distinguish from peace via index+middle close together
  if (i && m && !r && !p && f.indexMiddleClose) {
    return { id: "thank_you", confidence: 0.93 };
  }

  // OK sign — thumb + index touching (circle), other 3 extended
  if (f.thumbIndexTouch && m && r && p) return { id: "understood", confidence: 0.95 };

  // Customer service — C shape: thumb extended out, index curled into C, others curled
  // Approx: thumb + index extended-ish but curved, middle/ring/pinky curled
  if (t && !m && !r && !p && !i && f.thumbIndexTouch === false) {
    return { id: "customer_service", confidence: 0.92 };
  }

  // Look here / point up — only index extended, pointing up
  if (i && !m && !r && !p && !t && f.indexY < -0.5) {
    return { id: "look_here", confidence: 0.95 };
  }

  return { id: null, confidence: 0 };
}

// Temporal stabilizer: requires consistent prediction over N frames before output.
export class GestureStabilizer {
  private history: Classification[] = [];
  private lastEmitted: GestureId | null = null;
  private lastEmitTime = 0;
  constructor(
    private windowSize = 12,
    private minVotes = 8,
    private confThreshold = 0.92,
    private cooldownMs = 1800,
  ) {}

  push(c: Classification): GestureId | null {
    this.history.push(c);
    if (this.history.length > this.windowSize) this.history.shift();
    if (this.history.length < this.windowSize) return null;

    // Voting
    const counts = new Map<GestureId, number>();
    let confSum = new Map<GestureId, number>();
    for (const h of this.history) {
      if (!h.id || h.confidence < this.confThreshold) continue;
      counts.set(h.id, (counts.get(h.id) || 0) + 1);
      confSum.set(h.id, (confSum.get(h.id) || 0) + h.confidence);
    }
    let best: GestureId | null = null;
    let bestVotes = 0;
    for (const [id, v] of counts) {
      if (v > bestVotes) { bestVotes = v; best = id; }
    }
    if (!best || bestVotes < this.minVotes) return null;

    const now = performance.now();
    if (best === this.lastEmitted && now - this.lastEmitTime < this.cooldownMs) return null;
    this.lastEmitted = best;
    this.lastEmitTime = now;
    return best;
  }

  reset() {
    this.history = [];
  }
}
