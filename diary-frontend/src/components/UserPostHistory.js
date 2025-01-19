import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import './UserPostHistory.css';  // Import the CSS file

const UserPostHistory = () => {
    const { userId } = useParams();
    const [postsByDay, setPostsByDay] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedDay, setSelectedDay] = useState('');

    const years = ['2024', '2025', '2026'];
    const months = [
        { label: 'January', value: 1 },
        { label: 'February', value: 2 },
        { label: 'March', value: 3 },
        { label: 'April', value: 4 },
        { label: 'May', value: 5 },
        { label: 'June', value: 6 },
        { label: 'July', value: 7 },
        { label: 'August', value: 8 },
        { label: 'September', value: 9 },
        { label: 'October', value: 10 },
        { label: 'November', value: 11 },
        { label: 'December', value: 12 },
    ];

    useEffect(() => {
        const fetchPostsByDay = async () => {
            try {
                const response = await api.get(`/posts/user-posts/${userId}?year=${selectedYear}&month=${selectedMonth}&day=${selectedDay}`);
                setPostsByDay(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching posts by day:', error);
            }
        };
        fetchPostsByDay();
    }, [userId, selectedYear, selectedMonth, selectedDay]);

    return (
        <div className="user-post-history">
            <h1 className="page-title">My Diary</h1>

            <div className="filter-container">
                <div className="filter-item">
                    <label htmlFor="year">Year:</label>
                    <select id="year" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                        <option value="">All Years</option>
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-item">
                    <label htmlFor="month">Month:</label>
                    <select id="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                        <option value="">All Months</option>
                        {months.map((month) => (
                            <option key={month.value} value={month.value}>
                                {month.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-item">
                    <label htmlFor="day">Day:</label>
                    <input
                        type="number"
                        id="day"
                        value={selectedDay}
                        placeholder="Day"
                        onChange={(e) => setSelectedDay(e.target.value)}
                        className="day-input"
                        min="1"
                        max="31"
                    />
                </div>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                Object.keys(postsByDay).map((date) => (
                    <div key={date} className="posts-by-day">
                        <h2 className="day-header">{new Date(date).toDateString()}</h2>
                        <ul className="post-list">
                            {postsByDay[date].map((post) => (
                                <li key={post.id} className="post-item">
                                    <div className="post-card">
                                        <p className="post-content">{post.content}</p>
                                        <span className="category-tag">{post.category}</span>
                                        <p className="post-date">Posted at: {new Date(post.createdAt).toLocaleString()}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}
        </div>
    );
};

export default UserPostHistory;
