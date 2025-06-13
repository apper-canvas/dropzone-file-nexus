import uploadSessionData from '../mockData/uploadSession.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UploadSessionService {
  constructor() {
    this.sessions = [...uploadSessionData];
    this.currentSession = null;
  }

  async getAll() {
    await delay(200);
    return [...this.sessions];
  }

  async getCurrentSession() {
    await delay(150);
    return this.currentSession ? { ...this.currentSession } : null;
  }

  async createSession(sessionData) {
    await delay(300);
    const newSession = {
      id: Date.now().toString(),
      totalFiles: sessionData.totalFiles || 0,
      totalSize: sessionData.totalSize || 0,
      completedFiles: 0,
      startTime: new Date().toISOString(),
      endTime: null,
      status: 'active',
      ...sessionData
    };
    
    this.sessions.push(newSession);
    this.currentSession = newSession;
    return { ...newSession };
  }

  async updateSession(id, updates) {
    await delay(200);
    const index = this.sessions.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Session not found');
    
    this.sessions[index] = { ...this.sessions[index], ...updates };
    
    if (this.currentSession && this.currentSession.id === id) {
      this.currentSession = { ...this.sessions[index] };
    }
    
    return { ...this.sessions[index] };
  }

  async completeSession(id) {
    await delay(250);
    const session = await this.updateSession(id, {
      status: 'completed',
      endTime: new Date().toISOString()
    });
    
    if (this.currentSession && this.currentSession.id === id) {
      this.currentSession = null;
    }
    
    return session;
  }

  async cancelSession(id) {
    await delay(200);
    const session = await this.updateSession(id, {
      status: 'cancelled',
      endTime: new Date().toISOString()
    });
    
    if (this.currentSession && this.currentSession.id === id) {
      this.currentSession = null;
    }
    
    return session;
  }

  // Utility methods
  getSessionStats(id) {
    const session = this.sessions.find(s => s.id === id);
    if (!session) return null;

    const duration = session.endTime 
      ? new Date(session.endTime) - new Date(session.startTime)
      : Date.now() - new Date(session.startTime);

    return {
      ...session,
      duration: Math.round(duration / 1000), // in seconds
      averageSpeed: session.totalSize / (duration / 1000), // bytes per second
      completionRate: session.totalFiles > 0 ? (session.completedFiles / session.totalFiles) * 100 : 0
    };
  }
}

export default new UploadSessionService();