// React hook for managing integrations
import { useState, useEffect, useCallback } from 'react';
import type { QuickBooksConfig, ShopifyConfig, IntegrationConfig, SyncResult } from '../types/integrations';
import { QuickBooksService } from '../lib/quickbooks';
import { ShopifyService } from '../lib/shopify';

const STORAGE_KEY = 'pos_integrations';

export function useIntegrations() {
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState<string | null>(null);

  // Load integrations from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setIntegrations(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load integrations:', error);
      }
    } else {
      // Initialize with default integrations
      const defaultIntegrations: IntegrationConfig[] = [
        {
          id: 'quickbooks',
          name: 'QuickBooks',
          type: 'quickbooks',
          enabled: false,
          connected: false,
          settings: {
            environment: 'sandbox',
            syncProducts: true,
            syncCustomers: true,
            syncInvoices: false,
            syncPayments: false,
            autoSync: false,
            syncInterval: 60,
          },
        },
        {
          id: 'shopify',
          name: 'Shopify',
          type: 'shopify',
          enabled: false,
          connected: false,
          settings: {
            syncProducts: true,
            syncOrders: true,
            syncCustomers: true,
            syncInventory: true,
            autoSync: false,
            syncInterval: 60,
          },
        },
      ];
      setIntegrations(defaultIntegrations);
      saveIntegrations(defaultIntegrations);
    }
  }, []);

  const saveIntegrations = useCallback((newIntegrations: IntegrationConfig[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newIntegrations));
  }, []);

  const updateIntegration = useCallback((id: string, updates: Partial<IntegrationConfig>) => {
    setIntegrations((prev) => {
      const updated = prev.map((integration) =>
        integration.id === id ? { ...integration, ...updates } : integration
      );
      saveIntegrations(updated);
      return updated;
    });
  }, [saveIntegrations]);

  const connectQuickBooks = useCallback(async (config: Partial<QuickBooksConfig['settings']>) => {
    setLoading(true);
    try {
      const integration = integrations.find((i) => i.id === 'quickbooks') as QuickBooksConfig;
      if (!integration) throw new Error('QuickBooks integration not found');

      const service = new QuickBooksService({ ...integration.settings, ...config });
      
      // Test connection
      if (config.accessToken && config.realmId) {
        const isConnected = await service.testConnection();
        if (!isConnected) {
          throw new Error('Failed to connect to QuickBooks');
        }
      }

      updateIntegration('quickbooks', {
        connected: true,
        connectedAt: new Date().toISOString(),
        settings: { ...integration.settings, ...config },
      });
    } catch (error: any) {
      throw new Error(`Failed to connect QuickBooks: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [integrations, updateIntegration]);

  const connectShopify = useCallback(async (config: Partial<ShopifyConfig['settings']>) => {
    setLoading(true);
    try {
      const integration = integrations.find((i) => i.id === 'shopify') as ShopifyConfig;
      if (!integration) throw new Error('Shopify integration not found');

      const service = new ShopifyService({ ...integration.settings, ...config });
      
      // Test connection
      if (config.accessToken && config.shopDomain) {
        const isConnected = await service.testConnection();
        if (!isConnected) {
          throw new Error('Failed to connect to Shopify');
        }
      }

      updateIntegration('shopify', {
        connected: true,
        connectedAt: new Date().toISOString(),
        settings: { ...integration.settings, ...config },
      });
    } catch (error: any) {
      throw new Error(`Failed to connect Shopify: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [integrations, updateIntegration]);

  const disconnectIntegration = useCallback((id: string) => {
    updateIntegration(id, {
      connected: false,
      connectedAt: undefined,
      settings: {
        ...(integrations.find((i) => i.id === id)?.settings || {}),
        accessToken: undefined,
        refreshToken: undefined,
        realmId: undefined,
        shopDomain: undefined,
      },
    });
  }, [integrations, updateIntegration]);

  const syncIntegration = useCallback(async (id: string): Promise<SyncResult> => {
    setSyncing(id);
    try {
      const integration = integrations.find((i) => i.id === id);
      if (!integration) throw new Error('Integration not found');
      if (!integration.connected) throw new Error('Integration is not connected');

      let result: SyncResult;

      if (integration.type === 'quickbooks') {
        const qbConfig = integration as QuickBooksConfig;
        const service = new QuickBooksService(qbConfig.settings);
        result = await service.syncData();
      } else if (integration.type === 'shopify') {
        const shopifyConfig = integration as ShopifyConfig;
        const service = new ShopifyService(shopifyConfig.settings);
        result = await service.syncData();
      } else {
        throw new Error('Unknown integration type');
      }

      updateIntegration(id, {
        lastSync: result.timestamp,
      });

      return result;
    } catch (error: any) {
      return {
        success: false,
        syncedItems: 0,
        errors: [error.message],
        timestamp: new Date().toISOString(),
      };
    } finally {
      setSyncing(null);
    }
  }, [integrations, updateIntegration]);

  const toggleIntegration = useCallback((id: string, enabled: boolean) => {
    updateIntegration(id, { enabled });
  }, [updateIntegration]);

  return {
    integrations,
    loading,
    syncing,
    updateIntegration,
    connectQuickBooks,
    connectShopify,
    disconnectIntegration,
    syncIntegration,
    toggleIntegration,
  };
}

