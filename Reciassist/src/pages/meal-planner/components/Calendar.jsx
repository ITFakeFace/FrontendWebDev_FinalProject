import React, { useState, useCallback, useEffect } from 'react';
import { CalendarDays } from 'lucide-react';

const Calendar = ({ currentDate, onDateChange, mealPlan }) => {
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const formatDate = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  const getRecipeCount = (date) => {
    const dateStr = formatDate(date);
    const dayPlan = mealPlan[dateStr];
    if (!dayPlan) return 0;
    
    return Object.values(dayPlan).reduce((total, meals) => {
      return total + (Array.isArray(meals) ? meals.length : 0);
    }, 0);
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date) return false;
    return date.toDateString() === currentDate.toDateString();
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
            <CalendarDays className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <p className="text-gray-500 text-sm">Plan your perfect meals</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setMonth(newDate.getMonth() - 1);
              onDateChange(newDate);
            }}
            className="w-10 h-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
          >
            <span className="text-gray-600 font-bold">←</span>
          </button>
          <button
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setMonth(newDate.getMonth() + 1);
              onDateChange(newDate);
            }}
            className="w-10 h-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
          >
            <span className="text-gray-600 font-bold">→</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="p-3 text-center text-sm font-bold text-gray-600 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const recipeCount = day ? getRecipeCount(day) : 0;
          
          return (
            <div
              key={index}
              onClick={() => day && onDateChange(day)}
              className={`relative p-3 text-center rounded-xl cursor-pointer transition-all duration-200 ${
                !day
                  ? 'text-gray-300'
                  : isSelected(day)
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                  : isToday(day)
                  ? 'bg-gradient-to-br from-orange-400 to-pink-400 text-white shadow-md hover:shadow-lg'
                  : 'hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-200 hover:shadow-md'
              }`}
            >
              {day && (
                <>
                  <div className="font-semibold text-lg">{day.getDate()}</div>
                  {recipeCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-xs font-bold text-white">{recipeCount}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
