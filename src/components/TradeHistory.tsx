import React from "react";
import { useSelector } from "react-redux";
import "../assets/styles/HistoryBook.css";

const TradeHistory = ({ asset }: { asset: string }) => {
  const trades = useSelector((state: any) => state.trades.trades);

  return (
    <>
      <div className="history-book" style={{ flexGrow: 1 }}>
        <div className="history-book-header">
          <h3>Trade History</h3>
          <div className="history-book-header-row">
            <p>TYPE</p>
            <p>PRICE (USD)</p>
            <p className="text-align-right">AMOUNT ({asset})</p>
            <p className="text-align-right">TIME</p>
          </div>
        </div>
        <div className="history-book-body">
          <div className="orderbook-body-trades">
            {trades
              .filter((trade: any) => trade.asset === asset)
              .slice()
              .reverse()
              .map((trade: any, index: number) => (
                <div className="history-book-order-row " key={index}>
                  <p>{trade.orderType}</p>
                  <p
                    className={
                      trade.side === "BUY" ? "color-success" : "color-danger"
                    }
                  >
                    {Number(trade.price).toFixed(2)}
                  </p>
                  <p className="text-align-right">
                    {trade.quantity.toFixed(4)}
                  </p>
                  <p className="text-align-right">
                    {new Date(trade.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default TradeHistory;
