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
              <div key={script.id} className="script-item">
                <div className="script-title">{script.title}</div>
                {script.situation && (
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    {script.situation}
                  </div>
                )}
                <div className="script-content">{script.content}</div>
                {script.note && (
                  <div style={{ fontSize: '12px', fontStyle: 'italic' }}>
                    💡 {script.note}
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
