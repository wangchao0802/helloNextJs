import { createClient } from '@supabase/supabase-js'

// 这里需要替换为你的 Supabase 项目 URL 和公钥
// 你可以在 Supabase 控制台的 Settings -> API 中找到这些信息
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project-id.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// 数据库操作示例函数
export const todoOperations = {
  // 获取所有待办事项
  async getTodos() {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching todos:', error)
      return []
    }
    
    return data
  },

  // 添加新的待办事项
  async addTodo(title) {
    const { data, error } = await supabase
      .from('todos')
      .insert([
        { title, completed: false }
      ])
      .select()
    
    if (error) {
      console.error('Error adding todo:', error)
      return null
    }
    
    return data[0]
  },

  // 更新待办事项状态
  async updateTodo(id, updates) {
    const { data, error } = await supabase
      .from('todos')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) {
      console.error('Error updating todo:', error)
      return null
    }
    
    return data[0]
  },

  // 删除待办事项
  async deleteTodo(id) {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting todo:', error)
      return false
    }
    
    return true
  }
} 