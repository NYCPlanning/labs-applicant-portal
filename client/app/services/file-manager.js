export default class FileManager {
  constructor(existingFiles, deleteFiles, uploadFiles) {
    this.existingFiles = existingFiles;
    this.deleteFiles = deleteFiles;
    this.uploadFiles = uploadFiles;
  }

  deleteFile(existingFile) {
    this.deleteFiles.addObject(existingFile);
    this.existingFiles.removeObject(existingFile);
  }

  undoDeleteFile(deleteFile) {
    this.existingFiles.addObject(deleteFile);
    this.deleteFiles.removeObject(deleteFile);
  }
}
