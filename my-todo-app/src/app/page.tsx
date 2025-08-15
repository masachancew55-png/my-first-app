'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

interface Todo {
  id: string
  title: string
  description: string
  completed: boolean
  created_at: string
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching todos:', error)
        // Use mock data if Supabase is not available
        setTodos([
          {
            id: '1',
            title: 'Sample Todo',
            description: 'This is a sample todo item',
            completed: false,
            created_at: new Date().toISOString()
          }
        ])
      } else {
        setTodos(data || [])
      }
    } catch (err) {
      console.error('Error:', err)
      // Use mock data as fallback
      setTodos([
        {
          id: '1',
          title: 'Sample Todo',
          description: 'This is a sample todo item',
          completed: false,
          created_at: new Date().toISOString()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const newTodo = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      completed: false,
      created_at: new Date().toISOString()
    }

    try {
      const { error } = await supabase
        .from('todos')
        .insert([newTodo])

      if (error) {
        console.error('Error adding todo:', error)
        // Add to local state if Supabase fails
        setTodos([newTodo, ...todos])
      } else {
        fetchTodos()
      }
    } catch (err) {
      console.error('Error:', err)
      // Add to local state as fallback
      setTodos([newTodo, ...todos])
    }

    setTitle('')
    setDescription('')
  }

  const toggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return

    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', id)

      if (error) {
        console.error('Error updating todo:', error)
      }
      
      // Update local state regardless
      setTodos(todos.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      ))
    } catch (err) {
      console.error('Error:', err)
      // Update local state as fallback
      setTodos(todos.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      ))
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting todo:', error)
      }
      
      // Update local state regardless
      setTodos(todos.filter(t => t.id !== id))
    } catch (err) {
      console.error('Error:', err)
      // Update local state as fallback
      setTodos(todos.filter(t => t.id !== id))
    }
  }

  if (loading) {
    return (
      <div className="container">
        <h1>My Todo App</h1>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>My Todo App</h1>
      
      <form onSubmit={addTodo} className="todo-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter todo title..."
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter todo description..."
            rows={3}
          />
        </div>
        
        <button type="submit" className="btn">Add Todo</button>
      </form>

      <div className="todo-list">
        {todos.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            No todos yet. Add your first todo above!
          </div>
        ) : (
          todos.map((todo) => (
            <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <div className="todo-content">
                <h3>{todo.title}</h3>
                {todo.description && <p>{todo.description}</p>}
              </div>
              <div className="todo-actions">
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`btn btn-small ${todo.completed ? 'btn-success' : ''}`}
                >
                  {todo.completed ? 'Undo' : 'Complete'}
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="btn btn-small btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}