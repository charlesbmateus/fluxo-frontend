export const useApi = () => {
  const config = useRuntimeConfig()
  
  // For demo purposes, we'll use mock data
  // In production, replace this with actual API endpoint
  const baseURL = config.public.apiBase || 'https://api.example.com'

  const fetchServices = async () => {
    // Mock data for services
    return {
      data: [
        {
          id: 1,
          name: 'Web Development',
          description: 'Professional web development services',
          provider: 'John Doe',
          price: 500,
          rating: 4.8,
          category: 'Development',
          image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400'
        },
        {
          id: 2,
          name: 'Graphic Design',
          description: 'Creative graphic design solutions',
          provider: 'Jane Smith',
          price: 300,
          rating: 4.9,
          category: 'Design',
          image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400'
        },
        {
          id: 3,
          name: 'Content Writing',
          description: 'High-quality content writing',
          provider: 'Mike Johnson',
          price: 200,
          rating: 4.7,
          category: 'Writing',
          image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400'
        },
        {
          id: 4,
          name: 'Digital Marketing',
          description: 'Comprehensive digital marketing strategies',
          provider: 'Sarah Williams',
          price: 700,
          rating: 4.9,
          category: 'Marketing',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400'
        },
        {
          id: 5,
          name: 'Video Editing',
          description: 'Professional video editing services',
          provider: 'Tom Brown',
          price: 400,
          rating: 4.6,
          category: 'Video',
          image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400'
        },
        {
          id: 6,
          name: 'SEO Optimization',
          description: 'Boost your search engine rankings',
          provider: 'Emma Davis',
          price: 600,
          rating: 4.8,
          category: 'Marketing',
          image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=400'
        }
      ]
    }
  }

  const fetchFinancialData = async () => {
    // Mock financial data
    return {
      revenue: {
        current: 45231,
        change: 12.5
      },
      orders: {
        current: 1234,
        change: 8.2
      },
      services: {
        current: 42,
        change: 5.1
      },
      chartData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Revenue',
            data: [12000, 19000, 15000, 25000, 32000, 45231],
            borderColor: '#8B5CF6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            tension: 0.4
          }
        ]
      }
    }
  }

  const fetchMessages = async () => {
    // Mock messages
    return {
      data: [
        {
          id: 1,
          sender: 'John Doe',
          message: 'Hello! I\'m interested in your service.',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: false
        },
        {
          id: 2,
          sender: 'Jane Smith',
          message: 'Thanks for the quick response!',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          read: true
        }
      ]
    }
  }

  return {
    fetchServices,
    fetchFinancialData,
    fetchMessages
  }
}
