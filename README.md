# Local Setup
* Clone the entire repo
  * Run `pnpm install` at the root level (needs keys for private repositories)

# Local Execution
Run `pnpm run batch`

# Github Execution
  * Edit the records.csv file with the following variables:
    -UTTERANCE: the text to be tested (usign text to speech)
    -EXPECTED TRANSCRIPT: (optional) when using an audio URL you can specify here the expected text based on the audio
    -VOICEID: (optional) when using an audio URL use this field to categorized the audio file voice
    -UTTERANCE TYPE: (optional) you can use this field to categorize the utterance (QUERY, DESTINATION, MEMBER ID, etc)
  
  * The github action will run automatically after the records.csv file has been updated, additionally you can start manually by going to the actions page and select the accuracy-tester workflow.
