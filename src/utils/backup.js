// Backup and Recovery System
class BackupManager {
  constructor() {
    this.backupInterval = null;
    this.autoBackupEnabled = false;
    this.backupHistory = JSON.parse(localStorage.getItem('backup_history') || '[]');
  }

  // Enable automatic backups
  enableAutoBackup(intervalMinutes = 60) {
    this.autoBackupEnabled = true;
    
    this.backupInterval = setInterval(() => {
      this.createBackup('auto');
    }, intervalMinutes * 60 * 1000);

    console.log(`✅ Automatic backups enabled (every ${intervalMinutes} minutes)`);
  }

  // Disable automatic backups
  disableAutoBackup() {
    this.autoBackupEnabled = false;
    
    if (this.backupInterval) {
      clearInterval(this.backupInterval);
      this.backupInterval = null;
    }

    console.log('❌ Automatic backups disabled');
  }

  // Create a new backup
  async createBackup(type = 'manual', description = '') {
    const timestamp = new Date().toISOString();
    const backupId = `backup_${timestamp.replace(/[:.]/g, '-')}`;

    try {
      // Collect all application data
      const backupData = {
        id: backupId,
        timestamp,
        type,
        description,
        version: '1.0.0',
        data: {
          simulations: JSON.parse(localStorage.getItem('simulations') || '[]'),
          agents: JSON.parse(localStorage.getItem('agents') || '[]'),
          reports: JSON.parse(localStorage.getItem('reports') || '[]'),
          auditLogs: JSON.parse(localStorage.getItem('audit_logs') || '[]'),
          users: JSON.parse(localStorage.getItem('users') || '[]'),
          settings: JSON.parse(localStorage.getItem('security_settings') || '{}'),
          siemIntegrations: JSON.parse(localStorage.getItem('siem_integrations') || '[]')
        },
        stats: {
          simulations: JSON.parse(localStorage.getItem('simulations') || '[]').length,
          agents: JSON.parse(localStorage.getItem('agents') || '[]').length,
          reports: JSON.parse(localStorage.getItem('reports') || '[]').length,
          auditLogs: JSON.parse(localStorage.getItem('audit_logs') || '[]').length
        },
        checksum: this.generateChecksum()
      };

      // Store backup in localStorage (in production, this would be server-side)
      const backupKey = `backup_${backupId}`;
      localStorage.setItem(backupKey, JSON.stringify(backupData));

      // Update backup history
      this.backupHistory.unshift({
        id: backupId,
        timestamp,
        type,
        description,
        size: JSON.stringify(backupData).length,
        stats: backupData.stats
      });

      // Keep only last 50 backups
      this.backupHistory = this.backupHistory.slice(0, 50);
      localStorage.setItem('backup_history', JSON.stringify(this.backupHistory));

      console.log(`✅ Backup created: ${backupId}`, backupData.stats);
      return backupData;

    } catch (error) {
      console.error('❌ Backup creation failed:', error);
      throw new Error(`Backup failed: ${error.message}`);
    }
  }

  // Restore from backup
  async restoreBackup(backupId) {
    try {
      const backupKey = `backup_${backupId}`;
      const backupData = JSON.parse(localStorage.getItem(backupKey));

      if (!backupData) {
        throw new Error('Backup not found');
      }

      // Verify backup integrity
      if (!this.verifyBackup(backupData)) {
        throw new Error('Backup integrity check failed');
      }

      // Restore data
      Object.entries(backupData.data).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value));
      });

      // Update backup history
      this.backupHistory = this.backupHistory.map(backup =>
        backup.id === backupId 
          ? { ...backup, lastRestored: new Date().toISOString() }
          : backup
      );

      localStorage.setItem('backup_history', JSON.stringify(this.backupHistory));

      console.log(`✅ Backup restored: ${backupId}`);
      return true;

    } catch (error) {
      console.error('❌ Backup restoration failed:', error);
      throw new Error(`Restore failed: ${error.message}`);
    }
  }

  // Delete backup
  deleteBackup(backupId) {
    try {
      // Remove backup data
      localStorage.removeItem(`backup_${backupId}`);

      // Remove from history
      this.backupHistory = this.backupHistory.filter(backup => backup.id !== backupId);
      localStorage.setItem('backup_history', JSON.stringify(this.backupHistory));

      console.log(`✅ Backup deleted: ${backupId}`);
      return true;

    } catch (error) {
      console.error('❌ Backup deletion failed:', error);
      throw new Error(`Delete failed: ${error.message}`);
    }
  }

  // Export backup to file
  exportBackup(backupId) {
    const backupKey = `backup_${backupId}`;
    const backupData = localStorage.getItem(backupKey);

    if (!backupData) {
      throw new Error('Backup not found');
    }

    const blob = new Blob([backupData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `spysim_backup_${backupId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log(`✅ Backup exported: ${backupId}`);
  }

  // Import backup from file
  importBackup(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const backupData = JSON.parse(e.target.result);
          
          if (!this.verifyBackup(backupData)) {
            throw new Error('Invalid backup file format');
          }

          // Store the imported backup
          const backupKey = `backup_${backupData.id}`;
          localStorage.setItem(backupKey, JSON.stringify(backupData));

          // Add to history if not already present
          const exists = this.backupHistory.some(backup => backup.id === backupData.id);
          if (!exists) {
            this.backupHistory.unshift({
              id: backupData.id,
              timestamp: backupData.timestamp,
              type: 'imported',
              description: `Imported from file: ${file.name}`,
              size: JSON.stringify(backupData).length,
              stats: backupData.stats
            });

            localStorage.setItem('backup_history', JSON.stringify(this.backupHistory));
          }

          console.log(`✅ Backup imported: ${backupData.id}`);
          resolve(backupData);

        } catch (error) {
          reject(new Error(`Import failed: ${error.message}`));
        }
      };

      reader.onerror = () => reject(new Error('File reading failed'));
      reader.readAsText(file);
    });
  }

  // Generate checksum for backup verification
  generateChecksum() {
    const data = {
      simulations: localStorage.getItem('simulations'),
      agents: localStorage.getItem('agents'),
      reports: localStorage.getItem('reports'),
      timestamp: Date.now()
    };

    return btoa(JSON.stringify(data)).slice(0, 32);
  }

  // Verify backup integrity
  verifyBackup(backupData) {
    if (!backupData.id || !backupData.timestamp || !backupData.data) {
      return false;
    }

    // Basic structure validation
    const requiredKeys = ['simulations', 'agents', 'reports', 'auditLogs'];
    return requiredKeys.every(key => Array.isArray(backupData.data[key]));
  }

  // Get backup statistics
  getBackupStats() {
    const totalSize = this.backupHistory.reduce((sum, backup) => sum + backup.size, 0);
    const manualBackups = this.backupHistory.filter(b => b.type === 'manual').length;
    const autoBackups = this.backupHistory.filter(b => b.type === 'auto').length;

    return {
      totalBackups: this.backupHistory.length,
      totalSize: (totalSize / 1024 / 1024).toFixed(2), // MB
      manualBackups,
      autoBackups,
      lastBackup: this.backupHistory[0]?.timestamp || null,
      autoBackupEnabled: this.autoBackupEnabled
    };
  }

  // Clean up old backups
  cleanupOldBackups(maxAgeDays = 30) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - maxAgeDays);

    const oldBackups = this.backupHistory.filter(backup => 
      new Date(backup.timestamp) < cutoff
    );

    oldBackups.forEach(backup => {
      this.deleteBackup(backup.id);
    });

    console.log(`🧹 Cleaned up ${oldBackups.length} old backups`);
    return oldBackups.length;
  }
}

// Create singleton instance
export const backupManager = new BackupManager();

export default backupManager;
