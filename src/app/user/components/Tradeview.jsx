"use client"
import React, { useEffect, useRef, memo } from "react";

function TradingViewWidget() {
  const container = useRef(null);

  useEffect(() => {
    if (!container.current) return;

    // Clear previous content
    container.current.innerHTML = "";

    // Create widget container div
    const widget = document.createElement("div");
    widget.className = "tradingview-widget-container__widget";
    widget.style.height = "100%";
    widget.style.width = "100%";
    container.current.appendChild(widget);

    // Create and load script - Bitcoin only
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      allow_symbol_change: false,
      calendar: false,
      details: false,
      hide_side_toolbar: true,
      hide_top_toolbar: false,
      hide_legend: false,
      hide_volume: false,
      hotlist: false,
      interval: "D",
      locale: "en",
      save_image: true,
      style: "1",
      symbol: "COINBASE:BTCUSD",
      theme: "dark",
      timezone: "Etc/UTC",
      backgroundColor: "rgba(13, 20, 34, 0.5)",
      gridColor: "rgba(140, 180, 200, 0.08)",
      watchlist: [],
      withdateranges: false,
      compareSymbols: [],
      studies: [],
      autosize: true,
    });
    container.current.appendChild(script);

    return () => {
      if (container.current) {
        container.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div
      ref={container}
      className="tradingview-widget-container"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    />
  );
}

export default memo(TradingViewWidget);