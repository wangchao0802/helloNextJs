'use client'

import { useState, useEffect } from 'react'
import { todoOperations } from '../../lib/supabase'

export default function SupabaseDemo() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 加载待办事项
  const loadTodos = async () => {
    try {
      setLoading(true)
      const data = await todoOperations.getTodos()
      setTodos(data)
      setError(null)
    } catch (err) {
      setError('加载待办事项失败')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // 添加新待办事项
  const handleAddTodo = async (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    try {
      const todo = await todoOperations.addTodo(newTodo.trim())
      if (todo) {
        setTodos([todo, ...todos])
        setNewTodo('')
      }
    } catch (err) {
      setError('添加待办事项失败')
      console.error(err)
    }
  }

  // 切换完成状态
  const toggleTodo = async (id, completed) => {
    try {
      const updatedTodo = await todoOperations.updateTodo(id, { completed: !completed })
      if (updatedTodo) {
        setTodos(todos.map(todo => 
          todo.id === id ? { ...todo, completed: !completed } : todo
        ))
      }
    } catch (err) {
      setError('更新待办事项失败')
      console.error(err)
    }
  }

  // 删除待办事项
  const deleteTodo = async (id) => {
    try {
      const success = await todoOperations.deleteTodo(id)
      if (success) {
        setTodos(todos.filter(todo => todo.id !== id))
      }
    } catch (err) {
      setError('删除待办事项失败')
      console.error(err)
    }
  }

  // 组件加载时获取数据
  useEffect(() => {
    loadTodos()
  }, [])

  const containerStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif'
  }

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '2rem',
    color: '#333'
  }

  const formStyle = {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem'
  }

  const inputStyle = {
    flex: 1,
    padding: '0.75rem',
    border: '2px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem'
  }

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem'
  }

  const todoItemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem',
    marginBottom: '0.5rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
    border: '1px solid #eee'
  }

  const checkboxStyle = {
    marginRight: '1rem',
    transform: 'scale(1.2)'
  }

  const todoTextStyle = (completed) => ({
    flex: 1,
    textDecoration: completed ? 'line-through' : 'none',
    color: completed ? '#999' : '#333'
  })

  const deleteButtonStyle = {
    backgroundColor: '#ff4444',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer'
  }

  const errorStyle = {
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: '#ffeeee',
    borderRadius: '4px'
  }

  const setupInstructionsStyle = {
    backgroundColor: '#fff3cd',
    border: '1px solid #ffeaa7',
    borderRadius: '4px',
    padding: '1rem',
    marginBottom: '2rem'
  }

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>📝 Supabase TODO Demo</h1>
      
      {/* 设置说明 */}
      <div style={setupInstructionsStyle}>
        <h3>🚀 快速开始：</h3>
        <ol>
          <li>在 <a href="https://supabase.com" target="_blank">Supabase</a> 创建一个新项目</li>
          <li>在 SQL 编辑器中创建 todos 表：</li>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '4px', fontSize: '0.9rem' }}>
{`CREATE TABLE todos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`}
          </pre>
          <li>创建 <code>.env.local</code> 文件，添加你的 Supabase 配置：</li>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '4px', fontSize: '0.9rem' }}>
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`}
          </pre>
          <li>重启开发服务器即可开始使用！</li>
        </ol>
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      {/* 添加待办事项表单 */}
      <form onSubmit={handleAddTodo} style={formStyle}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="输入新的待办事项..."
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>
          添加
        </button>
      </form>

      {/* 待办事项列表 */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          加载中...
        </div>
      ) : todos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          还没有待办事项，添加一个吧！
        </div>
      ) : (
        <div>
          {todos.map((todo) => (
            <div key={todo.id} style={todoItemStyle}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id, todo.completed)}
                style={checkboxStyle}
              />
              <span style={todoTextStyle(todo.completed)}>
                {todo.title}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                style={deleteButtonStyle}
              >
                删除
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 统计信息 */}
      <div style={{ textAlign: 'center', marginTop: '2rem', color: '#666' }}>
        总共 {todos.length} 个待办事项，
        已完成 {todos.filter(todo => todo.completed).length} 个
      </div>

      {/* 功能说明 */}
      <div style={{ marginTop: '3rem', padding: '1rem', backgroundColor: '#f0f8ff', borderRadius: '4px' }}>
        <h3>🎯 Demo 功能特色：</h3>
        <ul>
          <li>✅ <strong>创建</strong>：添加新的待办事项</li>
          <li>📖 <strong>读取</strong>：显示所有待办事项</li>
          <li>✏️ <strong>更新</strong>：标记完成/未完成状态</li>
          <li>🗑️ <strong>删除</strong>：移除待办事项</li>
          <li>🔄 <strong>实时</strong>：可以扩展为实时同步</li>
        </ul>
      </div>

      {/* 返回首页链接 */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <a href="/" style={{ 
          color: '#0070f3', 
          textDecoration: 'none',
          padding: '0.5rem 1rem',
          border: '1px solid #0070f3',
          borderRadius: '4px'
        }}>
          ← 返回首页
        </a>
      </div>
    </div>
  )
} 