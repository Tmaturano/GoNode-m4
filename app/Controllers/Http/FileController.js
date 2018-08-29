'use strict'

const File = use('App/Models/File')
const Helpers = use('Helpers')
/**
 * Resourceful controller for interacting with files
 */
class FileController {

  /**
   * Create/save a new file.
   * POST files
   */
  async store ({ request, response }) {
    try {
      // if there isn't a file with name file, do nothing
      if (!request.file('file')) return;

      const upload = request.file('file', { size: '2mb' })

      // Ex: timestamp.png
      const fileName = `${Date.now()}.${upload.subtype}`

      // move the file itself to the tmp\uploads folder
      await upload.move(Helpers.tmpPath('uploads'), {
        name: fileName
      })

      if (!upload.moved()) {
        throw upload.error()
      }

      const file = await File.create({
        file: fileName,
        name: upload.clientName,
        type: upload.type,
        subtype: upload.subtype
      })

      return file
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Error on uploading the file' } })
    }
  }


}

module.exports = FileController
