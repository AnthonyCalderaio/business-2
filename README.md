# business-2
Conceptual Flow Map of the App:
User Login/Authentication:

Step 1: The user logs into the application, possibly through email authentication, OAuth, or some other login method.
Step 2: The backend authenticates the user and generates a session token (or API key) for secure communication with the Resemble API.
Voice Creation/Customization:

Step 3: The user navigates to the "Create Voice" section where they can either:
Upload voice data (if they want to train a completely new voice).
Choose a base voice from a list of available voices (Resemble or custom voices that the platform has pre-built).
Step 4: If the user chooses to customize a voice:
They can adjust pitch, speed, and emotion settings to create variations like different accents, personalities, or tone.
Save the customized voice.
Voice Management:

Step 5: The user can see a list of their created voices.
This list could be shown on their profile page or a dedicated "My Voices" page.
Step 6: From this list, the user can:
Edit the voice (adjust settings like pitch, speed, emotion).
View details about each voice.
Delete voices if needed.
Text-to-Speech (Synthesize Audio):

Step 7: Once the user has customized a voice (or chosen one from the list), they can enter text for synthesis (e.g., audiobook chapters, sentences, or paragraphs).
Step 8: After entering the text, the user can:
Select the voice they want to use for the synthesis.
Set customizations like pitch, speed, and emotion (or reuse previous settings).
Step 9: The backend sends the text, selected voice ID, and settings to the Resemble API's synthesize endpoint.
The API returns an audio URL for the generated speech.
Step 10: The frontend will play the generated audio.
The user can preview the generated audio and make changes if necessary.
Audio Playback & Management:

Step 11: After generating the speech, the user can:
Play the audio (audiobook chapters, individual lines, etc.).
Download the audio file (if you provide this functionality).
Store the audio for later use or compilation into a full audiobook.
Final Output (Audiobook Creation):

Step 12: As the user creates multiple audio files (for each section or chapter of their audiobook), the app can help them compile these files together into a cohesive audiobook format (MP3, WAV, etc.).


# Deployments

## Backend
1) When you updated the branch, deploy with with: `git push heroku <branch-name>:main`
2) Listen to instance with saved command: `Backend: Monitor: Heroku instance` 
3) OPTIONAL: Only need to do this when you set up the app. Set .env keys with: saved command: `Backend: Set: .env key`. 

## Frontend
1) Push changes to the branch set to listen to in netlify and it will automatically deploy when pushing to that branch.


## Environment Variables
### Autho0 
keys: `domain` and `clientId` 
located: netlify
url: `https://app.netlify.com/sites/voiceforge/configuration/env#domain`

### Resemble.ai
keys: `RESEMBLE_API_KEY`
located: heroku

    