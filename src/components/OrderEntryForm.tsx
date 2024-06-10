import React, { useState, useEffect, useCallback } from "react";
import { sendTrade } from "../api/api";
import {
  Input,
  Slider,
  SliderSingleProps,
  Button,
  Radio,
  notification,
} from "antd";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { addTrade } from "../slices/trades";
import "../assets/styles/OrderEntryForm.css";

const marks: SliderSingleProps["marks"] = {
  0: "0.0",
  5: "0.25",
  10: "0.5",
  15: "0.75",
  20: "1.0",
};

const OrderEntryForm = ({ asset }: { asset: string }) => {
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0.0);
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [orderType, setOrderType] = useState<"LIMIT" | "MARKET">("LIMIT");
  const [api, contextHolder] = notification.useNotification();
  const [isOrderSetByRedux, setIsOrderSetByRedux] = useState(false);

  const dispatch = useDispatch();
  const order = useSelector((state: any) => state.orders);
  const askPrice = useSelector((state: any) => state.marketPrice.askPrice);
  const bidPrice = useSelector((state: any) => state.marketPrice.bidPrice);

  const handleSubmit = useCallback(async () => {
    if (quantity <= 0) {
      api.error({
        message: "Order Status",
        description: "The Amount must be greater than zero.",
      });
      return;
    }
    if (price <= 0) {
      api.error({
        message: "Order Status",
        description: "The Price must be greater than zero.",
      });
      return;
    }

    const tradeDetails = {
      asset,
      side,
      orderType,
      quantity,
      price,
      notional: quantity * price,
    };

    try {
      const response = await sendTrade(tradeDetails);
      dispatch(addTrade({ ...tradeDetails, timestamp: response.timestamp }));
      api.success({
        message: "Order Status",
        description: "Order placed successfully!",
      });
    } catch (error: any) {
      api.error({
        message: "Order Status",
        description: "Error placing order: " + error.message,
      });
    }
  }, [api, quantity, price, asset, side, orderType, dispatch]);

  useEffect(() => {
    if (order.side && order.price) {
      setSide(order.side);
      setPrice(order.price);
      setIsOrderSetByRedux(true);
    }
  }, [order]);

  useEffect(() => {
    if (side && price && isOrderSetByRedux && orderType !== "MARKET") {
      handleSubmit();
      setIsOrderSetByRedux(false);
    }
  }, [side, price, quantity, handleSubmit, isOrderSetByRedux, orderType]);

  useEffect(() => {
    setPrice(0);
    setQuantity(0.0);
    setSide("BUY");
    setOrderType("LIMIT");
    setIsOrderSetByRedux(false);
  }, [asset]);

  let coinIcon = "";
  if (asset === "BTC") {
    coinIcon = "₿";
  } else if (asset === "ETH") {
    coinIcon = "Ξ";
  }

  return (
    <>
      <form className="order-form" onSubmit={handleSubmit}>
        <div className="order-form-header">
          <button
            type="button"
            className={`button-left ${side === "BUY" ? "active" : ""}`}
            onClick={() => {
              setSide("BUY");
              if (orderType === "MARKET" && side === "BUY") {
                setPrice(bidPrice);
              } else if (orderType === "MARKET" && side === "SELL") {
                setPrice(askPrice);
              }
            }}
          >
            <h3>Buy</h3>
          </button>
          <button
            type="button"
            className={`button-right ${side === "SELL" ? "active" : ""}`}
            onClick={() => {
              setSide("SELL");
              if (orderType === "MARKET" && side === "BUY") {
                setPrice(bidPrice);
              } else if (orderType === "MARKET" && side === "SELL") {
                setPrice(askPrice);
              }
            }}
          >
            <h3>Sell</h3>
          </button>
        </div>
        <div className="order-form-body">
          <Radio.Group
            value={orderType}
            onChange={(e) => {
              setOrderType(e.target.value);
              setIsOrderSetByRedux(false);
            }}
          >
            <Radio.Button value="LIMIT">Limit</Radio.Button>
            <Radio.Button
              value="MARKET"
              onClick={() => {
                setOrderType("MARKET");
                if (side === "BUY") {
                  setPrice(askPrice);
                } else if (side === "SELL") {
                  setPrice(bidPrice);
                }
              }}
            >
              Market
            </Radio.Button>
          </Radio.Group>

          {orderType === "LIMIT" ? (
            <div className="order-form-label">
              <p>Limit Price</p>
              <Input
                required
                type="number"
                value={price ? price.toFixed(2) : ""}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                prefix="$"
                suffix="USD"
              />
              <p>Amount</p>
              <Input
                required
                value={quantity ? quantity.toFixed(4) : ""}
                onChange={(e) => setQuantity(parseFloat(e.target.value))}
                prefix={coinIcon}
                suffix={asset}
              />

              <Slider
                min={0}
                max={20}
                value={quantity * 20}
                onChange={(value: number) => setQuantity(value / 20)}
                marks={marks}
                step={1}
                tooltip={{ open: false }}
              />
              <p>Total</p>
              <Input
                required
                type="number"
                value={price && quantity ? (quantity * price).toFixed(2) : ""}
                prefix="$"
                suffix="USD"
              />
            </div>
          ) : (
            <div className="order-form-label">
              <p>Amount</p>
              <Input
                required
                value={quantity ? quantity.toFixed(4) : ""}
                onChange={(e) => setQuantity(parseFloat(e.target.value))}
                prefix={coinIcon}
                suffix={asset}
              />
              <Slider
                min={0}
                max={20}
                value={quantity * 20}
                onChange={(value: number) => setQuantity(value / 20)}
                marks={marks}
                step={1}
                tooltip={{ open: false }}
              />
              <p>Total</p>
              <Input
                type="number"
                value={price && quantity ? (quantity * price).toFixed(2) : ""}
                prefix="$"
                suffix="USD"
              />
            </div>
          )}
        </div>

        <div className="order-form-footer">
          {contextHolder}

          <Button type="primary" onClick={handleSubmit}>
            {side} {asset}
          </Button>
        </div>
      </form>
    </>
  );
};

export default OrderEntryForm;
