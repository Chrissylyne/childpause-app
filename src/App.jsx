import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

function App() {
  const [categories, setCategories] = useState([])
  const [scripts, setScripts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('categories').select('*')
      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
    setLoading(false)
  }

  const fetchScripts = async (categoryId) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('scripts')
        .select('*')
        .eq('category_id', categoryId)
      if (error) throw error
      setScripts(data || [])
      setSelectedCategory(categoryId)
    } catch (error) {
      console.error('Error fetching scripts:', error)
    }
    setLoading(false)
  }

  return (
    <main>
      <h1>ChildPause</h1>
      <p>Parenting scripts for every moment</p>

      <h2>Categories</h2>
      <div className="categories">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="category-card"
            onClick={() => fetchScripts(cat.id)}
          >
            <h3>{cat.name}</h3>
            <p>{cat.language.toUpperCase()}</p>
          </div>
        ))}
      </div>

      {selectedCategory && (
        <div className="scripts">
          <h2>Scripts</h2>
          {loading ? (
            <p>Loading...</p>
          ) : scripts.length > 0 ? (
            scripts.map((script) => (
              <div 
                key={script.id} 
                className={`script-item ${script.premium ? 'premium-locked' : ''}`}
              >
                <div className="script-title">
                  {script.title}
                  {script.premium && <span className="premium-badge">🔒 Premium</span>}
                </div>
                {script.situation && (
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    {script.situation}
                  </div>
                )}
                {!script.premium ? (
                  <>
                    <div className="script-content">{script.content}</div>
                    {script.note && (
                      <div style={{ fontSize: '12px', fontStyle: 'italic' }}>
                        💡 {script.note}
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center', background: '#f0f0f0', borderRadius: '4px' }}>
                    <p style={{ marginBottom: '10px' }}>This script is available for premium members</p>
                    <button style={{ padding: '10px 20px', background: '#9c27b0', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                      Subscribe Now
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No scripts found</p>
          )}
        </div>
      )}
    </main>
  )
}

export default App
