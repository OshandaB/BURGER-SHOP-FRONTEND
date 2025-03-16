import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, DollarSign, Users, ShoppingBag } from 'lucide-react';
import { Order } from '../../types';
import axiosInstance from '../../util/axiosInstance'
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { name: 'Total Orders', value: '0', icon: ShoppingBag, change: '+0%' },
    { name: 'Total Revenue', value: '$0', icon: DollarSign, change: '+0%' },
    { name: 'Active Products', value: '0', icon: Package, change: '+0' },
    { name: 'Total Customers', value: '0', icon: Users, change: '+0%' },
  ]);


  // const recentOrders = [
  //   { id: '1', customer: 'John Doe', total: '$45.99', status: 'Completed', date: '2024-03-15' },
  //   { id: '2', customer: 'Jane Smith', total: '$32.50', status: 'Processing', date: '2024-03-15' },
  //   { id: '3', customer: 'Mike Johnson', total: '$28.75', status: 'Pending', date: '2024-03-14' },
  // ];
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch stats for total orders, revenue, products, and customers
        const response = await axiosInstance.get('/dashboard/stats', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        setStats((prevStats) => [
          { ...prevStats[0], value: response.data.totalOrders },
          { ...prevStats[1], value: response.data.totalRevenue },
          { ...prevStats[2], value: response.data.activeProducts },
          { ...prevStats[3], value: response.data.uniqueCustomersCount },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };
    const fetchRecentOrders = async () => {
      try {
        const response = await axiosInstance.get('/orders/admin', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log(response.data)
        setRecentOrders(response.data); // Set recent orders data
      } catch (error) {
        console.error('Error fetching recent orders:', error);
      }
    };
    fetchStats();

    fetchRecentOrders();
  }, []);
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdating(true);
    try {
      await axiosInstance.put(`/orders/status`, { status: newStatus, orderId: orderId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      // Optimistically update UI
      setRecentOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, status: newStatus as Order["status"] }
            : order
        )
      );

      setSelectedOrder((prev: any) => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <Link
          to="/admin/products"
          className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
        >
          View Products
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
              {recentOrders.map((order: any) => (
                <tr key={order._id} className="border-b last:border-b-0 cursor-pointer hover:bg-gray-100"
                  onClick={() => setSelectedOrder(order)} >
                  <td className="py-4">#{order.id}</td>
                  <td className="py-4">{order.customerName}</td>
                  <td className="py-4">$ {order.total}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                      }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4">{new Date(order.createdAt).toISOString().split('T')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Order Details Modal */}
      {selectedOrder && (
        <AnimatePresence>
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-4 sm:p-6 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120 }}
            >
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 text-center">Order Details</h2>

              <div className="space-y-2 text-gray-700">
                <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                <p><strong>Customer:</strong> {selectedOrder.customerName}</p>
                <p><strong>Total:</strong> ${selectedOrder.total}</p>
                <p><strong>Status:</strong> {selectedOrder.status}</p>
                <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                <label className="block font-medium text-gray-700 mt-4">Update Status:</label>
                <select
                  className="w-full mt-2 p-2 border rounded-md"
                  value={selectedOrder.status}
                  onChange={(e) => updateOrderStatus(selectedOrder._id, e.target.value)}
                  disabled={updating}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <h3 className="mt-4 text-lg font-semibold text-gray-800">Items:</h3>
              <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedOrder.items.map((item: any) => (
                  <li key={item.productId} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-2 bg-gray-100 rounded-md">
                    <span className="text-gray-900 font-medium">{item.productName}</span>
                    <span className="text-gray-600">{item.quantity} x ${item.price}</span>
                  </li>
                ))}
              </ul>

              <button
                className="mt-6 w-full py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-all"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>

      )}
    </div>
  );
}