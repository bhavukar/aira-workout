import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const clips = [
  {
    id: 'standby-kickoff',
    text: "Hey! Ready for your 12-minute lower body circuit? Any knee pain or soreness today, or are we locking straight into intervals?",
  },
  {
    id: 'briefing',
    text: "Welcome to your 12-minute power circuit. Three focused rounds. Let's do this.",
  },
  {
    id: 'interval',
    text: "Lock in: 45 seconds Bulgarian Split Squats. Chest proud, drive through the midfoot.",
  },
  {
    id: 'knee-swap',
    text: "Got it! Swapping to Romanian Deadlifts. Zero patellar load, pure hamstring hinge.",
  },
  {
    id: 'recovery',
    text: "Rest interval. Diaphragmatic nasal breathing. Drop your heart rate down.",
  },
  {
    id: 'extra-rest',
    text: "Adding 20 seconds to recovery. Inhale 4 seconds, hold, and smooth exhale.",
  },
  {
    id: 'intensity',
    text: "Zone 5 unlocked! Explosive vertical drive. Maximum speed for 30 seconds!",
  },
  {
    id: 'debrief',
    text: "Outstanding session. 184 calories burned, 96% form adherence. You crushed it!",
  },
  {
    id: 'custom-ack',
    text: "Understood. Adapting your circuit pacing in real time.",
  },
];

const outDir = path.resolve('public/audio');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function generateNeuralIndianVoice(text, outMp3) {
  const tmpAiff = `/tmp/aira_${Date.now()}_${Math.random().toString(36).substring(7)}.aiff`;
  try {
    // Generate using Apple Neural Siri Indian Voice (Aman)
    execSync(`say -v "Aman (English (India))" -r 175 "${text.replace(/"/g, '\\"')}" -o "${tmpAiff}"`);
    // Convert to high-fidelity 192kbps MP3
    execSync(`ffmpeg -y -i "${tmpAiff}" -codec:a libmp3lame -b:a 192k "${outMp3}" 2>/dev/null`);
  } catch (e) {
    // Fallback to Rishi
    try {
      execSync(`say -v Rishi -r 175 "${text.replace(/"/g, '\\"')}" -o "${tmpAiff}"`);
      execSync(`ffmpeg -y -i "${tmpAiff}" -codec:a libmp3lame -b:a 192k "${outMp3}" 2>/dev/null`);
    } catch {
      console.error(`Failed to generate: ${text}`);
    }
  } finally {
    if (fs.existsSync(tmpAiff)) {
      fs.unlinkSync(tmpAiff);
    }
  }
}

async function main() {
  console.log(`Generating high-fidelity neural Indian voice audio for ${clips.length} text clips...`);

  for (const clip of clips) {
    const targetFile = path.join(outDir, `${clip.id}.mp3`);
    generateNeuralIndianVoice(clip.text, targetFile);
    const stats = fs.statSync(targetFile);
    console.log(`✓ Generated neural Indian voice for "${clip.id}" (${stats.size} bytes)`);
  }

  console.log('All audio clips generated successfully!');
}

main().catch(console.error);
