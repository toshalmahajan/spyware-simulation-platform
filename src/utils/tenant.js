// Multi-tenant support for enterprise deployments
class TenantManager {
  constructor() {
    this.tenants = new Map();
    this.currentTenant = null;
    this.isMultiTenant = false;
  }

  // Initialize tenant manager
  initialize(config) {
    this.isMultiTenant = config.multiTenant || false;
    
    if (this.isMultiTenant) {
      this.loadTenants();
      console.log('🏢 Multi-tenant mode activated');
    } else {
      console.log('👤 Single-tenant mode activated');
    }
  }

  // Load tenants from configuration
  loadTenants() {
    const tenantConfig = JSON.parse(localStorage.getItem('tenant_config') || '[]');
    
    tenantConfig.forEach(tenant => {
      this.tenants.set(tenant.id, {
        ...tenant,
        encryptionKey: this.generateTenantKey(tenant.id),
        isolated: tenant.isolated || false,
        features: tenant.features || {}
      });
    });

    // Set default tenant
    if (tenantConfig.length > 0) {
      this.currentTenant = tenantConfig[0].id;
    }
  }

  // Generate tenant-specific encryption key
  generateTenantKey(tenantId) {
    return `tenant_key_${tenantId}_${Date.now()}`;
  }

  // Switch current tenant
  switchTenant(tenantId) {
    if (this.tenants.has(tenantId)) {
      this.currentTenant = tenantId;
      localStorage.setItem('current_tenant', tenantId);
      console.log(`🔄 Switched to tenant: ${tenantId}`);
      return true;
    }
    return false;
  }

  // Get current tenant configuration
  getCurrentTenant() {
    if (!this.isMultiTenant) {
      return {
        id: 'default',
        name: 'Default Organization',
        isolated: false,
        features: { all: true }
      };
    }
    
    return this.tenants.get(this.currentTenant) || null;
  }

  // Check if feature is enabled for current tenant
  isFeatureEnabled(feature) {
    const tenant = this.getCurrentTenant();
    return tenant?.features?.[feature] !== false;
  }

  // Tenant-specific data isolation
  scopeData(data, dataType) {
    const tenant = this.getCurrentTenant();
    
    if (tenant.isolated) {
      return {
        ...data,
        _tenant: tenant.id,
        _scoped: true,
        _timestamp: new Date().toISOString()
      };
    }
    
    return data;
  }

  // Filter data by tenant
  filterByTenant(data) {
    if (!this.isMultiTenant) return data;
    
    const tenant = this.getCurrentTenant();
    return data.filter(item => 
      !item._tenant || item._tenant === tenant.id
    );
  }

  // Create new tenant
  createTenant(config) {
    const tenantId = `tenant_${Date.now()}`;
    const newTenant = {
      id: tenantId,
      name: config.name,
      description: config.description,
      isolated: config.isolated || false,
      features: config.features || {},
      createdAt: new Date().toISOString(),
      encryptionKey: this.generateTenantKey(tenantId)
    };

    this.tenants.set(tenantId, newTenant);
    this.saveTenants();
    
    return newTenant;
  }

  // Save tenants to persistent storage
  saveTenants() {
    const tenantsArray = Array.from(this.tenants.values());
    localStorage.setItem('tenant_config', JSON.stringify(tenantsArray));
  }

  // Get tenant statistics
  getTenantStats() {
    const stats = {
      totalTenants: this.tenants.size,
      activeTenant: this.currentTenant,
      features: {}
    };

    // Count features across tenants
    this.tenants.forEach(tenant => {
      Object.keys(tenant.features || {}).forEach(feature => {
        stats.features[feature] = (stats.features[feature] || 0) + 1;
      });
    });

    return stats;
  }

  // Export tenant data for backup
  exportTenantData(tenantId) {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) return null;

    // Get all data scoped to this tenant
    const tenantData = {
      tenant,
      simulations: this.filterByTenant(JSON.parse(localStorage.getItem('simulations') || '[]')),
      agents: this.filterByTenant(JSON.parse(localStorage.getItem('agents') || '[]')),
      reports: this.filterByTenant(JSON.parse(localStorage.getItem('reports') || '[]')),
      auditLogs: this.filterByTenant(JSON.parse(localStorage.getItem('audit_logs') || '[]')),
      exportDate: new Date().toISOString()
    };

    return tenantData;
  }
}

// Create singleton instance
export const tenantManager = new TenantManager();

// Initialize with default config
tenantManager.initialize({ 
  multiTenant: localStorage.getItem('multi_tenant') === 'true' 
});

export default tenantManager;
