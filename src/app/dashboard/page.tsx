"use client";

import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '@/lib/supabase';
import BudgetSettingsForm from '@/components/BudgetSettingsForm';
import BidManagementForm from '@/components/BidManagementForm';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [credentials, setCredentials] = useState(null);
  const [activeTab, setActiveTab] = useState('bids');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const { data, error } = await getCurrentUser();
        
        if (error) {
          throw new Error('Ошибка при получении данных пользователя');
        }
        
        if (data?.user) {
          setUser(data.user);
          
          // В реальном приложении здесь будет запрос к API для получения учетных данных Ozon
          // Для демонстрации используем моковые данные
          setCredentials({
            clientId: 'demo_client_id',
            apiKey: 'demo_api_key'
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
          <p className="mt-2">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg max-w-md">
          <h2 className="text-xl font-bold mb-2">Ошибка</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg max-w-md">
          <h2 className="text-xl font-bold mb-2">Требуется авторизация</h2>
          <p>Пожалуйста, войдите в систему для доступа к панели управления.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Панель управления OZOBID</h1>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('bids')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'bids'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Управление ставками
            </button>
            <button
              onClick={() => setActiveTab('budget')}
              className={`ml-8 py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'budget'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Настройки бюджета
            </button>
          </nav>
        </div>
      </div>
      
      <div className="mt-6">
        {activeTab === 'bids' && (
          <BidManagementForm userId={user.id} credentials={credentials} />
        )}
        
        {activeTab === 'budget' && (
          <BudgetSettingsForm userId={user.id} credentials={credentials} />
        )}
      </div>
    </div>
  );
}
