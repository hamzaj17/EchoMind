import requests
import speech_recognition as sr

def listen_and_send():
    recognizer = sr.Recognizer()
    mic = sr.Microphone()

    print("EchoMind is listening... Speak clearly.")

    with mic as source:
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source)

    try:
        command = recognizer.recognize_google(audio)
        print(f"You said: {command}")

        # Send to Node backend
        response = requests.post("http://localhost:5000/command", json={"text": command})
        print(f"EchoMind Backend Response: {response.json()}")

        if "exit" in command.lower() or "stop" in command.lower():
            print("Exiting EchoMind voice assistant.")
            return False

    except sr.UnknownValueError:
        print("Sorry, EchoMind could not understand your speech.")
    except sr.RequestException as e:
        print(f"Request error: {e}")

    return True

if __name__ == "__main__":
    while listen_and_send():
        pass
