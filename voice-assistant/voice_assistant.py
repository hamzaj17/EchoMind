import speech_recognition as sr

def listen_and_print():
    recognizer = sr.Recognizer()
    mic = sr.Microphone()

    print("EchoMind is listening... Speak clearly.")

    with mic as source:
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source)

    try:
        command = recognizer.recognize_google(audio)
        print(f"You said: {command}")
        return command
    except sr.UnknownValueError:
        print("Sorry, EchoMind could not understand your speech.")
        return ""
    except sr.RequestError as e:
        print(f"Could not request results; {e}")
        return ""

if __name__ == "__main__":
    while True:
        command = listen_and_print()
        if "exit" in command.lower() or "stop" in command.lower():
            print("Exiting EchoMind voice assistant.")
            break
        
