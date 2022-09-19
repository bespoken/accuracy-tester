# Overview
The accuracy tester 
# Test Definition
## Utterance Set
The utterances are defined in the [records.csv file](input/records.csv).

The key fields are:
* UTTERANCE: the text to be tested (usign text to speech)
* EXPECTED TRANSCRIPT: (optional) when using an audio URL you can specify here the expected text based on the audio
* VOICEID: (optional) when using an audio URL use this field to categorized the audio file voice
* UTTERANCE TYPE: (optional) you can use this field to categorize the utterance (QUERY, DESTINATION, MEMBER ID, etc)

## Platforms
The platforms to be tested are defined here:  
https://github.com/bespoken/accuracy-tester/blob/main/input/accuracy-test.json#L3

This test is currently configured to run with `azure`, `dialogflow`, and `lex`.

Contact Bespoken for a full list of supported platforms and assistance with setting up.

## Voices
The voices use to generate sample audio are defined in the configuration file here:  
https://github.com/bespoken/accuracy-tester/blob/main/input/accuracy-test.json#L35

# Execution
## Local Execution
* Clone the entire repo
  * Run `pnpm install` at the root level (needs keys for private repositories)
  
* Run `pnpm run batch`

## Github Execution
The github action will run automatically after the records.csv file has been updated, additionally you can start manually by going to the actions page and select the Accuracy Test Runner workflow.

# Results
The results are created as CSV file for each GitHub action run.

Additionally, they can be configured to send data to:
* CloudWatch
* DataDog
* Metabase
* MySQL 
