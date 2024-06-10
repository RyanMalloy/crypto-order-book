import React, { useState } from "react";
import "./assets/styles/App.css";
import { Select, Layout } from "antd";
import Orderbook from "./components/Orderbook";
import OrderEntryForm from "./components/OrderEntryForm";
import TradeHistory from "./components/TradeHistory";

const { Option } = Select;
const { Header, Content } = Layout;

const App = () => {
  const [asset, setAsset] = useState<string>("BTC");

  return (
    <>
      <Layout
        style={{
          display: "flex",
          alignItems: "center",
          maxHeight: "100vh",
          backgroundColor: "white",
        }}
      >
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              maxWidth: "1024px",
            }}
          >
            <h2>Nascent Assignment</h2>
            <Select defaultValue={asset} onChange={(value) => setAsset(value)}>
              <Option value="BTC">BTC</Option>
              <Option value="ETH">ETH</Option>
            </Select>
          </div>
        </Header>
        <Content style={{ padding: " 1rem", maxWidth: "1024px" }}>
          <div style={{ display: "flex", gap: "2rem" }}>
            <Orderbook asset={asset} />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
                flexGrow: 1,
              }}
            >
              <OrderEntryForm asset={asset} />
              <TradeHistory asset={asset} />
            </div>
          </div>
        </Content>
      </Layout>
    </>
  );
};

export default App;
