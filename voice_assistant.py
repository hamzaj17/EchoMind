import requests
import speech_recognition as sr

def listen_and_send():
    recognizer = sr.Recognizer()
    mic = sr.Microphone()

    print("EchoMind is listening. Please speak clearly.")

    with mic as source:
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source)

    try:
        command = recognizer.recognize_google(audio)
        print(f"You said: {command}")

        # Exit condition
        if "exit" in command.lower() or "stop" in command.lower():
            print("Goodbye. EchoMind is shutting down.")
            return False

        # Send to FastAPI backend for intent parsing
        response = requests.post("https://echomind-production-48ea.up.railway.app/parse", json={"text": command})
        backend_response = response.json()

        if backend_response.get("intent") == "unknown":
            print("Sorry, I can't understand, please say it again.")
        else:
            # Forward the same command to your Node backend for storage
            store_response = requests.post(
                "https://honest-analysis-production.up.railway.app/api/command",
                json={"text": command}
            )
            if store_response.status_code == 200:
                print("Your command has been processed and saved.")
            else:
                print("Sorry, there was a problem processing your command.")

    except sr.UnknownValueError:
        print("Sorry, I could not understand your speech.")
    except requests.exceptions.RequestException as e:
        print(f"Request error: {e}")

    return True

if __name__ == "__main__":
    while listen_and_send():
        pass
