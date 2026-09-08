"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserDashboardDetails } from "../../redux/slices/authSlice";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";
import { useTheme } from "../../../components/ThemeProvider";

export default function RankProgress({
  totQualifyRnk = 0,
  total = 7,
  activeRank = "No Rank",
  description = "Welcome back to your Roventar ecosystem. Monitor your trading performance, team growth and reward progress from one place.",
  title = "Good Morning UserName",
}) {
  const dispatch = useDispatch();
  const [dashboardData, setDashboardData] = useState(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const fetchDashboardDetails = async () => {
      try {
        const result = await dispatch(getUserDashboardDetails()).unwrap();
        const data = Array.isArray(result)
          ? result?.[0]
          : result?.data?.[0] || result?.data || result;

        setDashboardData(data);
      } catch (error) {
        console.error("Dashboard Details API Error:", error);
      }
    };

    fetchDashboardDetails();
  }, [dispatch]);

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Good Night";
  };

  const apiFullName =
    dashboardData?.FullName ||
    dashboardData?.fullName ||
    dashboardData?.Name ||
    "";
  const apiRank =
    dashboardData?.UserRank ||
    dashboardData?.userRank ||
    activeRank ||
    "No Rank";
  const finalTitle = apiFullName ? `${getGreeting()} ${apiFullName}` : title;
  const Activebot = dashboardData?.BotStatus;

  const ACCENT = "var(--brand-cyan, #14b8a6)";
  const ACCENT_2 = "var(--brand-cyan2, #0ea5a4)";

  const styles = {
    hero: {
      background:
        "linear-gradient(120deg, var(--bg-card, #ffffff) 0%, var(--bg-card, #ffffff) 45%, var(--bg-2, #f1fbfa) 100%)",
      border: "1px solid var(--border, #ddebec)",
      borderRadius: "1.5rem",
      overflow: "hidden",
      boxShadow: "0 1px 2px var(--shadow, rgba(16,40,60,0.04))",
      margin: "1rem 0",
      color: "var(--text-1)",
    },

    body: {
      padding: "2.5rem",
      position: "relative",
    },

    row: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: "2rem",
    },

    left: {
      flex: "1 1 520px",
      minWidth: 0,
      position: "relative",
      zIndex: 2,
    },

    eyebrow: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      color: ACCENT,
      fontSize: "11.5px",
      fontWeight: 700,
      letterSpacing: "1.6px",
      textTransform: "uppercase",
      marginBottom: "8px",
    },

    title: {
      color: "var(--text-1, #0f2942)",
      fontSize: "clamp(26px, 3.2vw, 36px)",
      fontWeight: 700,
      letterSpacing: "-0.6px",
      margin: "0 0 8px 0",
    },

    desc: {
      color: "var(--text-2, #7c8a97)",
      fontSize: "15px",
      lineHeight: 1.6,
      maxWidth: "480px",
      margin: "0 0 20px 0",
    },

    progressSection: {
      maxWidth: "480px",
    },

    progressHead: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "8px",
    },

    progressTrack: {
      width: "100%",
      height: "8px",
      background: "var(--bg-3, #edf2f5)",
      borderRadius: "999px",
      overflow: "hidden",
    },

    right: {
      flex: "1 1 320px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      zIndex: 2,
    },
  };

  return (
    <div className="rpc-hero card" style={styles.hero}>
      <div>
        <div className="row align-items-center" style={styles.row}>
          {/* =====================================================
              LEFT SIDE
          ====================================================== */}

          <div style={styles.left}>
            {/* EYEBROW */}
            {/* <div style={styles.eyebrow}>
              <div className="dx-avatar">
                <TrophyIcon />
              </div>

              <span>ROVENTAR ECOSYSTEM</span>
            </div> */}
            <div style={styles.eyebrow}>
              <Link href="https://www.roventartrade.com" className="ecosystem-link" target="_blank">
                <div className="dx-avatar">
                  {/* <TrophyIcon /> */}
                  <FiExternalLink className="redirect-icon" />
                </div>

                <span>ROVENTAR TRADE</span>

               
              </Link>
            </div>

            {/* =================================================
                TITLE
                API FullName => Good Morning Robo Fx
            ================================================= */}

            <h3 style={styles.title}>{finalTitle}</h3>

            {/* DESCRIPTION */}

            <p style={styles.desc}>{description}</p>

            {/* =================================================
                RANK / STATUS
            ================================================= */}

            <div className="mb-4">
              <div className="flex-grow-1">
                <div className="d-flex flex-wrap gap-2">
                  {/* Rank */}

                  <span className="dx-badge-chip">
                    Rank {apiRank || "No Rank"}
                  </span>

                  {/* Trading Package */}

                  <span className="dx-badge-chip success">
                    <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                      <polyline
                        points="2,8 5.5,11.5 14,3.5"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Trading Package Active
                  </span>

                  {/* Account */}

                  <span className="dx-badge-chip success">
                    <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                      <polyline
                        points="2,8 5.5,11.5 14,3.5"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Account Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              RIGHT SIDE
          ====================================================== */}

          <div style={styles.right}>
            <img
              // src="/banner-img.png"
              src={isDark ? "/banner3.webp" : "/banner2.webp"}
              alt={apiRank || "Rank"}
              className="Rank-img rpc-rankImg"
              style={{ width: "100%", maxWidth: "500px", height: "auto" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   TROPHY ICON
============================================================= */

const ICON_ACCENT = "var(--brand-cyan, #14b8a6)";

function TrophyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="#ffffff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        display: "block",
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path d="M17 5h2.5A1.5 1.5 0 0 1 21 6.5v0A3.5 3.5 0 0 1 17.5 10H17" />
      <path d="M7 5H4.5A1.5 1.5 0 0 0 3 6.5v0A3.5 3.5 0 0 0 6.5 10H7" />
    </svg>
  );
}

