// ================= LIVE CLOCK =================

function updateClock() {
  const now = new Date();

  let h = now.getHours();
  let m = now.getMinutes();
  let s = now.getSeconds();

  h = h < 10 ? "0" + h : h;
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;

  document.getElementById("clock").innerText = `${h}:${m}:${s}`;
  document.getElementById("date").innerText = now.toDateString();
}

setInterval(updateClock, 1000);
updateClock();

// ================= ALARM SYSTEM =================

let alarmTimeout = null;
let speaking = false;

function setAlarm() {
  const alarmInput = document.getElementById("alarmTime").value;

  if (!alarmInput) {
    alert("Please select alarm time");
    return;
  }

  const now = new Date();
  const alarm = new Date();

  const [h, m] = alarmInput.split(":");

  alarm.setHours(h, m, 0, 0);

  let diff = alarm - now;
  if (diff < 0) diff += 24 * 60 * 60 * 1000;

  alarmTimeout = setTimeout(startAIAlarm, diff);

  alert("Alarm set successfully!");
}

// ================= WEATHER API (FIXED) =================

async function getWeather() {
  const apiKey = "c79c31516e0e5d204ddc65990c80ce7b";
  const city = "Delhi";

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Weather API Error");
    }

    const data = await response.json();

    console.log("Weather API Response:", data);

    return {
      temp: data.main.temp,
      desc: data.weather[0].description
    };
  } catch (error) {
    console.log("Weather API Failed:", error);

    return {
      temp: "N/A",
      desc: "weather unavailable"
    };
  }
}

// ================= AI MESSAGE =================

async function generateMorningMessage() {
  const now = new Date();
  const time = now.toLocaleTimeString();
  const day = now.toLocaleDateString("en-US", { weekday: "long" });

  const weather = await getWeather();

  return `
Good morning Amit.
Today is ${day}.
Current time is ${time}.
The temperature is ${weather.temp} degrees and the weather is ${weather.desc}.
Stay focused and make today productive.
`;
}

// ================= VOICE OUTPUT =================

function speak(text) {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US";
  speech.rate = 0.95;
  speech.pitch = 1;

  speechSynthesis.speak(speech);
}

// ================= AI ALARM =================

async function startAIAlarm() {
  if (speaking) return;
  speaking = true;

  const message = await generateMorningMessage();
  speak(message);

  speaking = false;
}

// ================= STOP ALARM =================

function stopAlarm() {
  speechSynthesis.cancel();
  clearTimeout(alarmTimeout);
  speaking = false;
  alert("Alarm stopped");
}

// ================= TEST VOICE =================

function testVoice() {
  startAIAlarm();
}