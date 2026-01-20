# translator_deep.py
from deep_translator import GoogleTranslator

# translate_text: detects source automatically, translates to target_lang
def translate_text(text: str, target_lang: str = 'en') -> str:
    try:
        translated = GoogleTranslator(source='auto', target=target_lang).translate(text)
        return translated
    except Exception as e:
        print("Translation error:", e)
        return text

# Example chatbot backend (replace with your real medical bot)
def get_answer_from_chatbot(user_query: str) -> str:
    return "Take two tablets of paracetamol every 8 hours after food."

# Predefined greetings in Kannada (and can extend for other langs)
GREETING_MAP = {
    "hi": {"kn": "ನಮಸ್ಕಾರ", "hi": "नमस्ते", "ta": "வணக்கம்"},
    "hello": {"kn": "ನಮಸ್ಕಾರ", "hi": "नमस्ते", "ta": "வணக்கம்"},
    "hey": {"kn": "ಹೇಲೋ", "hi": "अरे", "ta": "ஹேய்"}
}

def detect_language_request(user_query: str) -> str:
    query_lower = user_query.lower()
    if "kannada" in query_lower:
        return "kn"
    elif "hindi" in query_lower:
        return "hi"
    elif "tamil" in query_lower:
        return "ta"
    elif "english" in query_lower:
        return "en"
    return None

def respond(user_query: str, user_language: str = 'en') -> str:
    requested_lang = detect_language_request(user_query)
    if requested_lang:
        user_language = requested_lang

    # Check if query is a greeting
    for g in GREETING_MAP.keys():
        if g in user_query.lower():
            return GREETING_MAP[g].get(user_language, translate_text(g, user_language))

    # Otherwise, normal chatbot response
    answer = get_answer_from_chatbot(user_query)
    translated_answer = translate_text(answer, user_language)
    return translated_answer


if __name__ == "__main__":
    print(respond("hi answer me in Kannada"))  
    # Output: ನಮಸ್ಕಾರ

    print(respond("hello in Hindi"))  
    # Output: नमस्ते

    print(respond("I have fever, answer me in Kannada"))  
    # Output: ಜ್ವರ ಮತ್ತು ತಲೆನೋವಿಗೆ, ಆಹಾರದ ನಂತರ 8 ಗಂಟೆಗೆ ಎರಡು ಪ್ಯಾರಾಸಿಟಮಾಲ್ ಮಾತ್ರೆಗಳು ತೆಗೆದುಕೊಳ್ಳಿ.
