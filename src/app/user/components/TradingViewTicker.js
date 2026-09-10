"use client";

import { useEffect, useRef } from "react";

export default function TradingViewTicker() {
  const container = useRef(null);

  useEffect(() => {
    if (!container.current) return;

    container.current.innerHTML = "";

    const ticker = document.createElement("tv-ticker-tape");

    ticker.setAttribute(
      "symbols",
      "FOREXCOM:SPXUSD,FOREXCOM:NSXUSD,FOREXCOM:DJI,FX:EURUSD,BITSTAMP:BTCUSD,BITSTAMP:ETHUSD,CMCMARKETS:GOLD"
    );

    ticker.setAttribute("hide-chart", "");

    // Dark theme
    ticker.setAttribute("theme", "dark");

    container.current.appendChild(ticker);

    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://widgets.tradingview-widget.com/w/en/tv-ticker-tape.js";

    document.body.appendChild(script);

    return () => {
      if (container.current) {
        container.current.innerHTML = "";
      }

      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    // <div
    //   style={{
    //     background: "#0F172A",
    //     borderRadius: "20px",
    //     padding: "6px",
    //     overflow: "hidden",
    //     border: "1px solid #263449",
    //   }}
    // >
      <div
        ref={container}
        className="tradingview-widget-container"
        style={{
          width: "100%",
          overflow: "hidden",
          background: "#0F172A",
        }}
      />
    // </div>
  );
}
