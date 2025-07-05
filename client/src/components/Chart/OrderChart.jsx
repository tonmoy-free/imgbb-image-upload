
import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';

const OrderChart = ({ barCharData }) => {
    return (
        <div>
            <BarChart width={730} height={250} data={barCharData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="order" fill="#8884d8" />
                <Bar dataKey="revenue" fill="#82ca9d" />
            </BarChart>
        </div>
    );
};

export default OrderChart;