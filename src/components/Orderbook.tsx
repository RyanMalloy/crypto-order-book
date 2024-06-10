import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { setSide, setPrice } from "../slices/orders";
import { setAskPrice, setBidPrice } from "../slices/marketPrice";
import { getOrderbook } from "../api/api";
import "../assets/styles/Orderbook.css";

interface OrderRow {
  id: number;
  price: number;
  quantity: number;
  amount: number;
}

const Orderbook = ({ asset }: { asset: string }) => {
  const [orderbook, setOrderbook] = useState<any>(null);
  const askEndRef = useRef<HTMLDivElement | null>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOrderbook = async () => {
      try {
        const data = await getOrderbook(asset);
        setOrderbook(data);

        // Dispatch the setAskPrice and setBidPrice actions
        if (data.asks.length > 0 && data.bids.length > 0) {
          dispatch(setAskPrice(parseFloat(data.asks[0][0])));
          dispatch(setBidPrice(parseFloat(data.bids[0][0])));
        }
      } catch (error) {
        console.error("Error fetching orderbook:", error);
      }
    };

    fetchOrderbook();
  }, [asset, dispatch]);

  useEffect(() => {
    if (askEndRef.current) {
      askEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [orderbook]);

  if (!orderbook) {
    return <div>Loading orderbook...</div>;
  }

  const bidRows = orderbook.bids.map((bid: any, index: number) => ({
    id: index,
    price: parseFloat(bid[0]),
    quantity: parseFloat(bid[1]),
    amount: parseFloat(bid[0]) * parseFloat(bid[1]),
  }));

  const askRows = orderbook.asks.map((ask: any, index: number) => ({
    id: index,
    price: parseFloat(ask[0]),
    quantity: parseFloat(ask[1]),
    amount: parseFloat(ask[0]) * parseFloat(ask[1]),
  }));

  const midMarketPrice = (bidRows[0].price + askRows[0].price) / 2;
  const spread = askRows[0].price - bidRows[0].price;

  return (
    <>
      <div className="orderbook" style={{ flexGrow: 1 }}>
        <div className="orderbook-header">
          <h3>Order book</h3>
          <div className="orderbook-header-row">
            <p>PRICE (USD)</p>
            <p className="text-align-right">AMOUNT ({asset})</p>
            <p className="text-align-right">AMOUNT (USD)</p>
          </div>
        </div>
        <div className="orderbook-body">
          <div className="orderbook-body-asks">
            {askRows.reverse().map((ask: OrderRow) => (
              <div
                className="orderbook-order-row"
                key={ask.id}
                onClick={() => {
                  dispatch(setSide("SELL"));
                  dispatch(setPrice(ask.price));
                }}
              >
                <p className="color-danger">{ask.price.toFixed(2)}</p>
                <p className="text-align-right">{ask.quantity.toFixed(4)}</p>
                <p className="text-align-right">{ask.amount.toFixed(2)}</p>
              </div>
            ))}
            <div ref={askEndRef} />
          </div>
          <div className="orderbook-body-middle">
            <p>{midMarketPrice.toFixed(2)}</p>
            <p>{spread.toFixed(2)}</p>
          </div>
          <div className="orderbook-body-bids">
            {bidRows.map((bid: OrderRow) => (
              <div
                className="orderbook-order-row"
                key={bid.id}
                onClick={() => {
                  dispatch(setSide("BUY"));
                  dispatch(setPrice(bid.price));
                }}
              >
                <p className="color-success">{bid.price.toFixed(2)}</p>
                <p className="text-align-right">{bid.quantity.toFixed(4)}</p>
                <p className="text-align-right">{bid.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Orderbook;
