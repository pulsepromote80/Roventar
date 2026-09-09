"use client";
import React, { useState, useEffect, useMemo } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AuthLogin } from "@/app/api/auth";
import { getPersonalTeamList } from "@/app/redux/slices/walletSlice";


const DownlineMember = ({ isDownline = false }) => {
    const dispatch = useDispatch();
    const authLogin = AuthLogin();

    const { personalTeamList, loading, error } = useSelector(
        (state) => state?.wallet || {}
    );

    const teamMembersRaw = personalTeamList || [];

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const itemsPerPage = 10;


    const levelOptions = useMemo(() => {
        const levels = [];
        for (let i = 1; i <= 25; i++) {
            levels.push({ value: i.toString(), label: `${i}` });
        }
        return levels;
    }, []);

    const fetchDownline = async (level = "") => {
        try {
            const authLoginValue = authLogin || authLogin?.urid || "";

            const requestBody = {
                authLogin: authLoginValue,
                lvl: level,
                statusId: ""
            };

            await dispatch(getPersonalTeamList(requestBody));
        } catch (error) {
            console.error("Error fetching downline:", error);
        }
    };

    useEffect(() => {

        fetchDownline(selectedLevel);

    }, [authLogin, selectedLevel]);

    // Handle level change
    const handleLevelChange = (e) => {
        const level = e.target.value;
        setSelectedLevel(level);
        setCurrentPage(1);
        fetchDownline(level);
    };

    // Filter members based on search term
    const filteredMembers = useMemo(() => {
        if (!searchTerm.trim()) {
            return teamMembersRaw;
        }

        const searchLower = searchTerm.toLowerCase().trim();
        return teamMembersRaw.filter((member) => {
            return (
                (member.Name && member.Name.toLowerCase().includes(searchLower)) ||
                (member.loginid && member.loginid.toLowerCase().includes(searchLower)) ||
                (member.SponserId && member.SponserId.toString().toLowerCase().includes(searchLower)) ||
                (member.Urid && member.Urid.toString().includes(searchLower))
            );
        });
    }, [teamMembersRaw, searchTerm]);

    const totalPages = Math.ceil(filteredMembers?.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentMembers = filteredMembers.slice(startIndex, endIndex);

    const handlePrevious = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNext = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const clearSearch = () => {
        setSearchTerm("");
        setCurrentPage(1);
    };

    return (
        <div className="downline-member-wrapper">
            <div className="downline-member-header">
                <div className="downline-member-header-inner">
                    <div className="downline-member-title">
                        {isDownline ? "Downline Team" : "Direct Referral Team"}
                    </div>
                    {/* Level Dropdown - Right Corner */}
                    <div className="team-referral-main-filter-select-wrapper">
                        <select
                            value={selectedLevel}
                            onChange={handleLevelChange}
                            className="team-referral-main-filter-select"
                        >
                            <option value="">Select Level</option>
                            {levelOptions.map((level) => (
                                <option key={level.value} value={level.value}>
                                    {level.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Search Box */}
            <div className="downline-member-search-container">
                <div className="downline-member-search-box">
                    <input
                        type="text"
                        placeholder="Search by Name, Login ID, or Sponsor ID..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                    {searchTerm && (
                        <button onClick={clearSearch} className="downline-member-clear-search">
                            Clear
                        </button>
                    )}
                </div>
                {searchTerm && (
                    <div className="downline-member-search-results-info">
                        Found {filteredMembers.length} result(s) for "{searchTerm}"
                    </div>
                )}
            </div>

            <div className="downline-member-table-container">
                {loading && (
                    <div className="downline-member-loading">
                        Loading team data...
                    </div>
                )}
                {error && (
                    <div className="downline-member-error">Error: {error}</div>
                )}
                <div className="downline-member-table-content">
                    {loading ? (
                        <div className="downline-member-loader">
                            <div className="downline-member-spinner"></div>
                        </div>
                    ) : (
                        <>
                            <div className="downline-member-table-scroll">
                                <div className="downline-member-table-inner">
                                    <table className="downline-member-table">
                                        <thead className="downline-member-thead">
                                            <tr>
                                                <th className="downline-member-th">Sr No</th>
                                                <th className="downline-member-th">Login ID</th>
                                                <th className="downline-member-th">Country Flag</th>
                                                <th className="downline-member-th">Name</th>


                                                <th className="downline-member-th">Reg. Date</th>
                                                <th className="downline-member-th downline-member-hide-lg">Topup Date</th>
                                                <th className="downline-member-th downline-member-hide-xl">Package</th>
                                                <th className="downline-member-th">Team Business</th>
                                                <th className="downline-member-th">Leadership Business</th>

                                                <th className="downline-member-th">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="downline-member-tbody">
                                            {currentMembers && currentMembers?.length > 0 ? (
                                                currentMembers.map((member, index) => (
                                                    <tr key={index} className="downline-member-row">
                                                        <td className="downline-member-td">
                                                            {startIndex + index + 1}
                                                        </td>
                                                        <td className="downline-member-td">
                                                            {member.loginid || "-"}
                                                        </td>
                                                        <td className="downline-member-td">
                                                            <img
                                                                src={member.countryFlag || "/default-avatar.png"}
                                                                alt="User Avatar"
                                                                width="40"
                                                                height="40"
                                                                style={{
                                                                    width: "40px",
                                                                    height: "40px",
                                                                    borderRadius: "50%",
                                                                    objectFit: "cover"
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="downline-member-td downline-member-name">
                                                            {member.name || "-"}
                                                        </td>





                                                        <td className="downline-member-td">
                                                            {member.regDate || "-"}
                                                        </td>
                                                        <td className="downline-member-td downline-member-hide-lg">
                                                            {member.topupDate || "-"}
                                                        </td>

                                                        <td className="downline-member-td downline-member-hide-xl">
                                                            {member.package ? `$${parseFloat(member.package).toLocaleString()}` : "$0"}
                                                        </td>
                                                        <td className="downline-member-td">
                                                            ${Number(member.teambusiness || 0).toFixed(2)}
                                                        </td>
                                                        <td className="downline-member-td">
                                                            ${Number(member.leaseAmount || 0).toFixed(2)}
                                                        </td>

                                                        <td className="downline-member-td">
                                                            <span className={`downline-member-status-badge ${member.Status === "Active" ? "status-active" : "status-inactive"
                                                                }`}>
                                                                {member.status || "Active"}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="8" className="downline-member-no-data">
                                                        {searchTerm
                                                            ? `No results found for "${searchTerm}"`
                                                            : "No team members found"}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {filteredMembers?.length > 0 && (
                                <div className="downline-member-pagination">
                                    <div className="downline-member-pagination-info">
                                        Showing {startIndex + 1} to{" "}
                                        {Math.min(endIndex, filteredMembers?.length)} of{" "}
                                        {filteredMembers?.length} members
                                    </div>
                                    <div className="downline-member-pagination-buttons">
                                        <button
                                            onClick={handlePrevious}
                                            disabled={currentPage === 1}
                                            className="downline-member-page-btn downline-member-page-prev"
                                        >
                                            <ChevronLeft className="downline-member-page-icon" />
                                            <span>Previous</span>
                                        </button>
                                        <div className="downline-member-page-current">
                                            Page {currentPage} of {totalPages}
                                        </div>
                                        <button
                                            onClick={handleNext}
                                            disabled={currentPage === totalPages}
                                            className="downline-member-page-btn downline-member-page-next"
                                        >
                                            <span>Next</span>
                                            <ChevronRight className="downline-member-page-icon" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DownlineMember;