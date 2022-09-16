const Config = require('@bespoken-api/shared/lib/config')
const fs = require('fs')
const logger = require('@bespoken-api/shared/lib/logger')('ACCSRC')
const parse = require('csv/sync').parse
const Record = require('@bespoken-api/batch/lib/record')
const Source = require('@bespoken-api/batch/lib/source')

class AccuracySource extends Source {
/**
   * Loads all records - this function must be implemented by subclasses
   * @returns {Promise<Record[]>} The records to be processed
   */
  async loadAll () {
    logger.info('load all')
    const data = fs.readFileSync('input/records.csv')
    
    const rawRecords = parse(data, {
      columns: true
    })

    const voices = Config.get('voices')
    const records = []
    for (const rawRecord of rawRecords) {
      const utterance = rawRecord.UTTERANCE
      
      logger.info('utterance: ' + utterance)
      const deviceMap = Config.get('devices')
      for (const deviceKey of Object.keys(deviceMap)) {
        if (deviceKey == "transcribe") continue
        const deviceInfo = deviceMap[deviceKey]
        
        if (rawRecord.UTTERANCE.includes("download&id")) {
          const record = new Record(rawRecord.UTTERANCE)
          record.voiceID = rawRecord.VOICEID
          record.deviceToken = deviceKey
          record.addSetting("expectedTranscript", rawRecord['EXPECTED TRANSCRIPT'])
          record.addSetting("utteranceType", rawRecord["UTTERANCE TYPE"])
          logger.info('adding record: ' + utterance + ' for device: ' + deviceKey)
          records.push(record)
          continue;
        }
        for (const voice of voices) {
          const record = new Record(rawRecord.UTTERANCE)
          record.voiceID = voice
          record.deviceToken = deviceKey
          record.addSetting("utteranceType", rawRecord["UTTERANCE TYPE"])
          logger.info('adding record: ' + utterance + ' for device: ' + deviceKey)
          records.push(record)
        }
        
      }
    }
    return records
  }

}

module.exports = AccuracySource