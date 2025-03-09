import React from 'react';
import { Link } from 'react-router-dom';
import { Package, DollarSign, Users, ShoppingBag } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { name: 'Total Orders', value: '156', icon: ShoppingBag, change: '+12%' },
    { name: 'Total Revenue', value: '$4,320', icon: DollarSign, change: '+8%' },
    { name: 'Active Products', value: '24', icon: Package, change: '+2' },
    { name: 'Total Customers', value: '289', icon: Users, change: '+15%' },
  ];

  const recentOrders = [
    { id: '1', customer: 'John Doe', total: '$45.99', status: 'Completed', date: '2024-03-15' },
    { id: '2', customer: 'Jane Smith', total: '$32.50', status: 'Processing', date: '2024-03-15' },
    { id: '3', customer: 'Mike Johnson', total: '$28.75', status: 'Pending', date: '2024-03-14' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <Link
          to="/admin/products/add"
          className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
        >
          Add New Product
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="h-8 w-8 text-orange-600" />
              <span className="text-sm text-green-600">{stat.change}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-500">{stat.name}</h3>
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-4 font-medium text-gray-500">Order ID</th>
                <th className="pb-4 font-medium text-gray-500">Customer</th>
                <th className="pb-4 font-medium text-gray-500">Total</th>
                <th className="pb-4 font-medium text-gray-500">Status</th>
                <th className="pb-4 font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b last:border-b-0">
                  <td className="py-4">#{order.id}</td>
                  <td className="py-4">{order.customer}</td>
                  <td className="py-4">{order.total}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}