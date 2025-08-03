import React, { useState, useRef } from "react";
import "./VoiceButton.css";
import axios from "axios";

const VoiceButton = () => {
  const [isListening, setIsListening] = useState(false);
  const [response, setResponse] = useState("");
  const [responseType, setResponseType] = useState("");
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const recognitionRef = useRef(null);
  const loopListening = useRef(false);

  const speak = (text) => {
    return new Promise((resolve) => {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.onend = resolve;
      synth.cancel();
      synth.speak(utterance);
    });
  };

  const handleRecognitionResult = async (transcript) => {
    if (transcript.includes("stop") || transcript.includes("exit")) {
      const msg = "EchoMind stopped.";
      setIsListening(false);
      loopListening.current = false;
      setResponse(msg);
      setResponseType("stop");
      await speak(msg);
      return;
    }

    try {
      const res = await axios.post(
        "https://honest-analysis-production.up.railway.app/api/command",
        { text: transcript }
      );
      const msg = res.data.message || "Command processed and stored successfully.";
      setResponse(msg);
      setResponseType("success");

      // Check if it's a reminder
      if (transcript.includes("remind me")) {
        setReminderTitle(transcript);
        setShowReminderForm(true); // show the date/time popup
      }

      await speak(msg);
    } catch (error) {
      const msg = "There was an error. Please try again.";
      setResponse(msg);
      setResponseType("error");
      await speak(msg);
    }

    if (loopListening.current) {
      await speak("EchoMind is listening. Please say your command.");
      listenOnce();
    }
  };

  const handleReminderSubmit = async (e) => {
    e.preventDefault();
    if (!reminderTitle || !reminderDate || !reminderTime) return;

    const fullContent = `${reminderTitle} at ${reminderDate} ${reminderTime}`;
    try {
      const response = await axios.post(
        "https://honest-analysis-production.up.railway.app/api/reminders",
        {
          content: fullContent,
        }
      );
      if (response.status === 200 || response.status === 201) {
        setResponse("Reminder added successfully.");
        setResponseType("success");
      } else {
        setResponse("Failed to add reminder.");
        setResponseType("error");
      }
    } catch (error) {
      setResponse("Error while saving reminder.");
      setResponseType("error");
    } finally {
      setReminderTitle("");
      setReminderDate("");
      setReminderTime("");
      setShowReminderForm(false);
    }
  };

  const listenOnce = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported. Use Google Chrome.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      recognition.stop();
      handleRecognitionResult(transcript);
    };

    recognition.onerror = async (e) => {
      console.error("Recognition error:", e);
      const msg = "Speech recognition failed. Try again.";
      setResponse(msg);
      setResponseType("error");
      setIsListening(false);
      loopListening.current = false;
      await speak(msg);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const startVoiceLoop = async () => {
    setIsListening(true);
    loopListening.current = true;
    setResponse("EchoMind is listening. Please say your command.");
    setResponseType("info");
    await speak("EchoMind is listening. Please say your command.");
    listenOnce();
  };

  return (
    <div className="voice-container">
      <button
        className={`mic-button ${isListening ? "listening" : ""}`}
        onClick={() => {
          if (!isListening) {
            startVoiceLoop();
          }
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="white" viewBox="0 0 24 24">
          <path d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3z" />
          <path d="M19 11a1 1 0 00-2 0 5 5 0 01-10 0 1 1 0 00-2 0 7 7 0 006 6.93V21h-3a1 1 0 000 2h8a1 1 0 000-2h-3v-3.07A7 7 0 0019 11z" />
        </svg>
      </button>

      <h2 className="heading">{isListening ? "Listening..." : "Activate EchoMind"}</h2>
      <p className="description">
        {isListening
          ? "Say your command clearly"
          : "Click to speak and create a task, note, or reminder"}
      </p>

      {response && (
        <p className={`voice-response ${responseType}`}>{response}</p>
      )}

      {showReminderForm && (
        <div className="reminder-popup-form">
          <form onSubmit={handleReminderSubmit}>
            <h3>Set date and time for your reminder</h3>
            <input
              type="date"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required
            />
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              required
            />
            <div className="popup-buttons">
              <button type="submit" className="save-btn">Save</button>
              <button type="button" className="cancel-btn" onClick={() => setShowReminderForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default VoiceButton;
