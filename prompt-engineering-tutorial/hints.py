"""
Hints and solutions for the Prompt Engineering Tutorial exercises.

Usage:
    from hints import get_hint, get_solution

    # Get a hint for an exercise
    print(get_hint("1.1"))

    # Get the full solution
    print(get_solution("1.1"))
"""


# ============================================================
# Chapter 1: Basic Prompt Structure
# ============================================================

hint_1_1 = "Try asking Claude directly to count. Be explicit about what numbers you want."
solution_1_1 = "Count from 1 to 3."

hint_1_2 = "Use the system prompt to set Claude's persona. Tell it to act like a toddler."
solution_1_2 = "You are a 3-year-old child. Respond to everything as a curious toddler would — use simple words, get excited easily, and ask 'why' a lot."

# ============================================================
# Chapter 2: Being Clear and Direct
# ============================================================

hint_2_1 = "Tell Claude what language to respond in via the system prompt."
solution_2_1 = "Always respond in Spanish, regardless of the language the user writes in."

hint_2_2 = "Be very explicit: tell Claude to output ONLY the name, nothing else — no punctuation, no explanation."
solution_2_2 = "Who is the best basketball player of all time? Respond with only the player's name — no punctuation, no explanation, no other text. Just the name."

hint_2_3 = "Ask for a detailed, comprehensive explanation of a broad topic. You can ask for multiple sections without using the word 'word'."
solution_2_3 = "Write a comprehensive, extremely detailed essay about the history of the Roman Empire. Cover the founding, the Republic, the transition to Empire, major emperors, military campaigns, cultural achievements, and the fall. Include as much detail as possible for each section."

# ============================================================
# Chapter 3: Assigning Roles
# ============================================================

hint_3_1 = "Give Claude a role that would naturally catch math errors — like a math teacher or fact-checker."
solution_3_1 = "You are a strict math teacher who carefully checks every equation. If the math is wrong, you must point out the error clearly and explain the correct answer."

# ============================================================
# Chapter 4: Separating Data from Instructions
# ============================================================

hint_4_1 = "Use an f-string with the TOPIC variable and ask Claude to write a haiku."
solution_4_1 = 'f"Write a haiku about <topic>{TOPIC}</topic>."'

hint_4_2 = "Wrap the sentence in XML tags so Claude knows where the question data is."
solution_4_2 = 'f"What color is the dog in the following sentence? <sentence>the brown dog sat on the porch</sentence>"'

hint_4_3 = 'Remove the confusing "a]" and the list formatting that confuses Claude.'
solution_4_3 = "What color is the dog in this sentence: the brown dog sat on the porch"

# ============================================================
# Chapter 5: Formatting Output & Speaking for Claude
# ============================================================

hint_5_1 = "Start Claude's response with text that steers it toward arguing for Curry."
solution_5_1 = "In my opinion, Stephen Curry is the greatest basketball player of all time. As a Golden State Warrior,"

hint_5_2 = "Ask for two haikus and tell Claude to wrap each one in <haiku> tags."
solution_5_2 = "Write two haikus about nature. Wrap each haiku in its own <haiku> tags."

hint_5_3 = "Use f-string variables and ask for one haiku per animal, each in <haiku> tags."
solution_5_3 = 'f"Write two haikus. The first about a {ANIMAL1} and the second about a {ANIMAL2}. Wrap each in <haiku> tags."'

# ============================================================
# Chapter 6: Precognition (Thinking Step by Step)
# ============================================================

hint_6_1 = "List the four categories clearly and ask Claude to classify the email."
solution_6_1 = """Classify this email into one of these categories:
(A) Pre-sale question
(B) Broken or defective item
(C) Billing question
(D) Other

<email>{email}</email>

Output the letter and category name."""

hint_6_2 = "Add instructions to think step by step before putting the answer letter in <answer> tags."
solution_6_2 = """Classify this email into one of these categories:
(A) Pre-sale question
(B) Broken or defective item
(C) Billing question
(D) Other

<email>{email}</email>

Think through your reasoning step by step. Then put ONLY the category letter in <answer> tags."""

# ============================================================
# Chapter 7: Using Examples (Few-Shot Prompting)
# ============================================================

hint_7_1 = "Provide 2-3 example email classifications where the last character is always the category letter."
solution_7_1 = """Classify emails into categories. The last character of your response must be the category letter.

Categories:
(A) Pre-sale question
(B) Broken or defective item
(C) Billing question
(D) Other

<examples>
Email: "Do you offer volume discounts for teams over 50 people?"
This is a question about purchasing before buying. Category: A

Email: "My account shows a charge I don't recognize from last Tuesday."
This is about a billing concern. Category: C

Email: "The screen on my device has dead pixels right out of the box."
This is about receiving a broken item. Category: B
</examples>

Email: "{email}"
"""

# ============================================================
# Chapter 8: Avoiding Hallucinations
# ============================================================

hint_8_1 = "Tell Claude it's okay to not know exact details and to qualify uncertain information."
solution_8_1 = "How many studio albums has Beyonce released and what are all their names? Only include albums you're confident about. If you're not certain about any details, say so rather than guessing."

hint_8_2 = "Use a prompt that requires Claude to extract relevant quotes before answering."
solution_8_2 = """Based on the document below, answer the question.

<document>{REPORT}</document>

<question>{QUESTION}</question>

First, extract the exact relevant quotes from the document in <quotes> tags.
Then provide your answer in <answer> tags, using only information from the quotes.
If the document doesn't contain enough information, say so."""

# ============================================================
# Chapter 9: Complex Prompts from Scratch
# ============================================================

hint_9_1 = "Combine: system prompt for role, XML tags for data, step-by-step thinking, and output formatting."
solution_9_1_system = "You are a helpful tax accounting assistant. You provide clear, accurate tax calculations based on provided tax information. Always include disclaimers that this is not professional tax advice."
solution_9_1_prompt = """Using the tax information provided, help the user with their tax question.

RULES:
- Only use the tax data provided — do not reference information not in the documents
- Show your calculations step by step
- Always include a disclaimer about seeking professional advice
- Cite specific numbers from the provided data

<tax_docs>{TAX_INFO}</tax_docs>

<question>{USER_QUESTION}</question>

First, extract the relevant tax data in <quotes> tags.
Then show your step-by-step calculation in <calculation> tags.
Finally, provide your answer in <answer> tags."""

hint_9_2 = "Use a system prompt for the Socratic tutor role, identify issues in tags, then ask guiding questions."
solution_9_2_system = "You are a patient, encouraging code review tutor. You use the Socratic method — guide students to discover issues themselves through thoughtful questions rather than giving direct answers."
solution_9_2_prompt = """Review the following code and help the student improve it using the Socratic method.

RULES:
- Never give the fix directly — ask guiding questions instead
- Be encouraging and positive about what's done well
- Focus on the most critical issues first
- Explain WHY something matters, not just WHAT to fix

<code>
{CODE_SNIPPET}
</code>

First, identify the issues you see in <issues> tags (the student won't see this).
Then write your Socratic response in <response> tags, using questions to guide the student."""


# ============================================================
# Helper functions
# ============================================================

_hints = {
    "1.1": hint_1_1, "1.2": hint_1_2,
    "2.1": hint_2_1, "2.2": hint_2_2, "2.3": hint_2_3,
    "3.1": hint_3_1,
    "4.1": hint_4_1, "4.2": hint_4_2, "4.3": hint_4_3,
    "5.1": hint_5_1, "5.2": hint_5_2, "5.3": hint_5_3,
    "6.1": hint_6_1, "6.2": hint_6_2,
    "7.1": hint_7_1,
    "8.1": hint_8_1, "8.2": hint_8_2,
    "9.1": hint_9_1, "9.2": hint_9_2,
}

_solutions = {
    "1.1": solution_1_1, "1.2": solution_1_2,
    "2.1": solution_2_1, "2.2": solution_2_2, "2.3": solution_2_3,
    "3.1": solution_3_1,
    "4.1": solution_4_1, "4.2": solution_4_2, "4.3": solution_4_3,
    "5.1": solution_5_1, "5.2": solution_5_2, "5.3": solution_5_3,
    "6.1": solution_6_1, "6.2": solution_6_2,
    "7.1": solution_7_1,
    "8.1": solution_8_1, "8.2": solution_8_2,
    "9.1": solution_9_1_prompt, "9.2": solution_9_2_prompt,
}


def get_hint(exercise_id: str) -> str:
    """Get a hint for an exercise. Example: get_hint('1.1')"""
    if exercise_id in _hints:
        return f"💡 Hint for Exercise {exercise_id}:\n{_hints[exercise_id]}"
    return f"No hint found for exercise '{exercise_id}'. Available: {', '.join(sorted(_hints.keys()))}"


def get_solution(exercise_id: str) -> str:
    """Get the full solution for an exercise. Example: get_solution('2.2')"""
    if exercise_id in _solutions:
        return f"Solution for Exercise {exercise_id}:\n\n{_solutions[exercise_id]}"
    return f"No solution found for exercise '{exercise_id}'. Available: {', '.join(sorted(_solutions.keys()))}"
