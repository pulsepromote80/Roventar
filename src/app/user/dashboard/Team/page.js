"use client";
import React, { useState, useEffect, useMemo } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { GetDirectMember } from "@/app/redux/slices/fundManagerSlice";
import { getUserSummaryDetails } from "@/app/redux/slices/authSlice";

import DownlineMember from "./downline-member/page";
import BinaryTree from "../binarytree/page";
import IntelligentTreeView from "../intelligent-tree-view/page";
import { color } from "framer-motion";

const TeamReferral = () => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState("team");
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);

    const { GetDirectMemberData, loading, error } = useSelector(
        (state) => state?.fund || {}
    );

    // Level filter state
    const [teamStatus, setTeamStatus] = useState("all");
    // Search state
    const [searchTerm, setSearchTerm] = useState("");

    const tabLabels = {
        Summary: "Summary",
        team: "Direct Team",
        // binarytree: "Tree View",
        Downline: "Downline Team",
        // AffiliateTree: "Intelligent Tree View",
    };

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const STATUS_OPTIONS = [
        { value: "all", label: "All Team" },
        { value: "active", label: "Active Team" },
        { value: "inactive", label: "Inactive Team" },
    ];


    const teamParams = {
        statusId: "",
        loginid: ""
    };

    useEffect(() => {

        dispatch(GetDirectMember(teamParams));

    }, [dispatch]);

    // Fetch Dashboard Data when Summary tab is clicked
    useEffect(() => {
        if (activeTab === "Summary") {
            const fetchDashboardDetails = async () => {
                setIsLoadingDashboard(true);
                try {
                    const result = await dispatch(getUserSummaryDetails()).unwrap();
                    if (result) {
                        setDashboardData(result);
                    }
                } catch (error) {
                    console.error("Failed to fetch dashboard details:", error);
                } finally {
                    setIsLoadingDashboard(false);
                }
            };
            fetchDashboardDetails();
        }
    }, [activeTab, dispatch]);

    useEffect(() => {
        setCurrentPage(1);
    }, [teamStatus, searchTerm]);

    const teamMembers = GetDirectMemberData?.data || [];

    const filteredTeamMembers = teamMembers?.filter((member) => {
        const topupStatus = member.topup?.toString().trim().toLowerCase();
        if (teamStatus === "active") return topupStatus === "activated";
        if (teamStatus === "inactive") return topupStatus !== "activated";
        return true;
    }).filter((member) => {
        if (!searchTerm.trim()) return true;
        const searchLower = searchTerm.toLowerCase().trim();
        return (
            (member.name && member.name.toLowerCase().includes(searchLower)) ||
            (member.loginid && member.loginid.toLowerCase().includes(searchLower)) ||
            (member.mobile && member.mobile.toLowerCase().includes(searchLower)) ||
            (member.email && member.email.toLowerCase().includes(searchLower)) ||
            (member.position && member.position.toLowerCase().includes(searchLower)) ||
            (member.topup && member.topup.toLowerCase().includes(searchLower))
        );
    });

    // Pagination calculations
    const totalPages = Math.ceil(filteredTeamMembers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentMembers = filteredTeamMembers.slice(startIndex, endIndex);

    const handlePrevious = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNext = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    return (
        <div className="team-referral-main-container">

            <div className="tabs-container">
                <div className="tabs">
                    {["Summary", "team", "Downline", "AffiliateTree"].map((tab) => (
                        <button
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tabLabels[tab]}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === "binarytree" ? (
                <BinaryTree />
            // ) : activeTab === "AffiliateTree" ? (
            //     <IntelligentTreeView />
            ) : activeTab === "Downline" ? (
                <DownlineMember isDownline={true} />
            ) : activeTab === "Summary" ? (
                <div className="summary-section">
                    {isLoadingDashboard ? (
                        <div style={{ textAlign: "center", padding: "40px" }}>
                            <div style={{ fontSize: "18px", color: "#64748b" }}>Loading network status...</div>
                        </div>
                    ) : (
                        <div className="chbar">
                            {/* Bottom section: 4 Boxes */}
                            <div
                                className="cbitems"
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '20px',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                }}
                            >
                                {/* Box 1 - Direct Downline */}
                                <div
                                    className="cbitem"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px',
                                        background: 'var(--bg-card)',
                                        borderRadius: '12px',
                                        flex: '1 1 calc(25% - 15px)',
                                        minWidth: '200px',
                                        boxSizing: 'border-box'
                                    }}
                                >
                                    <div
                                        className="cblogo"
                                        style={{
                                            background: 'rgba(240,185,11,.09)',
                                            color: '#f0b90b',
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '24px'
                                        }}
                                    >
                                        🎯
                                    </div>
                                    <div className="cbd" style={{ flex: 1 }}>
                                        <div className="cbn" style={{ fontSize: '14px', fontWeight: 'bold',  }}>
                                            Direct Network
                                        </div>
                                        <div
                                            className="cbm"
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '6px',
                                                fontSize: '11px',
                                                color: '#64748b'
                                            }}
                                        >
                                            <div className="cbs" >
                                                Direct Ids: <span>{dashboardData?.[0]?.DirectIds || 0}</span>
                                            </div>
                                            <div className="cbs" >
                                                Active Direct Ids: <span >{dashboardData?.[0]?.ActiveDirectIds || 0}</span>
                                            </div>
                                            <div className="cbs" >
                                                Direct Business: <span >${(dashboardData?.[0]?.DirectBusiness ?? dashboardData?.[0]?.DirectBussiness ?? 0).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Box 2 - Left Downline */}
                                <div
                                    className="cbitem"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px',
                                        background: 'var(--bg-card)',
                                        borderRadius: '12px',
                                        flex: '1 1 calc(25% - 15px)',
                                        minWidth: '200px',
                                        boxSizing: 'border-box'
                                    }}
                                >
                                    <div
                                        className="cblogo"
                                        style={{
                                            background: 'rgba(98,126,234,.12)',
                                            color: '#627eea',
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '24px'
                                        }}
                                    >
                                        ◀
                                    </div>
                                    <div className="cbd" style={{ flex: 1 }}>
                                        <div className="cbn" style={{ fontSize: '14px', fontWeight: 'bold',  }}>
                                            Team Performance
                                        </div>
                                        <div
                                            className="cbm"
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '6px',
                                                fontSize: '11px', 
                                            }}
                                        >
                                            <div className="cbs" >
                                                Total Team: <span >{dashboardData?.[0]?.TotalTeam || 0}</span>
                                            </div>
                                            <div className="cbs">
                                                Active Team: <span >{dashboardData?.[0]?.ActiveTeam || 0}</span>
                                            </div>
                                            <div className="cbs" >
                                                Team Business: <span>${(dashboardData?.[0]?.Teambusiness || 0).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Box 3 - Right Downline */}
                                <div
                                    className="cbitem"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px',
                                        background: 'var(--bg-card)',
                                        borderRadius: '12px',
                                        flex: '1 1 calc(25% - 15px)',
                                        minWidth: '200px',
                                        boxSizing: 'border-box'
                                    }}
                                >
                                    <div
                                        className="cblogo"
                                        style={{
                                            background: 'rgba(0,255,163,.07)',
                                            color: '#00ffa3',
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '24px'
                                        }}
                                    >
                                        ▶
                                    </div>
                                    <div className="cbd" style={{ flex: 1 }}>
                                        <div className="cbn" style={{ fontSize: '14px', fontWeight: 'bold',  }}>
                                            Strong Leg Analytics
                                        </div>
                                        <div
                                            className="cbm"
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '6px',
                                                fontSize: '11px',
                                                color: '#64748b'
                                            }}
                                        >
                                            <div className="cbs" >
                                                Strong Leg Ids: <span >{dashboardData?.[0]?.StrongLegID || 0}</span>
                                            </div>
                                            <div className="cbs" >
                                                Strong Leg Business: <span >${(dashboardData?.[0]?.StrongLegBus || 0).toFixed(2)}</span>
                                            </div>
                                            <div className="cbs" >
                                                Other Leg Business: <span >${(dashboardData?.[0]?.OtherLegBus || 0).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Box 4 - Total Downline
                                <div
                                    className="cbitem"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px',
                                        background: '#f8fafc',
                                        borderRadius: '12px',
                                        flex: '1 1 calc(25% - 15px)',
                                        minWidth: '200px',
                                        boxSizing: 'border-box'
                                    }}
                                >
                                    <div
                                        className="cblogo"
                                        style={{
                                            background: 'rgba(6,182,212,.08)',
                                            color: '#06b6d4',
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '24px'
                                        }}
                                    >
                                        Σ
                                    </div>
                                    <div className="cbd" style={{ flex: 1 }}>
                                        <div className="cbn" style={{ fontSize: '14px', fontWeight: 'bold',  }}>
                                            Total Downline
                                        </div>
                                        <div
                                            className="cbm"
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '6px',
                                                fontSize: '11px',
                                                color: '#64748b'
                                            }}
                                        >
                                            <div className="cbs">
                                                Total Users: <span>{(dashboardData?.[0]?.LeftTeam || 0) + (dashboardData?.[0]?.RightTeam || 0)}</span>
                                            </div>
                                            <div className="cbs">
                                                Total Business: <span>${((dashboardData?.[0]?.LeftBussiness || 0) + (dashboardData?.[0]?.RightBussiness || 0)).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {/* Level Filter */}
                    <div className="team-referral-main-filter-card">
                        <div className="team-referral-main-filter-header">
                            <div className="team-referral-main-filter-title">
                                Direct Referral Team
                            </div>
                            <div className="team-referral-main-filter-select-wrapper">
                                <select
                                    value={teamStatus}
                                    onChange={(e) => setTeamStatus(e.target.value)}
                                    className="team-referral-main-filter-select"
                                >
                                    {STATUS_OPTIONS.map((level) => (
                                        <option key={level.value} value={level.value}>
                                            {level.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Search Input - Added */}
                    <div>
                        <input
                            type="text"
                            placeholder="Search by Name, Login ID, Mobile, Email..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="search-input"
                        />
                    </div>

                    {/* Team Members Table */}
                    <div className="team-referral-main-table-card">
                        {loading && (
                            <div className="team-referral-main-loading-text">
                                Loading team data...
                            </div>
                        )}
                        {error && (
                            <div className="team-referral-main-error-text">
                                Error: {error}
                            </div>
                        )}
                        <div className="team-referral-main-table-body">
                            {loading ? (
                                <div className="team-referral-main-loader-container">
                                    <div className="team-referral-main-loader"></div>
                                </div>
                            ) : (
                                <>
                                    <div className="team-referral-main-table-wrapper">
                                        <div className="team-referral-main-table-inner">
                                            <table className="team-referral-main-table">
                                                <thead className="team-referral-main-table-header">
                                                    <tr>
                                                        <th className="team-referral-main-table-th text-center">
                                                            Sr No
                                                        </th>
                                                        <th className="team-referral-main-table-th text-center">
                                                            Name
                                                        </th>
                                                        <th className="team-referral-main-table-th text-center">
                                                            Login ID
                                                        </th>
                                                        <th className="team-referral-main-table-th hidden-lg text-center">
                                                            Mobile
                                                        </th>
                                                        <th className="team-referral-main-table-th hidden-md text-center">
                                                            Email
                                                        </th>
                                                        <th className="team-referral-main-table-th hidden-md text-center">
                                                            Reg. Date
                                                        </th>
                                                        
                                                        <th className="team-referral-main-table-th text-center">
                                                            Package
                                                        </th>
                                                      
                                                        <th className="team-referral-main-table-th hidden-md text-center">
                                                            Topup Date
                                                        </th>

                                                        <th className="team-referral-main-table-th hidden-md text-center">
                                                            Team Business
                                                        </th>
                                                        <th className="team-referral-main-table-th hidden-md text-center">
                                                            Leadership Business
                                                        </th>


                            
                                                    </tr>
                                                </thead>
                                                <tbody className="team-referral-main-table-body-content">
                                                    {currentMembers && currentMembers.length > 0 ? (
                                                        currentMembers.map((member, index) => (
                                                            <tr key={member.id} className="team-referral-main-table-row">
                                                                <td className="team-referral-main-table-td text-center">
                                                                    <span className="team-referral-main-sr-no">
                                                                        {startIndex + index + 1}
                                                                    </span>
                                                                </td>
                                                                <td className="team-referral-main-table-td text-center">
                                                                    <span className="team-referral-main-name">
                                                                        {member.name}
                                                                    </span>
                                                                </td>
                                                                <td className="team-referral-main-table-td text-center">
                                                                    <span className="team-referral-main-login-id">
                                                                        {member.loginid || member.id}
                                                                    </span>
                                                                </td>
                                                                <td className="team-referral-main-table-td hidden-lg text-center">
                                                                    <span className="team-referral-main-mobile">
                                                                        {member.mobile || "N/A"}
                                                                    </span>
                                                                </td>
                                                                <td className="team-referral-main-table-td hidden-md text-center">
                                                                    <span className="team-referral-main-email">
                                                                        {member.email || "N/A"}
                                                                    </span>
                                                                </td>
                                                                <td className="team-referral-main-table-td hidden-md text-center">
                                                                    <span className="team-referral-main-email">
                                                                        {member.regDate || "Null"}
                                                                    </span>
                                                                </td>
                                                                 
                                                                <td className="team-referral-main-table-td text-center">
                                                                    <span className="team-referral-main-package">
                                                                        ${member.package ? Number(member.package).toFixed(3) : "0.000"}
                                                                    </span>
                                                                </td>
                                                               
                                                                <td className="team-referral-main-table-td hidden-md text-center">
                                                                    <span className="team-referral-main-email">
                                                                        {member.topupDate || "Null"}
                                                                    </span>
                                                                </td>
                                                                <td className="team-referral-main-table-td hidden-md text-center">
                                                                    <span className="team-referral-main-email">
                                                                        ${member.teambusiness || "0"}
                                                                    </span>
                                                                </td>
                                                                 <td className="team-referral-main-table-td hidden-md text-center">
                                                                    <span className="team-referral-main-email">
                                                                        ${member.leftbusiness || "0"}
                                                                    </span>
                                                                </td>


                                                                
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td
                                                                colSpan="11"
                                                                className="team-referral-main-no-data"
                                                            >
                                                                {searchTerm ? `No team members found for "${searchTerm}"` : "No team members found"}
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Pagination Controls */}
                                    {filteredTeamMembers?.length > 0 && (
                                        <div className="team-referral-main-pagination-container">
                                            <div className="team-referral-main-pagination-info">
                                                Showing {startIndex + 1} to{" "}
                                                {Math.min(endIndex, filteredTeamMembers?.length)} of{" "}
                                                {filteredTeamMembers?.length} members
                                            </div>
                                            <div className="team-referral-main-pagination-controls">
                                                <button
                                                    onClick={handlePrevious}
                                                    disabled={currentPage === 1}
                                                    className="team-referral-main-pagination-prev"
                                                >
                                                    <ChevronLeft className="team-referral-main-pagination-icon" />
                                                    <span className="team-referral-main-pagination-prev-text">Previous</span>
                                                </button>
                                                <div className="team-referral-main-pagination-page-info">
                                                    <span className="team-referral-main-pagination-current">
                                                        {currentPage}
                                                    </span>
                                                    <span className="team-referral-main-pagination-separator">
                                                        /
                                                    </span>
                                                    <span className="team-referral-main-pagination-total">
                                                        {totalPages}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={handleNext}
                                                    disabled={currentPage === totalPages}
                                                    className="team-referral-main-pagination-next"
                                                >
                                                    <span className="team-referral-main-pagination-next-text">Next</span>
                                                    <ChevronRight className="team-referral-main-pagination-icon" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default TeamReferral;