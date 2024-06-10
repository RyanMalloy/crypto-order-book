import axios from "axios";

interface OrderbookResponse {
  lastUpdateId: number;
  bids: string[][];
  asks: string[][];
}

interface TradeDetails {
  asset: string;
  side: "BUY" | "SELL";
  orderType: "LIMIT" | "MARKET";
  quantity: number;
  price?: number;
  notional: number;
}

interface TradeResponse extends TradeDetails {
  id: string;
  timestamp: number;
}

// Orderbook API
export const getOrderbook = async (
  asset: string
): Promise<OrderbookResponse> => {
  try {
    const response = await axios.get<OrderbookResponse>(`/orderbook/${asset}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching orderbook: ", error.message || error);
    throw error;
  }
};

// Trade API
export const sendTrade = async (
  tradeDetails: TradeDetails
): Promise<TradeResponse> => {
  try {
    const response = await axios.post<TradeResponse>(`/trade`, tradeDetails);
    return response.data;
  } catch (error: any) {
    console.error("Error sending trade: ", error.message || error);
    throw error;
  }
};
