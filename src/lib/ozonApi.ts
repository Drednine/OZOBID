import axios from 'axios';

const OZON_API_URL = process.env.NEXT_PUBLIC_OZON_API_URL;

export interface OzonCredentials {
  clientId: string;
  apiKey: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: string;
  dailyBudget: number;
  currentSpend?: number;
}

export interface BidUpdate {
  campaignId: string;
  productId: string;
  newBid: number;
}

// Получение списка рекламных кампаний
export async function getCampaignsList(credentials: OzonCredentials) {
  try {
    const response = await axios.post(
      `${OZON_API_URL}/api/client/performance/campaigns/list`,
      {},
      {
        headers: {
          'Client-Id': credentials.clientId,
          'Api-Key': credentials.apiKey,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

// Получение статистики по кампаниям
export async function getCampaignsStatistics(credentials: OzonCredentials, campaignIds: string[]) {
  try {
    const response = await axios.post(
      `${OZON_API_URL}/api/client/performance/statistics/campaign`,
      {
        campaign_ids: campaignIds,
        dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Последние 7 дней
        dateTo: new Date().toISOString().split('T')[0]
      },
      {
        headers: {
          'Client-Id': credentials.clientId,
          'Api-Key': credentials.apiKey,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

// Обновление ставок для товаров
export async function updateBids(credentials: OzonCredentials, updates: BidUpdate[]) {
  try {
    const payload = updates.map(update => ({
      campaign_id: update.campaignId,
      product_id: update.productId,
      bid: update.newBid
    }));
    
    const response = await axios.post(
      `${OZON_API_URL}/api/client/performance/products/bids/update`,
      { bids: payload },
      {
        headers: {
          'Client-Id': credentials.clientId,
          'Api-Key': credentials.apiKey,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

// Обновление дневного бюджета кампании
export async function updateCampaignBudget(credentials: OzonCredentials, campaignId: string, dailyBudget: number) {
  try {
    const response = await axios.post(
      `${OZON_API_URL}/api/client/performance/campaigns/update`,
      {
        campaign_id: campaignId,
        daily_budget: dailyBudget
      },
      {
        headers: {
          'Client-Id': credentials.clientId,
          'Api-Key': credentials.apiKey,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

// Получение текущих расходов по кампании
export async function getCampaignSpend(credentials: OzonCredentials, campaignId: string) {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const response = await axios.post(
      `${OZON_API_URL}/api/client/performance/statistics/campaign`,
      {
        campaign_ids: [campaignId],
        dateFrom: today,
        dateTo: today
      },
      {
        headers: {
          'Client-Id': credentials.clientId,
          'Api-Key': credentials.apiKey,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
