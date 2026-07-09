import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient.js';

function HomePage() {
  const [categories, setCategories] = useState([]);
  const [scripts, setScripts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('categories').select('*');
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
    setLoading(false);
  };

  const fetchScripts = async (categoryId) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('scripts')
        .select('*')
        .eq('category_id', categoryId);
      if (error) throw error;
      setScripts(data || []);
      setSelectedCategory(categoryId);
    } catch (error) {
      console.error('Error fetching scripts:', error);
    }
    setLoading(false);
  };

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>ChildPause</h1>
      <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>Parenting scripts for every moment</p>

      <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Categories</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
        {categories.map((cat) => (
          <div
            key={cat.id}
            style={{
              padding: '1.5rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              backgroundColor: selectedCategory === cat.id ? '#f0f0f0' : '#fff'
            }}
            onClick={() => fetchScripts(cat.id)}
            onMouseEnter={(e) => e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}
            onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
          >
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{cat.name}</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#999' }}>{cat.language.toUpperCase()}</p>
          </div>
        ))}
      </div>

      {selectedCategory && (
        <div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Scripts</h2>
          {loading ? (
            <p>Loading...</p>
          ) : scripts.length > 0 ? (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {scripts.map((script) => (
                <div
                  key={script.id}
                  style={{
                    padding: '1.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    backgroundColor: script.premium ? '#f9f9f9' : '#fff'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0 }}>{script.title}</h3>
                    {script.premium && <span style={{ padding: '0.25rem 0.5rem', backgroundColor: '#purple', color: 'white', borderRadius: '4px', fontSize: '0.8rem' }}>🔒 Premium</span>}
                  </div>
                  
                  {script.situation && (
                    <div style={{ fontSize: '0.9rem', color: '#999', marginBottom: '0.5rem' }}>
                      {script.situation}
                    </div>
                  )}

                  {!script.premium ? (
                    <>
                      <div style={{ fontSize: '1rem', lineHeight: '1.6', marginBottom: '0.5rem' }}>
                        {script.content}
                      </div>
                      {script.note && (
                        <div style={{ fontSize: '0.9rem', fontStyle: 'italic', color: '#666' }}>
                          💡 {script.note}
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ padding: '1rem', textAlign: 'center', backgroundColor: '#f0f0f0', borderRadius: '4px', marginTop: '1rem' }}>
                      <p style={{ margin: '0 0 0.5rem 0' }}>This script is available for premium members</p>
                      <button style={{ padding: '0.5rem 1rem', backgroundColor: '#9c27b0', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Subscribe Now
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No scripts found</p>
          )}
        </div>
      )}
    </main>
  );
}

export default HomePage;
