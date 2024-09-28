import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { fetchPriceStatistics } from '../services/api'; 

const PriceStatisticsChart = ({ month }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const loadPriceStatistics = async () => {
            try {
                const statistics = await fetchPriceStatistics(month);
                setData(statistics);
            } catch (error) {
                console.error('Failed to fetch price statistics:', error);
            }
        };

        loadPriceStatistics(); 
    }, [month]);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="range"
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                    height={65} 
                    padding={{ right: 10 }} 
                />

                <YAxis ticks={[0, 20, 40, 60, 80]} /> 
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default PriceStatisticsChart;
