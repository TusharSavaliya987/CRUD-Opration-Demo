import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, UserCheck, UserX } from 'lucide-react';
import { AppDispatch, RootState } from '@/store';
import { fetchUsers } from '@/store/slices/usersSlice';

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { users } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Stats
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status).length;
  const inactiveUsers = totalUsers - activeUsers;
  const adminUsers = users.filter(user => user.role === 'Admin').length;

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: <Users className="h-8 w-8 text-blue-500" />,
      color: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Active Users',
      value: activeUsers,
      icon: <UserCheck className="h-8 w-8 text-green-500" />,
      color: 'bg-green-50 dark:bg-green-950',
    },
    {
      title: 'Inactive Users',
      value: inactiveUsers,
      icon: <UserX className="h-8 w-8 text-red-500" />,
      color: 'bg-red-50 dark:bg-red-950',
    },
    {
      title: 'Admin Users',
      value: adminUsers,
      icon: <UserPlus className="h-8 w-8 text-purple-500" />,
      color: 'bg-purple-50 dark:bg-purple-950',
    },
  ];

  return (
    <div className="container py-8">


      {isAuthenticated ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg shadow-sm border ${stat.color}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground">{stat.title}</p>
                  <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
                </div>
                <div className="p-3 rounded-full bg-background">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Welcome to the CRUD Operation System</h2>
          <p className="text-muted-foreground mb-6">
            Please login to access the dashboard and manage users.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;