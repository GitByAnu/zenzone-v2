import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Check, Flag, Calendar, Tag, Search } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { todosService } from '@/services/todos.service'
import { useAuth } from '@/hooks/useAuth'
import PageWrapper, { PageContainer, PageHeader } from '@/components/layout/PageWrapper'
import { Skeleton } from '@/components/ui/Skeleton'
import clsx from 'clsx'

const PRIORITIES = {
  low:    { label: 'Low',    color: 'var(--accent-teal)',     dot: '#5eead4' },
  medium: { label: 'Medium', color: 'var(--accent-amber)',    dot: '#f0b97a' },
  high:   { label: 'High',   color: '#fb7185',                dot: '#fb7185' },
}

const CATEGORIES = ['Work', 'Personal', 'Health', 'Learning', 'Creative', 'Other']

const FILTERS = ['All', 'Active', 'Completed']

export default function TodoList() {
  const { userId } = useAuth()
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  // Form state
  const [title, setTitle]       = useState('')
  const [priority, setPriority] = useState('medium')
  const [category, setCategory] = useState('')
  const [dueDate, setDueDate]   = useState('')
  const [adding, setAdding]     = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (!userId) return
    load()
  }, [userId])

  async function load() {
    setLoading(true)
    const { data, error } = await todosService.getAll(userId)
    if (!error) setTodos(data ?? [])
    setLoading(false)
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!title.trim()) return
    setAdding(true)
    const { data, error } = await todosService.create(userId, {
      title: title.trim(),
      priority,
      category: category || null,
      due_date: dueDate || null,
    })
    if (error) {
      toast.error('Could not add task.')
    } else {
      setTodos((prev) => [data, ...prev])
      setTitle('')
      setDueDate('')
      setCategory('')
      setPriority('medium')
      setShowForm(false)
      toast.success('Task added 🎯')
    }
    setAdding(false)
  }

  async function handleToggle(id, completed) {
    // Optimistic update
    setTodos((prev) => prev.map((t) => t.id === id ? { ...t, completed: !completed } : t))
    const { error } = await todosService.toggle(id, !completed)
    if (error) {
      // Revert
      setTodos((prev) => prev.map((t) => t.id === id ? { ...t, completed } : t))
      toast.error('Could not update task.')
    }
  }

  async function handleDelete(id) {
    setTodos((prev) => prev.filter((t) => t.id !== id))
    const { error } = await todosService.delete(id)
    if (error) {
      toast.error('Could not delete task.')
      load()
    }
  }

  const filtered = todos.filter((t) => {
    const matchFilter =
      filter === 'All' ? true :
      filter === 'Active' ? !t.completed :
      t.completed
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const stats = {
    total: todos.length,
    done:  todos.filter((t) => t.completed).length,
  }
  const pct = stats.total ? Math.round((stats.done / stats.total) * 100) : 0

  return (
    <PageWrapper>
      <PageContainer className="max-w-2xl mx-auto">
        <PageHeader
          title="To-Do List"
          subtitle="Calm, organized, achievable"
          action={
            <button onClick={() => setShowForm((s) => !s)} className="btn-primary">
              <Plus size={16} />
              Add Task
            </button>
          }
        />

        {/* Progress bar */}
        {stats.total > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card mb-6"
          >
            <div className="flex justify-between text-sm mb-2">
              <span style={{ color: 'var(--text-secondary)' }}>
                {stats.done} of {stats.total} tasks complete
              </span>
              <span style={{ color: 'var(--accent-blue)' }} className="font-medium">
                {pct}%
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-glass)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-lavender))' }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )}

        {/* Add task form */}
        <AnimatePresence>
          {showForm && (
            <motion.form
              onSubmit={handleAdd}
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="glass-card overflow-hidden"
            >
              <p className="section-title mb-4">New Task</p>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="input-zen mb-3"
                autoFocus
              />

              <div className="grid grid-cols-3 gap-3 mb-3">
                {/* Priority */}
                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="input-zen text-sm"
                  >
                    {Object.entries(PRIORITIES).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="input-zen text-sm"
                  >
                    <option value="">None</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Due date */}
                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Due date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="input-zen text-sm"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button type="submit" disabled={adding || !title.trim()} className="btn-primary flex-1 justify-center">
                  {adding ? 'Adding...' : 'Add Task'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">
                  Cancel
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Filter + search bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="input-zen pl-9"
            />
          </div>
          <div className="flex gap-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={clsx(
                  'px-4 py-2 rounded-xl text-sm transition-all duration-200',
                  filter === f ? 'font-medium' : ''
                )}
                style={{
                  background: filter === f ? 'rgba(124,158,245,0.15)' : 'var(--bg-glass)',
                  color: filter === f ? 'var(--accent-blue)' : 'var(--text-secondary)',
                  border: `1px solid ${filter === f ? 'rgba(124,158,245,0.3)' : 'var(--border-glass)'}`,
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Task list */}
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map((i) => <Skeleton key={i} className="h-16" />)}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-4xl mb-3">✨</div>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              {search ? 'No tasks match your search.' : filter === 'Completed' ? 'No completed tasks yet.' : 'All clear! Add your first task above.'}
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="space-y-2">
              {filtered.map((todo) => {
                const p = PRIORITIES[todo.priority] ?? PRIORITIES.medium
                const isOverdue = todo.due_date && new Date(todo.due_date) < new Date() && !todo.completed
                return (
                  <motion.div
                    key={todo.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                    className="glass-sm flex items-start gap-3 p-4 group"
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => handleToggle(todo.id, todo.completed)}
                      className="mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200"
                      style={{
                        borderColor: todo.completed ? 'var(--accent-teal)' : p.dot,
                        background: todo.completed ? 'rgba(94,234,212,0.2)' : 'transparent',
                      }}
                      aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
                    >
                      {todo.completed && <Check size={11} style={{ color: 'var(--accent-teal)' }} />}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium leading-snug"
                        style={{
                          color: todo.completed ? 'var(--text-tertiary)' : 'var(--text-primary)',
                          textDecoration: todo.completed ? 'line-through' : 'none',
                        }}
                      >
                        {todo.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span
                          className="text-xs font-medium"
                          style={{ color: p.color }}
                        >
                          <Flag size={10} className="inline mr-0.5" />
                          {p.label}
                        </span>
                        {todo.category && (
                          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                            <Tag size={10} className="inline mr-0.5" />
                            {todo.category}
                          </span>
                        )}
                        {todo.due_date && (
                          <span
                            className="text-xs"
                            style={{ color: isOverdue ? '#fb7185' : 'var(--text-tertiary)' }}
                          >
                            <Calendar size={10} className="inline mr-0.5" />
                            {isOverdue ? 'Overdue · ' : ''}{format(new Date(todo.due_date), 'MMM d')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg"
                      style={{ color: 'var(--text-tertiary)' }}
                      aria-label="Delete task"
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                )
              })}
            </div>
          </AnimatePresence>
        )}
      </PageContainer>
    </PageWrapper>
  )
}
