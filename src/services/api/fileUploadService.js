import fileUploadData from '../mockData/fileUpload.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class FileUploadService {
  constructor() {
    this.files = [...fileUploadData];
    this.uploadPromises = new Map(); // Track active uploads
  }

  async getAll() {
    await delay(200);
    return [...this.files];
  }

  async getById(id) {
    await delay(150);
    const file = this.files.find(f => f.id === id);
    return file ? { ...file } : null;
  }

  async create(fileData) {
    await delay(300);
    const newFile = {
      id: Date.now().toString(),
      name: fileData.name,
      size: fileData.size,
      type: fileData.type,
      status: 'pending',
      progress: 0,
      uploadedAt: null,
      thumbnailUrl: fileData.thumbnailUrl || null,
      ...fileData
    };
    
    this.files.push(newFile);
    return { ...newFile };
  }

  async update(id, updates) {
    await delay(200);
    const index = this.files.findIndex(f => f.id === id);
    if (index === -1) throw new Error('File not found');
    
    this.files[index] = { ...this.files[index], ...updates };
    return { ...this.files[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.files.findIndex(f => f.id === id);
    if (index === -1) throw new Error('File not found');
    
    // Cancel upload if in progress
    if (this.uploadPromises.has(id)) {
      this.uploadPromises.get(id).cancel();
      this.uploadPromises.delete(id);
    }
    
    const deleted = this.files.splice(index, 1)[0];
    return { ...deleted };
  }

  // Simulate file upload with progress
  async uploadFile(id, onProgress) {
    const file = this.files.find(f => f.id === id);
    if (!file) throw new Error('File not found');

    // Create cancellable upload promise
    let cancelled = false;
    const uploadPromise = {
      cancel: () => { cancelled = true; }
    };
    this.uploadPromises.set(id, uploadPromise);

    try {
      // Update status to uploading
      await this.update(id, { status: 'uploading', progress: 0 });

      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += Math.random() * 15) {
        if (cancelled) {
          await this.update(id, { status: 'cancelled', progress: 0 });
          throw new Error('Upload cancelled');
        }

        const currentProgress = Math.min(100, Math.round(progress));
        await this.update(id, { progress: currentProgress });
        
        if (onProgress) onProgress(currentProgress);
        
        // Simulate network delay
        await delay(Math.random() * 200 + 100);
      }

      // Complete upload
      await this.update(id, { 
        status: 'completed', 
        progress: 100,
        uploadedAt: new Date().toISOString()
      });

      this.uploadPromises.delete(id);
      return this.getById(id);

    } catch (error) {
      if (!cancelled) {
        await this.update(id, { status: 'error', progress: 0 });
      }
      this.uploadPromises.delete(id);
      throw error;
    }
  }

  async pauseUpload(id) {
    if (this.uploadPromises.has(id)) {
      this.uploadPromises.get(id).cancel();
      this.uploadPromises.delete(id);
      await this.update(id, { status: 'paused' });
    }
  }

  async resumeUpload(id, onProgress) {
    return this.uploadFile(id, onProgress);
  }

  async cancelUpload(id) {
    if (this.uploadPromises.has(id)) {
      this.uploadPromises.get(id).cancel();
      this.uploadPromises.delete(id);
    }
    await this.update(id, { status: 'cancelled', progress: 0 });
  }

  // Utility methods
  getFilesByStatus(status) {
    return this.files.filter(f => f.status === status);
  }

  getTotalSize(fileIds = null) {
    const files = fileIds ? this.files.filter(f => fileIds.includes(f.id)) : this.files;
    return files.reduce((total, file) => total + (file.size || 0), 0);
  }

  getCompletedFiles() {
    return this.files.filter(f => f.status === 'completed');
  }

  clearCompleted() {
    this.files = this.files.filter(f => f.status !== 'completed');
    return this.files.length;
  }
}

export default new FileUploadService();