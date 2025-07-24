import speech_recognition as sr
import pyttsx3
import requests
import time

backend_url = "https://honest-analysis-production.up.railway.app/api/command"

def speak(text):
    print(f"EchoMind: {text}")
    engine = pyttsx3.init()  # Reinitialize each time to avoid lock issues
    engine.setProperty('rate', 200)
    engine.setProperty('volume', 1.0)
    engine.say(text)
    engine.runAndWait()
    time.sleep(0.1)  # Ensure proper release

def listen_and_send():
    recognizer = sr.Recognizer()
    mic = sr.Microphone()

    speak("EchoMind is listening. Please say your command.")

    with mic as source:
        recognizer.adjust_for_ambient_noise(source, duration=0.5)
        audio = recognizer.listen(source)

    try:
        command = recognizer.recognize_google(audio)
        print(f"You said: {command}")
        # speak(f"You said: {command}")

        if command.lower() in ["stop", "exit", "quit"]:
            speak("EchoMind has stopped listening. Goodbye.")
            return False

        # Send command to backend
        response = requests.post(backend_url, json={"command": command})
        data = response.json()

        msg = data.get('message', "Command processed and stored successfully.")
        speak(msg)

    except sr.UnknownValueError:
        speak("Sorry, I couldn't understand. Please repeat.")
    except sr.RequestError as e:
        speak(f"Could not connect to the speech recognition service. Error: {e}")
    except Exception as e:
        speak(f"An error occurred: {e}")

    return True

if __name__ == "__main__":
    while True:
        if not listen_and_send():
            break
