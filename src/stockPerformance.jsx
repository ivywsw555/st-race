import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUp, ArrowDown } from 'lucide-react';

const STOCK_HISTORICAL_DATA = {
    GOOG: [
        { date: '2024-11-22', price: 166.57 },
        { date: '2024-11-23', price: 166.57 },
        { date: '2024-11-24', price: 166.57 },
        { date: '2024-11-25', price: 169.43 },
        { date: '2024-11-26', price: 170.62 },

        { date: '2024-11-27', price: 170.82 },
        { date: '2024-11-28', price: 170.82 },
        { date: '2024-11-29', price: 170.82 },
        { date: '2024-11-30', price: 172.98 },
        { date: '2024-12-01', price: 172.98 },
        { date: '2024-12-02', price: 172.98 },
        { date: '2024-12-03', price: 173.02 },
        { date: '2024-12-04', price: 176.09 },
        { date: '2024-12-05', price: 174.31 },
        { date: '2024-12-06', price: 176.49 },
        { date: '2024-12-07', price: 176.49 },
        { date: '2024-12-08', price: 176.49 }
    ],
    FSLR: [
        { date: '2024-11-22', price: 186.05 },
        { date: '2024-11-23', price: 186.05 },
        { date: '2024-11-24', price: 186.05 },

        { date: '2024-11-25', price: 192.82 },
        { date: '2024-11-26', price: 192.32 },
        { date: '2024-11-27', price: 192.57 },
        { date: '2024-11-28', price: 192.57 },
        { date: '2024-11-29', price: 199.27 },
        { date: '2024-11-30', price: 207.92 },
        { date: '2024-12-01', price: 207.92 },
        { date: '2024-12-02', price: 207.92 },
        { date: '2024-12-03', price: 207.51 },
        { date: '2024-12-04', price: 201.57 },
        { date: '2024-12-05', price: 197.93 },
        { date: '2024-12-06', price: 194.19 },
        { date: '2024-12-07', price: 194.19 },
        { date: '2024-12-08', price: 194.19 }
    ]
};

const FAMILY_STOCK_CONFIGS = {
    mom: [
        {
            symbol: 'FSLR',
            purchaseDate: '2024-11-22',
            purchaseAmount: 1.08139,
            purchasePrice: 184.9
        }
    ],
    dad: [
        {
            symbol: 'GOOG',
            purchaseDate: '2024-11-22',
            purchaseAmount: 1.19358,
            purchasePrice: 167.52
        }
    ]
};

const StockPerformanceCard = ({ stock, member }) => {
    const {
        symbol,
        purchasePrice,
        purchaseAmount,
        currentPrice,
        historicalData
    } = stock;

    const currentValue = currentPrice * purchaseAmount;
    const originalValue = purchasePrice * purchaseAmount;
    const profitLoss = currentValue - originalValue;
    const percentageChange = ((currentPrice - purchasePrice) / purchasePrice) * 100;
    console.log(symbol, purchasePrice, purchaseAmount, "origiu", originalValue, "currentValue", currentValue);

    const getColorClass = (value) =>
        value >= 0 ? 'text-green-600' : 'text-red-600';

    const PriceChangeIcon = percentageChange >= 0 ? ArrowUp : ArrowDown;

    return (
        <div className={`bg-white shadow-lg rounded-lg p-6 transform transition-all hover:scale-105 ${member === 'mom' ? 'border-l-4 border-pink-500' : 'border-l-4 border-blue-500'
            }`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800">{symbol}</h3>
                <div className={`flex items-center ${getColorClass(percentageChange)}`}>
                    <PriceChangeIcon className="mr-2" />
                    <span className="font-semibold">
                        {percentageChange.toFixed(2)}%
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-sm text-gray-500">Purchase Price</p>
                    <p className="text-xl font-bold">${purchasePrice.toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Current Price</p>
                    <p className="text-xl font-bold">${currentPrice.toFixed(2)}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-gray-500">Purchase Value</p>
                    <p className={`text-xl font-bold ${getColorClass(originalValue)}`}>
                        ${originalValue.toFixed(2)}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Current Value</p>
                    <p className={`text-xl font-bold ${getColorClass(currentValue)}`}>
                        ${currentValue.toFixed(2)}
                    </p>
                </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-gray-500">Total Profit/Loss</p>
                <p className={`text-xl font-bold ${getColorClass(profitLoss)}`}>
                    {profitLoss >= 0 ? '+' : ''}${profitLoss.toFixed(2)}
                </p>
            </div>
        </div>
    );
};

const FamilyStockPerformanceTracker = () => {
    const [stockData, setStockData] = useState({
        mom: {},
        dad: {}
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const fetchPromises = Object.entries(FAMILY_STOCK_CONFIGS).map(async ([member, stocks]) => {
                    const memberStockData = await Promise.all(
                        stocks.map(async (stock) => {
                            // Fetch current stock quote from Finnhub
                            const quoteResponse = await fetch(
                                `https://finnhub.io/api/v1/quote?symbol=${stock.symbol}&token=ctb3pepr01qgsps8bstgctb3pepr01qgsps8bsu0`
                            );
                            const quoteResult = await quoteResponse.json();

                            // Use embedded historical data
                            const historicalData = STOCK_HISTORICAL_DATA[stock.symbol];

                            return {
                                symbol: stock.symbol,
                                purchasePrice: stock.purchasePrice,
                                purchaseAmount: stock.purchaseAmount,
                                currentPrice: quoteResult.c, // Current price from Finnhub
                                historicalData: historicalData
                            };
                        })
                    );

                    return { [member]: memberStockData };
                });

                const results = await Promise.all(fetchPromises);
                const combinedStockData = results.reduce((acc, result) => ({
                    ...acc,
                    ...result
                }), {});

                setStockData(combinedStockData);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch stock data');
                setLoading(false);
            }
        };

        fetchStockData();
    }, []);

    const renderStockChart = (member, stockList) => (
        <div key={member} className="mb-8">
            <h2 className="text-3xl font-bold text-center mb-6 capitalize">{member}'s Portfolio</h2>
            <div className="grid md:grid-cols-1 gap-6">
                {stockList.map((stock) => (
                    <div key={stock.symbol} className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-1/2 h-64 md:h-80 md:order-1">
                            <h3 className="text-xl text-center mb-4">{stock.symbol} Performance</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={stock.historicalData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="date"
                                        className="text-xs"
                                        interval="preserveStartEnd"
                                    />
                                    <YAxis
                                        className="text-xs"
                                        domain={['dataMin - 10', 'dataMax + 10']}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                            border: '1px solid #ddd'
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="price"
                                        stroke={member === 'mom' ? '#FF69B4' : '#4169E1'}
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-1/2 md:order-2">
                            <StockPerformanceCard width="100%"
                                stock={stock}
                                member={member}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="text-red-500 text-center p-4 bg-red-50">
            {error}
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-6 bg-gray-50 min-h-screen">
            {Object.entries(stockData).map(([member, stocks]) =>
                renderStockChart(member, stocks)
            )}
        </div>
    );
};

export default FamilyStockPerformanceTracker;