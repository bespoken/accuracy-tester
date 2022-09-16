const Config = require('@bespoken-api/shared/lib/config')
const Interceptor = require('@bespoken-api/batch/lib/interceptor')
const logger = require('@bespoken-api/shared/lib/logger')('ACCINT')
const Record = require('@bespoken-api/batch/lib/record')
const Result = require('@bespoken-api/batch/lib/result')
const { wordsToNumbers } = require('words-to-numbers')
const fs = require('fs')
const testingJsonPath = require.resolve("../input/accuracy-test.json");
const testingJsonContents = fs.readFileSync(testingJsonPath).toString();

class AccuracyInterceptor extends Interceptor {


  async interceptRecord (record) {
    const spanishSpeakers = Config.get('accentedVoices').spanish;
    if (spanishSpeakers.includes(record.voiceID)) {
      let spanishPhonemes = Config.get('phonemes').spanish;
      const spanishPhonemesKeys = spanishPhonemes && Object.keys(spanishPhonemes);
      if (spanishPhonemesKeys) {
        for (let i = 0; i < spanishPhonemesKeys.length; i++) {
          let spanishPhoneme = spanishPhonemesKeys[i];
          record.utterance = record.utterance.replace(`${spanishPhoneme}`, `${spanishPhonemes[spanishPhoneme]}`)
        }
      }
    }
    return true
  }

  /**
     * Allows for making changes to a result after it has been processed
     * @param {Record} record
     * @param {Result} result
     * @returns {Promise<boolean>} True to include the record, false to exclude it
     */
  async interceptResult (record, result) {
    const transcript = result?.lastResponse?.results[0]?.text
    let removeSpecial = transcript?.trim().replace(/\./g, "");
    let parsedWordToNumbers = removeSpecial && wordsToNumbers(removeSpecial).toString().toLowerCase();
    let homophonesConfig = Config.get('homophones');
    const homophonesGroup = Object.keys(homophonesConfig);
    for(let i = 0; i < homophonesGroup.length; i++) {
      let homophoneKey = homophonesGroup[i];
      let homophones = homophonesConfig[homophoneKey];      
      for (let j = 0; j < homophones.length; j++) {
        let homophone = homophones[j];
        parsedWordToNumbers = parsedWordToNumbers && parsedWordToNumbers.replace(`${homophone} `, `${homophoneKey.replace(/_/g, ' ')} `)
        parsedWordToNumbers = parsedWordToNumbers && parsedWordToNumbers.replace(` ${homophone}`, ` ${homophoneKey.replace(/_/g, ' ')}`)
        if (homophone.length > 1) parsedWordToNumbers = parsedWordToNumbers && parsedWordToNumbers.replace(homophone, homophoneKey.replace(/_/g, ' '))
      }
    }

    // switch all 0 to o
    parsedWordToNumbers = parsedWordToNumbers.replace(/0/g, "o");
    
    let expectedTranscript;
    if (result?.record?._settings?.expectedTranscript) {
      expectedTranscript = result.record._settings.expectedTranscript.replace(/0/g, "o");
      result.success = expectedTranscript == parsedWordToNumbers;
    } else {
      expectedTranscript = result.record.utteranceRaw?.replace(/0/g, "o")
      result.success = expectedTranscript == parsedWordToNumbers;
    }

    record.addOutputField("UTTERANCE TYPE", result?.record?._settings?.utteranceType || "N/A")
    record.addOutputField('EXPECTED TRANSCRIPT', expectedTranscript)
    record.addOutputField('TRANSCRIPT', parsedWordToNumbers)
    record.addOutputField('ACTUAL UTTERANCE', result.record.utterance ? result.record.utterance : 'N/A')
    record.addOutputField('PLATFORM', record.deviceToken ? record.deviceToken : 'N/A')
    record.addOutputField('VOICE', record.voiceID ? record.voiceID : 'en-US-Wavenet-D')
    record.addOutputField('ACTUAL TRANSCRIPT', transcript)
    return true
  }
}

module.exports = AccuracyInterceptor