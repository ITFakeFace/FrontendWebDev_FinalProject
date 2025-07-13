import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Paginator } from 'primereact/paginator';
import { Rating } from 'primereact/rating';
import recipies from '../../services/datas/recipies.json';


const RecentActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(3);

 useEffect(() => {
  const mockUsers = JSON.parse(localStorage.getItem('mockUsers')) || [];

  const userMap = mockUsers.reduce((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {});

  const activityList = [];

  recipies.forEach((recipe) => {
    recipe.comments?.forEach((comment) => {
      const user = userMap[comment.userId] || {};

      activityList.push({
        id: `recipe-${recipe.id}-comment-${comment.id}`,
        type: 'review',
        target: recipe.name,
        rating: recipe.ratings?.find(r => r.userId === comment.userId)?.rating || 0,
        helpful: Math.floor(Math.random() * 10),
        tags: recipe.categories || [],
        user: {
          name: user.displayName || `User ${comment.userId}`,
          avatar: user.avatar || `https://i.pravatar.cc/150?img=${comment.userId}`
        },
        date: new Date(comment.timestamp).toLocaleDateString(),
      });
    });
  });

  setActivities(activityList);
}, []);

  const onPageChange = (e) => {
    setFirst(e.first);
    setRows(e.rows);
  };

  return (
    <div className="flex flex-col gap-5">
      {activities.slice(first, first + rows).map((activity) => (
        <Card
          key={activity.id}
          className="shadow-md p-5 rounded-lg border border-gray-200 transition-all hover:shadow-lg"
        >
          <div className="flex items-start gap-4">
            <img
              src={activity.user.avatar}
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover border border-gray-300"
            />

            <div className="flex-1">
              {activity.type === 'review' ? (
                <>
                  <p className="mb-1">
                    <strong>{activity.user.name}</strong> reviewed{' '}
                    <span className="text-blue-700 font-medium">{activity.target}</span>.
                  </p>
                  <Rating value={activity.rating} readOnly cancel={false} />

                  <div className="flex gap-2 mt-2 flex-wrap">
                    {activity.tags && activity.tags.length > 0 ? (
                      activity.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-yellow-100 text-yellow-800 px-2 py-1 text-xs rounded-full"
                        >
                          ✅ {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm italic text-gray-400">No tags</span>
                    )}
                  </div>

                  <p className="mt-3 text-sm text-gray-600">
                    <i className="pi pi-thumbs-up mr-1 text-blue-600"></i>
                    Helpful ({activity.helpful})
                  </p>
                </>
              ) : (
                <p className="text-sm">
                  <span className="text-blue-700 font-semibold">{activity.user.name}</span> marked{' '}
                  <span className="font-semibold">{activity.target}</span> review helpful.
                </p>
              )}
            </div>

            <div className="text-xs text-gray-400 whitespace-nowrap">{activity.date}</div>
          </div>
        </Card>
      ))}

      <Paginator
        first={first}
        rows={rows}
        totalRecords={activities.length}
        rowsPerPageOptions={[2, 3, 4]}
        onPageChange={onPageChange}
        className="mt-4"
      />
    </div>
  );
};

export default RecentActivityList;
