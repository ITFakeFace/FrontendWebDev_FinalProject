import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';

const RecipesShow = () => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [totalRecipes, setTotalRecipes] = useState(0); 

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const recipeCounts = [8, 3, 4, 6, 15, 22];

        const data = {
            labels: ['Main Dishes', 'Salads', 'Soup', 'Drink', 'Side Dishes', 'Desserts'],
            datasets: [
                {
                    data: recipeCounts,
                    backgroundColor: [
                        documentStyle.getPropertyValue('--blue-500'), 
                        documentStyle.getPropertyValue('--yellow-500'), 
                        documentStyle.getPropertyValue('--green-500'),
                        documentStyle.getPropertyValue('--purple-500'), 
                        documentStyle.getPropertyValue('--black-500'), 
                        documentStyle.getPropertyValue('--red-500')
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--blue-400'), 
                        documentStyle.getPropertyValue('--yellow-400'), 
                        documentStyle.getPropertyValue('--green-400'),
                        documentStyle.getPropertyValue('--purple-400'), 
                        documentStyle.getPropertyValue('--black-400'), 
                        documentStyle.getPropertyValue('--red-400')
                    ]
                }
            ]
        };

        const options = {
            cutout: '60%'
        };

        setChartData(data);
        setChartOptions(options);
        setTotalRecipes(recipeCounts.reduce((sum, count) => sum + count, 0)); // sum recipes
    }, []);

    return (
        <div className="card flex flex-col justify-center items-center gap-4">
            <Chart type="doughnut" data={chartData} options={chartOptions} className="w-full md:w-30rem" />
            <p className="text-sm text-gray-600">Total Recipes Created: <strong>{totalRecipes}</strong></p>
        </div>
    );
};

export default RecipesShow;
